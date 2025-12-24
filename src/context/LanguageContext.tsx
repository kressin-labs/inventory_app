import React, { createContext, useContext, useState } from 'react';
import type { PropsWithChildren } from 'react';
import en from '../translations/en.json';
import de from '../translations/de.json';

const messages: Record<string, any> = { EN: en, DE: de };

interface LanguageContextType {
    locale: string;
    setLocale: (code: string) => void;
    t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: PropsWithChildren) {
    const [locale, setLocaleState] = useState(localStorage.getItem('app_lang') || 'EN');

    const setLocale = (code: string) => {
        setLocaleState(code);
        localStorage.setItem('app_lang', code);
    };

    const t = (path: string): string => {
        const keys = path.split('.');
        let result = messages[locale];
        for (const key of keys) {
            result = result?.[key];
        }
        return result || path;
    };

    const Provider = LanguageContext.Provider;

    return (
        <Provider value={{ locale, setLocale, t }}>
            {children}
        </Provider>
    );
}

/**
 * useLanguage Hook
 * @param namespace Optional prefix to scope translation keys
 */
export const useLanguage = (namespace?: string) => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");

    const { t, ...rest } = context;

    const scopedT = (path: string) => {
        return namespace ? t(`${namespace}.${path}`) : t(path);
    };

    return { ...rest, t: scopedT };
};