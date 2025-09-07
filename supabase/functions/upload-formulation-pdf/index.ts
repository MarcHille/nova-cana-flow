
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }
    
    // Parse the multipart form data
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file || !(file instanceof File)) {
      throw new Error('No file uploaded')
    }
    
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed')
    }
    
    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    
    // Check if storage bucket exists, if not create it
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    if (!buckets?.find(bucket => bucket.name === 'formulation-guides')) {
      await supabaseAdmin.storage.createBucket('formulation-guides', {
        public: true,
        fileSizeLimit: 10485760 // 10MB limit
      })
    }
    
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Upload file to Supabase storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('formulation-guides')
      .upload('formulation-guide.pdf', arrayBuffer, {
        contentType: 'application/pdf',
        upsert: true
      })
    
    if (uploadError) {
      throw new Error(`Storage error: ${uploadError.message}`)
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'PDF successfully uploaded'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in upload-formulation-pdf:', error.message)
    
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
