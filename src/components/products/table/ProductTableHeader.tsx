
import React from "react";
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import SortButton, { SortField, SortDirection } from "./SortButton";

interface ProductTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  categoryLabel: string;
  priceLabel: string;
}

const ProductTableHeader: React.FC<ProductTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort,
  categoryLabel,
  priceLabel
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <SortButton 
            field="name"
            currentField={sortField}
            direction={sortDirection}
            label="Name"
            onClick={() => onSort("name")}
          />
        </TableHead>
        <TableHead>
          <SortButton 
            field="category"
            currentField={sortField}
            direction={sortDirection}
            label={categoryLabel}
            onClick={() => onSort("category")}
          />
        </TableHead>
        <TableHead>
          <SortButton 
            field="thcContent"
            currentField={sortField}
            direction={sortDirection}
            label="THC"
            onClick={() => onSort("thcContent")}
          />
        </TableHead>
        <TableHead>
          <SortButton 
            field="cbdContent"
            currentField={sortField}
            direction={sortDirection}
            label="CBD"
            onClick={() => onSort("cbdContent")}
          />
        </TableHead>
        <TableHead className="text-right">
          <SortButton 
            field="price"
            currentField={sortField}
            direction={sortDirection}
            label={priceLabel}
            onClick={() => onSort("price")}
            className="font-medium -ml-3 hover:bg-transparent justify-end"
          />
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ProductTableHeader;
