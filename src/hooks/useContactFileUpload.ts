
import { useState } from "react";

interface FileValidationResult {
  isValid: boolean;
  error: string | null;
}

export const useContactFileUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const validateFiles = (fileList: FileList | null): FileValidationResult => {
    setFileError(null);
    
    if (!fileList) {
      return { isValid: true, error: null };
    }

    // Convert FileList to Array for easier processing
    const selectedFiles = Array.from(fileList);
    
    // Check for empty files
    if (selectedFiles.length === 0) {
      return { isValid: true, error: null };
    }
    
    // Check file size (5MB max)
    const maxSizeInBytes = 5 * 1024 * 1024;
    
    // Check file types and size
    const invalidFiles = selectedFiles.filter(file => {
      // Sanitize and validate file type
      const fileType = file.type.toLowerCase();
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      const isValidType = validTypes.includes(fileType);
      
      // Validate file size
      const isValidSize = file.size <= maxSizeInBytes;
      
      // Validate filename length and characters
      const hasValidName = file.name.length <= 255 && /^[a-zA-Z0-9_\-. ()]+$/.test(file.name);
      
      return !isValidType || !isValidSize || !hasValidName;
    });

    if (invalidFiles.length > 0) {
      return {
        isValid: false,
        error: 'Ungültige Dateien gefunden. Bitte nur Bilder oder PDFs unter 5MB hochladen mit gültigen Dateinamen.'
      };
    }

    return { isValid: true, error: null };
  };

  const handleFileChange = (newFiles: FileList | null) => {
    const { isValid, error } = validateFiles(newFiles);
    setFileError(error);
    
    if (isValid && newFiles) {
      setFiles(Array.from(newFiles));
    } else {
      setFiles([]);
    }
  };

  return {
    files,
    fileError,
    handleFileChange,
    resetFiles: () => {
      setFiles([]);
      setFileError(null);
    }
  };
};
