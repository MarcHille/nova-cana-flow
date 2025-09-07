
import { validateField } from "@/utils/formValidation";

interface ContactFormData {
  name: string;
  email: string;
  pharmacyName: string;
  message: string;
}

export const useContactFormValidation = () => {
  const validateForm = (formData: ContactFormData): string | null => {
    if (!formData.name.trim()) {
      return "Bitte geben Sie Ihren Namen ein.";
    }

    if (!formData.email.trim()) {
      return "Bitte geben Sie Ihre E-Mail-Adresse ein.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    }

    if (!formData.message.trim()) {
      return "Bitte geben Sie eine Nachricht ein.";
    }

    return null;
  };

  return { validateForm };
};
