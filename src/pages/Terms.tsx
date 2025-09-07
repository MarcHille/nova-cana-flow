
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import TermsHeader from "@/components/terms/TermsHeader";
import TermsContent from "@/components/terms/TermsContent";

const Terms = () => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container-content max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {language === "de" ? "Allgemeine Geschäftsbedingungen" : "Terms and Conditions"}
          </h1>
          
          {language === "de" && (
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              der Novacana GmbH für den Verkauf an Apotheken
            </p>
          )}
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "§ 1 Geltungsbereich" : "§ 1 Scope"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Diese Allgemeinen Geschäftsbedingungen gelten für alle Geschäftsbeziehungen zwischen der Novacana GmbH (nachfolgend \"Novacana\") und Apotheken als Kunden im Rahmen des pharmazeutischen Großhandels."
                : "These General Terms and Conditions apply to all business relationships between Novacana GmbH (hereinafter \"Novacana\") and pharmacies as customers in the context of pharmaceutical wholesale."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "§ 2 Vertragsschluss" : "§ 2 Contract Formation"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Bestellungen können über unsere Website, telefonisch oder per E-Mail erfolgen. Der Vertrag kommt durch unsere Auftragsbestätigung oder die Lieferung der Ware zustande. Wir behalten uns vor, Bestellungen ohne Angabe von Gründen abzulehnen."
                : "Orders can be placed through our website, by phone, or by email. The contract is formed through our order confirmation or delivery of goods. We reserve the right to reject orders without giving reasons."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "§ 3 Preise und Zahlungsbedingungen" : "§ 3 Prices and Payment Terms"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Alle Preise verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt nach unseren jeweiligen Zahlungsbedingungen. Bei Zahlungsverzug berechnen wir Verzugszinsen in Höhe von 9 Prozentpunkten über dem Basiszinssatz."
                : "All prices are subject to statutory VAT. Payment is made according to our respective payment terms. In case of payment default, we charge default interest at 9 percentage points above the base rate."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "§ 4 Lieferung und Gefahrübergang" : "§ 4 Delivery and Transfer of Risk"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Die Lieferung erfolgt frei Haus an die vom Kunden angegebene Lieferadresse. Die Gefahr geht mit der Übergabe der Ware an den Kunden oder eine von ihm beauftragte Person über. Lieferzeiten sind unverbindlich, es sei denn, sie wurden ausdrücklich als verbindlich zugesagt."
                : "Delivery is made free of charge to the delivery address specified by the customer. Risk transfers upon handover of goods to the customer or a person commissioned by them. Delivery times are non-binding unless expressly agreed as binding."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "§ 5 Gewährleistung" : "§ 5 Warranty"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Wir gewährleisten, dass die gelieferten Arzneimittel den gesetzlichen Anforderungen entsprechen und ordnungsgemäß gelagert wurden. Mängel sind unverzüglich nach Erhalt der Ware zu rügen. Bei berechtigten Mängelrügen leisten wir nach unserer Wahl Nacherfüllung oder gewähren Minderung."
                : "We warrant that the delivered pharmaceuticals meet legal requirements and have been properly stored. Defects must be reported immediately upon receipt of goods. For justified complaints, we provide supplementary performance or grant a reduction at our discretion."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "§ 6 Haftung" : "§ 6 Liability"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Unsere Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Dies gilt nicht für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für die Verletzung wesentlicher Vertragspflichten."
                : "Our liability is limited to intent and gross negligence. This does not apply to damages from injury to life, body, or health, as well as for breach of essential contractual obligations."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "§ 7 Datenschutz" : "§ 7 Data Protection"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Die Verarbeitung personenbezogener Daten erfolgt entsprechend unserer Datenschutzerklärung und den gesetzlichen Bestimmungen der DSGVO."
                : "The processing of personal data is carried out in accordance with our privacy policy and the legal provisions of the GDPR."}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
              {language === "de" ? "§ 8 Schlussbestimmungen" : "§ 8 Final Provisions"}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {language === "de"
                ? "Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist Darmstadt. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt."
                : "German law applies, excluding the UN Convention on Contracts for the International Sale of Goods. The place of jurisdiction is Darmstadt. Should individual provisions be invalid, the validity of the remaining provisions remains unaffected."}
            </p>
            
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Novacana GmbH</strong><br />
                Guerickeweg 5<br />
                64291 Darmstadt<br />
                Deutschland<br />
                <br />
                {language === "de" ? "Stand:" : "Version:"} {new Date().toLocaleDateString(language === "de" ? "de-DE" : "en-US")}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
