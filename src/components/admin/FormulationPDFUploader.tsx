
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadFormulationPDF } from "@/utils/pdf/uploadUtils";
import { FileCheck, Upload, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FormulationPDFUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie zuerst eine PDF-Datei aus.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Use the real implementation
      const result = await uploadFormulationPDF(file);
      
      if (result.success) {
        toast({
          title: "Erfolg",
          description: "Formulierungshilfe PDF wurde erfolgreich hochgeladen.",
        });
        setLastUpdated(new Date().toLocaleString('de-DE'));
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setFile(null);
      } else {
        toast({
          title: "Fehler",
          description: result.message || "Upload fehlgeschlagen.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulierungshilfe PDF</CardTitle>
        <CardDescription>
          Laden Sie die aktuelle Version der Formulierungshilfe-PDF hoch, die Apothekern zum Download zur Verfügung gestellt wird.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pdfFile">PDF-Datei auswählen</Label>
          <Input 
            id="pdfFile" 
            ref={fileInputRef}
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {file && (
            <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
              <FileCheck size={16} />
              <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full sm:w-auto"
        >
          {uploading ? (
            <>Wird hochgeladen...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> PDF hochladen
            </>
          )}
        </Button>
        
        {lastUpdated && (
          <div className="text-sm text-muted-foreground mt-4">
            <p>Zuletzt aktualisiert: {lastUpdated}</p>
          </div>
        )}
        
        <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md mt-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-400">Hinweis zur Formulierungshilfe</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Das hochgeladene PDF wird allen verifizierten Apothekern in der Formulierungshilfe-Sektion 
                zum Download zur Verfügung gestellt. Stellen Sie sicher, dass die Datei den aktuellen 
                Richtlinien entspricht.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormulationPDFUploader;
