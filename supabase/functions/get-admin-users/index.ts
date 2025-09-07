
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// CORS-Header für Cross-Origin-Anfragen mit verbesserten Sicherheitseinstellungen
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'"
}

export const handler = async (req: Request) => {
  // CORS-Präflug-Anfragen verarbeiten
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting get-admin-users function");
    
    // Authentifizierung und Autorisierung prüfen
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Authorization header missing");
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      console.error("Invalid Authorization format");
      return new Response(
        JSON.stringify({ error: "Invalid Authorization format" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Supabase-Client mit SERVICE_ROLE erstellen
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      { global: { headers: { Authorization: authHeader } } }
    );
    
    // Administratorrechte prüfen vor dem Zugriff
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Prüfen, ob Benutzer Admin-Rolle hat
    const { data: isAdmin, error: isAdminError } = await supabaseAdmin.rpc('has_role', { 
      _user_id: user.id, 
      _role: 'admin' 
    });
    
    if (isAdminError || !isAdmin) {
      console.error("User is not an admin:", isAdminError || "No admin permission");
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }
    
    console.log("Fetching admin users");
    
    // Admin-Benutzer zählen
    const { count, error: countError } = await supabaseAdmin
      .from('user_roles')
      .select('*', { count: 'exact', head: false })
      .eq('role', 'admin');
      
    if (countError) {
      console.error("Error counting admin users:", countError);
      throw countError;
    }
    
    console.log(`Found ${count} admin users`);
    
    return new Response(
      JSON.stringify({ count }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in get-admin-users function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Ein unerwarteter Fehler ist aufgetreten" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
