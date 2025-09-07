
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { Resend } from 'npm:resend@2.0.0'
import { corsHeaders } from '../_shared/cors.ts'
import { getPharmacyVerificationRequestTemplate } from './email-template.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { userId, redirectTo } = requestData

    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log("Processing verification email request for user:", userId)
    console.log("Redirect URL:", redirectTo || 'Not provided')
    
    // Initialize Supabase client with service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    )

    // Check if user exists using the admin getUserById function
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (userError || !userData || !userData.user) {
      console.error("User not found:", userError)
      throw new Error(`User not found: ${userError?.message || 'Unknown error'}`)
    }

    const userEmail = userData.user.email
    const userName = userData.user.user_metadata?.name || userEmail?.split('@')[0] || 'Benutzer'
    
    try {
      // Check if a verification request already exists - use direct query to bypass RLS
      const { data: existingVerification, error: existingError } = await supabaseAdmin
        .from('pharmacy_verification')
        .select('verification_status')
        .eq('user_id', userId)
        .maybeSingle()

      if (existingError) {
        console.error("Error checking existing verification:", existingError)
        throw existingError
      }

      // Create a verification entry if it doesn't exist
      if (!existingVerification) {
        const { error: insertError } = await supabaseAdmin
          .from('pharmacy_verification')
          .insert({
            user_id: userId,
            verification_status: 'pending',
            contact_details: { email: userEmail },
            license_id: 'To be provided',
            business_documents: []
          })

        if (insertError) {
          console.error("Error creating verification entry:", insertError)
          throw insertError
        }
      } else if (existingVerification.verification_status !== 'pending' && existingVerification.verification_status !== 'verified') {
        // Update status to pending if not already pending or verified
        const { error: updateError } = await supabaseAdmin
          .from('pharmacy_verification')
          .update({ verification_status: 'pending' })
          .eq('user_id', userId)

        if (updateError) {
          console.error("Error updating verification status:", updateError)
          throw updateError
        }
      }
    } catch (dbError) {
      console.error("Database operation error:", dbError)
      throw new Error(`Database error: ${dbError.message}`)
    }
    
    // Initialize Resend client for email sending
    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable not set")
    }
    
    const resend = new Resend(resendApiKey)
    
    // Ensure the redirect URL points to dashboard page
    // Add logic to check if user is already registered, and direct them to login if so
    // or to register page if they need to create an account
    const baseUrl = redirectTo 
      ? new URL(redirectTo).origin 
      : (Deno.env.get('SITE_URL') || 'https://novacana.de')
    
    // Check if the user already has a password set (meaning they're registered)
    const hasPassword = userData.user.app_metadata?.provider === 'email' && 
                      userData.user.has_password === true
    
    // Direct the user to the appropriate page based on their registration status
    const actualRedirect = hasPassword
      ? `${baseUrl}/login?returnUrl=/dashboard`
      : `${baseUrl}/register?email=${encodeURIComponent(userEmail)}`
    
    // Use a consistent sender email
    const fromEmail = "no-reply@novacana.de"
    
    console.log(`Sending verification email to ${userEmail} (${userName}) with redirect to ${actualRedirect}`)
    console.log(`User registration status: ${hasPassword ? 'Already registered' : 'Needs to register'}`)
    
    const emailResponse = await resend.emails.send({
      from: `Novacana <${fromEmail}>`,
      to: userEmail,
      subject: "Verifizieren Sie Ihre Apotheke bei Novacana",
      html: getPharmacyVerificationRequestTemplate(userName, actualRedirect)
    })
    
    console.log("Verification email sent successfully:", emailResponse)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Verifizierungsanleitung wurde gesendet",
        emailId: emailResponse.id,
        redirectUrl: actualRedirect
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in request-pharmacy-verification-email function:", error.message)
    
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
