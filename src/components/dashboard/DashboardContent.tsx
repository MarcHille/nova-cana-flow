
import React from "react";
import { useNavigate } from "react-router-dom";
import FirstAdminSetup from "@/components/auth/FirstAdminSetup";
import PharmacyVerification from "@/components/auth/PharmacyVerification";
import RecentOrders from "@/components/dashboard/RecentOrders";
import VerificationSuccessAlert from "@/components/dashboard/VerificationSuccessAlert";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface DashboardContentProps {
  loading: boolean;
  userId: string | null;
  isAdmin: boolean;
  isPharmacist: boolean;
  isVerifiedPharmacist: boolean;
  isDoctor: boolean;
  adminExists: boolean;
  verificationJustCompleted: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  loading,
  userId,
  isAdmin,
  isPharmacist,
  isVerifiedPharmacist,
  isDoctor,
  adminExists,
  verificationJustCompleted
}) => {
  const navigate = useNavigate();
  
  if (loading) return null;
  
  const handleNavigateToPharmacyManagement = () => {
    navigate('/pharmacy-management');
  };
  
  return (
    <>
      {/* Show verification success message if just verified */}
      {userId && isPharmacist && isVerifiedPharmacist && verificationJustCompleted && (
        <VerificationSuccessAlert />
      )}
      
      {/* Nur Admin-Einrichtungskomponente anzeigen, wenn noch keine Administratoren existieren
          und der Benutzer selbst kein Admin ist */}
      {userId && !isAdmin && !adminExists && (
        <FirstAdminSetup />
      )}

      {/* Apotheken-Verifizierungskomponente - nur für nicht-verifizierte Apotheker anzeigen */}
      {userId && isPharmacist && !isVerifiedPharmacist && !isAdmin && (
        <PharmacyVerification userId={userId} />
      )}

      {/* Verifizierte Apotheker: Link zur Apothekerverwaltung zeigen */}
      {userId && isPharmacist && isVerifiedPharmacist && !isAdmin && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Apothekerbereich</h2>
          <p className="mb-4">Willkommen in Ihrem Apothekerbereich. Hier finden Sie Ihre Bestellungen und Dokumente.</p>
          
          <div className="mb-6">
            <Button 
              onClick={handleNavigateToPharmacyManagement}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Building2 size={18} />
              Zur Apothekenverwaltung
            </Button>
          </div>
          
          <RecentOrders />
        </div>
      )}
      
      {/* Für Admins spezifischen Admin-Hinweis zeigen */}
      {userId && isAdmin && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Administrationshinweise</h2>
          <p className="mb-4">Verwenden Sie die Admin-Navigation, um auf alle Administratorfunktionen zuzugreifen.</p>
        </div>
      )}
    </>
  );
};

export default DashboardContent;
