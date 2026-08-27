export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Proxy handler for Jira and Google APIs (bypasses browser CORS)
    if (url.pathname === '/api/proxy') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      const targetUrl = url.searchParams.get('url');
      if (!targetUrl || (!targetUrl.startsWith('https://') && !targetUrl.startsWith('http://'))) {
        return new Response(JSON.stringify({ error: 'Missing or invalid target url parameter' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      try {
        const forwardHeaders = new Headers();
        for (const [key, value] of request.headers.entries()) {
          const lower = key.toLowerCase();
          if (!['host', 'origin', 'referer', 'cf-connecting-ip', 'cf-ray', 'cf-visitor', 'sec-fetch-mode', 'sec-fetch-site', 'sec-fetch-dest'].includes(lower)) {
            forwardHeaders.set(key, value);
          }
        }

        let body = undefined;
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          body = await request.arrayBuffer();
        }

        const response = await fetch(targetUrl, {
          method: request.method,
          headers: forwardHeaders,
          body,
        });

        const responseHeaders = new Headers(response.headers);
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.delete('content-encoding');

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // Google OAuth popup callback handler
    if (url.pathname === '/api/auth/google/callback') {
      const code = url.searchParams.get('code') || '';
      const state = url.searchParams.get('state') || 'personal';
      const error = url.searchParams.get('error') || '';

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Google Authentication</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #0f172a;
      color: #f8fafc;
      text-align: center;
    }
    .card {
      background: #1e293b;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      max-width: 400px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>${error ? 'Authentication Failed' : 'Authentication Successful'}</h2>
    <p>${error ? error : 'Connecting your Google account, you can close this window...'}</p>
  </div>
  <script>
    (function() {
      const payload = {
        type: 'GOOGLE_AUTH_CODE',
        code: ${JSON.stringify(code)},
        state: ${JSON.stringify(state)},
        error: ${JSON.stringify(error)}
      };
      if (window.opener) {
        window.opener.postMessage(payload, window.location.origin);
        setTimeout(function() { window.close(); }, 800);
      } else {
        window.location.href = '/?google_code=' + encodeURIComponent(${JSON.stringify(code)}) + '&state=' + encodeURIComponent(${JSON.stringify(state)});
      }
    })();
  </script>
</body>
</html>`;

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Default static assets handler (Cloudflare Workers Static Assets)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  }
};
