
import { useState, useEffect, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSessionListener() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to update session and user state
  const updateSessionState = useCallback((newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) return;
        console.log("Auth state changed:", event);
        updateSessionState(currentSession);
        setLoading(false);
      }
    );
    
    // Initial session check
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        updateSessionState(currentSession);
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
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [updateSessionState]);

  return {
    session,
    user,
    loading
  };
}
