
import { Resend } from "npm:resend@2.0.0";
import { getPharmacyVerificationTemplate } from "../templates/pharmacy-verification-email.ts";

export const handlePharmacyVerificationEmail = async (
  resend: Resend,
  email: string,
  status: string,
  verificationId: string | undefined,
  reason: string | undefined,
  fromEmail: string
) => {
  try {
    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Ihre Apotheken-Verifizierung wurde ${status === "approved" ? "genehmigt" : "abgelehnt"}`,
      html: getPharmacyVerificationTemplate(email, status, verificationId, reason)
    });
    
    console.log(`Apotheken-Verifizierung ${status} E-Mail gesendet:`, emailResponse);
    
    return emailResponse;
  } catch (error) {
    console.error("Fehler beim Senden der Apotheken-Verifizierungs-E-Mail:", error);
    throw error;
  }
};
