
import { Button } from "@/components/ui/button";
import { RefreshCw, UserPlus } from "lucide-react";

interface UserManagementActionsProps {
  onCreateUser: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const UserManagementActions = ({ onCreateUser, onRefresh, isLoading }: UserManagementActionsProps) => {
  return (
    <div className="mb-4 flex justify-between">
      <Button 
        onClick={onCreateUser} 
        className="flex items-center gap-2"
      >
        <UserPlus size={16} />
        Neuen Benutzer erstellen
      </Button>
      
      <Button 
        onClick={onRefresh} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        disabled={isLoading}
      >
        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
        Aktualisieren
      </Button>
    </div>
  );
};

export default UserManagementActions;
