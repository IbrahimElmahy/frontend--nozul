import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKey, translations as translationsData } from '../translations';

type Language = 'ar' | 'en' | 'ur';

type TranslationDataObject = typeof translationsData.ar;

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey, ...args: any[]) => string;
    translationData: TranslationDataObject;
}

export const LanguageContext = createContext<LanguageContextType>({
    language: 'ar',
    setLanguage: () => { },
    t: () => '',
    translationData: translationsData.ar,
});

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('ar');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en' || savedLanguage === 'ur')) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: TranslationKey, ...args: any[]): string => {
        const keyParts = key.split('.');
        // FIX: By typing `translation` as `any`, we allow dynamic property access.
        // This resolves an issue where TypeScript would incorrectly infer the type as `never`
        // within the string check, and allows removal of the `@ts-ignore`.
        let translation: any = translations[language];

        try {
            for (const part of keyParts) {
                translation = translation[part];
            }
            if (typeof translation === 'string') {
                // Basic interpolation
                return translation.replace(/\{(\d+)\}/g, (match, index) => {
                    return typeof args[index] !== 'undefined' ? args[index] : match;
                });
            }
        } catch (e) {
            console.warn(`Translation for key "${key}" not found.`);
            return key; // Return the key if translation is not found
        }

        return key;
    };


    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, translationData: translationsData[language] as TranslationDataObject }}>
            {children}
        </LanguageContext.Provider>
    );
};