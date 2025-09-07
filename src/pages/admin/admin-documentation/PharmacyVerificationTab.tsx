
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PharmacyVerificationTab = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-primary" />
        Apothekenverifizierung
      </CardTitle>
      <CardDescription>
        Wie Sie Apotheken sicher und regelkonform prüfen, genehmigen oder ablehnen.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Ablauf der Verifizierung</h3>
        <ol className="list-decimal pl-4">
          <li>Alle Anfragen finden Sie unter <b>Apothekenverifizierung</b> („/admin/pharmacy-verifications“).</li>
          <li>Klicken Sie auf <b>Details</b> zur Anzeige der eingereichten Unterlagen.</li>
          <li>Prüfen Sie Lizenz, Adresse, Kontaktdaten und <b>Geschäftsdokumente</b>.</li>
          <li>Genehmigen oder lehnen Sie die Anfrage <b>begründet</b> ab.</li>
          <li>Das System weist bei Genehmigung automatisch die Rolle <i>Apotheker</i> zu.</li>
        </ol>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="legal-check">
          <AccordionTrigger>Rechtliche Checkliste</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6">
              <li>Betriebserlaubnis & Lizenz-Nummer im Original</li>
              <li>Korrekte Kontaktdaten (Name, Adresse, E-Mail, Telefon)</li>
              <li>Gültigkeit der Unterlagen prüfen (Nicht abgelaufen!)</li>
              <li>Geschäftsdokumente im Original und vollständig</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pharmacy-trouble">
          <AccordionTrigger>Troubleshooting Verifizierungen</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 text-xs">
              <li>Dokumente/Anhänge nicht sichtbar? Browser-Cache leeren, anderen Browser versuchen.</li>
              <li>Genehmigung klappt nicht? Prüfen, ob User bereits Apothekerrolle hat oder Kontakt zum Support aufnehmen.</li>
              <li>System- oder Ladefehler: Seite aktualisieren, später erneut versuchen.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="bg-blue-50 p-3 text-blue-800 rounded">
        <b>DSGVO:</b> Nach erfolgreicher Prüfung sind alle Unterlagen sicher zu archivieren und nicht mehr benötigte Daten zu löschen.
      </div>
    </CardContent>
  </Card>
);

export default PharmacyVerificationTab;
