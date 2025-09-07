
import React from "react";

const VerificationSuccessAlert: React.FC = () => {
  return (
    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md border border-green-200 dark:border-green-800 mb-6">
      <div className="flex items-center">
        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-semibold text-green-800 dark:text-green-300 text-lg">Verifizierung abgeschlossen</h3>
      </div>
      <p className="ml-8 text-green-700 dark:text-green-200 mt-1">
        Ihre Apotheke wurde erfolgreich verifiziert. Sie haben nun Zugriff auf alle Funktionen für Apotheker.
      </p>
    </div>
  );
};

export default VerificationSuccessAlert;
