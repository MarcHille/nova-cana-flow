
import React from "react";

const HeroDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute -right-20 top-1/4 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl"></div>
      <div className="absolute -left-20 bottom-0 w-96 h-96 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl"></div>
      <div className="absolute left-1/2 top-1/3 w-64 h-64 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-3xl"></div>
      
      {/* Animated blob shapes */}
      <div className="absolute right-1/4 top-1/3 w-64 h-64 bg-teal-300/20 dark:bg-teal-300/10 rounded-full blob animate-pulse-soft"></div>
      <div className="absolute left-1/3 bottom-1/4 w-64 h-64 bg-purple-300/20 dark:bg-purple-300/10 rounded-full blob animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default HeroDecorations;
