
import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { UserManagementOptions } from "./userManagement/types";
import { fetchUsersViaRpc, fetchUsersViaEdgeFunction, deleteUserById } from "./userManagement/userDataService";
import { handleUserManagementError } from "./userManagement/errorHandling";

export const useUserManagement = (options?: UserManagementOptions) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const { toast } = useToast();
  
  // Prevent multiple error notifications
  const [errorNotified, setErrorNotified] = useState<boolean>(false);

  // Function to load users with enhanced error handling and retry logic
  const loadUsers = useCallback(async (silent: boolean = false) => {
    // Don't retry more than specified times
    const maxRetries = options?.maxRetries ?? 2;
    if (retryCount > maxRetries) {
      console.warn(`Max retry attempts (${maxRetries}) reached. Stopping retry attempts.`);
      return;
    }
    
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    setErrorNotified(false);
    
    try {
      console.log("Loading users from useUserManagement...");
      
      // First try the get_users_with_roles RPC function (most efficient approach)
      const rpcUsers = await fetchUsersViaRpc(100, 0);
      
      if (rpcUsers !== null) {
        setUsers(rpcUsers);
        setRetryCount(0); // Reset retry counter on success
        setLoading(false);
        return;
      }
      
      console.log("RPC function failed. Trying Edge Function...");
      
      // Fallback to Edge Function
      const edgeUsers = await fetchUsersViaEdgeFunction(100, 0);
      setUsers(edgeUsers);
      setRetryCount(0); // Reset retry counter on success
      console.log(`Successfully loaded ${edgeUsers.length} users`);
      
    } catch (err: any) {
      console.error("Error in loadUsers:", err);
      const errorMessage = err.message || "An unknown error occurred while loading users";
      setError(errorMessage);
      setRetryCount(prev => prev + 1);
      
      const wasNotified = handleUserManagementError(errorMessage, options, errorNotified, silent, toast);
      if (wasNotified) {
        setErrorNotified(true);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [toast, options, retryCount, errorNotified]);

  // Load users on component mount if initialLoad is true (default)
  useEffect(() => {
    if (options?.initialLoad !== false) {
      loadUsers();
    }
  }, [options?.initialLoad]);

  // Retry logic with exponential backoff
  useEffect(() => {
    if (error && retryCount > 0 && retryCount <= (options?.maxRetries ?? 2)) {
      const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 8000); // Exponential backoff with max 8s
      console.log(`Retry attempt ${retryCount} scheduled in ${delay}ms`);
      
      const timeoutId = setTimeout(() => {
        console.log(`Executing retry attempt ${retryCount}`);
        loadUsers(true); // Silent retry
      }, delay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [error, retryCount, options?.maxRetries, loadUsers]);

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      await deleteUserById(userId);
      
      toast({
        title: "User deleted",
        description: "The user was successfully deleted."
      });
      
      await loadUsers();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      const errorMessage = err.message || "An unknown error occurred";
      
      toast({
        title: "Error deleting user",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    deleteUser
  };
};

export type { UserManagementOptions };
