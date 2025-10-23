
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useContactFileUpload } from "./useContactFileUpload";
import { useContactFormValidation } from "./useContactFormValidation";

interface ContactFormData {
  name: string;
  email: string;
  pharmacyName: string;
  message: string;
}

interface ContactFormProps {
  successMessage: string;
  errorMessage: string;
}

export const useContact = ({ successMessage, errorMessage }: ContactFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    pharmacyName: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const { files, fileError, handleFileChange, resetFiles } = useContactFileUpload();
  const { validateForm } = useContactFormValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (formError) {
      setFormError(null);
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('contact-attachments')
        .upload(fileName, file);

      if (error) {
        console.error('File upload error:', error);
        throw new Error('Fehler beim Hochladen der Datei: ' + error.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('contact-attachments')
        .getPublicUrl(data.path);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      pharmacyName: "",
      message: ""
    });
    setFormError(null);
    resetFiles();
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validationError = validateForm(formData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      let attachmentUrls: string[] = [];
      if (files.length > 0) {
        attachmentUrls = await uploadFiles(files);
      }

      const { data, error } = await supabase.functions.invoke("custom-email", {
        body: {
          type: "contact",
          name: formData.name,
          email: formData.email,
          pharmacyName: formData.pharmacyName,
          message: formData.message,
          attachments: attachmentUrls
        }
      });

      if (error) {
        throw new Error(error.message || "Fehler beim Senden der Nachricht");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Es ist ein Fehler aufgetreten");
      }

      toast({
        title: "Nachricht gesendet",
        description: successMessage,
      });

      resetForm();
    } catch (error: any) {
      console.error("Kontaktformularfehler:", error);
      setFormError(error.message || errorMessage);
      toast({
        title: "Fehler",
        description: error.message || errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    formError,
    fileError,
    handleChange,
    handleFileChange,
    submitForm,
    resetForm
  };
};
