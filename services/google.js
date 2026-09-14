import { translations, getLocale, t } from "../locales/index.js";
import { getRelativeDateLabel, formatEventTime } from "../utils/helpers.js";

export const googleContext = {
  state: null,
  safeFetch: null,
  escapeHtml: null,
  formatDateShort: null,
  formatEventTime: null,
  getLocalDateString: null,
  getRelativeDateLabel: null
};

export function setupGoogleContext(context) {
  Object.assign(googleContext, context);
}

export let googleTokenClient = null;
export let googleLoginTarget = "personal";

const gisTokenClients = { personal: null, work: null };

export function setGoogleLoginTarget(target) {
  googleLoginTarget = target;
}
export function getGoogleTokenClient(accountType = 'personal') {
  return gisTokenClients[accountType] || googleTokenClient;
}

// Google APIs Integrations (Gmail, Tasks, Calendar)

export async function fetchGoogleUserEmail(token) {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data.email;
    }
  } catch (e) {
    console.error("Failed to fetch user email", e);
  }
  return null;
}

export async function checkAndFetchGoogleEmails() {
  if (!googleContext.state) return;
  let changed = false;
  if (googleContext.state.googlePersonalToken && !googleContext.state.googlePersonalEmail) {
    const email = await fetchGoogleUserEmail(googleContext.state.googlePersonalToken);
    if (email) {
      googleContext.state.googlePersonalEmail = email;
      sessionStorage.setItem('google_personal_email', email);
      changed = true;
    }
  }
  if (googleContext.state.googleWorkToken && !googleContext.state.googleWorkEmail) {
    const email = await fetchGoogleUserEmail(googleContext.state.googleWorkToken);
    if (email) {
      googleContext.state.googleWorkEmail = email;
      sessionStorage.setItem('google_work_email', email);
      changed = true;
    }
  }
  if (changed) {
    updateGoogleAuthStatus();
  }
}

export const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/tasks.readonly https://www.googleapis.com/auth/calendar.readonly';

export function isLocalDevelopment() {
  return typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.localhost')
  );
}

export function storeAccountTokens(accountType, { token, expiresInSec = 3600, refreshToken, email }) {
  if (!googleContext.state) return;
  const expiryTimestamp = Date.now() + (expiresInSec * 1000) - 60000;

  if (accountType === 'personal') {
    googleContext.state.googlePersonalToken = token;
    googleContext.state.googlePersonalExpiry = expiryTimestamp;
    localStorage.setItem('google_personal_token', token);
    localStorage.setItem('google_personal_expiry', String(expiryTimestamp));
    sessionStorage.setItem('google_personal_token', token);
    sessionStorage.setItem('google_personal_expiry', String(expiryTimestamp));
    if (refreshToken) {
      googleContext.state.googlePersonalRefreshToken = refreshToken;
      localStorage.setItem('google_personal_refresh_token', refreshToken);
      sessionStorage.setItem('google_personal_refresh_token', refreshToken);
    }
    if (email) {
      googleContext.state.googlePersonalEmail = email;
      localStorage.setItem('google_personal_email', email);
      sessionStorage.setItem('google_personal_email', email);
    }
  } else {
    googleContext.state.googleWorkToken = token;
    googleContext.state.googleWorkExpiry = expiryTimestamp;
    localStorage.setItem('google_work_token', token);
    localStorage.setItem('google_work_expiry', String(expiryTimestamp));
    sessionStorage.setItem('google_work_token', token);
    sessionStorage.setItem('google_work_expiry', String(expiryTimestamp));
    if (refreshToken) {
      googleContext.state.googleWorkRefreshToken = refreshToken;
      localStorage.setItem('google_work_refresh_token', refreshToken);
      sessionStorage.setItem('google_work_refresh_token', refreshToken);
    }
    if (email) {
      googleContext.state.googleWorkEmail = email;
      localStorage.setItem('google_work_email', email);
      sessionStorage.setItem('google_work_email', email);
    }
  }

  if (googleContext.state.googleErrors) {
    delete googleContext.state.googleErrors[accountType];
  }

  googleContext.state.googleClientToken = googleContext.state.googlePersonalToken || googleContext.state.googleWorkToken;
  localStorage.setItem('google_access_token', googleContext.state.googleClientToken || '');
  sessionStorage.setItem('google_access_token', googleContext.state.googleClientToken || '');

  updateGoogleAuthStatus();
}

export function clearAccountTokens(accountType, fullPurge = false) {
  if (!googleContext.state) return;
  if (accountType === 'personal') {
    googleContext.state.googlePersonalToken = null;
    googleContext.state.googlePersonalExpiry = 0;
    localStorage.removeItem('google_personal_token');
    localStorage.removeItem('google_personal_expiry');
    sessionStorage.removeItem('google_personal_token');
    sessionStorage.removeItem('google_personal_expiry');
    if (fullPurge) {
      googleContext.state.googlePersonalRefreshToken = null;
      googleContext.state.googlePersonalEmail = null;
      localStorage.removeItem('google_personal_refresh_token');
      localStorage.removeItem('google_personal_email');
      sessionStorage.removeItem('google_personal_refresh_token');
      sessionStorage.removeItem('google_personal_email');
    }
  } else {
    googleContext.state.googleWorkToken = null;
    googleContext.state.googleWorkExpiry = 0;
    localStorage.removeItem('google_work_token');
    localStorage.removeItem('google_work_expiry');
    sessionStorage.removeItem('google_work_token');
    sessionStorage.removeItem('google_work_expiry');
    if (fullPurge) {
      googleContext.state.googleWorkRefreshToken = null;
      googleContext.state.googleWorkEmail = null;
      localStorage.removeItem('google_work_refresh_token');
      localStorage.removeItem('google_work_email');
      sessionStorage.removeItem('google_work_refresh_token');
      sessionStorage.removeItem('google_work_email');
    }
  }

  googleContext.state.googleClientToken = googleContext.state.googlePersonalToken || googleContext.state.googleWorkToken;
  localStorage.setItem('google_access_token', googleContext.state.googleClientToken || '');
  sessionStorage.setItem('google_access_token', googleContext.state.googleClientToken || '');
}

export async function requestOAuthToken(params) {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const bodyStr = params.toString();

  // 1. Try direct fetch to Google endpoint first
  try {
    const directRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyStr
    });

    if (directRes.ok) {
      return await directRes.json();
    }

    if (directRes.status >= 400 && directRes.status < 500) {
      const errJson = await directRes.json().catch(() => null);
      if (errJson && errJson.error) {
        return { error: errJson.error, error_description: errJson.error_description, status: directRes.status };
      }
    }
  } catch (err) {
    console.info("Direct OAuth token request not available (CORS/network), trying proxy endpoint...", err.message);
  }

  // 2. Fallback to /api/proxy
  const proxyEndpoint = `/api/proxy?url=${encodeURIComponent(tokenUrl)}`;
  try {
    const proxyRes = await fetch(proxyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyStr
    });

    if (proxyRes.ok) {
      return await proxyRes.json();
    }

    const errJson = await proxyRes.json().catch(() => null);
    return {
      error: errJson?.error || `HTTP ${proxyRes.status}`,
      error_description: errJson?.error_description,
      status: proxyRes.status
    };
  } catch (proxyErr) {
    console.error("Proxy OAuth token request failed:", proxyErr);
    return { error: 'network_error', error_description: proxyErr.message, status: 0 };
  }
}

