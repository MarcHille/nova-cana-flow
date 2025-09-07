
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Starting get-pharmacy-verifications function");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the session JWT from the Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client with service role to bypass RLS completely
    // This avoids the infinite recursion issue with user_roles policy
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get pharmacy verifications directly to avoid RLS issues
    const { data: verifications, error } = await supabaseClient
      .from('pharmacy_verification')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    // Get emails for users using direct query to bypass RLS
    if (verifications && verifications.length > 0) {
      const userIds = verifications.map(v => v.user_id);
      
      // Call the edge function to get user emails
      const { data: usersResponse, error: userFetchError } = await supabaseClient.functions.invoke(
        'get-users-by-id',
        {
          body: { userIds },
          headers: { Authorization: authHeader }
        }
      );
      
      if (userFetchError) {
        console.error('Error fetching user emails:', userFetchError);
        // Continue without emails if there's an error
      } else if (usersResponse?.users) {
        // Map user emails to verifications
        const userMap = new Map(usersResponse.users.map(user => [user.id, user.email]));
        
        for (const verification of verifications) {
          verification.user_email = userMap.get(verification.user_id) || null;
        }
      }
    }
    
    console.log(`Found ${verifications.length} verification requests`);
    
    return new Response(
      JSON.stringify({ verifications }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
