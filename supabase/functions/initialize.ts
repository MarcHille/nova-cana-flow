
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

console.log("Running initialization script...");

// Initialize the database function
const initializeDatabase = async () => {
  try {
    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("Creating get_users_by_ids function...");
    // Create a security definer function to safely get user data while avoiding RLS recursion
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

    const { data, error } = await supabaseClient.sql(sql);
    if (error) {
      throw error;
    }

    console.log("Database initialization completed successfully.");
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error: error.message };
  }
};

// Run the initialization
initializeDatabase().then(result => {
  console.log("Initialization result:", result);
}).catch(err => {
  console.error("Initialization failed:", err);
});
