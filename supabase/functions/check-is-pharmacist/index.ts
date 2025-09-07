
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

    console.log("Checking pharmacist status for user ID:", userId)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    // First check if user has pharmacist role directly
    const { data: roleData, error: roleError } = await supabaseClient.rpc('has_role', {
      _user_id: userId,
      _role: 'pharmacist'
    })

    if (roleError) {
      console.error("Error checking pharmacist role:", roleError)
      throw roleError
    }

    const hasPharmacistRole = !!roleData
    console.log("User", userId, "pharmacist role status:", hasPharmacistRole)
    
    // Check verification status regardless of role status
    const { data: verificationData, error: verificationError } = await supabaseClient
      .from('pharmacy_verification')
      .select('verification_status')
      .eq('user_id', userId)
      .maybeSingle()
      
    if (verificationError) {
      console.error("Error checking verification status:", verificationError)
      // Return based on role only if there's a verification error
      return new Response(
        JSON.stringify({ 
          isPharmacist: hasPharmacistRole,
          isVerified: hasPharmacistRole,
          userId
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
    
    // Check if they have approved verification status
    const isApproved = verificationData?.verification_status === 'approved'
    const isPending = verificationData?.verification_status === 'pending'
    
    // If they're approved but don't have the role, assign it
    if (isApproved && !hasPharmacistRole) {
      console.log("User is approved but missing pharmacist role, assigning role...")
      
      try {
        // Use the assign_role_to_user function to assign the role
        const { data: assignResult, error: assignError } = await supabaseClient.rpc('assign_role_to_user', {
          _user_id: userId,
          _role: 'pharmacist'
        })
        
        if (assignError) {
          console.error("Error assigning pharmacist role:", assignError)
        } else {
          console.log("Successfully assigned pharmacist role to user")
          // Update our response since we've fixed the role
          hasPharmacistRole = true
        }
      } catch (assignError) {
        console.error("Error in assign role operation:", assignError)
      }
    }
    
    return new Response(
      JSON.stringify({ 
        isPharmacist: hasPharmacistRole || isApproved, // Consider approved users as pharmacists
        isPending: isPending,
        isVerified: isApproved,
        userId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in check-is-pharmacist function:", error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
