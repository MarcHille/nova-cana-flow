import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Imprint = () => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container-content max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {language === "de" ? "Impressum" : "Imprint"}
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "Angaben gemäß § 5 TMG" : "Information according to § 5 TMG"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Novacana GmbH<br />
              Guerickeweg 5<br />
              64291 Darmstadt<br />
              Deutschland
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2 text-gray-900 dark:text-white">
              {language === "de" ? "Kontakt" : "Contact"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>{language === "de" ? "Telefon:" : "Phone:"}</strong> +49 (0) 69 945159 18<br />
              <strong>E-Mail:</strong> info@novacana.de
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2 text-gray-900 dark:text-white">
              {language === "de" ? "Geschäftsführung" : "Management"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Rolf-Wilhelm Schlüter
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2 text-gray-900 dark:text-white">
              {language === "de" ? "Registereintrag" : "Register Entry"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de" ? "Handelsregister B des Amtsgerichts Darmstadt" : "Commercial Register B of Darmstadt District Court"}<br />
              {language === "de" ? "Registernummer:" : "Register Number:"} HRB 102547
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2 text-gray-900 dark:text-white">
              {language === "de" ? "Umsatzsteuer-ID" : "VAT ID"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de" 
                ? "Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:" 
                : "VAT identification number according to § 27a UStG:"} DE324922002
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "Berufsrechtliche Angaben" : "Professional Regulatory Information"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de" 
                ? "Novacana GmbH ist ein GDP-zertifiziertes pharmazeutisches Großhandelsunternehmen mit den erforderlichen Erlaubnissen für den Handel mit Arzneimitteln und medizinischem Cannabis."
                : "Novacana GmbH is a GDP-certified pharmaceutical wholesale company with the required permits for trading pharmaceuticals and medical cannabis."}
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2 text-gray-900 dark:text-white">
              {language === "de" ? "Aufsichtsbehörde" : "Supervisory Authority"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Regierungspräsidium Darmstadt<br />
              Luisenplatz 2<br />
              64283 Darmstadt
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "Haftungsausschluss" : "Disclaimer"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich."
                : "Despite careful content control, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content."}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Imprint;