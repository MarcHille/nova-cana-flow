
import React from "react";
import { Card } from "@/components/ui/card";
import AdminLayout from "@/components/layout/AdminLayout";
import OrderCard from "@/components/admin/OrderCard";
import { useOrders, statusColorMap } from "@/hooks/useOrders";

const AdminOrders = () => {
  const { orders, loading, updateOrderStatus, getNextStatus } = useOrders();

  if (loading) {
    return (
      <AdminLayout title="Order Management">
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                </div>
                <div className="mt-4 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </Card>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Order Management">
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            There are currently no orders in the system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusUpdate={updateOrderStatus}
              getNextStatus={getNextStatus}
              statusColorMap={statusColorMap}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
