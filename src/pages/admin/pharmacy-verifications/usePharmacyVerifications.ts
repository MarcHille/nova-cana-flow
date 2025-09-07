
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PharmacyVerification } from "./types";
import { useToast } from "@/hooks/use-toast";

export const usePharmacyVerifications = () => {
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<PharmacyVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVerifications = async () => {
    console.log("Loading pharmacy verifications...");
    setVerifications([]);
    setLoading(true);
    setError(null);

    try {
      // Get the session for the auth header
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("No active session found. Please log in again.");
      }
      
      console.log("Calling get-pharmacy-verifications edge function");
      
      // Call edge function with proper authentication
      const { data: verificationResponse, error: edgeFunctionError } = await supabase.functions.invoke(
        'get-pharmacy-verifications',
        {
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`
          }
        }
      );
      
      if (edgeFunctionError) {
        console.error("Error from edge function:", edgeFunctionError);
        setError(`Fehler beim Laden der Verifikationen: ${edgeFunctionError.message}`);
        setLoading(false);
        return;
      }
      
      if (!verificationResponse?.verifications || !Array.isArray(verificationResponse.verifications)) {
        console.log("No verifications found or invalid response format");
        setVerifications([]);
        setLoading(false);
        return;
      }

      console.log("Loaded verifications:", verificationResponse.verifications.length);
      setVerifications(verificationResponse.verifications);
    } catch (error: any) {
      console.error("Error in loadVerifications:", error);
      setError(`Ein unerwarteter Fehler ist aufgetreten: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const approveVerification = async (id: string, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get the session for the auth header
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("No active session found. Please log in again.");
      }
      
      console.log(`Approving verification ${id} for user ${userId}`);
      
      // Use edge function to handle approval
      const { data, error: approveError } = await supabase.functions.invoke(
        'manage-pharmacy-verification',
        {
          body: { action: 'approve', id, userId },
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`
          }
        }
      );
      
      if (approveError) {
        console.error("Error approving verification:", approveError);
        setError(`Fehler bei der Genehmigung: ${approveError.message}`);
        return;
      }

      toast({
        title: "Verifizierung genehmigt",
        description: "Die Apothekenverifizierung wurde erfolgreich genehmigt."
      });
      
      loadVerifications();
    } catch (error: any) {
      console.error("Error in approveVerification:", error);
      setError(`Ein unerwarteter Fehler ist aufgetreten: ${error.message}`);
      setLoading(false);
    }
  };

  const rejectVerification = async ({
    id,
    rejectionReason,
    closeDialog,
  }: {
    id: string;
    rejectionReason: string;
    closeDialog: () => void;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Get the session for the auth header
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("No active session found. Please log in again.");
      }
      
      console.log(`Rejecting verification ${id} with reason: ${rejectionReason}`);
      
      // Use edge function to handle rejection
      const { data, error: rejectError } = await supabase.functions.invoke(
        'manage-pharmacy-verification',
        {
          body: { action: 'reject', id, rejectionReason },
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`
          }
        }
      );
      
      if (rejectError) {
        console.error("Error rejecting verification:", rejectError);
        setError(`Fehler bei der Ablehnung: ${rejectError.message}`);
        setLoading(false);
        return;
      }

      toast({
        title: "Verifizierung abgelehnt",
        description: "Die Apothekenverifizierung wurde abgelehnt."
      });
      
      loadVerifications();
      closeDialog();
    } catch (error: any) {
      console.error("Error in rejectVerification:", error);
      setError(`Ein unerwarteter Fehler ist aufgetreten: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  return {
    verifications,
    loading,
    error,
    loadVerifications,
    approveVerification,
    rejectVerification,
  };
};
