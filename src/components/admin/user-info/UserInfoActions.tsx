
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface UserInfoActionsProps {
  editMode: boolean;
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export const UserInfoActions: React.FC<UserInfoActionsProps> = ({
  editMode,
  loading,
  onSave,
  onCancel,
  onEdit
}) => {
  return (
    <div className="flex gap-2">
      {editMode ? (
        <>
          <Button 
            size="sm" 
            onClick={onSave}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Speichern
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Abbrechen
          </Button>
        </>
      ) : (
        <Button 
          size="sm" 
          variant="outline"
          onClick={onEdit}
        >
          Bearbeiten
        </Button>
      )}
    </div>
  );
};
