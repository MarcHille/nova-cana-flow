
import React from "react";

interface TermsSectionProps {
  title: string;
  children: React.ReactNode;
}

const TermsSection = ({ title, children }: TermsSectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mt-8 mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default TermsSection;
