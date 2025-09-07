
import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Orders from "@/pages/Orders";
import Cart from "@/pages/Cart";
import Documentation from "@/pages/Documentation";
import FormulationGuidePage from "@/pages/FormulationGuide";
import PharmacyManagement from "@/pages/PharmacyManagement";
import RouteGuard from "@/components/auth/RouteGuard";

/**
 * Protected routes that require authentication
 * Different levels of access are handled by RouteGuard props
 */
export const protectedRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <RouteGuard>
        <Dashboard />
      </RouteGuard>
    ),
  },
  {
    path: "/formulation-guide",
    element: (
      <RouteGuard>
        <FormulationGuidePage />
      </RouteGuard>
    ),
  },
  {
    path: "/products",
    element: (
      <RouteGuard pharmacistOnly={true} verifiedPharmacistOnly={true}>
        <Products />
      </RouteGuard>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <RouteGuard pharmacistOnly={true} verifiedPharmacistOnly={true}>
        <ProductDetail />
      </RouteGuard>
    ),
  },
  {
    path: "/orders",
    element: (
      <RouteGuard pharmacistOnly={true} verifiedPharmacistOnly={true}>
        <Orders />
      </RouteGuard>
    ),
  },
  {
    path: "/cart",
    element: (
      <RouteGuard pharmacistOnly={true} verifiedPharmacistOnly={true}>
        <Cart />
      </RouteGuard>
    ),
  },
  {
    path: "/orders/cart",
    element: (
      <RouteGuard pharmacistOnly={true} verifiedPharmacistOnly={true}>
        <Cart />
      </RouteGuard>
    ),
  },
  {
    path: "/documentation",
    element: (
      <RouteGuard>
        <Documentation />
      </RouteGuard>
    ),
  },
  {
    path: "/pharmacy-management",
    element: (
      <RouteGuard pharmacistOnly={true} verifiedPharmacistOnly={true}>
        <PharmacyManagement />
      </RouteGuard>
    ),
  },
];
