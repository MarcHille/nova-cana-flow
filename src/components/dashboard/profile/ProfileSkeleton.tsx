
import React from "react";

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  );
};

export default ProfileSkeleton;
