export default async (req, context) => {
  const url = new URL(req.url);
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
      'Access-Control-Allow-Origin': '*'
    }
  });
};
