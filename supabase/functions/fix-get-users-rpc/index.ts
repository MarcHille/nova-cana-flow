
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Service Role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    );

    console.log("Fixing get_users_with_roles function...");

    // Drop and recreate the function with correct column name
    const { error: dropError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        DROP FUNCTION IF EXISTS public.get_users_with_roles(integer, integer);
      `
    });

    if (dropError) {
      console.log("Drop function error (this is OK if function didn't exist):", dropError);
    }

    // Create the corrected function with proper column references
    const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.get_users_with_roles(_limit integer DEFAULT 100, _offset integer DEFAULT 0)
        RETURNS TABLE(id uuid, email text, roles text[], is_blocked boolean, created_at timestamp with time zone, raw_user_meta_data jsonb, verification_status text)
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $function$
        BEGIN
          -- Check if the current user is an admin
          IF NOT public.is_admin(auth.uid()) THEN
            RAISE EXCEPTION 'Permission denied. Only admins can access user data.';
          END IF;

          RETURN QUERY
          WITH user_verification AS (
            SELECT 
              pv.user_id,
              pv.verification_status
            FROM 
              pharmacy_verification pv
          )
          SELECT 
            au.id,
            au.email,
            COALESCE(ARRAY_AGG(ur.role::text) FILTER (WHERE ur.role IS NOT NULL), '{}'::text[]) AS roles,
            COALESCE(au.banned_until IS NOT NULL AND au.banned_until > now(), false) AS is_blocked,
            au.created_at,
            au.raw_user_meta_data,
            COALESCE(uv.verification_status, '') AS verification_status
          FROM 
            auth.users au
          LEFT JOIN 
            public.user_roles ur ON au.id = ur.user_id
          LEFT JOIN
            user_verification uv ON au.id = uv.user_id
          GROUP BY 
            au.id, au.email, au.banned_until, au.created_at, au.raw_user_meta_data, uv.verification_status
          ORDER BY 
            au.created_at DESC
          LIMIT _limit
          OFFSET _offset;
        END;
        $function$
      `
    });

    if (createError) {
      console.error("Error creating function:", createError);
      throw new Error(`Failed to create function: ${createError.message}`);
    }

    console.log("Successfully fixed get_users_with_roles function");

    return new Response(
      JSON.stringify({ success: true, message: "Function fixed successfully" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error fixing function:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
