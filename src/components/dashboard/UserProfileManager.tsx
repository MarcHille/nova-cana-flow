
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import ProfileSkeleton from "./profile/ProfileSkeleton";
import ProfileForm from "./profile/ProfileForm";
import ProfileHeader from "./profile/ProfileHeader";

const UserProfileManager = () => {
  const { profile, loading, saving, handleInputChange, saveProfile } = useUserProfile();

  return (
    <Card className="mb-6 bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="pb-2">
        <ProfileHeader />
      </CardHeader>
      <CardContent>
        {loading ? (
          <ProfileSkeleton />
        ) : (
          <ProfileForm 
            profile={profile}
            saving={saving}
            onInputChange={handleInputChange}
            onSave={saveProfile}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileManager;
