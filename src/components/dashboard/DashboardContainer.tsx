
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardCards from "@/components/dashboard/DashboardCards";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardContainerProps {
  loading: boolean;
  fetchError: string | null;
  handleRetry: () => void;
  verificationJustCompleted: boolean;
  userId: string | null;
  isAdmin: boolean;
  isPharmacist: boolean;
  isVerifiedPharmacist: boolean;
  isDoctor: boolean;
  adminExists: boolean;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  loading,
  fetchError,
  handleRetry,
  verificationJustCompleted,
  userId,
  isAdmin,
  isPharmacist,
  isVerifiedPharmacist,
  isDoctor,
  adminExists
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content">
          <DashboardHeader />
          
          {fetchError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fehler</AlertTitle>
              <AlertDescription>
                {fetchError}
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRetry}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" /> Erneut versuchen
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Zeige DashboardCards als erstes Element für alle Benutzer */}
          {!loading && <DashboardCards />}
          
          <DashboardContent 
            loading={loading}
            userId={userId}
            isAdmin={isAdmin}
            isPharmacist={isPharmacist}
            isVerifiedPharmacist={isVerifiedPharmacist}
            isDoctor={isDoctor}
            adminExists={adminExists}
            verificationJustCompleted={verificationJustCompleted}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardContainer;
