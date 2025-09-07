
import { Resend } from "npm:resend@2.0.0";
import { getPharmacyVerificationRequestTemplate } from "../templates/pharmacy-verification-request-email.ts";

export const handlePharmacyVerificationRequestEmail = async (
  resend: Resend,
  email: string,
  name: string,
  redirectTo: string,
  fromEmail: string
) => {
  try {
    console.log(`Sende Apotheken-Verifizierungsanfrage an ${email}, redirectTo: ${redirectTo}`);
    
    // Ensure we have a valid name to address the user
    const displayName = name ? name : email.split('@')[0];
    
    // Ensure the redirect URL is correct
    const baseUrl = redirectTo 
      ? new URL(redirectTo).origin 
      : (Deno.env.get('SITE_URL') || 'https://novacana.de');
    
    const actualRedirect = `${baseUrl}/dashboard`;
    
    const emailResponse = await resend.emails.send({
      from: `Novacana <${fromEmail}>`,
      to: email,
      subject: "Verifizieren Sie Ihre Apotheke bei Novacana",
      html: getPharmacyVerificationRequestTemplate(displayName, actualRedirect)
    });
    
    console.log(`Apotheken-Verifizierungsanfrage E-Mail gesendet:`, emailResponse);
    
    return emailResponse;
  } catch (error) {
    console.error("Fehler beim Senden der Apotheken-Verifizierungsanfrage E-Mail:", error);
    throw error;
  }
};
