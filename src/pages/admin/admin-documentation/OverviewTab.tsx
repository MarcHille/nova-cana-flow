
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, CheckCircle, Package, ShoppingBag, Shield, AlertCircle } from "lucide-react";

const OverviewTab = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Übersicht der Admin-Funktionen
        </CardTitle>
        <CardDescription>
          Verschaffen Sie sich einen Überblick über alle administrativen Aufgaben und die wichtigsten Workflows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold">Benutzerverwaltung</h3>
                <p className="text-sm text-muted-foreground">
                  Anlage, Bearbeitung und Löschung von Benutzerkonten sowie die Zuweisung von Rollen für fein abgestufte Zugriffsrechte.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">Apothekenverifizierung</h3>
                <p className="text-sm text-muted-foreground">
                  Prüfung, Genehmigung oder Ablehnung von Apothekenanfragen inkl. Dokumentenprüfung.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Package className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold">Produktkatalog</h3>
                <p className="text-sm text-muted-foreground">
                  Management von Produkten, Lagerbeständen, Preisen sowie Produktinformationen.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <ShoppingBag className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold">Bestellungen & Rechnungen</h3>
                <p className="text-sm text-muted-foreground">
                  Überwachung von Aufträgen und Zahlungen, Anzeige des aktuellen Status.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Shield className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold">Recht & Datenschutz</h3>
                <p className="text-sm text-muted-foreground">
                  Sicherstellung der Einhaltung gesetzlicher Vorgaben (HWG, DSGVO, BtMG etc.).
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-1" />
              <div>
                <h3 className="font-semibold">Wichtige Hinweise</h3>
                <p className="text-sm text-muted-foreground">
                  Beachten Sie immer die rechtlichen Bestimmungen und Dokumentationspflichten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Schnelleinstieg</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Neuen Benutzer anlegen → Tab "Benutzer & Rollen"
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              Apotheke verifizieren → Tab "Apothekenverifizierung"
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              Produkt hinzufügen → Tab "Produkte verwalten"
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              Bestellung prüfen → Tab "Bestellungen & Rechnungen"
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wichtige Erinnerungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">💡 Tipp</p>
              <p className="text-xs text-blue-800">
                Verwenden Sie die Suchfunktion oben, um schnell zu spezifischen Themen zu navigieren.
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-sm font-medium text-amber-900">⚠️ Wichtig</p>
              <p className="text-xs text-amber-800">
                Bei rechtlichen Fragen immer den Datenschutzbeauftragten kontaktieren.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default OverviewTab;
