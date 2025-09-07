
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import PharmacyVerificationsHeader from "./pharmacy-verifications/PharmacyVerificationsHeader";
import PharmacyVerificationsList from "./pharmacy-verifications/PharmacyVerificationsList";
import PharmacyVerificationRejectDialog from "./pharmacy-verifications/PharmacyVerificationRejectDialog";
import { PharmacyVerification } from "./pharmacy-verifications/types";
import { usePharmacyVerifications } from "./pharmacy-verifications/usePharmacyVerifications";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PharmacyVerifications: React.FC = () => {
  const { toast } = useToast();
  const [selectedVerification, setSelectedVerification] = useState<PharmacyVerification | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const {
    verifications,
    loading,
    error,
    loadVerifications,
    approveVerification,
    rejectVerification,
  } = usePharmacyVerifications();

  // Automatisch neu laden bei Fehler
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        console.log("Automatischer Neuversuch nach Fehler...");
        loadVerifications();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, loadVerifications]);

  // Add a retry handler for errors
  const handleRetry = () => {
    toast({
      title: "Lade Daten neu",
      description: "Die Apothekenverifizierungen werden neu geladen."
    });
    loadVerifications();
  };

  return (
    <AdminLayout title="Apothekenverifizierung">
      <div>
        <PharmacyVerificationsHeader onReload={loadVerifications} />
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="flex items-center gap-1"
                >
                  <RefreshCcw className="h-4 w-4" /> Erneut versuchen
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <PharmacyVerificationsList
          loading={loading}
          verifications={verifications}
          error={error}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onApprove={approveVerification}
          onRejectOpen={(verification) => {
            setSelectedVerification(verification);
            setRejectionReason("");
            setRejectDialogOpen(true);
          }}
          onRetry={handleRetry}
        />
        
        <PharmacyVerificationRejectDialog
          open={rejectDialogOpen}
          onOpenChange={(open) => {
            setRejectDialogOpen(open);
            if (!open) setSelectedVerification(null);
          }}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onReject={() =>
            selectedVerification &&
            rejectVerification({
              id: selectedVerification.id,
              rejectionReason,
              closeDialog: () => {
                setRejectionReason("");
                setSelectedVerification(null);
                setRejectDialogOpen(false);
              },
            })
          }
        />
      </div>
    </AdminLayout>
  );
};

export default PharmacyVerifications;
