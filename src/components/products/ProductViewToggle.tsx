
import React from "react";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

export interface ProductViewToggleProps {
  viewMode: "grid" | "table";
  onChange?: (mode: "grid" | "table") => void;
}

const ProductViewToggle = ({ viewMode, onChange = () => {} }: ProductViewToggleProps) => {
  return (
    <div className="inline-flex rounded-md shadow-sm border bg-white dark:bg-gray-800">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        className={`rounded-r-none ${viewMode === "grid" ? "" : "text-gray-500"}`}
        onClick={() => onChange("grid")}
      >
        <Grid size={16} className="mr-1" />
        <span className="hidden sm:inline">Kacheln</span>
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "ghost"}
        size="sm"
        className={`rounded-l-none ${viewMode === "table" ? "" : "text-gray-500"}`}
        onClick={() => onChange("table")}
      >
        <List size={16} className="mr-1" />
        <span className="hidden sm:inline">Tabelle</span>
      </Button>
    </div>
  );
};

export default ProductViewToggle;
