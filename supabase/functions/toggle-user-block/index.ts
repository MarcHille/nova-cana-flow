
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // CORS preflight handler
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validate auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    // Set up Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Verify the user making the request is an admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      console.error('Authentication error:', authError)
      throw new Error('Unauthorized')
    }

    // Verify admin role
    const { data: roles, error: rolesError } = await supabaseAdmin
      .rpc('get_user_roles', { _user_id: user.id })

    if (rolesError) {
      console.error('Error fetching roles:', rolesError)
      throw new Error('Error verifying admin permissions')
    }

    if (!roles.includes('admin')) {
      throw new Error('Unauthorized: Admin role required')
    }

    // Parse request body
    const { userId, blocked } = await req.json()

    if (!userId || typeof userId !== 'string' || typeof blocked !== 'boolean') {
      throw new Error('Invalid request parameters')
    }

    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      throw new Error('Invalid user ID format')
    }

    // Update user banned status
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { banned: blocked }
    )

    if (updateError) {
      console.error('Error updating user:', updateError)
      throw new Error(`Failed to ${blocked ? 'block' : 'unblock'} user: ${updateError.message}`)
    }

    console.log(`User ${userId} successfully ${blocked ? 'blocked' : 'unblocked'}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `User ${blocked ? 'blocked' : 'unblocked'} successfully` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in toggle-user-block function:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
