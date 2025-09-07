
import { useState, useEffect, useRef, useCallback } from "react";
import { performAdminCheck, performPharmacistCheck, performVerificationCheck } from "./utils/roleCheckUtils";
import { RoleCheckResult } from "./types/roleCheckTypes";
import { useTimeoutManager } from "./utils/timeoutManager";
import { useAdminStatusCache } from "./utils/adminStatusCache";
import { useCheckStatusManager } from "./utils/checkStatusManager";

/**
 * Hook for checking user roles and verification status with enhanced security
 */
export function useRoleCheck(
  userId: string | undefined,
  adminOnly: boolean = false,
  pharmacistOnly: boolean = false,
  verifiedPharmacistOnly: boolean = false
): RoleCheckResult {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPharmacist, setIsPharmacist] = useState(false);
  const [isVerifiedPharmacist, setIsVerifiedPharmacist] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  
  // Use refs to prevent race conditions and unnecessary re-renders
  const checkInProgressRef = useRef(false);
  const unmountedRef = useRef(false);
  
  // Use our utility hooks
  const { setSafetyTimeout, clearSafetyTimeout } = useTimeoutManager();
  const { getCachedAdminStatus, setCachedAdminStatus } = useAdminStatusCache();
  const { checkedStatus, startChecking, completeChecking } = useCheckStatusManager();

  // Memoized check function to prevent unnecessary re-renders
  const checkUserRoles = useCallback(async () => {
    // Prevent multiple simultaneous checks and bail if component is unmounted
    if (checkInProgressRef.current || unmountedRef.current) {
      return;
    }
    
    // Mark check as in progress
    checkInProgressRef.current = true;
    
    if (!userId) {
      if (!unmountedRef.current) {
        setIsAdmin(false);
        setIsPharmacist(false);
        setIsVerifiedPharmacist(false);
        setHasAccess(false);
        completeChecking();
      }
      checkInProgressRef.current = false;
      return;
    }

    // Set safety timeout - CRITICAL for preventing frozen UI
    setSafetyTimeout(() => {
      if (unmountedRef.current) return;
      
      console.error("[useRoleCheck] Role checking timed out - security failsafe activated");
      completeChecking();
      
      // Security-first approach: on timeout, default to no access for restricted routes
      if (adminOnly || pharmacistOnly || verifiedPharmacistOnly) {
        setHasAccess(false);
      } else {
        // For non-restricted routes, grant baseline access
        setHasAccess(true);
      }
      
      checkInProgressRef.current = false;
    }, 6000); // 6 seconds timeout

    // Check if we have a cached admin status for this user
    const cachedAdminStatus = getCachedAdminStatus(userId);
    if (cachedAdminStatus !== null) {
      // Use cached admin status but skip if component unmounted
      if (!unmountedRef.current) {
        setIsAdmin(cachedAdminStatus);
        
        // Admin can access everything - immediately complete the check
        if (cachedAdminStatus) {
          setIsPharmacist(true);
          setIsVerifiedPharmacist(true);
          setHasAccess(true);
          completeChecking();
          checkInProgressRef.current = false;
          clearSafetyTimeout();
          return;
        }
      }
    }

    try {
      // Check admin status first - critical security check
      const adminStatus = await performAdminCheck(userId);
      
      // Stop if component unmounted
      if (unmountedRef.current) {
        clearSafetyTimeout();
        checkInProgressRef.current = false;
        return;
      }
      
      // Cache the admin status result with timestamp
      setCachedAdminStatus(userId, adminStatus);
      
      setIsAdmin(adminStatus);
      
      // If user is admin, they have access to everything
      if (adminStatus) {
        setIsPharmacist(true);  // Admin has all permissions
        setIsVerifiedPharmacist(true);
        setHasAccess(true);
        completeChecking();
        checkInProgressRef.current = false;
        clearSafetyTimeout();
        return;
      }

      // For admin-only routes, non-admins don't have access
      if (adminOnly) {
        setHasAccess(false);
        completeChecking();
        checkInProgressRef.current = false;
        clearSafetyTimeout();
        return;
      }
      
      // Check pharmacist status for non-admin users
      const pharmacistStatus = await performPharmacistCheck(userId);
      
      // Stop if component unmounted
      if (unmountedRef.current) {
        clearSafetyTimeout();
        checkInProgressRef.current = false;
        return;
      }
      
      setIsPharmacist(pharmacistStatus);
      
      // Check verification status for pharmacists
      if (pharmacistStatus) {
        const verificationResult = await performVerificationCheck(userId);
        
        // Stop if component unmounted
        if (unmountedRef.current) {
          clearSafetyTimeout();
          checkInProgressRef.current = false;
          return;
        }
        
        setIsVerifiedPharmacist(verificationResult);
        
        // Set access based on route requirements
        if (verifiedPharmacistOnly) {
          setHasAccess(verificationResult); // Require verified pharmacist status
        } else if (pharmacistOnly) {
          setHasAccess(true); // Only require pharmacist role
        } else {
          setHasAccess(true); // For non-restricted routes
        }
      } else {
        if (verifiedPharmacistOnly || pharmacistOnly) {
          // Not a pharmacist, no access to pharmacist routes
          setHasAccess(false);
        } else {
          // Not a pharmacist but not a pharmacist-only route
          setHasAccess(true);
        }
      }
      
      completeChecking();
    } catch (error) {
      console.error("[useRoleCheck] Error checking user roles:", error);
      
      if (!unmountedRef.current) {
        // Security-first approach: on error, restrict access to protected routes
        setHasAccess(!adminOnly && !pharmacistOnly && !verifiedPharmacistOnly);
        completeChecking();
      }
    } finally {
      // Clear timeout as we're done
      clearSafetyTimeout();
      checkInProgressRef.current = false;
    }
  }, [
    userId, 
    adminOnly, 
    pharmacistOnly, 
    verifiedPharmacistOnly, 
    setSafetyTimeout, 
    clearSafetyTimeout, 
    getCachedAdminStatus, 
    setCachedAdminStatus, 
    completeChecking
  ]);
  
  // Effect to trigger role check
  useEffect(() => {
    unmountedRef.current = false;
    startChecking();
    checkUserRoles();
    
    return () => {
      // Mark component as unmounted to prevent state updates
      unmountedRef.current = true;
      checkInProgressRef.current = false;
      clearSafetyTimeout();
    };
  }, [userId, adminOnly, pharmacistOnly, verifiedPharmacistOnly, checkUserRoles, startChecking, clearSafetyTimeout]);

  return { 
    isAdmin, 
    isPharmacist, 
    isVerifiedPharmacist, 
    checkedStatus, 
    hasAccess 
  };
}
