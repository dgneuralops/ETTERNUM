"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { messagesFor, type Messages } from "./messages";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useI18n(): { locale: Locale; t: Messages } {
  const locale = useContext(LocaleContext);
  return { locale, t: messagesFor(locale) };
}
