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
   npx wrangler publish

## Notes
- Do NOT commit your `CF_API_TOKEN` to the repository. Always use GitHub Secrets.
- The configured Workers subdomain is `purarecoveryryan.workers.dev` (project name: `purarecoveryryan`).
- If you prefer Cloudflare Pages instead of a Workers Site, tell me and I will adjust the workflow to use `wrangler pages publish` instead.
