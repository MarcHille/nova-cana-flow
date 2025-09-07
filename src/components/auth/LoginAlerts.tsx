
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoginAlertsProps {
  error: string | null;
  successMessage: string | null;
  showConfirmEmailInfo: boolean;
  showPasswordResetInfo: boolean;
  loading: boolean;
  email: string;
  onResendConfirmation: (email: string) => Promise<boolean>;
}

const LoginAlerts: React.FC<LoginAlertsProps> = ({
  error,
  successMessage,
  showConfirmEmailInfo,
  showPasswordResetInfo,
  loading,
  email,
  onResendConfirmation
}) => {
  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            {error.includes("E-Mail-Adresse wurde noch nicht bestätigt") && !showConfirmEmailInfo && (
              <div className="mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => onResendConfirmation(email)}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Neue Bestätigungs-E-Mail senden
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {showConfirmEmailInfo && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <h4 className="font-medium mb-1">Bitte bestätigen Sie Ihre E-Mail-Adresse</h4>
            <p>Wir haben Ihnen eine E-Mail mit einem Bestätigungslink geschickt. Um Ihr Konto zu aktivieren, klicken Sie bitte auf diesen Link.</p>
            <p className="mt-2 text-sm">Falls Sie keine E-Mail erhalten haben, prüfen Sie bitte Ihren Spam-Ordner oder fordern Sie eine neue Bestätigungs-E-Mail an.</p>
            <div className="mt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => onResendConfirmation(email)}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Neue Bestätigungs-E-Mail senden
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {showPasswordResetInfo && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <h4 className="font-medium mb-1">Passwort zurücksetzen</h4>
            <p>Wir haben Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts geschickt. Bitte klicken Sie auf diesen Link, um ein neues Passwort festzulegen.</p>
            <p className="mt-2 text-sm">Falls Sie keine E-Mail erhalten haben, prüfen Sie bitte Ihren Spam-Ordner oder fordern Sie erneut ein Passwort-Reset an.</p>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default LoginAlerts;
