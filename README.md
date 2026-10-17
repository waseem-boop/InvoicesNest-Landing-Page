# InvoicesNest landing design preview

Independent preview project. All changes stay in this folder; invoice-frontend is untouched.

## Start

```powershell
cd "D:\Saas Apps\invoice-gen\invoices-nest new landing page"
npm install
npm run dev
```

Open http://localhost:3005.

The homepage retains the original reference section structure, GSAP reveal/hover animations, smooth scrolling, moving card marquees and hero perspective. Colours and content are adapted to white/indigo InvoicesNest branding. The original navbar component is retained with product-relevant links. A working invoice generator replaces only the hero dashboard image inside its animated wrapper. The tilt finishes near the top of the builder, independent of the larger form height; ResizeObserver refreshes scroll measurements after the builder loads. Reduced-motion preferences remain supported.

The generator is a separate copy of the existing frontend generator, with local preview mode enabled. It supports editable invoice details, logo, searchable currency, line items, tax, flat discount, shipping, amount paid, totals and a local draft. Print / Save PDF opens a print-ready invoice; select Save as PDF in the browser dialog. No backend or live account is required for this demo. Customer-entered print content is escaped. Browser popups must be allowed for printing.

Demo dashboard numbers are clearly labelled sample data. Login, register, pricing and contact links lead to the existing production website. Only the homepage and a small fallback 404 remain in this project. The preview stays noindex.

## Archived template files

The old About, Product, Features, Pricing, Contact, FAQ and Blog demo pages, their unused components/animation hooks, and unused assets are backed up outside this project:

`D:\Saas Apps\invoice-gen\landing-backups\homepage-only-2026-10-17T11-58-58-259Z`

`archived/` preserves the original project-relative paths. `original/` contains copies of files changed during cleanup. The backup also includes the asset inventory and the removed CSS background declarations.

The asset folder was reduced from 222 files (135.85 MiB) to 28 files (4.20 MiB). The 194 archived files include unused template videos, images and icons. Remaining assets include the official logo, homepage illustrations/icons and fonts. These are folder totals, not the number or size of requests loaded on a visit.

## Font loading

Satoshi uses Fontshare's official stylesheet (400, 500 and 700), with preconnections to its API and font CDN. Inter Tight uses `next/font/google` as a variable font; Instrument Serif uses its normal and italic 400 styles. Their generated CSS variables retain the existing body and accent font assignments. Next.js downloads the Google fonts at build time and serves the generated files from this site; browsers do not request them from Google.

The previous nine OTF/TTF files are backed up in `D:\Saas Apps\invoice-gen\landing-backups\font-loading-2026-10-17T12-14-00-585Z`. After this migration, `public/assets` contains 19 files (2.55 MiB). Generated Next.js font files are build output and are not included in that folder total. Satoshi requires access to Fontshare at runtime, and a build using uncached Google fonts requires network access.

## CSS maintenance

Authored CSS uses two-space indentation, expanded declarations and readable media/keyframe blocks. The formatter preserves class names, rule order and file order. Production CSS in `.next` is still minified automatically by Next.js.

```powershell
npm run css:format
npm run css:check
npm run css:audit
```

`css:format` formats only CSS inside `src/`. `css:check` checks formatting without writing. `css:audit` reports rules that require absent `rt-`, `nest-` or `clean-` classes. It includes source/config strings, animation selectors and dynamic class prefixes, and retains whole selector groups when any branch might match. Global/framework rules, keyframes and unknown selectors are preserved. This is a conservative static audit, not a replacement for browser checks across interactive states.

The cleanup removed 1,815 rules and retained 1,199. Style sources went from 348,984 to 162,317 bytes after formatting. Original styles and the removal/verification reports are in `D:\Saas Apps\invoice-gen\landing-backups\css-cleanup-2026-10-17T12-21-46-394Z`. Comparison confirmed that retained declarations, selector order and keyframes only received formatting, and components/animation hooks were unchanged. The production build passed; a fresh browser visual review remains pending because local browser control was disabled.

## Checks

The production build and asset reference check passed after the homepage-only cleanup. The build contains only `/` and `/_not-found`. A fresh desktop/mobile visual review and browser print verification still need to be completed. No production deployment was performed.

```powershell
npm run typecheck
npm run check:assets
npm run css:check
npm run css:audit
npm run build
```

Production integration is intentionally separate: account sessions, backend PDF generation, final responsive visual and animation checks, and replacing the live homepage can be addressed after design approval.
