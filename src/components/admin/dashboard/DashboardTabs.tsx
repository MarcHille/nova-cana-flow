
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export const DashboardTabs = () => {
  const navigate = useNavigate();
  const { orders, loading } = useOrders();

  // Get only the first 3 orders for the dashboard preview
  const recentOrders = orders.slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'In Bearbeitung';
      case 'processing':
        return 'In Bearbeitung';
      case 'shipped':
        return 'Versandt';
      case 'delivered':
        return 'Geliefert';
      case 'cancelled':
        return 'Storniert';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Tabs defaultValue="recent" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="recent">Aktuelle Bestellungen</TabsTrigger>
        <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
      </TabsList>
      
      <TabsContent value="recent" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-lg mb-4">Aktuelle Bestellungen</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentOrders.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b dark:border-gray-700">
                  <th className="pb-2 font-medium">Bestellung #</th>
                  <th className="pb-2 font-medium">Datum</th>
                  <th className="pb-2 font-medium">Betrag</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b dark:border-gray-700">
                    <td className="py-3">{order.id.substring(0, 8)}...</td>
                    <td className="py-3">{format(new Date(order.createdAt), 'dd. MMMM yyyy', { locale: de })}</td>
                    <td className="py-3">€{order.totalAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                        {getStatusBadge(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Keine aktuellen Bestellungen vorhanden
            </div>
          )}
        </div>
        <div className="mt-4 text-right">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
            Alle Bestellungen
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="notifications" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-lg mb-4">Systembenachrichtigungen</h3>
        <div className="text-center py-8 text-gray-500">
          Keine Benachrichtigungen vorhanden
        </div>
        <div className="mt-4 text-right">
          <Button variant="outline" size="sm">
            Alle Benachrichtigungen
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};
