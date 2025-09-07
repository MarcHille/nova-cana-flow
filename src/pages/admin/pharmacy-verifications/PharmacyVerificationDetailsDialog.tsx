
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react";
import { PharmacyVerification } from "./types";

interface Props {
  verification: PharmacyVerification;
  rejectionReason: string;
  setRejectionReason: (val: string) => void;
  onApprove: (id: string, userId: string) => void;
  onRejectOpen: () => void;
}

const PharmacyVerificationDetailsDialog: React.FC<Props> = ({
  verification, rejectionReason, setRejectionReason, onApprove, onRejectOpen
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm">
        <Eye className="h-4 w-4 mr-1" />
        Details
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Verifizierungsdetails</DialogTitle>
        <DialogDescription>
          Überprüfen Sie die Apothekeninformationen und Dokumente
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-sm mb-1">Apotheke</h3>
            <p>{verification.contact_details.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-1">Betriebserlaubnis</h3>
            <p>{verification.license_id}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-1">Anschrift</h3>
            <p>{verification.contact_details.address}, {verification.contact_details.postalCode} {verification.contact_details.city}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-1">Telefon</h3>
            <p>{verification.contact_details.phone}</p>
          </div>
          {verification.contact_details.contactPerson && (
            <div>
              <h3 className="font-medium text-sm mb-1">Ansprechpartner</h3>
              <p>{verification.contact_details.contactPerson}</p>
            </div>
          )}
          {verification.contact_details.email && (
            <div>
              <h3 className="font-medium text-sm mb-1">E-Mail</h3>
              <p>{verification.contact_details.email}</p>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-sm mb-2">Hochgeladene Dokumente</h3>
          <div className="grid grid-cols-1 gap-2">
            {verification.business_documents.map((doc, index) => (
              <a
                key={index}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 border rounded hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2 text-gray-500" />
                Dokument {index + 1} anzeigen
              </a>
            ))}
          </div>
        </div>
        {verification.verification_status.toLowerCase() === 'pending' && (
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-600"
              onClick={onRejectOpen}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Ablehnen
            </Button>
            <Button
              variant="default"
              onClick={() => onApprove(verification.id, verification.user_id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Genehmigen
            </Button>
          </div>
        )}
        {verification.verification_status.toLowerCase() === 'rejected' && verification.rejection_reason && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <h3 className="font-medium text-sm text-red-800 mb-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Ablehnungsgrund
            </h3>
            <p className="text-sm text-red-700">{verification.rejection_reason}</p>
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

export default PharmacyVerificationDetailsDialog;
