import { t } from "../locales/index.js";

export const wikiContext = {
  state: null
};

export function setupWikiContext(context) {
  Object.assign(wikiContext, context);
}

export function toSentenceCase(str) {
  if (!str) return '';
  const lower = str.toLowerCase();
  return lower.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, separator, char) => separator + char.toUpperCase());
}

function decodeHtml(html) {
  if (!html) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export async function fetchWikiquoteOfTheDay(lang) {
  const now = new Date();
  const d = now.getDate();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  const yyyy = now.getFullYear();

  const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthsFr = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const monthsIt = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  const monthsPt = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const monthsCa = ["de gener", "de febrer", "de març", "d\x27abril", "de maig", "de juny", "de juliol", "d\x27agost", "de setembre", "d\x27octubre", "de novembre", "de desembre"];

  let page = "";
  if (lang === "es") page = `Plantilla:${mm}${dd}`;
  else if (lang === "en") page = `Wikiquote:Quote_of_the_day/${monthsEn[now.getMonth()]}_${d},_${yyyy}`;
  else if (lang === "fr") page = `Modèle:Citation_du_jour/${d}_${monthsFr[now.getMonth()]}_${yyyy}`;
  else if (lang === "it") page = `Template:Qotd/${d}${monthsIt[now.getMonth()]}`;
  else if (lang === "pt") page = `Predefinição:Frase_do_dia/${d}_de_${monthsPt[now.getMonth()]}`;
  else if (lang === "ca") page = `Plantilla:${d}_${monthsCa[now.getMonth()]}`;
  else if (lang === "zh") page = `Wikiquote:每日名言/${now.getMonth() + 1}月${d}日`;
  else if (lang === "ja") page = "テンプレート:Today";
  else if (lang === "nl") page = "Sjabloon:Quotevdmaand";
  else if (lang === "de") page = "Hauptseite";
  else page = "Main Page";

  try {
    const res = await fetch(`https://${lang}.wikiquote.org/w/api.php?action=parse&page=${encodeURIComponent(page)}&redirects=1&format=json&prop=text&origin=*`, {
      headers: { "Api-User-Agent": "StartpageDashboard/1.0" }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error || !data.parse?.text?.["*"]) return null;
    
    const doc = data.parse.text["*"]
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "");

    let text = null;
    let author = null;

    if (lang === "es") {
      const qMatch = doc.match(/<td width="100%"[^>]*>([\s\S]*?)<\/td>/i);
      const aMatch = doc.match(/<div style="text-align:right"[^>]*>[\s\S]*?<a [^>]*>([^<]+)<\/a>/i);
      if (qMatch) text = qMatch[1].replace(/<[^>]+>/g, "").replace(/^«\s*/, "").replace(/\s*»$/, "").trim();
      if (aMatch) author = aMatch[1].trim();
    } else if (lang === "en") {
      const qMatch = doc.match(/class="cquote"[^>]*>[\s\S]*?<td valign="top"[^>]*>([\s\S]*?)<\/td>/i);
      const aMatch = doc.match(/<cite[^>]*>[\s\S]*?<a [^>]*>([^<]+)<\/a>/i) || doc.match(/<cite[^>]*>([\s\S]*?)<\/cite>/i);
      if (qMatch) text = qMatch[1].replace(/<[^>]+>/g, "").trim();
      if (aMatch) author = aMatch[1].replace(/<[^>]+>/g, "").replace(/^—\s*/, "").trim();
    } else if (lang === "fr") {
      const qMatch = doc.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i) || doc.match(/class="citation"[^>]*>([\s\S]*?)<\/(?:p|div|span)>/i) || doc.match(/«([\s\S]*?)»/i);
      const aMatch = doc.match(/class="auteur"[^>]*>([\s\S]*?)<\/(?:p|div|span)>/i) || doc.match(/<a [^>]*title="([^"]+)"/i);
      if (qMatch) text = qMatch[1].replace(/<[^>]+>/g, "").replace(/^«\s*/, "").replace(/\s*»$/, "").trim();
      if (aMatch) author = aMatch[1].replace(/<[^>]+>/g, "").replace(/^—\s*/, "").trim();
    } else if (lang === "it") {
      const qMatch = doc.match(/«([\s\S]*?)»/i) || doc.match(/<i>([\s\S]*?)<\/i>/i);
      const aMatch = doc.match(/<a [^>]*title="([^"]+)"/i);
      if (qMatch) text = qMatch[1].replace(/<[^>]+>/g, "").trim();
      if (aMatch) author = aMatch[1].trim();
    } else if (lang === "ca") {
      const qMatch = doc.match(/<td style="font-size: 1\.2em;[^>]*>([\s\S]*?)<\/td>/i) || doc.match(/«([\s\S]*?)»/i);
      const aMatch = doc.match(/<div style="text-align: right;[^>]*>[\s\S]*?<a [^>]*>([^<]+)<\/a>/i) || doc.match(/<a [^>]*title="([^"]+)"/i);
      if (qMatch) text = qMatch[1].replace(/<[^>]+>/g, "").replace(/^«\s*/, "").replace(/\s*»$/, "").trim();
      if (aMatch) author = aMatch[1].trim();
    } else if (lang === "de") {
      const qMatch = doc.match(/<td style="padding: \.5em 1em; text-align: center;">([\s\S]*?)<\/td>/i);
      const aMatch = doc.match(/<td colspan="3"[^>]*>[\s\S]*?<a [^>]*>([^<]+)<\/a>/i);
      if (qMatch) text = qMatch[1].replace(/<[^>]+>/g, "").trim();
      if (aMatch) author = aMatch[1].trim();
    } else if (lang === "pt") {
      const qMatch = doc.match(/<p><b>([\s\S]*?)<\/b>/i) || doc.match(/<b>([\s\S]*?)<\/b>/i);
      const aMatch = doc.match(/<\/b>\s*-\s*<a [^>]*title="([^"]+)"/i) || doc.match(/<a [^>]*title="([^"]+)"/i);
      if (qMatch) text = qMatch[1].replace(/<[^>]+>/g, "").replace(/^["“«]\s*/, "").replace(/\s*["”»]$/, "").trim();
      if (aMatch) author = aMatch[1].trim();
    } else if (lang === "nl") {
      const qMatch = doc.match(/„([\s\S]*?)”/i) || doc.match(/“([\s\S]*?)”/i);
      const aMatch = doc.match(/<a [^>]*title="([^"]+)"/i);
      if (qMatch) text = qMatch[1].replace(/<[^>]+>/g, "").trim();
      if (aMatch) author = aMatch[1].trim();
    } else if (lang === "zh") {
      const clean = doc.replace(/<[^>]+>/g, "");
      const parts = clean.split("——");
      if (parts.length >= 2) {
        text = parts[0].trim();
        author = parts[1].trim();
      }
    } else if (lang === "ja") {
      const clean = doc.replace(/<[^>]+>/g, "");
      const parts = clean.split("--");
      if (parts.length >= 2) {
        text = parts[0].trim();
        author = parts[1].trim();
      }
    }

    if (!text) {
      const qMatch = doc.match(/«([\s\S]*?)»/i) || doc.match(/“([\s\S]*?)”/i) || doc.match(/„([\s\S]*?)”/i) || doc.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
      if (qMatch) text = qMatch[1].replace(/<[^>]+>/g, "").trim();
    }
    if (!author) {
      const aMatch = doc.match(/<cite[^>]*>([\s\S]*?)<\/cite>/i) || doc.match(/<a [^>]*title="([^"]+)"/i);
      if (aMatch) author = aMatch[1].replace(/<[^>]+>/g, "").replace(/^—\s*/, "").trim();
    }

    if (text) {
      return {
        text: decodeHtml(text).replace(/^["“«\s]+|["”»\s]+$/g, '').trim(),
        author: author ? decodeHtml(author).trim() : ''
      };
    }
  } catch (err) {
    console.warn("Failed to fetch quote from Wikiquote:", err);
  }
  return null;
}

