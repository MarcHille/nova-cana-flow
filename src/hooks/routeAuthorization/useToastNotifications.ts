
import { useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export function useToastNotifications() {
  const { toast } = useToast();
  // Use a ref to track if a toast is already shown to prevent duplicate toasts
  const toastShownRef = useRef<Record<string, boolean>>({});
  
  const showToast = useCallback((key: string, title: string, message: string, variant: "default" | "destructive" | null = "default", duration: number = 5000) => {
    // Only show toast if not already shown for this key
    if (!toastShownRef.current[key]) {
      console.log(`Showing toast: ${title} - ${message}`);
      toastShownRef.current[key] = true;
      
      toast({
        title,
        description: message,
        variant,
        duration
      });
      
      // Reset the ref after a delay to allow future toasts
      setTimeout(() => {
        toastShownRef.current[key] = false;
      }, duration);
    }
  }, [toast]);
  
  const showAccessDeniedToast = useCallback((message: string) => {
    showToast('access-denied', "Zugriff verweigert", message, "destructive");
  }, [showToast]);
  
  const showSuccessToast = useCallback((message: string) => {
    showToast('success', "Erfolg", message);
  }, [showToast]);
  
  const showErrorToast = useCallback((message: string) => {
    showToast('error', "Fehler", message, "destructive");
  }, [showToast]);
  
  const resetToastState = useCallback(() => {
    // Reset the toast shown state
    toastShownRef.current = {};
    console.log("Toast state reset");
  }, []);

  return { 
    showToast,
    showAccessDeniedToast,
    showSuccessToast,
    showErrorToast,
    resetToastState
  };
}
