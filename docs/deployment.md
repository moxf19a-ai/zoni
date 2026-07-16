# Deployment

## Docker Compose (recommended)
```bash
cp apps/api/.env.example apps/api/.env   # fill in real secrets
docker compose up --build
```
- API: http://localhost:4000
- Web (via Nginx, proxies /api to API): http://localhost:8080

## Manual / PM2
```bash
pnpm install --frozen-lockfile
pnpm --filter api build
pnpm --filter web build
pm2 start ecosystem.config.js --env production
```

## CI
`.github/workflows/ci.yml` runs lint, typecheck, build, and tests on every push/PR to `main`.

## Security checklist before production
- Rotate all secrets in `apps/api/.env` (JWT, OAuth state, token encryption key) — never reuse dev values.
- Set `CORS_ALLOWED_ORIGINS` to the real frontend domain only.
- Put the API behind HTTPS (terminate TLS at Nginx/load balancer).
- Point `DATABASE_URL`/`REDIS_URL` at managed, backed-up instances.
