
import { LanguageContext, LanguageProvider } from './language/LanguageContext';
import { useTranslation } from './language/useTranslation';

// Re-export the hook with the old name for backward compatibility
export const useLanguage = useTranslation;

// Re-export the context and provider
export { LanguageContext, LanguageProvider };
