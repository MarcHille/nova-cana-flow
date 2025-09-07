
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Book, Info, HelpCircle } from "lucide-react";

const Documentation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content">
          <div className="mb-8 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span>Zurück zum Dashboard</span>
            </Button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dokumentation
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Lesen Sie wichtige Informationen und Hilfestellungen zur Nutzung der Plattform.
            </p>
          </div>
          
          <Tabs defaultValue="guidelines" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="guidelines">Richtlinien</TabsTrigger>
              <TabsTrigger value="products">Produktinformationen</TabsTrigger>
              <TabsTrigger value="legal">Rechtliches</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guidelines">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-xl font-semibold mb-3 flex items-center">
                        <FileText className="mr-2 text-nova-600" size={20} />
                        Medizinische Cannabisrichtlinien
                      </h2>
                      <p className="mb-4">
                        Medizinischer Cannabis ist für Patienten mit bestimmten Erkrankungen verfügbar, 
                        wenn konventionelle Behandlungen nicht ausreichend wirksam sind oder zu erheblichen 
                        Nebenwirkungen führen.
                      </p>
                      <h3 className="text-lg font-medium mb-2">Verschreibung</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Die Verschreibung erfolgt durch einen Arzt nach gründlicher Bewertung 
                          des Gesundheitszustands des Patienten.
                        </li>
                        <li>
                          Es muss ein BtM-Rezept verwendet werden, das besondere Sicherheitsmerkmale 
                          und eine begrenzte Gültigkeitsdauer hat.
                        </li>
                        <li>
                          Der Patient muss regelmäßig vom verschreibenden Arzt überwacht werden, 
                          um die Wirksamkeit und mögliche Nebenwirkungen zu beurteilen.
                        </li>
                      </ul>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-medium mb-2">Bestellungen und Lieferungen</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Die Apotheke muss die Echtheit und Gültigkeit des Rezepts überprüfen, 
                          bevor sie Cannabis oder Cannabisprodukte abgibt.
                        </li>
                        <li>
                          Alle Bestellungen und Lieferungen müssen gemäß dem Betäubungsmittelgesetz 
                          (BtMG) dokumentiert werden.
                        </li>
                        <li>
                          Die Lieferung sollte in versiegelten, kindersicheren Behältern erfolgen, 
                          die die Vertraulichkeit des Inhalts wahren.
                        </li>
                      </ul>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-xl font-semibold mb-3 flex items-center">
                        <Book className="mr-2 text-green-600" size={20} />
                        Produktkategorien
                      </h2>
                      <p className="mb-4">
                        Unsere Plattform bietet verschiedene Kategorien von medizinischen Cannabisprodukten an, 
                        die alle strengen Qualitätsstandards entsprechen.
                      </p>
                      
                      <h3 className="text-lg font-medium mb-2">Cannabisblüten</h3>
                      <p className="mb-3">
                        Getrocknete Cannabisblüten mit verschiedenen THC- und CBD-Gehalten zur 
                        Inhalation oder zur Herstellung von Tees.
                      </p>
                      
                      <h3 className="text-lg font-medium mb-2">Cannabisextrakte</h3>
                      <p className="mb-3">
                        Konzentrierte Extrakte mit standardisierten Wirkstoffgehalten zur oralen 
                        Einnahme oder Inhalation.
                      </p>
                      
                      <h3 className="text-lg font-medium mb-2">Fertigarzneimittel</h3>
                      <p className="mb-3">
                        Zugelassene pharmazeutische Spezialitäten auf Cannabisbasis mit definierter 
                        Dosierung und Anwendung.
                      </p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-medium mb-2">Qualitätssicherung</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Alle Produkte sind gemäß den Good Manufacturing Practices (GMP) hergestellt.
                        </li>
                        <li>
                          Regelmäßige Laboranalysen gewährleisten die Einhaltung der deklarierten 
                          Wirkstoffgehalte und Abwesenheit von Kontaminanten.
                        </li>
                        <li>
                          Lückenlose Dokumentation der Herkunft und Verarbeitung (Batch-Verfolgung).
                        </li>
                      </ul>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="legal">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-xl font-semibold mb-3 flex items-center">
                        <Info className="mr-2 text-blue-600" size={20} />
                        Rechtliche Hinweise
                      </h2>
                      <p className="mb-4">
                        Der Umgang mit medizinischem Cannabis unterliegt in Deutschland strengen gesetzlichen 
                        Vorschriften, die Sie als Apotheke beachten müssen.
                      </p>
                      
                      <h3 className="text-lg font-medium mb-2">Gesetzlicher Rahmen</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          <strong>Betäubungsmittelgesetz (BtMG):</strong> Regelt den Umgang mit Cannabis 
                          als Betäubungsmittel. Apotheken benötigen eine Erlaubnis zum Erwerb und zur Abgabe.
                        </li>
                        <li>
                          <strong>Arzneimittelgesetz (AMG):</strong> Regelt die Anforderungen an die Qualität, 
                          Sicherheit und Wirksamkeit von Cannabis als Arzneimittel.
                        </li>
                        <li>
                          <strong>Heilmittelwerbegesetz (HWG):</strong> Begrenzt die Werbung für verschreibungspflichtige 
                          Cannabisprodukte gegenüber Patienten und Öffentlichkeit.
                        </li>
                      </ul>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-medium mb-2">Dokumentationspflichten</h3>
                      <p className="mb-3">
                        Als Apotheke sind Sie verpflichtet, den Erwerb und die Abgabe von medizinischem Cannabis 
                        lückenlos zu dokumentieren:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Führung eines BtM-Buches gemäß §§ 13, 14 BtMG</li>
                        <li>Aufbewahrung der BtM-Rezepte über mindestens drei Jahre</li>
                        <li>Regelmäßige Bestandsprüfungen und Meldungen an die Bundesopiumstelle</li>
                      </ul>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-xl font-semibold mb-3 flex items-center">
                        <HelpCircle className="mr-2 text-purple-600" size={20} />
                        Häufig gestellte Fragen
                      </h2>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-1">Wie bestelle ich Produkte?</h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            Sie können Produkte im Produktkatalog auswählen und in den Warenkorb legen. 
                            Nach Abschluss der Bestellung erhalten Sie eine Bestätigung und können den 
                            Status Ihrer Bestellung im Dashboard verfolgen.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-1">Wie lange dauert die Lieferung?</h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            Die Lieferzeit beträgt in der Regel 1-3 Werktage, abhängig von Ihrem Standort 
                            und der Verfügbarkeit der Produkte. Sobald Ihre Bestellung verschickt wurde, 
                            erhalten Sie eine Trackingnummer.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-1">Was ist bei Qualitätsmängeln zu tun?</h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            Sollten Sie Qualitätsmängel bei einem Produkt feststellen, kontaktieren Sie 
                            bitte umgehend unseren Kundenservice. Wir werden den Fall prüfen und Ihnen 
                            bei berechtigten Reklamationen einen Ersatz oder eine Gutschrift anbieten.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-1">Wie wird die Vertraulichkeit gewahrt?</h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            Wir verwenden diskrete Verpackungen ohne Hinweise auf den Inhalt. Alle Ihre 
                            Daten werden gemäß DSGVO streng vertraulich behandelt und nur für die Abwicklung 
                            Ihrer Bestellungen verwendet.
                          </p>
                        </div>
                      </div>
                    </section>
                    
                    <div className="mt-6 text-center">
                      <p className="mb-4 text-gray-700 dark:text-gray-300">
                        Haben Sie weitere Fragen? Kontaktieren Sie unseren Kundenservice.
                      </p>
                      <Button>Kontakt aufnehmen</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documentation;
