
import { saveAs } from 'file-saver';
import { supabase } from '@/integrations/supabase/client';

/**
 * Downloads a PDF file from the server
 * @param filename The name of the PDF file to download
 * @param displayName Optional custom name for the downloaded file
 */
export const downloadPDF = async (
  filename: string,
  displayName?: string
): Promise<boolean> => {
  try {
    console.log(`Attempting to download PDF: ${filename}`);
    
    // Get file from Supabase storage
    const { data, error } = await supabase
      .storage
      .from('formulation-guides')
      .download(filename);
    
    if (error) {
      console.error('Error downloading PDF:', error);
      throw new Error(`Failed to download ${filename}: ${error.message}`);
    }
    
    if (!data) {
      console.error('No data received when downloading PDF');
      throw new Error(`No data received when downloading ${filename}`);
    }
    
    // Save the file using FileSaver.js
    saveAs(data, displayName || filename);
    console.log(`PDF downloaded successfully: ${filename}`);
    
    return true;
  } catch (error) {
    console.error('Error in downloadPDF:', error);
    return false;
  }
};
