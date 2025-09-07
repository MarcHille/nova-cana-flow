
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { transformRpcUser, transformEdgeFunctionUser } from "./userTransformUtils";

export const fetchUsersViaRpc = async (limit: number = 100, offset: number = 0): Promise<User[] | null> => {
  try {
    console.log("Attempting to fetch users via RPC function...");
    
    // First ensure our fix function ran successfully
    const { error: fixError } = await supabase.functions.invoke('fix-get-users-rpc');
    
    if (fixError) {
      console.warn("Error running fix function:", fixError);
    } else {
      console.log("Fix function executed successfully");
    }
    
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'get_users_with_roles',
      { _limit: limit, _offset: offset }
    );

    if (!rpcError && Array.isArray(rpcData)) {
      console.log(`Received ${rpcData.length} users from RPC function`);
      
      const transformedUsers = rpcData.map(transformRpcUser) as User[];
      return transformedUsers;
    }
    
    if (rpcError) {
      console.warn("Error using RPC function for user management:", rpcError);
      return null;
    }
    
    return null;
  } catch (error) {
    console.error("Error in fetchUsersViaRpc:", error);
    return null;
  }
};

export const fetchUsersViaEdgeFunction = async (limit: number = 100, offset: number = 0): Promise<User[]> => {
  // Check if we have an authenticated session before proceeding
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error("No active session found. Please log in again.");
  }
  
  // Get users via edge function with admin verification
  const { data: usersResponse, error: usersError } = await supabase.functions.invoke(
    'get-users',
    {
      body: { 
        limit,
        offset
      }
    }
  );
  
  if (usersError) {
    console.error("Edge function error:", usersError);
    throw new Error(`Error loading users: ${usersError.message}`);
  }
  
  if (!usersResponse || !Array.isArray(usersResponse.users)) {
    console.error("Invalid response format:", usersResponse);
    throw new Error("Invalid response format from server");
  }
  
  console.log(`Received ${usersResponse.users.length} users from Edge Function`);
  
  // Transform the response to our User format
  const transformedUsers = usersResponse.users.map(transformEdgeFunctionUser);
  
  return transformedUsers;
};

export const deleteUserById = async (userId: string): Promise<void> => {
  const { error: deleteError } = await supabase.functions.invoke(
    'delete-user',
    {
      body: { userId }
    }
  );
  
  if (deleteError) {
    throw new Error(`Error deleting user: ${deleteError.message}`);
  }
};
