
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";
import { UserProfileData } from "@/hooks/useUserProfile";

interface ProfileFormProps {
  profile: UserProfileData;
  saving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  saving,
  onInputChange,
  onSave
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input 
          id="email" 
          name="email" 
          value={profile.email} 
          disabled 
          className="bg-gray-50" 
        />
        <p className="text-xs text-gray-500">Die E-Mail-Adresse kann nicht geändert werden.</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={profile.name || ""} 
          onChange={onInputChange} 
          placeholder="Ihr vollständiger Name" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Telefonnummer</Label>
        <Input 
          id="phoneNumber" 
          name="phoneNumber" 
          value={profile.phoneNumber || ""} 
          onChange={onInputChange} 
          placeholder="Ihre Telefonnummer" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pharmacyName">Apothekenname</Label>
        <Input 
          id="pharmacyName" 
          name="pharmacyName" 
          value={profile.pharmacyName || ""} 
          onChange={onInputChange} 
          placeholder="Name Ihrer Apotheke" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input 
          id="address" 
          name="address" 
          value={profile.address || ""} 
          onChange={onInputChange} 
          placeholder="Adresse Ihrer Apotheke" 
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-3">
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Zurücksetzen
        </Button>
        <Button 
          onClick={onSave} 
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          disabled={saving}
        >
          <Save size={16} />
          {saving ? "Speichern..." : "Speichern"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
