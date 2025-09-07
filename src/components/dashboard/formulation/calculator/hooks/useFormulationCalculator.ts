
import { useState } from 'react';
import { toast } from "sonner";
import { FormulationProtocol, FormulationResult, FormulationType, BatchInfo, ProtocolEntry } from '../types';
import { batchesT, batchesC } from '../data/batchData';

export const useFormulationCalculator = () => {
  // States for form inputs
  const [formulationType, setFormulationType] = useState<FormulationType>('mct-oil');
  const [batchNumberT, setBatchNumberT] = useState('');
  const [batchNumberC, setBatchNumberC] = useState('');
  const [targetVolume, setTargetVolume] = useState('30');
  const [targetTHCConcentration, setTargetTHCConcentration] = useState('25');
  const [targetCBDConcentration, setTargetCBDConcentration] = useState('25');
  
  // States for calculation and protocol
  const [currentStep, setCurrentStep] = useState(0);
  const [calculationPerformed, setCalculationPerformed] = useState(false);
  const [formulationResults, setFormulationResults] = useState<FormulationResult | null>(null);
  const [protocol, setProtocol] = useState<FormulationProtocol>({
    batchNumber: '',
    entries: [],
    targetVolume: 0,
    targetTHC: 0,
    targetCBD: 0,
    formulationType: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Error and validation states
  const [inputError, setInputError] = useState('');

  // Get selected batch information
  const getSelectedBatchT = (): BatchInfo | undefined => {
    return batchesT.find(batch => batch.number === batchNumberT);
  };

  const getSelectedBatchC = (): BatchInfo | undefined => {
    return batchesC.find(batch => batch.number === batchNumberC);
  };

  // Calculate formulation based on inputs
  const calculateFormulation = () => {
    // Reset any existing error
    setInputError('');
    
    // Validate all required fields
    if (!batchNumberT || !batchNumberC || !targetVolume || !targetTHCConcentration || !targetCBDConcentration) {
      setInputError('Bitte füllen Sie alle Felder aus');
      return;
    }
    
    // Get batch information
    const selectedBatchT = getSelectedBatchT();
    const selectedBatchC = getSelectedBatchC();
    
    if (!selectedBatchT || !selectedBatchC) {
      setInputError('Bitte wählen Sie gültige Chargen-Nummern');
      return;
    }
    
    const volume = Number(targetVolume);
    const targetTHC = Number(targetTHCConcentration);
    const targetCBD = Number(targetCBDConcentration);
    
    // Validate numerical inputs
    if (isNaN(volume) || isNaN(targetTHC) || isNaN(targetCBD) || 
        volume <= 0 || targetTHC < 0 || targetCBD < 0) {
      setInputError('Bitte geben Sie gültige Werte ein');
      return;
    }
    
    try {
      let density = 0;
      let formResult: FormulationResult;
      
      // Calculate based on formulation type
      if (formulationType === 'mct-oil') {
        density = 0.95; // g/ml for MCT oil
        
        const totalMass = volume * density;
        const thcMassNeeded = volume * targetTHC / 1000; // Convert mg/ml to g/ml
        const cbdMassNeeded = volume * targetCBD / 1000; // Convert mg/ml to g/ml
        
        // Calculate extract amounts (in grams)
        const thcExtractAmount = thcMassNeeded / selectedBatchT.thcContent;
        const cbdExtractAmount = cbdMassNeeded / selectedBatchC.cbdContent;
        const baseAmount = totalMass - (thcExtractAmount + cbdExtractAmount);
        
        // Validate that the calculation is physically possible
        if (baseAmount < 0) {
          setInputError('Die Zielkonzentrationen sind zu hoch für das angegebene Volumen');
          return;
        }
        
        formResult = {
          thcExtractAmount: Math.round(thcExtractAmount * 1000), // Convert to mg for display
          cbdExtractAmount: Math.round(cbdExtractAmount * 1000), // Convert to mg for display
          baseAmount: Math.round(baseAmount * 1000), // Convert to mg for display
          density,
          totalWeight: Math.round(totalMass * 1000) // Convert to mg for display
        };
      } 
      else if (formulationType === 'pg-solution') {
        density = 1.04; // g/ml for PG
        
        const totalMass = volume * density;
        const thcMassNeeded = volume * targetTHC / 1000; // Convert mg/ml to g/ml
        const cbdMassNeeded = volume * targetCBD / 1000; // Convert mg/ml to g/ml
        
        // Calculate extract amounts (in grams)
        const thcExtractAmount = thcMassNeeded / selectedBatchT.thcContent;
        const cbdExtractAmount = cbdMassNeeded / selectedBatchC.cbdContent;
        const baseAmount = totalMass - (thcExtractAmount + cbdExtractAmount);
        
        // Validate that the calculation is physically possible
        if (baseAmount < 0) {
          setInputError('Die Zielkonzentrationen sind zu hoch für das angegebene Volumen');
          return;
        }
        
        formResult = {
          thcExtractAmount: Math.round(thcExtractAmount * 1000), // Convert to mg for display
          cbdExtractAmount: Math.round(cbdExtractAmount * 1000), // Convert to mg for display
          baseAmount: Math.round(baseAmount * 1000), // Convert to mg for display
          density,
          totalWeight: Math.round(totalMass * 1000) // Convert to mg for display
        };
      }
      else { // concentrate
        // For concentrate, we just portion the extracts directly
        formResult = {
          thcExtractAmount: 1000, // 1g of extract by default
          cbdExtractAmount: 0, // No CBD extract by default for concentrate
          baseAmount: 0, // No base for concentrate
          density: 1,
          totalWeight: 1000 // 1g total
        };
      }
      
      // Set the calculation results and update the protocol
      setFormulationResults(formResult);
      setProtocol({
        batchNumber: `${batchNumberT}-${batchNumberC}`,
        entries: [],
        targetVolume: Number(targetVolume),
        targetTHC: Number(targetTHCConcentration),
        targetCBD: Number(targetCBDConcentration),
        formulationType,
        results: formResult,
        date: new Date().toISOString().split('T')[0]
      });
      
      setCalculationPerformed(true);
      setCurrentStep(1);
      toast.success("Berechnung erfolgreich durchgeführt!");
      
    } catch (err) {
      console.error("Calculation error:", err);
      setInputError('Ein Fehler ist bei der Berechnung aufgetreten');
    }
  };

  const handleStepSubmit = (data: { actualWeight: string; notes: string }) => {
    if (!data.actualWeight || isNaN(Number(data.actualWeight))) {
      toast.error("Bitte geben Sie eine gültige Einwaage ein");
      return;
    }
    
    const newEntry: ProtocolEntry = {
      step: currentStep,
      actualWeight: Number(data.actualWeight),
      timestamp: new Date().toISOString(),
      notes: data.notes || ''
    };

    setProtocol(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry]
    }));

    // Advance to next step or complete the protocol
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.success("Herstellprotokoll vollständig ausgefüllt!");
    }
  };

  return {
    // Form input states
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
    
    // Calculation and protocol states
    currentStep,
    setCurrentStep,
    calculationPerformed,
    setCalculationPerformed,
    formulationResults,
    protocol,
    setProtocol,
    
    // Error state
    inputError,
    setInputError,
    
    // Methods
    calculateFormulation,
    handleStepSubmit,
    getSelectedBatchT,
    getSelectedBatchC
  };
};
