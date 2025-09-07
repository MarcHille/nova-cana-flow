
import { UserManagementOptions } from "./types";

export const handleUserManagementError = (
  error: string,
  options: UserManagementOptions | undefined,
  errorNotified: boolean,
  silent: boolean,
  toast: any
): boolean => {
  // Only trigger the error callback or toast once
  if (!errorNotified && !silent) {
    if (options?.onError) {
      options.onError(error);
    } else if (options?.showToasts !== false) {
      toast({
        title: "Error loading users",
        description: error,
        variant: "destructive"
      });
    }
    return true; // Error was notified
  }
  return false; // Error was not notified
};
