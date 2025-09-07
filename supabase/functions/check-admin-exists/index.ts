
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Checking if admin users exist...")
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    // Check if any admin roles exist in the user_roles table
    const { count, error } = await supabaseClient
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    if (error) {
      console.error("Error checking for admin users:", error)
      throw error
    }

    const adminExists = (count !== null && count > 0)
    console.log(`Admin users exist: ${adminExists} (count: ${count})`)

    return new Response(
      JSON.stringify({ adminExists }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in check-admin-exists function:", error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
