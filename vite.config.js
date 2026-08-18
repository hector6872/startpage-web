import { defineConfig } from 'vite';

function proxyMiddleware(req, res, next) {
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

  (async () => {
    try {
      const forwardHeaders = {};
      for (const [headerKey, headerVal] of Object.entries(req.headers)) {
        const keyLower = headerKey.toLowerCase();
        if (!['host', 'origin', 'referer', 'sec-fetch-mode', 'sec-fetch-site', 'sec-fetch-dest', 'connection'].includes(keyLower)) {
          forwardHeaders[headerKey] = headerVal;
        }
      }

      let bodyData = undefined;
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        if (chunks.length > 0) {
          bodyData = Buffer.concat(chunks);
        }
      }

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
  })();
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
