
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UseProductsAccessProps {
  isAdmin: boolean;
  isPharmacist: boolean;
  isVerifiedPharmacist: boolean;
}

export function useProductsAccess({ 
  isAdmin, 
  isPharmacist, 
  isVerifiedPharmacist 
}: UseProductsAccessProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Access restrictions check
  useEffect(() => {
    // Admins have full access
    if (isAdmin) {
      return;
    }
    
    // Check for non-admins - they must be pharmacists
    if (!isPharmacist) {
      toast({
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, auf diese Seite zuzugreifen. Sie benötigen einen Apotheker-Account.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }
    
    // Pharmacists must be verified to access products
    if (isPharmacist && !isVerifiedPharmacist) {
      toast({
        title: "Zugriff verweigert",
        description: "Ihr Apothekerkonto muss verifiziert sein, um auf Produkte zugreifen zu können. Bitte warten Sie auf die Bestätigung Ihrer Verifizierung.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }
  }, [isAdmin, isPharmacist, isVerifiedPharmacist, navigate, toast]);
}
