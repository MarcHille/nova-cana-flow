
import React from "react";
import { User } from "@/types";
import UserListItem from "./UserListItem";
import { PharmacyVerification } from "@/pages/admin/pharmacy-verifications/types";

export interface UserListProps {
  users: User[];
  onAddRole: (userId: string, role: 'admin' | 'pharmacist') => Promise<void>;
  onRemoveRole: (userId: string, role: 'admin' | 'pharmacist') => Promise<void>;
  onRefreshUsers: () => Promise<void>;
  onRequestVerification: (userId: string) => Promise<boolean>;
  verifications?: PharmacyVerification[];
  onApproveVerification?: (id: string, userId: string) => Promise<void>;
  onRejectVerification?: (params: { id: string; rejectionReason: string; closeDialog: () => void }) => Promise<void>;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onAddRole,
  onRemoveRole,
  onRefreshUsers,
  onRequestVerification,
  verifications = [],
  onApproveVerification,
  onRejectVerification
}) => {
  return (
    <div className="space-y-4 mb-4">
      {users.map((user) => {
        // Find verification for this user
        const userVerification = verifications.find(v => v.user_id === user.id);
        
        return (
          <UserListItem 
            key={user.id} 
            user={user} 
            onRefresh={onRefreshUsers}
            verification={userVerification}
            onApproveVerification={onApproveVerification}
            onRejectVerification={onRejectVerification}
            onAddRole={onAddRole}
            onRemoveRole={onRemoveRole}
          />
        );
      })}
    </div>
  );
};

export default UserList;
