
import { supabase } from "@/integrations/supabase/client";

interface PharmacyVerificationData {
  success: boolean;
  message?: string;
}

export const verifyPharmacy = async (
  userId: string,
  verificationData: {
    licenseId: string;
    businessDocuments: string[];
    contactDetails: {
      name: string;
      address: string;
      city: string;
      postalCode: string;
      phone: string;
      contactPerson?: string;
      email?: string;
    };
    verificationStatus: 'pending';
  }
): Promise<PharmacyVerificationData> => {
  try {
    // First check if a verification already exists
    const { data: existingVerification, error: selectError } = await supabase
      .from('pharmacy_verification')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (selectError) {
      console.error("Error checking for existing verification:", selectError);
      throw new Error("Fehler beim Überprüfen einer bestehenden Verifizierung");
    }
    
    if (existingVerification) {
      // Update the existing verification
      const { error: updateError } = await supabase
        .from('pharmacy_verification')
        .update({
          license_id: verificationData.licenseId,
          business_documents: verificationData.businessDocuments,
          contact_details: verificationData.contactDetails,
          verification_status: verificationData.verificationStatus,
          submitted_at: new Date().toISOString(),
          // Reset the reviewer data
          reviewed_at: null,
          reviewer_id: null,
          rejection_reason: null
        })
        .eq('id', existingVerification.id);
        
      if (updateError) {
        console.error("Error updating verification:", updateError);
        throw new Error("Fehler beim Aktualisieren der Verifizierungsdaten");
      }
    } else {
      // Create a new verification
      const { error: insertError } = await supabase
        .from('pharmacy_verification')
        .insert({
          user_id: userId,
          license_id: verificationData.licenseId,
          business_documents: verificationData.businessDocuments,
          contact_details: verificationData.contactDetails,
          verification_status: verificationData.verificationStatus
        });
        
      if (insertError) {
        console.error("Error creating verification:", insertError);
        throw new Error("Fehler beim Erstellen der Verifizierungsdaten");
      }
    }
    
    return {
      success: true,
      message: "Verifizierungsanfrage erfolgreich eingereicht."
    };
  } catch (error: any) {
    console.error("Error in verifyPharmacy:", error);
    return {
      success: false,
      message: error.message || "Ein unbekannter Fehler ist aufgetreten"
    };
  }
};

export const getPharmacyVerificationStatus = async (userId: string): Promise<{ status: string | null; message?: string }> => {
  try {
    if (!userId) {
      throw new Error("Benutzer-ID ist erforderlich");
    }
    
    console.log("Checking verification status for user:", userId);
    
    // Add a retry mechanism with exponential backoff
    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;
    
    while (retryCount < maxRetries) {
      try {
        const { data: verification, error } = await supabase
          .from('pharmacy_verification')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) {
          console.error("Database error in getPharmacyVerificationStatus:", error);
          throw new Error(`Datenbankfehler: ${error.message}`);
        }
        
        // Also check if the user has the pharmacist role directly (for cases where the verification table may be out of sync)
        // This ensures that approved pharmacists will always be recognized
        const { data: userRoles, error: rolesError } = await supabase
          .rpc('get_user_roles_safely', { _user_id: userId });
          
        if (rolesError) {
          console.error("Error checking roles:", rolesError);
          // Continue with verification check even if roles check fails
        } else {
          // If user has pharmacist role, they are considered verified regardless of the verification table
          if (userRoles && userRoles.includes('pharmacist')) {
            return { status: 'approved' };
          }
        }
        
        // If no verification found
        if (!verification) {
          console.log("No verification found for user", userId);
          return { status: null };
        }
        
        if (verification.verification_status === 'rejected' && verification.rejection_reason) {
          return { 
            status: 'rejected',
            message: verification.rejection_reason
          };
        }
        
        return { status: verification.verification_status };
      } catch (error) {
        lastError = error;
        retryCount++;
        
        if (retryCount < maxRetries) {
          // Exponential backoff - wait longer after each failure
          const waitMs = Math.pow(2, retryCount) * 500;
          console.log(`Retry ${retryCount}/${maxRetries} after ${waitMs}ms`);
          await new Promise(resolve => setTimeout(resolve, waitMs));
        }
      }
    }
    
    throw lastError || new Error("Maximale Anzahl an Wiederholungsversuchen erreicht");
  } catch (error: any) {
    console.error("Error in getPharmacyVerificationStatus:", error);
    throw error;
  }
};