export async function exchangeGoogleAuthCode(code, targetAccount = 'personal', redirectUri) {
  let clientId = googleContext.state?.settings?.googleClientId;
  let clientSecret = googleContext.state?.settings?.googleClientSecret;

  if (!clientId) {
    try {
      const stored = JSON.parse(localStorage.getItem('dashboard_settings') || '{}');
      clientId = stored.googleClientId;
      clientSecret = stored.googleClientSecret;
      if (googleContext.state?.settings) {
        googleContext.state.settings.googleClientId = clientId;
        googleContext.state.settings.googleClientSecret = clientSecret;
      }
    } catch (e) {}
  }

  if (!clientId) {
    console.error("Missing Google Client ID for token exchange");
    return false;
  }

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret || '',
    redirect_uri: redirectUri || `${window.location.origin}/api/auth/google/callback`,
    grant_type: 'authorization_code'
  });

  const data = await requestOAuthToken(params);

  if (data && data.access_token) {
    const tokenEmail = await fetchGoogleUserEmail(data.access_token);

    // Collision check: verify user didn't accidentally connect the same account to both personal & work
    const otherAccount = (targetAccount === 'personal') ? 'work' : 'personal';
    const otherEmail = (otherAccount === 'personal')
      ? (googleContext.state?.googlePersonalEmail || localStorage.getItem('google_personal_email'))
      : (googleContext.state?.googleWorkEmail || localStorage.getItem('google_work_email'));

    if (tokenEmail && otherEmail && tokenEmail.toLowerCase() === otherEmail.toLowerCase()) {
      const targetLabel = targetAccount === 'personal' ? t('google-personal') : t('google-work');
      const otherLabel = otherAccount === 'personal' ? t('google-personal') : t('google-work');
      alert(t('google-account-collision-warning', { email: tokenEmail, target: otherLabel, expected: targetLabel }));
      return false;
    }

    storeAccountTokens(targetAccount, {
      token: data.access_token,
      expiresInSec: data.expires_in || 3600,
      refreshToken: data.refresh_token,
      email: tokenEmail
    });
    await fetchGoogleData();
    return true;
  }

  console.error("Failed to exchange auth code:", data);
  return false;
}

