
import { Product } from "@/types";

export interface InvoiceItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  issueDate: Date;
  paidDate?: Date;
  notes?: string;
}

export const invoiceStatusColorMap: Record<string, { background: string; text: string }> = {
  draft: {
    background: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-800 dark:text-gray-300",
  },
  sent: {
    background: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-300",
  },
  paid: {
    background: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
  },
  overdue: {
    background: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-300",
  },
  cancelled: {
    background: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-800 dark:text-gray-300"
  }
};
