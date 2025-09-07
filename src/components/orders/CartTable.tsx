
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem, Product } from "@/types";

interface CartTableProps {
  cartProducts: Array<CartItem & { product?: Product }>;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  formatCurrency?: (amount: number) => string;
  showControls?: boolean;
}

const CartTable = ({
  cartProducts,
  onRemoveItem,
  onUpdateQuantity,
  formatCurrency,
  showControls = true,
}: CartTableProps) => {
  // Default formatter if none provided
  const format = formatCurrency || ((amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  });

  if (cartProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Ihr Warenkorb ist leer</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
              Produkt
            </th>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
              Preis
            </th>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
              Menge
            </th>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
              Gesamt
            </th>
            {showControls && (
              <th scope="col" className="py-3.5 px-4 text-right text-sm font-medium text-gray-700 dark:text-gray-200">
                <span className="sr-only">Aktionen</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {cartProducts.map((item) => {
            const product = item.product;
            return (
              <tr key={item.productId}>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {product?.imageUrl && (
                      <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product?.name} 
                          className="h-full w-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product?.name || "Unbekanntes Produkt"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product?.shortDescription || ""}
                      </p>
                      {product?.pzn && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PZN: {product.pzn}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {product ? format(product.price) : "N/A"}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {showControls ? (
                    <div className="flex items-center border rounded-md w-32">
                      <button
                        type="button"
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                        onClick={() => {
                          if (item.quantity > 1) {
                            onUpdateQuantity(item.productId, item.quantity - 1);
                          }
                        }}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="flex-1 text-center py-2 text-gray-700 dark:text-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                        onClick={() => {
                          const maxStock = product?.stock || 100;
                          if (item.quantity < maxStock) {
                            onUpdateQuantity(item.productId, item.quantity + 1);
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-200">{item.quantity}</span>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {product ? format(product.price * item.quantity) : "N/A"}
                </td>
                {showControls && (
                  <td className="py-4 px-4 whitespace-nowrap text-right text-sm">
                    <Button
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveItem(item.productId)}
                      className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <Trash2 size={18} />
                      <span className="sr-only">Entfernen</span>
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