export function initiateGoogleAuth(targetAccount) {
  setGoogleLoginTarget(targetAccount);
  let clientId = googleContext.state?.settings?.googleClientId;
  let clientSecret = googleContext.state?.settings?.googleClientSecret;

  if (!clientId) {
    try {
      const stored = JSON.parse(localStorage.getItem('dashboard_settings') || '{}');
      clientId = stored.googleClientId;
      clientSecret = stored.googleClientSecret;
      if (googleContext.state?.settings) {
        googleContext.state.settings.googleClientId = clientId;
        googleContext.state.settings.googleClientSecret = clientSecret;
      }
    } catch (e) {}
  }

  if (!clientId) {
    console.error("No Google Client ID provided");
    return false;
  }

  const existingEmail = (targetAccount === 'personal')
    ? (googleContext.state?.googlePersonalEmail || localStorage.getItem('google_personal_email'))
    : (googleContext.state?.googleWorkEmail || localStorage.getItem('google_work_email'));

  // 1. If no clientSecret, use GIS client with account-specific hints
  if (!clientSecret && typeof google !== 'undefined' && google?.accounts?.oauth2) {
    try {
      initGoogleOAuthTokenClient(targetAccount);
      const client = getGoogleTokenClient(targetAccount);
      if (client) {
        const reqOptions = { prompt: 'select_account' };
        if (existingEmail) {
          reqOptions.hint = existingEmail;
        }
        client.requestAccessToken(reqOptions);
        return true;
      }
    } catch (err) {
      console.warn("GIS token client error, falling back to popup window:", err);
    }
  }

  // 2. Production or with clientSecret: standard OAuth popup window with offline refresh token
  const redirectUri = `${window.location.origin}/api/auth/google/callback`;
  const authParams = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPES,
    access_type: 'offline',
    prompt: 'select_account consent',
    state: targetAccount
  };
  if (existingEmail) {
    authParams.login_hint = existingEmail;
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams(authParams).toString();

  const width = 520;
  const height = 650;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  const popup = window.open(
    authUrl,
    `GoogleAuthPopup_${targetAccount}`,
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=1`
  );

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    window.location.href = authUrl;
  }

  return true;
}
if (typeof window !== 'undefined') {
  window.initiateGoogleAuth = initiateGoogleAuth;
}

export function renderGoogleEmptyState(fallbackConfigKey, specificTarget = null) {
  const isPersonalConfigured = !!(googleContext.state?.googlePersonalEmail || localStorage.getItem('google_personal_email') || localStorage.getItem('google_personal_refresh_token'));
  const isWorkConfigured = !!(googleContext.state?.googleWorkEmail || localStorage.getItem('google_work_email') || localStorage.getItem('google_work_refresh_token'));

  if (isPersonalConfigured || isWorkConfigured) {
    if (specificTarget) {
      const email = (specificTarget === 'personal')
        ? (googleContext.state?.googlePersonalEmail || localStorage.getItem('google_personal_email'))
        : (googleContext.state?.googleWorkEmail || localStorage.getItem('google_work_email'));
      const emailStr = email ? ` (${email})` : '';
      const label = specificTarget === 'personal'
        ? (t('google-reconnect-personal') || `${t('google-reconnect')} (${t('google-personal')})`)
        : (t('google-reconnect-work') || `${t('google-reconnect')} (${t('google-work')})`);

      return `
        <div class="empty-msg" style="margin: 0.6rem 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.45rem; text-align: center;">
          <span style="color: var(--text-secondary); font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">
            <span>⚠️</span>
            <span>${t('google-session-expired')}${googleContext.escapeHtml(emailStr)}</span>
          </span>
          <button type="button" class="btn-secondary" onclick="event.preventDefault(); window.initiateGoogleAuth('${specificTarget}');" style="padding: 0.3rem 0.85rem; font-size: 0.8rem; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.35rem;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>${googleContext.escapeHtml(label)}</span>
          </button>
        </div>
      `;
    }

    const expiredTargets = [];
    if (isPersonalConfigured && !googleContext.state?.googlePersonalToken) {
      expiredTargets.push('personal');
    }
    if (isWorkConfigured && !googleContext.state?.googleWorkToken) {
      expiredTargets.push('work');
    }

    if (expiredTargets.length > 0) {
      return `
        <div class="empty-msg" style="margin: 0.6rem 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; text-align: center;">
          <span style="color: var(--text-secondary); font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;">
            <span>⚠️</span>
            <span>${t('google-session-expired')}</span>
          </span>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
            ${expiredTargets.map(tgt => {
              const email = (tgt === 'personal')
                ? (googleContext.state?.googlePersonalEmail || localStorage.getItem('google_personal_email'))
                : (googleContext.state?.googleWorkEmail || localStorage.getItem('google_work_email'));
              const emailStr = email ? ` (${email})` : '';
              const label = tgt === 'personal'
                ? (t('google-reconnect-personal') || `${t('google-reconnect')} (${t('google-personal')})`)
                : (t('google-reconnect-work') || `${t('google-reconnect')} (${t('google-work')})`);
              return `
                <button type="button" class="btn-secondary" onclick="event.preventDefault(); window.initiateGoogleAuth('${tgt}');" title="${googleContext.escapeHtml(emailStr)}" style="padding: 0.3rem 0.85rem; font-size: 0.8rem; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.35rem;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  <span>${googleContext.escapeHtml(label)}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
  }

  const configLinkText = t(fallbackConfigKey);
  return `<p class="empty-msg" style="margin: 0.5rem 0;"><a href="#" onclick="event.preventDefault(); window.openSettingsGoogleTab();" style="color: var(--accent); text-decoration: underline; font-weight: 500;">${configLinkText}</a></p>`;
}

export function handleUrlAuthCodeRedirect() {
  if (typeof window === 'undefined') return;
  const urlParams = new URLSearchParams(window.location.search);
  const codeParam = urlParams.get('google_code') || urlParams.get('code');
  const stateParam = urlParams.get('state') || 'personal';
  if (codeParam) {
    exchangeGoogleAuthCode(codeParam, stateParam).then(() => {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    });
  }
}

// Global listeners for Google OAuth popup messages
if (typeof window !== 'undefined') {
  window.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'GOOGLE_AUTH_CODE') {
      const { code, state, error } = event.data;
      if (error) {
        console.error("Google Auth error from popup:", error);
        return;
      }
      if (code) {
        await exchangeGoogleAuthCode(code, state || 'personal');
      }
    }
  });
}

export function initGoogleOAuthTokenClient(specificAccount = null) {
  const clientId = googleContext.state?.settings?.googleClientId || JSON.parse(localStorage.getItem('dashboard_settings') || '{}').googleClientId;
  if (typeof google === 'undefined' || !google?.accounts?.oauth2 || !clientId) {
    return;
  }

  const targets = specificAccount ? [specificAccount] : ['personal', 'work'];
  for (const acc of targets) {
    if (gisTokenClients[acc]) continue;
    try {
      gisTokenClients[acc] = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GOOGLE_SCOPES,
        callback: async (response) => {
          await handleGisTokenResponse(acc, response);
        }
      });
      if (acc === 'personal') {
        googleTokenClient = gisTokenClients.personal;
      }
    } catch (e) {
      console.warn(`Failed to initialize Google Token Client for ${acc}:`, e);
    }
  }
}

async function handleGisTokenResponse(accountType, response) {
  if (response.error) {
    console.warn(`GIS Token response error for ${accountType}:`, response.error);
    return;
  }

  const token = response.access_token;
  const expiresInSec = response.expires_in || 3600;

  // Always fetch the real email from Google directly
  const tokenEmail = await fetchGoogleUserEmail(token);

  // Collision check: verify user didn't accidentally connect the same account to both personal & work
  const otherAccount = (accountType === 'personal') ? 'work' : 'personal';
  const otherEmail = (otherAccount === 'personal')
    ? (googleContext.state?.googlePersonalEmail || localStorage.getItem('google_personal_email'))
    : (googleContext.state?.googleWorkEmail || localStorage.getItem('google_work_email'));

  if (tokenEmail && otherEmail && tokenEmail.toLowerCase() === otherEmail.toLowerCase()) {
    const targetLabel = accountType === 'personal' ? t('google-personal') : t('google-work');
    const otherLabel = otherAccount === 'personal' ? t('google-personal') : t('google-work');
    alert(t('google-account-collision-warning', { email: tokenEmail, target: otherLabel, expected: targetLabel }));
    return;
  }

  storeAccountTokens(accountType, {
    token,
    expiresInSec,
    email: tokenEmail
  });

  await fetchGoogleData();
}

export async function ensureValidGoogleToken(accountType) {
  if (!googleContext.state) return null;
  const token = accountType === 'personal'
    ? googleContext.state.googlePersonalToken
    : googleContext.state.googleWorkToken;
  const expiry = accountType === 'personal'
    ? (googleContext.state.googlePersonalExpiry || Number(localStorage.getItem('google_personal_expiry') || 0))
    : (googleContext.state.googleWorkExpiry || Number(localStorage.getItem('google_work_expiry') || 0));

  // If token is present and valid for at least 2 more minutes (120,000 ms), use it directly
  const now = Date.now();
  if (token && expiry > now + 120000) {
    return token;
  }

  // If refresh_token exists, perform silent background refresh via HTTP (zero popups)
  const refreshToken = localStorage.getItem(`google_${accountType}_refresh_token`) || sessionStorage.getItem(`google_${accountType}_refresh_token`);
  if (refreshToken) {
    return await refreshGoogleToken(accountType);
  }

  // If no refresh token exists, but access token has not yet reached expiry timestamp, use it
  if (token && expiry > now) {
    return token;
  }

  // Token is expired and has no refresh token.
  // Never attempt GIS silent token in background, as modern browsers block it as an unauthorized popup.
  // Mark session as expired so user can click [ 🔄 Reconectar ] with a genuine user gesture.
  const email = accountType === 'personal' ? googleContext.state.googlePersonalEmail : googleContext.state.googleWorkEmail;
  if (token || email) {
    googleContext.state.googleErrors = googleContext.state.googleErrors || {};
    googleContext.state.googleErrors[accountType] = t('google-session-expired');
    updateGoogleAuthStatus();
  }

  return null;
}

const activeRefreshPromises = { personal: null, work: null };

export function refreshGoogleToken(accountType) {
  if (activeRefreshPromises[accountType]) {
    return activeRefreshPromises[accountType];
  }

  activeRefreshPromises[accountType] = (async () => {
    try {
      const refreshToken = localStorage.getItem(`google_${accountType}_refresh_token`) || sessionStorage.getItem(`google_${accountType}_refresh_token`);
      let clientId = googleContext.state?.settings?.googleClientId;
      let clientSecret = googleContext.state?.settings?.googleClientSecret;

      if (!clientId) {
        try {
          const stored = JSON.parse(localStorage.getItem('dashboard_settings') || '{}');
          clientId = stored.googleClientId;
          clientSecret = stored.googleClientSecret;
          if (googleContext.state?.settings) {
            googleContext.state.settings.googleClientId = clientId;
            googleContext.state.settings.googleClientSecret = clientSecret;
          }
        } catch (e) {}
      }

      // 1. Silent refresh via refresh_token (100% background HTTP request, zero popups)
      if (refreshToken && clientId) {
        const params = new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret || '',
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        });

        const data = await requestOAuthToken(params);

        if (data && data.access_token) {
          storeAccountTokens(accountType, {
            token: data.access_token,
            expiresInSec: data.expires_in || 3600,
            refreshToken: data.refresh_token || refreshToken
          });
          return data.access_token;
        }

        console.warn(`Silent refresh_token failed for ${accountType}:`, data);
        // Only revoke if Google explicitly declared the refresh token invalid/revoked
        if (data?.error === 'invalid_grant' || data?.error === 'invalid_client') {
          clearAccountTokens(accountType, true);
          googleContext.state.googleErrors = googleContext.state.googleErrors || {};
          googleContext.state.googleErrors[accountType] = t('google-session-expired');
          updateGoogleAuthStatus();
          return null;
        }
      }

      // 2. No refresh token or unrecoverable error: do NOT call GIS in the background.
      const currentToken = accountType === 'personal'
        ? googleContext.state?.googlePersonalToken
        : googleContext.state?.googleWorkToken;

      if (!currentToken) {
        googleContext.state.googleErrors = googleContext.state.googleErrors || {};
        googleContext.state.googleErrors[accountType] = t('google-session-expired');
        updateGoogleAuthStatus();
      }

      return currentToken || null;
    } catch (err) {
      console.warn(`Unexpected error during refresh for ${accountType}:`, err);
      return null;
    } finally {
      activeRefreshPromises[accountType] = null;
    }
  })();

  return activeRefreshPromises[accountType];
}

export async function handleInvalidToken(accountType) {
  console.warn(`Token expired or invalid (401) for ${accountType} account.`);
  // Invalidate only the expired access token, keeping refresh token intact
  clearAccountTokens(accountType, false);

  const newToken = await refreshGoogleToken(accountType);
  if (newToken) {
    fetchGoogleData();
    return newToken;
  }

  // If refresh failed, mark session expired
  googleContext.state.googleErrors = googleContext.state.googleErrors || {};
  googleContext.state.googleErrors[accountType] = t('google-session-expired');
  updateGoogleAuthStatus();
  return null;
}

export function handleGoogleLogout(target) {
  if (target === 'personal') {
    if (googleContext.state?.googlePersonalToken && typeof google !== 'undefined' && google?.accounts?.oauth2?.revoke) {
      try {
        google.accounts.oauth2.revoke(googleContext.state.googlePersonalToken, () => {});
      } catch (e) {
        console.warn('Failed to revoke Google personal token', e);
      }
    }
    clearAccountTokens('personal', true);
    if (googleContext.state?.googleErrors) delete googleContext.state.googleErrors.personal;
  } else if (target === 'work') {
    if (googleContext.state?.googleWorkToken && typeof google !== 'undefined' && google?.accounts?.oauth2?.revoke) {
      try {
        google.accounts.oauth2.revoke(googleContext.state.googleWorkToken, () => {});
      } catch (e) {
        console.warn('Failed to revoke Google work token', e);
      }
    }
    clearAccountTokens('work', true);
    if (googleContext.state?.googleErrors) delete googleContext.state.googleErrors.work;
  }

  updateGoogleAuthStatus();
  fetchGoogleCalendar();
  fetchGmail();
  fetchGoogleTasks();
}

export async function initGoogleOAuth() {
  updateGoogleAuthStatus();

  // 1. Process URL auth code redirects if present
  handleUrlAuthCodeRedirect();

  // 2. Initialize GIS Token Client if script is already loaded
  initGoogleOAuthTokenClient();

  // 3. Proactively ensure tokens are valid before initial fetch
  const promises = [];
  const personalConfigured = googleContext.state?.googlePersonalEmail ||
    localStorage.getItem('google_personal_refresh_token') ||
    googleContext.state?.googlePersonalToken;
  if (personalConfigured) {
    promises.push(ensureValidGoogleToken('personal'));
  }

  const workConfigured = googleContext.state?.googleWorkEmail ||
    localStorage.getItem('google_work_refresh_token') ||
    googleContext.state?.googleWorkToken;
  if (workConfigured) {
    promises.push(ensureValidGoogleToken('work'));
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }

  checkAndFetchGoogleEmails();
  updateGoogleAuthStatus();
}

export function updateGoogleAuthStatus() {
  // Personal account status
  const personalStatusEl = document.getElementById('google-auth-status-personal');
  const personalLoginBtn = document.getElementById('google-login-btn-personal');
  const personalLogoutBtn = document.getElementById('google-logout-btn-personal');
  
  if (personalStatusEl && personalLoginBtn && personalLogoutBtn) {
    const isPersonalConfigured = !!(googleContext.state?.googlePersonalEmail || localStorage.getItem('google_personal_email') || localStorage.getItem('google_personal_refresh_token'));
    const email = googleContext.state?.googlePersonalEmail || localStorage.getItem('google_personal_email');
    const emailStr = email ? ` (${email})` : '';

    if (googleContext.state?.googlePersonalToken) {
      personalStatusEl.textContent = `${t('connected')}${emailStr}`;
      personalStatusEl.className = "auth-status connected";
      personalLoginBtn.classList.add('hidden');
      personalLogoutBtn.classList.remove('hidden');
    } else if (googleContext.state?.googleErrors?.personal) {
      personalStatusEl.textContent = `${googleContext.state.googleErrors.personal}${emailStr}`;
      personalStatusEl.className = "auth-status disconnected";
      personalLoginBtn.textContent = t('google-reconnect-personal') || t('google-reconnect');
      personalLoginBtn.classList.remove('hidden');
      personalLogoutBtn.classList.remove('hidden');
    } else if (isPersonalConfigured) {
      personalStatusEl.textContent = `${t('google-session-expired')}${emailStr}`;
      personalStatusEl.className = "auth-status disconnected";
      personalLoginBtn.textContent = t('google-reconnect-personal') || t('google-reconnect');
      personalLoginBtn.classList.remove('hidden');
      personalLogoutBtn.classList.remove('hidden');
    } else {
      personalStatusEl.textContent = t('disconnected');
      personalStatusEl.className = "auth-status disconnected";
      personalLoginBtn.textContent = t('google-login-personal');
      personalLoginBtn.classList.remove('hidden');
      personalLogoutBtn.classList.add('hidden');
    }
  }
  
  // Work account status
  const workStatusEl = document.getElementById('google-auth-status-work');
  const workLoginBtn = document.getElementById('google-login-btn-work');
  const workLogoutBtn = document.getElementById('google-logout-btn-work');
  
  if (workStatusEl && workLoginBtn && workLogoutBtn) {
    const isWorkConfigured = !!(googleContext.state?.googleWorkEmail || localStorage.getItem('google_work_email') || localStorage.getItem('google_work_refresh_token'));
    const email = googleContext.state?.googleWorkEmail || localStorage.getItem('google_work_email');
    const emailStr = email ? ` (${email})` : '';

    if (googleContext.state?.googleWorkToken) {
      workStatusEl.textContent = `${t('connected')}${emailStr}`;
      workStatusEl.className = "auth-status connected";
      workLoginBtn.classList.add('hidden');
      workLogoutBtn.classList.remove('hidden');
    } else if (googleContext.state?.googleErrors?.work) {
      workStatusEl.textContent = `${googleContext.state.googleErrors.work}${emailStr}`;
      workStatusEl.className = "auth-status disconnected";
      workLoginBtn.textContent = t('google-reconnect-work') || t('google-reconnect');
      workLoginBtn.classList.remove('hidden');
      workLogoutBtn.classList.remove('hidden');
    } else if (isWorkConfigured) {
      workStatusEl.textContent = `${t('google-session-expired')}${emailStr}`;
      workStatusEl.className = "auth-status disconnected";
      workLoginBtn.textContent = t('google-reconnect-work') || t('google-reconnect');
      workLoginBtn.classList.remove('hidden');
      workLogoutBtn.classList.remove('hidden');
    } else {
      workStatusEl.textContent = t('disconnected');
      workStatusEl.className = "auth-status disconnected";
      workLoginBtn.textContent = t('google-login-work');
      workLoginBtn.classList.remove('hidden');
      workLogoutBtn.classList.add('hidden');
    }
  }

  // Update header status indicators (dots) for Events, Emails, and Weekly Schedule
  const personalClass = googleContext.state.googlePersonalToken ? 'personal' : 'disconnected';
  const personalTooltip = googleContext.state.googlePersonalToken 
    ? `${t('badge-personal')}: ${t('connected')} (${googleContext.state.googlePersonalEmail || 'Google'})`
    : `${t('badge-personal')}: ${t('disconnected')}`;
    
  const workClass = googleContext.state.googleWorkToken ? 'work' : 'disconnected';
  const workTooltip = googleContext.state.googleWorkToken 
    ? `${t('badge-work')}: ${t('connected')} (${googleContext.state.googleWorkEmail || 'Google'})`
    : `${t('badge-work')}: ${t('disconnected')}`;

  const hasGoogleError = !!(googleContext.state.googleErrors && (googleContext.state.googleErrors.personal || googleContext.state.googleErrors.work || googleContext.state.googleErrors.tasks));
  const googleErrDetail = googleContext.state.googleErrors?.personal || googleContext.state.googleErrors?.work || googleContext.state.googleErrors?.tasks || '';
  const googleWarningTooltip = googleErrDetail || t('google-session-expired');

  const googleWarningIconHTML = `<span class="status-warning-icon" data-tooltip="${googleContext.escapeHtml(googleWarningTooltip)}" onclick="event.stopPropagation(); window.openSettingsGoogleTab();" style="cursor:pointer;">⚠️</span>`;

  const indicatorsHTML = `
    ${hasGoogleError ? googleWarningIconHTML : ''}
    <span class="status-dot ${personalClass}" title="${googleContext.escapeHtml(personalTooltip)}"></span>
    <span class="status-dot ${workClass}" title="${googleContext.escapeHtml(workTooltip)}"></span>
  `;

  const evInd = document.getElementById('google-events-status-indicators');
  const emInd = document.getElementById('google-emails-status-indicators');
  const wkInd = document.getElementById('google-weekly-status-indicators');
  const gtTodayInd = document.getElementById('google-gtasks-today-status-indicators');
  const gtWeekInd = document.getElementById('google-gtasks-week-status-indicators');

  if (evInd) evInd.innerHTML = indicatorsHTML;
  if (emInd) emInd.innerHTML = indicatorsHTML;
  if (wkInd) wkInd.innerHTML = indicatorsHTML;
  if (gtTodayInd) gtTodayInd.innerHTML = indicatorsHTML;
  if (gtWeekInd) gtWeekInd.innerHTML = indicatorsHTML;

  const settingsDotPers = document.getElementById('google-settings-dot-personal');
  const settingsDotWork = document.getElementById('google-settings-dot-work');

  if (settingsDotPers) {
    settingsDotPers.className = `status-dot ${personalClass}`;
  }
  if (settingsDotWork) {
    settingsDotWork.className = `status-dot ${workClass}`;
  }
}

export async function fetchGoogleData() {
  updateGoogleAuthStatus();
  await Promise.all([
    fetchGmail(),
    fetchGoogleTasks(),
    fetchGoogleCalendar()
  ]);
}

export async function fetchGmail() {
  const gmailCard = document.getElementById('gmail-card');
  if (googleContext.state?.settings?.showGoogleEmails === false) {
    if (gmailCard) gmailCard.classList.add('hidden');
    return;
  }
  if (gmailCard) gmailCard.classList.remove('hidden');

  const container = document.getElementById('gmail-container');
  if (!container) return;

  const emailsBadge = document.getElementById('emails-count-badge');
  if (emailsBadge) {
    emailsBadge.classList.add('hidden');
  }

  const personalToken = await ensureValidGoogleToken('personal');
  const workToken = (!googleContext.state?.settings?.oooActive) ? await ensureValidGoogleToken('work') : null;

  if (!personalToken && !workToken) {
    container.innerHTML = renderGoogleEmptyState('google-config-gmail');
    return;
  }

  async function fetchEmailsForAccount(token, type, email) {
    if (!token) return [];
    try {
      const res = await googleContext.safeFetch('https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread%20in:inbox&maxResults=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401) {
          await handleInvalidToken(type);
          throw new Error(t('google-session-expired'));
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.messages || data.messages.length === 0) return [];

      const detailsPromises = data.messages.map(msg =>
        googleContext.safeFetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(async r => {
          if (!r.ok) {
            if (r.status === 401) {
              await handleInvalidToken(type);
              throw new Error(t('google-session-expired'));
            }
            throw new Error(`HTTP ${r.status}`);
          }
          return r.json();
        })
      );
      const details = await Promise.all(detailsPromises);
      return details.map(item => ({ ...item, accountType: type, accountEmail: email }));
    } catch (e) {
      console.error(`Error fetching Gmail for ${type}:`, e);
      googleContext.state.googleErrors = googleContext.state.googleErrors || {};
      const msg = (e.message && (e.message.includes('401') || e.message === t('google-session-expired')))
        ? t('google-session-expired')
        : (e.message || 'Gmail fetch error');
      googleContext.state.googleErrors[type] = msg;
      updateGoogleAuthStatus();
      return [];
    }
  }

  try {
    const promises = [];
    if (personalToken) {
      promises.push(fetchEmailsForAccount(personalToken, 'personal', googleContext.state.googlePersonalEmail));
    }
    if (workToken) {
      promises.push(fetchEmailsForAccount(workToken, 'work', googleContext.state.googleWorkEmail));
    }

    const results = await Promise.all(promises);
    const allEmails = results.flat();

    // Sort by internalDate (newest first)
    allEmails.sort((a, b) => {
      const aDate = parseInt(a.internalDate) || 0;
      const bDate = parseInt(b.internalDate) || 0;
      return bDate - aDate;
    });

    if (emailsBadge) {
      if (allEmails.length > 0) {
        emailsBadge.textContent = allEmails.length;
        emailsBadge.classList.remove('hidden');
      } else {
        emailsBadge.classList.add('hidden');
      }
    }

    if (allEmails.length === 0) {
      container.innerHTML = `<p class="empty-msg">${t('no-emails')}</p>`;
      return;
    }

    container.innerHTML = allEmails.slice(0, 5).map(msg => {
      const headers = msg.payload.headers;
      const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject');
      const fromHeader = headers.find(h => h.name.toLowerCase() === 'from');
      const subject = subjectHeader ? subjectHeader.value : '(No Subject)';
      const from = fromHeader ? fromHeader.value.split('<')[0].trim() : 'Unknown';
      const snippet = msg.snippet;

      const badgeClass = msg.accountType === 'personal' ? 'personal' : 'work';
      const badgeLabel = t(`badge-${msg.accountType}`);

      let gmailLink = `https://mail.google.com/mail/#inbox/${msg.threadId}`;
      if (msg.accountEmail) {
        gmailLink = `https://mail.google.com/mail/?authuser=${encodeURIComponent(msg.accountEmail)}#inbox/${msg.threadId}`;
      }

      return `
        <a href="${googleContext.escapeHtml(gmailLink)}" target="_blank" rel="noopener noreferrer" class="integration-item ${badgeClass}" data-tooltip="Subject: ${googleContext.escapeHtml(subject)}\nFrom: ${googleContext.escapeHtml(from)}\nSnippet: ${googleContext.escapeHtml(snippet)}">
          <span class="item-title">${googleContext.escapeHtml(subject)}</span>
          <div class="item-meta">
            <span>${googleContext.escapeHtml(from)}</span>
            <span class="item-badge ${badgeClass}">${googleContext.escapeHtml(badgeLabel)}</span>
          </div>
        </a>
      `;
    }).join('');

  } catch (err) {
    console.error("Gmail Loading Error:", err);
    container.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Gmail Loading Error (${err.message || 'Error'})</p>`;
  }
}

export async function fetchGoogleTasks() {
  const oldToday = document.getElementById('gtasks-today');
  if (oldToday) oldToday.remove();
  const oldWeek = document.getElementById('gtasks-week');
  if (oldWeek) oldWeek.remove();

  const showToday = googleContext.state.settings.showGoogleTasksToday !== false;
  const showWeek = googleContext.state.settings.showGoogleTasksWeek !== false;

  if (!showToday && !showWeek) {
    return;
  }

  function showPlaceholder(messageHTML) {
    if (showToday) {
      let gTodayCard = document.getElementById('gtasks-today');
      if (!gTodayCard) {
        gTodayCard = document.createElement('div');
        gTodayCard.id = 'gtasks-today';
        gTodayCard.className = 'section-card';
        const colContent = document.querySelector('#col-today .col-content');
        if (colContent) colContent.appendChild(gTodayCard);
      }
      if (googleContext.state?.settings?.todayCardOrder) {
        const idx = googleContext.state.settings.todayCardOrder.indexOf('gtasks-today');
        if (idx !== -1) gTodayCard.style.order = idx;
      }
      gTodayCard.innerHTML = `
        <h3 class="card-subtitle">
          <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>${t('google-tasks-today')}</span>
            <span id="gtasks-today-count-badge" class="filter-badge hidden" style="margin-left: 0;"></span>
            <button type="button" class="card-action-btn btn-open-gtasks" data-tooltip="${t('google-open-tasks')}" aria-label="Open Google Tasks">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </span>
          <span class="header-status-indicators" id="google-gtasks-today-status-indicators"></span>
        </h3>
        <div class="integration-list">
          ${messageHTML}
        </div>
      `;
    }

    if (showWeek) {
      let gWeekCard = document.getElementById('gtasks-week');
      if (!gWeekCard) {
        gWeekCard = document.createElement('div');
        gWeekCard.id = 'gtasks-week';
        gWeekCard.className = 'section-card';
        const colContent = document.querySelector('#col-week .col-content');
        if (colContent) colContent.appendChild(gWeekCard);
      }
      if (googleContext.state?.settings?.weekCardOrder) {
        const idx = googleContext.state.settings.weekCardOrder.indexOf('gtasks-week');
        if (idx !== -1) gWeekCard.style.order = idx;
      }
      gWeekCard.innerHTML = `
        <h3 class="card-subtitle">
          <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>${t('google-tasks-week')}</span>
            <span id="gtasks-week-count-badge" class="filter-badge hidden" style="margin-left: 0;"></span>
            <button type="button" class="card-action-btn btn-open-gtasks" data-tooltip="${t('google-open-tasks')}" aria-label="Open Google Tasks">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </span>
          <span class="header-status-indicators" id="google-gtasks-week-status-indicators"></span>
        </h3>
        <div class="integration-list">
          ${messageHTML}
        </div>
      `;
    }
    updateGoogleAuthStatus();
  }

  const personalToken = await ensureValidGoogleToken('personal');
  const workToken = (!googleContext.state?.settings?.oooActive) ? await ensureValidGoogleToken('work') : null;

  if (!personalToken && !workToken) {
    showPlaceholder(renderGoogleEmptyState('google-config-tasks'));
    return;
  }

  let errors = [];

  async function fetchTasksForAccount(token, type) {
    if (!token) return [];
    try {
      const tasksRes = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=false', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!tasksRes.ok) {
        if (tasksRes.status === 401) {
          await handleInvalidToken(type);
          throw new Error(t('google-session-expired'));
        }
        throw new Error(`HTTP ${tasksRes.status}`);
      }
      const tasksData = await tasksRes.json();
      const items = tasksData.items || [];
      return items.map(t => ({ ...t, accountType: type }));
    } catch (e) {
      if (e.message === t('google-session-expired') || e.message?.includes('401')) {
        googleContext.state.googleErrors = googleContext.state.googleErrors || {};
        googleContext.state.googleErrors[type] = t('google-session-expired');
        updateGoogleAuthStatus();
        return [];
      }
      console.warn(`Direct fetch from @default failed for ${type}, trying lists fallback...`, e);
      try {
        const listsRes = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!listsRes.ok) {
          if (listsRes.status === 401) {
            await handleInvalidToken(type);
            throw new Error(t('google-session-expired'));
          }
          throw new Error(`Fallback HTTP ${listsRes.status}`);
        }
        const listsData = await listsRes.json();
        if (!listsData.items || listsData.items.length === 0) return [];

        const listId = listsData.items[0].id;
        const tasksRes = await fetch(`https://www.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=false`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!tasksRes.ok) {
          if (tasksRes.status === 401) {
            await handleInvalidToken(type);
            throw new Error(t('google-session-expired'));
          }
          throw new Error(`Fallback Tasks HTTP ${tasksRes.status}`);
        }
        const tasksData = await tasksRes.json();
        const items = tasksData.items || [];
        return items.map(t => ({ ...t, accountType: type }));
      } catch (fallbackError) {
        const msg = (fallbackError.message && (fallbackError.message.includes('401') || fallbackError.message === t('google-session-expired')))
          ? t('google-session-expired')
          : fallbackError.message;
        errors.push(`${type} account: ${msg}`);
        googleContext.state.googleErrors = googleContext.state.googleErrors || {};
        googleContext.state.googleErrors[type] = msg;
        updateGoogleAuthStatus();
        return [];
      }
    }
  }

  try {
    const promises = [];
    if (personalToken) {
      promises.push(fetchTasksForAccount(personalToken, 'personal'));
    }
    if (workToken) {
      promises.push(fetchTasksForAccount(workToken, 'work'));
    }

    const results = await Promise.all(promises);
    const gTasks = results.flat();

    // Cache available task titles for settings dropdown
    googleContext.cachedTaskTitles = [...new Set(gTasks.map(t => (t.title || '').trim()).filter(Boolean))];
    if (typeof googleContext.onTasksFetched === 'function') {
      googleContext.onTasksFetched(googleContext.cachedTaskTitles);
    }
    if (typeof window !== 'undefined' && typeof window.updateGoogleTasksFilterDropdownFromService === 'function') {
      window.updateGoogleTasksFilterDropdownFromService(googleContext.cachedTaskTitles);
    }

    // Check if we had errors and update status indicators
    if (errors.length > 0 && gTasks.length === 0) {
      console.warn("Google Tasks fetch failed:", errors.join(' | '));
      updateGoogleAuthStatus();
      return;
    }

    if (gTasks.length === 0) return;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayTime = todayStart.getTime();

    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndTime = weekEnd.getTime();

    const todayGTasks = [];
    const weekGTasks = [];
    const showOverdue = googleContext.state.settings.showGoogleTasksOverdue !== false;
    const hiddenTasks = (googleContext.state.settings.hiddenGoogleTasks || [])
      .map(s => (s || '').trim().toLowerCase())
      .filter(Boolean);

    gTasks.forEach(t => {
      if (!t.title || t.title.trim() === '') return;

      const cleanTitle = t.title.trim().toLowerCase();
      if (hiddenTasks.includes(cleanTitle)) return;

      const isOverdue = t.due && new Date(t.due).getTime() < todayTime;
      if (isOverdue && !showOverdue) return;

      if (!t.due) {
        weekGTasks.push(t);
        return;
      }
      
      const dueTime = new Date(t.due).getTime();
      if (dueTime <= todayTime + 24 * 60 * 60 * 1000 - 1) {
        todayGTasks.push(t);
      } else if (dueTime <= weekEndTime) {
        weekGTasks.push(t);
      } else {
        weekGTasks.push(t);
      }
    });

    const sortGoogleTasksList = (taskList) => {
      taskList.sort((a, b) => {
        const aOverdue = a.due && new Date(a.due).getTime() < todayTime;
        const bOverdue = b.due && new Date(b.due).getTime() < todayTime;
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;

        const hasDueA = !!a.due;
        const hasDueB = !!b.due;
        if (hasDueA && !hasDueB) return -1;
        if (!hasDueA && hasDueB) return 1;

        if (hasDueA && hasDueB) {
          const dueA = new Date(a.due).getTime();
          const dueB = new Date(b.due).getTime();
          if (dueA !== dueB) {
            return dueA - dueB;
          }
        }

        const updatedA = a.updated ? new Date(a.updated).getTime() : 0;
        const updatedB = b.updated ? new Date(b.updated).getTime() : 0;
        return updatedB - updatedA;
      });
    };

    sortGoogleTasksList(todayGTasks);
    sortGoogleTasksList(weekGTasks);

    function getTaskTimeText(task) {
      if (!task.due) return '';
      const hasTime = !task.due.endsWith('T00:00:00.000Z') && !task.due.endsWith('T00:00:00Z') && task.due.includes('T');
      if (!hasTime) {
        return '';
      }
      const d = new Date(task.due);
      return d.toLocaleTimeString(getLocale(googleContext.state.lang), {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    if (showToday && todayGTasks.length > 0) {
      let gTodayCard = document.getElementById('gtasks-today');
      if (!gTodayCard) {
        gTodayCard = document.createElement('div');
        gTodayCard.id = 'gtasks-today';
        gTodayCard.className = 'section-card';
        const colContent = document.querySelector('#col-today .col-content');
        if (colContent) colContent.appendChild(gTodayCard);
      }
      if (googleContext.state?.settings?.todayCardOrder) {
        const idx = googleContext.state.settings.todayCardOrder.indexOf('gtasks-today');
        if (idx !== -1) gTodayCard.style.order = idx;
      }
      gTodayCard.innerHTML = `
        <h3 class="card-subtitle">
          <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>${t('google-tasks-today')}</span>
            <span id="gtasks-today-count-badge" class="filter-badge ${todayGTasks.length > 0 ? '' : 'hidden'}" style="margin-left: 0;">${todayGTasks.length}</span>
            <button type="button" class="card-action-btn btn-open-gtasks" data-tooltip="${t('google-open-tasks')}" aria-label="Open Google Tasks">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </span>
          <span class="header-status-indicators" id="google-gtasks-today-status-indicators"></span>
        </h3>
        <div class="integration-list">
          ${todayGTasks.map(taskItem => {
            const badgeClass = taskItem.accountType === 'personal' ? 'personal' : 'work';
            const badgeLabel = t(`badge-${taskItem.accountType}`);
            const isOverdue = taskItem.due && new Date(taskItem.due).getTime() < todayTime;
            const dueLabel = isOverdue ? t('badge-overdue') : '';
            const timeText = getTaskTimeText(taskItem);
            const isRecurring = !!(taskItem.recurrence || taskItem.recurring);
            const recurringClass = isRecurring ? 'recurring' : '';
            const repeatIcon = isRecurring 
              ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.65; display: inline-block; vertical-align: middle; margin-right: 0.25rem; flex-shrink: 0;"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>` 
              : '';
            const tooltipText = taskItem.title + (isOverdue ? ` (${dueLabel})` : '') + (timeText ? `\n${timeText}` : '') + (isRecurring ? t('google-recurring-suffix') : '');
            
            const email = taskItem.accountType === 'personal' ? googleContext.state.googlePersonalEmail : googleContext.state.googleWorkEmail;
            const tasksLink = email 
              ? `https://tasks.google.com/?authuser=${encodeURIComponent(email)}` 
              : 'https://tasks.google.com/';

            return `
              <a href="${googleContext.escapeHtml(tasksLink)}" target="_blank" rel="noopener noreferrer" class="integration-item one-line ${recurringClass}" data-tooltip="${googleContext.escapeHtml(tooltipText)}">
                <div style="display: flex; align-items: center; gap: 0.4rem; min-width: 0; flex: 1;">
                  ${isOverdue ? `<span class="event-overdue-badge" style="margin-left: 0; flex-shrink: 0; padding: 0.05rem 0.25rem; font-size: 0.6rem;">${dueLabel}</span>` : ''}
                  ${repeatIcon}
                  <span class="item-title">${googleContext.escapeHtml(taskItem.title)}</span>
                </div>
                <span class="item-badge ${badgeClass}">${googleContext.escapeHtml(badgeLabel)}</span>
              </a>
            `;
          }).join('')}
        </div>
      `;
    }

    if (showWeek && weekGTasks.length > 0) {
      let gWeekCard = document.getElementById('gtasks-week');
      if (!gWeekCard) {
        gWeekCard = document.createElement('div');
        gWeekCard.id = 'gtasks-week';
        gWeekCard.className = 'section-card';
        const colContent = document.querySelector('#col-week .col-content');
        if (colContent) colContent.appendChild(gWeekCard);
      }
      if (googleContext.state?.settings?.weekCardOrder) {
        const idx = googleContext.state.settings.weekCardOrder.indexOf('gtasks-week');
        if (idx !== -1) gWeekCard.style.order = idx;
      }
      gWeekCard.innerHTML = `
        <h3 class="card-subtitle">
          <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>${t('google-tasks-week')}</span>
            <span id="gtasks-week-count-badge" class="filter-badge ${weekGTasks.length > 0 ? '' : 'hidden'}" style="margin-left: 0;">${weekGTasks.length}</span>
            <button type="button" class="card-action-btn btn-open-gtasks" data-tooltip="${t('google-open-tasks')}" aria-label="Open Google Tasks">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </span>
          <span class="header-status-indicators" id="google-gtasks-week-status-indicators"></span>
        </h3>
        <div class="integration-list">
          ${weekGTasks.map(taskItem => {
            const badgeClass = taskItem.accountType === 'personal' ? 'personal' : 'work';
            const badgeLabel = t(`badge-${taskItem.accountType}`);
            const timeText = getTaskTimeText(taskItem);
            const dateText = taskItem.due ? googleContext.formatDateShort(taskItem.due.split('T')[0]) : '';
            const isRecurring = !!(taskItem.recurrence || taskItem.recurring);
            const recurringClass = isRecurring ? 'recurring' : '';
            const repeatIcon = isRecurring 
              ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.65; display: inline-block; vertical-align: middle; margin-right: 0.25rem; flex-shrink: 0;"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>` 
              : '';
            const tooltipText = taskItem.title + (taskItem.due ? `\n${dateText}` : '') + (isRecurring ? t('google-recurring-suffix') : '');
            
            const email = taskItem.accountType === 'personal' ? googleContext.state.googlePersonalEmail : googleContext.state.googleWorkEmail;
            const tasksLink = email 
              ? `https://tasks.google.com/?authuser=${encodeURIComponent(email)}` 
              : 'https://tasks.google.com/';

            return `
              <a href="${googleContext.escapeHtml(tasksLink)}" target="_blank" rel="noopener noreferrer" class="integration-item one-line ${recurringClass}" data-tooltip="${googleContext.escapeHtml(tooltipText)}">
                <div style="display: flex; align-items: center; gap: 0.4rem; min-width: 0; flex: 1;">
                  ${repeatIcon}
                  <span class="item-title">${googleContext.escapeHtml(taskItem.title)}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0;">
                  ${dateText ? `<span style="font-size: 0.72rem; color: var(--text-secondary);">${googleContext.escapeHtml(dateText)}</span>` : ''}
                  <span class="item-badge ${badgeClass}">${googleContext.escapeHtml(badgeLabel)}</span>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      `;
    }

    updateGoogleAuthStatus();
  } catch (err) {
    console.error("Error fetching Google Tasks", err);
    googleContext.state.googleErrors = googleContext.state.googleErrors || {};
    googleContext.state.googleErrors.tasks = err.message || 'Tasks error';
    updateGoogleAuthStatus();
  }
}

export async function fetchGoogleCalendar() {
  const todayEventsContainer = document.getElementById('google-events-container');
  const weeklyEventsContainer = document.getElementById('weekly-events-container');
  const weeklyBadge = document.getElementById('weekly-count-badge');
  if (weeklyBadge) {
    weeklyBadge.classList.add('hidden');
  }

  if (googleContext.state?.settings?.showGoogleSchedule === false) {
    const todayBadge = document.getElementById('events-count-badge');
    if (todayBadge) todayBadge.classList.add('hidden');
    if (todayEventsContainer) todayEventsContainer.innerHTML = '';
    if (weeklyEventsContainer) weeklyEventsContainer.innerHTML = '';
    return;
  }

  const personalToken = await ensureValidGoogleToken('personal');
  const workToken = (!googleContext.state?.settings?.oooActive) ? await ensureValidGoogleToken('work') : null;

  if (!personalToken && !workToken) {
    const msgHTML = renderGoogleEmptyState('google-config-calendar');
    todayEventsContainer.innerHTML = msgHTML;
    weeklyEventsContainer.innerHTML = msgHTML;
    return;
  }

  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ahead

  async function fetchEventsForAccount(token, type) {
    if (!token) return [];
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      if (res.status === 401) {
        await handleInvalidToken(type);
        throw new Error(t('google-session-expired'));
      }
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    const items = data.items || [];
    return items.map(item => ({ ...item, accountType: type }));
  }

  try {
    const promises = [];
    if (personalToken) {
      promises.push(
        fetchEventsForAccount(personalToken, 'personal')
          .catch(err => {
            console.error("Error fetching personal calendar:", err);
            googleContext.state.googleErrors = googleContext.state.googleErrors || {};
            const msg = (err.message && (err.message.includes('401') || err.message === t('google-session-expired')))
              ? t('google-session-expired')
              : (err.message || 'Calendar error');
            googleContext.state.googleErrors.personal = msg;
            updateGoogleAuthStatus();
            return [];
          })
      );
    }
    if (workToken) {
      promises.push(
        fetchEventsForAccount(workToken, 'work')
          .catch(err => {
            console.error("Error fetching work calendar:", err);
            googleContext.state.googleErrors = googleContext.state.googleErrors || {};
            const msg = (err.message && (err.message.includes('401') || err.message === t('google-session-expired')))
              ? t('google-session-expired')
              : (err.message || 'Calendar error');
            googleContext.state.googleErrors.work = msg;
            updateGoogleAuthStatus();
            return [];
          })
      );
    }

    const results = await Promise.all(promises);
    const allEvents = results.flat();

    // Sort all events by start time
    allEvents.sort((a, b) => {
      const aStart = a.start.dateTime || a.start.date;
      const bStart = b.start.dateTime || b.start.date;
      return aStart.localeCompare(bStart);
    });

    if (allEvents.length === 0) {
      todayEventsContainer.innerHTML = `<p class="empty-msg">${t('no-events')}</p>`;
      weeklyEventsContainer.innerHTML = `<p class="empty-msg">${t('no-weekly-events')}</p>`;
      return;
    }

    const todayStr = googleContext.getLocalDateString(new Date());
    const todayEvents = [];
    const weeklyGroups = {}; // relative date string -> list of event HTMLs
    const showRecurring = googleContext.state?.settings?.showGoogleRecurringEvents !== false;

    allEvents.forEach(evt => {
      const isRecurring = !!(evt.recurringEventId || (evt.recurrence && evt.recurrence.length > 0));
      if (!showRecurring && isRecurring) {
        return;
      }

      const startStr = evt.start.dateTime || evt.start.date;
      const isToday = startStr.startsWith(todayStr);
      
      const badgeClass = evt.accountType === 'personal' ? 'personal' : 'work';
      const badgeLabel = t(`badge-${evt.accountType}`);

      let eventLink = evt.htmlLink || 'https://calendar.google.com/calendar/r';
      const email = evt.accountType === 'personal' ? googleContext.state.googlePersonalEmail : googleContext.state.googleWorkEmail;
      if (email) {
        const separator = eventLink.includes('?') ? '&' : '?';
        eventLink = `${eventLink}${separator}authuser=${encodeURIComponent(email)}`;
      }

      const timeStr = (googleContext.formatEventTime || formatEventTime)(evt, googleContext.state?.lang || 'en');
      const recurringClass = isRecurring ? 'recurring' : '';
      const repeatIcon = isRecurring 
        ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.65; display: inline-block; vertical-align: middle; margin-right: 0.25rem; flex-shrink: 0;"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>` 
        : '';

      const evtDateObj = new Date(startStr.split('T')[0] + 'T00:00:00');
      const dateText = evtDateObj.toLocaleDateString(getLocale(googleContext.state.lang), { day: 'numeric', month: 'long' });
      const tooltipText = evt.summary + `\n${dateText}\nTime: ${timeStr}` + (isRecurring ? t('google-recurring-suffix') : '');

      const eventHTML = `
        <a href="${googleContext.escapeHtml(eventLink)}" target="_blank" rel="noopener noreferrer" class="integration-item ${badgeClass} ${recurringClass}" data-tooltip="${googleContext.escapeHtml(tooltipText)}">
          <span class="item-title">${googleContext.escapeHtml(evt.summary)}</span>
          <div class="item-meta">
            <span>${repeatIcon}${googleContext.escapeHtml(timeStr)}</span>
            <span class="item-badge ${badgeClass}">${googleContext.escapeHtml(badgeLabel)}</span>
          </div>
        </a>
      `;

      if (isToday) {
        todayEvents.push(eventHTML);
      } else {
        const dateVal = evt.start.dateTime || evt.start.date;
        const relativeLabel = getRelativeDateLabel(dateVal, googleContext.state?.lang || 'en');
        if (!weeklyGroups[relativeLabel]) {
          weeklyGroups[relativeLabel] = [];
        }
        weeklyGroups[relativeLabel].push(eventHTML);
      }
    });

    const weeklyHTML = [];
    let totalWeeklyCount = 0;
    Object.keys(weeklyGroups).forEach(label => {
      weeklyHTML.push(`<div class="schedule-group-header">${googleContext.escapeHtml(label)}</div>`);
      weeklyHTML.push(...weeklyGroups[label]);
      totalWeeklyCount += weeklyGroups[label].length;
    });

    if (weeklyBadge) {
      if (totalWeeklyCount > 0) {
        weeklyBadge.textContent = totalWeeklyCount;
        weeklyBadge.classList.remove('hidden');
      } else {
        weeklyBadge.classList.add('hidden');
      }
    }

    const todayBadge = document.getElementById('events-count-badge');
    if (todayBadge) {
      if (todayEvents.length > 0) {
        todayBadge.textContent = todayEvents.length;
        todayBadge.classList.remove('hidden');
      } else {
        todayBadge.classList.add('hidden');
      }
    }

    todayEventsContainer.innerHTML = todayEvents.length > 0 ? todayEvents.join('') : `<p class="empty-msg">${t('no-events')}</p>`;
    weeklyEventsContainer.innerHTML = weeklyHTML.length > 0 ? weeklyHTML.join('') : `<p class="empty-msg">${t('no-weekly-events')}</p>`;

  } catch (err) {
    console.error("Failed to load calendars", err);
    todayEventsContainer.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Calendar Loading Error</p>`;
    weeklyEventsContainer.innerHTML = `<p class="empty-msg" style="color:var(--danger)">Calendar Loading Error</p>`;
  }
}

