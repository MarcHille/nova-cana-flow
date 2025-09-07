
import React, { useEffect } from 'react';
import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateFormulationPDF } from "./pdfGenerator";
import { toast } from "sonner";
import { useFormulationCalculator } from './hooks/useFormulationCalculator';
import { FormulationForm } from './components/FormulationForm';
import { CalculationResults } from './components/CalculationResults';
import { StepForm } from './components/StepForm';
import { ProtocolTable } from './components/ProtocolTable';

const FormulationCalculator: React.FC = () => {
  const {
    formulationType,
    setFormulationType,
    batchNumberT,
    setBatchNumberT,
    batchNumberC,
    setBatchNumberC,
    targetVolume,
    setTargetVolume,
    targetTHCConcentration,
    setTargetTHCConcentration,
    targetCBDConcentration,
    setTargetCBDConcentration,
    
    currentStep,
    calculationPerformed,
    setCalculationPerformed,
    formulationResults,
    protocol,
    
    inputError,
    calculateFormulation,
    handleStepSubmit
  } = useFormulationCalculator();

  // Reset protocol when changing formulation type
  useEffect(() => {
    if (calculationPerformed) {
      setCalculationPerformed(false);
    }
  }, [formulationType, batchNumberT, batchNumberC, calculationPerformed, setCalculationPerformed]);

  const handleDownloadProtocol = async () => {
    if (protocol.entries.length < 3) {
      toast.warning("Bitte füllen Sie erst alle Herstellschritte aus");
      return;
    }
    
    try {
      await generateFormulationPDF(protocol);
      toast.success("Herstellprotokoll wurde als PDF gespeichert");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Fehler beim Erstellen der PDF");
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="h-5 w-5 text-purple-600" />
          Formulierungsrechner
        </CardTitle>
        <CardDescription>
          Berechnen Sie die exakten Mengen und dokumentieren Sie die Herstellung
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <FormulationForm
          formulationType={formulationType}
          setFormulationType={setFormulationType}
          batchNumberT={batchNumberT}
          setBatchNumberT={setBatchNumberT}
          batchNumberC={batchNumberC}
          setBatchNumberC={setBatchNumberC}
          targetVolume={targetVolume}
          setTargetVolume={setTargetVolume}
          targetTHCConcentration={targetTHCConcentration}
          setTargetTHCConcentration={setTargetTHCConcentration}
          targetCBDConcentration={targetCBDConcentration}
          setTargetCBDConcentration={setTargetCBDConcentration}
          inputError={inputError}
          calculateFormulation={calculateFormulation}
          hasProtocolEntries={protocol.entries.length > 0}
          onDownloadProtocol={handleDownloadProtocol}
        />
        
        <CalculationResults 
          formulationResults={formulationResults} 
          formulationType={formulationType}
          calculationPerformed={calculationPerformed}
        />
        
        <StepForm
          currentStep={currentStep}
          calculationPerformed={calculationPerformed}
          formulationResults={formulationResults}
          onSubmit={handleStepSubmit}
        />
        
        <ProtocolTable
          entries={protocol.entries}
          formulationResults={formulationResults}
          calculationPerformed={calculationPerformed}
        />
      </CardContent>
    </Card>
  );
};

export default FormulationCalculator;
