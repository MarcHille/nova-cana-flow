
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";

const RecentOrders = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Neueste Bestellungen</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-200 dark:border-gray-700">
              <th className="pb-2 font-medium">Bestellnummer</th>
              <th className="pb-2 font-medium">Datum</th>
              <th className="pb-2 font-medium">Produkte</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Betrag</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.slice(0, 3).map((order) => (
                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3">{order.orderNumber || `#${order.id.substring(0, 8)}`}</td>
                  <td className="py-3">{new Date(order.createdAt).toLocaleDateString('de-DE')}</td>
                  <td className="py-3">{order.items?.length || 0} Artikel</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'pending' ? 'Ausstehend' :
                       order.status === 'processing' ? 'In Bearbeitung' :
                       order.status === 'shipped' ? 'Versendet' :
                       order.status === 'delivered' ? 'Geliefert' :
                       'Storniert'}
                    </span>
                  </td>
                  <td className="py-3">
                    {new Intl.NumberFormat('de-DE', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    }).format(order.total || order.totalAmount || 0)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  Keine Bestellungen vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
          Alle Bestellungen anzeigen
        </Button>
      </div>
    </div>
  );
};

export default RecentOrders;
