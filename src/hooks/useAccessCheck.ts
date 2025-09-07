
import { useState, useEffect, useRef, useCallback } from "react";
import { useRoleCheck } from "./routeAuthorization/useRoleCheck";
import { useNotificationManager } from "./routeAuthorization/useNotificationManager";
import { CheckStatus } from "./routeAuthorization/roleCheckTypes";

/**
 * Hook that securely combines role checking with notification management
 * for route access control with improved security
 */
export function useAccessCheck(
  userId: string | undefined,
  adminOnly: boolean = false, 
  pharmacistOnly: boolean = false
) {
  // Use ref to prevent re-renders and state mutations
  const retryCountRef = useRef(0);
  const securityCheckTimerRef = useRef<number | undefined>(undefined);
  
  // Get role information with enhanced security checks
  const { 
    isAdmin, 
    isPharmacist, 
    isVerifiedPharmacist, 
    checkedStatus, 
    hasAccess 
  } = useRoleCheck(userId, adminOnly, pharmacistOnly);
  
  // Get notification utilities
  const { 
    hasShownToast,
    showAccessDeniedToast, 
    resetToastState 
  } = useNotificationManager();

  // Reset toast state when userId changes
  useEffect(() => {
    resetToastState();
    
    // Security feature: Set a maximum lifetime for the component
    securityCheckTimerRef.current = window.setTimeout(() => {
      // Force a refresh if security checks take too long
      if (checkedStatus !== 'complete') {
        retryCountRef.current += 1;
        console.warn("[useAccessCheck] Security timeout reached, forcing check refresh");
      }
      
      // Clear the reference to avoid memory leaks
      securityCheckTimerRef.current = undefined;
    }, 10000); // 10 second maximum lifetime
    
    return () => {
      resetToastState();
      if (securityCheckTimerRef.current) {
        window.clearTimeout(securityCheckTimerRef.current);
        securityCheckTimerRef.current = undefined;
      }
    };
  }, [userId, resetToastState, checkedStatus]);

  // Expose retry count as a value but update through ref
  const getRetryCount = useCallback(() => retryCountRef.current, []);
  const setRetryCount = useCallback((count: number) => {
    retryCountRef.current = count;
  }, []);

  return { 
    isAdmin, 
    isPharmacist, 
    isVerifiedPharmacist, 
    checkedStatus, 
    hasAccess,
    retryCount: getRetryCount(),
    setRetryCount
  };
}
