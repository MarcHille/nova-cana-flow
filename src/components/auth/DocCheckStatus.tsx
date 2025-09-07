
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, LogOut } from "lucide-react";

const DocCheckStatus: React.FC = () => {
  const { toast } = useToast();
  const isAuthenticated = localStorage.getItem("doccheck_auth") === "true";
  const doccheckUid = localStorage.getItem("doccheck_uid") || "Unbekannt";

  const handleLogout = () => {
    // DocCheck-Authentifizierung zurücksetzen
    localStorage.removeItem("doccheck_auth");
    localStorage.removeItem("doccheck_uid");
    
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich von DocCheck abgemeldet.",
    });
    
    // Seite neu laden, um Authentifizierungsstatus überall zu aktualisieren
    window.location.reload();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-2 py-1">
        <ShieldCheck size={14} />
        <span className="text-xs">Verifiziert</span>
      </Badge>
      
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-2 py-1">
        <span className="text-xs">DocCheck ID: {doccheckUid.substring(0, 8)}...</span>
      </Badge>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <LogOut size={14} className="mr-1" />
        <span className="text-xs">DocCheck Abmelden</span>
      </Button>
    </div>
  );
};

export default DocCheckStatus;
