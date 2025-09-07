
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const UserManagementTab = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <UserCog className="h-5 w-5 text-primary" />
        Benutzerverwaltung & Rollen
      </CardTitle>
      <CardDescription>
        Hier erfahren Sie, wie Sie Benutzer anlegen, verwalten und Berechtigungen optimal verteilen.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Benutzerrollen im System</h3>
        <ul className="list-disc pl-6">
          <li><b>Admin:</b> Vollzugriff auf alle Daten & Funktionen der Novacana GmbH, inkl. Benutzerverwaltung und Bestellabwicklung.</li>
          <li><b>Apotheker:</b> Zugriff auf einen eigenen Bereich für Bestellungen, Verfolgung von Aufträgen und Apothekenspezifische Funktionen.</li>
          <li><b>Arzt:</b> Zugriff auf Produktinformationen und Formulierungshilfen für medizinische Anwendungen.</li>
          <li><b>Besucher:</b> Eingeschränkter Zugriff ohne Einsicht in Produktdetails oder sensible Informationen.</li>
        </ul>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="user-create">
          <AccordionTrigger>Neuen Benutzer anlegen</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-8 mb-2">
              <li>Wechseln Sie auf die Seite <b>Benutzerverwaltung</b> („/admin/users").</li>
              <li>Klicken Sie auf <b>Benutzer hinzufügen</b>.</li>
              <li>Tragen Sie E-Mail & Passwort ein und wählen Sie die passende Rolle.</li>
              <li>Klicken Sie auf <b>Benutzer erstellen</b>. Einladungs-E-Mail wird gesendet.</li>
            </ol>
            <div className="mt-2 text-sm bg-gray-100 rounded p-2">
              <b>Sicherheits-Hinweis:</b> Vergeben Sie Admin-Rechte nur an Mitarbeiter der Novacana GmbH!
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="role-manage">
          <AccordionTrigger>Rollen zuweisen oder entziehen</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-8">
              <li>Wählen Sie in der Benutzerliste den passenden Benutzer aus.</li>
              <li>Klicken Sie auf die gewünschte Rolle, um sie hinzuzufügen oder zu entfernen.</li>
              <li>Aktualisieren Sie die Ansicht bei Bedarf (<b>Aktualisieren</b>-Button).</li>
            </ol>
            <div className="mt-2 text-xs text-blue-800 dark:text-blue-200">
              Änderungen werden sofort wirksam, ein erneuter Login ist ggf. erforderlich.
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="user-trouble">
          <AccordionTrigger>Troubleshooting Benutzerverwaltung</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6">
              <li>Kein Zugang? Admin-Rechte überprüfen und Passwort ggf. zurücksetzen.</li>
              <li>Benutzer nicht sichtbar? Seite neuladen oder Filter zurücksetzen.</li>
              <li>Ungewöhnliche Rollenvergabe? Kontrollieren, ob noch genügend Admins im System sind!</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-4 p-3 rounded bg-blue-100 text-blue-800 text-xs">
        <b>Rechtlicher Hinweis:</b> Rollenverwaltung immer unter Beachtung des Datenschutzes und HWG (z. B. keine unberechtigte Einsicht in sensible Daten)!
      </div>
    </CardContent>
  </Card>
);

export default UserManagementTab;
