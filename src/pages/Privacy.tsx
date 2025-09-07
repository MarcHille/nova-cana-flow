
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container-content max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            {language === "de" ? "Datenschutzerklärung" : "Privacy Policy"}
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "1. Verantwortliche Stelle" : "1. Data Controller"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de" 
                ? "Verantwortlich für die Datenverarbeitung auf dieser Website ist:"
                : "The data controller for this website is:"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Novacana GmbH<br />
              Guerickeweg 5<br />
              64291 Darmstadt<br />
              Deutschland<br />
              <br />
              {language === "de" ? "Telefon:" : "Phone:"} +49 (0) 69 945159 18<br />
              E-Mail: info@novacana.de
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "2. Erhebung und Speicherung personenbezogener Daten" : "2. Collection and Storage of Personal Data"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Wir erheben und speichern personenbezogene Daten nur, soweit dies für die Durchführung unserer Geschäftstätigkeit erforderlich ist oder gesetzlich vorgeschrieben ist. Die Datenverarbeitung erfolgt ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003)."
                : "We collect and store personal data only to the extent necessary for conducting our business activities or as required by law. Data processing is carried out exclusively on the basis of legal provisions (GDPR, TKG 2003)."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "3. Zweck der Datenverarbeitung" : "3. Purpose of Data Processing"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Die Verarbeitung Ihrer personenbezogenen Daten erfolgt zu folgenden Zwecken:"
                : "The processing of your personal data is carried out for the following purposes:"}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
              <li>{language === "de" ? "Bereitstellung unserer Website und deren Funktionalitäten" : "Provision of our website and its functionalities"}</li>
              <li>{language === "de" ? "Bearbeitung von Anfragen und Bestellungen" : "Processing of inquiries and orders"}</li>
              <li>{language === "de" ? "Erfüllung vertraglicher Verpflichtungen" : "Fulfillment of contractual obligations"}</li>
              <li>{language === "de" ? "Einhaltung gesetzlicher Vorgaben" : "Compliance with legal requirements"}</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "4. Cookies" : "4. Cookies"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Unsere Website verwendet Cookies, um die Funktionalität zu gewährleisten und die Benutzererfahrung zu verbessern. Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden. Sie können die Verwendung von Cookies in Ihren Browsereinstellungen kontrollieren."
                : "Our website uses cookies to ensure functionality and improve user experience. Cookies are small text files stored on your device. You can control the use of cookies in your browser settings."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "5. Ihre Rechte" : "5. Your Rights"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:"
                : "You have the following rights regarding your personal data:"}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
              <li>{language === "de" ? "Recht auf Auskunft (Art. 15 DSGVO)" : "Right to information (Art. 15 GDPR)"}</li>
              <li>{language === "de" ? "Recht auf Berichtigung (Art. 16 DSGVO)" : "Right to rectification (Art. 16 GDPR)"}</li>
              <li>{language === "de" ? "Recht auf Löschung (Art. 17 DSGVO)" : "Right to erasure (Art. 17 GDPR)"}</li>
              <li>{language === "de" ? "Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)" : "Right to restriction of processing (Art. 18 GDPR)"}</li>
              <li>{language === "de" ? "Recht auf Datenübertragbarkeit (Art. 20 DSGVO)" : "Right to data portability (Art. 20 GDPR)"}</li>
              <li>{language === "de" ? "Recht auf Widerspruch (Art. 21 DSGVO)" : "Right to object (Art. 21 GDPR)"}</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "6. Kontakt" : "6. Contact"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:"
                : "If you have any questions about data protection, you can contact us at any time:"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Novacana GmbH<br />
              Guerickeweg 5<br />
              64291 Darmstadt<br />
              E-Mail: info@novacana.de
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
