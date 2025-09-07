
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/auth/RegisterForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Register = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content py-8">
          <div className="max-w-md mx-auto">
            <Alert className="mb-6 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700">
              <AlertCircle className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <AlertDescription>
                {t('register.alert') || 'Nur für medizinisches Fachpersonal und Apotheken zugänglich. Bitte registrieren Sie sich mit Ihren beruflichen Daten.'}
              </AlertDescription>
            </Alert>
            
            <div className="mb-8 text-center">
              <img 
                src="/lovable-uploads/66045f1f-4643-4ce0-9479-3d9a29387536.png" 
                alt="Novacana" 
                className="max-h-24 mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
              <RegisterForm />
              
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                {t('register.alreadyAccount') || 'Bereits ein Konto?'}
                <Link 
                  to="/login" 
                  className="font-medium text-black dark:text-white hover:underline ml-1"
                >
                  {t('register.login') || 'Anmelden'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
