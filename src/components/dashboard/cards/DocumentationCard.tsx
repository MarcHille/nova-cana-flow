
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DocumentationCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Dokumentation</CardTitle>
          <FileText className="text-purple-600 dark:text-purple-400" size={24} />
        </div>
        <CardDescription>Lesen Sie wichtige Informationen und Hilfestellungen</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Button variant="outline" className="w-full" onClick={() => navigate('/documentation')}>
          Zur Dokumentation
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentationCard;
