/**
 * Cloudflare Worker — sits in front of the static Vite build (./dist).
 *
 * - Hides the admin page: /admin, /admin.html, /admin/ always 404. The page
 *   is only served at the secret path in env.ADMIN_PATH.
 * - POST /api/admin/auth/login: checks credentials against Worker secrets.
 * - Everything else falls through to the static assets.
 *
 * Secrets (Dashboard → Worker → Settings → Variables and Secrets, type
 * "Secret"; or `npx wrangler secret put NAME`):
 *   ADMIN_PATH            e.g. "/quan-ly-7f3k9x2m" (long & random)
 *   ADMIN_USERNAME
 *   ADMIN_PASSWORD
 *   ADMIN_SESSION_SECRET  random string used to sign session tokens
 * If any is missing, the admin page and login are disabled (404).
 */

const SESSION_TTL_SECONDS = 24 * 60 * 60;

const NOT_FOUND_HEADERS = { 'Content-Type': 'text/plain; charset=utf-8' };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const adminEnabled = Boolean(
      env.ADMIN_PATH && env.ADMIN_USERNAME && env.ADMIN_PASSWORD && env.ADMIN_SESSION_SECRET
    );
    const adminPath = adminEnabled ? normalizeAdminPath(env.ADMIN_PATH) : null;

    // 1. Secret admin URL → serve the built admin.html (never cached, never indexed)
    if (adminPath && path === adminPath && request.method === 'GET') {
      // Ask for the extensionless form: requesting /admin.html makes the asset
      // server answer with a 307 redirect to /admin (which would leak the
      // real page name and then 404).
      const assetUrl = new URL('/admin', url.origin);
      const res = await env.ASSETS.fetch(new Request(assetUrl, request));
      const headers = new Headers(res.headers);
      headers.set('Cache-Control', 'no-store');
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      headers.set('Referrer-Policy', 'no-referrer');
      headers.set('X-Frame-Options', 'DENY');
      return new Response(res.body, { status: res.status, headers });
    }

    // 2. The public, guessable admin URLs look exactly like any missing page
    if (/^\/admin(\.html)?$/i.test(path)) {
      return notFound(env, url);
    }

    // 3. Login API
    if (path === '/api/admin/auth/login') {
      // Anything but a POST looks like a missing page too.
      if (!adminEnabled || request.method !== 'POST') return notFound(env, url);
      return handleLogin(request, env);
    }

    // Other /api/* routes don't exist yet
    if (path.startsWith('/api/')) {
      return notFound(env, url);
    }

    // 4. Static site
    return env.ASSETS.fetch(request);
  }
};

async function handleLogin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  // Compare both fields, always, in constant time — no early exit that
  // would reveal whether the username alone was right.
  const [userOk, passOk] = await Promise.all([
    safeEqual(username, env.ADMIN_USERNAME),
    safeEqual(password, env.ADMIN_PASSWORD)
  ]);

  if (!(userOk && passOk)) {
    // Slow down brute-force attempts a little.
    await new Promise((r) => setTimeout(r, 600));
    return json({ error: 'Thông tin đăng nhập không chính xác.' }, 401);
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = await signToken({ sub: env.ADMIN_USERNAME, role: 'admin', exp }, env.ADMIN_SESSION_SECRET);

  return json(
    { token, expiresIn: SESSION_TTL_SECONDS, user: { username: env.ADMIN_USERNAME, role: 'admin' } },
    200,
    { 'Cache-Control': 'no-store' }
  );
}

function normalizeAdminPath(p) {
  const withSlash = p.startsWith('/') ? p : `/${p}`;
  return withSlash.replace(/\/+$/, '');
}

async function notFound(env, url) {
  // Reuse the site's own 404 handling so this response is indistinguishable
  // from any other missing URL.
  const res = await env.ASSETS.fetch(new Request(new URL('/__not-found__', url.origin)));
  if (res.status === 404) return res;
  return new Response('Not Found', { status: 404, headers: NOT_FOUND_HEADERS });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders }
  });
}

/** Constant-time string compare (hash both sides so lengths match). */
async function safeEqual(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(String(a))),
    crypto.subtle.digest('SHA-256', enc.encode(String(b)))
  ]);
  return crypto.subtle.timingSafeEqual(ha, hb);
}

/** HMAC-SHA256 signed token: base64url(payload).base64url(signature) */
async function signToken(payload, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const body = base64url(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body));
  return `${body}.${base64url(new Uint8Array(sig))}`;
}

function base64url(bytes) {
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
