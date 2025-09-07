
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

interface UserInfoVerificationTableProps {
  userDetails: any;
}

export const UserInfoVerificationTable: React.FC<UserInfoVerificationTableProps> = ({
  userDetails
}) => {
  if (!userDetails?.contact_details) {
    return null;
  }

  const handleDownloadDocument = (documentUrl: string) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2}>Verifizierungsdaten</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userDetails.contact_details.name && (
            <TableRow>
              <TableCell className="font-medium">Kontaktperson</TableCell>
              <TableCell>{userDetails.contact_details.name}</TableCell>
            </TableRow>
          )}
          {userDetails.contact_details.address && (
            <TableRow>
              <TableCell className="font-medium">Adresse</TableCell>
              <TableCell>
                {userDetails.contact_details.address}, 
                {userDetails.contact_details.postalCode} {userDetails.contact_details.city}
              </TableCell>
            </TableRow>
          )}
          {userDetails.contact_details.phone && (
            <TableRow>
              <TableCell className="font-medium">Telefon</TableCell>
              <TableCell>{userDetails.contact_details.phone}</TableCell>
            </TableRow>
          )}
          {userDetails.license_id && (
            <TableRow>
              <TableCell className="font-medium">Lizenznummer</TableCell>
              <TableCell>{userDetails.license_id}</TableCell>
            </TableRow>
          )}
          {userDetails.verification_status && (
            <TableRow>
              <TableCell className="font-medium">Verifizierungsstatus</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  userDetails.verification_status === 'approved' ? 'bg-green-100 text-green-800' :
                  userDetails.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {userDetails.verification_status === 'approved' ? 'Genehmigt' :
                   userDetails.verification_status === 'pending' ? 'Ausstehend' : 'Abgelehnt'}
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {userDetails.business_documents && userDetails.business_documents.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Apothekenbetriebserlaubnis
          </h4>
          <div className="space-y-2">
            {userDetails.business_documents.map((doc: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleDownloadDocument(doc)}
                className="flex items-center gap-2"
              >
                <Download className="h-3 w-3" />
                Dokument {index + 1} herunterladen
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
