
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { UserCog } from "lucide-react";

const ProfileHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between pb-2">
      <div>
        <CardTitle className="text-xl">Mein Profil</CardTitle>
        <CardDescription>
          Verwalten Sie Ihre persönlichen und Apothekendaten
        </CardDescription>
      </div>
      <UserCog className="text-blue-600 dark:text-blue-400" size={24} />
    </div>
  );
};

export default ProfileHeader;
