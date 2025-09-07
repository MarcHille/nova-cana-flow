export interface User {
  id: string;
  name?: string;
  email: string;
  role?: 'admin' | 'pharmacist' | 'doctor';
  roles?: string[];
  pharmacyName?: string;
  pharmacyId?: string;
  address?: string;
  phone?: string;
  verificationStatus?: string;
  createdAt?: Date;
  created_at?: string;
  blocked?: boolean;
  raw_user_meta_data?: any; // Add this property to support metadata access
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  thcContent?: string;
  cbdContent?: string;
  terpenes?: string[];
  weight?: string;
  dosage?: string;
  effects?: string[];
  origin?: string;
  createdAt: Date;
  updatedAt: Date;
  manufacturer?: string;
  countryOfOrigin?: string;
  recommendedDosage?: string;
  pzn?: string;
  isNew?: boolean;
  rating?: number;
}

export type Category = string;

export interface OrderItem {
  productId: string;
  name: string; 
  quantity: number;
  price: number;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  products: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  pharmacyName?: string;
  pharmacyId?: string;
  orderNumber?: string;
  items?: OrderItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}
