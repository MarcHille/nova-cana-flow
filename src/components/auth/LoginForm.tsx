
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLoginForm } from "@/hooks/useLoginForm";
import LoginAlerts from "./LoginAlerts";
import LoginFormInputs from "./LoginFormInputs";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const {
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
  } = useLoginForm();
  
  const [registerMode, setRegisterMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMode = () => {
    if (!registerMode) {
      // Wenn der Nutzer auf Registrieren wechseln will, leiten wir ihn zur Registrierungsseite weiter
      navigate("/register");
    }
    // Wenn wir schon im Registrierungsmodus sind, bleiben wir auf der Login-Seite
    setRegisterMode(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <LoginAlerts
        error={error}
        successMessage={successMessage}
        showConfirmEmailInfo={showConfirmEmailInfo}
        showPasswordResetInfo={showPasswordResetInfo}
        loading={loading}
        email={email}
        onResendConfirmation={resetEmailConfirmation}
      />
      
      <LoginFormInputs
        email={email}
        password={password}
        onEmailChange={(e) => setEmail(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onPasswordReset={() => handlePasswordReset(email)}
      />
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Anmeldung...
          </>
        ) : (
          <>Anmelden</>
        )}
      </Button>
      
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">oder</span>
        </div>
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={() => {
          toast({
            title: "DocCheck Login",
            description: "Die Integration mit DocCheck ist noch in Arbeit.",
          });
        }}
      >
        Mit DocCheck anmelden
      </Button>
      
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Noch kein Konto?
        <button 
          type="button"
          onClick={toggleMode} 
          className="font-medium text-black dark:text-white hover:underline ml-1"
        >
          Registrieren
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
