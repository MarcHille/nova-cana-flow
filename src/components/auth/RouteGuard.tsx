
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLoadingScreen from "./AuthLoadingScreen";
import { useToast } from "@/hooks/use-toast";

interface RouteGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  pharmacistOnly?: boolean;
  verifiedPharmacistOnly?: boolean;
}

/**
 * Verbesserte RouteGuard-Komponente zur Sicherung von Routen basierend auf Benutzerrollen
 */
const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  adminOnly = false,
  pharmacistOnly = false,
  verifiedPharmacistOnly = false
}) => {
  const { toast } = useToast();
  const location = useLocation();
  
  // Verfolge, wann die Zugriffsprüfung abgeschlossen ist, um mehrfache Toast-Meldungen zu vermeiden
  const [accessDeniedMessageShown, setAccessDeniedMessageShown] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  
  // Verwende den Auth-Kontext direkt für einfachere Implementierung
  const { 
    loading, 
    isAdmin, 
    isPharmacist, 
    isVerifiedPharmacist,
    session, 
    user,
    refreshSession
  } = useAuth();
  
  // Debug-Protokollierung mit minimalen Informationen für die Sicherheit
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`RouteGuard [${location.pathname}] - Auth-Prüfung abgeschlossen:`, !loading);
      console.log('Benutzerberechtigungen:', { isAdmin, isPharmacist, isVerifiedPharmacist });
    }
  }, [loading, location.pathname, isAdmin, isPharmacist, isVerifiedPharmacist]);
  
  // Effekt zum erneuten Laden der Sitzung bei Routing-Änderungen
  useEffect(() => {
    const checkSession = async () => {
      if (session === null && !loading) {
        console.log("Sitzung nicht gefunden, versuche erneut zu laden");
        await refreshSession();
      }
    };
    
    checkSession();
  }, [location.pathname, session, loading, refreshSession]);
  
  // Zugangsprüfungs-Effekt - nur einmal ausführen, wenn die Prüfung abgeschlossen ist
  useEffect(() => {
    if (!loading && !accessChecked) {
      setAccessChecked(true);
    }
  }, [loading, accessChecked]);
  
  // Toast nur einmal und nur nach abgeschlossener Zugangsprüfung anzeigen
  useEffect(() => {
    if (!accessDeniedMessageShown && accessChecked && session) {
      // Überspringe alle anderen Prüfungen, wenn Benutzer Admin ist (sie haben Zugriff auf alles)
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

  // Zeige Ladebildschirm während der Authentifizierungsprüfung
  if (loading) {
    return <AuthLoadingScreen />;
  }

  // Weiterleitung zur Anmeldeseite, wenn keine Sitzung vorhanden ist
  if (!session) {
    // Aktuelle Seite in der URL speichern für spätere Weiterleitung
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // SICHERHEIT: Administratoren haben vollen Zugriff auf alle Routen
  if (isAdmin) {
    // Sonderfall: Administratoren zum Admin-Portal weiterleiten, wenn sie auf das Dashboard zugreifen
    if (location.pathname === "/dashboard") {
      return <Navigate to="/admin" replace />;
    }
    
    return <>{children}</>;
  }

  // Für Admin-spezifische Routen - Zugriff verweigern, wenn Benutzer kein Administrator ist
  if (adminOnly) {
    return <Navigate to="/dashboard" replace />;
  }

  // Für Apotheker-spezifische Routen
  if (pharmacistOnly) {
    if (!isPharmacist) {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Verifizierungsstatus prüfen, falls erforderlich
    if (verifiedPharmacistOnly && !isVerifiedPharmacist) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // Standardfall: Zugriff erlauben
  return <>{children}</>;
};

export default RouteGuard;
