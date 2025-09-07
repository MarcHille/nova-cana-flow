
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const BusinessHours: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="glass-card rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {t('contact.hours.title') || "Geschäftszeiten"}
      </h3>
      <dl className="space-y-2">
        <div className="flex justify-between">
          <dt className="font-medium text-gray-700 dark:text-gray-300">{t('contact.hours.weekdays') || "Montag - Freitag"}</dt>
          <dd className="text-gray-600 dark:text-gray-400">9:00 - 17:00 Uhr</dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-medium text-gray-700 dark:text-gray-300">{t('contact.hours.weekend') || "Samstag - Sonntag"}</dt>
          <dd className="text-gray-600 dark:text-gray-400">{t('contact.hours.closed') || "Geschlossen"}</dd>
        </div>
      </dl>
    </div>
  );
};

export default BusinessHours;
