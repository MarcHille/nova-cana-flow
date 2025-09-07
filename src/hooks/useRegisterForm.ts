
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "pharmacist",
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Fehlende Informationen",
        description: "Bitte füllen Sie alle erforderlichen Felder aus.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.email.includes('@') || formData.email.length < 5) {
      toast({
        title: "Ungültige E-Mail-Adresse",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.password.length < 8) {
      toast({
        title: "Passwort zu kurz",
        description: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwörter stimmen nicht überein",
        description: "Bitte überprüfen Sie Ihre Eingabe.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/login`;
      console.log("Registration redirectUrl:", redirectUrl);
      
      // Create a new user with Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        throw signUpError;
      }

      console.log("Registration successful, sending custom confirmation email");
      
      // Send custom email using the edge function
      try {
        console.log("Invoking custom-email function with params:", {
          email: formData.email,
          type: "signup",
          redirectTo: redirectUrl,
          name: `${formData.firstName} ${formData.lastName}`
        });
        
        const { data: emailData, error: emailError } = await supabase.functions.invoke("custom-email", {
          body: {
            email: formData.email,
            type: "signup",
            redirectTo: redirectUrl,
            name: `${formData.firstName} ${formData.lastName}`
          }
        });
        
        if (emailError) {
          console.error("Error sending custom email:", emailError);
          // If custom email fails, we'll still use the default Supabase email
          toast({
            title: "Registrierung erfolgreich",
            description: "Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet. Bitte überprüfen Sie auch Ihren Spam-Ordner.",
          });
        } else {
          console.log("Custom email sent successfully:", emailData);
          toast({
            title: "Registrierung erfolgreich",
            description: "Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet. Bitte überprüfen Sie auch Ihren Spam-Ordner.",
          });
        }
      } catch (emailCatchError: any) {
        console.error("Severe error sending custom email:", emailCatchError);
        toast({
          title: "Registrierung erfolgreich",
          description: "Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet. Bitte überprüfen Sie auch Ihren Spam-Ordner.",
        });
      }

      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Check for known error messages
      if (error.message?.includes("User already registered")) {
        toast({
          title: "Registrierung fehlgeschlagen",
          description: "Diese E-Mail-Adresse ist bereits registriert. Bitte verwenden Sie eine andere E-Mail-Adresse oder versuchen Sie sich anzumelden.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registrierung fehlgeschlagen",
          description: error.message || "Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    formData,
    handleChange,
    handleSelectChange,
    handleSubmit,
  };
};
