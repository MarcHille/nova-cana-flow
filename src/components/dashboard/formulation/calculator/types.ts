
export interface ProtocolEntry {
  step: number;
  actualWeight: number;
  timestamp: string;
  notes: string;
}

export interface FormulationResult {
  thcExtractAmount: number;
  cbdExtractAmount: number;
  baseAmount: number;
  density: number;
  totalWeight: number;
}

export interface FormulationProtocol {
  batchNumber: string;
  entries: ProtocolEntry[];
  targetVolume: number;
  targetTHC: number;
  targetCBD: number;
  formulationType: string;
  results?: FormulationResult;
  date: string;
  pharmacistName?: string;
}

export type BatchInfo = {
  number: string;
  thcContent: number;
  cbdContent: number;
};

export type FormulationType = 'mct-oil' | 'pg-solution' | 'concentrate';
