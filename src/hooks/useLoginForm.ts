
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmEmailInfo, setShowConfirmEmailInfo] = useState(false);
  const [showPasswordResetInfo, setShowPasswordResetInfo] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract returnUrl from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const resetEmailConfirmation = async (userEmail: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await supabase.functions.invoke("custom-email", {
        body: {
          email: userEmail,
          type: "signup",
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      if (response.error) {
        console.error("Fehler beim Zurücksetzen der E-Mail-Bestätigung:", response.error);
        setError(`Fehler beim Senden der Bestätigungs-E-Mail: ${response.error.message}`);
        return false;
      }
      
      setSuccessMessage("Eine neue Bestätigungs-E-Mail wurde an Sie gesendet. Bitte überprüfen Sie Ihren Posteingang und Spam-Ordner.");
      setShowConfirmEmailInfo(true);
      return true;
    } catch (err) {
      console.error("Allgemeiner Fehler:", err);
      setError("Bei der Anforderung einer neuen Bestätigungs-E-Mail ist ein Fehler aufgetreten.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (userEmail: string) => {
    try {
      if (!userEmail) {
        setError("Bitte geben Sie Ihre E-Mail-Adresse ein, um ein Passwort-Reset anzufordern.");
        return;
      }

      setLoading(true);
      setError(null);
      
      const response = await supabase.functions.invoke("custom-email", {
        body: {
          email: userEmail,
          type: "recovery",
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      if (response.error) {
        setError(`Fehler beim Passwort-Reset: ${response.error.message}`);
        return;
      }
      
      setSuccessMessage("Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet. Bitte überprüfen Sie Ihren Posteingang.");
      setShowPasswordResetInfo(true);
    } catch (err) {
      console.error("Fehler beim Passwort-Reset:", err);
      setError("Bei der Anforderung eines Passwort-Resets ist ein Fehler aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setShowConfirmEmailInfo(false);
    setShowPasswordResetInfo(false);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login-Fehler:", error);
        
        if (error.message.includes("Email not confirmed")) {
          setError("Ihre E-Mail-Adresse wurde noch nicht bestätigt. Bitte klicken Sie auf den Bestätigungslink in der an Sie gesendeten E-Mail oder fordern Sie eine neue Bestätigungs-E-Mail an.");
          setShowConfirmEmailInfo(true);
          return;
        }
        
        if (error.message.includes("Invalid login credentials")) {
          setError("Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort oder registrieren Sie sich für ein neues Konto.");
        } else {
          setError(`Fehler bei der Anmeldung: ${error.message}`);
        }
        return;
      }

      if (data?.user) {
        console.log("Login erfolgreich für Benutzer:", data.user.email);
        
        // Zeige Toast-Nachricht für erfolgreiche Anmeldung
        toast({
          title: "Erfolgreich angemeldet",
          description: `Willkommen zurück, ${data.user.email}!`,
        });
        
        // Sicheres Admin-Prüfverfahren mit Timeout zur Vermeidung von Deadlocks
        setTimeout(async () => {
          try {
            const { data: adminCheckData, error: adminCheckError } = await supabase.functions.invoke(
              'check-is-admin',
              { body: { userId: data.user.id } }
            );
            
            const isAdmin = adminCheckData?.isAdmin || false;
            console.log("Benutzer ist Admin:", isAdmin);
            
            // Verzögerung vor der Weiterleitung, um Toast anzuzeigen
            setTimeout(() => {
              if (isAdmin) {
                console.log("Leite Admin-Benutzer zum Admin-Bereich weiter");
                navigate('/admin');
              } else {
                console.log("Leite Benutzer zum Dashboard weiter");
                navigate(returnUrl);
              }
            }, 500);
          } catch (adminCheckError) {
            console.error("Fehler bei Admin-Prüfung:", adminCheckError);
            // Fallback zum Dashboard bei Fehler
            navigate(returnUrl);
          }
        }, 100);
      }
    } catch (err) {
      console.error("Allgemeiner Fehler:", err);
      setError("Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    successMessage,
    showConfirmEmailInfo,
    showPasswordResetInfo,
    handleLogin,
    resetEmailConfirmation,
    handlePasswordReset
  };
};
