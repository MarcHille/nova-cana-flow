
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export interface ProductSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  onSearch?: (query: string) => void;
}

const ProductSearch = ({ 
  searchQuery, 
  setSearchQuery, 
  placeholder = "Produkte suchen...",
  categories = [],
  selectedCategory = "all",
  onCategoryChange = () => {},
  onSearch = () => {}
}: ProductSearchProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={18} aria-hidden="true" />
        </div>
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          className="pl-10"
          aria-label={placeholder}
          maxLength={100} // Security: limit input length
        />
      </div>
      
      {categories.length > 0 && (
        <div className="w-full md:w-64">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full bg-white dark:bg-gray-800">
              <div className="flex items-center">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Kategorie auswählen" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kategorien</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
