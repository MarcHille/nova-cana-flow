
import React from "react";
import LoadingScreen from "./LoadingScreen";

interface AuthLoadingScreenProps {
  message?: string;
}

const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ 
  message = "Authentifizierung wird geprüft..." 
}) => {
  console.log(message);
  return <LoadingScreen />;
};

export default AuthLoadingScreen;
