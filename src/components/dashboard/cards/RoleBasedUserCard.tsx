
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "@/hooks/useAuthentication";
import { User } from "lucide-react";

const RoleBasedUserCard = () => {
  const navigate = useNavigate();
  const { isAdmin, isPharmacist, isVerifiedPharmacist } = useAuthentication();

  // Determine card content based on user role
  let cardTitle = "Benutzerprofil";
  let cardDescription = "Verwalten Sie Ihr Benutzerprofil";
  let cardColor = "text-gray-600";
  let buttonColor = "bg-gray-600 hover:bg-gray-700";
  let buttonOutlineColor = "border-gray-600 text-gray-700 hover:bg-gray-50";
  let buttonText = "Zum Profil";
  let targetRoute = "/profile";

  if (isAdmin) {
    cardTitle = "Administration";
    cardDescription = "Zum Administrationsbereich";
    cardColor = "text-purple-600 dark:text-purple-400";
    buttonColor = "bg-purple-600 hover:bg-purple-700";
    buttonOutlineColor = "border-purple-600 text-purple-700 hover:bg-purple-50";
    buttonText = "Zur Administration";
    targetRoute = "/admin";
  } else if (isPharmacist) {
    if (isVerifiedPharmacist) {
      cardTitle = "Apotheker";
      cardDescription = "Verwalten Sie Ihre Apothekendetails";
      cardColor = "text-blue-600 dark:text-blue-400";
      buttonColor = "bg-blue-600 hover:bg-blue-700";
      buttonOutlineColor = "border-blue-600 text-blue-700 hover:bg-blue-50";
      buttonText = "Zur Apothekerverwaltung";
      targetRoute = "/pharmacy-management"; // This is the correct route
    } else {
      cardTitle = "Verifizierung";
      cardDescription = "Schließen Sie Ihre Apothekenverifizierung ab";
      cardColor = "text-amber-600 dark:text-amber-400";
      buttonColor = "bg-amber-600 hover:bg-amber-700";
      buttonOutlineColor = "border-amber-600 text-amber-700 hover:bg-amber-50";
      buttonText = "Zur Verifizierung";
      targetRoute = "/dashboard"; // Keep on dashboard where verification widget is shown
    }
  }

  const handleNavigation = () => {
    console.log("Navigating to:", targetRoute);
    navigate(targetRoute);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{cardTitle}</CardTitle>
          <User className={cardColor} size={24} />
        </div>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <Button 
          onClick={handleNavigation} 
          className={`w-full text-white ${buttonColor}`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleBasedUserCard;
