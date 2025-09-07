
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, KeyRound } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TutorialTab = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        Schritt-für-Schritt Tutorials & FAQ für Admins
      </CardTitle>
      <CardDescription>
        Häufige Aufgaben kurz erklärt – ideal für neue Admins oder als schnelles Nachschlagewerk!
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Accordion type="multiple" className="mb-6">
        <AccordionItem value="tutorial-user-create">
          <AccordionTrigger>Neuen Benutzer anlegen & Rolle vergeben</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-6 mb-2 text-sm">
              <li>Gehen Sie zu <b>Benutzerverwaltung</b> &rarr; <i>Benutzer hinzufügen</i>.</li>
              <li>E-Mail und Passwort eingeben. Rolle auswählen.</li>
              <li>Benutzer erstellen – der neue User kann sich sofort anmelden!</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tutorial-pharmacy">
          <AccordionTrigger>Apothekenverifizierung Schritt-für-Schritt</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-6 mb-2 text-sm">
              <li>Seite <b>Apothekenverifizierung</b> öffnen.</li>
              <li><b>Details</b> für die Anfrage sehen.</li>
              <li>Unterlagen prüfen und Status setzen (genehmigen/ablehnen) — <b>Hinweis hinterlassen!</b></li>
              <li>Bei Genehmigung wird die Apothekerrolle <b>automatisch</b> vergeben.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tutorial-product-add">
          <AccordionTrigger>Produkt hinzufügen</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-6 mb-2 text-sm">
              <li>Klicken Sie auf <b>Produkte</b> &rarr; <i>Produkt anlegen</i>.</li>
              <li>Alle Pflichtfelder sorgfältig ausfüllen und Bild hochladen.</li>
              <li>Speichern klicken. Das Produkt ist sofort verfügbar!</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tutorial-invoice">
          <AccordionTrigger>Rechnung erstellen & exportieren</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-6 mb-2 text-sm">
              <li>Zur Seite <b>Rechnungen</b> wechseln.</li>
              <li>Neue Rechnung aus Bestellung generieren.</li>
              <li>Mit Klick auf „Exportieren“ als PDF speichern oder drucken.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="trouble-allgemein">
          <AccordionTrigger>FAQ & Fehlerbehebung (Troubleshooting)</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 text-sm">
              <li><b>Benutzer nicht sichtbar?</b> Seite aktualisieren und Rechte prüfen.</li>
              <li><b>Bestellung fehlt?</b> Filter zurücksetzen und ggf. Support kontaktieren.</li>
              <li><b>Apothekenrolle nicht vergeben?</b> Premium-Workflow abwarten oder manuelle Rollenzuweisung versuchen.</li>
              <li><b>Technik-Ausfall?</b> Support informieren – nie technische Workarounds ohne Absprache!</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="bg-blue-50 text-blue-900 text-xs rounded p-3">
        <KeyRound className="inline align-text-bottom mr-2" size={14} />
        <b>Tipp:</b> Nutzen Sie die <i>Admin Dokumentation</i> regelmäßig für schnelles Onboarding neuer Kollegen und sichern Sie die reibungslose Nutzung der Plattform!
      </div>
    </CardContent>
  </Card>
);

export default TutorialTab;
