# BoloDB Landing Page

Marketing site and blog for [bolodb.dev](https://bolodb.dev), built with Astro and deployed to GitHub Pages.

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Decap CMS](https://decapcms.org/) - Content management

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Blog Management

Blog posts live in `src/content/blog/` as markdown files. You can:

1. **Edit directly**: Create `.md` files in `src/content/blog/`
2. **Use the CMS**: Visit `/admin` on the deployed site (requires GitHub OAuth setup)

## Deployment

This site is configured for dual deployment:

### GitHub Pages (primary)
- Triggered on push to `main`
- Uses `.github/workflows/deploy-gh-pages.yml`
- Custom domain: `bolodb.dev` (via `public/CNAME`)

### Cloudflare Pages (secondary)
- Triggered on push to `main`
- Uses `.github/workflows/deploy-cf-pages.yml`
- Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets

## Waitlist / Early Access

While the platform is in private early access, the landing page collects waitlist
signups. This is powered by [PostHog](https://posthog.com/) (no backend server —
the site stays fully static):

- **Waitlist mode** — while `WAITLIST_MODE` is on (the default, see
  `src/lib/site.ts`), the app **Log in** and **Start free** entry points are not
  rendered at all — every CTA routes to the on-page `#waitlist` form. This is
  resolved at **build time**, so there's no client-side flicker and it doesn't
  depend on PostHog being reachable. To reopen signup/login once the platform is
  public, build with `PUBLIC_WAITLIST_MODE=off`.
- **Storage** — a signup writes a person record (keyed by email) plus a
  `waitlist_signup` event, and enrolls the person in the **BoloDB Early Access**
  feature. Signups are visible under Persons and the Early Access feature in
  PostHog. The `signup-login-waitlist` PostHog flag mirrors this state for
  product/analytics use.
- **Privacy** — PostHog is initialized with autocapture, pageviews, session
  recording and surveys disabled and in-memory persistence (no cookies). It only
  sends the one explicit event when someone joins, keeping the site's "no
  telemetry" promise intact.

**Environment variables (build time):**

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SITE_ENV` | Set to `production` on the real deploy so the live PostHog key is used. Unset elsewhere, so previews/forks never write to the production project. |
| `PUBLIC_WAITLIST_MODE` | `off` reopens app signup/login; anything else (default) keeps waitlist-only mode. |
| `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` | Override the PostHog project explicitly in any build. |

## CMS Setup (Optional)

For Decap CMS with GitHub OAuth:

1. Create a GitHub OAuth App at https://github.com/settings/developers
2. Set callback URL to `https://bolodb.dev/api/auth/callback`
3. Deploy an OAuth proxy (e.g., using Cloudflare Workers)
4. Update `public/admin/config.yml` with the auth backend

## Project Structure

```
├── public/
│   ├── admin/          # Decap CMS
│   ├── CNAME           # Custom domain
│   └── favicon.svg
├── src/
│   ├── components/     # UI components
│   ├── content/blog/   # Blog posts (markdown)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   └── styles/         # Global CSS
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

## License

MIT
