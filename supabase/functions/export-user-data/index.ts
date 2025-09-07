
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

    // Get user data from various tables
    const userData = {
      profile: null,
      roles: [],
      pharmacyVerification: null,
      orders: []
    }

    // Get roles
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role, created_at')
      .eq('user_id', userId)

    if (roles) {
      userData.roles = roles
    }

    // Get pharmacy verification if exists
    const { data: verification } = await supabaseClient
      .from('pharmacy_verification')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (verification) {
      userData.pharmacyVerification = verification
    }

    // Get orders
    const { data: orders } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('user_id', userId)

    if (orders) {
      userData.orders = orders
    }

    return new Response(
      JSON.stringify(userData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
