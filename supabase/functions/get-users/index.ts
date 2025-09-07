
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing Authorization header");
      throw new Error('Missing Authorization header');
    }

    // Parse JWT to verify admin role
    const token = authHeader.replace('Bearer ', '');
    
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

    // Verify the user exists and get their ID
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("User not found or error:", userError?.message);
      throw new Error('Authentication failed');
    }
    
    console.log(`User authenticated: ${user.id}. Checking admin status...`);
    
    // Try to use the more reliable has_role function first
    let isAdmin = false;
    try {
      const { data: hasRoleData, error: hasRoleError } = await supabaseAdmin.rpc(
        'has_role',
        { _user_id: user.id, _role: 'admin' }
      );
      
      if (!hasRoleError) {
        isAdmin = !!hasRoleData;
        console.log(`Admin check via has_role: ${isAdmin}`);
      }
    } catch (e) {
      console.error("Error checking admin status via has_role:", e);
    }
    
    // If has_role failed or returned false, try the is_admin function
    if (!isAdmin) {
      try {
        const { data: isAdminData, error: isAdminError } = await supabaseAdmin.rpc(
          'is_admin',
          { user_id: user.id }
        );
        
        if (!isAdminError) {
          isAdmin = !!isAdminData;
          console.log(`Admin check via is_admin: ${isAdmin}`);
        }
      } catch (e) {
        console.error("Error checking admin status via is_admin:", e);
      }
    }
    
    // If both RPC methods failed, use direct query as last resort
    if (!isAdmin) {
      const { data: directData, error: directError } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (!directError) {
        isAdmin = !!directData;
        console.log(`Admin check via direct query: ${isAdmin}`);
      } else {
        console.error("Error with direct admin check:", directError);
      }
    }
    
    if (!isAdmin) {
      console.error("User is not an admin:", user.id);
      throw new Error('Insufficient permissions: Admin rights required');
    }

    console.log("Admin verified. Getting users...");
    
    const requestData = await req.json().catch(() => ({ limit: 100, offset: 0 }));
    const { limit = 100, offset = 0 } = requestData;

    // First try to use the get_users_with_roles function which is more efficient
    try {
      const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc(
        'get_users_with_roles',
        { _limit: limit, _offset: offset }
      );
      
      if (!rpcError && Array.isArray(rpcData)) {
        console.log(`Retrieved ${rpcData.length} users via RPC function`);
        return new Response(
          JSON.stringify({ users: rpcData }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
      
      console.warn("RPC function error or invalid data:", rpcError);
    } catch (e) {
      console.error("Error using get_users_with_roles RPC:", e);
    }
    
    // If RPC fails, fall back to admin.listUsers and manual joining of data
    try {
      // Use the admin.listUsers method to get all users
      const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
        page: offset / limit + 1,
        perPage: limit
      });

      if (usersError) {
        console.error("Error fetching users:", usersError);
        throw usersError;
      }

      if (!usersData || !usersData.users) {
        console.log("No users found");
        return new Response(
          JSON.stringify({ users: [] }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      // Get all user roles
      const { data: rolesData, error: rolesError } = await supabaseAdmin
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        // Continue without roles if necessary
      }

      // Map roles to users
      const userRolesMap = new Map();
      if (rolesData) {
        rolesData.forEach(role => {
          const roles = userRolesMap.get(role.user_id) || [];
          roles.push(role.role);
          userRolesMap.set(role.user_id, roles);
        });
      }

      // Get pharmacy verification status
      const { data: verificationData, error: verificationError } = await supabaseAdmin
        .from('pharmacy_verification')
        .select('user_id, verification_status');

      if (verificationError) {
        console.error("Error fetching verification data:", verificationError);
        // Continue without verification status if necessary
      }

      // Map verification status to users
      const verificationMap = new Map();
      if (verificationData) {
        verificationData.forEach(v => {
          verificationMap.set(v.user_id, v.verification_status);
        });
      }

      // Combine all data
      const users = usersData.users.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        raw_user_meta_data: user.user_metadata,
        raw_app_metadata: user.app_metadata,
        is_blocked: user.banned || false,
        roles: userRolesMap.get(user.id) || [],
        verificationStatus: verificationMap.get(user.id) || null
      }));

      console.log(`Returning ${users.length} users`);

      return new Response(
        JSON.stringify({ users }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error in get-users function:", error.message);
      
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error in get-users function:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
