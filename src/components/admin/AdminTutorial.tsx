
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, UserCog, ClipboardCheck, Package, ShoppingBag, HelpCircle } from "lucide-react";

interface Step {
  title: string;
  description: string;
  content: React.ReactNode;
  icon: React.ReactNode;
}

const AdminTutorial: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const steps: Step[] = [
    {
      title: "Willkommen im Admin-Portal",
      description: "Eine kurze Einführung in das Admin-Portal",
      icon: <HelpCircle className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Willkommen im Admin-Portal! Als Administrator haben Sie Zugriff auf verschiedene Funktionen 
            zur Verwaltung der Plattform. Dieses Tutorial führt Sie durch die wichtigsten Bereiche.
          </p>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="border rounded p-3">
              <h4 className="font-medium flex items-center gap-1 mb-1">
                <UserCog className="h-4 w-4 text-primary" />
                Benutzerverwaltung
              </h4>
              <p className="text-sm">Benutzer und deren Rollen verwalten</p>
            </div>
            
            <div className="border rounded p-3">
              <h4 className="font-medium flex items-center gap-1 mb-1">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                Apothekenverifizierungen
              </h4>
              <p className="text-sm">Anfragen zur Verifizierung bearbeiten</p>
            </div>
            
            <div className="border rounded p-3">
              <h4 className="font-medium flex items-center gap-1 mb-1">
                <Package className="h-4 w-4 text-primary" />
                Produktverwaltung
              </h4>
              <p className="text-sm">Produkte hinzufügen und bearbeiten</p>
            </div>
            
            <div className="border rounded p-3">
              <h4 className="font-medium flex items-center gap-1 mb-1">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Bestellungen
              </h4>
              <p className="text-sm">Bestellungen verwalten und bearbeiten</p>
            </div>
          </div>
          
          <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
            <p className="font-medium">Tipp:</p>
            <p>Sie können dieses Tutorial jederzeit über das Hilfe-Menü in der Kopfzeile erneut aufrufen.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Benutzerverwaltung",
      description: "Lernen Sie, wie Sie Benutzer und Rollen verwalten",
      icon: <UserCog className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            In der Benutzerverwaltung können Sie neue Benutzer anlegen, deren Rollen verwalten und 
            bestehende Benutzerkonten bearbeiten.
          </p>
          
          <div className="space-y-2 mt-3">
            <h4 className="font-medium">Hauptfunktionen:</h4>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Neue Benutzer anlegen mit E-Mail und Passwort</li>
              <li>Rollen zuweisen (Admin, Apotheker, Benutzer)</li>
              <li>Bestehende Rollen entfernen</li>
              <li>Benutzerübersicht mit Such- und Filterfunktion</li>
            </ul>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <h4 className="font-medium mb-2">So fügen Sie einen neuen Benutzer hinzu:</h4>
            <ol className="list-decimal list-inside space-y-1 pl-2 text-sm">
              <li>Klicken Sie auf "Benutzer hinzufügen"</li>
              <li>Geben Sie E-Mail und ein sicheres Passwort ein</li>
              <li>Wählen Sie die entsprechende Rolle aus</li>
              <li>Klicken Sie auf "Benutzer erstellen"</li>
            </ol>
          </div>
          
          <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm">
            <p className="font-medium">Wichtig:</p>
            <p>Achten Sie darauf, dass immer mindestens ein Benutzer mit Admin-Rolle existiert.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Apothekenverifizierung",
      description: "Verifizierungsanfragen bearbeiten und genehmigen",
      icon: <ClipboardCheck className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Unter Apothekenverifizierung können Sie eingehende Verifizierungsanträge prüfen und 
            entscheiden, ob eine Apotheke zum System zugelassen wird.
          </p>
          
          <div className="space-y-2 mt-3">
            <h4 className="font-medium">Prüfungsschritte:</h4>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>Verifizierungsanfrage in der Liste finden</li>
              <li>Detailansicht öffnen, um eingereichte Dokumente zu prüfen</li>
              <li>Betriebserlaubnis und andere Dokumente auf Gültigkeit prüfen</li>
              <li>Kontaktdaten mit den Dokumenten abgleichen</li>
              <li>Entscheiden: Genehmigen oder Ablehnen</li>
            </ol>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="border border-green-200 bg-green-50 text-green-800 rounded p-3">
              <h4 className="font-medium mb-1">Genehmigen</h4>
              <p className="text-sm">Wenn alle Dokumente gültig sind und den Anforderungen entsprechen</p>
            </div>
            
            <div className="border border-red-200 bg-red-50 text-red-800 rounded p-3">
              <h4 className="font-medium mb-1">Ablehnen</h4>
              <p className="text-sm">Bei fehlenden oder ungültigen Dokumenten (immer mit Begründung)</p>
            </div>
          </div>
          
          <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
            <p className="font-medium">Wichtige Information:</p>
            <p>Nach Genehmigung erhält der Benutzer automatisch die Rolle "Apotheker" und kann die entsprechenden Funktionen nutzen.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Produktverwaltung",
      description: "Produkte erstellen und verwalten",
      icon: <Package className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            In der Produktverwaltung können Sie den Katalog pflegen, neue Produkte hinzufügen und bestehende bearbeiten.
          </p>
          
          <div className="space-y-2 mt-3">
            <h4 className="font-medium">Hauptfunktionen:</h4>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Produktübersicht mit Filterfunktionen</li>
              <li>Produkte hinzufügen mit allen relevanten Informationen</li>
              <li>Bestehende Produkte bearbeiten oder deaktivieren</li>
              <li>Lagerbestand verwalten</li>
              <li>Produktkategorien zuweisen</li>
            </ul>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <h4 className="font-medium mb-2">So fügen Sie ein neues Produkt hinzu:</h4>
            <ol className="list-decimal list-inside space-y-1 pl-2 text-sm">
              <li>Klicken Sie auf "Produkt hinzufügen"</li>
              <li>Füllen Sie alle erforderlichen Produktinformationen aus</li>
              <li>Laden Sie ein Produktbild hoch</li>
              <li>Legen Sie den initialen Lagerbestand fest</li>
              <li>Klicken Sie auf "Speichern", um das Produkt zu erstellen</li>
            </ol>
          </div>
          
          <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm">
            <p className="font-medium">Tipp:</p>
            <p>Achten Sie darauf, vollständige und genaue Produktbeschreibungen zu erstellen, besonders bei medizinischen Produkten.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Bestellungsmanagement",
      description: "Bestellungen verwalten und bearbeiten",
      icon: <ShoppingBag className="h-6 w-6 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Im Bestellungsmanagement sehen Sie alle eingehenden Bestellungen, können deren Status verfolgen und bearbeiten.
          </p>
          
          <div className="space-y-2 mt-3">
            <h4 className="font-medium">Bestellstatus verstehen:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="border rounded p-2 text-sm">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
                <span className="font-medium">Ausstehend</span> - Neue Bestellung, noch nicht bearbeitet
              </div>
              <div className="border rounded p-2 text-sm">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-1"></span>
                <span className="font-medium">In Bearbeitung</span> - Wird zusammengestellt
              </div>
              <div className="border rounded p-2 text-sm">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-400 mr-1"></span>
                <span className="font-medium">Versandt</span> - An Lieferdienst übergeben
              </div>
              <div className="border rounded p-2 text-sm">
                <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-1"></span>
                <span className="font-medium">Geliefert</span> - Erfolgreich zugestellt
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mt-3">
            <h4 className="font-medium">Hauptaktionen:</h4>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Bestelldetails einsehen</li>
              <li>Bestellstatus aktualisieren</li>
              <li>Versandinformationen hinzufügen</li>
              <li>Rechnungen generieren</li>
              <li>Bei Problemen mit dem Kunden kommunizieren</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
            <p className="font-medium">Wichtig:</p>
            <p>Halten Sie den Bestellstatus immer aktuell, damit Kunden den Fortschritt ihrer Bestellung verfolgen können.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Erfolgreich abgeschlossen!",
      description: "Sie haben alle Grundlagen kennengelernt",
      icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
      content: (
        <div className="space-y-4 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
          
          <h3 className="text-xl font-medium">Glückwunsch!</h3>
          
          <p>
            Sie haben das Admin-Tutorial erfolgreich abgeschlossen und kennen jetzt 
            die wichtigsten Funktionen des Admin-Portals.
          </p>
          
          <div className="bg-green-50 text-green-800 p-4 rounded-md my-4">
            <p className="font-medium">Nächste Schritte:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-left mt-1">
              <li>Erkunden Sie das Dashboard für einen Überblick über aktuelle Kennzahlen</li>
              <li>Prüfen Sie bestehende Apothekenverifizierungen</li>
              <li>Pflegen Sie den Produktkatalog</li>
            </ul>
          </div>
          
          <p className="text-sm mt-6">
            Bei Fragen können Sie jederzeit die Admin-Dokumentation unter "Admin Dokumentation" aufrufen 
            oder den Support kontaktieren.
          </p>
        </div>
      ),
    },
  ];

  const handleOpen = () => setOpen(true);

  const handleNext = () => {
    setCompleted(prev => ({ ...prev, [currentStep]: true }));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setOpen(false);
  };

  const handleTabChange = (value: string) => {
    const stepIndex = parseInt(value);
    setCurrentStep(stepIndex);
  };

  const completionPercentage = (Object.keys(completed).length / (steps.length - 1)) * 100;

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen} className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4" />
        Admin-Tutorial starten
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {steps[currentStep].icon}
              {steps[currentStep].title}
            </DialogTitle>
            <DialogDescription>
              {steps[currentStep].description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-2">
            <Progress value={completionPercentage} className="h-2" />
            
            <Tabs value={currentStep.toString()} onValueChange={handleTabChange} className="mt-4">
              <TabsList className="grid grid-cols-5 mb-4">
                {steps.slice(0, steps.length - 1).map((step, index) => (
                  <TabsTrigger 
                    key={index}
                    value={index.toString()} 
                    disabled={!completed[index] && index !== currentStep}
                    className="flex flex-col items-center p-2"
                  >
                    {completed[index] ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      step.icon
                    )}
                    <span className="text-xs mt-1">{`Schritt ${index + 1}`}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {steps.map((step, index) => (
                <TabsContent key={index} value={index.toString()} className="mt-0">
                  <div className="pt-2">
                    {step.content}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <DialogFooter className="mt-4 flex sm:justify-between">
            <div>
              {currentStep < steps.length - 1 && (
                <Button variant="outline" onClick={handleSkip} size="sm">
                  Überspringen
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Zurück
                </Button>
              )}
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Fertig' : 'Weiter'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminTutorial;
