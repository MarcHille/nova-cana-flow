
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface AuthSessionState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

export const useAuthSession = () => {
  const [state, setState] = useState<AuthSessionState>({
    session: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;
    
    // Initial session checking
    const checkSession = async () => {
      try {
        console.log("Suche nach bestehender Session...");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (!currentSession?.user) {
          console.log("Keine aktive Session gefunden");
          setState({
            session: null,
            user: null,
            loading: false,
          });
          return;
        }
        
        console.log("Session gefunden für:", currentSession.user.email);
        
        if (isMounted) {
          setState({
            session: currentSession,
            user: currentSession.user,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Session:", error);
        if (isMounted) {
          setState({
            session: null,
            user: null,
            loading: false,
          });
        }
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth-Status geändert:", event, session?.user?.email);
        
        if (!isMounted) return;
        
        if (!session?.user) {
          setState({
            session: null,
            user: null,
            loading: false,
          });
          return;
        }
        
        setState({
          session,
          user: session.user,
          loading: false,
        });
      }
    );
    
    // Initial session check
    checkSession();
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
