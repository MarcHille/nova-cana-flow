
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import AdminTutorial from "@/components/admin/AdminTutorial";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-gray-600 dark:text-gray-300">
        Verwalten Sie Produkte, bearbeiten Sie Bestellungen und sehen Sie Apothekeninformationen ein.
      </p>
      <div className="flex items-center gap-2">
        <AdminTutorial />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/admin/documentation')}
          className="flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Dokumentation
        </Button>
      </div>
    </div>
  );
};
