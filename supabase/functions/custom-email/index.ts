
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { EmailRequest } from "./types.ts";
import { handleSignupEmail } from "./handlers/signup-handler.ts";
import { handleRecoveryEmail } from "./handlers/recovery-handler.ts";
import { handleContactEmail } from "./handlers/contact-handler.ts";
import { handlePharmacyVerificationEmail } from "./handlers/pharmacy-verification-handler.ts";
import { handlePharmacyVerificationRequestEmail } from "./handlers/pharmacy-verification-request-handler.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: EmailRequest = await req.json();
    const { 
      email, 
      type, 
      name = '', 
      pharmacyName = '', 
      message = '', 
      attachments = [],
      verificationId,
      status,
      reason,
      fromEmail = "Novacana <onboarding@resend.dev>",
      toEmail = "info@novacana.de",
      redirectTo = `${new URL(req.url).origin}/login`
    } = requestData;

    console.log(`Processing email request of type: ${type} for email: ${email}`);
    console.log(`Redirect URL: ${redirectTo}`);
    console.log(`Request details:`, JSON.stringify(requestData, null, 2));

    // Validate email field for email-requiring operations
    if (!email && type !== "contact" && type !== "pharmacy-verification") {
      return new Response(
        JSON.stringify({ error: "E-Mail ist erforderlich" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate Resend API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Email service configuration error: RESEND_API_KEY not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Resend client with debugging
    console.log("Initializing Resend client with API key length:", resendApiKey?.length);
    const resend = new Resend(resendApiKey);
    let result;

    // Process the request based on email type
    try {
      switch (type) {
        case "signup":
          console.log(`Sending signup email to ${email} with name: ${name}, redirectTo: ${redirectTo}`);
          result = await handleSignupEmail(resend, email, name, redirectTo);
          break;
        case "recovery":
          console.log(`Sending recovery email to ${email} with redirectTo: ${redirectTo}`);
          result = await handleRecoveryEmail(resend, email, redirectTo);
          break;
        case "contact":
          console.log(`Sending contact email from ${email} (${name}) to ${toEmail} with ${attachments?.length || 0} attachments`);
          result = await handleContactEmail(resend, name, email, pharmacyName, message, toEmail, fromEmail, attachments);
          break;
        case "pharmacy-verification":
          console.log(`Sending pharmacy verification email to ${email} with status: ${status}`);
          result = await handlePharmacyVerificationEmail(resend, email, status!, verificationId, reason, fromEmail);
          break;
        case "pharmacy-verification-request":
          console.log(`Sending pharmacy verification request to ${email} with redirect ${redirectTo}`);
          result = await handlePharmacyVerificationRequestEmail(resend, email, name, redirectTo, fromEmail);
          break;
        default:
          return new Response(
            JSON.stringify({ error: `Ungültiger E-Mail-Typ: ${type}` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
      }

      console.log(`Email sent successfully. Result:`, result);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `E-Mail vom Typ ${type} wurde an ${type === "contact" ? toEmail : email} gesendet`,
          emailId: result.id
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (emailError) {
      console.error(`Error in email handler for type ${type}:`, emailError);
      throw new Error(`Fehler beim Senden der E-Mail vom Typ ${type}: ${emailError.message}`);
    }
  } catch (error) {
    console.error("Fehler bei der E-Mail-Generierung:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        errorDetails: error.toString()  
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
