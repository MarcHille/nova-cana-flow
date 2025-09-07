
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthentication } from "@/hooks/useAuthentication";
import AuthLoadingScreen from "./AuthLoadingScreen";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  pharmacistOnly?: boolean;
  verifiedPharmacistOnly?: boolean;
}

/**
 * Security-enhanced ProtectedRoute component that protects routes based on user roles
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
  pharmacistOnly = false,
  verifiedPharmacistOnly = false
}) => {
  const { toast } = useToast();
  const location = useLocation();
  
  // Track when the access check has completed to prevent multiple toast messages
  const [accessDeniedMessageShown, setAccessDeniedMessageShown] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  
  const { 
    loading, 
    isAdmin, 
    isPharmacist, 
    isVerifiedPharmacist,
    session, 
    user
  } = useAuthentication();
  
  // Debug log with minimal information for security
  useEffect(() => {
    console.log(`ProtectedRoute [${location.pathname}] - Auth Check:`, 
      !loading ? 'complete' : 'pending', 
      'isAdmin:', isAdmin,
      'isPharmacist:', isPharmacist,
      'isVerifiedPharmacist:', isVerifiedPharmacist
    );
  }, [loading, location.pathname, isAdmin, isPharmacist, isVerifiedPharmacist]);
  
  // Access check effect - only run once when checking is complete
  useEffect(() => {
    if (!loading && !accessChecked) {
      setAccessChecked(true);
    }
  }, [loading, accessChecked]);
  
  // Show toast only once and only after access has been checked
  useEffect(() => {
    if (!accessDeniedMessageShown && accessChecked) {
      // Check and show access denied message if needed
      if (!session) {
        // No need for toast here as we'll redirect to login
        return;
      }
      
      // Skip all other checks if user is admin (they have access to everything)
      if (isAdmin) {
        return;
      }
      
      if (adminOnly) {
        toast({
          title: "Zugriff verweigert",
          description: "Sie benötigen Administratorrechte, um auf diese Seite zuzugreifen.",
          variant: "destructive"
        });
        setAccessDeniedMessageShown(true);
        return;
      }
      
      if (pharmacistOnly && !isPharmacist) {
        toast({
          title: "Zugriff verweigert",
          description: "Sie benötigen Apothekerzugang, um auf diese Seite zuzugreifen.",
          variant: "destructive"
        });
        setAccessDeniedMessageShown(true);
        return;
      }
      
      if (verifiedPharmacistOnly && !isVerifiedPharmacist && !isAdmin) {
        toast({
          title: "Zugriff verweigert",
          description: "Ihr Apothekerkonto muss verifiziert sein, um auf diese Seite zuzugreifen.",
          variant: "destructive"
        });
        setAccessDeniedMessageShown(true);
        return;
      }
    }
  }, [
    accessChecked, 
    accessDeniedMessageShown, 
    adminOnly, 
    isAdmin, 
    isPharmacist, 
    isVerifiedPharmacist,
    pharmacistOnly, 
    session,
    toast, 
    verifiedPharmacistOnly
  ]);

  // Show loading screen while checking auth status
  if (loading) {
    return <AuthLoadingScreen />;
  }

  // Handle authentication redirects
  if (!session) {
    console.log(`User not authenticated, redirecting to login from ${location.pathname}`);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Special case for admin on dashboard - redirect to admin page
  if (isAdmin && location.pathname === "/dashboard") {
    console.log("Admin accessing dashboard, redirecting to admin page");
    return <Navigate to="/admin" replace />;
  }
  
  // Handle admin-only route access
  if (adminOnly && !isAdmin) {
    console.log("Non-admin attempting to access admin-only route, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Handle pharmacist-specific route access
  if (pharmacistOnly && !isPharmacist && !isAdmin) {
    console.log("Non-pharmacist attempting to access pharmacist-only route, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Handle verified pharmacist-only route access
  if (verifiedPharmacistOnly && !isVerifiedPharmacist && !isAdmin) {
    console.log("Unverified pharmacist attempting to access verified-only route, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  // Default case: allow access
  return <>{children}</>;
};

export default ProtectedRoute;
