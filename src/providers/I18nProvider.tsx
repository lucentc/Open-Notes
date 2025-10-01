"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import en from "@/locales/en.json";
import id from "@/locales/id.json";

type Locale = "en" | "id";
interface Messages {
  [key: string]: string | Messages;
}
interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);
const dictionaries: Record<Locale, Messages> = { en, id };

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const translate = useCallback(
    (key: string): string => {
      function lookup(dict: Messages, segments: string[]): string | undefined {
        let current: string | Messages | undefined = dict;
        for (const segment of segments) {
          if (current && typeof current === "object") {
            current = current[segment];
          } else {
            return undefined;
          }
        }
        return typeof current === "string" ? current : undefined;
      }
      return (
        lookup(dictionaries[locale], key.split(".")) ??
        lookup(dictionaries.en, key.split(".")) ??
        key
      );
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string) => (key === "langCode" ? locale : translate(key)),
    }),
    [locale, translate]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
}