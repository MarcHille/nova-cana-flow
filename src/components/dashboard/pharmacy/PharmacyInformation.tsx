
import React from 'react';

const PharmacyInformation = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Ihre Apothekendaten</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Apothekenname</h4>
            <p className="text-base">Musterstadt Apotheke</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Inhaber</h4>
            <p className="text-base">Dr. Max Mustermann</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Betriebserlaubnis-Nr.</h4>
            <p className="text-base">12345-ABC</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Adresse</h4>
            <p className="text-base">Hauptstraße 123<br />12345 Musterstadt</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Kontakt</h4>
            <p className="text-base">
              Tel: +49 123 456789<br />
              E-Mail: info@musterstadt-apotheke.de
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-4 mt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Diese Daten wurden bei Ihrer Verifizierung übermittelt. Aktualisierungen können Sie über das Support-Team anfordern.
        </p>
      </div>
    </div>
  );
};

export default PharmacyInformation;
