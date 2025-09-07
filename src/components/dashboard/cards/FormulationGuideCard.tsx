
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FlaskConical } from "lucide-react";

const FormulationGuideCard = () => {
  const navigate = useNavigate();

  const handleFormulationGuideNavigation = () => {
    navigate("/formulation-guide");
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Formulierungshilfe</CardTitle>
          <FlaskConical className="text-purple-600 dark:text-purple-400" size={24} />
        </div>
        <CardDescription>Cannabis-Rezepturarzneimittel SOPs</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <Button 
          onClick={handleFormulationGuideNavigation} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Zur Formulierungshilfe
        </Button>
      </CardContent>
    </Card>
  );
};

export default FormulationGuideCard;
