
/**
 * Returns the appropriate PDF filename for a formulation type
 * @param formulationType The type of formulation
 * @returns The filename of the PDF
 */
export const getPDFForFormulationType = (formulationType: string): string => {
  // Map formulation types to their respective PDF files
  const formulationPDFs: Record<string, string> = {
    'mct-oil': 'SOP_01_MCT_Oil.pdf',
    'pg-inhalation': 'SOP_02_PG_Inhalation.pdf',
    'concentrate': 'SOP_03_Concentrate.pdf',
    'general': 'General_Guidelines.pdf',
    'default': 'General_Guidelines.pdf',
    'overview': 'General_Guidelines.pdf',
    'sop1': 'SOP_01_MCT_Oil.pdf',
    'sop2': 'SOP_02_PG_Inhalation.pdf',
    'sop3': 'SOP_03_Concentrate.pdf'
  };
  
  // Return the specific PDF or default if not found
  return formulationPDFs[formulationType] || formulationPDFs.default;
};
