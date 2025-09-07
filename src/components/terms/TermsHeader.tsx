
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const TermsHeader = () => {
  const { language } = useLanguage();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {language === "de" ? "Allgemeine Geschäftsbedingungen (AGB)" : "Terms and Conditions"}
      </h1>
      
      {language === "de" && (
        <p className="mb-6">
          der Novacana GmbH, Guerickeweg 5, 64291 Darmstadt
          für Bestellungen von Apotheken über unsere Website
        </p>
      )}
    </div>
  );
};

export default TermsHeader;
