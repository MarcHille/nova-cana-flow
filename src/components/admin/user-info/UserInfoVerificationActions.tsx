
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, FileCheck } from "lucide-react";
import { PharmacyVerification } from "@/pages/admin/pharmacy-verifications/types";

interface UserInfoVerificationActionsProps {
  userVerification?: PharmacyVerification;
  onApprove?: (id: string, userId: string) => Promise<void>;
  onReject?: (params: { id: string; rejectionReason: string; closeDialog: () => void }) => Promise<void>;
  onRequestVerification?: (userId: string) => Promise<boolean>;
  userId: string;
  isPharmacist: boolean;
  loading?: boolean;
}

export const UserInfoVerificationActions: React.FC<UserInfoVerificationActionsProps> = ({
  userVerification,
  onApprove,
  onReject,
  onRequestVerification,
  userId,
  isPharmacist,
  loading = false
}) => {
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [showRejectForm, setShowRejectForm] = React.useState(false);

  const getVerificationStatusBadge = () => {
    if (!userVerification) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Keine Verifizierung
        </Badge>
      );
    }

    switch (userVerification.verification_status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-700">
            <Clock className="h-3 w-3" />
            Ausstehend
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-700">
            <CheckCircle className="h-3 w-3" />
            Genehmigt
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-red-500 text-red-700">
            <XCircle className="h-3 w-3" />
            Abgelehnt
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Unbekannt
          </Badge>
        );
    }
  };

  const handleApprove = async () => {
    if (userVerification && onApprove) {
      await onApprove(userVerification.id, userId);
    }
  };

  const handleRejectSubmit = async () => {
    if (userVerification && onReject && rejectionReason.trim()) {
      await onReject({
        id: userVerification.id,
        rejectionReason: rejectionReason.trim(),
        closeDialog: () => {
          setShowRejectForm(false);
          setRejectionReason("");
        }
      });
    }
  };

  const handleRequestVerification = async () => {
    if (onRequestVerification) {
      await onRequestVerification(userId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Verifizierungsstatus</h4>
        {getVerificationStatusBadge()}
      </div>

      {/* Show verification actions based on status */}
      {userVerification?.verification_status === "pending" && onApprove && onReject && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={handleApprove}
              disabled={loading}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Genehmigen
            </Button>
            <Button
              onClick={() => setShowRejectForm(true)}
              disabled={loading}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Ablehnen
            </Button>
          </div>

          {showRejectForm && (
            <div className="border rounded-md p-3 bg-red-50">
              <label className="block text-sm font-medium mb-2">
                Ablehnungsgrund:
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                rows={3}
                placeholder="Bitte geben Sie einen Grund für die Ablehnung an..."
              />
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={handleRejectSubmit}
                  disabled={!rejectionReason.trim() || loading}
                  size="sm"
                  variant="destructive"
                >
                  Ablehnung bestätigen
                </Button>
                <Button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason("");
                  }}
                  size="sm"
                  variant="outline"
                >
                  Abbrechen
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show request verification button if no verification exists and user is pharmacist */}
      {!userVerification && isPharmacist && onRequestVerification && (
        <Button
          onClick={handleRequestVerification}
          disabled={loading}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileCheck className="h-4 w-4" />
          Verifizierung beantragen
        </Button>
      )}

      {/* Show rejection reason if rejected */}
      {userVerification?.verification_status === "rejected" && userVerification.rejection_reason && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <h5 className="font-medium text-red-800 mb-1">Ablehnungsgrund:</h5>
          <p className="text-sm text-red-700">{userVerification.rejection_reason}</p>
        </div>
      )}
    </div>
  );
};
