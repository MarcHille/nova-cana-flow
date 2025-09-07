
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { email } = requestData

    if (!email) {
      throw new Error('Email is required')
    }

    console.log(`Making user with email ${email} an admin...`)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    // First, find the user by email
    const { data: usersData, error: usersError } = await supabaseClient.auth.admin.listUsers()

    if (usersError) {
      console.error("Error fetching users:", usersError)
      throw usersError
    }

    if (!usersData || !usersData.users || usersData.users.length === 0) {
      throw new Error('No users found')
    }

    const user = usersData.users.find(u => u.email === email)

    if (!user) {
      throw new Error(`User with email ${email} not found`)
    }

    console.log(`Found user with ID ${user.id}`)

    // Assign admin role using the assign_role_to_user function
    const { data, error } = await supabaseClient.rpc('assign_role_to_user', {
      _user_id: user.id,
      _role: 'admin'
    })

    if (error) {
      console.error("Error assigning admin role:", error)
      throw error
    }

    console.log(`Successfully made user ${email} (${user.id}) an admin`)

    return new Response(
      JSON.stringify({ 
        success: true,
        userId: user.id,
        email
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in make-user-admin function:", error.message)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
