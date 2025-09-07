
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'
import { Resend } from 'npm:resend@2.0.0'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { action, id, userId, rejectionReason } = requestData

    if (!action || !id) {
      throw new Error('Action and verification ID are required')
    }

    if (!['approve', 'reject'].includes(action)) {
      throw new Error('Invalid action. Must be approve or reject')
    }

    if (action === 'reject' && !rejectionReason) {
      throw new Error('Rejection reason is required when rejecting a verification')
    }

    if (action === 'approve' && !userId) {
      throw new Error('User ID is required when approving a verification')
    }

    // Get auth token from headers
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header is required')
    }

    console.log(`${action === 'approve' ? 'Approving' : 'Rejecting'} verification ${id}`)
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    // Verify the verification request exists
    const { data: verification, error: verificationError } = await supabaseAdmin
      .from('pharmacy_verification')
      .select('*')
      .eq('id', id)
      .single()

    if (verificationError || !verification) {
      console.error("Verification not found:", verificationError)
      throw new Error(`Verification not found: ${verificationError?.message || 'Unknown error'}`)
    }

    // Get admin user ID from token
    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.split(' ')[1]
    )

    if (authError || !adminUser) {
      console.error("Error authenticating admin:", authError)
      throw new Error(`Authentication error: ${authError?.message || 'Unknown error'}`)
    }

    // Get user email for notifications
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (userError || !userData?.user) {
      console.error("User not found:", userError)
      throw new Error(`User not found: ${userError?.message || 'Unknown error'}`)
    }
    
    const userEmail = userData.user.email
    const reviewTime = new Date().toISOString()
    
    if (action === 'approve') {
      // Use database function to approve verification and add pharmacist role
      const { data: approveData, error: approveError } = await supabaseAdmin.rpc(
        'approve_pharmacy_verification',
        {
          verification_id: id,
          user_id_param: userId,
          admin_id: adminUser.id,
          review_time: reviewTime
        }
      )

      if (approveError) {
        console.error("Error approving verification:", approveError)
        throw approveError
      }

      console.log("Verification approved successfully")
      
      // Send confirmation email to user
      try {
        const resendApiKey = Deno.env.get("RESEND_API_KEY")
        if (!resendApiKey) {
          throw new Error("RESEND_API_KEY environment variable not set")
        }
        
        const resend = new Resend(resendApiKey)
        const fromEmail = "no-reply@novacana.de"
        
        // Get pharmacy name from contact details
        const pharmacyName = verification.contact_details?.name || "Ihre Apotheke"
        
        // Send approval email
        const emailResponse = await resend.emails.send({
          from: `Novacana <${fromEmail}>`,
          to: userEmail,
          subject: "Ihre Apotheke wurde bei Novacana verifiziert",
          html: `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ihre Apotheke wurde verifiziert - Novacana</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eaeaea;
    }
    .header img {
      max-width: 180px;
      height: auto;
    }
    .content {
      padding: 20px 0;
    }
    h1 {
      color: #2b824c;
      margin-bottom: 20px;
      font-size: 24px;
    }
    .highlight-box {
      background-color: #f1f9f1;
      border-left: 4px solid #2b824c;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .button {
      display: inline-block;
      background-color: #2b824c;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 15px;
    }
    .button:hover {
      background-color: #236b3e;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 30px;
      border-top: 1px solid #eaeaea;
      padding-top: 20px;
    }
    .benefits {
      margin: 25px 0;
    }
    .benefits li {
      margin-bottom: 10px;
      position: relative;
      padding-left: 25px;
    }
    .benefits li:before {
      content: "✓";
      color: #2b824c;
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    .cta-container {
      text-align: center;
      margin: 25px 0;
    }
    @media only screen and (max-width: 480px) {
      .email-container {
        padding: 10px;
      }
      h1 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo">
    </div>
    
    <div class="content">
      <h1>Ihre Apotheke wurde erfolgreich verifiziert! 🎉</h1>
      
      <p>Sehr geehrte(r) Apotheker(in),</p>
      
      <p>wir freuen uns, Ihnen mitteilen zu können, dass <strong>${pharmacyName}</strong> erfolgreich verifiziert wurde. Sie haben nun vollen Zugriff auf alle Funktionen unserer Plattform.</p>
      
      <div class="highlight-box">
        <p><strong>Als verifizierte Apotheke profitieren Sie von:</strong></p>
        <ul class="benefits">
          <li>Vollständigem Zugriff auf unseren Produktkatalog</li>
          <li>Exklusiven Angeboten für Apotheken</li>
          <li>Vereinfachten Bestellprozessen</li>
          <li>Fachspezifischen Informationen und Ressourcen</li>
        </ul>
      </div>
      
      <p>Sie können sich jetzt in Ihr Konto einloggen und alle Funktionen nutzen. Bei Fragen steht Ihnen unser Support-Team gerne zur Verfügung.</p>
      
      <div class="cta-container">
        <a href="https://novacana.de/dashboard" class="button">Zum Dashboard</a>
      </div>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
      <p>Novacana GmbH, Musterstraße 123, 10115 Berlin, Deutschland</p>
    </div>
  </div>
</body>
</html>`
        });
        
        console.log("Approval email sent:", emailResponse);
      } catch (emailError) {
        // Log email error but don't fail the function
        console.error("Error sending approval email:", emailError);
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Verification approved successfully",
          verificationId: id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      // Update verification status to rejected
      const { error: rejectError } = await supabaseAdmin
        .from('pharmacy_verification')
        .update({
          verification_status: 'rejected',
          rejection_reason: rejectionReason,
          reviewed_at: reviewTime,
          reviewer_id: adminUser.id
        })
        .eq('id', id)

      if (rejectError) {
        console.error("Error rejecting verification:", rejectError)
        throw rejectError
      }

      console.log("Verification rejected successfully")
      
      // Send rejection email to user
      try {
        const resendApiKey = Deno.env.get("RESEND_API_KEY")
        if (!resendApiKey) {
          throw new Error("RESEND_API_KEY environment variable not set")
        }
        
        const resend = new Resend(resendApiKey)
        const fromEmail = "no-reply@novacana.de"
        
        // Send rejection email
        const emailResponse = await resend.emails.send({
          from: `Novacana <${fromEmail}>`,
          to: userEmail,
          subject: "Update zu Ihrer Apothekenverifizierung bei Novacana",
          html: `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update zu Ihrer Apothekenverifizierung - Novacana</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eaeaea;
    }
    .header img {
      max-width: 180px;
      height: auto;
    }
    .content {
      padding: 20px 0;
    }
    h1 {
      color: #e63946;
      margin-bottom: 20px;
      font-size: 24px;
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid #e63946;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .button {
      display: inline-block;
      background-color: #2b824c;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 15px;
    }
    .button:hover {
      background-color: #236b3e;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 30px;
      border-top: 1px solid #eaeaea;
      padding-top: 20px;
    }
    .cta-container {
      text-align: center;
      margin: 25px 0;
    }
    @media only screen and (max-width: 480px) {
      .email-container {
        padding: 10px;
      }
      h1 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo">
    </div>
    
    <div class="content">
      <h1>Update zu Ihrer Apothekenverifizierung</h1>
      
      <p>Sehr geehrte(r) Apotheker(in),</p>
      
      <p>vielen Dank für Ihr Interesse an Novacana. Wir haben Ihre Verifizierungsanfrage geprüft und benötigen weitere Informationen.</p>
      
      <div class="info-box">
        <p><strong>Begründung:</strong></p>
        <p>${rejectionReason}</p>
      </div>
      
      <p>Bitte nehmen Sie Kontakt mit unserem Support-Team auf, damit wir Ihnen bei der erfolgreichen Verifizierung helfen können.</p>
      
      <div class="cta-container">
        <a href="mailto:info@novacana.de?subject=Rückfrage%20zur%20Verifizierung%20${id}" class="button">Support kontaktieren</a>
      </div>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
      <p>Novacana GmbH, Musterstraße 123, 10115 Berlin, Deutschland</p>
    </div>
  </div>
</body>
</html>`
        });
        
        console.log("Rejection email sent:", emailResponse);
      } catch (emailError) {
        // Log email error but don't fail the function
        console.error("Error sending rejection email:", emailError);
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Verification rejected successfully",
          verificationId: id,
          rejectionReason
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
  } catch (error) {
    console.error("Error in manage-pharmacy-verification function:", error.message)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
