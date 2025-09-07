
import React from 'react';
import { Shield, CreditCard, FileText } from 'lucide-react';

const PaymentSummary = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Zahlungsinformationen</h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-300 mt-1 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Sichere Zahlung
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Zahlung per Rechnung nach Prüfung
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-gray-600 dark:text-gray-300 mt-1 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Sicherheit
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              SSL-verschlüsselte Übertragung Ihrer Daten
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300 mt-1 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Rechnung
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sie erhalten eine ordnungsgemäße Rechnung nach HWG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
