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

import { state } from '../utils/state.js';

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

export function t(key, params = {}, lang = (typeof state !== 'undefined' && state ? state.lang : 'en')) {
  const currentDict = translations[lang] || translations.en;
  let text = currentDict?.[key] ?? translations.en?.[key] ?? key;

  if (params && typeof params === 'object') {
    for (const [paramKey, paramVal] of Object.entries(params)) {
      text = text.replaceAll(`{${paramKey}}`, paramVal);
    }
  }
  return text;
}

