
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, User, Receipt, RefreshCw } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export const StatsCards = () => {
  const { totalProducts, totalOrders, totalUsers, totalInvoices, loading, refreshStats } = useDashboardStats();

  const handleRefresh = () => {
    refreshStats();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Dashboard-Übersicht</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Aktualisieren
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Produkte</CardTitle>
              <Package className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <CardDescription>Produktinventar verwalten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">
              {loading ? (
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                totalProducts
              )}
            </div>
            <Link to="/admin/products" className="w-full">
              <Button className="w-full">
                Produkte anzeigen
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Bestellungen</CardTitle>
              <ShoppingCart className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <CardDescription>Apothekenbestellungen verwalten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">
              {loading ? (
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                totalOrders
              )}
            </div>
            <Link to="/admin/orders" className="w-full">
              <Button className="w-full">
                Bestellungen anzeigen
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Benutzer</CardTitle>
              <User className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <CardDescription>Registrierte Benutzer verwalten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">
              {loading ? (
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                totalUsers
              )}
            </div>
            <Link to="/admin/users" className="w-full">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Benutzerverwaltung
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Finanzen</CardTitle>
              <Receipt className="text-teal-600 dark:text-teal-400" size={24} />
            </div>
            <CardDescription>Rechnungen und Zahlungen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">
              {loading ? (
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                totalInvoices
              )}
            </div>
            <Link to="/admin/invoices" className="w-full">
              <Button variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-50">
                Rechnungen anzeigen
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
