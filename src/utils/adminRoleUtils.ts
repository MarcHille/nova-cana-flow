
import { supabase } from "@/integrations/supabase/client";

// Überprüft, ob ein Benutzer Administrator-Rechte hat
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      console.log("Keine Benutzer-ID für Admin-Prüfung vorhanden");
      return false;
    }

    console.log("Admin-Status wird geprüft für:", userId);
    
    // Lokalen Cache für Admin-Status überprüfen
    const cachedAdminStatus = localStorage.getItem(`admin_status_${userId}`);
    const cacheTime = localStorage.getItem(`admin_status_time_${userId}`);
    
    // Wenn ein Cache existiert und weniger als 5 Minuten alt ist, diesen verwenden
    if (cachedAdminStatus && cacheTime) {
      const cacheAge = Date.now() - parseInt(cacheTime);
      if (cacheAge < 300000) { // 5 Minuten
        console.log("Admin-Status aus Cache:", cachedAdminStatus === 'true');
        return cachedAdminStatus === 'true';
      }
    }
    
    // Try edge function first with aggressive retry
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      try {
        const { data, error } = await supabase.functions.invoke('check-is-admin', {
          body: { userId }
        });
        
        if (!error && data?.isAdmin !== undefined) {
          console.log("Admin-Statusprüfung Ergebnis (Edge):", data);
          
          // Im Cache speichern
          localStorage.setItem(`admin_status_${userId}`, data.isAdmin ? 'true' : 'false');
          localStorage.setItem(`admin_status_time_${userId}`, Date.now().toString());
          
          return data.isAdmin === true;
        }
        
        if (error) {
          console.error("Fehler bei Edge Admin-Statusprüfung (Versuch " + (retries + 1) + "):", error);
          retries++;
          
          if (retries < maxRetries) {
            // Kurze Pause vor dem nächsten Versuch
            await new Promise(resolve => setTimeout(resolve, 500 * retries));
            continue;
          }
          // Fall through to direct database check after all retries failed
        }
      } catch (edgeError) {
        console.error("Edge Funktion nicht verfügbar (Versuch " + (retries + 1) + "):", edgeError);
        retries++;
        
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500 * retries));
          continue;
        }
        // Fall through to direct database check
      }
      
      // Wenn wir hier ankommen, brechen wir die Schleife ab
      break;
    }
    
    // Direct database check as fallback
    console.log("Verwende direkte Datenbankabfrage für Admin-Status");
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (roleError) {
      console.error("Fehler bei direkter Admin-Statusprüfung:", roleError);
      return false;
    }
    
    const isAdmin = !!roleData;
    console.log("Admin-Status (direct DB):", isAdmin);
    
    // Im Cache speichern
    localStorage.setItem(`admin_status_${userId}`, isAdmin ? 'true' : 'false');
    localStorage.setItem(`admin_status_time_${userId}`, Date.now().toString());
    
    return isAdmin;
  } catch (error) {
    console.error("Fehler bei Admin-Rollenprüfung:", error);
    return false;
  }
};

/**
 * Überprüft, ob bereits Admin-Benutzer existieren
 */
export const checkAdminExists = async (): Promise<boolean> => {
  try {
    console.log("Prüfe, ob Admin-Benutzer existieren");
    
    // Try edge function first
    try {
      const { data, error } = await supabase.functions.invoke('check-admin-exists');
      
      if (!error && data?.adminExists !== undefined) {
        console.log("Admin existiert (Edge):", data.adminExists);
        return data.adminExists === true;
      }
      
      if (error) {
        console.error("Fehler bei der Edge-Prüfung auf Admin-Benutzer:", error);
        // Fall through to direct check
      }
    } catch (edgeError) {
      console.error("Edge Funktion nicht verfügbar:", edgeError);
      // Fall through to direct check
    }
    
    // Direct database check as fallback
    const { count, error: countError } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    if (countError) {
      console.error("Fehler bei der direkten Prüfung auf Admin-Benutzer:", countError);
      return false;
    }
    
    const adminExists = count !== null && count > 0;
    console.log("Admin existiert (direct DB):", adminExists);
    return adminExists;
  } catch (error) {
    console.error("Fehler bei der Prüfung auf Admin-Benutzer:", error);
    return false;
  }
};

/**
 * Manuell einen Benutzer zum Administrator machen
 */
export const makeUserAdmin = async (email: string): Promise<boolean> => {
  try {
    console.log(`Versuche, Benutzer mit E-Mail ${email} zum Admin zu machen`);
    
    // Try edge function
    try {
      const { data, error } = await supabase.functions.invoke('make-user-admin', {
        body: { email }
      });
      
      if (!error && data?.success === true) {
        console.log(`Admin-Status-Ergebnis (Edge):`, data);
        
        // Cache zurücksetzen für diesen Benutzer
        if (data?.userId) {
          localStorage.removeItem(`admin_status_${data.userId}`);
          localStorage.removeItem(`admin_status_time_${data.userId}`);
        }
        
        return true;
      }
      
      if (error) {
        console.error("Fehler bei der Edge Admin-Erstellung:", error);
        // Fall through to direct implementation
      }
    } catch (edgeError) {
      console.error("Edge Funktion nicht verfügbar:", edgeError);
      // Fall through to direct implementation
    }
    
    // Direct implementation
    // 1. Find user ID by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError || !userData || !userData.users) {
      console.error("Fehler beim Abrufen der Benutzer:", userError);
      return false;
    }
    
    // Fix the type issue by properly typing the users array and checking its structure
    type AuthUser = {
      id: string;
      email?: string;
    };
    
    const users = userData.users as AuthUser[];
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.error("Benutzer mit der angegebenen E-Mail nicht gefunden:", email);
      return false;
    }
    
    // 2. Add admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: 'admin'
      })
      .select();
    
    if (roleError) {
      console.error("Fehler beim Hinzufügen der Admin-Rolle:", roleError);
      return false;
    }
    
    console.log("Admin-Rolle hinzugefügt (direct DB):", roleData);
    
    // Cache zurücksetzen für diesen Benutzer
    localStorage.removeItem(`admin_status_${user.id}`);
    localStorage.removeItem(`admin_status_time_${user.id}`);
    
    return true;
  } catch (error) {
    console.error(`Fehler beim Hinzufügen der Admin-Rolle für ${email}:`, error);
    return false;
  }
};
