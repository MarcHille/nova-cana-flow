
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { User, Building, BellRing } from "lucide-react";
import { UserInfoDialog } from "./user-info/UserInfoDialog";
import { PharmacyVerification } from "@/pages/admin/pharmacy-verifications/types";

interface UserInfoProps {
  userId: string;
  email: string;
  name?: string;
  organization?: string;
  role?: string;
  verification?: PharmacyVerification;
  onDelete?: () => void;
  onApproveVerification?: (id: string, userId: string) => Promise<void>;
  onRejectVerification?: (params: { id: string; rejectionReason: string; closeDialog: () => void }) => Promise<void>;
  onRequestVerification?: (userId: string) => Promise<boolean>;
}

export const UserInfo: React.FC<UserInfoProps> = ({ 
  userId, 
  email, 
  name, 
  organization,
  role,
  verification,
  onDelete,
  onApproveVerification,
  onRejectVerification,
  onRequestVerification
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Display role or organization type for the user in admin view
  const getUserType = () => {
    if (role === 'pharmacist' || (organization && organization.includes('Apotheke'))) {
      return (
        <span className="inline-flex items-center text-blue-600">
          <Building className="h-3.5 w-3.5 mr-1" />
          Apotheke
        </span>
      );
    } else if (role === 'doctor') {
      return (
        <span className="inline-flex items-center text-green-600">
          <BellRing className="h-3.5 w-3.5 mr-1" />
          Arzt
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 h-10 px-3"
          title="Benutzerdetails anzeigen"
        >
          <User className="h-4 w-4" />
          Details
        </Button>
        
        <div className="flex flex-col">
          <span className="font-medium text-sm">{email}</span>
          {(name || organization) && (
            <span className="text-xs text-gray-500">
              {name || ''} {organization ? `(${organization})` : ''}
            </span>
          )}
          {getUserType()}
        </div>
      </div>

      <UserInfoDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        userId={userId}
        email={email}
        name={name}
        organization={organization}
        role={role}
        verification={verification}
        onDelete={onDelete}
        onApproveVerification={onApproveVerification}
        onRejectVerification={onRejectVerification}
        onRequestVerification={onRequestVerification}
      />
    </>
  );
};
