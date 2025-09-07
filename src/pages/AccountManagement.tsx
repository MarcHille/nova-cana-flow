
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountSettings from "@/components/dashboard/account/AccountSettings";

const AccountManagement = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <ProtectedRoute>
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Kontoverwaltung</h1>
          <AccountSettings />
        </main>
      </ProtectedRoute>
      
      <Footer />
    </div>
  );
};

export default AccountManagement;
