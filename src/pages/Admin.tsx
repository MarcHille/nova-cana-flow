
import React, { useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { DashboardTabs } from "@/components/admin/dashboard/DashboardTabs";

const Admin = () => {
  // Clear any access denied messages from localStorage that might have been set incorrectly
  useEffect(() => {
    // Run this effect only once when the component mounts
    const clearStorageItems = () => {
      try {
        // Remove any access-related toast messages that were incorrectly saved
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('access_denied') || key.includes('toast'))) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log("Admin portal: Cleared any incorrect access messages");
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    };
    
    clearStorageItems();
    // This is important - no dependencies means this runs only once
  }, []); 

  return (
    <AdminLayout title="Dashboard">
      <DashboardHeader />
      <StatsCards />
      <DashboardTabs />
    </AdminLayout>
  );
};

export default Admin;
