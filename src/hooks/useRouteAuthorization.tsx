
import { useAuth } from "@/contexts/AuthContext";

export const useRouteAuthorization = () => {
  // Simply forward the auth context data
  return useAuth();
};

export default useRouteAuthorization;
