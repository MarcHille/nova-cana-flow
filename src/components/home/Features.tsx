
import React from "react";
import { Leaf, Shield, Truck, Award, Clock, FileCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Features = () => {
  const { t } = useLanguage();
  const features = [{
    title: t('features.pharmaceutical'),
    description: t('features.pharmaceutical.desc'),
    icon: Shield,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    delay: 0
  }, {
    title: t('features.delivery'),
    description: t('features.delivery.desc'),
    icon: Truck,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    delay: 0.1
  }, {
    title: t('features.quality'),
    description: t('features.quality.desc'),
    icon: Award,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    delay: 0.2
  }, {
    title: t('features.selection'),
    description: t('features.selection.desc'),
    icon: Leaf,
    color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
    delay: 0.3
  }, {
    title: t('features.support'),
    description: t('features.support.desc'),
    icon: Clock,
    color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    delay: 0.4
  }, {
    title: t('features.documentation'),
    description: t('features.documentation.desc'),
    icon: FileCheck,
    color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    delay: 0.5
  }];
  
  // Funktion zum Scrollen zum Kontaktabschnitt
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section className="py-28 bg-gradient-to-b from-purple-50/70 to-white dark:from-gray-800/70 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/5 blur-3xl"></div>
        <div className="absolute right-1/4 top-0 w-96 h-96 rounded-full bg-secondary/5 dark:bg-secondary/5 blur-3xl"></div>
        
        <div className="absolute -left-16 top-1/3 w-48 h-48 bg-purple-200/10 dark:bg-purple-400/5 rounded-full animate-pulse-soft"></div>
        <div className="absolute right-0 bottom-1/4 w-64 h-64 bg-teal-200/10 dark:bg-teal-400/5 rounded-full animate-pulse-soft" style={{
          animationDelay: '1.5s'
        }}></div>
      </div>

      <div className="container-content relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-md">
            <Sparkles className="text-amber-500 h-6 w-6 animate-pulse" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('features.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="bg-white dark:bg-gray-800/50 rounded-3xl p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/10 animate-fade-in glass-card" 
              style={{
                animationDelay: `${0.1 + feature.delay}s`
              }}
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-3`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
