# Deployment to Cloudflare Workers / Pages

This project is configured to publish a static build of `project-root` to Cloudflare Workers (Workers Site) via `wrangler`.

## Setup
1. Create a Cloudflare API token with the following minimum scopes:
   - Account: Workers -> Edit
   - Account: Pages -> Edit (if using Pages in future)
2. Save the token as `CF_API_TOKEN` in GitHub Secrets for this repository.
3. Add your `CF_ACCOUNT_ID` as the `CF_ACCOUNT_ID` GitHub Secret.

## Files added
- `wrangler.toml` — config for publishing to Workers; `account_id` is pre-filled with the provided value.
- `.github/workflows/deploy-workers.yml` — CI workflow that runs on `push` to `main` and executes `npx wrangler publish` after building.

## Manual publish
You can also publish from your machine:

1. Build locally:
   npm run build --prefix project-root

2. Publish with Wrangler (token must be present in environment):
   # For Cloudflare Pages (recommended for static Astro site)
   npx wrangler pages publish ./project-root/dist --project-name thevault

   # For Workers Site (if using workers)
   npx wrangler publish

## Custom domain / DNS (buildwhilebleeding.com)
- Your domain is already using Cloudflare nameservers:
  - `jihoon.ns.cloudflare.com`
  - `karsyn.ns.cloudflare.com`

Steps to map `buildwhilebleeding.com` to Pages:
1. Go to Cloudflare → Pages → your Pages project (or create a new Pages project named `thevault`).
2. In Pages project settings → **Custom domains**, add `buildwhilebleeding.com`.
   - Because your domain is on Cloudflare, the verification will usually be automatic.
3. Set `buildwhilebleeding.com` as the primary domain and enable **Always use HTTPS**.
4. For `www`, add a CNAME `www` → `thevault.pages.dev` (or add `www.buildwhilebleeding.com` in the Pages UI).
5. Ensure the GitHub repo has these Secrets set: `CF_API_TOKEN`, `CF_ACCOUNT_ID`.
6. Push to `main` to trigger the GitHub Actions workflow that runs `npx wrangler pages publish`.

## Notes
- Do NOT commit your `CF_API_TOKEN` to the repository. Always use GitHub Secrets.
- Pages project name: `thevault`. The Pages project will serve the site at `https://thevault.pages.dev` until `buildwhilebleeding.com` is mapped.
- If you prefer I can also add automatic redirects (www → root) or HSTS rules via Cloudflare settings.

