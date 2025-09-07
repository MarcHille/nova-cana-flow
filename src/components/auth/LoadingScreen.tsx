
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-nova-600 mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Authentifizierung wird überprüft...</p>
    </div>
  );
};

export default LoadingScreen;
