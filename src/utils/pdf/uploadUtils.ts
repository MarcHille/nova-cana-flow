
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads a PDF file to the Supabase storage
 * @param file The PDF file to upload
 * @returns A promise resolving to upload result with success status and message
 */
export const uploadFormulationPDF = async (
  file: File
): Promise<{ success: boolean; message: string; filePath?: string }> => {
  try {
    if (!file || file.type !== 'application/pdf') {
      return {
        success: false,
        message: 'Ungültige Datei. Bitte wählen Sie eine PDF-Datei.'
      };
    }

    const filePath = file.name;
    console.log(`Attempting to upload PDF: ${filePath}`);

    // Upload file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('formulation-guides')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Overwrite if exists
      });

    if (error) {
      console.error('Error uploading PDF:', error);
      return {
        success: false,
        message: `Upload fehlgeschlagen: ${error.message}`
      };
    }

    console.log('PDF uploaded successfully:', data.path);
    
    return {
      success: true,
      message: 'PDF erfolgreich hochgeladen',
      filePath: data.path
    };
  } catch (error) {
    console.error('Unexpected error in uploadFormulationPDF:', error);
    return {
      success: false,
      message: `Ein unerwarteter Fehler ist aufgetreten: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
    };
  }
};
