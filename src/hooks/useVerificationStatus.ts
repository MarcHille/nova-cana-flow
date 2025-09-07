import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchVerificationStatus, isValidUuid, sanitizeUserId } from "@/utils/verificationStatusUtils";
import { supabase } from "@/integrations/supabase/client";

interface UseVerificationStatusProps {
  userId: string;
  verificationStatus?: string;
  isPharmacist: boolean;
  onRequestVerification: (userId: string) => Promise<boolean>;
}

export const useVerificationStatus = ({
  userId,
  verificationStatus: initialStatus,
  isPharmacist,
  onRequestVerification
}: UseVerificationStatusProps) => {
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<string | null>(initialStatus || null);
  
  // Sanitize userId and check validity
  const sanitizedUserId = sanitizeUserId(userId);
  const isValidId = isValidUuid(sanitizedUserId);

  // Fetch verification status when component mounts or props change
  useEffect(() => {
    const getVerificationStatus = async () => {
      if (!isValidId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log(`Fetching verification status for user ${sanitizedUserId}, isPharmacist=${isPharmacist}`);
        
        // Important fix: If user has pharmacist role, they are considered verified
        if (isPharmacist) {
          console.log(`User ${sanitizedUserId} has pharmacist role - considered verified`);
          setCurrentStatus('approved');
          setIsLoading(false);
          return;
        }

        // Otherwise, check the verification table for explicit status
        const verificationStatus = await fetchVerificationStatus(sanitizedUserId);
        
        if (verificationStatus) {
          console.log(`Found verification status: ${verificationStatus}`);
          setCurrentStatus(verificationStatus);
          
          // If approved but doesn't have pharmacist role yet, ensure role is assigned
          if (verificationStatus === 'approved') {
            try {
              // Check if user already has the pharmacist role
              const { data: roleData, error: roleError } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', sanitizedUserId)
                .eq('role', 'pharmacist')
                .maybeSingle();
                
              if (!roleError && !roleData) {
                console.log("User is approved but missing pharmacist role - fixing synchronization");
                // Assign pharmacist role via edge function
                await supabase.functions.invoke('manage-user-roles', {
                  body: { 
                    userId: sanitizedUserId,
                    role: 'pharmacist',
                    action: 'add'
                  }
                });
              }
            } catch (roleError) {
              console.error("Error synchronizing pharmacist role:", roleError);
            }
          }
        } else {
          console.log(`No verification record found for user ${sanitizedUserId}`);
          setCurrentStatus(null);
        }
      } catch (error) {
        console.error("Error in getVerificationStatus:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only run this check if we have all the data we need
    if (sanitizedUserId && isValidId) {
      getVerificationStatus();
    } else {
      setIsLoading(false);
    }
  }, [sanitizedUserId, isPharmacist, initialStatus, isValidId]);

  const handleRequestVerification = async () => {
    if (isRequesting || !isValidId) return;
    
    setIsRequesting(true);
    
    try {
      // Add a timeout to prevent DoS
      const requestTimeout = setTimeout(() => {
        setIsRequesting(false);
        toast({
          title: "Zeitüberschreitung",
          description: "Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      }, 15000);
      
      const success = await onRequestVerification(sanitizedUserId);
      clearTimeout(requestTimeout);
      
      if (!success) {
        toast({
          title: "Fehler",
          description: "Die Verifizierungsanleitung konnte nicht gesendet werden.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erfolg",
          description: "Die Verifizierungsanleitung wurde erfolgreich versendet.",
        });
        // Update the local status
        setCurrentStatus('pending');
      }
    } catch (error: any) {
      console.error("Error requesting verification:", error);
      
      // Sanitize error message to prevent XSS
      const errorMessage = error?.message 
        ? error.message.replace(/[<>]/g, '') 
        : "Die Verifizierungsanleitung konnte nicht gesendet werden.";
        
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    currentStatus,
    isLoading,
    isRequesting,
    isValidId,
    handleRequestVerification
  };
};
