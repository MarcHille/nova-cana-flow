
import { useState } from "react";
import { Product } from "@/types";
import { SortField, SortDirection } from "./SortButton";

interface SortState {
  field: SortField;
  direction: SortDirection;
}

export function useProductSort(products: Product[], translateCategory: (category: string) => string) {
  const [sort, setSort] = useState<SortState>({ field: "name", direction: null });

  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      // Cycle through: null -> asc -> desc -> null
      if (sort.direction === null) {
        setSort({ field, direction: "asc" });
      } else if (sort.direction === "asc") {
        setSort({ field, direction: "desc" });
      } else {
        setSort({ field, direction: null });
      }
    } else {
      // New field, start with ascending
      setSort({ field, direction: "asc" });
    }
  };

  const getSortedProducts = () => {
    if (!sort.direction) return products;

    return [...products].sort((a, b) => {
      let valueA, valueB;

      switch (sort.field) {
        case "name":
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case "category":
          valueA = translateCategory(a.category).toLowerCase();
          valueB = translateCategory(b.category).toLowerCase();
          break;
        case "thcContent":
          valueA = a.thcContent || "N/A";
          valueB = b.thcContent || "N/A";
          break;
        case "cbdContent":
          valueA = a.cbdContent || "N/A";
          valueB = b.cbdContent || "N/A";
          break;
        case "price":
          valueA = a.price;
          valueB = b.price;
          break;
        default:
          return 0;
      }

      // Handle sorting direction
      if (sort.direction === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  return {
    sort,
    handleSort,
    getSortedProducts
  };
}
