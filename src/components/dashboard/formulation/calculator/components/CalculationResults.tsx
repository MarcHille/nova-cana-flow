
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { FormulationResult, FormulationType } from '../types';

interface CalculationResultsProps {
  formulationResults: FormulationResult | null;
  formulationType: FormulationType;
  calculationPerformed: boolean;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({ 
  formulationResults, 
  formulationType, 
  calculationPerformed 
}) => {
  if (!calculationPerformed || !formulationResults) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-3">Berechnete Mengen:</h3>
      
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">THC Extrakt:</p>
            <p className="text-lg font-bold">{formulationResults.thcExtractAmount} mg</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">CBD Extrakt:</p>
            <p className="text-lg font-bold">{formulationResults.cbdExtractAmount} mg</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Träger ({formulationType === 'mct-oil' ? 'MCT-Öl' : 'PG'}):
            </p>
            <p className="text-lg font-bold">{formulationResults.baseAmount} mg</p>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Gesamtgewicht:</p>
            <p className="text-lg font-bold">{formulationResults.totalWeight} mg</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Dichte:</p>
            <p className="text-lg font-bold">{formulationResults.density} g/ml</p>
          </div>
        </div>
      </div>
    </div>
  );
};
