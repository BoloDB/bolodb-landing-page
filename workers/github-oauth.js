/**
 * Cloudflare Worker for Decap CMS GitHub OAuth
 *
 * Setup:
 * 1. Create a GitHub OAuth App at https://github.com/settings/developers
 *    - Homepage URL: https://bolodb.dev
 *    - Authorization callback URL: https://<your-worker-name>.workers.dev/callback
 * 2. Deploy this worker to Cloudflare Workers
 * 3. Set environment variables in Cloudflare dashboard:
 *    - GITHUB_CLIENT_ID: from your OAuth App
 *    - GITHUB_CLIENT_SECRET: from your OAuth App
 *    - ORIGINS: https://bolodb.dev (comma-separated allowed origins)
 * 4. Update public/admin/config.yml with your worker URL
 */

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';
const GITHUB_EMAILS_URL = 'https://api.github.com/user/emails';

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
});

function getOrigin(request, env) {
  const origins = (env.ORIGINS || 'https://bolodb.dev').split(',').map(s => s.trim());
  const requestOrigin = request.headers.get('Origin') || '';
  return origins.includes(requestOrigin) ? requestOrigin : origins[0];
}

function isAllowedEmail(env, email) {
  if (!env.ALLOWED_EMAILS) return false;
  return env.ALLOWED_EMAILS.split(',').map(s => s.trim()).includes(email);
}

async function getPrimaryEmail(token) {
  const res = await fetch(GITHUB_EMAILS_URL, {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
  });
  if (!res.ok) return null;
  const emails = await res.json();
  const primary = emails.find(e => e.primary && e.verified);
  return primary ? primary.email : null;
}

async function handleAuth(request, env) {
  const url = new URL(request.url);
  const origin = getOrigin(request, env);
  const clientId = env.GITHUB_CLIENT_ID.trim();

  if (!clientId) {
    return new Response('Missing GITHUB_CLIENT_ID', { status: 500 });
  }

  const redirectUrl = `${url.origin}/callback`;
  const scope = 'read:user+user:email+repo';

  const authUrl = `${GITHUB_AUTHORIZE_URL}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${scope}`;

  return Response.redirect(authUrl, 302);
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const origin = getOrigin(request, env);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code parameter', { status: 400 });
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('Missing environment variables', { status: 500 });
  }

  // Exchange code for access token
  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return new Response(`GitHub OAuth error: ${tokenData.error_description}`, { status: 401 });
  }

  // Get user info
  const userResponse = await fetch(GITHUB_USER_URL, {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Accept': 'application/json',
    },
  });

  const userData = await userResponse.json();

  // Check if user's email is allowed
  const primaryEmail = await getPrimaryEmail(tokenData.access_token);
  if (!primaryEmail || !isAllowedEmail(env, primaryEmail)) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Access Denied</title></head>
        <body>
          <h1>Access Denied</h1>
          <p>Your email (${primaryEmail || 'unknown'}) is not authorized to access this CMS.</p>
          <script>
            window.opener.postMessage("authorization:github:error:Access denied", "*");
          </script>
        </body>
      </html>
    `;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html', ...corsHeaders(origin) },
    });
  }

  // Return the token in the format Decap CMS expects
  const html = `
    <!DOCTYPE html>
    <html>
      <head><title>Authenticating...</title></head>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("receiveMessage", e);
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify({
                  provider: 'github',
                  token: tokenData.access_token,
                  token_type: 'Bearer',
                  user: {
                    login: userData.login,
                    name: userData.name || userData.login,
                    email: primaryEmail,
                  },
                })}',
                e.origin
              );
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      ...corsHeaders(origin),
    },
  });
}

async function handleIdentity(request, env) {
  const origin = getOrigin(request, env);

  // Decap CMS sends auth headers to validate the user
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(origin),
      },
    });
  }

  const token = authHeader.slice(7);

  // Verify the token with GitHub
  const userResponse = await fetch(GITHUB_USER_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!userResponse.ok) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(origin),
      },
    });
  }

  const userData = await userResponse.json();

  const primaryEmail = await getPrimaryEmail(token);
  if (!primaryEmail || !isAllowedEmail(env, primaryEmail)) {
    return new Response(JSON.stringify({ error: 'Email not authorized' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(origin),
      },
    });
  }

  return new Response(JSON.stringify({
    metadata: {
      login: userData.login,
      name: userData.name || userData.login,
      email: primaryEmail,
    },
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(getOrigin(request, env)),
      });
    }

    // Route requests
    switch (url.pathname) {
      case '/auth':
        return handleAuth(request, env);
      case '/callback':
        return handleCallback(request, env);
      case '/.netlify/identity':
      case '/identity':
        return handleIdentity(request, env);
      default:
        return new Response('Not Found', { status: 404 });
    }
  },
};
