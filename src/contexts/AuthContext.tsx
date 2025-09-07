import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isPharmacist: boolean;
  isVerifiedPharmacist: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
  isPharmacist: false,
  isVerifiedPharmacist: false,
  refreshSession: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isPharmacist, setIsPharmacist] = useState<boolean>(false);
  const [isVerifiedPharmacist, setIsVerifiedPharmacist] = useState<boolean>(false);
  const { toast } = useToast();

  // Function to sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      // Reset all states
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setIsPharmacist(false);
      setIsVerifiedPharmacist(false);
      
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Fehler",
        description: "Beim Abmelden ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
    }
  };

  // Function to check user roles
  const checkRoles = async (userId: string) => {
    try {
      // Check if user is admin using dedicated RPC function
      const { data: adminData, error: adminError } = await supabase.rpc(
        'is_admin',
        { user_id: userId }
      );
      
      if (adminError) {
        console.error("Error checking admin status:", adminError);
        
        // Fallback: Check admin status via Edge Function
        const { data: adminFallbackData, error: adminFallbackError } = await supabase.functions.invoke(
          'check-is-admin',
          { body: { userId } }
        );
        
        if (adminFallbackError) {
          console.error("Error with admin status check fallback:", adminFallbackError);
        } else {
          setIsAdmin(adminFallbackData?.isAdmin || false);
          
          // If user is admin, they automatically get all other role privileges
          if (adminFallbackData?.isAdmin) {
            setIsPharmacist(true);
            setIsVerifiedPharmacist(true);
            return;
          }
        }
      } else {
        setIsAdmin(adminData || false);
        
        // If user is admin, they automatically get all other role privileges
        if (adminData) {
          setIsPharmacist(true);
          setIsVerifiedPharmacist(true);
          return;
        }
      }
      
      // Check if user is pharmacist using the new security definer function
      const { data: roles, error: rolesError } = await supabase.rpc(
        'get_user_roles_safely',
        { _user_id: userId }
      );
      
      if (rolesError) {
        console.error("Error checking roles:", rolesError);
        
        // Fallback: Check pharmacist status via Edge Function
        const { data: pharmacistData, error: pharmacistError } = await supabase.functions.invoke(
          'check-is-pharmacist',
          { body: { userId } }
        );
        
        if (pharmacistError) {
          console.error("Error with pharmacist status check fallback:", pharmacistError);
        } else {
          setIsPharmacist(pharmacistData?.isPharmacist || false);
          
          // Check verification status for pharmacists
          if (pharmacistData?.isPharmacist) {
            await checkPharmacistVerification(userId);
          }
        }
      } else {
        const isPharmacist = Array.isArray(roles) && roles.includes('pharmacist');
        setIsPharmacist(isPharmacist);
        
        if (isPharmacist) {
          await checkPharmacistVerification(userId);
        }
      }
    } catch (error) {
      console.error("Error checking roles:", error);
    }
  };

  // Helper function to check pharmacist verification
  const checkPharmacistVerification = async (userId: string) => {
    try {
      const { data: verificationData, error: verificationError } = await supabase
        .from('pharmacy_verification')
        .select('verification_status')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (verificationError) {
        console.error("Error checking verification status:", verificationError);
        setIsVerifiedPharmacist(false);
      } else {
        setIsVerifiedPharmacist(verificationData?.verification_status === 'approved');
      }
    } catch (err) {
      console.error("Error checking verification status:", err);
      setIsVerifiedPharmacist(false);
    }
  };

  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      
      if (data.session?.user?.id) {
        await checkRoles(data.session.user.id);
      } else {
        // Reset role states when no user is logged in
        setIsAdmin(false);
        setIsPharmacist(false);
        setIsVerifiedPharmacist(false);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      toast({
        title: "Error",
        description: "Session could not be refreshed.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    let isMounted = true;
    
    // Set initial loading state
    setLoading(true);
    
    // Set up auth state listener FIRST (critical for preventing auth state synchronization issues)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Handle auth events with separate timeouts to prevent Supabase client deadlocks
        if (currentSession?.user) {
          // Use setTimeout to ensure we don't create a deadlock with Supabase client
          setTimeout(() => {
            if (isMounted) {
              checkRoles(currentSession.user!.id);
            }
          }, 0);
        } else {
          setIsAdmin(false);
          setIsPharmacist(false);
          setIsVerifiedPharmacist(false);
        }
      }
    );
    
    // THEN check for existing session
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!isMounted) return;
        
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          await checkRoles(data.session.user.id);
        }
      } catch (error) {
        console.error("Error retrieving session:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    initSession();
    
    // Clean up listener on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const contextValue: AuthContextType = {
    session,
    user,
    loading,
    isAdmin,
    isPharmacist,
    isVerifiedPharmacist,
    refreshSession,
    signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
