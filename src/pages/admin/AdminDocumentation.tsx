
import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/layout/AdminLayout";
import { BookOpen, UserCog, CheckSquare, Box, ShoppingCart, ShieldCheck, HelpCircle, Search } from "lucide-react";

// Import each tab section
import OverviewTab from "./admin-documentation/OverviewTab";
import UserManagementTab from "./admin-documentation/UserManagementTab";
import PharmacyVerificationTab from "./admin-documentation/PharmacyVerificationTab";
import ProductsTab from "./admin-documentation/ProductsTab";
import OrdersTab from "./admin-documentation/OrdersTab";
import PrivacyTab from "./admin-documentation/PrivacyTab";
import TutorialTab from "./admin-documentation/TutorialTab";

// Search data structure
const searchableContent = [
  { id: "overview", title: "Admin-Übersicht", keywords: ["übersicht", "funktionen", "workflow", "aufgaben"], tab: "overview" },
  { id: "user-create", title: "Benutzer anlegen", keywords: ["benutzer", "erstellen", "anlegen", "user", "account"], tab: "user-management" },
  { id: "user-roles", title: "Rollen verwalten", keywords: ["rollen", "berechtigung", "admin", "apotheker", "arzt"], tab: "user-management" },
  { id: "pharmacy-verify", title: "Apothekenverifizierung", keywords: ["apotheke", "verifizierung", "prüfung", "genehmigung", "lizenz"], tab: "pharmacy-verification" },
  { id: "pharmacy-docs", title: "Dokumentenprüfung", keywords: ["dokumente", "betriebserlaubnis", "lizenz", "prüfung"], tab: "pharmacy-verification" },
  { id: "products", title: "Produktverwaltung", keywords: ["produkte", "katalog", "lager", "preise", "cannabis"], tab: "products" },
  { id: "orders", title: "Bestellungen", keywords: ["bestellungen", "aufträge", "orders", "status"], tab: "orders" },
  { id: "invoices", title: "Rechnungen", keywords: ["rechnungen", "zahlungen", "billing", "export"], tab: "orders" },
  { id: "privacy", title: "Datenschutz", keywords: ["dsgvo", "datenschutz", "hwg", "btmg", "recht"], tab: "privacy" },
  { id: "legal", title: "Rechtliche Vorgaben", keywords: ["hwg", "heilmittelwerbegesetz", "medcang", "gesetze"], tab: "privacy" },
  { id: "tutorials", title: "Tutorials", keywords: ["tutorial", "anleitung", "hilfe", "faq", "troubleshooting"], tab: "tutorial" },
];

const AdminDocumentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredContent = useMemo(() => {
    if (!searchTerm) return searchableContent;
    
    return searchableContent.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const handleSearchResultClick = (tabId: string) => {
    setActiveTab(tabId);
    setSearchTerm("");
  };

  return (
    <AdminLayout title="Admin Dokumentation">
      <div className="space-y-6">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Willkommen in der Admin-Dokumentation
            </CardTitle>
            <CardDescription>
              Hier finden Sie <strong>Schritt-für-Schritt-Anleitungen</strong>, Checklisten und Hintergrundinfos rund um die Verwaltung der Plattform.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5" />
              Schnellsuche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen Sie nach Themen, Funktionen oder Anleitungen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Search Results */}
            {searchTerm && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Suchergebnisse:</h4>
                {filteredContent.length > 0 ? (
                  <div className="grid gap-2">
                    {filteredContent.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSearchResultClick(item.tab)}
                        className="flex items-center gap-2 p-3 text-left rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.keywords.slice(0, 3).join(", ")}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4">
                    Keine Ergebnisse für "{searchTerm}" gefunden.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-2">
            <TabsTrigger value="overview" className="flex flex-col items-center gap-1 py-3">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Übersicht</span>
            </TabsTrigger>
            <TabsTrigger value="user-management" className="flex flex-col items-center gap-1 py-3">
              <UserCog className="h-4 w-4" />
              <span className="text-xs">Benutzer</span>
            </TabsTrigger>
            <TabsTrigger value="pharmacy-verification" className="flex flex-col items-center gap-1 py-3">
              <CheckSquare className="h-4 w-4" />
              <span className="text-xs">Apotheken</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex flex-col items-center gap-1 py-3">
              <Box className="h-4 w-4" />
              <span className="text-xs">Produkte</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex flex-col items-center gap-1 py-3">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs">Bestellungen</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex flex-col items-center gap-1 py-3">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs">Recht</span>
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="flex flex-col items-center gap-1 py-3">
              <HelpCircle className="h-4 w-4" />
              <span className="text-xs">Tutorials</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="user-management">
              <UserManagementTab />
            </TabsContent>
            <TabsContent value="pharmacy-verification">
              <PharmacyVerificationTab />
            </TabsContent>
            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>
            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>
            <TabsContent value="privacy">
              <PrivacyTab />
            </TabsContent>
            <TabsContent value="tutorial">
              <TutorialTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDocumentation;
