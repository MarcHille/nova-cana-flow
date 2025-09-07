
import React from "react";
import { User } from "@/types";
import { UserInfo } from "./UserInfo";
import UserRoleActions from "./UserRoleActions";
import UserVerificationStatus from "./UserVerificationStatus";
import { PharmacyVerification } from "@/pages/admin/pharmacy-verifications/types";

export interface UserListItemProps {
  user: User;
  onRefresh: () => Promise<void>;
  verification?: PharmacyVerification;
  onApproveVerification?: (id: string, userId: string) => Promise<void>;
  onRejectVerification?: (params: { id: string; rejectionReason: string; closeDialog: () => void }) => Promise<void>;
  onAddRole?: (userId: string, role: 'admin' | 'pharmacist') => Promise<void>;
  onRemoveRole?: (userId: string, role: 'admin' | 'pharmacist') => Promise<void>;
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onRefresh,
  verification,
  onApproveVerification,
  onRejectVerification,
  onAddRole,
  onRemoveRole
}) => {
  const isPharmacist = user.roles?.includes("pharmacist") || false;
  
  const handleRequestVerification = async (userId: string): Promise<boolean> => {
    // This will be handled by the parent component's onRequestVerification
    return true;
  };

  const handleAddRole = async (userId: string, role: 'admin' | 'pharmacist') => {
    if (onAddRole) {
      await onAddRole(userId, role);
    }
  };

  const handleRemoveRole = async (userId: string, role: 'admin' | 'pharmacist') => {
    if (onRemoveRole) {
      await onRemoveRole(userId, role);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UserInfo 
            userId={user.id}
            email={user.email}
            name={user.name}
            organization={user.pharmacyName}
            role={user.roles?.join(", ")}
            verification={verification}
            onDelete={onRefresh}
            onApproveVerification={onApproveVerification}
            onRejectVerification={onRejectVerification}
            onRequestVerification={handleRequestVerification}
          />
        </div>

        <div className="flex items-center gap-3">
          <UserVerificationStatus 
            userId={user.id}
            verificationStatus={user.verificationStatus}
            isPharmacist={isPharmacist}
            onRequestVerification={handleRequestVerification}
          />
          
          <UserRoleActions 
            userId={user.id}
            roles={user.roles || []}
            onAddRole={handleAddRole}
            onRemoveRole={handleRemoveRole}
            onRefreshUsers={onRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
