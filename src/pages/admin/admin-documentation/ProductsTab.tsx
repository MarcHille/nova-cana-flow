
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, ShoppingCart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductsTab = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Box className="h-5 w-5 text-green-700" />
        Produkte / Sortiment verwalten
      </CardTitle>
      <CardDescription>
        Anleitung zur sicheren Verwaltung Ihres Produktkatalogs.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ol className="list-decimal list-inside pl-4 mb-6">
        <li>Alle Produkte im Adminbereich unter <b>Produkte</b> sichtbar ("/admin/products").</li>
        <li>Neues Produkt hinzufügen, indem Sie das Formular „Produkt anlegen" ausfüllen. Pflichtfelder beachten!</li>
        <li>Bestehende Produkte über <b>Bearbeiten</b> oder <b>Löschen</b> verwalten.</li>
        <li>Lagerbestand regelmäßig kontrollieren, um Lieferengpässe zu vermeiden.</li>
      </ol>
      
      <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-4 mb-6">
        <div className="flex gap-3">
          <ShoppingCart className="h-5 w-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">Bestellungen & Warenkorb</h4>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              Kunden können Produkte über die Produktseite dem Warenkorb hinzufügen und unter "/orders" ihre Bestellung aufgeben.
              Bestellungen erscheinen dann im Admin-Bereich unter "Bestellungen".
            </p>
          </div>
        </div>
      </div>
      
      <Accordion type="single" collapsible>
        <AccordionItem value="product-faq">
          <AccordionTrigger>Häufige Fragen zur Produktverwaltung</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 text-sm">
              <li>Produkt nicht sichtbar? Identität & Rechte prüfen, ggf. Seite aktualisieren.</li>
              <li>Preisänderung nicht übernommen? Prüfen, ob auf „Speichern" geklickt wurde und ggf. Benutzerrolle kontrollieren.</li>
              <li>Nicht veränderbare Felder? Abhängigkeit von Produktstatus oder Rollenzuweisung prüfen.</li>
              <li>Bestellungen können von Kunden im Warenkorb unter "/orders" aufgegeben werden.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="mt-4 p-2 text-xs bg-blue-50 rounded">
        <b>Qualitätssicherung:</b> Nur zertifizierte Produkte listen! Produktionschargen und lückenlose Dokumentation beachten.
      </div>
    </CardContent>
  </Card>
);

export default ProductsTab;
