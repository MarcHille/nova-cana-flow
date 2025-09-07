
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a PDF is accessible in storage
 * @param filename The name of the PDF file to check
 * @returns Boolean indicating if the file exists and is accessible
 */
export const isPDFAccessible = async (filename: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('formulation-guides')
      .list('', {
        search: filename
      });
    
    if (error) {
      console.error('Error checking PDF accessibility:', error);
      return false;
    }
    
    return data && data.length > 0 && data.some(file => file.name === filename);
  } catch (error) {
    console.error('Error in isPDFAccessible:', error);
    return false;
  }
};

/**
 * Gets a list of all available formulation guides
 * @returns A promise resolving to a list of PDF filenames
 */
export const listAvailableGuides = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('formulation-guides')
      .list('');
    
    if (error) {
      console.error('Error listing formulation guides:', error);
      return [];
    }
    
    return data
      ? data
          .filter(file => file.name.endsWith('.pdf'))
          .map(file => file.name)
      : [];
  } catch (error) {
    console.error('Error in listAvailableGuides:', error);
    return [];
  }
};

/**
 * Gets metadata for a specific PDF file
 * @param filename The name of the PDF file
 * @returns A promise resolving to metadata about the file
 */
export const getPDFMetadata = async (
  filename: string
): Promise<Record<string, any> | null> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('formulation-guides')
      .list('', {
        search: filename
      });
    
    if (error || !data || data.length === 0) {
      console.error('Error getting PDF metadata:', error);
      return null;
    }
    
    const fileData = data.find(file => file.name === filename);
    
    if (!fileData) {
      return null;
    }
    
    return {
      name: fileData.name,
      size: fileData.metadata?.size || 0,
      mimetype: fileData.metadata?.mimetype || 'application/pdf',
      lastModified: fileData.metadata?.lastModified || null,
      id: fileData.id
    };
  } catch (error) {
    console.error('Error in getPDFMetadata:', error);
    return null;
  }
};
