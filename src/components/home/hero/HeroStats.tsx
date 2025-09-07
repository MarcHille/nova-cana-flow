
import React from "react";
import { ShieldCheck, Clock, Truck } from "lucide-react";

const HeroStats: React.FC = () => {
  return (
    <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center gap-3 glass-card p-4 group hover:bg-primary/5 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300">
          <ShieldCheck size={22} />
        </div>
        <span className="text-sm font-medium">WDA, GDP, MedCanG</span>
      </div>
      <div className="flex items-center gap-3 glass-card p-4 group hover:bg-primary/5 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300">
          <Clock size={22} />
        </div>
        <span className="text-sm font-medium">24h Lieferung</span>
      </div>
      <div className="flex items-center gap-3 glass-card p-4 group hover:bg-primary/5 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300">
          <Truck size={22} />
        </div>
        <span className="text-sm font-medium">Deutschlandweit</span>
      </div>
    </div>
  );
};

export default HeroStats;
