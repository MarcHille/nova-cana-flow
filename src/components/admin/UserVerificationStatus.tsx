
import React, { useState, useEffect } from "react";
import { useVerificationStatus } from "@/hooks/useVerificationStatus";
import {
  PendingVerificationBadge,
  ApprovedVerificationBadge,
  RejectedVerificationBadge,
  InvalidUserBadge,
  LoadingBadge,
  RequestVerificationButton
} from "./verification/VerificationBadges";
import { supabase } from "@/integrations/supabase/client";

interface UserVerificationStatusProps {
  userId: string;
  verificationStatus?: string;
  isPharmacist: boolean;
  onRequestVerification: (userId: string) => Promise<boolean>;
}

const UserVerificationStatus: React.FC<UserVerificationStatusProps> = ({
  userId,
  verificationStatus,
  isPharmacist,
  onRequestVerification,
}) => {
  const [hasSeenVerification, setHasSeenVerification] = useState<boolean>(false);
  
  const {
    currentStatus,
    isLoading,
    isRequesting,
    isValidId,
    handleRequestVerification
  } = useVerificationStatus({
    userId,
    verificationStatus,
    isPharmacist,
    onRequestVerification
  });

  // Check if user has already seen verification message
  useEffect(() => {
    const checkHasSeenVerification = async () => {
      try {
        // Check local storage first for quicker response
        const seen = localStorage.getItem(`verification_seen_${userId}`);
        if (seen === "true") {
          setHasSeenVerification(true);
          return;
        }
        
        // If not in local storage, check database
        if (userId && isValidId) {
          const { data, error } = await supabase
            .from('pharmacy_verification')
            .select('notification_shown')
            .eq('user_id', userId)
            .maybeSingle();
            
          if (!error && data && data.notification_shown) {
            setHasSeenVerification(true);
            localStorage.setItem(`verification_seen_${userId}`, "true");
          } else if (currentStatus === "approved") {
            // Mark as seen if it's approved
            try {
              await supabase
                .from('pharmacy_verification')
                .update({ notification_shown: true })
                .eq('user_id', userId);
              
              localStorage.setItem(`verification_seen_${userId}`, "true");
            } catch (updateError) {
              console.error("Error updating notification status:", updateError);
            }
          }
        }
      } catch (error) {
        console.error("Error checking verification notification status:", error);
      }
    };
    
    if (currentStatus === "approved" && !hasSeenVerification) {
      checkHasSeenVerification();
    }
  }, [userId, currentStatus, isValidId, hasSeenVerification]);

  // Show invalid user state
  if (!isValidId) {
    return (
      <div className="flex items-center gap-2">
        <InvalidUserBadge />
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingBadge />
      </div>
    );
  }

  // Get the appropriate status badge based on currentStatus
  const getStatusBadge = () => {
    // Important fix: If user has pharmacist role, they are considered verified regardless
    if (isPharmacist) {
      return <ApprovedVerificationBadge />;
    }
    
    // Validate verification status against allowed values only
    const validStatus = ["pending", "approved", "rejected"].includes(currentStatus || "") 
      ? currentStatus 
      : "";
    
    switch (validStatus) {
      case "pending":
        return <PendingVerificationBadge />;
      case "approved":
        return <ApprovedVerificationBadge />;
      case "rejected":
        return <RejectedVerificationBadge />;
      default:
        // Default case - show verification request button
        return (
          <RequestVerificationButton 
            userId={userId}
            isRequesting={isRequesting} 
            onRequestVerification={handleRequestVerification} 
          />
        );
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusBadge()}
    </div>
  );
};

export default UserVerificationStatus;
