# Louisburg Local Web

## Production source of truth

**THIS REPOSITORY IS THE PRODUCTION WEBSITE SOURCE OF TRUTH.**

- Production domain: `https://louisburglocalks.com/`
- Production UI changes must be made here first.
- `brewandbrewscompany-bot/brew-brews-radio` is not the production website deployment source.
- `brewandbrewscompany-bot/louisburg-local-core` is the private backend/automation source and must not contain public deployment files.
- Before considering a UI change complete, the production smoke workflow in this repository must pass against the custom domain.

Public deployment repository for the Louisburg Local website/app.

Only browser-safe public files belong here. Collector logic, Sherlock/moderation internals, credentials, tokens, automation secrets, private notes, source-discovery internals, and server-side operational code belong in the private `louisburg-local-core` repository.

Target public domain: `LouisburgLocalKS.com`.
