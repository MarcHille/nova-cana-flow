
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface SOP1MCTOilProps {
  onDownloadPDF: () => void;
}

const SOP1MCTOil: React.FC<SOP1MCTOilProps> = ({ onDownloadPDF }) => {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md border border-green-200 dark:border-green-800 mb-4">
        <h3 className="font-semibold text-green-800 dark:text-green-300 text-lg">SOP 1: Orale Tinkturen - Eingestellter Cannabisextrakt THC/CBD in MCT-Öl</h3>
        <p className="text-green-700 dark:text-green-200 text-sm mt-2">
          Öliger Eingestellter Cannabisextrakt für orale Anwendung mit definierter Konzentration an THC und CBD (z.B. 25 mg/ml THC + 25 mg/ml CBD) in MCT-Öl.
          Standardgebinde: 30 ml Braunglasflasche mit Applikator. Entspricht DAB Monographie.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Materialien</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-200 text-sm mb-4">
            <li>Novacana® 65 T</li>
            <li>Novacana® 65 C</li>
            <li>MCT-Öl Ph. Eur.</li>
            <li>Becherglas, Waagen, Heizrührer</li>
            <li>Endbehältnis (30 ml)</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <span className="mr-2">Berechnung</span>
            <span className="text-sm text-gray-600">(Beispiel für 30 ml mit 25 mg/ml THC + 25 mg/ml CBD)</span>
          </h3>
          <div className="text-sm space-y-2">
            <p className="text-gray-700 dark:text-gray-300">Annahmen: C<sub>THC,T</sub> = 0.65, C<sub>CBD,C</sub> = 0.65</p>
            <p className="text-gray-700 dark:text-gray-300">Zielgesamtmasse M<sub>Gesamt</sub> ≈ 30 ml × 0.95 g/ml = 28.5 g = 28500 mg</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Zielmengen:</strong> M<sub>THC,Ziel</sub> = 750 mg, M<sub>CBD,Ziel</sub> = 750 mg</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Masse Extrakt T:</strong> M<sub>Extrakt,T</sub> ≈ 750 mg ÷ 0.65 ≈ 1153.8 mg</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Masse Extrakt C:</strong> M<sub>Extrakt,C</sub> ≈ 750 mg ÷ 0.65 ≈ 1153.8 mg</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Masse MCT-Öl:</strong> M<sub>MCT</sub> = M<sub>Gesamt</sub> - M<sub>Extrakte,Gesamt</sub> ≈ 26192.4 mg</p>
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">Herstellungsschritte</h3>
      <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-200 text-sm mb-4">
        <li>Beide Extrakte erwärmen (40-60°C) und homogenisieren.</li>
        <li>M<sub>Extrakt,T</sub> und M<sub>Extrakt,C</sub> nacheinander exakt in tariertes Becherglas einwiegen. Protokollieren.</li>
        <li>M<sub>MCT</sub> zugeben oder bis M<sub>Gesamt</sub> auffüllen. Protokollieren.</li>
        <li>Unter Rühren bei ca. 40-50°C erwärmen, bis klar und homogen gelöst.</li>
        <li>IPC: Visuelle Prüfung auf Homogenität (warm).</li>
        <li>Auf Raumtemperatur abkühlen lassen (rühren).</li>
        <li>IPC: Visuelle Prüfung auf Homogenität (kalt).</li>
        <li>In tarierte 30 ml Braunglasflasche abfüllen. Füllmenge prüfen.</li>
        <li>Verschließen und Kennzeichnen.</li>
      </ol>

      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 mt-4 border">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lagerung & Haltbarkeit</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Dicht verschlossen, lichtgeschützt, &lt;25°C (bevorzugt 2-8°C). Haltbarkeit nach Herstellerdaten und eigener Risikoanalyse festlegen.
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

export default SOP1MCTOil;
