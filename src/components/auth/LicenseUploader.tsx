
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePharmacyLicenseUpload, ExtractedLicenseData } from "@/hooks/usePharmacyLicenseUpload";
import { FileCheck, Upload, Loader2, AlertCircle } from "lucide-react";

interface LicenseUploaderProps {
  onDataExtracted: (data: ExtractedLicenseData) => void;
}

const LicenseUploader: React.FC<LicenseUploaderProps> = ({ onDataExtracted }) => {
  const {
    file,
    fileError,
    isUploading,
    isExtracting,
    extractedData,
    extractionError,
    handleFileChange,
    uploadAndExtractData,
    reset
  } = usePharmacyLicenseUpload();

  // When extraction is successful, pass the data to the parent component
  useEffect(() => {
    if (extractedData) {
      onDataExtracted(extractedData);
    }
  }, [extractedData, onDataExtracted]);

  return (
    <Card className="border-dashed border-2">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center text-center p-4 gap-2">
            {!file ? (
              <Upload className="h-10 w-10 text-gray-400" />
            ) : (
              <FileCheck className="h-10 w-10 text-green-500" />
            )}
            
            <div>
              <h3 className="font-medium text-lg">Apothekenbetriebserlaubnis hochladen</h3>
              <p className="text-sm text-gray-500">
                Laden Sie Ihre Apothekenbetriebserlaubnis als PDF hoch. 
                Wir extrahieren automatisch die Daten, die Sie dann überprüfen können.
              </p>
            </div>
          </div>

          {fileError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="licenseFile" className="block">PDF-Datei auswählen</Label>
            <div className="flex gap-2">
              <Input
                id="licenseFile"
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                disabled={isUploading || isExtracting}
                className="flex-1"
              />
              {file && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={reset}
                  disabled={isUploading || isExtracting}
                  className="flex-shrink-0"
                >
                  ×
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Akzeptierte Formate: PDF (max. 10MB)
            </p>
          </div>

          {file && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-green-500" />
              <span>{file.name}</span>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              onClick={uploadAndExtractData}
              disabled={!file || isUploading || isExtracting}
              className="w-full md:w-auto"
            >
              {(isUploading || isExtracting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUploading && "Wird hochgeladen..."}
              {isExtracting && "Daten werden extrahiert..."}
              {!isUploading && !isExtracting && "Daten extrahieren"}
            </Button>
          </div>

          {extractionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Fehler bei der Datenextraktion: {extractionError}
              </AlertDescription>
            </Alert>
          )}

          {extractedData && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <FileCheck className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Daten erfolgreich extrahiert! Das Formular wurde vorausgefüllt.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LicenseUploader;
