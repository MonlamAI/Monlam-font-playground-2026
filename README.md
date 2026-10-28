# Monlam Font Playground & Typography Suite

Interactive playground for Monlam IT Tibetan typefaces, plus an Admin CMS for managing font and keyboard assets.

## Prerequisites

- Node.js 20+

## Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
# Edit ADMIN_EMAIL / ADMIN_PASSWORD / SESSION_SECRET as needed

# Terminal A — API + SQLite CMS backend (port 8787)
npm run server

# Terminal B — Vite frontend (port 3000)
npm run dev

# Terminal C — Maildev SMTP catcher (optional, for feedback email testing)
npm run mail

# Or all three together:
npm run dev:all
```

- Public site: http://localhost:3000/
- Admin CMS: http://localhost:3000/admin (login with `ADMIN_EMAIL` + `ADMIN_PASSWORD` from `.env.local`)
- Maildev inbox (local SMTP): http://localhost:1080

Font and keyboard binaries are stored **locally** under `server/uploads/` (Bodyig 4.0.1 fonts ≈ 0.07–1.9&nbsp;MB each) and served at `/uploads/...`. Vite proxies `/api` and `/uploads` to the API in development.

To refresh catalog metadata + DB links from a Bodyig package already copied into `server/uploads`:

```bash
npm run sync:bodyig
```

## Admin CMS

Admins can:

- Create / edit / delete font assets and metadata
- Classify fonts as **Normal** or **Special**
- Configure per-font preset availability, content overrides, and excluded characters (Special fonts)
- Manage playground **Presets** (sample texts) under `/admin/presets`
- Upload font binaries to project-local storage
- Preview samples before publishing
- Publish / unpublish fonts (public site only shows `published`)
- Manage keyboard assets, layout JSON, and font associations
- Download suites that include uploaded font files when available
- Review user **Feedback** (message, attachments, status) under `/admin/feedback`

## Feedback

Public users submit feedback (optional contact email + image/video attachments) from the header **Feedback** button (modal).
Submissions are always stored in SQLite + `server/uploads/feedback/`. Email to `FEEDBACK_TO_EMAIL` (defaults to `ADMIN_EMAIL`, e.g. `hello@monlam.ai`) is attempted via SMTP (`SMTP_HOST`, etc.); if mail fails, the form still succeeds and the CMS retains the entry. Each visitor is limited to `FEEDBACK_DAILY_LIMIT` submissions per UTC day (default 3), enforced on the server via cookie, IP hash, and optional contact email.

### Local SMTP testing (Maildev)

[Maildev](https://github.com/maildev/maildev) is an open-source SMTP server + web inbox for development. `.env.example` points at it by default:

| Setting | Value |
|--------|--------|
| `SMTP_HOST` | `127.0.0.1` |
| `SMTP_PORT` | `1025` |
| Web inbox | http://localhost:1080 |

Run `npm run mail` (or `npm run dev:all`), submit feedback, then open the Maildev UI to read the message. No real mailbox or API key required.

For production, replace `SMTP_*` with your provider (SendGrid, Amazon SES, Postmark, etc.).

Env vars: see `.env.example` (`FEEDBACK_TO_EMAIL`, `ADMIN_EMAIL`, `FEEDBACK_DAILY_LIMIT`, `SMTP_*`, `FEEDBACK_FROM_EMAIL`).

## Production (EC2)

Font files stay on the EC2 disk with the app (no S3 required). **CMS data lives in SQLite** (`DATABASE_PATH`) and **`UPLOADS_DIR`** — both are gitignored. Point them at **absolute paths outside the deploy directory** (for example `/var/lib/monlam/cms.sqlite` and `/var/lib/monlam/uploads`) so `git pull`, `npm install`, and `npm run build` never create a fresh empty database. Back up those paths on EBS.

**After every `git pull`, you must reinstall (if deps changed), rebuild the SPA, and restart the Node process.** `git pull` alone does not update what users see—the site is served from the built `dist/` folder.

```bash
cd /var/www/Monlam-font-playground-2026
git pull origin main
npm install          # uses .npmrc legacy-peer-deps if needed
npm run build        # writes fresh dist/ assets
NODE_ENV=production npm start   # or: sudo systemctl restart monlam  /  pm2 restart …
```

Express serves the Vite `dist/` build, `/api`, and `/uploads` on `PORT` (default 8787). Put nginx in front for TLS if needed. Hard-refresh the browser (or clear cache) after deploy if the UI still looks old.

**Large Bodyig `.zip` uploads (admin):** Import reads the zip in the browser and only sends layout JSON to the API. **Save** uploads the full download package — allow up to **300 MB** on nginx (`client_max_body_size 300m;` in the `location` that proxies `/api`). If the site uses **Cloudflare** (orange cloud), proxied uploads are capped at about **100 MB** unless you use Enterprise or DNS-only (grey cloud) for the origin / a dedicated upload host. See `deploy/nginx.example.conf`.

Env vars: see `.env.example` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `DATABASE_PATH`, `UPLOADS_DIR`).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite frontend |
| `npm run server` | Express CMS API |
| `npm run mail` | Maildev SMTP + inbox (ports 1025 / 1080) |
| `npm run dev:all` | API + Vite + Maildev |
| `npm run build` | Production SPA build |
| `npm start` | Production Express (API + static + uploads) |
