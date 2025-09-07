
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UserProfileData {
  email: string;
  name?: string;
  phoneNumber?: string;
  pharmacyName?: string;
  address?: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfileData>({
    email: "",
    name: "",
    phoneNumber: "",
    pharmacyName: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (user) {
        // Get user metadata
        const metadata = user.user_metadata || {};
        
        setProfile({
          email: user.email || "",
          name: metadata.name || "",
          phoneNumber: metadata.phoneNumber || metadata.phone_number || "",
          pharmacyName: metadata.pharmacyName || metadata.pharmacy_name || metadata.organizationName || "",
          address: metadata.address || ""
        });
        
        // Try to fetch additional details from pharmacy_verification if available
        try {
          const { data: verificationData } = await supabase
            .from('pharmacy_verification')
            .select('contact_details')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (verificationData?.contact_details) {
            // Safely cast the contact_details to our defined type
            const contactDetails = verificationData.contact_details as any;
            
            // Merge existing profile with verification data, without overwriting existing values
            setProfile(prev => ({
              ...prev,
              name: prev.name || contactDetails.name || "",
              phoneNumber: prev.phoneNumber || contactDetails.phone || "",
              pharmacyName: prev.pharmacyName || contactDetails.organizationName || "",
              address: prev.address || (
                contactDetails.address && contactDetails.postalCode && contactDetails.city 
                  ? `${contactDetails.address}, ${contactDetails.postalCode} ${contactDetails.city}` 
                  : ""
              )
            }));
          }
        } catch (verificationError) {
          console.error("Error fetching pharmacy verification data:", verificationError);
          // Continue without verification data
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Fehler",
        description: "Benutzerprofil konnte nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profile.name,
          phoneNumber: profile.phoneNumber,
          pharmacyName: profile.pharmacyName,
          address: profile.address
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Erfolg",
        description: "Ihre Profildaten wurden aktualisiert.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Fehler",
        description: "Profil konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    handleInputChange,
    saveProfile
  };
};
