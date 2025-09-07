
import { useState, useCallback } from 'react';
import { addUserRole, removeUserRole } from "@/utils/userRoleUtils";
import { useToast } from "@/hooks/use-toast";

export const useRoleManagement = (loadUsers: () => Promise<void>) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddRole = useCallback(async (userId: string, role: 'admin' | 'pharmacist') => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      console.log(`Füge Rolle ${role} für Benutzer ${userId} hinzu`);
      const success = await addUserRole(userId, role);
      
      if (success) {
        toast({
          title: "Rolle hinzugefügt",
          description: `Die Rolle "${role}" wurde dem Benutzer erfolgreich hinzugefügt.`
        });
        await loadUsers();
      } else {
        throw new Error("Die Rolle konnte nicht hinzugefügt werden.");
      }
    } catch (error: any) {
      console.error("Fehler beim Hinzufügen der Rolle:", error);
      toast({
        title: "Fehler",
        description: `${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [loadUsers, toast, isProcessing]);

  const handleRemoveRole = useCallback(async (userId: string, role: 'admin' | 'pharmacist') => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      console.log(`Entferne Rolle ${role} von Benutzer ${userId}`);
      const success = await removeUserRole(userId, role);
      
      if (success) {
        toast({
          title: "Rolle entfernt",
          description: `Die Rolle "${role}" wurde vom Benutzer erfolgreich entfernt.`
        });
        await loadUsers();
      } else {
        throw new Error("Die Rolle konnte nicht entfernt werden.");
      }
    } catch (error: any) {
      console.error("Fehler beim Entfernen der Rolle:", error);
      toast({
        title: "Fehler",
        description: `${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [loadUsers, toast, isProcessing]);

  return {
    handleAddRole,
    handleRemoveRole,
    isProcessing
  };
};
