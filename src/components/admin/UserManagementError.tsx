
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UserManagementErrorProps {
  error: string | null;
}

const UserManagementError = ({ error }: UserManagementErrorProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Fehler beim Laden der Daten</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default UserManagementError;
