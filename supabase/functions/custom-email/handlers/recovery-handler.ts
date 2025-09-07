
import { Resend } from "npm:resend@2.0.0";
import { getResetPasswordEmailTemplate } from "../templates/reset-password-email.ts";

export const handleRecoveryEmail = async (resend: Resend, email: string, resetURL: string) => {
  try {
    const result = await resend.emails.send({
      from: "no-reply@novacana.de",
      to: email,
      subject: "Passwort zurücksetzen für Ihren Novacana-Zugang",
      html: getResetPasswordEmailTemplate(resetURL)
    });
    
    console.log(`Passwort-Reset-E-Mail-Link für ${email} generiert:`, resetURL);
    console.log("Passwort-Reset-E-Mail gesendet:", result);
    
    return result;
  } catch (error) {
    console.error("Fehler beim Senden der Passwort-Reset-E-Mail:", error);
    throw error;
  }
};
