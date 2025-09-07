
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { downloadPDF } from "@/utils/pdfUtils";
import { useToast } from "@/hooks/use-toast";

const documents = [
  {
    id: 'doc-1',
    title: 'SOP 1: Herstellung von Cannabis-Ölen',
    description: 'Standardvorgehensweise für die Herstellung von Cannabisextrakten in MCT-Öl.',
    type: 'pdf',
    fileName: 'cannabis_ol_sop.pdf'
  },
  {
    id: 'doc-2',
    title: 'SOP 2: Inhalation mit PG-Lösung',
    description: 'Anleitung zur Herstellung von Cannabisextrakten zur Inhalation mit Propylenglykol.',
    type: 'pdf',
    fileName: 'cannabis_pg_inhalation_sop.pdf'
  },
  {
    id: 'doc-3',
    title: 'Rezepturberechnung Cannabis',
    description: 'Tabelle zur Berechnung von Cannabisrezepturen und Dosierungen.',
    type: 'pdf',
    fileName: 'cannabis_rezepturberechnung.pdf'
  }
];

const FormulationDocuments = () => {
  const { toast } = useToast();

  const handleDownload = async (fileName: string, documentTitle: string) => {
    try {
      // Using the existing downloadPDF function instead of the non-existent downloadFormulationPdf
      // We're passing the fileName and also using it as the output name
      downloadPDF(fileName, fileName);
      
      toast({
        title: "Download gestartet",
        description: `${documentTitle} wird heruntergeladen.`,
      });
      console.log(`Downloaded: ${documentTitle}`);
    } catch (error) {
      console.error(`Error downloading ${documentTitle}:`, error);
      toast({
        title: "Download fehlgeschlagen",
        description: `${documentTitle} konnte nicht heruntergeladen werden.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-6">Formulierungshilfen und Dokumente</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{doc.title}</CardTitle>
                <FileText className="text-gray-400 h-5 w-5" />
              </div>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleDownload(doc.fileName, doc.title)} 
                variant="outline" 
                className="w-full mt-2 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Herunterladen
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="pt-4 mt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Formulierungshilfen werden regelmäßig aktualisiert. Stellen Sie sicher, dass Sie immer die neueste Version verwenden.
        </p>
      </div>
    </div>
  );
};

export default FormulationDocuments;
