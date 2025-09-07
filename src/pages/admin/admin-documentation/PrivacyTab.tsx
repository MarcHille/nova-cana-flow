
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PrivacyTab = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-emerald-700" />
        Gesetzlicher Rahmen & Datenschutz
      </CardTitle>
      <CardDescription>
        Was muss aus rechtlicher Sicht sichergestellt werden?
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="list-disc pl-5 mb-5">
        <li><b>HWG - Heilmittelwerbegesetz</b>: Werbung für verschreibungspflichtige Arzneimittel ist stark eingeschränkt.</li>
        <li><b>MedCanG - Medizinisches-Cannabis-Gesetz:</b> Der Verkehr mit medizinischem Cannabis unterliegt besonderen Dokumentations- und Nachweispflichten.</li>
        <li><b>DSGVO:</b> Alle Benutzerdaten stets sicher speichern und nur zur Aufgabenerfüllung verwenden.</li>
        <li><b>Dokumentationspflicht:</b> Rezept- und Bestellunterlagen 3 Jahre aufbewahren, regelmäßige Bestandskontrolle, schnelle Meldung von Unregelmäßigkeiten.</li>
      </ul>
      <div className="p-3 rounded bg-blue-50 text-blue-800 text-xs mb-2">
        <b>Hinweis:</b> Bei Fragen oder Unsicherheiten wenden Sie sich bitte <i>immer an den Datenschutzbeauftragten</i> oder die Rechtsabteilung!
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="privacy-faq">
          <AccordionTrigger>Datenschutz FAQ</AccordionTrigger>
          <AccordionContent>
            <div className="mb-2"><b>Wie erfolgt die Speicherung sensibler Daten?</b><br />Auf sicheren Servern ausschließlich innerhalb der vorgesehenen Plattformfunktion. Keine Weitergabe ohne Einwilligung.</div>
            <div><b>Wer darf Einsicht nehmen?</b><br />Nur Nutzer mit passendem Rollenstatus (Admin/Apotheker), keine Weitergabe an Dritte!</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
);

export default PrivacyTab;
