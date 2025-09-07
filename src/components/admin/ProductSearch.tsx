
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Plus } from "lucide-react";

interface ProductSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loading: boolean;
  onRefresh: () => void;
  onAddClick: () => void;
}

const ProductSearch = ({
  searchTerm,
  setSearchTerm,
  loading,
  onRefresh,
  onAddClick,
}: ProductSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button onClick={onAddClick}>
          <Plus size={16} className="mr-2" />
          Add Product
        </Button>
      </div>
    </div>
  );
};

export default ProductSearch;
