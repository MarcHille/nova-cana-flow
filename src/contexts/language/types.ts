
export type Language = 'de' | 'en';

export type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

export type TranslationRecord = {
  [key: string]: string;
};

export type TranslationsData = {
  [key in Language]: TranslationRecord;
};
