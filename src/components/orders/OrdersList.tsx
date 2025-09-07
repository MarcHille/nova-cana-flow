
import React from "react";
import { Order } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface OrdersListProps {
  orders: Order[];
  isLoading?: boolean;
}

const OrdersList = ({ orders, isLoading = false }: OrdersListProps) => {
  // Function to determine badge color based on status
  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "shipped":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "delivered":
        return "bg-nova-100 text-nova-800 dark:bg-nova-900/30 dark:text-nova-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        <div className="rounded-lg border overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-800 p-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          </div>
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <FileText size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No orders yet
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          When you place orders, they will appear here.
        </p>
        <div className="mt-6">
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order No.</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeVariant(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{order.items.length}</TableCell>
              <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
              <TableCell className="text-center">
                <Link to={`/orders/${order.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye size={16} />
                    <span className="sr-only">View order</span>
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersList;
