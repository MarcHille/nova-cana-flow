
import React, { Dispatch, SetStateAction } from "react";
import { CardContent } from "@/components/ui/card";
import { Clock, AlertCircle, RefreshCw } from "lucide-react";
import PharmacyVerificationTable from "./PharmacyVerificationTable";
import { PharmacyVerification } from "./types";
import { Button } from "@/components/ui/button";

interface Props {
  loading: boolean;
  verifications: PharmacyVerification[];
  error: string | null;
  rejectionReason: string;
  setRejectionReason: Dispatch<SetStateAction<string>>;
  onApprove: (id: string, userId: string) => void;
  onRejectOpen: (verification: PharmacyVerification) => void;
  onRetry: () => void;
}

const PharmacyVerificationsList: React.FC<Props> = ({
  loading,
  verifications,
  error,
  rejectionReason,
  setRejectionReason,
  onApprove,
  onRejectOpen,
  onRetry,
}) => (
  <CardContent>
    {loading ? (
      <div className="py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    ) : (
      <>
        {error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-gray-700 mb-4">Es ist ein Fehler beim Laden der Verifikationen aufgetreten.</p>
            <Button onClick={onRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </Button>
          </div>
        ) : verifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Keine Verifizierungsanfragen vorhanden</p>
          </div>
        ) : (
          <PharmacyVerificationTable
            verifications={verifications}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            onApprove={onApprove}
            onRejectOpen={onRejectOpen}
          />
        )}
      </>
    )}
  </CardContent>
);

export default PharmacyVerificationsList;
