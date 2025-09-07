
import React from "react";
import TermsSection from "./TermsSection";

interface TermsContentProps {
  language: "de" | "en";
}

const TermsContent = ({ language }: TermsContentProps) => {
  if (language !== "de") {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <p>English version of Terms and Conditions is currently being translated. Please refer to the German version.</p>
      </div>
    );
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <TermsSection title="1. Geltungsbereich">
        <p>
          1.1. Die nachfolgenden Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen und Lieferungen zwischen der Novacana GmbH (nachfolgend „Anbieter") und ihren Kunden (nachfolgend „Kunde"), die über die Website novacana.de oder per Kontaktformular erfolgen.
        </p>
        <p>
          1.2. Unsere Angebote richten sich ausschließlich an verifizierte Apotheken, die im Besitz einer gültigen Betriebserlaubnis gemäß § 1 Apothekengesetz (ApoG) sind.
        </p>
        <p>
          1.3. Entgegenstehende, abweichende oder ergänzende Allgemeine Geschäftsbedingungen des Kunden werden nicht Vertragsbestandteil, es sei denn, deren Geltung wird ausdrücklich schriftlich zugestimmt.
        </p>
      </TermsSection>

      <TermsSection title="2. Registrierung und Verifikation">
        <p>
          2.1. Zur Nutzung des Online-Bestellsystems ist eine vorherige Registrierung und Überprüfung der Apothekenbetriebserlaubnis erforderlich.
        </p>
        <p>
          2.2. Die Lieferung erfolgt ausschließlich an verifizierte Apotheken. Eine Lieferung an Privatpersonen, Ärzte, andere Institutionen oder nicht-verifizierte Stellen ist ausgeschlossen.
        </p>
      </TermsSection>

      <TermsSection title="3. Produktsortiment und Bestellungen">
        <p>
          3.1. Das angebotene Sortiment umfasst insbesondere Arzneimittel, einschließlich Produkte mit Cannabis gemäß § 31 Abs. 6 SGB V und sonstige pharmazeutische Produkte, die apothekenpflichtig sind.
        </p>
        <p>
          3.2. Bestellungen können direkt über die Website oder über das Kontaktformular aufgegeben werden.
        </p>
        <p>
          3.3. Mit Abgabe der Bestellung gibt der Kunde ein verbindliches Angebot zum Abschluss eines Kaufvertrages ab. Der Anbieter behält sich vor, den Auftrag anzunehmen oder abzulehnen.
        </p>
      </TermsSection>

      <TermsSection title="4. Preise und Zahlungsbedingungen">
        <p>
          4.1. Alle angegebenen Preise verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer und ggf. Versandkosten.
        </p>
        <p>
          4.2. Die Rechnungsstellung erfolgt nach erfolgter Lieferung. Zahlungsbedingungen werden im Einzelfall festgelegt.
        </p>
      </TermsSection>

      <TermsSection title="5. Lieferung und Versand">
        <p>
          5.1. Lieferungen erfolgen nur innerhalb Deutschlands an die verifizierte Adresse der registrierten Apotheke.
        </p>
        <p>
          5.2. Eine Lieferung erfolgt nach Maßgabe der Verfügbarkeit der Waren.
        </p>
        <p>
          5.3. Werden Produkte mit Cannabis bestellt, erfolgt die Lieferung gemäß den gesetzlichen Vorschriften und unter Einhaltung aller erforderlichen Dokumentationspflichten.
        </p>
      </TermsSection>

      <TermsSection title="6. Eigentumsvorbehalt">
        <p>
          6.1. Die gelieferten Waren bleiben bis zur vollständigen Bezahlung Eigentum des Anbieters.
        </p>
      </TermsSection>

      <TermsSection title="7. Gewährleistung und Haftung">
        <p>
          7.1. Es gelten die gesetzlichen Gewährleistungsrechte.
        </p>
        <p>
          7.2. Schadensersatzansprüche sind ausgeschlossen, soweit sie nicht auf vorsätzlicher oder grob fahrlässiger Pflichtverletzung beruhen.
        </p>
      </TermsSection>

      <TermsSection title="8. Datenschutz">
        <p>
          8.1. Die für die Vertragsabwicklung erforderlichen personenbezogenen Daten werden gemäß den Bestimmungen der DSGVO und des BDSG verarbeitet.
        </p>
        <p>
          8.2. Weitere Informationen finden Sie in unserer Datenschutzerklärung.
        </p>
      </TermsSection>

      <TermsSection title="9. Schlussbestimmungen">
        <p>
          9.1. Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
        </p>
        <p>
          9.2. Gerichtsstand ist, soweit gesetzlich zulässig, Frankfurt am Main.
        </p>
        <p>
          9.3. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, berührt dies nicht die Wirksamkeit der übrigen Bestimmungen.
        </p>
      </TermsSection>

      <p className="mt-8 text-sm text-gray-600">
        Stand: 04/2025
      </p>
    </div>
  );
};

export default TermsContent;
