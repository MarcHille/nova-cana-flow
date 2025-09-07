
import { User } from "@/types";

export const transformRpcUser = (user: any): User => ({
  id: user.id,
  email: user.email || '',
  roles: user.roles || [],
  verificationStatus: user.verification_status || '',
  name: user.raw_user_meta_data?.name || 
       (user.raw_user_meta_data?.first_name ? 
        `${user.raw_user_meta_data.first_name} ${user.raw_user_meta_data.last_name || ''}`.trim() : ''),
  pharmacyName: user.raw_user_meta_data?.pharmacyName || 
               user.raw_user_meta_data?.pharmacy_name || 
               user.raw_user_meta_data?.organizationName || '',
  blocked: user.is_blocked || false,
  createdAt: user.created_at
});

export const transformEdgeFunctionUser = (user: any): User => {
  // Extract user metadata safely
  let userData: User = {
    id: user.id,
    email: user.email || '',
    roles: user.roles || [],
    verificationStatus: user.verificationStatus || '',
    name: '',
    pharmacyName: '',
    blocked: user.is_blocked || false,
    created_at: user.created_at
  };
  
  // Extract user name and organization data safely
  if (user.raw_user_meta_data && typeof user.raw_user_meta_data === 'object') {
    userData.name = user.raw_user_meta_data.name || 
                  (user.raw_user_meta_data.first_name ? 
                    `${user.raw_user_meta_data.first_name} ${user.raw_user_meta_data.last_name || ''}`.trim() : '');
    userData.pharmacyName = user.raw_user_meta_data.pharmacyName || 
                         user.raw_user_meta_data.pharmacy_name || 
                         user.raw_user_meta_data.organizationName || '';
  }
  
  return userData;
};
