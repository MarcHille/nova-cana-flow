
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as pdfjs from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl } = await req.json();
    
    if (!fileUrl) {
      return new Response(
        JSON.stringify({ error: "No file URL provided" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Processing pharmacy license from URL:", fileUrl);
    
    // Initialize PDF.js worker
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js';
    
    try {
      // Load and parse PDF file
      const pdf = await pdfjs.getDocument(fileUrl).promise;
      console.log(`PDF loaded with ${pdf.numPages} pages`);
      
      let extractedText = "";
      
      // Process first page only for performance
      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      extractedText += pageText + "\n";
      
      // Extract potential license number using regex pattern for German pharmacy licenses
      const licenseNumberMatch = extractedText.match(/Apothekenerlaubnis(?:\s*Nr\.?)?[\s:]*([\w\d\-\.\/]+)/i) || 
                                extractedText.match(/Betriebserlaubnis(?:\s*Nr\.?)?[\s:]*([\w\d\-\.\/]+)/i) || 
                                extractedText.match(/Zulassungsnummer(?:\s*Nr\.?)?[\s:]*([\w\d\-\.\/]+)/i);
      
      const licenseNumber = licenseNumberMatch ? licenseNumberMatch[1].trim() : null;
      
      // Extract potential name using regex
      const nameMatch = extractedText.match(/Name(?:\s*des Apothekers)?[\s:]*([\w\s\-\.]+)(?:,|\n|$)/i) ||
                        extractedText.match(/Inhaber(?:\s*der Apotheke)?[\s:]*([\w\s\-\.]+)(?:,|\n|$)/i);
      
      const name = nameMatch ? nameMatch[1].trim() : null;
      
      // Extract potential pharmacy name
      const pharmacyNameMatch = extractedText.match(/Apotheke(?:nname)?[\s:]*([\w\s\-\.]+)(?:,|\n|$)/i) || 
                                extractedText.match(/([\w\s\-\.]+)(?:\-|\s)Apotheke/i);
      
      const pharmacyName = pharmacyNameMatch ? pharmacyNameMatch[1].trim() : null;
      
      const result = {
        licenseNumber: licenseNumber || "Nicht gefunden",
        name: name || "Nicht gefunden",
        pharmacyName: pharmacyName || "Nicht gefunden",
        textSample: extractedText.substring(0, 500) + "..." // Sample for debugging
      };
      
      console.log("Extraction results:", result);
      
      return new Response(
        JSON.stringify(result),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (pdfError) {
      console.error("PDF processing error:", pdfError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to process the PDF file", 
          details: pdfError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error("General error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Server error while processing pharmacy license", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
