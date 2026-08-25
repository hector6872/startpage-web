import en from './en.js';
import es from './es.js';
import ca from './ca.js';
import fr from './fr.js';
import de from './de.js';
import it from './it.js';
import pt from './pt.js';
import nl from './nl.js';
import ja from './ja.js';
import zh from './zh.js';
import quotesDb from './quotes.js';

export const translations = {
  en,
  es,
  ca,
  fr,
  de,
  it,
  pt,
  nl,
  ja,
  zh
};

export { quotesDb };

export function getLocale(lang) {
  const localeMap = {
    en: 'en-US',
    es: 'es-ES',
    ca: 'ca-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-PT',
    nl: 'nl-NL',
    ja: 'ja-JP',
    zh: 'zh-CN'
  };
  return localeMap[lang] || 'en-US';
}
