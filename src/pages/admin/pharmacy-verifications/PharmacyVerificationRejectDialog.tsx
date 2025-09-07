
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PharmacyVerification } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionReason: string;
  setRejectionReason: (val: string) => void;
  onReject: () => void;
}

const PharmacyVerificationRejectDialog: React.FC<Props> = ({
  open, onOpenChange, rejectionReason, setRejectionReason, onReject
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Verifikation ablehnen</DialogTitle>
        <DialogDescription>
          Bitte geben Sie einen Grund für die Ablehnung an.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Ablehnungsgrund..."
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Abbrechen
        </Button>
        <Button
          variant="destructive"
          onClick={onReject}
        >
          Ablehnen bestätigen
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default PharmacyVerificationRejectDialog;
