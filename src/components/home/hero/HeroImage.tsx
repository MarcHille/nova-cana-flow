
import React from "react";
import { Clock, ShieldCheck, Sparkles } from "lucide-react";

type HeroImageProps = {
  language: string;
};

const HeroImage: React.FC<HeroImageProps> = ({ language }) => {
  return (
    <div className="w-full lg:w-1/2 mt-16 lg:mt-0 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="relative max-w-lg">
        {/* Decorative background elements */}
        <div className="absolute -inset-4 bg-gradient-to-r from-secondary/30 to-primary/30 dark:from-secondary/20 dark:to-primary/20 rounded-[2rem] blur-xl transform -rotate-6 scale-95"></div>
        
        {/* Main image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-2 hover:shadow-primary/20 transition-all duration-500">
          <img 
            alt={language === 'de' ? "Medizinische Cannabisforschung" : "Medical Cannabis Research"} 
            className="w-full h-auto rounded-3xl object-cover"
            style={{ maxHeight: "500px" }}
            onError={e => {
              console.error("Bild konnte nicht geladen werden:", e);
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/placeholder.svg";
            }} 
            src="https://cdn.prod.website-files.com/6638878d99207e2fa2b8efb6/66e163656a0cea115f3334da_cannabis_apotheke_goeasy.webp" 
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-3xl"></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute -bottom-6 -left-6 p-4 glass-card animate-float">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Clock size={18} />
            </div>
            <span className="text-sm font-medium">Schnelle Lieferung</span>
          </div>
        </div>
        
        <div className="absolute -top-6 -right-6 p-4 glass-card animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck size={18} />
            </div>
            <span className="text-sm font-medium">Zertifizierte Qualität</span>
          </div>
        </div>
        
        <div className="absolute top-1/2 -right-10 transform -translate-y-1/2 animate-float" style={{ animationDelay: "1s" }}>
          <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
            <Sparkles className="h-6 w-6 text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
