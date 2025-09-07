
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // First, delete all related data due to GDPR requirements
    await Promise.all([
      // Delete user roles
      supabaseClient
        .from('user_roles')
        .delete()
        .eq('user_id', userId),
      
      // Delete pharmacy verification
      supabaseClient
        .from('pharmacy_verification')
        .delete()
        .eq('user_id', userId),
      
      // Delete orders
      supabaseClient
        .from('orders')
        .delete()
        .eq('user_id', userId)
    ])

    // Finally, delete the user from auth.users
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId)

    if (deleteError) throw deleteError

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
