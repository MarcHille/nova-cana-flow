
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSessionManager() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) return;
        console.log("[useSessionManager] Auth state changed with", currentSession ? "valid session" : "no session");
        if (event) {
          console.log("[useSessionManager] Auth state changed:", event);
        }
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching session:", error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };
    
    checkSession();

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading };
}
