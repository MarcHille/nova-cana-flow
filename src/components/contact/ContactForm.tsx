
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import ContactField from "./ContactField";
import ContactFileUpload from "./ContactFileUpload";
import { useContact } from "@/hooks/useContact";

const ContactForm: React.FC = () => {
  const { t } = useLanguage();
  
  const successMessage = t('contact.message.confirmation') || "Vielen Dank für Ihre Nachricht. Wir werden uns in Kürze bei Ihnen melden.";
  const errorMessage = t('contact.message.error') || "Bei der Übermittlung Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.";
  
  const {
    formData,
    isSubmitting,
    formError,
    fileError,
    handleChange,
    handleFileChange,
    submitForm
  } = useContact({ 
    successMessage, 
    errorMessage 
  });

  return (
    <div className="glass-card rounded-xl p-6 md:p-8 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {t('contact.form.title') || "Senden Sie uns eine Nachricht"}
      </h3>
      
      {formError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={submitForm} className="space-y-5">
        <ContactField
          id="name"
          name="name"
          label={t('contact.form.name') || "Name"}
          value={formData.name}
          onChange={handleChange}
          placeholder={t('contact.form.name.placeholder') || "Ihr Name"}
          required
        />
        
        <ContactField
          id="email"
          name="email"
          type="email"
          label={t('contact.form.email') || "E-Mail"}
          value={formData.email}
          onChange={handleChange}
          placeholder={t('contact.form.email.placeholder') || "Ihre E-Mail-Adresse"}
          required
        />
        
        <ContactField
          id="pharmacyName"
          name="pharmacyName"
          label={t('contact.form.pharmacy') || "Name der Apotheke"}
          value={formData.pharmacyName}
          onChange={handleChange}
          placeholder={t('contact.form.pharmacy.placeholder') || "Name Ihrer Apotheke"}
        />
        
        <ContactField
          id="message"
          name="message"
          type="textarea"
          label={t('contact.form.message') || "Nachricht"}
          value={formData.message}
          onChange={handleChange}
          placeholder={t('contact.form.message.placeholder') || "Wie können wir Ihnen helfen?"}
          required
        />

        <ContactFileUpload 
          onChange={handleFileChange}
          error={fileError}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('contact.form.sending') || "Wird gesendet..."}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Send size={16} className="mr-2" />
              {t('contact.form.send') || "Nachricht senden"}
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
