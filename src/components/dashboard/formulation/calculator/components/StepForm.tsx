
import React from 'react';
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormulationResult } from '../types';

interface StepFormProps {
  currentStep: number;
  calculationPerformed: boolean;
  formulationResults: FormulationResult | null;
  onSubmit: (data: { actualWeight: string; notes: string }) => void;
}

export const StepForm: React.FC<StepFormProps> = ({
  currentStep,
  calculationPerformed,
  formulationResults,
  onSubmit
}) => {
  const form = useForm({
    defaultValues: {
      actualWeight: '',
      notes: ''
    }
  });
  
  if (!calculationPerformed || currentStep === 0) {
    return null;
  }
  
  // Labels for each step
  const stepLabels = [
    '',
    'THC Extrakt Einwaage (mg)',
    'CBD Extrakt Einwaage (mg)',
    'Träger Einwaage (mg)'
  ];
  
  // Target weights for each step
  const targetWeights = [
    0,
    formulationResults?.thcExtractAmount || 0,
    formulationResults?.cbdExtractAmount || 0,
    formulationResults?.baseAmount || 0
  ];
  
  // Instructions for each step
  const instructions = [
    '',
    'Bitte wiegen Sie den THC-Extrakt exakt ein und notieren Sie die tatsächliche Einwaage',
    'Bitte wiegen Sie den CBD-Extrakt exakt ein und notieren Sie die tatsächliche Einwaage',
    'Bitte wiegen Sie das Trägermedium (MCT-Öl/PG) exakt ein'
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 p-4 border rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Schritt {currentStep} von 3</h3>
        
        <FormField
          name="actualWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{stepLabels[currentStep]}</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input type="number" {...field} placeholder={`Soll: ${targetWeights[currentStep]} mg`} />
                </FormControl>
                <span className="text-sm text-gray-500">mg</span>
              </div>
              <FormDescription>
                {instructions[currentStep]}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notizen</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optionale Anmerkungen zur Herstellung" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit">
          Schritt protokollieren
        </Button>
      </form>
    </Form>
  );
};
