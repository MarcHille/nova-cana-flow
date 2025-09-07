
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, UserCheck } from "lucide-react";

interface UserRoleActionsProps {
  userId: string;
  roles: string[];
  onAddRole: (userId: string, role: 'admin' | 'pharmacist') => Promise<void>;
  onRemoveRole: (userId: string, role: 'admin' | 'pharmacist') => Promise<void>;
  onRefreshUsers?: () => Promise<void>;
}

const UserRoleActions: React.FC<UserRoleActionsProps> = ({ 
  userId, 
  roles, 
  onAddRole, 
  onRemoveRole, 
  onRefreshUsers 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Validate that userId is a proper UUID to prevent injection
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  
  // Validate roles is actually an array
  const validRoles = Array.isArray(roles) ? roles : [];
  
  // Security-enhanced role management
  const handleAddRole = async (role: 'admin' | 'pharmacist') => {
    if (!isValidUUID || isLoading || !['admin', 'pharmacist'].includes(role)) {
      console.error("Invalid user ID, role type, or operation in progress");
      return;
    }
    
    try {
      setIsLoading(true);
      await onAddRole(userId, role);
      if (onRefreshUsers) {
        await onRefreshUsers();
      }
    } catch (error) {
      console.error("Error adding role:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveRole = async (role: 'admin' | 'pharmacist') => {
    if (!isValidUUID || isLoading || !['admin', 'pharmacist'].includes(role)) {
      console.error("Invalid user ID, role type, or operation in progress");
      return;
    }
    
    try {
      setIsLoading(true);
      await onRemoveRole(userId, role);
      if (onRefreshUsers) {
        await onRefreshUsers();
      }
    } catch (error) {
      console.error("Error removing role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      {/* Admin Role */}
      {validRoles.includes('admin') ? (
        <Button
          onClick={() => handleRemoveRole('admin')}
          variant="default"
          size="sm"
          className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600"
          disabled={isLoading || !isValidUUID}
          title="Admin-Rolle entfernen"
        >
          <Shield size={14} />
          Admin
        </Button>
      ) : (
        <Button
          onClick={() => handleAddRole('admin')}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          disabled={isLoading || !isValidUUID}
          title="Admin-Rolle zuweisen"
        >
          <Shield size={14} />
          Admin
        </Button>
      )}
      
      {/* Pharmacist Role */}
      {validRoles.includes('pharmacist') ? (
        <Button
          onClick={() => handleRemoveRole('pharmacist')}
          variant="default"
          size="sm"
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
          disabled={isLoading || !isValidUUID}
          title="Apotheker-Rolle entfernen"
        >
          <UserCheck size={14} />
          Apotheker
        </Button>
      ) : (
        <Button
          onClick={() => handleAddRole('pharmacist')}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          disabled={isLoading || !isValidUUID}
          title="Apotheker-Rolle zuweisen"
        >
          <UserCheck size={14} />
          Apotheker
        </Button>
      )}
    </div>
  );
};

export default UserRoleActions;
