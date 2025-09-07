
import React from "react";

export interface CartSummaryProps {
  totalAmount: number;
  formatCurrency?: (amount: number) => string;
}

const CartSummary = ({ totalAmount, formatCurrency }: CartSummaryProps) => {
  // Default formatter if none provided
  const format = formatCurrency || ((amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  });
  
  // Calculate tax (19% in Germany)
  const tax = totalAmount * 0.19;
  const subtotal = totalAmount - tax;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Bestellübersicht</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Zwischensumme:</span>
          <span className="font-medium text-gray-900 dark:text-white">{format(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">MwSt. (19%):</span>
          <span className="font-medium text-gray-900 dark:text-white">{format(tax)}</span>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900 dark:text-white">Gesamtbetrag:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{format(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
