
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertCircle, ShieldAlert } from "lucide-react";

interface VerificationBadgeProps {
  userId: string;
  isRequesting?: boolean;
  onRequestVerification?: () => void;
}

export const PendingVerificationBadge: React.FC = () => (
  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
    <AlertCircle className="h-3 w-3 mr-1" />
    Verifizierung ausstehend
  </Badge>
);

export const ApprovedVerificationBadge: React.FC = () => (
  <Badge variant="outline" className="bg-green-100 text-green-800">
    <CheckCircle className="h-3 w-3 mr-1" />
    Verifiziert
  </Badge>
);

export const RejectedVerificationBadge: React.FC = () => (
  <Badge variant="outline" className="bg-red-100 text-red-800">
    <XCircle className="h-3 w-3 mr-1" />
    Abgelehnt
  </Badge>
);

export const InvalidUserBadge: React.FC = () => (
  <Badge variant="destructive" className="bg-red-100 text-red-800">
    <ShieldAlert className="h-3 w-3 mr-1" />
    Ungültige Benutzer-ID
  </Badge>
);

export const LoadingBadge: React.FC = () => (
  <Badge variant="outline" className="bg-gray-100 text-gray-600">
    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
    Laden...
  </Badge>
);

export const RequestVerificationButton: React.FC<VerificationBadgeProps> = ({ 
  isRequesting = false, 
  onRequestVerification 
}) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onRequestVerification}
    disabled={isRequesting}
    className="hover:bg-purple-50 focus:ring-2 focus:ring-purple-200 focus:outline-none"
  >
    {isRequesting ? (
      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
    ) : (
      <AlertCircle className="h-3 w-3 mr-1" />
    )}
    Verifizierung beantragen
  </Button>
);
