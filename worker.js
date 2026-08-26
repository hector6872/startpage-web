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

    // Default static assets handler (Cloudflare Workers Static Assets)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  }
};
