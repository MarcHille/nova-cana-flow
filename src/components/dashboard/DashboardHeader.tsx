
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Fehler beim Abmelden:", error);
        toast({
          title: "Fehler",
          description: "Beim Abmelden ist ein Fehler aufgetreten.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Abmeldung erfolgreich",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
      toast({
        title: "Fehler",
        description: "Beim Abmelden ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Willkommen zurück! Hier können Sie Ihre Bestellungen verwalten und Produkte durchsuchen.
        </p>
      </div>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={handleLogout}
      >
        <LogOut size={16} />
        Abmelden
      </Button>
    </div>
  );
};

export default DashboardHeader;
