
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroContent from "./hero/HeroContent";
import HeroImage from "./hero/HeroImage";
import HeroDecorations from "./hero/HeroDecorations";

const Hero = () => {
  const { language } = useLanguage();
  
  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-b from-white to-purple-50/70 dark:from-gray-900 dark:to-gray-800/70">
      {/* Background decorative elements */}
      <HeroDecorations />

      <div className="container-content relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <HeroContent />
          <HeroImage language={language} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
