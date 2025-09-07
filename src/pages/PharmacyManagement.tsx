
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PharmacyInformation from "@/components/dashboard/pharmacy/PharmacyInformation";
import FormulationDocuments from "@/components/dashboard/pharmacy/FormulationDocuments";
import PharmacyOrdersList from "@/components/dashboard/pharmacy/PharmacyOrdersList";

const PharmacyManagement = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <ProtectedRoute pharmacistOnly verifiedPharmacistOnly>
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-3xl font-bold mb-6">Apothekenverwaltung</h1>
          
          <div className="space-y-10">
            <PharmacyInformation />
            <FormulationDocuments />
            <PharmacyOrdersList />
          </div>
        </main>
      </ProtectedRoute>
      
      <Footer />
    </div>
  );
};

export default PharmacyManagement;
