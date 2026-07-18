# Decap CMS GitHub OAuth Worker

This Cloudflare Worker handles GitHub OAuth for Decap CMS.

## Setup

### 1. Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** BoloDB CMS
   - **Homepage URL:** https://bolodb.dev
   - **Authorization callback URL:** https://<your-worker-name>.workers.dev/callback
4. Click "Register application"
5. Copy the **Client ID**
6. Generate a new **Client Secret** and copy it

### 2. Deploy the Worker

```bash
# Install wrangler if you haven't
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy workers/github-oauth.js --name bolodb-cms-auth
```

### 3. Set Environment Variables

In the Cloudflare dashboard, go to Workers & Pages → bolodb-cms-auth → Settings → Variables:

| Variable | Value |
|---|---|
| `GITHUB_CLIENT_ID` | Your GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth App Client Secret (encrypted) |
| `ORIGINS` | `https://bolodb.dev` |

### 4. Update CMS Config

Edit `public/admin/config.yml` and replace the `base_url`:

```yaml
backend:
  name: github
  repo: BoloDB/bolodb-landing-page
  branch: main
  base_url: https://bolodb-cms-auth.your-subdomain.workers.dev
```

### 5. Test

1. Deploy your site
2. Go to `https://bolodb.dev/admin/`
3. Click "Login with GitHub"
4. You should be redirected to GitHub and back

## How It Works

1. `/auth` — Redirects to GitHub OAuth authorization page
2. `/callback` — Exchanges code for token, gets user info, returns to CMS
3. `/identity` — Validates Bearer tokens for ongoing auth
