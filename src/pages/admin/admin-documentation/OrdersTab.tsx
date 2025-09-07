
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const OrdersTab = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-blue-700" />
        Bestellungen & Rechnungen
      </CardTitle>
      <CardDescription>
        Ihr Workflow für die Bearbeitung und Nachverfolgung von Bestellungen und Zahlungen.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ol className="list-decimal pl-4 mb-6">
        <li>Aktuelle Bestellungen finden Sie im Tab <b>Bestellungen</b> oder in der Übersicht.</li>
        <li>Detailansicht zeigt Bestelldaten, Produktliste und Statushistorie.</li>
        <li>Wechseln Sie zum Tab <b>Rechnungen</b> für Zahlungsverwaltung und Exportfunktionen.</li>
        <li>Rechnungen als PDF generieren und im System speichern (gesetzliche Aufbewahrungsfrist beachten!).</li>
      </ol>
      <Accordion type="single" collapsible>
        <AccordionItem value="orders-faq">
          <AccordionTrigger>Bestell- & Rechnungs-FAQ</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 text-sm">
              <li>Status „offen“ bleibt? Zahlungseingang kontrollieren oder Support kontaktieren.</li>
              <li>Fehler in der Rechnung? Bearbeiten und neu generieren.</li>
              <li>Archivierte Rechnungen nicht sichtbar? Filter/Suchfunktion nutzen.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
);

export default OrdersTab;
