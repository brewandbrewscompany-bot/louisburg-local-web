# Security Policy

This repository is intentionally public and contains only Louisburg Local browser/deployment files.

## Public boundary
Assume every file here is publicly inspectable. Do not commit collector logic, Sherlock/moderation internals, operational notes, credentials, tokens, cookies, service-account files, private keys, `.env` files, or private datasets.

Protected backend and worker source belongs in the private `brewandbrewscompany-bot/louisburg-local-core` repository.

If a credential is ever committed here, revoke/rotate it immediately; removing the current file does not erase Git history.
