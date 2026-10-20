export const locales = ['tr', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'tr'

export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
}

/** Her dil için ayrı değer tutan alan (içerik verilerinde kullanılır). */
export type Localized<T = string> = Record<Locale, T>

/** Tarayıcı dili Türkçe ise tr, değilse en (ihracat odaklı site). */
export function detectLocale(): Locale {
  const language = typeof navigator === 'undefined' ? '' : navigator.language.toLowerCase()
  return language.startsWith('tr') ? 'tr' : 'en'
}
