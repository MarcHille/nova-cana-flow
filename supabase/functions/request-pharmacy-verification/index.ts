
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { userId } = requestData

    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log("Processing verification request for user:", userId)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    // Check if user exists
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(userId)
    
    if (userError || !userData || !userData.user) {
      console.error("User not found:", userError)
      throw new Error(`User not found: ${userError?.message || 'Unknown error'}`)
    }

    // Check if a verification request already exists
    const { data: existingVerification, error: existingError } = await supabaseClient
      .from('pharmacy_verification')
      .select('verification_status')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingError) {
      console.error("Error checking existing verification:", existingError)
      throw existingError
    }

    if (existingVerification) {
      console.log("Existing verification found:", existingVerification)
      return new Response(
        JSON.stringify({ 
          success: false,
          message: `A verification request already exists with status: ${existingVerification.verification_status}` 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Create a new verification request with pending status
    const { data: newVerification, error: insertError } = await supabaseClient
      .from('pharmacy_verification')
      .insert({
        user_id: userId,
        verification_status: 'pending',
        contact_details: { email: userData.user.email },  // Default to user's email
        license_id: 'To be provided',  // Placeholder
        business_documents: []  // Empty array initially
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating verification request:", insertError)
      throw insertError
    }

    console.log("Created verification request:", newVerification)

    // Send an email notification (placeholder for future implementation)
    // TODO: Implement email notification when user requests verification

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Verification request created successfully",
        verificationId: newVerification.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in request-pharmacy-verification function:", error.message)
    
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
