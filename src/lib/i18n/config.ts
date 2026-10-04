export const LOCALES = ["pt-BR", "en", "es", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-BR";
export const LOCALE_COOKIE = "etternum_lang";

/** Nome de cada idioma escrito no próprio idioma (para o seletor). */
export const LOCALE_LABELS: Record<Locale, string> = {
  "pt-BR": "Português",
  en: "English",
  es: "Español",
  fr: "Français",
};

/** Locale usado pelo Intl (datas, números). */
export const INTL_LOCALE: Record<Locale, string> = {
  "pt-BR": "pt-BR",
  en: "en-US",
  es: "es",
  fr: "fr-FR",
};

/** Nome do idioma para as instruções dadas ao modelo. */
export const LOCALE_AI_NAMES: Record<Locale, string> = {
  "pt-BR": "português do Brasil",
  en: "inglês (English)",
  es: "espanhol (español)",
  fr: "francês (français)",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Converte uma tag de idioma qualquer (pt-PT, en-GB, es-MX...) no idioma suportado mais próximo. */
export function localeFromTag(tag: string): Locale | null {
  const base = tag.trim().toLowerCase().split(/[-_]/)[0];
  if (base === "pt") return "pt-BR";
  if (base === "en" || base === "es" || base === "fr") return base;
  return null;
}

/** Escolhe o idioma a partir do cabeçalho Accept-Language, respeitando os pesos (q). */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag, q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const locale = localeFromTag(tag);
    if (locale) return locale;
  }
  return DEFAULT_LOCALE;
}
