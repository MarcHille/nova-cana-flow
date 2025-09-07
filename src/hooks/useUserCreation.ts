
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  password: z
    .string()
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein")
    .regex(/[A-Z]/, "Das Passwort muss mindestens einen Großbuchstaben enthalten")
    .regex(/[0-9]/, "Das Passwort muss mindestens eine Zahl enthalten")
    .regex(/[^A-Za-z0-9]/, "Das Passwort muss mindestens ein Sonderzeichen enthalten"),
  role: z.enum(["user", "admin", "pharmacist"])
});

type FormValues = z.infer<typeof formSchema>;

export const useUserCreation = (onSuccess: () => Promise<void>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = async (values: FormValues): Promise<void> => {
    try {
      setIsSubmitting(true);
      
      // Validate inputs with zod
      const validatedValues = formSchema.parse(values);
      
      // Get active session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error(`Fehler beim Laden der Sitzung: ${sessionError.message}`);
      }
      
      if (!sessionData.session) {
        throw new Error("Keine aktive Sitzung gefunden. Bitte melden Sie sich erneut an.");
      }
      
      console.log("Creating user with email:", validatedValues.email);

      // Set up a timeout for the request
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Zeitüberschreitung bei der Anfrage")), 15000);
      });

      // Make the actual request
      const functionCall = supabase.functions.invoke('create-user', {
        body: { 
          email: validatedValues.email,
          password: validatedValues.password,
          role: validatedValues.role 
        },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`
        }
      });

      // Race between timeout and actual request
      const result = await Promise.race([functionCall, timeoutPromise]);
      
      // Check for direct error from the function call
      if (result.error) {
        console.error("Create user error:", result.error);
        throw new Error(result.error.message || "Fehler bei der Benutzererstellung");
      }
      
      // Check if the function returned a success status
      if (!result.data?.success) {
        const errorMessage = result.data?.error || "Unbekannter Fehler bei der Benutzererstellung";
        console.error("Create user failed:", errorMessage);
        throw new Error(errorMessage);
      }
      
      toast({
        title: "Benutzer erstellt",
        description: `Neuer Benutzer mit der E-Mail ${validatedValues.email} wurde erfolgreich erstellt.`
      });
      
      await onSuccess();
      
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Fehler",
        description: `Fehler beim Erstellen des Benutzers: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleCreateUser,
    isSubmitting
  };
};
