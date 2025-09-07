
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RegisterFormPersonalProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string) => (value: string) => void;
}

const RegisterFormPersonal: React.FC<RegisterFormPersonalProps> = ({
  formData,
  handleChange,
  handleSelectChange,
}) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-base font-medium">{t('register.firstName') || 'Vorname'} *</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <User size={20} />
            </div>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="pl-10 h-12 text-base"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base font-medium">{t('register.lastName') || 'Nachname'} *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="h-12 text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-medium">{t('register.email') || 'E-Mail'} *</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Mail size={20} />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t('register.emailPlaceholder') || "apotheke@beispiel.de"}
            value={formData.email}
            onChange={handleChange}
            className="pl-10 h-12 text-base"
            required
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('register.emailHint') || 'Bitte verwenden Sie Ihre geschäftliche E-Mail-Adresse'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-base font-medium">{t('register.password') || 'Passwort'} *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          className="h-12 text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-base font-medium">{t('register.confirmPassword') || 'Passwort bestätigen'} *</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="h-12 text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-base font-medium">{t('register.role') || 'Ihre Rolle'} *</Label>
        <Select
          value={formData.role}
          onValueChange={handleSelectChange("role")}
        >
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder={t('register.rolePlaceholder') || "Wählen Sie Ihre Rolle"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pharmacist">{t('register.pharmacist') || 'Apotheker'}</SelectItem>
            <SelectItem value="user">{t('register.doctor') || 'Arzt'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default RegisterFormPersonal;
