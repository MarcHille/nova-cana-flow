
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const UserListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-[200px]" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border rounded-md">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-[200px]" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
          <Skeleton className="h-4 w-[180px]" />
        </div>
      ))}
    </div>
  );
};

export default UserListSkeleton;
