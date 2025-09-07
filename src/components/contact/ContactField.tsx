
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactFieldProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "textarea";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
}

const ContactField: React.FC<ContactFieldProps> = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {type === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={5}
          className="resize-none w-full"
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full"
        />
      )}
    </div>
  );
};

export default ContactField;
