
import { useState, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook to manage access notifications with improved security
 * to prevent notification spamming or abuse
 */
export function useNotificationManager() {
  const { toast } = useToast();
  const [hasShownAccessDeniedToast, setHasShownAccessDeniedToast] = useState(false);
  
  // Use ref to track notification timestamps to prevent abuse
  const lastNotificationTimeRef = useRef<number>(0);
  const notificationCountRef = useRef<number>(0);
  
  // Show access denied toast with rate limiting for security
  const showAccessDeniedToast = useCallback((message: string) => {
    const now = Date.now();
    const minInterval = 2000; // 2 seconds between notifications
    const maxNotifications = 3; // Maximum 3 notifications in short succession
    
    // Skip if we've already shown a toast
    if (hasShownAccessDeniedToast) {
      return;
    }
    
    // Check if we're sending notifications too quickly
    if (now - lastNotificationTimeRef.current < minInterval) {
      notificationCountRef.current++;
      
      // If too many notifications in rapid succession, block for security
      if (notificationCountRef.current > maxNotifications) {
        console.warn("[useNotificationManager] Notification rate limit exceeded - possible abuse");
        return;
      }
    } else {
      // Reset counter if sufficient time has passed
      notificationCountRef.current = 0;
    }
    
    // Update last notification time
    lastNotificationTimeRef.current = now;
    
    toast({
      title: "Zugriff verweigert",
      description: message || "Sie haben keine Berechtigung für diese Aktion.",
      variant: "destructive",
    });
    
    setHasShownAccessDeniedToast(true);
  }, [toast, hasShownAccessDeniedToast]);

  // Reset toast state
  const resetToastState = useCallback(() => {
    setHasShownAccessDeniedToast(false);
    notificationCountRef.current = 0;
  }, []);

  return {
    hasShownToast: hasShownAccessDeniedToast,
    showAccessDeniedToast,
    resetToastState,
  };
}
