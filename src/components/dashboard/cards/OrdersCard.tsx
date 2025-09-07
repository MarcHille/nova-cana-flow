
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const OrdersCard = () => {
  const navigate = useNavigate();
  const { isPharmacist, isVerifiedPharmacist, isAdmin } = useAuth();

  const handleOrdersClick = () => {
    // Check if user has the required permissions - admins or verified pharmacists
    if (isAdmin || (isPharmacist && isVerifiedPharmacist)) {
      navigate('/orders');
    } else {
      console.log("Access denied - user does not have pharmacist permissions");
    }
  };

  // Show the card if user is admin or verified pharmacist
  if (!isAdmin && (!isPharmacist || !isVerifiedPharmacist)) {
    return null;
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Bestellungen</CardTitle>
          <ShoppingCart className="text-blue-600 dark:text-blue-400" size={24} />
        </div>
        <CardDescription>Verwalten Sie Ihre aktuellen Bestellungen</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Button onClick={handleOrdersClick} className="w-full">
          Bestellungen anzeigen
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrdersCard;
