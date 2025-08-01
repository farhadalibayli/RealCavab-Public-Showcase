// File: app/context/LanguageContext.tsx

'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageType } from '@/app/types/language';

const LanguageContext = createContext<{
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
} | null>(null);

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>('az');
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as LanguageType;
    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (lang: LanguageType) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
};