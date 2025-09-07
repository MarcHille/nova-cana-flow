
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingScreen from "./LoadingScreen";
import { makeUserAdmin, checkAdminExists, checkIsAdmin } from "@/utils/adminRoleUtils";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ShieldCheck } from "lucide-react";

const FirstAdminSetup: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(true);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [manualEmail, setManualEmail] = useState<string>("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [adminResult, setAdminResult] = useState<{success: boolean; message: string} | null>(null);
  const { toast } = useToast();

  // Prüfen, ob bereits ein Admin existiert und ob der aktuelle User Admin ist
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true);
        
        // Aktuellen Benutzer abrufen
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          setUserEmail(user.email);
          setManualEmail(user.email || "");
          console.log("Aktueller Benutzer:", user.email);
          
          // Admin-Existenz prüfen
          const hasAdmin = await checkAdminExists();
          console.log("Admin existiert:", hasAdmin);
          setAdminExists(hasAdmin);
          
          // Prüfen ob aktueller Benutzer Admin ist
          const currentUserIsAdmin = await checkIsAdmin(user.id);
          console.log("Ist der aktuelle Benutzer Admin:", currentUserIsAdmin);
          setIsCurrentUserAdmin(currentUserIsAdmin);
        }
      } catch (error) {
        console.error("Fehler bei Admin-Prüfung:", error);
        toast({
          title: "Fehler",
          description: "Bei der Überprüfung des Administrator-Status ist ein Fehler aufgetreten.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [toast]);

  const handleMakeAdmin = async () => {
    if (!manualEmail) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine E-Mail-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    setCreatingAdmin(true);
    setAdminResult(null);
    
    try {
      console.log("Erstelle Admin-Rolle für manuelle E-Mail:", manualEmail);
      
      // Admin-Rolle direkt erstellen
      const success = await makeUserAdmin(manualEmail);
      
      if (success) {
        setAdminResult({
          success: true,
          message: `Benutzer ${manualEmail} wurde erfolgreich zum Administrator gemacht. Bitte laden Sie die Seite neu, um die neuen Berechtigungen zu nutzen.`
        });
        
        toast({
          title: "Erfolg",
          description: `Benutzer ${manualEmail} wurde als Administrator eingerichtet! Bitte laden Sie die Seite neu.`,
        });
      } else {
        setAdminResult({
          success: false,
          message: `Admin-Rolle konnte nicht erstellt werden für ${manualEmail}. Bitte überprüfen Sie die E-Mail-Adresse und versuchen Sie es erneut.`
        });
        
        toast({
          title: "Fehler",
          description: `Admin-Rolle konnte nicht erstellt werden für ${manualEmail}.`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Fehler bei Admin-Erstellung:", error);
      
      setAdminResult({
        success: false,
        message: `Fehler bei der Einrichtung als Administrator: ${error?.message || "Unbekannter Fehler"}`
      });
      
      toast({
        title: "Fehler",
        description: "Bei der Einrichtung als Administrator ist ein Fehler aufgetreten: " + error?.message,
        variant: "destructive"
      });
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handlePageRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Wenn der aktuelle Benutzer bereits Admin ist, zeigen wir einen anderen Text an
  if (isCurrentUserAdmin) {
    return (
      <Card className="mb-8 border-green-300 bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="text-lg text-green-800 dark:text-green-300 flex items-center gap-2">
            <ShieldCheck size={20} />
            Administrator-Berechtigungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 dark:text-green-200 mb-4">
            Sie sind als Administrator angemeldet und haben Zugriff auf alle Bereiche des Systems.
            Als Administrator können Sie anderen Benutzern Zugriffsrechte zuweisen.
          </p>
          
          <div className="border-t border-green-200 dark:border-green-800 pt-4 mt-4">
            <p className="mb-2 text-green-700 dark:text-green-200">
              <strong>Admin-Zugang für weitere Benutzer:</strong> Geben Sie die E-Mail-Adresse eines Benutzers ein:
            </p>
            <div className="flex gap-2">
              <Input
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                placeholder="E-Mail-Adresse"
                className="border-green-300"
              />
              <Button 
                onClick={handleMakeAdmin} 
                disabled={creatingAdmin}
                className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
              >
                {creatingAdmin ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Wird eingerichtet...
                  </>
                ) : (
                  "Rechte zuweisen"
                )}
              </Button>
            </div>
          </div>
          
          {adminResult && (
            <Alert className={`mt-4 ${adminResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <InfoIcon className={adminResult.success ? 'text-green-600' : 'text-red-600'} />
              <AlertTitle className={adminResult.success ? 'text-green-700' : 'text-red-700'}>
                {adminResult.success ? 'Admin-Zugriff erteilt' : 'Fehler'}
              </AlertTitle>
              <AlertDescription className={adminResult.success ? 'text-green-600' : 'text-red-600'}>
                {adminResult.message}
              </AlertDescription>
              {adminResult.success && (
                <Button 
                  onClick={handlePageRefresh}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Seite neu laden
                </Button>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
      <CardHeader>
        <CardTitle className="text-lg text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
          <ShieldCheck size={20} />
          Administrator-Einrichtung
        </CardTitle>
      </CardHeader>
      <CardContent>
        {adminResult && (
          <Alert className={`mb-4 ${adminResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <InfoIcon className={adminResult.success ? 'text-green-600' : 'text-red-600'} />
            <AlertTitle className={adminResult.success ? 'text-green-700' : 'text-red-700'}>
              {adminResult.success ? 'Admin-Zugriff erteilt' : 'Fehler'}
            </AlertTitle>
            <AlertDescription className={adminResult.success ? 'text-green-600' : 'text-red-600'}>
              {adminResult.message}
            </AlertDescription>
            {adminResult.success && (
              <Button 
                onClick={handlePageRefresh}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white"
              >
                Seite neu laden
              </Button>
            )}
          </Alert>
        )}
        
        <p className="text-yellow-700 dark:text-yellow-200 mb-4">
          Sie können einen Benutzer zum Administrator ernennen, um vollen Zugriff auf alle Bereiche zu erhalten.
        </p>
        
        <div className="border-t border-yellow-200 dark:border-yellow-800 pt-4 mt-4">
          <p className="mb-2 text-yellow-700 dark:text-yellow-200">
            <strong>Admin-Zugang einrichten:</strong> Geben Sie die E-Mail-Adresse eines Benutzers ein:
          </p>
          <div className="flex gap-2">
            <Input
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              placeholder="E-Mail-Adresse"
              className="border-yellow-300"
            />
            <Button 
              onClick={handleMakeAdmin} 
              disabled={creatingAdmin}
              className="bg-yellow-600 hover:bg-yellow-700 text-white whitespace-nowrap"
            >
              {creatingAdmin ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Wird eingerichtet...
                </>
              ) : (
                "Zum Admin machen"
              )}
            </Button>
          </div>
          <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-300">
            Nachdem ein Benutzer zum Administrator gemacht wurde, muss die Seite neu geladen werden, 
            um die neuen Berechtigungen zu aktivieren.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirstAdminSetup;
