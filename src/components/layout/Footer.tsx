import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container-content py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Novacana GmbH</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {language === 'de' 
                ? "Pharmazeutischer Großhändler spezialisiert auf medizinische Cannabisprodukte für Apotheken in Deutschland."
                : "Pharmaceutical wholesaler specializing in medical cannabis products for pharmacies throughout Germany."}
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://www.linkedin.com/company/novacanabrand/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-nova-500 dark:text-gray-400 dark:hover:text-nova-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'de' ? 'Navigation' : 'Navigation'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-nova-500 dark:text-gray-400 dark:hover:text-nova-400 transition-colors text-sm"
                >
                  {language === 'de' ? 'Startseite' : 'Home'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-600 hover:text-nova-500 dark:text-gray-400 dark:hover:text-nova-400 transition-colors text-sm"
                >
                  {language === 'de' ? 'Produkte' : 'Products'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 hover:text-nova-500 dark:text-gray-400 dark:hover:text-nova-400 transition-colors text-sm"
                >
                  {language === 'de' ? 'Über uns' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/#contact" 
                  className="text-gray-600 hover:text-nova-500 dark:text-gray-400 dark:hover:text-nova-400 transition-colors text-sm"
                >
                  {language === 'de' ? 'Kontakt' : 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'de' ? 'Rechtliches' : 'Legal'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/imprint" 
                  className="text-gray-600 hover:text-nova-500 dark:text-gray-400 dark:hover:text-nova-400 transition-colors text-sm"
                >
                  {language === 'de' ? 'Impressum' : 'Imprint'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 hover:text-nova-500 dark:text-gray-400 dark:hover:text-nova-400 transition-colors text-sm"
                >
                  {language === 'de' ? 'Datenschutz' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-600 hover:text-nova-500 dark:text-gray-400 dark:hover:text-nova-400 transition-colors text-sm"
                >
                  {language === 'de' ? 'AGB' : 'Terms & Conditions'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'de' ? 'Kontaktieren Sie uns' : 'Contact Us'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mt-0.5 mr-2 text-nova-500 dark:text-nova-400 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Guerickeweg 5, 64291 Darmstadt, Deutschland
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-nova-500 dark:text-nova-400 flex-shrink-0" />
                <a 
                  href="tel:+4969945159180" 
                  className="text-gray-600 hover:text-nova-500 dark:text-gray-400 dark:hover:text-nova-400 transition-colors text-sm"
                >
                  +49 (0) 69 945159 18
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-nova-500 dark:text-nova-400 flex-shrink-0" />
                <a 
                  href="mailto:info@novacana.de" 
                  className="text-gray-600 hover:text-nova-500 dark:text-gray-400 dark:hover:text-nova-400 transition-colors text-sm"
                >
                  info@novacana.de
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Novacana GmbH. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
              {language === 'de' 
                ? "Großhandelserlaubnis Nr. DE-HE-WDA_2019_0077" 
                : "Pharmaceutical wholesale license No. DE-HE-WDA_2019_0077"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
