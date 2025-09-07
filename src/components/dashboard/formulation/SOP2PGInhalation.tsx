
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface SOP2PGInhalationProps {
  onDownloadPDF: () => void;
}

const SOP2PGInhalation: React.FC<SOP2PGInhalationProps> = ({ onDownloadPDF }) => {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-md border border-purple-200 dark:border-purple-800 mb-4">
        <h3 className="font-semibold text-purple-800 dark:text-purple-300 text-lg">SOP 2: Liquids zur Inhalation - Cannabisextrakt-Lösung THC/CBD in Propylenglykol (PG)</h3>
        <p className="text-purple-700 dark:text-purple-200 text-sm mt-2">
          Lösung/Dispersion von Cannabisextrakt in PG zur Inhalation mit definierter Konzentration an THC und CBD (Konzentration nach ärztl. Verschreibung).
          Standardgebinde: 10 ml Vial/Kartusche.
        </p>
        <p className="text-purple-700 dark:text-purple-200 text-sm mt-2">
          <em>Hinweis: Hohe Konzentrationen können Stabilitätsprobleme zeigen und liegen ggf. außerhalb des Konzentrationsbereichs der DAB-Monographie.</em>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Materialien</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-200 text-sm mb-4">
            <li>Novacana® 65 T</li>
            <li>Novacana® 65 C</li>
            <li>Propylenglykol Ph. Eur. (Inhalation)</li>
            <li>Optional Aroma/Terpene (Inhalation)</li>
            <li>Becherglas, Waagen, Heizrührer (ggf. Homogenisator)</li>
            <li>Endbehältnis (10 ml)</li>
          </ul>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">Herstellungsschritte</h3>
      <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-200 text-sm mb-4">
        <li>Beide Extrakte erwärmen (40-60°C) und homogenisieren.</li>
        <li>M<sub>Extrakt,T</sub> und M<sub>Extrakt,C</sub> nacheinander exakt in tariertes Becherglas einwiegen. Protokollieren.</li>
        <li>Berechnete Masse PG zugeben. Ggf. Aroma zugeben. Protokollieren.</li>
        <li>Unter intensivem Rühren/Homogenisieren bei ca. 50-60°C erwärmen bis zur bestmöglichen homogenen Lösung/Dispersion.</li>
        <li>IPC: Visuelle Prüfung auf Homogenität/Dispersion (warm).</li>
        <li>Auf Raumtemperatur abkühlen lassen (ggf. weiterrühren).</li>
        <li>IPC: Visuelle Prüfung auf Homogenität/Stabilität (kalt). Auf Entmischung achten!</li>
        <li>In tariertes 10 ml Endbehältnis abfüllen. Füllmenge prüfen. Viskosität beachten.</li>
        <li>Verschließen und Kennzeichnen.</li>
      </ol>

      <div className="rounded-md bg-amber-50 dark:bg-amber-900/30 p-4 mt-4 border border-amber-200 dark:border-amber-800">
        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Besondere Hinweise</h3>
        <p className="text-amber-700 dark:text-amber-200 text-sm">
          <strong>Analytische Prüfung (THC/CBD-Gehalt, Homogenität, Stabilität) dringend empfohlen!</strong>
          Dicht verschlossen, lichtgeschützt, &lt;25°C. <strong>Kurze Haltbarkeit/Aufbrauchfrist</strong> festlegen, 
          Stabilität beobachten.
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

export default SOP2PGInhalation;
