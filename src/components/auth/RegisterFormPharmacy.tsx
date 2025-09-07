
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Building, MapPin, Phone } from "lucide-react";

interface RegisterFormPharmacyProps {
  formData: {
    pharmacyName: string;
    pharmacyId: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (name: string) => (checked: boolean) => void;
}

const RegisterFormPharmacy: React.FC<RegisterFormPharmacyProps> = ({
  formData,
  handleChange,
  handleCheckboxChange,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="pharmacyName" className="text-base font-medium">Name der Apotheke *</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Building size={20} />
          </div>
          <Input
            id="pharmacyName"
            name="pharmacyName"
            value={formData.pharmacyName}
            onChange={handleChange}
            className="pl-10 h-12 text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pharmacyId" className="text-base font-medium">Apotheken-Lizenz ID</Label>
        <Input
          id="pharmacyId"
          name="pharmacyId"
          value={formData.pharmacyId}
          onChange={handleChange}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-base font-medium">Adresse *</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <MapPin size={20} />
          </div>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="pl-10 h-12 text-base"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-base font-medium">PLZ *</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="h-12 text-base"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-base font-medium">Stadt *</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="h-12 text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-base font-medium">Telefon *</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Phone size={20} />
          </div>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="pl-10 h-12 text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeTerms"
            checked={formData.agreeTerms}
            onCheckedChange={handleCheckboxChange("agreeTerms")}
            className="mt-1"
          />
          <Label
            htmlFor="agreeTerms"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Ich akzeptiere die{" "}
            <Link
              to="/terms"
              className="text-nova-600 dark:text-nova-400 hover:underline"
            >
              Nutzungsbedingungen
            </Link>
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreePrivacy"
            checked={formData.agreePrivacy}
            onCheckedChange={handleCheckboxChange("agreePrivacy")}
            className="mt-1"
          />
          <Label
            htmlFor="agreePrivacy"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Ich akzeptiere die{" "}
            <Link
              to="/privacy"
              className="text-nova-600 dark:text-nova-400 hover:underline"
            >
              Datenschutzerklärung
            </Link>
          </Label>
        </div>
      </div>
    </>
  );
};

export default RegisterFormPharmacy;
