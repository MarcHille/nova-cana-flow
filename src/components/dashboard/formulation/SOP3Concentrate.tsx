
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface SOP3ConcentrateProps {
  onDownloadPDF: () => void;
}

const SOP3Concentrate: React.FC<SOP3ConcentrateProps> = ({ onDownloadPDF }) => {
  return (
    <div className="space-y-4">
      <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-md border border-teal-200 dark:border-teal-800 mb-4">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 text-lg">SOP 3: Abfüllung Reiner Cannabisextrakt (Konzentrat)</h3>
        <p className="text-teal-700 dark:text-teal-200 text-sm mt-2">
          Portionierter, unverdünnter Novacana® 65 T oder 65 C Extrakt zur direkten Anwendung oder Weiterverarbeitung durch 
          den Patienten nach ärztlicher Anweisung. Standardabfüllmenge: 1 g (1000 mg).
        </p>
        <p className="text-teal-700 dark:text-teal-200 text-sm mt-1">
          <em>Dies ist keine "Einstellung" nach DAB.</em>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Materialien</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-200 text-sm mb-4">
            <li>Novacana® 65 T oder 65 C</li>
            <li>Geeignetes Primärpackmittel (z.B. 1 ml Glauspritze Luer-Lock)</li>
            <li>Waage, Heizgerät</li>
          </ul>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">Herstellungsschritte (Abfüllung)</h3>
      <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-200 text-sm mb-4">
        <li>Gewählten Extrakt (T oder C) erwärmen (40-60°C) und gründlich homogenisieren, bis Fließfähigkeit für Abfüllung erreicht ist.</li>
        <li>Primärpackmittel (z.B. Spritze ohne Kolben) tarieren.</li>
        <li>Exakt die Zielmasse (z.B. 1000 mg) des erwärmten, homogenen Extrakts einfüllen/aufziehen. Protokollieren.</li>
        <li>Primärpackmittel verschließen (z.B. Spritze mit Kappe versiegeln, Kolben einsetzen).</li>
        <li>Außen reinigen und Kennzeichnen.</li>
      </ol>

      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 mt-4 border">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Kennzeichnung</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Novacana® 65 T [oder C] Konzentrat. Enthält: ca. 65% (w/w) Δ9-THC [oder CBD] und ≤5% (w/w) CBD [oder THC] 
          (genaue Werte vom CoA!). Nettofüllmenge: 1 g. Charge, Verwendbar bis, Lagerhinweis. 
          <strong>WICHTIG:</strong> "Hochkonzentriert! Reiner Extrakt. Nur nach ärztlicher Anweisung anwenden. 
          Ggf. zur Entnahme leicht erwärmen."
        </p>
      </div>

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

export default SOP3Concentrate;
