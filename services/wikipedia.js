import { translations, quotesDb } from "../locales/index.js";

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

// Wikipedia & Dynamic Content System
let wikiFeaturedCache = {};
let wikiOnThisDayCache = {};
let wikiTopReadIndex = 0;
let wikiNewsIndex = 0;
let wikiOnThisDayIndex = 0;
let currentQuoteData = null;

export function formatViewsCount(num) {
  if (!num) return '';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export async function loadWikipediaContent() {
  const quoteWidget = document.getElementById('quote-widget');
  if (!quoteWidget) return;

  if (wikiContext.state.settings.showWikipedia === false) {
    quoteWidget.classList.add('hidden');
    return;
  }
  quoteWidget.classList.remove('hidden');

  const type = wikiContext.state.settings.wikipediaType || 'news';
  const lang = wikiContext.state.lang === 'es' ? 'es' : 'en';
  const dict = translations[wikiContext.state.lang] || translations.en;
  const container = quoteWidget.querySelector('.quote-container');
  if (!container) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  if (type === 'quote') {
    renderQuoteMode();
  } else if (type === 'topread') {
    await renderTopReadMode();
  } else if (type === 'news') {
    await renderNewsMode();
  } else if (type === 'onthisday') {
    await renderOnThisDayMode();
  }

  function renderQuoteMode() {
    if (currentQuoteData) {
      displayQuote(currentQuoteData.text, currentQuoteData.author);
      return;
    }
    container.innerHTML = `<span class="quote-text">${dict['quote-loading']}</span>`;
    fetch('https://dummyjson.com/quotes/random')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (wikiContext.state.lang === 'es') {
          useLocalQuote();
        } else {
          currentQuoteData = { text: data.quote, author: data.author };
          displayQuote(currentQuoteData.text, currentQuoteData.author);
        }
      })
      .catch(() => {
        useLocalQuote();
      });

    function useLocalQuote() {
      const list = quotesDb[wikiContext.state.lang] || quotesDb['en'];
      const item = list[Math.floor(Math.random() * list.length)];
      currentQuoteData = { text: item.text, author: item.author };
      displayQuote(item.text, item.author);
    }
  }

  function displayQuote(text, author) {
    const cleanAuthor = author ? author.replace(/^[\s–—-]+/, '').trim() : '';
    const wikiLang = wikiContext.state.lang === 'es' ? 'es' : 'en';
    const authorUrl = cleanAuthor ? `https://${wikiLang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(cleanAuthor)}` : '';
    const authorTitle = wikiContext.state.lang === 'es' ? `Ver ${cleanAuthor} en Wikipedia` : `View ${cleanAuthor} on Wikipedia`;
    const badgeTooltip = wikiContext.state.lang === 'es' ? 'Cambiar contenido en Configuración' : 'Change content in Settings';
    
    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z"/></svg>
        ${dict['wiki-badge-quote'] || 'Quote'}
      </span>
      <div class="wiki-nav-controls">
        <button id="copy-quote-btn" class="wiki-nav-btn copy-quote-btn" title="Copy quote" aria-label="Copy quote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
        <button id="refresh-quote-btn" class="wiki-nav-btn" title="${dict['wiki-refresh'] || 'Shuffle'}" aria-label="Shuffle quote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      </div>
      <span class="quote-text">"${toSentenceCase(text)}"</span>
      ${cleanAuthor ? `<span class="quote-sep"> – </span><a class="quote-author wiki-link" href="${authorUrl}" target="_blank" rel="noopener noreferrer" title="${authorTitle}">${cleanAuthor}</a>` : ''}
    `;

    const copyBtn = container.querySelector('#copy-quote-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const textToCopy = cleanAuthor ? `"${text}" – ${cleanAuthor}` : `"${text}"`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalSVG = copyBtn.innerHTML;
          copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.innerHTML = originalSVG;
            copyBtn.classList.remove('copied');
          }, 2000);
        });
      });
    }

    const refreshBtn = container.querySelector('#refresh-quote-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        currentQuoteData = null;
        renderQuoteMode();
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
    container.innerHTML = `<span class="quote-text">${dict['wiki-loading']}</span>`;
    let data = await fetchFeaturedFeed(lang);
    if (!data || !data.mostread || !data.mostread.articles || data.mostread.articles.length === 0) {
      if (lang !== 'en') {
        data = await fetchFeaturedFeed('en');
      }
    }

    if (!data || !data.mostread || !data.mostread.articles || data.mostread.articles.length === 0) {
      container.innerHTML = `<span class="quote-text">${dict['wiki-error']}</span>`;
      return;
    }

    const articles = data.mostread.articles.filter(a => 
      !a.title.includes('Special:') && 
      !a.title.includes('Wikipedia:') && 
      !a.title.includes('Main_Page') && 
      !a.title.includes('Portada')
    );

    if (articles.length === 0) {
      container.innerHTML = `<span class="quote-text">${dict['wiki-error']}</span>`;
      return;
    }

    if (wikiTopReadIndex >= articles.length) wikiTopReadIndex = 0;
    if (wikiTopReadIndex < 0) wikiTopReadIndex = articles.length - 1;

    const cur = articles[wikiTopReadIndex];
    const pageUrl = cur.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(cur.title)}`;
    const displayTitle = cur.displaytitle ? cur.displaytitle.replace(/<[^>]+>/g, '') : cur.title.replace(/_/g, ' ');
    const viewsStr = formatViewsCount(cur.views);
    const badgeTooltip = wikiContext.state.lang === 'es' ? 'Cambiar contenido en Configuración' : 'Change content in Settings';

    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><path d="M17 6h6v6"></path></svg>
        ${dict['wiki-badge-topread'] || 'Top Read'} #${wikiTopReadIndex + 1}
      </span>
      <div class="wiki-nav-controls">
        <button id="wiki-prev-btn" class="wiki-nav-btn" title="${dict['wiki-prev']}" aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="wiki-next-btn" class="wiki-nav-btn" title="${dict['wiki-next']}" aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <a class="wiki-link" href="${pageUrl}" target="_blank" rel="noopener noreferrer" title="${cur.extract || displayTitle}">${displayTitle}</a>
      ${viewsStr ? `<span class="wiki-views-badge">👁️ ${viewsStr} ${dict['wiki-views']}</span>` : ''}
    `;

    container.querySelector('#wiki-prev-btn')?.addEventListener('click', () => {
      wikiTopReadIndex--;
      renderTopReadMode();
    });
    container.querySelector('#wiki-next-btn')?.addEventListener('click', () => {
      wikiTopReadIndex++;
      renderTopReadMode();
    });
  }

  function formatNewsHtml(cur, feedLang) {
    let rawHtml = cur.story || '';
    const linksMap = new Map();

    if (Array.isArray(cur.links)) {
      cur.links.forEach(item => {
        const title = item.title ? item.title.replace(/_/g, ' ') : '';
        const url = item.content_urls?.desktop?.page || `https://${feedLang}.wikipedia.org/wiki/${encodeURIComponent(item.title || title)}`;
        if (title) {
          linksMap.set(title.toLowerCase(), { title, url, extract: item.extract || '' });
        }
        if (item.displaytitle) {
          const cleanDisplay = item.displaytitle.replace(/<[^>]+>/g, '');
          linksMap.set(cleanDisplay.toLowerCase(), { title: cleanDisplay, url, extract: item.extract || '' });
        }
      });
    }

    const temp = document.createElement('div');
    temp.innerHTML = rawHtml;

    // Convert existing <a> tags into working Wikipedia / Google search links
    const aTags = temp.querySelectorAll('a');
    if (aTags.length > 0) {
      aTags.forEach(a => {
        a.className = 'wiki-link';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        const text = a.textContent.trim();
        let href = a.getAttribute('href') || '';
        const matched = linksMap.get(text.toLowerCase());

        if (matched) {
          a.href = matched.url;
          if (matched.extract) a.title = matched.extract;
        } else if (href.startsWith('/wiki/') || href.startsWith('./')) {
          const rawTitle = href.replace(/^(\/wiki\/|\.\/)/, '');
          a.href = `https://${feedLang}.wikipedia.org/wiki/${rawTitle}`;
        } else if (href.startsWith('http')) {
          a.href = href;
        } else if (text) {
          a.href = `https://${feedLang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(text)}`;
        } else {
          a.href = `https://www.google.com/search?q=${encodeURIComponent(cur.story?.replace(/<[^>]+>/g, '') || '')}`;
        }
      });
    }

    // Convert bold <b> / <strong> tags to clickable links if they correspond to articles
    const bTags = temp.querySelectorAll('b, strong');
    bTags.forEach(b => {
      if (b.closest('a')) return;
      const text = b.textContent.trim();
      const matched = linksMap.get(text.toLowerCase());
      const a = document.createElement('a');
      a.className = 'wiki-link';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = b.innerHTML;

      if (matched) {
        a.href = matched.url;
        if (matched.extract) a.title = matched.extract;
      } else if (text) {
        a.href = `https://${feedLang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(text)}`;
      } else {
        a.href = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
      }
      b.replaceWith(a);
    });

    let resultHtml = temp.innerHTML;

    // Check if there are any clickable links in the rendered output
    if (!resultHtml.includes('<a class="wiki-link"')) {
      const cleanStory = cur.story ? cur.story.replace(/<[^>]+>/g, '').trim() : '';
      if (cleanStory) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanStory)}`;
        resultHtml = `<a class="wiki-link" href="${searchUrl}" target="_blank" rel="noopener noreferrer" title="Buscar en Google">${resultHtml}</a>`;
      }
    }

    // Append extra article links from cur.links if they were not already mentioned in the text
    if (Array.isArray(cur.links)) {
      cur.links.forEach(item => {
        const title = item.displaytitle ? item.displaytitle.replace(/<[^>]+>/g, '') : (item.title ? item.title.replace(/_/g, ' ') : '');
        const url = item.content_urls?.desktop?.page || `https://${feedLang}.wikipedia.org/wiki/${encodeURIComponent(item.title || title)}`;
        if (title && !resultHtml.includes(url) && !resultHtml.toLowerCase().includes(title.toLowerCase())) {
          resultHtml += ` <a class="wiki-link" href="${url}" target="_blank" rel="noopener noreferrer" title="${item.extract || title}">↗ ${title}</a>`;
        }
      });
    }

    return resultHtml;
  }

  async function renderNewsMode() {
    container.innerHTML = `<span class="quote-text">${dict['wiki-loading']}</span>`;
    let data = await fetchFeaturedFeed(lang);
    if (!data || !data.news || data.news.length === 0) {
      if (lang !== 'en') {
        data = await fetchFeaturedFeed('en');
      }
    }

    if (!data || !data.news || data.news.length === 0) {
      container.innerHTML = `<span class="quote-text">${dict['wiki-error']}</span>`;
      return;
    }

    const newsItems = data.news;
    if (wikiNewsIndex >= newsItems.length) wikiNewsIndex = 0;
    if (wikiNewsIndex < 0) wikiNewsIndex = newsItems.length - 1;

    const cur = newsItems[wikiNewsIndex];
    const storyHtml = formatNewsHtml(cur, lang);
    const badgeTooltip = wikiContext.state.lang === 'es' ? 'Cambiar contenido en Configuración' : 'Change content in Settings';

    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>
        ${dict['wiki-badge-news'] || 'In the News'}
      </span>
      <div class="wiki-nav-controls">
        <button id="wiki-prev-btn" class="wiki-nav-btn" title="${dict['wiki-prev']}" aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="wiki-next-btn" class="wiki-nav-btn" title="${dict['wiki-next']}" aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <span>${storyHtml}</span>
    `;

    container.querySelector('#wiki-prev-btn')?.addEventListener('click', () => {
      wikiNewsIndex--;
      renderNewsMode();
    });
    container.querySelector('#wiki-next-btn')?.addEventListener('click', () => {
      wikiNewsIndex++;
      renderNewsMode();
    });
  }

  async function renderOnThisDayMode() {
    container.innerHTML = `<span class="quote-text">${dict['wiki-loading']}</span>`;
    const cacheKey = `${lang}-${month}-${day}`;
    let events = wikiOnThisDayCache[cacheKey];

    if (!events) {
      try {
        const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`);
        if (res.ok) {
          const resData = await res.json();
          events = resData.selected || resData.events || [];
        }
      } catch (e) {
        console.warn('Failed to fetch onthisday for', lang, e);
      }

      if ((!events || events.length === 0) && lang !== 'en') {
        try {
          const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`);
          if (res.ok) {
            const resData = await res.json();
            events = resData.selected || resData.events || [];
          }
        } catch (e) {
          console.warn('Failed to fetch English onthisday', e);
        }
      }

      if (events && events.length > 0) {
        wikiOnThisDayCache[cacheKey] = events;
      }
    }

    if (!events || events.length === 0) {
      container.innerHTML = `<span class="quote-text">${dict['wiki-error']}</span>`;
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
    } else if (cur.text) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent((cur.year ? cur.year + ' ' : '') + cur.text)}`;
      pageLinkHtml = ` <a class="wiki-link" href="${searchUrl}" target="_blank" rel="noopener noreferrer" title="Buscar en Google">↗ Google</a>`;
    }

    const badgeTooltip = wikiContext.state.lang === 'es' ? 'Cambiar contenido en Configuración' : 'Change content in Settings';

    container.innerHTML = `
      <span class="wiki-badge" data-tooltip="${badgeTooltip}" onclick="window.openSettingsWikipediaTab()" title="${badgeTooltip}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        ${dict['wiki-badge-onthisday'] || 'On This Day'}
      </span>
      <div class="wiki-nav-controls">
        <button id="wiki-prev-btn" class="wiki-nav-btn" title="${dict['wiki-prev']}" aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="wiki-next-btn" class="wiki-nav-btn" title="${dict['wiki-next']}" aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      ${cur.year ? `<span class="wiki-year-badge">${cur.year}</span>` : ''}
      <span>${cur.text}</span>
      ${pageLinkHtml}
    `;

    container.querySelector('#wiki-prev-btn')?.addEventListener('click', () => {
      wikiOnThisDayIndex--;
      renderOnThisDayMode();
    });
    container.querySelector('#wiki-next-btn')?.addEventListener('click', () => {
      wikiOnThisDayIndex++;
      renderOnThisDayMode();
    });
  }
}

export function loadQuote() {
  loadWikipediaContent();
}