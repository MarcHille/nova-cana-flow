
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  FileText,
  User,
  LogOut,
  Building2,
  Settings,
  BookOpen,
  Shield
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, isPharmacist, isVerifiedPharmacist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Fehler beim Abmelden",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Navigation links based on user role
  const getNavigationLinks = () => {
    const links = [
      { to: "/dashboard", icon: Home, label: "Dashboard" },
    ];

    // Add products link for pharmacists (verified or admin)
    if (isAdmin || (isPharmacist && isVerifiedPharmacist)) {
      links.push({ to: "/products", icon: Package, label: "Produkte" });
    }

    links.push({ to: "/formulation-guide", icon: BookOpen, label: "Formulierungshilfe" });

    // Add pharmacy-specific links for verified pharmacists
    if (isPharmacist && isVerifiedPharmacist) {
      links.push(
        { to: "/orders", icon: ShoppingCart, label: "Bestellungen" },
        { to: "/pharmacy-management", icon: Building2, label: "Apothekenverwaltung" }
      );
    }

    // Add admin link for admins
    if (isAdmin) {
      links.push({ to: "/admin", icon: Shield, label: "Admin" });
    }

    links.push({ to: "/documentation", icon: FileText, label: "Dokumentation" });

    return links;
  };

  const navigationLinks = getNavigationLinks();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/66045f1f-4643-4ce0-9479-3d9a29387536.png" 
                alt="Novacana Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.to)
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/account">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Konto
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  Abmelden
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Anmelden
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-800">
            {user && (
              <>
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.to)
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Link>
                  );
                })}
                <hr className="border-gray-300 dark:border-gray-600 my-2" />
                <Link
                  to="/account"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Konto verwalten
                </Link>
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  Abmelden
                </Button>
              </>
            )}

            {!user && (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Anmelden
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
