
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Package, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Administration</CardTitle>
          <Shield className="text-purple-600 dark:text-purple-400" size={24} />
        </div>
        <CardDescription>Verwalten Sie Benutzer, Produkte und Apotheken</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <Button 
          onClick={() => navigate('/admin')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Zum Admin-Bereich
        </Button>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            onClick={() => navigate('/admin/users')} 
            variant="outline" 
            className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 flex flex-col items-center py-2 h-auto"
          >
            <Users size={18} className="mb-1" />
            <span className="text-xs">Benutzer</span>
          </Button>
          <Button 
            onClick={() => navigate('/admin/products')} 
            variant="outline" 
            className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 flex flex-col items-center py-2 h-auto"
          >
            <Package size={18} className="mb-1" />
            <span className="text-xs">Produkte</span>
          </Button>
          <Button 
            onClick={() => navigate('/admin/pharmacy-verifications')} 
            variant="outline" 
            className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 flex flex-col items-center py-2 h-auto"
          >
            <FileText size={18} className="mb-1" />
            <span className="text-xs">Apotheken</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCard;
