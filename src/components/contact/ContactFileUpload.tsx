
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContactFileUploadProps {
  onChange: (files: FileList | null) => void;
  error?: string;
}

const ContactFileUpload: React.FC<ContactFileUploadProps> = ({ onChange, error }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="files" className="text-sm font-medium">
        Dateien anhängen
      </Label>
      <Input
        id="files"
        type="file"
        onChange={(e) => onChange(e.target.files)}
        multiple
        accept="image/*,.pdf"
        className="cursor-pointer"
      />
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <p className="text-sm text-muted-foreground">
        Erlaubte Dateitypen: Bilder (JPG, PNG) und PDF-Dokumente
      </p>
    </div>
  );
};

export default ContactFileUpload;
