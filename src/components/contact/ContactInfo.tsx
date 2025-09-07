import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactInfo: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="glass-card rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {t('contact.info.title') || "Kontaktinformationen"}
      </h3>
      <ul className="space-y-6">
        <li className="flex items-start">
          <MapPin size={24} className="mr-4 text-nova-600 dark:text-nova-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{t('contact.info.address') || "Adresse"}</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Guerickeweg 5<br />
              64291 Darmstadt<br />
              Deutschland
            </p>
          </div>
        </li>
        
        <li className="flex items-start">
          <Phone size={24} className="mr-4 text-nova-600 dark:text-nova-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{t('contact.info.phone') || "Telefon"}</h4>
            <p className="text-gray-600 dark:text-gray-300">
              <a href="tel:+4969945159180" className="hover:text-nova-600 dark:hover:text-nova-400">
                +49 (0) 69 945159 18
              </a>
            </p>
          </div>
        </li>
        
        <li className="flex items-start">
          <Mail size={24} className="mr-4 text-nova-600 dark:text-nova-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{t('contact.info.email') || "E-Mail"}</h4>
            <p className="text-gray-600 dark:text-gray-300">
              <a href="mailto:info@novacana.de" className="hover:text-nova-600 dark:hover:text-nova-400">
                info@novacana.de
              </a>
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ContactInfo;
