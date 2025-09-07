
import { useAuth } from "@/contexts/AuthContext";

export const useRoleCheck = (
  adminRequired: boolean = false,
  pharmacistRequired: boolean = false,
  verifiedPharmacistRequired: boolean = false
) => {
  const { 
    isAdmin, 
    isPharmacist, 
    isVerifiedPharmacist,
    loading,
    user
  } = useAuth();

  // Implement more precise access logic - admins have full access
  const hasRequiredAccess = (
    // Admin access allows all
    isAdmin || 
    // If pharmacist access is required
    (!adminRequired && pharmacistRequired && isPharmacist && 
      // And if verified pharmacist is required, check that too
      (!verifiedPharmacistRequired || isVerifiedPharmacist))
  );

  return {
    isAdmin,
    isPharmacist,
    isVerifiedPharmacist,
    hasRequiredAccess,
    loading,
    userId: user?.id
  };
};

export default useRoleCheck;
