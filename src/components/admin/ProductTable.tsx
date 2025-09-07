
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Package } from "lucide-react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ProductTableProps {
  products: Product[];
  searchTerm: string;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductTable = ({ products, searchTerm, onEdit, onDelete }: ProductTableProps) => {
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.manufacturer && product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.pzn && product.pzn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-md shadow">
        <Package className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          Keine Produkte gefunden
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {searchTerm ? "Bitte passen Sie Ihre Suchkriterien an." : "Fügen Sie ein neues Produkt hinzu, um zu beginnen."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead>Preis (€)</TableHead>
              <TableHead className="text-center">Bestand</TableHead>
              <TableHead>PZN</TableHead>
              <TableHead>Hersteller</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>{product.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <StockIndicator stock={product.stock} />
                </TableCell>
                <TableCell>{product.pzn || "-"}</TableCell>
                <TableCell>{product.manufacturer || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      <Edit size={16} />
                      <span className="sr-only">Bearbeiten</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash size={16} />
                      <span className="sr-only">Löschen</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Stock indicator component
const StockIndicator = ({ stock }: { stock: number }) => {
  if (stock <= 0) {
    return (
      <Badge variant="destructive" className="font-mono">
        0
      </Badge>
    );
  }
  
  if (stock < 10) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-mono">
        {stock}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-mono">
      {stock}
    </Badge>
  );
};

export default ProductTable;
