
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Import all pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Documentation from "./pages/Documentation";
import FormulationGuidePage from "./pages/FormulationGuide";
import PharmacyManagement from "./pages/PharmacyManagement";
import AccountManagement from "./pages/AccountManagement";
import Imprint from "./pages/Imprint";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AboutUs from "./pages/AboutUs";

// Admin pages
import Admin from "./pages/Admin";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import PharmacyVerifications from "./pages/admin/PharmacyVerifications";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminDocumentation from "./pages/admin/AdminDocumentation";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders/cart" element={<Cart />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/formulation-guide" element={<FormulationGuidePage />} />
                <Route path="/pharmacy-management" element={<PharmacyManagement />} />
                <Route path="/account" element={<AccountManagement />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/imprint" element={<Imprint />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/pharmacy-verifications" element={<PharmacyVerifications />} />
                <Route path="/admin/invoices" element={<AdminInvoices />} />
                <Route path="/admin/documentation" element={<AdminDocumentation />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
