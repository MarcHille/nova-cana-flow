
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PharmacyVerificationDetailsDialog from "./PharmacyVerificationDetailsDialog";
import { PharmacyVerification } from "./types";
import { CheckCircle, XCircle, Eye } from "lucide-react";

interface Props {
  verifications: PharmacyVerification[];
  rejectionReason: string;
  setRejectionReason: (val: string) => void;
  onApprove: (id: string, userId: string) => void;
  onRejectOpen: (verification: PharmacyVerification) => void;
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Ausstehend</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Genehmigt</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-100 text-red-800">Abgelehnt</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

const PharmacyVerificationTable: React.FC<Props> = ({
  verifications, rejectionReason, setRejectionReason, onApprove, onRejectOpen
}) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Apotheke</TableHead>
          <TableHead>Betriebserlaubnis</TableHead>
          <TableHead>Kontakt</TableHead>
          <TableHead>Datum</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {verifications.map((verification) => (
          <TableRow key={verification.id}>
            <TableCell>
              <div className="font-medium">{verification.contact_details.name}</div>
              <div className="text-sm text-gray-500">{verification.user_email}</div>
            </TableCell>
            <TableCell>{verification.license_id}</TableCell>
            <TableCell>
              <div className="text-sm">
                {verification.contact_details.address}, {verification.contact_details.postalCode} {verification.contact_details.city}
              </div>
              <div className="text-sm">{verification.contact_details.phone}</div>
            </TableCell>
            <TableCell>
              {new Date(verification.submitted_at).toLocaleDateString('de-DE')}
            </TableCell>
            <TableCell>
              {getStatusBadge(verification.verification_status)}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <PharmacyVerificationDetailsDialog
                  verification={verification}
                  rejectionReason={rejectionReason}
                  setRejectionReason={setRejectionReason}
                  onApprove={onApprove}
                  onRejectOpen={() => onRejectOpen(verification)}
                />
                {verification.verification_status.toLowerCase() === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApprove(verification.id, verification.user_id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Genehmigen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onRejectOpen(verification)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Ablehnen
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default PharmacyVerificationTable;
