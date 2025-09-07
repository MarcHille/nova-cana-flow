
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserInfoActions } from "./UserInfoActions";
import { UserInfoTable } from "./UserInfoTable";
import { UserInfoSwitches } from "./UserInfoSwitches";
import { UserInfoExportDelete } from "./UserInfoExportDelete";
import { UserInfoVerificationTable } from "./UserInfoVerificationTable";
import { UserInfoVerificationActions } from "./UserInfoVerificationActions";
import { UserInfoOrdersButton } from "./UserInfoOrdersButton";
import { PharmacyVerification } from "@/pages/admin/pharmacy-verifications/types";

interface UserInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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

export const UserInfoDialog: React.FC<UserInfoDialogProps> = ({
  isOpen,
  onOpenChange,
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
  const [loading, setLoading] = useState(false);
  const [userBlocked, setUserBlocked] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(name || '');
  const [editedOrganization, setEditedOrganization] = useState(organization || '');
  const { toast } = useToast();

  const isPharmacist = role === 'pharmacist' || (role && role.includes('pharmacist'));

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.functions.invoke('update-user-metadata', {
        body: { 
          userId, 
          metadata: { 
            name: editedName,
            organizationName: editedOrganization 
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Änderungen gespeichert",
        description: "Die Benutzerdaten wurden erfolgreich aktualisiert."
      });
      
      setEditMode(false);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      toast({
        title: "Speichern fehlgeschlagen",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('export-user-data', {
        body: { userId }
      });

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${userId}.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export erfolgreich",
        description: "Die Benutzerdaten wurden erfolgreich exportiert."
      });
    } catch (error) {
      console.error('Fehler beim Exportieren:', error);
      toast({
        title: "Export fehlgeschlagen",
        description: "Die Benutzerdaten konnten nicht exportiert werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('toggle-user-block', {
        body: { userId, blocked: !userBlocked }
      });

      if (error) throw error;

      setUserBlocked(!userBlocked);
      toast({
        title: userBlocked ? "Benutzer entsperrt" : "Benutzer gesperrt",
        description: userBlocked 
          ? "Der Benutzer wurde erfolgreich entsperrt." 
          : "Der Benutzer wurde erfolgreich gesperrt."
      });
    } catch (error) {
      console.error('Fehler beim Sperren/Entsperren:', error);
      toast({
        title: "Aktion fehlgeschlagen",
        description: "Der Benutzer konnte nicht gesperrt/entsperrt werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Benutzer gelöscht",
        description: "Der Benutzer wurde erfolgreich gelöscht."
      });
      
      onOpenChange(false);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      toast({
        title: "Löschen fehlgeschlagen",
        description: "Der Benutzer konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed user information when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setEditedName(name || '');
      setEditedOrganization(organization || '');
      
      // Use the verification data passed as prop, or fetch if not available
      if (verification) {
        setUserDetails(verification);
      } else if (!userDetails) {
        const fetchUserDetails = async () => {
          try {
            setLoading(true);
            const { data, error } = await supabase
              .from('pharmacy_verification')
              .select('*')
              .eq('user_id', userId)
              .single();
              
            if (!error && data) {
              setUserDetails(data);
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchUserDetails();
      }
    }
  }, [isOpen, userId, name, organization, verification, userDetails]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Benutzerdetails
            <UserInfoActions
              editMode={editMode}
              loading={loading}
              onSave={handleSaveChanges}
              onCancel={() => setEditMode(false)}
              onEdit={() => setEditMode(true)}
            />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <UserInfoTable
            email={email}
            name={name}
            organization={organization}
            role={role}
            editMode={editMode}
            editedName={editedName}
            editedOrganization={editedOrganization}
            onNameChange={setEditedName}
            onOrganizationChange={setEditedOrganization}
          />
          
          {(userDetails || verification) && (
            <UserInfoVerificationTable userDetails={userDetails || verification} />
          )}
          
          <UserInfoVerificationActions
            userVerification={verification || userDetails}
            onApprove={onApproveVerification}
            onReject={onRejectVerification}
            onRequestVerification={onRequestVerification}
            userId={userId}
            isPharmacist={isPharmacist}
            loading={loading}
          />
          
          <UserInfoOrdersButton userId={userId} />
          
          <UserInfoSwitches
            userBlocked={userBlocked}
            loading={loading}
            onToggleBlock={handleToggleBlock}
          />
          
          <UserInfoExportDelete
            loading={loading}
            onExport={handleExportData}
            onDelete={handleDeleteUser}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
