
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Starting create-get-users-function script");

// Create a database function to safely get user emails by IDs
const createGetUsersFunction = async () => {
  try {
    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const sql = `
    CREATE OR REPLACE FUNCTION public.get_users_by_ids(user_ids UUID[])
    RETURNS TABLE(id UUID, email TEXT)
    LANGUAGE SQL
    SECURITY DEFINER
    SET search_path = public
    AS $$
      SELECT id, email 
      FROM auth.users 
      WHERE id = ANY(user_ids);
    $$;
    `;

    const { error } = await supabaseClient.rpc('get_users_by_ids', { user_ids: [] });
    if (error && error.message.includes('does not exist')) {
      // Function doesn't exist, create it
      const { error: createError } = await supabaseClient.rpc('get_users_by_ids', { user_ids: [] });
      if (createError) {
        console.log("Creating get_users_by_ids function");
        const { data, error: sqlError } = await supabaseClient.sql(sql);
        if (sqlError) {
          throw sqlError;
        }
        console.log("Function created successfully");
        return { success: true };
      }
    } else {
      console.log("Function already exists");
      return { success: true };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating function:', error);
    return { success: false, error: error.message };
  }
};

// Run the function on deployment
createGetUsersFunction();

// Serve HTTP requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Need admin authentication to run this
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const result = await createGetUsersFunction();
    
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
