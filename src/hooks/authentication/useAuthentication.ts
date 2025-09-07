
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthenticationState } from "./types";
import { useRoleVerification } from "./useRoleVerification";
import { useSessionListener } from "./useSessionListener";

export function useAuthentication(
  adminRequired = false,
  pharmacistRequired = false,
  verifiedPharmacistRequired = false
): AuthenticationState {
  // Initialize base state
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Use the session listener hook to track session changes
  const { 
    session: currentSession, 
    user: currentUser,
    loading: sessionLoading 
  } = useSessionListener();
  
  // Memoized admin check to prevent unnecessary rerenders
  const performRoleCheck = useCallback(async () => {
    if (currentUser?.id && !authChecked) {
      // Use role verification hook to check user roles
      const {
        isAdmin,
        isPharmacist,
        isVerifiedPharmacist,
        checkedStatus
      } = await useRoleVerification(
        currentUser.id,
        adminRequired,
        pharmacistRequired,
        verifiedPharmacistRequired
      );
      
      return {
        isAdmin,
        isPharmacist,
        isVerifiedPharmacist,
        checkedStatus
      };
    }
    return null;
  }, [currentUser?.id, authChecked, adminRequired, pharmacistRequired, verifiedPharmacistRequired]);
  
  // Perform role verification when user changes
  useEffect(() => {
    let isMounted = true;
    
    const checkRoles = async () => {
      if (!currentUser?.id) {
        if (isMounted) {
          setLoading(false);
          setAuthChecked(true);
        }
        return;
      }
      
      try {
        const roleData = await performRoleCheck();
        if (!isMounted) return;
        
        if (roleData) {
          setLoading(false);
          setAuthChecked(true);
        }
      } catch (error) {
        console.error("Error checking roles:", error);
        if (isMounted) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };
    
    if (!sessionLoading) {
      checkRoles();
    }
    
    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, sessionLoading, performRoleCheck]);
  
  // Update state when session changes
  useEffect(() => {
    setUser(currentUser);
    setSession(currentSession);
  }, [currentSession, currentUser]);
  
  // Use role verification hook to check user roles
  const {
    isAdmin,
    isPharmacist,
    isVerifiedPharmacist,
    checkedStatus
  } = useRoleVerification(
    currentUser?.id,
    adminRequired,
    pharmacistRequired,
    verifiedPharmacistRequired
  );
  
  return {
    user,
    session,
    isAdmin,
    isPharmacist,
    isVerifiedPharmacist,
    loading: sessionLoading || loading,
    authChecked: authChecked && !loading,
    checkedStatus
  };
}
