
import { supabase } from "@/integrations/supabase/client";

/**
 * Überprüft, ob ein Benutzer die Apotheker-Rolle hat
 */
export const checkIsPharmacist = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      console.log("Keine Benutzer-ID für Apotheker-Prüfung vorhanden");
      return false;
    }

    console.log("Apotheker-Status wird geprüft für:", userId);
    
    // Try edge function first as most reliable
    try {
      console.log("Using edge function to check pharmacist status");
      const { data, error } = await supabase.functions.invoke('check-is-pharmacist', {
        body: { userId }
      });
      
      if (!error && data) {
        console.log("Edge function result for pharmacist check:", data);
        return !!data.isPharmacist;
      }
      
      if (error) {
        console.error("Error in edge function pharmacist check:", error);
        // Fall through to other methods
      }
    } catch (edgeError) {
      console.error("Failed to call edge function for pharmacist check:", edgeError);
      // Fall through to other methods
    }
    
    // Try direct database check as fallback
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'pharmacist')
        .maybeSingle();
      
      if (!roleError && roleData) {
        console.log("Apotheker-Status (direct DB): true");
        return true;
      }
      
      if (roleError) {
        console.error("Fehler bei direkter Apotheker-Statusprüfung:", roleError);
        // Fall through to other methods
      }
    } catch (dbError) {
      console.error("DB Fehler bei Apotheker-Statusprüfung:", dbError);
      // Fall through to other methods
    }
    
    // Try RPC function next
    try {
      const { data: hasRole, error: roleError } = await supabase
        .rpc('has_role', {
          _user_id: userId,
          _role: 'pharmacist'
        });
      
      if (roleError) {
        console.error("Fehler bei Apotheker-Rollenprüfung:", roleError);
        // Final fallback: Check if they have an approved verification
        return await checkPharmacistVerificationOnly(userId);
      }
      
      console.log("Apotheker-Status (RPC):", !!hasRole);
      
      // If they don't have the role but have approved verification, fix it
      if (!hasRole) {
        return await checkPharmacistVerificationOnly(userId);
      }
      
      return !!hasRole;
    } catch (rpcError) {
      console.error("RPC Fehler bei Apotheker-Statusprüfung:", rpcError);
      // Final fallback: Check if they have an approved verification
      return await checkPharmacistVerificationOnly(userId);
    }
  } catch (error) {
    console.error("Allgemeiner Fehler bei Apotheker-Statusprüfung:", error);
    return false;
  }
};

/**
 * Fallback function to check if user has approved verification even without role
 */
const checkPharmacistVerificationOnly = async (userId: string): Promise<boolean> => {
  try {
    console.log("Checking verification status as fallback...");
    const { data, error } = await supabase
      .from('pharmacy_verification')
      .select('verification_status')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking verification status:", error);
      return false;
    }
    
    if (!data) return false;
    
    const isApproved = data.verification_status === 'approved';
    
    if (isApproved) {
      console.log("User has approved verification but missing role - attempting to fix...");
      try {
        // Attempt to fix by calling manage-user-roles function
        const { data: fixResult, error: fixError } = await supabase.functions.invoke('manage-user-roles', {
          body: { userId, role: 'pharmacist', action: 'add' }
        });
        
        if (fixError) {
          console.error("Failed to fix missing pharmacist role:", fixError);
        } else {
          console.log("Successfully added missing pharmacist role");
        }
      } catch (fixError) {
        console.error("Error fixing missing role:", fixError);
      }
    }
    
    return isApproved;
  } catch (error) {
    console.error("Error in verification fallback check:", error);
    return false;
  }
};

/**
 * Initiates a pharmacy verification request for a user
 */
export const requestPharmacyVerification = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      console.error("No user ID provided for pharmacy verification request");
      return false;
    }

    console.log("Requesting pharmacy verification for user:", userId);
    
    // Use edge function to request verification
    const { data, error } = await supabase.functions.invoke('request-pharmacy-verification', {
      body: { userId }
    });
    
    if (error) {
      console.error("Error requesting pharmacy verification:", error);
      return false;
    }
    
    if (!data?.success) {
      console.error("Pharmacy verification request failed:", data?.message || "Unknown error");
      return false;
    }
    
    console.log("Pharmacy verification requested successfully:", data);
    return true;
  } catch (error) {
    console.error("Exception during pharmacy verification request:", error);
    return false;
  }
};

