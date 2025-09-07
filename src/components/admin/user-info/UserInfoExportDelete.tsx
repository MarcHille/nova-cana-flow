
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

interface UserInfoExportDeleteProps {
  loading: boolean;
  onExport: () => void;
  onDelete: () => void;
}

export const UserInfoExportDelete: React.FC<UserInfoExportDeleteProps> = ({
  loading,
  onExport,
  onDelete
}) => {
  return (
    <div className="flex gap-4 mt-6">
      <Button 
        variant="secondary"
        onClick={onExport}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Daten exportieren
      </Button>
      
      <Button 
        variant="destructive"
        onClick={onDelete}
        disabled={loading}
        className="flex items-center gap-2 ml-auto"
      >
        <Trash2 className="h-4 w-4" />
        Benutzer löschen
      </Button>
    </div>
  );
};
