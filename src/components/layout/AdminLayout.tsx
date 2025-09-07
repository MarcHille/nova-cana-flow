
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Receipt, 
  Users, 
  Settings, 
  BookOpen,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  backUrl?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, backUrl }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Produkte", href: "/admin/products", icon: Package },
    { name: "Bestellungen", href: "/admin/orders", icon: ShoppingCart },
    { name: "Rechnungen", href: "/admin/invoices", icon: Receipt },
    { name: "Benutzer", href: "/admin/users", icon: Users },
    { name: "Dokumentation", href: "/admin/documentation", icon: BookOpen },
    { name: "Einstellungen", href: "/admin/settings", icon: Settings },
  ];

  const handleBackClick = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Admin Portal
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Verwaltung & Steuerung
            </p>
          </div>
          
          <nav className="mt-6 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="absolute bottom-6 px-6 w-64">
            <Button
              variant="outline"
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
            <div className="px-6 py-4 flex items-center gap-4">
              {backUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackClick}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Zurück
                </Button>
              )}
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {title}
              </h1>
            </div>
          </header>
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
