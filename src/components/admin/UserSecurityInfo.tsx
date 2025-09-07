
import React from "react";
import { Shield } from "lucide-react";

const UserSecurityInfo: React.FC = () => {
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800 flex items-start">
      <Shield className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
      <div>
        <p className="font-medium">Sicherheitshinweis</p>
        <p>Vergeben Sie Admin-Rechte mit Vorsicht und dokumentieren Sie alle Zugriffsänderungen. 
        Die Zuweisung von Apotheker-Rollen sollte nur nach vollständiger Überprüfung der Legitimation erfolgen.</p>
      </div>
    </div>
  );
};

export default UserSecurityInfo;
