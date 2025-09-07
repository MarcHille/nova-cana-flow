
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ProductsHeaderProps {
  productsCount: number;
  isLoading: boolean;
  viewMode: "grid" | "table";
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  productsCount,
  isLoading,
  viewMode
}) => {
  return (
    <>
      {/* Back to Dashboard Link */}
      <div className="mb-6">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Zurück zum Dashboard</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Medizinische Cannabis-Produkte
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {isLoading ? "Produkte werden geladen..." : `${productsCount} Produkte gefunden`}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductsHeader;
