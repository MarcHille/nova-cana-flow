import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import FormulationCalculator from "./calculator/FormulationCalculator";

interface FormulationOverviewProps {
  onDownloadPDF: () => void;
}

const FormulationOverview: React.FC<FormulationOverviewProps> = ({ onDownloadPDF }) => {
  return (
    <div className="space-y-6">
      <FormulationCalculator />

      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-200 dark:border-blue-800 mb-4">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Zweck</h3>
        <p className="text-blue-700 dark:text-blue-200 text-sm">
          Diese Formulierungshilfe dient als Leitfaden für pharmazeutisches Personal zur Herstellung von 
          Rezepturarzneimitteln (eingestellte Cannabisextrakte oder Lösungen) auf Basis der Vollspektrum-Cannabisextrakte 
          Novacana® 65 T (THC-reich) und Novacana® 65 C (CBD-reich).
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-md border border-amber-200 dark:border-amber-800 mb-4">
        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Wichtiger Hinweis & Haftungsausschluss</h3>
        <p className="text-amber-700 dark:text-amber-200 text-sm">
          Diese Anleitung ist eine Empfehlung und muss an die spezifischen Gegebenheiten der Apotheke angepasst werden. 
          Die Herstellung darf nur durch qualifiziertes pharmazeutisches Personal gemäß §7 ApBetrO erfolgen. 
          Alle Schritte sind lückenlos im Herstellungsprotokoll zu dokumentieren. Die Vorgaben der Monographie 
          „Eingestellter Cannabisextrakt" des Deutschen Arzneibuchs (DAB) sowie geltende Gesetze und Richtlinien 
          (ApBetrO, GMP-Leitfaden, ggf. DAC/NRF) sind strikt einzuhalten. Die Verantwortung für die ordnungsgemäße 
          Herstellung, Prüfung und Qualität des Endproduktes liegt bei der herstellenden Apotheke.
        </p>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">1. Ausgangsmaterialien</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-200 text-sm mb-4">
        <li><strong>Novacana® 65 T:</strong> Raffinierter Cannabisextrakt (Charge z.B. FP0185) mit ca. 65% (w/w) Δ9-THC und ≤ 5% (w/w) CBD.</li>
        <li><strong>Novacana® 65 C:</strong> Raffinierter Cannabisextrakt (Charge z.B. FP0198) mit ca. 65% (w/w) CBD und ≤ 5% (w/w) Δ9-THC.</li>
        <li><strong>Hilfsstoffe:</strong> Mittelkettige Triglyceride (MCT-Öl, Ph. Eur.), Propylenglykol (PG, Ph. Eur., für Inhalation geeignet), ggf. Aromen/Terpene (für Inhalation geeignet, spezifikationskonform).</li>
        <li><strong>Analysenzertifikate (CoA):</strong> Die exakten Gehalte (% w/w) der Cannabinoide der verwendeten Chargen sind den jeweiligen CoAs zu entnehmen und für alle Berechnungen zu verwenden.</li>
      </ul>

      <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">2. Allgemeine Hinweise zur Herstellung</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200 text-sm">
        <li>
          <strong>Arbeitsplatz & Hygiene:</strong> Herstellung im Rezeptur- oder Laborbereich gemäß ApBetrO. Saubere Oberflächen und Geräte. Persönliche Schutzausrüstung (Kittel, Handschuhe, ggf. Schutzbrille).
        </li>
        <li>
          <strong>Geräte:</strong> Kalibrierte Waagen (Analysenwaage, Rezepturwaage), Heizgerät mit Temperaturkontrolle (Wasserbad oder Heizplatte mit Magnetrührer, 40-60°C), Thermometer, Bechergläser, Glasstäbe/Magnetrührer, ggf. Homogenisator, geeignete Primärpackmittel und Abfüllhilfen.
        </li>
        <li>
          <strong>Handhabung der Extrakte:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><strong>Erwärmung:</strong> Die Extrakte sind bei Raumtemperatur sehr viskos bis fest. Vor der Entnahme das geschlossene Originalgebinde schonend auf <strong>40 °C bis max. 60 °C</strong> erwärmen (Temperaturkontrolle!). Überhitzung vermeiden (Cannabinoid-Abbau!).</li>
            <li><strong>Homogenisierung:</strong> Den erwärmten Extrakt im Originalgebinde <em>vor jeder Entnahme</em> gründlich und vorsichtig mischen (Spatel/Schwenken), um eine Sedimentation zu vermeiden und eine homogene Verteilung sicherzustellen.</li>
            <li><strong>Einwaage:</strong> Präzise Einwaage auf Analysenwaage.</li>
          </ul>
        </li>
      </ul>

      <div className="flex justify-end mt-4">
        <Button 
          onClick={onDownloadPDF} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Download size={16} />
          PDF herunterladen
        </Button>
      </div>
    </div>
  );
};

export default FormulationOverview;
