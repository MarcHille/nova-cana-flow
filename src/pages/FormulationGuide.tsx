
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FormulationGuideContent from "@/components/formulation/FormulationGuideContent";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

const FormulationGuidePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content">
          <Card className="mb-6 bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Formulierungshilfe</CardTitle>
                <FlaskConical className="text-purple-600 dark:text-purple-400" size={28} />
              </div>
            </CardHeader>
          </Card>
          
          <FormulationGuideContent />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FormulationGuidePage;
