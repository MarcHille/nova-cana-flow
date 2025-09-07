
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function validatePassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

const createSupabaseAdmin = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Server configuration error: Missing environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

const handler = async (req: Request): Promise<Response> => {
  // CORS-Präflug-Anfragen verarbeiten
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting create-user function");
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Authorization header missing");
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const supabaseAdmin = createSupabaseAdmin();
    
    // Verify the token and get the user
    const token = authHeader.replace('Bearer ', '');
    console.log("Verifying admin status with token length:", token.length);
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: "Authentication failed", detail: userError?.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    console.log("User authenticated:", user.id);
    
    // Check if user is an admin using the RPC function
    const { data: isAdmin, error: adminCheckError } = await supabaseAdmin.rpc(
      'has_role',
      { _user_id: user.id, _role: 'admin' }
    );
    
    if (adminCheckError) {
      console.error("Error checking admin status:", adminCheckError);
      return new Response(
        JSON.stringify({ error: "Failed to verify admin permissions", detail: adminCheckError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    if (!isAdmin) {
      console.error("User is not an admin:", user.id);
      return new Response(
        JSON.stringify({ error: "Insufficient permissions", detail: "Admin rights required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }
    
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const { email, password, role } = body;
    
    // Input validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!password || typeof password !== 'string') {
      return new Response(
        JSON.stringify({ error: "Password is required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!validatePassword(password)) {
      return new Response(
        JSON.stringify({ 
          error: "Password must be at least 8 characters long and contain uppercase letter, number, and special character" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!role || !['user', 'admin', 'pharmacist'].includes(role)) {
      return new Response(
        JSON.stringify({ error: "Valid role (user, admin, pharmacist) is required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Create new user with admin privileges
    console.log("Creating user with email:", email);
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (createError) {
      console.error("Error creating user:", createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    if (!newUser?.user) {
      console.error("No user data returned from createUser");
      return new Response(
        JSON.stringify({ error: "Failed to create user" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    console.log("User created, assigning role using RPC function");
    
    // Assign role using RPC function to avoid recursion
    const { data: roleData, error: roleError } = await supabaseAdmin.rpc(
      'assign_role_to_user',
      { 
        _user_id: newUser.user.id,
        _role: role
      }
    );
    
    if (roleError) {
      console.error("Error assigning role:", roleError);
      // Clean up by deleting the created user if role assignment fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return new Response(
        JSON.stringify({ error: "Failed to assign role: " + roleError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    console.log("Successfully created user with role:", role);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `User ${email} created successfully with role ${role}`,
        userId: newUser.user.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error("Error in create-user function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown server error" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

serve(handler);
