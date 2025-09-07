
import { checkIsAdmin } from "@/utils/adminRoleUtils";
import { checkIsPharmacist } from "@/utils/pharmacistRoleUtils";
import { isPharmacistVerified } from "@/utils/verificationStatusUtils";

/**
 * Performs a check to determine if the user is an admin
 * with enhanced security and validation
 */
export const performAdminCheck = async (userId: string): Promise<boolean> => {
  if (!userId || !isValidUuid(userId)) {
    console.warn("[roleCheckUtils] Invalid userId format in admin check");
    return false;
  }
  
  try {
    const adminStatus = await checkIsAdmin(userId);
    return !!adminStatus; // Ensure boolean value
  } catch (error) {
    console.error("[roleCheckUtils] Error checking admin status:", error);
    return false;
  }
};

/**
 * Performs a check to determine if the user is a pharmacist
 * with enhanced security and validation
 */
export const performPharmacistCheck = async (userId: string): Promise<boolean> => {
  if (!userId || !isValidUuid(userId)) {
    console.warn("[roleCheckUtils] Invalid userId format in pharmacist check");
    return false;
  }
  
  try {
    const pharmacistStatus = await checkIsPharmacist(userId);
    return !!pharmacistStatus; // Ensure boolean value
  } catch (error) {
    console.error("[roleCheckUtils] Error checking pharmacist status:", error);
    return false;
  }
};

/**
 * Performs a check to determine if a pharmacist is verified
 * with enhanced security and validation
 */
export const performVerificationCheck = async (userId: string): Promise<boolean> => {
  if (!userId || !isValidUuid(userId)) {
    console.warn("[roleCheckUtils] Invalid userId format in verification check");
    return false;
  }
  
  try {
    const verificationResult = await isPharmacistVerified(userId);
    return !!verificationResult; // Ensure boolean value
  } catch (error) {
    console.error("[roleCheckUtils] Error checking verification status:", error);
    // Default to false for security in case of error
    return false;
  }
};

/**
 * Validates if a string is a valid UUID format
 * Used to prevent injection attacks
 */
export const isValidUuid = (str: string): boolean => {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};
