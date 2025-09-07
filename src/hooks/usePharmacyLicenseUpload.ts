
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ExtractedLicenseData {
  licenseName?: string;
  licenseId?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  contactPerson?: string;
}

export const usePharmacyLicenseUpload = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedLicenseData | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const validateFile = (file: File | null): { isValid: boolean; error: string | null } => {
    if (!file) {
      return { isValid: false, error: "Keine Datei ausgewählt." };
    }

    // Check file type
    const isPdf = file.type === "application/pdf";
    if (!isPdf) {
      return { isValid: false, error: "Bitte nur PDF-Dateien hochladen." };
    }

    // Check file size (10MB max for license documents)
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return { isValid: false, error: "Die Datei darf maximal 10MB groß sein." };
    }

    // Validate filename length and characters
    const hasValidName = file.name.length <= 255 && /^[a-zA-Z0-9_\-. ()]+$/.test(file.name);
    if (!hasValidName) {
      return { isValid: false, error: "Der Dateiname enthält ungültige Zeichen." };
    }

    return { isValid: true, error: null };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    const { isValid, error } = validateFile(selectedFile);
    
    setFileError(error);
    setFile(isValid ? selectedFile : null);
    setExtractedData(null);
    setExtractionError(null);
  };

  const uploadAndExtractData = async (): Promise<ExtractedLicenseData | null> => {
    if (!file) {
      setFileError("Bitte wählen Sie eine PDF-Datei aus.");
      return null;
    }

    try {
      setIsUploading(true);
      setFileError(null);
      setExtractionError(null);

      // Generate a secure random filename with the original extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
      const filePath = `pharmacy-licenses/${fileName}`;

      // Upload the file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pharmacy-documents')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Fehler beim Hochladen: ${uploadError.message}`);
      }

      // Get URL to the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('pharmacy-documents')
        .getPublicUrl(filePath);

      // Call the edge function to extract data from the PDF
      setIsExtracting(true);
      const { data, error } = await supabase.functions.invoke('extract-pharmacy-license', {
        body: { fileUrl: publicUrl }
      });

      if (error) {
        console.error("Extraction error:", error);
        setExtractionError(`Fehler bei der Datenextraktion: ${error.message}`);
        throw new Error(`Fehler bei der Datenextraktion: ${error.message}`);
      }

      if (!data || !data.success) {
        setExtractionError(data?.error || "Fehler bei der Datenextraktion");
        throw new Error(data?.error || "Fehler bei der Datenextraktion");
      }

      // Set the extracted data
      setExtractedData(data.extractedData);
      
      toast({
        title: "Datenextraktion erfolgreich",
        description: "Die Daten wurden aus der PDF extrahiert und vorausgefüllt.",
      });

      return data.extractedData;
    } catch (error: any) {
      console.error("License upload and extraction error:", error);
      setFileError(error.message);
      setExtractionError(error.message);
      
      toast({
        title: "Fehler bei der Verarbeitung",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsUploading(false);
      setIsExtracting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setFileError(null);
    setExtractedData(null);
    setExtractionError(null);
  };

  return {
    file,
    fileError,
    isUploading,
    isExtracting,
    extractedData,
    extractionError,
    handleFileChange,
    uploadAndExtractData,
    reset
  };
};
