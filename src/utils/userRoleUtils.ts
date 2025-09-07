
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Gets all roles for a user with improved error handling using the security definer function
 */
export const getUserRoles = async (userId: string): Promise<string[]> => {
  try {
    if (!userId) {
      console.error("User ID missing for role query");
      return [];
    }

    console.log("Getting roles for user:", userId);

    // Use the security definer function we just created
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'get_user_roles_safely',
      { _user_id: userId }
    );

    if (!rpcError && Array.isArray(rpcData)) {
      console.log("User roles retrieved via RPC:", rpcData);
      return rpcData;
    }

    if (rpcError) {
      console.warn("Error getting user roles via RPC:", rpcError);
      console.log("Trying Edge Function as fallback...");
    }

    // Use the Edge Function as fallback
    const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke('get-user-roles', {
      body: { userId }
    });

    if (edgeFunctionError) {
      console.error("Error getting user roles via Edge Function:", edgeFunctionError);
      
      // Direct database query as last resort
      const { data: directQueryData, error: directQueryError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
        
      if (directQueryError) {
        console.error("Error with direct query for user roles:", directQueryError);
        return [];
      }
      
      const roles = directQueryData?.map(entry => entry.role) || [];
      console.log("User roles retrieved via direct query:", roles);
      return roles;
    }

    const roles = edgeFunctionData?.roles || [];
    console.log("User roles retrieved via Edge Function:", roles);
    return roles;
  } catch (error) {
    console.error("Unexpected error when getting user roles:", error);
    return [];
  }
};

/**
 * Adds a role to a user
 */
export const addUserRole = async (userId: string, role: 'admin' | 'pharmacist'): Promise<boolean> => {
  try {
    if (!userId) {
      console.error("No user ID provided");
      return false;
    }

    console.log(`Adding role ${role} for user ${userId}`);

    // Use the assign_role_to_user RPC function first
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'assign_role_to_user',
      { 
        _user_id: userId,
        _role: role
      }
    );

    if (!rpcError && rpcData === true) {
      toast({
        title: "Success",
        description: `The "${role}" role was successfully added.`
      });
      return true;
    }

    if (rpcError) {
      console.warn("Error with RPC function:", rpcError);
      console.log("Trying Edge Function as fallback...");
    }

    // Fallback: Use Edge Function
    const { data, error } = await supabase.functions.invoke('manage-user-roles', {
      body: { userId, role, action: 'add' }
    });

    if (error) {
      console.error("Error with Edge Function:", error);
      toast({
        title: "Error",
        description: `The role could not be added: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }

    if (data?.success) {
      toast({
        title: "Success",
        description: data.message || `The "${role}" role was successfully added.`
      });
      return true;
    }

    console.error("Edge Function returned unsuccessful result:", data);
    return false;
  } catch (error) {
    console.error("Error adding role:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while adding the role.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Removes a role from a user
 */
export const removeUserRole = async (userId: string, role: 'admin' | 'pharmacist'): Promise<boolean> => {
  try {
    if (!userId) {
      console.error("No user ID provided");
      return false;
    }

    console.log(`Removing role ${role} from user ${userId}`);

    // Direct database access as first attempt
    const { error: directError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (!directError) {
      toast({
        title: "Success",
        description: `The "${role}" role was successfully removed.`
      });
      return true;
    }

    console.warn("Error with direct role removal:", directError);
    console.log("Trying Edge Function as fallback...");

    // Fallback: Use Edge Function
    const { data, error } = await supabase.functions.invoke('manage-user-roles', {
      body: { userId, role, action: 'remove' }
    });

    if (error) {
      console.error("Error with Edge Function:", error);
      toast({
        title: "Error",
        description: `The role could not be removed: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }

    if (data?.success) {
      toast({
        title: "Success",
        description: data.message || `The "${role}" role was successfully removed.`
      });
      return true;
    }

    console.error("Edge Function returned unsuccessful result:", data);
    return false;
  } catch (error) {
    console.error("Error removing role:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while removing the role.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Helper function to create the first admin user (if needed)
 */
export const createInitialAdmin = async (userId: string): Promise<boolean> => {
  console.log("Creating initial admin for user:", userId);
  
  try {
    // Try the create_admin RPC function first
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'create_admin',
      { new_admin_id: userId }
    );
    
    if (!rpcError && rpcData === true) {
      console.log("Admin user successfully created via RPC");
      return true;
    }
    
    if (rpcError) {
      console.warn("Error with RPC function:", rpcError);
      console.log("Trying standard approach as fallback...");
    }
    
    // Check if admin users already exist
    const { count, error } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
      
    if (error) {
      console.error("Error checking for existing admins:", error);
      return false;
    }
    
    const adminExists = count !== null && count > 0;
    console.log("Existing admins:", adminExists ? count : 0);
    
    if (adminExists) {
      console.log("Admin users already exist");
      return false;
    }
  
    // Direct insert of admin role
    return await addUserRole(userId, 'admin');
  } catch (error) {
    console.error("Error creating first administrator:", error);
    return false;
  }
};
