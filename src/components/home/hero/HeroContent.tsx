
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroStats from "./HeroStats";

const HeroContent: React.FC = () => {
  const { t } = useLanguage();
  
  // Function to scroll to the contact section smoothly
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
      <div className="inline-block mb-8 animate-fade-in">
        <img 
          src="/lovable-uploads/66045f1f-4643-4ce0-9479-3d9a29387536.png" 
          alt="Novacana" 
          className="h-28 md:h-32 mx-auto lg:mx-0 transition-all duration-300 hover:scale-105" 
          onError={e => {
            console.error("Logo konnte nicht geladen werden:", e);
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/placeholder.svg";
          }} 
        />
      </div>
      
      <h1 className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{t('hero.title')}</span><br />
        <span className="text-gray-700 dark:text-gray-300 mt-3 block text-2xl md:text-3xl font-normal">{t('hero.subtitle')}</span>
      </h1>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
        {t('hero.description')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <Button 
          size="lg" 
          variant="gradient" 
          rounded="full" 
          className="w-full sm:w-auto hover-lift"
          onClick={scrollToContact}
        >
          {t('hero.cta.contact')}
        </Button>
      </div>
      
      <HeroStats />
    </div>
  );
};

export default HeroContent;
