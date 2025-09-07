
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, Key, Mail, UserPlus, ShieldCheck, Pill, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  password: z
    .string()
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein")
    .regex(/[A-Z]/, "Das Passwort muss mindestens einen Großbuchstaben enthalten")
    .regex(/[0-9]/, "Das Passwort muss mindestens eine Zahl enthalten")
    .regex(/[^A-Za-z0-9]/, "Das Passwort muss mindestens ein Sonderzeichen enthalten"),
  role: z.enum(["user", "admin", "pharmacist"], {
    required_error: "Bitte wählen Sie eine Rolle aus",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (values: FormValues) => Promise<void>;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ 
  open, 
  onOpenChange, 
  onCreateUser
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      email: "",
      password: "",
      role: "user", // Changed from "doctor" to "user"
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting create user form with data:", { ...data, password: "***" });
      await onCreateUser(data);
      form.reset(); // Formular zurücksetzen nach erfolgreicher Übermittlung
      onOpenChange(false); // Dialog schließen bei Erfolg
    } catch (error: any) {
      console.error("Error in CreateUserDialog onSubmit:", error);
      toast({
        title: "Fehler",
        description: `Benutzer konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(); // Formular zurücksetzen beim Schließen
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Neuen Benutzer erstellen
          </DialogTitle>
          <DialogDescription>
            Erstellen Sie ein neues Benutzerkonto und weisen Sie eine Rolle zu.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    E-Mail-Adresse
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="benutzer@beispiel.de"
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Key className="h-4 w-4" />
                    Passwort
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-gray-500 mt-1">
                    Das Passwort muss mindestens 8 Zeichen lang sein und einen Großbuchstaben, 
                    eine Zahl und ein Sonderzeichen enthalten.
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" />
                    Rolle
                  </FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      value={field.value}
                      className="grid grid-cols-1 gap-4"
                      disabled={isSubmitting}
                    >
                      <div className={`flex items-center space-x-2 border p-3 rounded-md ${
                        field.value === "user" ? "border-primary bg-primary/5" : "border-gray-200"
                      }`}>
                        <RadioGroupItem value="user" id="user" />
                        <Label htmlFor="user" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-1 font-medium">
                            <User className="h-4 w-4 text-green-600" /> Benutzer/Arzt
                          </div>
                          <div className="text-sm text-gray-500">Zugang zu Produktinformationen und Formulierungshilfen</div>
                        </Label>
                      </div>
                      
                      <div className={`flex items-center space-x-2 border p-3 rounded-md ${
                        field.value === "pharmacist" ? "border-primary bg-primary/5" : "border-gray-200"
                      }`}>
                        <RadioGroupItem value="pharmacist" id="pharmacist" />
                        <Label htmlFor="pharmacist" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-1 font-medium">
                            <Pill className="h-4 w-4 text-blue-600" /> Apotheker
                          </div>
                          <div className="text-sm text-gray-500">Zugang zu Produkten und Bestellungen</div>
                        </Label>
                      </div>
                      
                      <div className={`flex items-center space-x-2 border p-3 rounded-md ${
                        field.value === "admin" ? "border-primary bg-primary/5" : "border-gray-200"
                      }`}>
                        <RadioGroupItem value="admin" id="admin" />
                        <Label htmlFor="admin" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-1 font-medium">
                            <ShieldCheck className="h-4 w-4 text-red-600" /> Administrator
                          </div>
                          <div className="text-sm text-gray-500">Vollständige Systemrechte für Novacana Mitarbeiter</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                  
                  {field.value === "admin" && (
                    <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm flex items-start">
                      <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Achtung: Administratoren haben vollen Zugriff auf alle Systembereiche. Vergeben Sie diese Rolle nur an Mitarbeiter der Novacana GmbH.</span>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                Abbrechen
              </Button>
              <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Benutzer erstellen
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
