
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const handler = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Process request data
    const requestData = await req.json();
    const { userId, action } = requestData;
    
    // Create Supabase client with SERVICE_ROLE
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Handle different actions
    if (action === 'get-users-with-emails') {
      // Get all users with their emails
      const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (usersError) {
        console.error("Error retrieving users:", usersError);
        throw usersError;
      }
      
      return new Response(
        JSON.stringify({ users: users.users }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Default: get roles for a specific user
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Direct query for user roles with the secure function
    const { data, error } = await supabaseAdmin
      .rpc('get_user_roles_safely', { _user_id: userId });
    
    if (error) {
      console.error("Error retrieving user roles:", error);
      throw error;
    }
    
    const roles = data || [];
    console.log("User roles retrieved:", roles);
    
    return new Response(
      JSON.stringify({ roles }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in processing:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
