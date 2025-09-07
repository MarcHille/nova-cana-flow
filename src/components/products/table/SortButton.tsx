
import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SortField = "name" | "category" | "thcContent" | "cbdContent" | "price";
export type SortDirection = "asc" | "desc" | null;

interface SortButtonProps {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  label: string;
  onClick: () => void;
  className?: string;
}

const SortButton: React.FC<SortButtonProps> = ({
  field,
  currentField,
  direction,
  label,
  onClick,
  className = "font-medium -ml-3 hover:bg-transparent"
}) => {
  const renderSortIcon = () => {
    if (currentField !== field || direction === null) {
      return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    }
    return direction === "asc" ? 
      <ArrowUp size={14} className="ml-1" /> : 
      <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={className}
      onClick={onClick}
    >
      {label} {renderSortIcon()}
    </Button>
  );
};

export default SortButton;
