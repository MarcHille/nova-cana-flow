
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { FormulationType } from '../types';
import { batchesT, batchesC } from '../data/batchData';

interface FormulationFormProps {
  formulationType: FormulationType;
  setFormulationType: (type: FormulationType) => void;
  batchNumberT: string;
  setBatchNumberT: (batch: string) => void;
  batchNumberC: string;
  setBatchNumberC: (batch: string) => void;
  targetVolume: string;
  setTargetVolume: (volume: string) => void;
  targetTHCConcentration: string;
  setTargetTHCConcentration: (concentration: string) => void;
  targetCBDConcentration: string;
  setTargetCBDConcentration: (concentration: string) => void;
  inputError: string;
  calculateFormulation: () => void;
  hasProtocolEntries: boolean;
  onDownloadProtocol: () => void;
}

export const FormulationForm: React.FC<FormulationFormProps> = ({
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
  inputError,
  calculateFormulation,
  hasProtocolEntries,
  onDownloadProtocol
}) => {
  return (
    <div className="grid gap-4">
      {inputError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{inputError}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Label htmlFor="formulation-type">Formulierungstyp</Label>
        <Select 
          value={formulationType}
          onValueChange={(value: FormulationType) => setFormulationType(value)}
        >
          <SelectTrigger id="formulation-type">
            <SelectValue placeholder="Wählen Sie einen Typ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mct-oil">MCT-Öl (Oral)</SelectItem>
            <SelectItem value="pg-solution">PG-Lösung (Inhalation)</SelectItem>
            <SelectItem value="concentrate">Konzentrat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="batch-t">Charge Nr. (THC-Extrakt)</Label>
          <Select 
            value={batchNumberT}
            onValueChange={setBatchNumberT}
          >
            <SelectTrigger id="batch-t">
              <SelectValue placeholder="Wählen Sie eine Charge" />
            </SelectTrigger>
            <SelectContent>
              {batchesT.map(batch => (
                <SelectItem key={batch.number} value={batch.number}>
                  {batch.number} ({batch.thcContent * 100}% THC)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="batch-c">Charge Nr. (CBD-Extrakt)</Label>
          <Select 
            value={batchNumberC}
            onValueChange={setBatchNumberC}
          >
            <SelectTrigger id="batch-c">
              <SelectValue placeholder="Wählen Sie eine Charge" />
            </SelectTrigger>
            <SelectContent>
              {batchesC.map(batch => (
                <SelectItem key={batch.number} value={batch.number}>
                  {batch.number} ({batch.cbdContent * 100}% CBD)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="target-volume">Zielvolumen (ml)</Label>
          <Input
            id="target-volume"
            type="number"
            value={targetVolume}
            onChange={(e) => setTargetVolume(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="target-thc">THC-Konzentration (mg/ml)</Label>
          <Input
            id="target-thc"
            type="number"
            value={targetTHCConcentration}
            onChange={(e) => setTargetTHCConcentration(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="target-cbd">CBD-Konzentration (mg/ml)</Label>
          <Input
            id="target-cbd"
            type="number"
            value={targetCBDConcentration}
            onChange={(e) => setTargetCBDConcentration(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button onClick={calculateFormulation} className="flex items-center gap-2">
          <Calculator size={16} />
          Berechnen
        </Button>
        {hasProtocolEntries && (
          <Button 
            onClick={onDownloadProtocol} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={!hasProtocolEntries}
          >
            <FileText size={16} />
            Protokoll herunterladen
          </Button>
        )}
      </div>
    </div>
  );
};
