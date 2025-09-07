
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
    const { userId, email, subscribe } = await req.json()

    if (!userId || !email || typeof subscribe !== 'boolean') {
      throw new Error('Invalid request parameters')
    }

    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      throw new Error('Invalid user ID format')
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format')
    }

    // In a real application, you would update a mailing_list table or call an email service API
    // For this example, we'll simulate the process and return success
    console.log(`User ${userId} (${email}) ${subscribe ? 'added to' : 'removed from'} mailing list`)

    // Here you would implement actual mailing list subscription logic:
    // 1. Check if a user_subscriptions table exists or create one
    // 2. Add/remove user from that table 
    // 3. If using a third-party service like Mailchimp, call their API

    // To properly implement this, we would need to create a new table:
    // CREATE TABLE public.user_subscriptions (
    //   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    //   user_id UUID REFERENCES auth.users NOT NULL,
    //   email TEXT NOT NULL,
    //   subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    //   UNIQUE(user_id)
    // );

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `User ${subscribe ? 'added to' : 'removed from'} mailing list successfully` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in toggle-mailing-list function:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
