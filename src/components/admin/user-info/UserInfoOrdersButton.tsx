
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserInfoOrdersButtonProps {
  userId: string;
}

export const UserInfoOrdersButton: React.FC<UserInfoOrdersButtonProps> = ({
  userId
}) => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate(`/admin/orders?userId=${userId}`);
  };

  return (
    <div className="mt-4">
      <Button 
        variant="outline"
        onClick={handleViewOrders}
        className="flex items-center gap-2 w-full"
      >
        <ShoppingBag className="h-4 w-4" />
        Bestellungen anzeigen
      </Button>
    </div>
  );
};
