
import { supabase } from "@/integrations/supabase/client";

/**
 * Prüft, ob ein Benutzer Admin-Rechte hat
 * 
 * @param userId Die Benutzer-ID
 * @returns true, wenn der Benutzer Admin ist, ansonsten false
 */
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }
    
    // Verwende zuerst die PostgreSQL-Funktion
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'is_admin',
      { user_id: userId }
    );
    
    if (!rpcError) {
      return rpcData === true;
    }
    
    console.warn("Fehler bei der Admin-Statusprüfung via RPC:", rpcError);
    console.log("Versuche Edge-Funktion als Fallback...");
    
    // Fallback: Edge-Funktion verwenden
    const { data, error } = await supabase.functions.invoke('check-is-admin', {
      body: { userId }
    });
    
    if (error) {
      console.error("Fehler bei der Admin-Statusprüfung via Edge Function:", error);
      return false;
    }
    
    return data?.isAdmin === true;
  } catch (error) {
    console.error("Unerwarteter Fehler bei der Admin-Statusprüfung:", error);
    return false;
  }
};

/**
 * Prüft, ob Admin-Benutzer in der Datenbank existieren
 * 
 * @returns true, wenn Admin-Benutzer existieren, ansonsten false
 */
export const checkAdminExists = async (): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
      
    if (error) {
      console.error("Fehler bei der Prüfung auf existierende Admins:", error);
      
      // Fallback: Edge-Funktion verwenden
      const { data, error: edgeFunctionError } = await supabase.functions.invoke('check-admin-exists', {});
      
      if (edgeFunctionError) {
        console.error("Fehler bei der Edge-Funktion:", edgeFunctionError);
        return false;
      }
      
      return data?.adminExists === true;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error("Unerwarteter Fehler bei der Prüfung auf existierende Admins:", error);
    return false;
  }
};
