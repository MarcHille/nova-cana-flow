
import React, { useCallback, useState, useEffect } from "react";
import CreateUserDialog from "./CreateUserDialog";
import UserList from "./UserList";
import UserManagementError from "./UserManagementError";
import UserManagementActions from "./UserManagementActions";
import UserListSkeleton from "./UserListSkeleton";
import EmptyUserState from "./EmptyUserState";
import UserSecurityInfo from "./UserSecurityInfo";
import UserSearchFilter from "./UserSearchFilter";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useUserCreation } from "@/hooks/useUserCreation";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { usePharmacyVerification } from "@/hooks/usePharmacyVerification";
import { usePharmacyVerifications } from "@/pages/admin/pharmacy-verifications/usePharmacyVerifications";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserRoleManagerProps {
  onError?: (error: string | null) => void;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ onError }) => {
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  // User management hooks
  const userManagementOptions = {
    initialLoad: true,
    onError: onError,
    maxRetries: 1,
    showToasts: false
  };
  
  const { users, loading, error, loadUsers } = useUserManagement(userManagementOptions);
  const { handleCreateUser, isSubmitting } = useUserCreation(loadUsers);
  const { handleAddRole, handleRemoveRole, isProcessing: isRoleProcessing } = useRoleManagement(loadUsers);
  const { requestPharmacyVerification, isProcessing: isVerificationProcessing } = usePharmacyVerification(loadUsers);
  
  // Pharmacy verification hooks
  const {
    verifications,
    loading: verificationsLoading,
    error: verificationsError,
    loadVerifications,
    approveVerification,
    rejectVerification,
  } = usePharmacyVerifications();

  // Load verifications only once when component mounts
  useEffect(() => {
    if (isAdmin) {
      loadVerifications();
    }
  }, [isAdmin]); // Remove loadVerifications from dependencies to prevent loop
  
  // Enhanced error handling with admin role check
  useEffect(() => {
    if (!isAdmin && !loading) {
      if (onError) {
        onError("You do not have administrative privileges to access this feature.");
      }
    }
  }, [isAdmin, loading, onError]);
  
  // Show one consolidated error message
  useEffect(() => {
    if (error) {
      console.error("UserRoleManager error:", error);
      
      toast({
        title: "Fehler beim Laden der Benutzer",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Enhanced filter function for better search including pharmacy name and location
  const filteredUsers = users?.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = user.email.toLowerCase().includes(searchLower) ||
                         (user.name && user.name.toLowerCase().includes(searchLower)) ||
                         (user.pharmacyName && user.pharmacyName.toLowerCase().includes(searchLower));
    
    const metadata = user.raw_user_meta_data || {};
    const additionalMatches = (metadata.organizationName && metadata.organizationName.toLowerCase().includes(searchLower)) ||
                             (metadata.city && metadata.city.toLowerCase().includes(searchLower)) ||
                             (metadata.location && metadata.location.toLowerCase().includes(searchLower)) ||
                             (metadata.pharmacy_name && metadata.pharmacy_name.toLowerCase().includes(searchLower));
    
    const totalMatches = matchesSearch || additionalMatches;
    
    const matchesRole = selectedRole === "all" || 
                       (selectedRole === "admin" && user.roles?.includes("admin")) ||
                       (selectedRole === "pharmacist" && user.roles?.includes("pharmacist")) ||
                       (selectedRole === "user" && (!user.roles || user.roles.length === 0 || (user.roles.length === 1 && user.roles.includes("user")))) ||
                       (selectedRole === "pending" && user.verificationStatus === "pending");
    
    return totalMatches && matchesRole;
  }) || [];

  const handleCreateUserClick = useCallback(() => {
    setCreateUserOpen(true);
  }, []);

  const handleCreateUserSubmit = useCallback(async (values) => {
    try {
      await handleCreateUser(values);
      setCreateUserOpen(false);
      
      setTimeout(async () => {
        await loadUsers();
      }, 1000);
    } catch (error) {
      console.error("Error in handleCreateUserSubmit:", error);
    }
  }, [handleCreateUser, loadUsers]);

  const handleRequestVerification = useCallback(async (userId: string): Promise<boolean> => {
    try {
      await requestPharmacyVerification(userId);
      return true;
    } catch (error) {
      console.error("Error requesting pharmacy verification:", error);
      return false;
    }
  }, [requestPharmacyVerification]);

  const handleManualRefresh = useCallback(() => {
    console.log("Manual refresh triggered");
    loadUsers();
    if (isAdmin) {
      loadVerifications();
    }
  }, [loadUsers, loadVerifications, isAdmin]);

  const isAnyProcessing = isSubmitting || isRoleProcessing || isVerificationProcessing;

  if (!isAdmin && !loading) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md text-center">
        <h3 className="text-lg font-medium text-red-800">Zugriff verweigert</h3>
        <p className="mt-2 text-red-700">
          Sie benötigen Administratorrechte, um auf diesen Bereich zuzugreifen.
        </p>
      </div>
    );
  }

  return (
    <div>
      <UserManagementError error={error} />
      
      <UserManagementActions 
        onCreateUser={handleCreateUserClick}
        onRefresh={handleManualRefresh}
        isLoading={loading || isAnyProcessing}
      />
      
      <CreateUserDialog 
        open={createUserOpen} 
        onOpenChange={setCreateUserOpen}
        onCreateUser={handleCreateUserSubmit} 
      />
      
      {!loading && users && users.length > 0 && (
        <UserSearchFilter 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRole={selectedRole}
          onRoleFilterChange={setSelectedRole}
          showPendingFilter={true}
        />
      )}
      
      {loading ? (
        <UserListSkeleton />
      ) : (
        <>
          {filteredUsers && filteredUsers.length > 0 && (
            <UserList 
              users={filteredUsers as User[]} 
              onAddRole={handleAddRole}
              onRemoveRole={handleRemoveRole}
              onRefreshUsers={loadUsers}
              onRequestVerification={handleRequestVerification}
              verifications={verifications}
              onApproveVerification={approveVerification}
              onRejectVerification={rejectVerification}
            />
          )}
          
          {(!users || users.length === 0) && !loading && !error && (
            <EmptyUserState />
          )}
          
          {users && users.length > 0 && filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Keine Benutzer gefunden, die den Suchkriterien entsprechen.
              </p>
            </div>
          )}
          
          <UserSecurityInfo />
        </>
      )}
    </div>
  );
};

export default UserRoleManager;
