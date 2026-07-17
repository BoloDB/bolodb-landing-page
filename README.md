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
