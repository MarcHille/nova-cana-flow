import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { verifyPharmacy, getPharmacyVerificationStatus } from "@/utils/pharmacyUtils";
import { Upload, FilePlus, FileCheck, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LicenseUploader from "./LicenseUploader";
import { ExtractedLicenseData } from "@/hooks/usePharmacyLicenseUpload";
import { supabase } from "@/integrations/supabase/client"; // Added missing import

interface PharmacyVerificationProps {
  userId: string;
  onComplete?: () => void;
}

interface VerificationStatusData {
  status: string | null;
  message?: string;
}

const PharmacyVerification: React.FC<PharmacyVerificationProps> = ({ userId, onComplete }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const [formData, setFormData] = useState({
    licenseName: "",
    licenseId: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    contactPerson: "",
    email: "",
    additionalInfo: "",
    acceptTerms: false,
    acceptGdp: false,
    uploadedDocuments: [] as { name: string; url: string; type: string }[]
  });

  useEffect(() => {
    // Abort controller for cleanup on unmount
    const abortController = new AbortController();

    const checkVerificationStatus = async () => {
      if (!userId) {
        setStatusLoading(false);
        return;
      }
      
      try {
        setStatusLoading(true);
        setStatusError(null);
        // Timeout for status check with AbortController
        const timeoutId = setTimeout(() => {
          if (!abortController.signal.aborted) {
            abortController.abort();
            setStatusError("Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es später erneut.");
            setStatusLoading(false);
          }
        }, 10000);

        // Check if user has pharmacist role directly
        const { data: userRoles, error: rolesError } = await supabase
          .rpc('get_user_roles_safely', { _user_id: userId });
          
        if (!rolesError && userRoles && userRoles.includes('pharmacist')) {
          clearTimeout(timeoutId);
          if (abortController.signal.aborted) return;
          
          setVerificationStatus('approved');
          setStatusLoading(false);
          return;
        }

        // Fallback to checking the verification table
        const result = await getPharmacyVerificationStatus(userId);
        clearTimeout(timeoutId);
        
        if (abortController.signal.aborted) return;
        
        setVerificationStatus(result.status);
        setStatusMessage(result.message || null);
      } catch (err: any) {
        console.error("Fehler beim Prüfen des Verifizierungsstatus:", err);
        setStatusError("Verifizierungsstatus konnte nicht abgerufen werden.");
      } finally {
        if (!abortController.signal.aborted) {
          setStatusLoading(false);
        }
      }
    };

    checkVerificationStatus();
    
    return () => {
      abortController.abort();
    };
  }, [userId, retryCount]);

  const validateInput = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.licenseName || !formData.licenseId) {
          toast({
            title: "Fehlende Informationen",
            description: "Bitte füllen Sie alle Pflichtfelder aus.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2: {
        if (!formData.address || !formData.city || !formData.postalCode || !formData.phone) {
          toast({
            title: "Fehlende Informationen",
            description: "Bitte füllen Sie alle Pflichtfelder aus.",
            variant: "destructive"
          });
          return false;
        }
        
        // Validate postal code format (German format)
        const postalCodePattern = /^[0-9]{5}$/;
        if (!postalCodePattern.test(formData.postalCode)) {
          toast({
            title: "Ungültige Postleitzahl",
            description: "Bitte geben Sie eine gültige fünfstellige Postleitzahl ein.",
            variant: "destructive"
          });
          return false;
        }
        
        // Validate phone format
        const phonePattern = /^[+]?[0-9 ()-]{6,20}$/;
        if (!phonePattern.test(formData.phone)) {
          toast({
            title: "Ungültige Telefonnummer",
            description: "Bitte geben Sie eine gültige Telefonnummer ein.",
            variant: "destructive"
          });
          return false;
        }
        
        // Validate email format if provided
        if (formData.email) {
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailPattern.test(formData.email)) {
            toast({
              title: "Ungültige E-Mail",
              description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
              variant: "destructive"
            });
            return false;
          }
        }
        break;
      }
      case 3:
        if (formData.uploadedDocuments.length === 0) {
          toast({
            title: "Fehlende Dokumente",
            description: "Bitte laden Sie mindestens ein Dokument hoch.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 4:
        if (!formData.acceptTerms || !formData.acceptGdp) {
          toast({
            title: "Zustimmung erforderlich",
            description: "Bitte stimmen Sie den Bedingungen und GDP-Richtlinien zu.",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [name]: e.target.checked }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Validate file size
    const file = e.target.files[0];
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "Dateigröße überschritten",
        description: `Die Datei ist zu groß. Maximale Größe: ${maxSizeMB}MB.`,
        variant: "destructive"
      });
      if (e.target) e.target.value = '';
      return;
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Ungültiger Dateityp",
        description: "Bitte laden Sie nur PDF, JPG oder PNG Dateien hoch.",
        variant: "destructive"
      });
      if (e.target) e.target.value = '';
      return;
    }

    setIsLoading(true);
    toast({
      title: "Upload gestartet",
      description: "Ihre Dokumente werden hochgeladen...",
    });

    try {
      const fileExt = file.name.split('.').pop();
      // Add random component to filename to prevent overwriting
      const safeFileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `pharmacy-verification/${safeFileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('pharmacy-documents')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) {
        console.error("Upload-Fehler:", uploadError);
        throw new Error(`Fehler beim Hochladen: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('pharmacy-documents')
        .getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error("Konnte keine öffentliche URL für das Dokument generieren");
      }

      const newDocument = {
        name: file.name,
        url: urlData.publicUrl,
        type: file.type
      };

      setFormData(prev => ({
        ...prev,
        uploadedDocuments: [...prev.uploadedDocuments, newDocument]
      }));

      toast({
        title: "Upload erfolgreich",
        description: `Datei "${file.name}" wurde hochgeladen.`,
      });
    } catch (error: any) {
      console.error("Upload-Fehler:", error);
      toast({
        title: "Upload fehlgeschlagen",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleNextStep = () => {
    if (!validateInput(verificationStep)) return;
    setVerificationStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setVerificationStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput(4)) return;
    
    setIsLoading(true);
    
    try {
      const verificationData = {
        licenseId: formData.licenseId,
        businessDocuments: formData.uploadedDocuments.map(doc => doc.url),
        contactDetails: {
          name: formData.licenseName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
          contactPerson: formData.contactPerson || undefined,
          email: formData.email || undefined
        },
        verificationStatus: 'pending' as const
      };
      
      const result = await verifyPharmacy(userId, verificationData);
      
      if (result.success) {
        setVerificationStatus('pending');
        toast({
          title: "Verifizierung eingereicht",
          description: "Ihre Apothekeverifizierung wurde erfolgreich zur Überprüfung eingereicht.",
        });
        if (onComplete) onComplete();
      } else {
        throw new Error(result.message || "Die Verifizierung konnte nicht abgeschlossen werden.");
      }
    } catch (error: any) {
      console.error("Fehler bei der Verifizierung:", error);
      toast({
        title: "Fehler bei der Verifizierung",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLicenseDataExtracted = (data: ExtractedLicenseData) => {
    setFormData(prev => ({
      ...prev,
      licenseName: data.licenseName || prev.licenseName,
      licenseId: data.licenseId || prev.licenseId,
      address: data.address || prev.address,
      city: data.city || prev.city,
      postalCode: data.postalCode || prev.postalCode,
      phone: data.phone || prev.phone,
      contactPerson: data.contactPerson || prev.contactPerson
    }));
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (!userId) {
    return null;
  }
  
  if (statusLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Apothekenverifizierung</CardTitle>
          <CardDescription>
            Verifizierungsstatus wird geladen...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (statusError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Apothekenverifizierung</CardTitle>
          <CardDescription>
            Es gab ein Problem beim Laden des Verifizierungsstatus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>
              {statusError}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRetry}
                  className="flex items-center gap-1"
                >
                  <Clock className="h-4 w-4" /> Erneut versuchen
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Verifizierung wird geprüft
          </CardTitle>
          <CardDescription>
            Ihre Apothekeverifizierung wurde eingereicht und wird derzeit überprüft
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle>Verifizierung in Bearbeitung</AlertTitle>
            <AlertDescription>
              Wir werden Ihre eingereichten Unterlagen prüfen und uns bei Ihnen melden. Dieser Prozess kann bis zu 48 Stunden dauern.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Eingereichte Dokumente:</h3>
            <ul className="space-y-1 text-sm">
              {formData.uploadedDocuments.map((doc, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <FileCheck className="h-4 w-4 text-green-500" />
                  {doc.name}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus === 'approved') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Verifizierung abgeschlossen
          </CardTitle>
          <CardDescription>
            Ihre Apotheke wurde erfolgreich verifiziert
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Verifizierung genehmigt</AlertTitle>
            <AlertDescription>
              Ihre Apotheke wurde erfolgreich verifiziert. Sie haben nun Zugriff auf alle Funktionen für Apotheken.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus === 'rejected') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Verifizierung abgelehnt
          </CardTitle>
          <CardDescription>
            Ihre Apotheke wurde nicht verifiziert
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Verifizierung abgelehnt</AlertTitle>
            <AlertDescription>
              {statusMessage || "Ihre Apotheke wurde nicht verifiziert. Bitte laden Sie die erforderlichen Dokumente hoch und versuchen Sie es erneut."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apothekenverifizierung</CardTitle>
        <CardDescription>
          Bitte vervollständigen Sie diesen Prozess, um Ihre Apotheke gemäß GDP zu verifizieren
        </CardDescription>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex-1">
            <div 
              className={`w-full h-1 rounded-full ${
                verificationStep >= 1 ? "bg-nova-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
          </div>
          <div className="mx-2 text-xs font-medium text-gray-600">
            {verificationStep}/4
          </div>
          <div className="flex-1">
            <div 
              className={`w-full h-1 rounded-full ${
                verificationStep >= 2 ? "bg-nova-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
          </div>
          <div className="mx-2 text-xs font-medium text-gray-600">
            {verificationStep}/4
          </div>
          <div className="flex-1">
            <div 
              className={`w-full h-1 rounded-full ${
                verificationStep >= 3 ? "bg-nova-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
          </div>
          <div className="mx-2 text-xs font-medium text-gray-600">
            {verificationStep}/4
          </div>
          <div className="flex-1">
            <div 
              className={`w-full h-1 rounded-full ${
                verificationStep >= 4 ? "bg-nova-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          {verificationStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Apothekeninformationen</h3>
              
              <LicenseUploader onDataExtracted={handleLicenseDataExtracted} />
              
              <div className="pt-4 space-y-2">
                <Label htmlFor="licenseName">Name der Apotheke *</Label>
                <Input
                  id="licenseName"
                  name="licenseName"
                  value={formData.licenseName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="licenseId">Apothekenbetriebserlaubnis-Nr. *</Label>
                <Input
                  id="licenseId"
                  name="licenseId"
                  value={formData.licenseId}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  Geben Sie Ihre offizielle Apothekenbetriebserlaubnisnummer an.
                </p>
              </div>
            </div>
          )}
          
          {verificationStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Kontaktdaten</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Straße und Hausnummer *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">PLZ *</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Ort *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefonnummer *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Ansprechpartner</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail für Rückfragen</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          
          {verificationStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dokumente hochladen</h3>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Bitte laden Sie die folgenden Dokumente hoch: Apothekenbetriebserlaubnis, Handelsregisterauszug, 
                  Identitätsnachweis des Inhabers (Personalausweis/Reisepass).
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <Label htmlFor="fileUpload" className="block mb-2">Dokument hochladen</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileUpload}
                    className="flex-1"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={isLoading}
                  />
                  <Button type="button" variant="outline" size="icon" disabled={isLoading}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Akzeptierte Formate: PDF, JPG, PNG (max. 10MB)
                </p>
              </div>
              
              {formData.uploadedDocuments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Hochgeladene Dokumente:</h4>
                  <ul className="space-y-2">
                    {formData.uploadedDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                        <FilePlus className="h-4 w-4 text-gray-400" />
                        <span className="text-sm flex-1">{doc.name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              uploadedDocuments: prev.uploadedDocuments.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          Entfernen
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="additionalInfo">Zusätzliche Informationen</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Weitere relevante Informationen zu Ihrer Apotheke..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {verificationStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Bestätigung</h3>
              
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Sie haben alle erforderlichen Daten eingegeben. Bitte überprüfen Sie diese und bestätigen Sie mit den folgenden Zustimmungen.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 space-y-4">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    className="mt-1"
                    checked={formData.acceptTerms}
                    onChange={handleCheckboxChange('acceptTerms')}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm">
                    Ich bestätige, dass alle angegebenen Informationen korrekt und vollständig sind. Ich bin berechtigt, im Namen dieser Apotheke zu handeln.
                  </Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="acceptGdp"
                    className="mt-1"
                    checked={formData.acceptGdp}
                    onChange={handleCheckboxChange('acceptGdp')}
                  />
                  <Label htmlFor="acceptGdp" className="text-sm">
                    Ich bestätige, dass meine Apotheke die Gute Vertriebspraxis (GDP, Good Distribution Practice) gemäß EU-Richtlinien einhält und die Lagerung und den Vertrieb von Arzneimitteln entsprechend den Vorschriften gewährleistet.
                  </Label>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            {verificationStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevStep}
                disabled={isLoading}
              >
                Zurück
              </Button>
            )}
            
            {verificationStep < 4 ? (
              <Button 
                type="button" 
                onClick={handleNextStep} 
                className={verificationStep === 1 ? "ml-auto" : ""}
                disabled={isLoading}
              >
                Weiter
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Wird eingereicht..." : "Verifizierung einreichen"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PharmacyVerification;
