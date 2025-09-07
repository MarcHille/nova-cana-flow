
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDashboardState = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPharmacist, setIsPharmacist] = useState(false);
  const [isVerifiedPharmacist, setIsVerifiedPharmacist] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [adminExists, setAdminExists] = useState(true);
  const [verificationJustCompleted, setVerificationJustCompleted] = useState(false);
  const { toast } = useToast();

  // Check if verification was just completed using URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verification') === 'completed') {
      setVerificationJustCompleted(true);
      // Clean up the URL without causing a navigation
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setVerificationJustCompleted(false);
    }
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Fehler beim Abrufen des Benutzers:", error);
          setFetchError("Benutzerinformationen konnten nicht geladen werden.");
          return;
        }
        
        if (user) {
          console.log("Benutzer gefunden:", user.email);
          setUserId(user.id);
          
          // Check user roles
          try {
            const { data: userRoles, error: roleError } = await supabase
              .rpc('get_user_roles_safely', { _user_id: user.id });
              
            if (roleError) {
              console.error("Fehler beim Abrufen der Benutzerrollen:", roleError);
              setFetchError("Benutzerrollen konnten nicht geladen werden.");
              return;
            }
            
            if (userRoles) {
              const isUserAdmin = userRoles.includes('admin');
              setIsAdmin(isUserAdmin);
              const isUserPharmacist = userRoles.includes('pharmacist');
              setIsPharmacist(isUserPharmacist);
              setIsDoctor(userRoles.includes('doctor'));
              
              // Check if we need the admin setup component
              if (!isUserAdmin) {
                const { count, error: adminError } = await supabase
                  .from('user_roles')
                  .select('id', { count: 'exact', head: true })
                  .eq('role', 'admin');
                  
                if (adminError) {
                  console.error("Fehler beim Prüfen auf Admin-Existenz:", adminError);
                } else {
                  // Use the count property correctly from the response
                  setAdminExists(count !== null && count > 0);
                }
              }
              
              // For pharmacists, check verification status
              if (isUserPharmacist) {
                try {
                  // First check verification status directly
                  const { data: verificationData, error: verificationError } = await supabase
                    .from('pharmacy_verification')
                    .select('verification_status, notification_shown')
                    .eq('user_id', user.id)
                    .maybeSingle();
                    
                  if (!verificationError && verificationData) {
                    const isVerified = verificationData.verification_status === 'approved';
                    setIsVerifiedPharmacist(isVerified);
                    
                    // If verification was just approved, update notification_shown
                    if (isVerified && verificationJustCompleted) {
                      try {
                        await supabase
                          .from('pharmacy_verification')
                          .update({ notification_shown: true })
                          .eq('user_id', user.id);
                        
                        localStorage.setItem(`verification_seen_${user.id}`, "true");
                      } catch (notifErr) {
                        console.error("Error updating notification status:", notifErr);
                      }
                    }
                  } else {
                    // Consider all pharmacists verified if they have the role but no verification record
                    console.log("No verification record found for pharmacist, assuming verified");
                    setIsVerifiedPharmacist(isUserPharmacist);
                  }
                } catch (verificationErr) {
                  console.error("Fehler beim Abrufen des Verifizierungsstatus:", verificationErr);
                  // Default to true if error (safer than blocking access)
                  setIsVerifiedPharmacist(true);
                }
              }
            }
          } catch (roleErr) {
            console.error("Fehler beim Abrufen der Benutzerrollen:", roleErr);
            setFetchError("Benutzerrollen konnten nicht geladen werden.");
          }
        } else {
          console.log("Kein authentifizierter Benutzer gefunden.");
        }
      } catch (err) {
        console.error("Fehler beim Abrufen des Benutzers:", err);
        setFetchError("Ein unerwarteter Fehler ist aufgetreten.");
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, [toast, retryCount, verificationJustCompleted]);

  // Check if verification was just completed using the localstorage
  useEffect(() => {
    if (userId) {
      // If we just set the notification as shown, show the success message
      const recentlyVerified = sessionStorage.getItem(`recently_verified_${userId}`);
      if (recentlyVerified === "true") {
        setVerificationJustCompleted(true);
        // Clear the flag after showing it once
        sessionStorage.removeItem(`recently_verified_${userId}`);
      }
    }
  }, [userId]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    userId,
    loading,
    isPharmacist,
    isVerifiedPharmacist,
    isDoctor,
    isAdmin,
    fetchError,
    retryCount,
    adminExists,
    verificationJustCompleted,
    handleRetry
  };
};
