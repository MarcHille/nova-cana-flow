
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const requestData = await req.json()
    const { userIds } = requestData

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new Error('User IDs array is required')
    }

    console.log(`Getting details for ${userIds.length} users...`)
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    // Get all users
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

    if (usersError) {
      console.error("Error fetching users:", usersError)
      throw usersError
    }

    if (!usersData || !usersData.users) {
      return new Response(
        JSON.stringify({ users: [] }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Filter and map users to just return id, email
    const filteredUsers = usersData.users
      .filter(user => userIds.includes(user.id))
      .map(user => ({
        id: user.id,
        email: user.email
      }))

    console.log(`Returning details for ${filteredUsers.length} users`)

    return new Response(
      JSON.stringify({ users: filteredUsers }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in get-users-by-id function:", error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
