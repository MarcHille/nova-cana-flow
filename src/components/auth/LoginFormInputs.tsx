
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LoginFormInputsProps {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordReset: () => void;
}

const LoginFormInputs: React.FC<LoginFormInputsProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onPasswordReset
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="apotheke@beispiel.de"
          value={email}
          onChange={onEmailChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Passwort</Label>
          <button 
            type="button" 
            className="text-xs text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            onClick={onPasswordReset}
          >
            Passwort vergessen?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={onPasswordChange}
          required
        />
      </div>
    </>
  );
};

export default LoginFormInputs;
