
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "./cors.ts";
import { getContactEmailTemplate, getConfirmationEmailTemplate } from "./email-templates.ts";

serve(async (req) => {
  // CORS-Preflight behandeln
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { name, email, pharmacyName, message, attachments = [] } = requestData;

    // Input validieren
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, E-Mail und Nachricht sind erforderlich" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // E-Mail Client initialisieren
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    console.log("Kontaktformular-Anfrage von:", name);
    console.log("E-Mail:", email);
    console.log("Apotheke:", pharmacyName || "Nicht angegeben");
    console.log("Nachricht:", message);
    console.log("Anhänge:", attachments);

    // Benachrichtigungs-E-Mail an Novacana senden
    const emailResponse = await resend.emails.send({
      from: "Kontaktformular <no-reply@novacana.de>",
      to: "info@novacana.de",
      subject: `Neue Kontaktanfrage von ${name} ${pharmacyName ? `(${pharmacyName})` : ""}`,
      html: getContactEmailTemplate(name, email, pharmacyName, message, attachments),
      reply_to: email
    });

    console.log("Kontaktformular-E-Mail gesendet:", emailResponse);

    // Bestätigungs-E-Mail an den Absender
    const confirmationResponse = await resend.emails.send({
      from: "Novacana <no-reply@novacana.de>",
      to: email,
      subject: "Vielen Dank für Ihre Anfrage bei Novacana",
      html: getConfirmationEmailTemplate(name)
    });

    console.log("Bestätigungs-E-Mail gesendet:", confirmationResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Kontaktanfrage wurde erfolgreich versendet",
        emailId: emailResponse.id,
        confirmationId: confirmationResponse.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Beim Senden der E-Mail ist ein Fehler aufgetreten" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
