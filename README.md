# Portfolio / Izak Hyllested

A mobile-first Next.js portfolio, built from the supplied landing sketch and warm beige/red design direction. Four fixed corner links frame an intentionally empty first screen. Work follows below with project details, an introduction and contact section. Optional hero photography, paper grain, menu/reveal animations and subtle parallax are editable. Reduced motion is always respected.

## Development

Node 24, npm. Run `npm ci`, `npm run dev`. Release validation: `npm run check` (TypeScript, store and validation tests, production build).

## Editor

`/admin` and `/admin/editor` open the same portfolio-only editor. There is no authentication, social generator or stock control. Same-origin checks prevent cross-site writes but do not authenticate visitors: anyone with access can edit and publish, as requested.

Edit navigation labels, text, hero image, project images and crops, project order, project links, palette and motion. New project entries can be added or removed. Save draft leaves the public site unchanged; Preview shows the current unsaved content in an embedded mobile view. Publish updates the public site; Restore swaps back to the preceding published version. Revision conflicts reject stale saves rather than overwriting another editor's work. Reload explicitly discards unsaved changes after confirmation.

The initial Plaisir and Blågårds Apotek covers are illustrative typography, not screenshots. Replace covers and review sample descriptions before promoting this portfolio professionally. Email is intentionally empty until a real contact address is supplied.

## Vercel / database

Target repository: `izakjonathan/portfolionew`. Target Vercel project: `portfolionew`, in `izakh-s-projects`. The Vercel project is connected to this repository. Database provisioning and live validation are tracked separately from local checks.

Connect a dedicated Neon Postgres database via Vercel Storage and provide `DATABASE_URL` to production, preview and development, then redeploy. The application creates only `portfolio_content` and `portfolio_media`, lazily on first database use. It does not use or modify the source project's tables. Public rendering falls back to bundled content if the database is absent; the editor explains that persistence is unavailable and disables saves and uploads. There is no local-storage substitute presented as shared persistence.

Uploaded raster images are resized, orientation-corrected, encoded as WebP and stored in the database. Input limit is 4 MB / 40 megapixels; output maximum is 1.5 MB at 2000 × 2400 pixels. SVG uploads are rejected. For a small portfolio this keeps setup to one database; use object storage if the media collection grows substantially. Local typographic covers remain versioned in `public/projects`.

No secrets belong in Git. `.env.example` lists the required setting. Production deployment should use Node 24 and Next.js framework detection with the included lockfile.

## Provenance

The supplied Blågårds Apotek v1.15.1 project informed the motion timings, draft/publish/restore workflow, revision checks, crop controls and same-origin request validation. `lib/motion.ts`, `lib/color.ts` and `lib/editor-request.ts` were adapted from that source. Public design and content schema are specific to this new portfolio.
