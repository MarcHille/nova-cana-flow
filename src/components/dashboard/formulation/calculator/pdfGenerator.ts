
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

interface ProtocolEntry {
  step: number;
  actualWeight: number;
  timestamp: string;
  notes: string;
}

interface FormulationResult {
  thcExtractAmount: number;
  cbdExtractAmount: number;
  baseAmount: number;
  density: number;
  totalWeight: number;
}

interface FormulationProtocol {
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

/**
 * Generate a PDF with the formulation protocol
 * @param protocol The completed formulation protocol
 */
export const generateFormulationPDF = async (protocol: FormulationProtocol) => {
  const doc = new jsPDF();
  const now = new Date();
  
  // Add header with logo
  doc.setFontSize(20);
  doc.setTextColor(89, 65, 169); // Purple color
  doc.text('Herstellungsprotokoll', 20, 20);
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Datum: ${protocol.date || now.toLocaleDateString('de-DE')}`, 20, 30);
  doc.text(`Protokoll-Nr.: ${protocol.batchNumber}-${now.getTime().toString().substring(8, 13)}`, 20, 38);
  
  // Add formulation type & details
  doc.setFontSize(14);
  doc.setTextColor(89, 65, 169);
  let formulationTypeText = 'Unbekannt';
  switch (protocol.formulationType) {
    case 'mct-oil':
      formulationTypeText = 'MCT-Öl (Oral)';
      break;
    case 'pg-solution':
      formulationTypeText = 'PG-Lösung (Inhalation)';
      break;
    case 'concentrate':
      formulationTypeText = 'Konzentrat';
      break;
  }
  doc.text(`Formulierungstyp: ${formulationTypeText}`, 20, 50);
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Chargen-Nr.: ${protocol.batchNumber}`, 20, 60);
  doc.text(`Zielvolumen: ${protocol.targetVolume} ml`, 20, 68);
  doc.text(`Ziel THC-Konzentration: ${protocol.targetTHC} mg/ml`, 20, 76);
  doc.text(`Ziel CBD-Konzentration: ${protocol.targetCBD} mg/ml`, 20, 84);
  
  // Add calculated amounts
  if (protocol.results) {
    doc.setFontSize(14);
    doc.setTextColor(89, 65, 169);
    doc.text('Berechnete Mengen:', 20, 98);
    
    const targetData = [
      ['THC Extrakt:', `${protocol.results.thcExtractAmount} mg`],
      ['CBD Extrakt:', `${protocol.results.cbdExtractAmount} mg`],
      ['Träger:', `${protocol.results.baseAmount} mg`],
      ['Gesamtgewicht:', `${protocol.results.totalWeight} mg`],
      ['Dichte:', `${protocol.results.density} g/ml`]
    ];
    
    autoTable(doc, {
      startY: 102,
      head: [['Komponente', 'Soll-Menge']],
      body: targetData,
      theme: 'grid',
      headStyles: {
        fillColor: [89, 65, 169],
        textColor: [255, 255, 255]
      },
      margin: { top: 105 }
    });
  }
  
  // Add protocol entries table
  const tableY = protocol.results ? 150 : 102;
  
  doc.setFontSize(14);
  doc.setTextColor(89, 65, 169);
  doc.text('Protokollierte Herstellschritte:', 20, tableY - 10);
  
  const tableData = protocol.entries.map((entry, index) => {
    const stepLabels = ['THC Extrakt', 'CBD Extrakt', 'Träger'];
    // Get target weight for this step
    const targetWeight = index === 0 
      ? protocol.results?.thcExtractAmount 
      : index === 1 
        ? protocol.results?.cbdExtractAmount
        : protocol.results?.baseAmount;
    
    // Calculate deviation
    const deviation = targetWeight ? ((entry.actualWeight - targetWeight) / targetWeight * 100).toFixed(1) + ' %' : 'N/A';
    
    // Format timestamp
    const timestamp = new Date(entry.timestamp).toLocaleString('de-DE');
    
    return [
      stepLabels[index] || `Schritt ${entry.step}`,
      `${targetWeight || 0} mg`,
      `${entry.actualWeight} mg`,
      deviation,
      timestamp,
      entry.notes || ''
    ];
  });

  autoTable(doc, {
    startY: tableY,
    head: [['Komponente', 'Soll (mg)', 'Ist (mg)', 'Abweichung', 'Zeitstempel', 'Notizen']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [89, 65, 169],
      textColor: [255, 255, 255]
    },
    styles: {
      fontSize: 10,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 40 },
      5: { cellWidth: 45 }
    }
  });
  
  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Hergestellt gemäß DAB-Monographie "Eingestellter Cannabisextrakt"', 20, pageHeight - 25);
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text('Hergestellt von:', 20, pageHeight - 40);
  doc.text('_____________________________', 20, pageHeight - 35);
  doc.text('(Name, Unterschrift)', 20, pageHeight - 30);
  
  doc.text('Geprüft und freigegeben von:', 120, pageHeight - 40);
  doc.text('_____________________________', 120, pageHeight - 35);
  doc.text('(Name, Unterschrift)', 120, pageHeight - 30);

  // Save the PDF
  const filename = `Herstellungsprotokoll_${protocol.batchNumber}_${now.toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  
  return filename;
};
