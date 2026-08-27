import { defineConfig } from 'vite';

function proxyMiddleware(req, res, next) {
  if (req.url && req.url.startsWith('/api/auth/google/callback')) {
    const parsedUrl = new URL(req.url, 'http://localhost');
    const code = parsedUrl.searchParams.get('code') || '';
    const state = parsedUrl.searchParams.get('state') || 'personal';
    const error = parsedUrl.searchParams.get('error') || '';

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

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(html);
    return;
  }

  if (!req.url || !req.url.startsWith('/api/proxy')) {
    return next();
  }

  // Preflight CORS response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, 'http://localhost');
  const targetUrl = parsedUrl.searchParams.get('url');

  if (!targetUrl || (!targetUrl.startsWith('https://') && !targetUrl.startsWith('http://'))) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing or invalid target url parameter' }));
    return;
  }

  const forwardHeaders = {};
  for (const [headerKey, headerVal] of Object.entries(req.headers)) {
    const keyLower = headerKey.toLowerCase();
    if (!['host', 'origin', 'referer', 'sec-fetch-mode', 'sec-fetch-site', 'sec-fetch-dest', 'connection'].includes(keyLower)) {
      forwardHeaders[headerKey] = headerVal;
    }
  }

  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', async () => {
    try {
      const bodyData = (req.method !== 'GET' && req.method !== 'HEAD' && chunks.length > 0)
        ? Buffer.concat(chunks)
        : undefined;

      const apiResponse = await fetch(targetUrl, {
        method: req.method,
        headers: forwardHeaders,
        body: bodyData
      });

      res.statusCode = apiResponse.status;
      apiResponse.headers.forEach((val, key) => {
        const lowerKey = key.toLowerCase();
        if (!['content-encoding', 'transfer-encoding', 'content-length'].includes(lowerKey)) {
          res.setHeader(key, val);
        }
      });
      res.setHeader('Access-Control-Allow-Origin', '*');

      const buffer = await apiResponse.arrayBuffer();
      res.end(Buffer.from(buffer));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}

export default defineConfig({
  plugins: [
    {
      name: 'cors-api-proxy',
      configureServer(server) {
        server.middlewares.use(proxyMiddleware);
      },
      configurePreviewServer(server) {
        server.middlewares.use(proxyMiddleware);
      }
    }
  ]
});
