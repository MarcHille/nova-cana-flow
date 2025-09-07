
import React from "react";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import BusinessHours from "@/components/contact/BusinessHours";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-1/4 bottom-0 w-64 h-64 rounded-full bg-nova-100/40 dark:bg-nova-900/20 blur-3xl"></div>
        <div className="absolute left-0 top-1/4 w-80 h-80 rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-3xl"></div>
      </div>

      <div className="container-content relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('contact.title') || "Kontakt"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('contact.description') || "Haben Sie Fragen zu unseren Produkten oder Dienstleistungen? Kontaktieren Sie unser Team."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ContactForm />
          
          {/* Contact Info and Business Hours */}
          <div className="space-y-8">
            <ContactInfo />
            <BusinessHours />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
