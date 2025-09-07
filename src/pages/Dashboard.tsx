
import React from "react";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import { useDashboardState } from "@/components/dashboard/useDashboardState";

const Dashboard = () => {
  const {
    userId,
    loading,
    isPharmacist,
    isVerifiedPharmacist,
    isDoctor,
    isAdmin,
    fetchError,
    adminExists,
    verificationJustCompleted,
    handleRetry
  } = useDashboardState();

  return (
    <DashboardContainer
      loading={loading}
      fetchError={fetchError}
      handleRetry={handleRetry}
      verificationJustCompleted={verificationJustCompleted}
      userId={userId}
      isAdmin={isAdmin}
      isPharmacist={isPharmacist}
      isVerifiedPharmacist={isVerifiedPharmacist}
      isDoctor={isDoctor}
      adminExists={adminExists}
    />
  );
};

export default Dashboard;
