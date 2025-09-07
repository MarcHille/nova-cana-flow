
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { UserX } from "lucide-react";

interface UserInfoSwitchesProps {
  userBlocked: boolean;
  loading: boolean;
  onToggleBlock: () => void;
}

export const UserInfoSwitches: React.FC<UserInfoSwitchesProps> = ({
  userBlocked,
  loading,
  onToggleBlock
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <UserX className="h-4 w-4" />
          Benutzer sperren
        </span>
        <Switch 
          checked={userBlocked} 
          onCheckedChange={onToggleBlock}
          disabled={loading}
        />
      </div>
    </div>
  );
};
