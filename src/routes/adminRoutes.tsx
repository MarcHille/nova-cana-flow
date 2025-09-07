
import { RouteObject } from "react-router-dom";
import Admin from "@/pages/Admin";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminInvoices from "@/pages/admin/AdminInvoices";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminDocumentation from "@/pages/admin/AdminDocumentation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

/**
 * Admin routes that require admin privileges
 * All routes here are protected by ProtectedRoute with adminOnly=true
 * 
 * @security These routes are only accessible to users with admin role
 */
export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/products",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminProducts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminOrders />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminUsers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/invoices",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminInvoices />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/documentation",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminDocumentation />
      </ProtectedRoute>
    ),
  },
];
