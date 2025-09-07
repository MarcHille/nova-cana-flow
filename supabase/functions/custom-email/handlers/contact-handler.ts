
import { Resend } from "npm:resend@2.0.0";
import { getContactFormEmailTemplate } from "../templates/contact-form-email.ts";

export const handleContactEmail = async (
  resend: Resend, 
  name: string, 
  email: string, 
  pharmacyName: string, 
  message: string, 
  toEmail: string,
  fromEmail: string
) => {
  try {
    // Send main contact email
    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Kontaktanfrage von ${name} ${pharmacyName ? `(${pharmacyName})` : ""}`,
      html: getContactFormEmailTemplate(name, email, pharmacyName, message),
      reply_to: email
    });
    
    console.log("Kontaktformular-E-Mail gesendet:", emailResponse);
    
    // Send confirmation email
    const confirmationResponse = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Vielen Dank für Ihre Anfrage bei Novacana",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Vielen Dank für Ihre Anfrage</h2>
          <p>Sehr geehrte(r) ${name},</p>
          <p>wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
          <p>Mit freundlichen Grüßen,<br>Ihr Novacana Team</p>
        </div>
      `
    });
    
    console.log("Bestätigungs-E-Mail gesendet:", confirmationResponse);
    
    return { emailResponse, confirmationResponse };
  } catch (error) {
    console.error("Fehler beim Senden der Kontakt-E-Mail:", error);
    throw error;
  }
};
