
import React from "react";

interface RegisterFormProgressProps {
  currentStep: number;
}

const RegisterFormProgress: React.FC<RegisterFormProgressProps> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div 
            className={`w-full h-2 rounded-full ${
              currentStep >= 1 ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        </div>
        <div className="mx-4 text-sm font-medium text-gray-600 dark:text-gray-300">
          Schritt {currentStep} von 2
        </div>
        <div className="flex-1">
          <div 
            className={`w-full h-2 rounded-full ${
              currentStep >= 2 ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterFormProgress;
