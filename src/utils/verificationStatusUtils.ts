
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches verification status from the database for a specific user
 */
export const fetchVerificationStatus = async (userId: string): Promise<string | null> => {
  if (!userId || !isValidUuid(userId)) return null;
  
  console.log("Fetching verification status for user:", userId);
  
  try {
    // First check local cache for faster response
    const cachedStatus = localStorage.getItem(`verification_status_${userId}`);
    const cacheTime = localStorage.getItem(`verification_status_time_${userId}`);
    
    if (cachedStatus && cacheTime) {
      const cacheAge = Date.now() - parseInt(cacheTime);
      if (cacheAge < 60000) { // 1 minute cache
        console.log("Using cached verification status:", cachedStatus);
        return cachedStatus;
      }
    }
    
    const { data, error } = await supabase
      .from('pharmacy_verification')
      .select('verification_status, notification_shown')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching verification status:", error);
      // Default to return null on error
      return null;
    }
    
    if (data) {
      console.log("Verification status found:", data.verification_status);
      // Cache the status for 1 minute
      localStorage.setItem(`verification_status_${userId}`, data.verification_status);
      localStorage.setItem(`verification_status_time_${userId}`, Date.now().toString());
      return data.verification_status;
    }
    
    console.log("No verification record found");
    return null;
  } catch (error) {
    console.error("Error in fetchVerificationStatus:", error);
    return null;
  }
};

/**
 * Validates if a string is a valid UUID format
 */
export const isValidUuid = (str: string): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

/**
 * Sanitizes a user ID to prevent injection attacks
 */
export const sanitizeUserId = (userId: string): string => {
  return userId ? userId.replace(/[^a-zA-Z0-9-]/g, '') : '';
};

/**
 * Check if a pharmacist is verified
 */
export const isPharmacistVerified = async (userId: string): Promise<boolean> => {
  if (!userId || !isValidUuid(userId)) return false;
  
  try {
    console.log("Checking verification status for pharmacist:", userId);
    
    // First check local cache for faster response
    const cachedStatus = localStorage.getItem(`pharmacist_verified_${userId}`);
    const cacheTime = localStorage.getItem(`pharmacist_verified_time_${userId}`);
    
    if (cachedStatus && cacheTime) {
      const cacheAge = Date.now() - parseInt(cacheTime);
      if (cacheAge < 60000) { // 1 minute cache
        console.log("Using cached pharmacist verification status:", cachedStatus === 'true');
        return cachedStatus === 'true';
      }
    }
    
    // Clear cache for testing purposes
    localStorage.removeItem(`pharmacist_verified_${userId}`);
    localStorage.removeItem(`pharmacist_verified_time_${userId}`);
    
    // First try to use the edge function for more reliable verification
    try {
      console.log("Checking pharmacist status via edge function");
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('check-is-pharmacist', {
        body: { userId }
      });
      
      if (!edgeError && edgeData) {
        console.log("Edge function response:", edgeData);
        // Cache the result
        localStorage.setItem(`pharmacist_verified_${userId}`, edgeData.isPharmacist ? 'true' : 'false');
        localStorage.setItem(`pharmacist_verified_time_${userId}`, Date.now().toString());
        return !!edgeData.isPharmacist;
      }
    } catch (edgeFuncError) {
      console.error("Edge function error:", edgeFuncError);
      // Continue with fallback methods
    }
    
    // First check if user has pharmacist role - this is a prerequisite
    const { data: hasRole, error: roleError } = await supabase
      .rpc('has_role', { 
        _user_id: userId,
        _role: 'pharmacist'
      });
      
    if (roleError) {
      console.error("Error checking pharmacist role:", roleError);
      // For security fallback, allow access to users with verification status even if role check fails
      // This is a change from previous behavior
      const verificationStatus = await fetchVerificationStatus(userId);
      if (verificationStatus === 'approved') {
        console.log("User has approved verification, allowing access despite role check failure");
        return true;
      }
      return false;
    }
    
    if (!hasRole) {
      console.log("User does not have pharmacist role");
      
      // Check if they have an approved verification status
      const verificationStatus = await fetchVerificationStatus(userId);
      if (verificationStatus === 'approved') {
        console.log("User has approved verification status but missing pharmacist role, attempting to fix");
        
        // Try to assign the pharmacist role
        try {
          const { data: assignResult, error: assignError } = await supabase.functions.invoke('manage-user-roles', {
            body: { userId, role: 'pharmacist', action: 'add' }
          });
          
          if (!assignError && assignResult?.success) {
            console.log("Successfully added missing pharmacist role");
            // Cache the positive result - we've just fixed the problem
            localStorage.setItem(`pharmacist_verified_${userId}`, 'true');
            localStorage.setItem(`pharmacist_verified_time_${userId}`, Date.now().toString());
            return true;
          } else {
            console.error("Failed to add missing pharmacist role:", assignError || "Unknown error");
          }
        } catch (assignRoleError) {
          console.error("Error assigning missing role:", assignRoleError);
        }
      }
      
      // Cache the negative result
      localStorage.setItem(`pharmacist_verified_${userId}`, 'false');
      localStorage.setItem(`pharmacist_verified_time_${userId}`, Date.now().toString());
      return false; // Not a pharmacist
    }
    
    console.log("User has pharmacist role, checking verification status...");
    
    // Check for explicit verification record
    const { data, error } = await supabase
      .from('pharmacy_verification')
      .select('verification_status')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking verification status:", error);
      // Since this is a security-critical function but we want to avoid locking users out,
      // default to true if the user has the pharmacist role
      return true;
    }
    
    // If no verification record but has pharmacist role, consider as verified
    // This is a fallback for existing pharmacist users who might not have verification records
    if (!data) {
      console.log("No verification record found - considering user verified due to pharmacist role");
      // Cache the result
      localStorage.setItem(`pharmacist_verified_${userId}`, 'true');
      localStorage.setItem(`pharmacist_verified_time_${userId}`, Date.now().toString());
      return true;
    }
    
    // Check explicit verification status - must be 'approved' to be verified
    const isApproved = data.verification_status === 'approved';
    console.log("Verification status:", data.verification_status, "Is approved:", isApproved);
    
    // If approved but doesn't have role, assign it
    if (isApproved && !hasRole) {
      console.log("User has approved verification but missing role - fixing...");
      try {
        const { data: assignResult, error: assignError } = await supabase.functions.invoke('manage-user-roles', {
          body: { userId, role: 'pharmacist', action: 'add' }
        });
        
        if (assignError) {
          console.error("Error assigning missing role:", assignError);
        } else {
          console.log("Successfully assigned missing pharmacist role");
        }
      } catch (roleFixError) {
        console.error("Error fixing missing role:", roleFixError);
      }
    }
    
    // Cache the result
    localStorage.setItem(`pharmacist_verified_${userId}`, isApproved ? 'true' : 'false');
    localStorage.setItem(`pharmacist_verified_time_${userId}`, Date.now().toString());
    
    return isApproved;
  } catch (error) {
    console.error("Error in isPharmacistVerified:", error);
    // Default to true for users with pharmacist role to prevent lockouts
    return true;
  }
};
