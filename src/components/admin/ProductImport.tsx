
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, FileSpreadsheet, Check } from "lucide-react";
import * as XLSX from "xlsx";
import { Product } from "@/types";

interface ProductImportProps {
  onProductsImported: (products: Omit<Product, "id" | "createdAt" | "updatedAt">[]) => void;
}

const ProductImport: React.FC<ProductImportProps> = ({ onProductsImported }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(file);
    }
  };

  const processExcelData = async (file: File) => {
    setIsUploading(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Map Excel columns to product fields
      const mappedProducts = jsonData.map((row: any) => {
        // Convert any terpenes string to an array
        const terpenesString = row["Terpene"] || "";
        const terpenesArray = terpenesString ? terpenesString.split(',').map((t: string) => t.trim()) : [];
        
        // Convert Excel row to product object
        return {
          name: row["Vollständige Bezeichnung"] || "",
          description: row["Vollständige Bezeichnung"] || "", // Use the same as name initially
          shortDescription: row["Vollständige Bezeichnung"] ? 
            `${row["Vollständige Bezeichnung"]}`.substring(0, 100) : "",
          price: parseFloat(row["Preis"]) || 0,
          imageUrl: "/placeholder.svg", // Default placeholder
          category: "Imported", // Default category
          stock: 0, // Default stock
          manufacturer: row["Bezugsquelle"] || "",
          countryOfOrigin: row["Anbauland"] || "",
          recommendedDosage: "",
          weight: row["Packungsgröße"] || "",
          thcContent: "",
          cbdContent: "",
          terpenes: terpenesArray, // Now correctly using an array
          // Additional fields from Excel
          cultivator: row["Anbauer"] || "",
          pzn: row["PZN"] || "",
        };
      });

      onProductsImported(mappedProducts);
      toast.success(`${mappedProducts.length} Produkte wurden erfolgreich importiert`);
    } catch (error) {
      console.error("Error processing Excel file:", error);
      toast.error("Fehler beim Verarbeiten der Excel-Datei. Bitte überprüfen Sie das Format.");
    } finally {
      setIsUploading(false);
      setFileSelected(null);
    }
  };

  const handleUpload = () => {
    if (fileSelected) {
      processExcelData(fileSelected);
    }
  };

  return (
    <div className="border border-dashed rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center gap-4">
        <FileSpreadsheet className="h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium">Excel-Tabelle importieren</h3>
        
        <p className="text-sm text-gray-500 text-center max-w-md">
          Laden Sie eine Excel-Tabelle mit Produktdaten hoch. Die Tabelle sollte Spalten für "Vollständige Bezeichnung", 
          "Bezugsquelle", "Anbauland", "Anbauer", "Preis", "Packungsgröße" und optional "PZN" enthalten.
        </p>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <div className="flex-1">
            <label className="block">
              <span className="sr-only">Excel-Datei auswählen</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                  file:bg-primary file:text-white hover:file:bg-primary/90"
              />
            </label>
          </div>
          
          <Button 
            onClick={handleUpload} 
            disabled={!fileSelected || isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="animate-spin">
                  <Upload size={16} />
                </span>
                <span>Wird importiert...</span>
              </>
            ) : fileSelected ? (
              <>
                <Check size={16} />
                <span>Importieren</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Importieren</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductImport;
