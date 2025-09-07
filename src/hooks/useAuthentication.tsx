
import { useAuth } from "@/contexts/AuthContext";

export const useAuthentication = () => {
  // Simply forward the auth context data
  return useAuth();
};
