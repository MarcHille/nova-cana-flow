
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, FileText, Shield, Bell, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FormulationPDFUploader from "@/components/admin/FormulationPDFUploader";

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Demo-Einstellungen, würden normalerweise aus der Datenbank geladen
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Cannabis Apotheke",
    contactEmail: "kontakt@cannabis-apotheke.de",
    phoneNumber: "+49 123 456789",
    enableRegistration: true
  });

  const [emailSettings, setEmailSettings] = useState({
    emailConfirmationRequired: true,
    emailNotificationsEnabled: true,
    adminEmailNotifications: true
  });

  const handleSaveGeneralSettings = () => {
    setLoading(true);
    // Hier würde die API-Anfrage zum Speichern der Einstellungen erfolgen
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Änderungen gespeichert",
        description: "Die allgemeinen Einstellungen wurden aktualisiert."
      });
    }, 800);
  };

  const handleSaveEmailSettings = () => {
    setLoading(true);
    // Hier würde die API-Anfrage zum Speichern der E-Mail-Einstellungen erfolgen
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Änderungen gespeichert",
        description: "Die E-Mail-Einstellungen wurden aktualisiert."
      });
    }, 800);
  };

  return (
    <AdminLayout title="Einstellungen" backUrl="/admin">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            Allgemein
          </TabsTrigger>
          <TabsTrigger value="email">
            <Bell className="h-4 w-4 mr-2" />
            Benachrichtigungen
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileUp className="h-4 w-4 mr-2" />
            Dokumente
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Sicherheit
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Allgemeine Einstellungen</CardTitle>
              <CardDescription>
                Passen Sie grundlegende Einstellungen Ihrer Anwendung an.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Name der Website</Label>
                <Input 
                  id="siteName" 
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Kontakt-E-Mail</Label>
                <Input 
                  id="contactEmail" 
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Telefonnummer</Label>
                <Input 
                  id="phoneNumber" 
                  value={generalSettings.phoneNumber}
                  onChange={(e) => setGeneralSettings({...generalSettings, phoneNumber: e.target.value})}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enableRegistration" className="flex-grow">Registrierung aktivieren</Label>
                <Switch 
                  id="enableRegistration" 
                  checked={generalSettings.enableRegistration}
                  onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableRegistration: checked})}
                />
              </div>
              
              <Button 
                onClick={handleSaveGeneralSettings} 
                className="mt-4"
                disabled={loading}
              >
                {loading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>E-Mail-Einstellungen</CardTitle>
              <CardDescription>
                Konfigurieren Sie E-Mail-Benachrichtigungen und Bestätigungen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="emailConfirmationRequired" className="flex-grow">E-Mail-Bestätigung erforderlich</Label>
                <Switch 
                  id="emailConfirmationRequired" 
                  checked={emailSettings.emailConfirmationRequired}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, emailConfirmationRequired: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="emailNotificationsEnabled" className="flex-grow">E-Mail-Benachrichtigungen aktivieren</Label>
                <Switch 
                  id="emailNotificationsEnabled" 
                  checked={emailSettings.emailNotificationsEnabled}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, emailNotificationsEnabled: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="adminEmailNotifications" className="flex-grow">Admin-Benachrichtigungen</Label>
                <Switch 
                  id="adminEmailNotifications" 
                  checked={emailSettings.adminEmailNotifications}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, adminEmailNotifications: checked})}
                />
              </div>
              
              <Button 
                onClick={handleSaveEmailSettings} 
                className="mt-4"
                disabled={loading}
              >
                {loading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <FormulationPDFUploader />
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sicherheitseinstellungen</CardTitle>
              <CardDescription>
                Konfigurieren Sie Sicherheitsoptionen und Zugriffsbeschränkungen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Sicherheitseinstellungen werden in einem kommenden Update verfügbar sein.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
