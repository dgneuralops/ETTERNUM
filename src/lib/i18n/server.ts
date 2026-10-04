import "server-only";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, negotiateLocale, type Locale } from "./config";
import { messagesFor, type Messages } from "./messages";

/** Idioma da requisição: cookie escolhido pela pessoa → Accept-Language do navegador → padrão. */
export const getLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();
  const chosen = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;
  try {
    const list = await headers();
    return negotiateLocale(list.get("accept-language"));
  } catch {
    return DEFAULT_LOCALE;
  }
});

export async function getMessages(): Promise<Messages> {
  return messagesFor(await getLocale());
}

export async function getI18n(): Promise<{ locale: Locale; t: Messages }> {
  const locale = await getLocale();
  return { locale, t: messagesFor(locale) };
}

/** Idioma escolhido explicitamente pela pessoa (cookie), sem cair no Accept-Language. */
export async function getChosenLocale(): Promise<Locale | null> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : null;
}

/** Guarda o idioma escolhido por um ano. Só pode ser chamado em Server Actions ou Route Handlers. */
export async function setLocaleCookie(locale: Locale) {
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 365 * 24 * 60 * 60,
  });
}
