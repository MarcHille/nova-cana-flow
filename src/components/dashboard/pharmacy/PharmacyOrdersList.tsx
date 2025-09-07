
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";

const PharmacyOrdersList = () => {
  const { orders, loading } = useOrders();
  const { user } = useAuth();

  // Filter orders for the current user if available
  const userOrders = user ? orders.filter(order => order.userId === user.id) : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Abgeschlossen</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Bearbeitung</Badge>;
      case 'shipped':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Versandt</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Ausstehend</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Storniert</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Ihre Bestellungen</h3>
          <Button variant="outline" size="sm">
            Neue Bestellung
          </Button>
        </div>
        <div className="rounded-md border">
          <div className="animate-pulse p-4">
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Ihre Bestellungen</h3>
        <Button variant="outline" size="sm">
          Neue Bestellung
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bestell-Nr.</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Gesamtbetrag</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'dd.MM.yyyy', { locale: de })}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.totalAmount.toFixed(2)} €</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <p className="text-gray-500">Es wurden keine Bestellungen gefunden</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {userOrders.length === 0 && !loading && (
        <div className="text-center py-10">
          <Button variant="outline" className="mt-4">Erste Bestellung aufgeben</Button>
        </div>
      )}
    </div>
  );
};

export default PharmacyOrdersList;