// Wikipedia & Dynamic Content System
let wikiFeaturedCache = {};
let wikiOnThisDayCache = {};
let wikiTopReadIndex = 0;
let wikiNewsIndex = 0;
let wikiOnThisDayIndex = 0;
let currentQuoteData = null;
let wikiAutoAdvanceTimer = null;
let isHoveringQuoteWidget = false;

function getTodayDateKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getCachedQuote(lang) {
  try {
    const today = getTodayDateKey();
    const raw = localStorage.getItem(`wikiquote_cache_${lang}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === today && parsed.quote && parsed.quote.text && parsed.quote.text !== 'undefined' && parsed.quote.text.trim() !== '') {
        return parsed.quote;
      }
    }
  } catch (e) {}
  return null;
}

function setCachedQuote(lang, quote) {
  try {
    if (!quote || !quote.text || quote.text === 'undefined' || quote.text.trim() === '') return;
    const today = getTodayDateKey();
    localStorage.setItem(`wikiquote_cache_${lang}`, JSON.stringify({
      date: today,
      quote
    }));
  } catch (e) {}
}

function startAutoAdvance(advanceFn) {
  stopAutoAdvance();
  wikiAutoAdvanceTimer = setInterval(() => {
    if (!isHoveringQuoteWidget) {
      advanceFn();
    }
  }, 8000);
}

function stopAutoAdvance() {
  if (wikiAutoAdvanceTimer) {
    clearInterval(wikiAutoAdvanceTimer);
    wikiAutoAdvanceTimer = null;
  }
}

export function formatViewsCount(num) {
  if (!num) return '';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export async function loadWikipediaContent() {
  const quoteWidget = document.getElementById('quote-widget');
  if (!quoteWidget) return;

  if (!quoteWidget.dataset.hoverBound) {
    quoteWidget.dataset.hoverBound = 'true';
    quoteWidget.addEventListener('mouseenter', () => {
      isHoveringQuoteWidget = true;
    });
    quoteWidget.addEventListener('mouseleave', () => {
      isHoveringQuoteWidget = false;
    });
  }

  if (wikiContext.state.settings.showWikipedia === false) {
    stopAutoAdvance();
    quoteWidget.classList.add('hidden');
    return;
  }
  quoteWidget.classList.remove('hidden');

  const container = quoteWidget.querySelector('.quote-container');
  if (!container) return;

  const type = wikiContext.state.settings.wikipediaType || 'news';
  const lang = wikiContext.state.lang === 'es' ? 'es' : (wikiContext.state.lang || 'en');

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  if (type === 'quote') {
    stopAutoAdvance();
    await renderQuoteMode();
  } else if (type === 'topread') {
    await renderTopReadMode();
  } else if (type === 'news') {
    await renderNewsMode();
  } else if (type === 'onthisday') {
    await renderOnThisDayMode();
  }

  async function renderQuoteMode() {
    const currentLang = wikiContext.state.lang || 'en';

    if (currentQuoteData && currentQuoteData.lang === currentLang && currentQuoteData.text && currentQuoteData.text !== 'undefined') {
      displayQuote(currentQuoteData.text, currentQuoteData.author);
      return;
    }

    const cached = getCachedQuote(currentLang);
    if (cached && cached.text && cached.text !== 'undefined') {
      currentQuoteData = { ...cached, lang: currentLang };
      displayQuote(currentQuoteData.text, currentQuoteData.author);
      return;
    }

    container.innerHTML = `<span class="quote-text">${t('quote-loading')}</span>`;
    
    const quote = await fetchWikiquoteOfTheDay(currentLang);
    if (quote && quote.text && quote.text !== 'undefined' && quote.text.trim() !== '') {
      currentQuoteData = { ...quote, lang: currentLang };
      setCachedQuote(currentLang, quote);
      displayQuote(currentQuoteData.text, currentQuoteData.author);
    } else {
      displayQuoteError();
    }
  }

  function displayQuoteError() {
    const badgeTooltip = t('wiki-badge-tooltip');
    const errorMsg = t('quote-error');
    
    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z"/></svg>
        ${t('wiki-badge-quote')}
      </span>
      <span class="quote-text">${errorMsg}</span>
    `;
  }

  function displayQuote(text, author) {
    if (!text || text === 'undefined' || typeof text !== 'string' || text.trim() === '') {
      displayQuoteError();
      return;
    }

    const cleanAuthor = author && author !== 'undefined' ? author.replace(/^[\s–—-]+/, '').trim() : '';
    const wikiLang = wikiContext.state.lang || 'en';
    const authorUrl = cleanAuthor ? `https://${wikiLang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(cleanAuthor)}` : '';
    const authorTitle = t('wiki-view-author', { author: cleanAuthor });
    const badgeTooltip = t('wiki-badge-tooltip');
    
    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z"/></svg>
        ${t('wiki-badge-quote')}
      </span>
      <div class="wiki-nav-controls">
        <button id="copy-quote-btn" class="wiki-nav-btn copy-quote-btn" title="Copy quote" aria-label="Copy quote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      <span class="quote-text">"${toSentenceCase(text)}"</span>
      ${cleanAuthor ? `<span class="quote-sep"> – </span><a class="quote-author wiki-link" href="${authorUrl}" target="_blank" rel="noopener noreferrer" title="${authorTitle}">${cleanAuthor}</a>` : ''}
    `;

    const copyBtn = container.querySelector('#copy-quote-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const fullText = `"${text}"${cleanAuthor ? ` – ${cleanAuthor}` : ''}`;
        navigator.clipboard.writeText(fullText).then(() => {
          copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #27ae60;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            `;
          }, 2000);
        }).catch(err => {
          console.error('Could not copy quote:', err);
        });
      });
    }
  }

  async function fetchFeaturedFeed(feedLang) {
    const key = `${feedLang}-${year}-${month}-${day}`;
    if (wikiFeaturedCache[key]) return wikiFeaturedCache[key];

    try {
      const res = await fetch(`https://${feedLang}.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${day}`);
      if (res.ok) {
        const data = await res.json();
        wikiFeaturedCache[key] = data;
        return data;
      }
    } catch (e) {
      console.warn('Failed to fetch Wikipedia featured feed for', feedLang, e);
    }
    return null;
  }

  async function renderTopReadMode() {
    container.innerHTML = `<span class="quote-text">${t('wiki-loading')}</span>`;
    let data = await fetchFeaturedFeed(lang);
    if (!data || !data.mostread || !data.mostread.articles || data.mostread.articles.length === 0) {
      if (lang !== 'en') data = await fetchFeaturedFeed('en');
    }

    if (!data || !data.mostread || !data.mostread.articles || data.mostread.articles.length === 0) {
      container.innerHTML = `<span class="quote-text">${t('wiki-error')}</span>`;
      return;
    }

    const articles = data.mostread.articles.filter(a => 
      !a.title.includes('Special:') && !a.title.includes('Wikipedia:') && 
      !a.title.includes('Main_Page') && !a.title.includes('Portada')
    );

    if (articles.length === 0) {
      container.innerHTML = `<span class="quote-text">${t('wiki-error')}</span>`;
      return;
    }

    if (wikiTopReadIndex >= articles.length) wikiTopReadIndex = 0;
    if (wikiTopReadIndex < 0) wikiTopReadIndex = articles.length - 1;

    const cur = articles[wikiTopReadIndex];
    const pageUrl = cur.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(cur.title)}`;
    const displayTitle = cur.displaytitle ? cur.displaytitle.replace(/<[^>]+>/g, '') : cur.title.replace(/_/g, ' ');
    const viewsStr = formatViewsCount(cur.views);
    const badgeTooltip = t('wiki-badge-tooltip');

    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><path d="M17 6h6v6"></path></svg>
        ${t('wiki-badge-topread')} #${wikiTopReadIndex + 1}
      </span>
      <div class="wiki-nav-controls">
        <button id="wiki-prev-btn" class="wiki-nav-btn" title="${t('wiki-prev')}" aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="wiki-next-btn" class="wiki-nav-btn" title="${t('wiki-next')}" aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <a class="wiki-link" href="${pageUrl}" target="_blank" rel="noopener noreferrer" title="${cur.extract || displayTitle}">${displayTitle}</a>
      ${viewsStr ? `<span class="wiki-views-badge">👁️ ${viewsStr} ${t('wiki-views')}</span>` : ''}
    `;

    container.querySelector('#wiki-prev-btn')?.addEventListener('click', () => { wikiTopReadIndex--; renderTopReadMode(); });
    container.querySelector('#wiki-next-btn')?.addEventListener('click', () => { wikiTopReadIndex++; renderTopReadMode(); });

    startAutoAdvance(() => { wikiTopReadIndex++; renderTopReadMode(); });
  }

  function formatNewsHtml(cur, feedLang) {
    let rawHtml = cur.story || '';
    const linksMap = new Map();
    if (Array.isArray(cur.links)) {
      cur.links.forEach(item => {
        const title = item.title ? item.title.replace(/_/g, ' ') : '';
        const url = item.content_urls?.desktop?.page || `https://${feedLang}.wikipedia.org/wiki/${encodeURIComponent(item.title || title)}`;
        if (title) linksMap.set(title.toLowerCase(), { title, url, extract: item.extract || '' });
        if (item.displaytitle) {
          const cleanDisplay = item.displaytitle.replace(/<[^>]+>/g, '');
          linksMap.set(cleanDisplay.toLowerCase(), { title: cleanDisplay, url, extract: item.extract || '' });
        }
      });
    }
    const temp = document.createElement('div');
    temp.innerHTML = rawHtml;
    temp.querySelectorAll('a').forEach(a => {
      a.className = 'wiki-link'; a.target = '_blank'; a.rel = 'noopener noreferrer';
      const text = a.textContent.trim();
      const matched = linksMap.get(text.toLowerCase());
      if (matched) { a.href = matched.url; if (matched.extract) a.title = matched.extract; }
      else if (a.getAttribute('href')?.startsWith('/wiki/')) a.href = `https://${feedLang}.wikipedia.org${a.getAttribute('href')}`;
    });
    temp.querySelectorAll('b, strong').forEach(b => {
      if (b.closest('a')) return;
      const text = b.textContent.trim();
      const matched = linksMap.get(text.toLowerCase());
      if (matched) {
        const a = document.createElement('a'); a.className = 'wiki-link'; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.href = matched.url; a.innerHTML = b.innerHTML; b.replaceWith(a);
      }
    });
    return temp.innerHTML;
  }

  async function renderNewsMode() {
    container.innerHTML = `<span class="quote-text">${t('wiki-loading')}</span>`;
    let data = await fetchFeaturedFeed(lang);
    if (!data || !data.news || data.news.length === 0) {
      if (lang !== 'en') data = await fetchFeaturedFeed('en');
    }
    if (!data || !data.news || data.news.length === 0) {
      container.innerHTML = `<span class="quote-text">${t('wiki-error')}</span>`;
      return;
    }
    if (wikiNewsIndex >= data.news.length) wikiNewsIndex = 0;
    if (wikiNewsIndex < 0) wikiNewsIndex = data.news.length - 1;
    const cur = data.news[wikiNewsIndex];
    const storyHtml = formatNewsHtml(cur, lang);
    const badgeTooltip = t('wiki-badge-tooltip');
    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>
        ${t('wiki-badge-news')}
      </span>
      <div class="wiki-nav-controls">
        <button id="wiki-prev-btn" class="wiki-nav-btn" title="${t('wiki-prev')}" aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="wiki-next-btn" class="wiki-nav-btn" title="${t('wiki-next')}" aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <span>${storyHtml}</span>
    `;
    container.querySelector('#wiki-prev-btn')?.addEventListener('click', () => { wikiNewsIndex--; renderNewsMode(); });
    container.querySelector('#wiki-next-btn')?.addEventListener('click', () => { wikiNewsIndex++; renderNewsMode(); });
    startAutoAdvance(() => { wikiNewsIndex++; renderNewsMode(); });
  }

  async function renderOnThisDayMode() {
    container.innerHTML = `<span class="quote-text">${t('wiki-loading')}</span>`;
    const cacheKey = `${lang}-${month}-${day}`;
    let events = wikiOnThisDayCache[cacheKey];
    if (!events) {
      try {
        const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`);
        if (res.ok) {
          const resData = await res.json();
          events = resData.selected || resData.events || [];
        }
      } catch (e) { console.warn('Failed to fetch onthisday', e); }
      if ((!events || events.length === 0) && lang !== 'en') {
        try {
          const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`);
          if (res.ok) {
            const resData = await res.json();
            events = resData.selected || resData.events || [];
          }
        } catch (e) { console.warn('Failed to fetch English onthisday', e); }
      }
      if (events && events.length > 0) wikiOnThisDayCache[cacheKey] = events;
    }
    if (!events || events.length === 0) {
      container.innerHTML = `<span class="quote-text">${t('wiki-error')}</span>`;
      return;
    }
    if (wikiOnThisDayIndex >= events.length) wikiOnThisDayIndex = 0;
    if (wikiOnThisDayIndex < 0) wikiOnThisDayIndex = events.length - 1;
    const cur = events[wikiOnThisDayIndex];
    let pageLinkHtml = '';
    if (cur.pages && cur.pages.length > 0) {
      cur.pages.slice(0, 3).forEach(p => {
        const pageUrl = p.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(p.title)}`;
        const pageTitle = p.titles?.normalized || p.title.replace(/_/g, ' ');
        pageLinkHtml += ` <a class="wiki-link" href="${pageUrl}" target="_blank" rel="noopener noreferrer" title="${p.extract || pageTitle}">↗ ${pageTitle}</a>`;
      });
    }
    const badgeTooltip = t('wiki-badge-tooltip');
    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        ${t('wiki-badge-onthisday')}
      </span>
      <div class="wiki-nav-controls">
        <button id="wiki-prev-btn" class="wiki-nav-btn" title="${t('wiki-prev')}" aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="wiki-next-btn" class="wiki-nav-btn" title="${t('wiki-next')}" aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      ${cur.year ? `<span class="wiki-year-badge">${cur.year}</span>` : ''}
      <span>${cur.text}</span>
      ${pageLinkHtml}
    `;
    container.querySelector('#wiki-prev-btn')?.addEventListener('click', () => { wikiOnThisDayIndex--; renderOnThisDayMode(); });
    container.querySelector('#wiki-next-btn')?.addEventListener('click', () => { wikiOnThisDayIndex++; renderOnThisDayMode(); });
    startAutoAdvance(() => { wikiOnThisDayIndex++; renderOnThisDayMode(); });
  }
}