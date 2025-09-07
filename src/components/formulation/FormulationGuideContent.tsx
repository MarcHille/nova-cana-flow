
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import FormulationOverview from "@/components/dashboard/formulation/FormulationOverview";
import SOP1MCTOil from "@/components/dashboard/formulation/SOP1MCTOil";
import SOP2PGInhalation from "@/components/dashboard/formulation/SOP2PGInhalation";
import SOP3Concentrate from "@/components/dashboard/formulation/SOP3Concentrate";
import { downloadPDF, getPDFForFormulationType } from "@/utils/pdfUtils";

const FormulationGuideContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const handleDownloadPDF = () => {
    // Get PDF filename based on active tab
    const pdfFileName = getPDFForFormulationType(activeTab);
    
    // Download the PDF with appropriate name
    const downloadName = `Novacana-${pdfFileName}`;
    downloadPDF(pdfFileName, downloadName);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8" id="formulation-guide">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <FlaskConical className="h-5 w-5 text-purple-600" /> 
            Formulierungshilfe für Cannabis-Rezepturarzneimittel
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
            Standardisierte Herstellungsverfahren (SOPs) für die Herstellung aus Novacana® Extrakten
          </CardDescription>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300">
          Stand: 2025-04-23
        </Badge>
      </CardHeader>
      
      <Separator className="mb-2" />
      
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Übersicht</TabsTrigger>
              <TabsTrigger value="sop1">SOP 1: MCT-Öl</TabsTrigger>
              <TabsTrigger value="sop2">SOP 2: PG (Inhalation)</TabsTrigger>
              <TabsTrigger value="sop3">SOP 3: Konzentrat</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <FormulationOverview onDownloadPDF={handleDownloadPDF} />
            </TabsContent>

            <TabsContent value="sop1">
              <SOP1MCTOil onDownloadPDF={handleDownloadPDF} />
            </TabsContent>

            <TabsContent value="sop2">
              <SOP2PGInhalation onDownloadPDF={handleDownloadPDF} />
            </TabsContent>

            <TabsContent value="sop3">
              <SOP3Concentrate onDownloadPDF={handleDownloadPDF} />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormulationGuideContent;
