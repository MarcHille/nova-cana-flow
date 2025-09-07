
import { useState, useEffect, useRef } from "react";
import { useRoleCheck } from "./useRoleCheck";
import { useNotificationManager } from "./useNotificationManager";
import { CheckStatus } from "./types/roleCheckTypes";

/**
 * Hook that combines role checking with notification management
 * for route access control
 */
export function useAccessCheck(
  userId: string | undefined,
  adminOnly: boolean = false, 
  pharmacistOnly: boolean = false,
  verifiedPharmacistOnly: boolean = false
) {
  // Use useRef to prevent re-renders
  const retryCountRef = useRef(0);
  
  // Get role information
  const { 
    isAdmin, 
    isPharmacist, 
    isVerifiedPharmacist, 
    checkedStatus, 
    hasAccess 
  } = useRoleCheck(userId, adminOnly, pharmacistOnly, verifiedPharmacistOnly);
  
  // Get notification utilities - but don't use them directly here
  // to prevent toast-related re-renders
  const { 
    hasShownToast,
    showAccessDeniedToast, 
    resetToastState 
  } = useNotificationManager();

  // Reset toast state when userId changes
  useEffect(() => {
    resetToastState();
  }, [userId, resetToastState]);

  // Expose retry count as a value but update through ref
  // to prevent unnecessary re-renders
  const getRetryCount = () => retryCountRef.current;
  const setRetryCount = (count: number) => {
    retryCountRef.current = count;
  };

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
