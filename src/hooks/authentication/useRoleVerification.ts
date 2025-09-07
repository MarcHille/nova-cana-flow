
import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { checkIsAdmin } from "@/utils/adminRoleUtils";
import { checkIsPharmacist } from "@/utils/pharmacistRoleUtils";
import { isPharmacistVerified } from "@/utils/verificationStatusUtils";

export function useRoleVerification(
  userId: string | undefined, 
  adminRequired: boolean = false, 
  pharmacistRequired: boolean = false,
  verifiedPharmacistRequired: boolean = false
) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPharmacist, setIsPharmacist] = useState(false);
  const [isVerifiedPharmacist, setIsVerifiedPharmacist] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState<"loading" | "complete">("loading");
  const [hasAccess, setHasAccess] = useState(false);

  // Check user's roles and calculate access rights
  const checkUserRoles = useCallback(async (userId: string) => {
    try {
      console.log("Checking admin status for:", userId);
      const isAdminUser = await checkIsAdmin(userId);
      
      // Calculate preliminary access based on admin status
      let accessGranted = adminRequired ? isAdminUser : true;
      let isPharmacistUser = false;
      let isVerified = false;
      
      // Set admin status
      setIsAdmin(isAdminUser);
      console.log("Admin status:", isAdminUser);
      
      // If user is admin, they're automatically verified for all roles
      if (isAdminUser) {
        setIsPharmacist(true);
        setIsVerifiedPharmacist(true);
        setHasAccess(true);
        setCheckedStatus("complete");
        return;
      }
      
      // If pharmacist role is required or if verification is required, check that status
      if (pharmacistRequired || verifiedPharmacistRequired) {
        isPharmacistUser = await checkIsPharmacist(userId);
        setIsPharmacist(isPharmacistUser);
        console.log("Pharmacist status:", isPharmacistUser);
        
        // If user is a pharmacist, check verification status
        if (isPharmacistUser) {
          isVerified = await isPharmacistVerified(userId);
          setIsVerifiedPharmacist(isVerified);
          console.log("Verification status:", isVerified);
          
          // Update access based on pharmacist verification if required
          if (pharmacistRequired) {
            accessGranted = accessGranted && isPharmacistUser;
            
            // If verified pharmacist required, check that too
            if (verifiedPharmacistRequired) {
              accessGranted = accessGranted && isVerified;
            }
          }
        } else if (pharmacistRequired || verifiedPharmacistRequired) {
          accessGranted = false;
        }
      }
      
      // Update final access state
      setHasAccess(accessGranted);
      setCheckedStatus("complete");
    } catch (error) {
      console.error("Error checking user roles:", error);
      setIsVerifiedPharmacist(false);
      setCheckedStatus("complete");
      setHasAccess(false);
    }
  }, [adminRequired, pharmacistRequired, verifiedPharmacistRequired]);

  // Effect to check roles when user changes
  useEffect(() => {
    // Reset role status when user changes
    setIsAdmin(false);
    setIsPharmacist(false);
    setIsVerifiedPharmacist(false);
    setCheckedStatus("loading");
    
    // Only check roles if we have a user
    if (userId) {
      checkUserRoles(userId);
    } else {
      // No user, so complete the check with no access
      setCheckedStatus("complete");
      setHasAccess(false);
    }
  }, [userId, checkUserRoles]);

  return {
    isAdmin,
    isPharmacist,
    isVerifiedPharmacist,
    checkedStatus,
    hasAccess
  };
}
