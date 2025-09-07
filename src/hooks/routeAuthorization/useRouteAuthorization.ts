
import { useEffect, useCallback } from "react";
import { useSessionManager } from "./useSessionManager";
import { useAccessCheck } from "./useAccessCheck";
import { useToastNotifications } from "./useToastNotifications";
import { RouteAuthorizationState } from "./types";

export function useRouteAuthorization(
  adminOnly: boolean = false,
  pharmacistOnly: boolean = false,
  verifiedPharmacistOnly: boolean = false
): RouteAuthorizationState {
  const { session, user, loading } = useSessionManager();
  const { showAccessDeniedToast, resetToastState } = useToastNotifications();
  
  // Check user roles and permissions with increased timeout
  const { 
    isAdmin, 
    isPharmacist, 
    isVerifiedPharmacist, 
    checkedStatus, 
    hasAccess
  } = useAccessCheck(user?.id, adminOnly, pharmacistOnly);

  // Reset toast state when route changes
  useEffect(() => {
    // Call reset on component mount
    resetToastState();
    
    // And when component unmounts
    return () => {
      resetToastState();
    };
  }, [resetToastState]);

  // Ensure access decision considers verified status correctly
  const determineAccess = useCallback(() => {
    if (adminOnly && !isAdmin) {
      return false;
    }
    
    if (pharmacistOnly && !isPharmacist) {
      return false;
    }
    
    if (verifiedPharmacistOnly && !isVerifiedPharmacist && !isAdmin) {
      return false;
    }
    
    return true;
  }, [adminOnly, isAdmin, pharmacistOnly, isPharmacist, verifiedPharmacistOnly, isVerifiedPharmacist]);

  return {
    loading,
    checkedStatus,
    isAdmin,
    isPharmacist,
    isVerifiedPharmacist,
    session,
    user,
    hasAccess: determineAccess(),
    showAccessDeniedToast
  };
}
