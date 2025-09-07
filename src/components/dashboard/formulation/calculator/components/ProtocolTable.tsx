
import React from 'react';
import { ProtocolEntry, FormulationResult } from '../types';

interface ProtocolTableProps {
  entries: ProtocolEntry[];
  formulationResults: FormulationResult | null;
  calculationPerformed: boolean;
}

export const ProtocolTable: React.FC<ProtocolTableProps> = ({
  entries,
  formulationResults,
  calculationPerformed
}) => {
  if (!calculationPerformed || entries.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-3">Protokollierte Schritte:</h3>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2">Schritt</th>
              <th className="text-left py-2">Soll (mg)</th>
              <th className="text-left py-2">Ist (mg)</th>
              <th className="text-left py-2">Abweichung</th>
              <th className="text-left py-2">Notiz</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              // Calculate target weight for this step
              const targetWeight = index === 0 
                ? formulationResults?.thcExtractAmount 
                : index === 1 
                  ? formulationResults?.cbdExtractAmount
                  : formulationResults?.baseAmount;
              
              // Calculate deviation
              const deviation = targetWeight ? (entry.actualWeight - targetWeight) / targetWeight * 100 : 0;
              const deviationClass = Math.abs(deviation) > 5 
                ? 'text-red-600 dark:text-red-400' 
                : Math.abs(deviation) > 2 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-green-600 dark:text-green-400';
              
              return (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{targetWeight} mg</td>
                  <td className="py-2">{entry.actualWeight} mg</td>
                  <td className={`py-2 ${deviationClass}`}>{deviation.toFixed(1)}%</td>
                  <td className="py-2">{entry.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
