
import { Resend } from "npm:resend@2.0.0";
import { getConfirmationEmailTemplate } from "../templates/confirmation-email.ts";

export const handleSignupEmail = async (resend: Resend, email: string, name: string, redirectTo: string) => {
  try {
    // Generate detailed logs to diagnose the issue
    console.log(`Sending signup email to: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Redirect URL: ${redirectTo}`);
    
    // Make sure we're sending with a verified domain
    const result = await resend.emails.send({
      from: "Novacana <no-reply@novacana.de>", // Make sure this domain is verified in Resend
      to: email,
      subject: "Bestätigen Sie Ihre Registrierung bei Novacana",
      html: getConfirmationEmailTemplate(redirectTo, name)
    });
    
    console.log(`Registration email sent to ${email}, result:`, result);
    
    return result;
  } catch (error) {
    console.error(`Error sending confirmation email to ${email}:`, error);
    throw new Error(`Error sending confirmation email: ${error.message}`);
  }
};
