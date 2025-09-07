
import React from 'react';
import { Button } from "@/components/ui/button";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import RegisterFormProgress from "./RegisterFormProgress";
import RegisterFormPersonal from "./RegisterFormPersonal";
import { useLanguage } from "@/contexts/LanguageContext";

const RegisterForm = () => {
  const {
    isLoading,
    formData,
    handleChange,
    handleSelectChange,
    handleSubmit,
  } = useRegisterForm();

  const { t } = useLanguage();

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('register.title') || 'Konto erstellen'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {t('register.description') || 'Registrieren Sie Ihre Apotheke für den Zugang zu unseren Produkten'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <RegisterFormPersonal
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
        />

        <Button
          type="submit"
          className="w-full h-12 px-8 bg-emerald-600 hover:bg-emerald-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {t('register.processing') || 'Verarbeitung...'}
            </span>
          ) : (
            t('register.button') || 'Registrieren'
          )}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
