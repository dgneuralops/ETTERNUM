import type { Locale } from "../config";

export type HelpResource = { name: string; contact: string; detail: string };

/**
 * Linhas de ajuda em crise por idioma. O idioma não indica o país, então cada lista
 * traz os principais países daquele idioma e um diretório internacional.
 */
export const HELP_RESOURCES: Record<Locale, HelpResource[]> = {
  "pt-BR": [
    {
      name: "CVV — Centro de Valorização da Vida",
      contact: "Ligue 188",
      detail: "Gratuito, 24 horas, ou chat em cvv.org.br",
    },
    { name: "SAMU", contact: "Ligue 192", detail: "Emergências médicas" },
    { name: "Polícia", contact: "Ligue 190", detail: "Se você estiver em perigo agora" },
    { name: "Central de Atendimento à Mulher", contact: "Ligue 180", detail: "Violência contra a mulher, 24 horas" },
  ],
  en: [
    { name: "988 Suicide & Crisis Lifeline", contact: "Call or text 988", detail: "US and Canada, free, 24/7" },
    { name: "Samaritans", contact: "Call 116 123", detail: "UK and Ireland, free, 24/7" },
    { name: "Emergency services", contact: "Call 911 or 112", detail: "If you are in danger right now" },
    { name: "Find a helpline", contact: "findahelpline.com", detail: "Free, confidential support in your country" },
  ],
  es: [
    { name: "Línea 024", contact: "Llama al 024", detail: "España, gratuita, 24 horas" },
    { name: "Línea de la Vida", contact: "Llama al 800 911 2000", detail: "México, gratuita, 24 horas" },
    { name: "Emergencias", contact: "Llama al 112 o al 911", detail: "Si estás en peligro ahora" },
    {
      name: "Encuentra una línea de ayuda",
      contact: "findahelpline.com",
      detail: "Apoyo gratuito y confidencial en tu país",
    },
  ],
  fr: [
    {
      name: "Numéro national de prévention du suicide",
      contact: "Appelez le 3114",
      detail: "France, gratuit, 24 h/24",
    },
    {
      name: "Centre de Prévention du Suicide",
      contact: "Appelez le 0800 32 123",
      detail: "Belgique, gratuit, 24 h/24",
    },
    { name: "La Main Tendue", contact: "Appelez le 143", detail: "Suisse, 24 h/24" },
    { name: "Urgences", contact: "Appelez le 112", detail: "Si vous êtes en danger maintenant" },
    { name: "Trouver une ligne d'écoute", contact: "findahelpline.com", detail: "Canada (988) et autres pays" },
  ],
};

/** Texto curto com as linhas de ajuda, para o protocolo de segurança do modelo. */
export function crisisLinesForPrompt(locale: Locale): string {
  return HELP_RESOURCES[locale].map((r) => `${r.name}: ${r.contact} (${r.detail})`).join("; ");
}
