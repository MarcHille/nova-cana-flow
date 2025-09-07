
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { userId } = requestData

    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log("Checking admin status for user ID:", userId)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    // Use the secure function to check admin status with retry logic
    let attempt = 1;
    const maxAttempts = 3; // Increased max attempts
    let lastError = null;
    
    while (attempt <= maxAttempts) {
      try {
        console.log(`Attempt ${attempt} to check admin status for ${userId}`);
        
        // Try the has_role RPC function first (most reliable)
        try {
          const { data: rpcData, error: rpcError } = await supabaseClient.rpc('has_role', {
            _user_id: userId,
            _role: 'admin'
          })

          if (!rpcError) {
            const isAdmin = !!rpcData;
            console.log("User", userId, "admin status from RPC:", isAdmin);

            // Also verify directly from the user_roles table as a double-check
            const { data: roleData, error: roleError } = await supabaseClient
              .from('user_roles')
              .select('role')
              .eq('user_id', userId)
              .eq('role', 'admin')
              .maybeSingle();
              
            if (!roleError) {
              const directDbAdmin = !!roleData;
              console.log("Direct DB admin status:", directDbAdmin);
              
              // If there's a mismatch, log it but use the direct DB result
              if (isAdmin !== directDbAdmin) {
                console.warn("Mismatch between RPC and direct DB check! Using direct DB result.");
                return new Response(
                  JSON.stringify({ 
                    isAdmin: directDbAdmin,
                    userId,
                    source: "direct_db_check",
                    attempt,
                    mismatch: true
                  }),
                  {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                  }
                )
              }
              
              // Both checks agree, return the result
              return new Response(
                JSON.stringify({ 
                  isAdmin,
                  userId,
                  source: "double_check",
                  attempt
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                  status: 200,
                }
              )
            }
          }
          
          // If we reach here, there was an error with the RPC call
          // Fall through to direct check
        } catch (rpcErr) {
          console.warn("RPC error, falling back to direct check:", rpcErr);
        }
        
        // Direct DB check as fallback
        const { data: directData, error: directError } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle();
          
        if (directError) {
          throw directError;
        }
        
        const isAdmin = !!directData;
        console.log("User", userId, "admin status from direct check:", isAdmin);

        return new Response(
          JSON.stringify({ 
            isAdmin,
            userId,
            source: "direct_db",
            attempt
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      } catch (err) {
        lastError = err;
        attempt++;
        
        // Add a small delay before retrying - exponential backoff
        if (attempt <= maxAttempts) {
          const delay = Math.pow(2, attempt - 1) * 100; // 100ms, 200ms, 400ms
          console.log(`Error on attempt ${attempt-1}, retrying after ${delay}ms:`, err);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If we've reached here, all attempts failed
    console.error(`Failed to check admin status after ${maxAttempts} attempts:`, lastError);
    throw new Error(`Failed to check admin status after ${maxAttempts} attempts: ${lastError?.message || 'Unknown error'}`)
  } catch (error) {
    console.error("Error in check-is-admin function:", error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
