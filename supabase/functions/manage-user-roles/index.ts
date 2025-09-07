
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check for authentication header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )
    
    // Verify the user making the request is authenticated
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      console.error("Authentication error:", userError?.message)
      throw new Error('Authentication failed')
    }
    
    // Verify the user is an admin
    const { data: isAdmin, error: adminCheckError } = await supabaseAdmin.rpc(
      'has_role',
      { _user_id: user.id, _role: 'admin' }
    )
    
    if (adminCheckError) {
      console.error("Error checking admin status:", adminCheckError)
      throw new Error('Failed to verify admin permissions')
    }
    
    if (!isAdmin) {
      console.error("User is not an admin:", user.id)
      throw new Error('Insufficient permissions: Admin rights required')
    }

    // Get request data
    const requestData = await req.json()
    const { userId, role, action } = requestData

    // Validate inputs
    if (!userId || !role || !action) {
      throw new Error('User ID, role, and action are required')
    }

    if (!['admin', 'doctor', 'pharmacist'].includes(role)) {
      throw new Error('Invalid role. Must be admin, doctor, or pharmacist')
    }

    if (!['add', 'remove'].includes(action)) {
      throw new Error('Invalid action. Must be add or remove')
    }

    console.log(`${action === 'add' ? 'Adding' : 'Removing'} ${role} role for user ${userId}`)
    
    // Check if the user exists
    const { data: userData, error: userError2 } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (userError2 || !userData || !userData.user) {
      console.error("User not found:", userError2)
      throw new Error(`User not found: ${userError2?.message || 'Unknown error'}`)
    }

    let result
    let message

    if (action === 'add') {
      // Use the assign_role_to_user function to assign the role
      const { data, error } = await supabaseAdmin.rpc('assign_role_to_user', {
        _user_id: userId,
        _role: role
      })

      if (error) {
        console.error("Error assigning role:", error)
        throw error
      }

      result = data
      message = `Role ${role} added successfully to user ${userId}`
    } else {
      // Remove role directly from the user_roles table
      const { error } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role)

      if (error) {
        console.error("Error removing role:", error)
        throw error
      }

      result = true
      message = `Role ${role} removed successfully from user ${userId}`
    }

    console.log(message)

    return new Response(
      JSON.stringify({ 
        success: true,
        message,
        userId,
        role,
        action
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in manage-user-roles function:", error.message)
    
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
