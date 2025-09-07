
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { requestPharmacyVerification } from '@/utils/pharmacistRoleUtils';

export const usePharmacyVerification = (loadUsers: () => Promise<void>) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  // Rate limiting function to prevent abuse
  const shouldThrottleRequest = () => {
    const now = Date.now();
    const minInterval = 5000; // 5 seconds minimum between requests
    if (now - lastRequestTime < minInterval) {
      console.log("Request throttled due to rate limiting");
      return true;
    }
    setLastRequestTime(now);
    return false;
  };

  const handleRequestVerification = useCallback(async (userId: string): Promise<void> => {
    if (isProcessing) {
      console.log("Request rejected: Another request is already processing");
      throw new Error("Eine andere Anfrage wird bereits verarbeitet");
    }
    
    // Apply rate limiting to prevent abuse
    if (shouldThrottleRequest()) {
      toast({
        title: "Zu viele Anfragen",
        description: "Bitte warten Sie einen Moment, bevor Sie eine weitere Anfrage stellen.",
        variant: "destructive"
      });
      throw new Error("Zu viele Anfragen in kurzer Zeit");
    }
    
    try {
      // Prevent multiple simultaneous requests
      setIsProcessing(true);
      
      // Validate userId input before processing
      if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        console.error("Invalid userId provided:", userId);
        throw new Error("Ungültige Benutzer-ID");
      }
      
      // Sanitize userId by trimming whitespace
      const sanitizedUserId = userId.trim();
      console.log(`Beantrage Verifizierung für Benutzer ${sanitizedUserId}`);
      
      // Call the requestPharmacyVerification function from pharmacistRoleUtils
      const success = await requestPharmacyVerification(sanitizedUserId);
      
      if (success) {
        console.log("Verification request successful");
        await loadUsers();
        toast({
          title: "Erfolg",
          description: "Die Verifizierungsanfrage wurde erfolgreich gesendet."
        });
      } else {
        console.error("Verification request failed");
        throw new Error("Die Verifizierungsanfrage konnte nicht erstellt werden");
      }
    } catch (error: any) {
      console.error("Fehler bei der Verifizierungsanfrage:", error);
      toast({
        title: "Fehler",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [loadUsers, toast, isProcessing, lastRequestTime]);

  return {
    requestPharmacyVerification: handleRequestVerification,
    isProcessing
  };
};
