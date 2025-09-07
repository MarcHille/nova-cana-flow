
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const handler = async (req: Request) => {
  // Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Create Supabase client with the user's JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    
    // Create client with user's auth context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );
    
    // Get the user's session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'No valid session found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Check if user is admin
    const { data: isAdminData, error: isAdminError } = await supabaseAdmin
      .rpc('get_user_roles_safely', { _user_id: user.id });
      
    if (isAdminError) {
      throw isAdminError;
    }
    
    const isAdmin = (isAdminData || []).includes('admin');
    
    // Check if user is pharmacist
    const isPharmacist = (isAdminData || []).includes('pharmacist');
    
    // Check verification status for pharmacists
    let isVerifiedPharmacist = false;
    if (isPharmacist) {
      const { data: verificationData } = await supabaseAdmin
        .from('pharmacy_verification')
        .select('verification_status')
        .eq('user_id', user.id)
        .maybeSingle();
        
      isVerifiedPharmacist = verificationData?.verification_status === 'approved';
    }
    
    // Return user status
    return new Response(
      JSON.stringify({ 
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email
        },
        isAdmin,
        isPharmacist,
        isVerifiedPharmacist
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
