
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order } from "@/types";

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, updates: { 
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; 
    trackingNumber?: string; 
    notes?: string 
  }) => void;
  getNextStatus: (currentStatus: string) => string;
  statusColorMap: {
    [key: string]: {
      background: string;
      text: string;
    };
  };
}

const OrderCard = ({ order, onStatusUpdate, getNextStatus, statusColorMap }: OrderCardProps) => {
  return (
    <Card key={order.id}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <CardTitle className="text-lg">
            Order #{order.id.substring(0, 8)}
          </CardTitle>
          <Badge
            className={`${
              statusColorMap[order.status]?.background || "bg-gray-100 dark:bg-gray-800"
            } ${
              statusColorMap[order.status]?.text || "text-gray-800 dark:text-gray-300"
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Placed on {order.createdAt.toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-1">Products</h4>
            <div className="text-sm">
              {order.products.map((item, index) => (
                <div key={index} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span>{item.name} x{item.quantity}</span>
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between mt-2 font-medium">
                <span>Total</span>
                <span>€{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-1">Shipping Address</h4>
              <p className="text-sm">
                {order.shippingAddress.name}<br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Billing Address</h4>
              <p className="text-sm">
                {order.billingAddress.name}<br />
                {order.billingAddress.street}<br />
                {order.billingAddress.city}, {order.billingAddress.postalCode}<br />
                {order.billingAddress.country}
              </p>
            </div>
          </div>

          {order.trackingNumber && (
            <div>
              <h4 className="font-medium text-sm mb-1">Tracking Number</h4>
              <p className="text-sm font-mono">{order.trackingNumber}</p>
            </div>
          )}

          {order.notes && (
            <div>
              <h4 className="font-medium text-sm mb-1">Notes</h4>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}

          <OrderActions 
            order={order} 
            onStatusUpdate={onStatusUpdate} 
            getNextStatus={getNextStatus} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface OrderActionsProps {
  order: Order;
  onStatusUpdate: (orderId: string, updates: { 
    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; 
    trackingNumber?: string; 
    notes?: string 
  }) => void;
  getNextStatus: (currentStatus: string) => string;
}

const OrderActions = ({ order, onStatusUpdate, getNextStatus }: OrderActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {order.status !== "delivered" && order.status !== "cancelled" && (
        <Button
          onClick={() =>
            onStatusUpdate(order.id, {
              status: getNextStatus(order.status) as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
            })
          }
        >
          Mark as {getNextStatus(order.status)}
        </Button>
      )}
      
      {order.status !== "cancelled" && (
        <Button
          variant="destructive"
          onClick={() =>
            onStatusUpdate(order.id, { status: "cancelled" })
          }
        >
          Cancel Order
        </Button>
      )}
      
      {(order.status === "processing" || order.status === "shipped") && !order.trackingNumber && (
        <Button
          variant="outline"
          onClick={() => {
            const trackingNumber = prompt("Enter tracking number:");
            if (trackingNumber) {
              onStatusUpdate(order.id, { trackingNumber });
            }
          }}
        >
          Add Tracking Number
        </Button>
      )}
      
      <Button
        variant="outline"
        onClick={() => {
          const notes = prompt("Enter notes for this order:", order.notes || "");
          if (notes !== null) {
            onStatusUpdate(order.id, { notes });
          }
        }}
      >
        {order.notes ? "Edit Notes" : "Add Notes"}
      </Button>
    </div>
  );
};

export default OrderCard;
