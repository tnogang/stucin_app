# Agent Guide: Avtovleka in popravila Štucin

This file is a concise reference for AI coding agents working on this project. It describes the technology stack, build/test workflow, code layout, and conventions observed in the codebase.

## Project overview

This is the marketing / operations website for **Avtovleka in popravila Štucin**, an automotive towing and repair business in Vipava, Slovenia. It is a single-page React application built with Vite, TypeScript, Tailwind CSS, and shadcn/ui. The public site presents services, company info, a gallery, contact/location pages, and a privacy/cookie policy. A password-protected internal module under `/rent` manages a small vehicle-rental workflow backed by Supabase, with an admin/worker role split.

The project was bootstrapped via Lovable (the README still references it), so the repository contains many shadcn/ui scaffold files and `components.json` is configured for that stack.

## Technology stack

- **Build tool / dev server:** Vite 8.x (`vite.config.ts`), React via `@vitejs/plugin-react-swc`
- **Framework:** React 18.x, rendered with `createRoot` in `StrictMode`
- **Language:** TypeScript 5.x (strict checks are disabled in `tsconfig.app.json`)
- **Routing:** `react-router-dom` v6 (browser-router)
- **Styling:** Tailwind CSS 3.x with custom CSS variables; `src/index.css` defines a dark premium theme
- **UI components:** shadcn/ui default style, Radix UI primitives, `lucide-react` icons
- **State / data fetching:** `@tanstack/react-query` (v5) for the public site; custom hooks + Supabase for the rent module
- **Forms / validation:** `react-hook-form` + `zod` + `@hookform/resolvers`
- **3D / animation:** `@react-three/fiber`, `@react-three/drei`, `framer-motion` (page transitions + loading screen)
- **PDF generation:** `jspdf` + `jspdf-autotable` (with custom fonts/logo helpers in `src/lib/pdfFonts.ts` and `src/lib/pdfLogo.ts`)
- **OCR:** `tesseract.js` for license-plate capture in the rent module
- **Backend / auth / storage:** Supabase (`@supabase/supabase-js`) for the rent module
- **PWA bits:** `public/manifest.json` and a service worker `public/sw.js`, registered in `src/main.tsx` (production only); used by the rent module for browser notifications
- **Testing:** Vitest + jsdom + `@testing-library/react` + `@testing-library/jest-dom`
- **Linting:** ESLint 9 flat config with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

## Key configuration files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts |
| `vite.config.ts` | Vite config; `@/` alias resolves to `./src`; dev server runs on port 8080 (host `::`, HMR overlay disabled); `lovable-tagger` is loaded in development |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` | TypeScript project references; strict checks off |
| `tailwind.config.ts` | Tailwind theme, custom colors (`tow-*`, `service-*`, `emergency-*`, `success-*`, `sidebar-*`), custom animations |
| `postcss.config.js` | Tailwind + autoprefixer |
| `components.json` | shadcn/ui configuration |
| `eslint.config.js` | ESLint flat config; ignores `dist`; recommended TypeScript + React hooks/refresh rules |
| `vitest.config.ts` | Vitest config; jsdom environment; globals on; test setup at `src/test/setup.ts`; `@/` alias |
| `index.html` | Entry HTML; loads `src/main.tsx` |
| `.env` | Supabase environment variables for the rent module (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) |

## Build and development commands

```bash
# Install dependencies
npm install

# Start the dev server (port 8080)
npm run dev

# Production build (outputs to `dist/`)
npm run build

# Development build
npm run build:dev

# Preview the production build
npm run preview

# Run ESLint
npm run lint

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Verified command results (as of the last agent run)

- `npm test` — 3 tests passed (2 test files).
- `npm run build` — succeeds; outputs to `dist/`.
- `npm run lint` — reports 2 errors and several warnings. The errors are in generated/scaffolded files (`src/components/ui/textarea.tsx` empty interface, and `tailwind.config.ts` using `require()`). Builds still pass despite these lint errors.

## Code organization

```
src/
├── App.tsx              # Root component: providers, route definitions, loading screen, cookie consent
├── main.tsx             # React root + router + helmet + language providers; registers /sw.js service worker in production
├── index.css            # Tailwind directives, CSS variables, custom utilities
├── App.css              # Legacy Vite template styles (mostly unused)
├── assets/              # Static images (workshop, fleet, logos)
├── components/
│   ├── ui/              # shadcn/ui components (auto-generated; do not hand-edit unless necessary)
│   ├── 3d/              # Three.js / R3F components (e.g. FloatingCar)
│   ├── home/            # Public landing-page sections
│   ├── layout/          # Header, Footer, Layout, LanguageSwitcher
│   ├── rent/            # Rent-module specific components (CameraCapture, etc.)
│   └── CookieConsent.tsx, LoadingScreen.tsx, NavLink.tsx
├── hooks/               # Custom React hooks (incl. rent-module hooks and shadcn toast/mobile hooks)
├── i18n/                # LanguageContext + translations (sl/it/en)
├── lib/                 # Utility modules: supabase, utils, PDF generation, rent mappers/storage, roles
├── pages/               # Route-level page components
│   ├── Index.tsx, Storitve.tsx, ONas.tsx, Galerija.tsx, Lokacija.tsx, Kontakt.tsx, Zasebnost.tsx, NotFound.tsx
│   └── rent/            # Rent module pages (login, dashboard, vehicles, rentals, signatures, users, history)
├── test/                # Test setup and a placeholder test
├── types/               # TypeScript types (notably `rent.ts`)
└── vite-env.d.ts        # Vite client types
```

## Routing

Public routes are declared in `src/App.tsx`:

| Path | Component |
|------|-----------|
| `/` | `Index` |
| `/storitve` / `/storitve/*` | `Storitve` |
| `/o-nas` | `ONas` |
| `/galerija` | `Galerija` |
| `/lokacija` | `Lokacija` |
| `/kontakt` | `Kontakt` |
| `/zasebnost` | `Zasebnost` |
| `/rent/*` | `RentRouter` |
| `*` | `NotFound` |

The `/rent` sub-router (`src/pages/rent/RentRouter.tsx`) is protected by two guards built on `useRentAuth`: `RequireAuth` (any logged-in user, wrapped in `RentLayout`) and `RequireAdmin` (via `isAdmin` from `src/lib/roles.ts`):

| Path | Purpose | Guard |
|------|---------|-------|
| `/rent/login` | Login page (redirects to `/rent` if already logged in) | public |
| `/rent` | Dashboard | auth |
| `/rent/vozila` | Vehicle list | auth |
| `/rent/vozila/novo` | New vehicle form | admin |
| `/rent/vozila/:id` | Edit vehicle form | admin |
| `/rent/izposoja/nova` | Create rental order | admin |
| `/rent/izposoja/:id` | Rental detail | auth |
| `/rent/izposoja/:id/podpis` | Signature capture | auth |
| `/rent/izposoja/:id/vrnitev` | Return flow | auth |
| `/rent/uporabniki` | User management | admin |
| `/rent/zgodovina` | Rental history | auth |

Unknown `/rent/*` paths redirect to `/rent`.

### Roles

`src/lib/roles.ts` defines the admin/worker split. A user is an admin if their Supabase `user_metadata.role` or `app_metadata.role` is `'admin'`, or if their email is in the hard-coded `ADMIN_EMAILS` fallback list (comments are in Slovenian). Every other logged-in user is a "Delavec" (worker). Admin-only routes are enforced client-side by `RequireAdmin`; this must be backed by RLS on the Supabase side.

## Internationalization

- `src/i18n/translations.ts` contains translation dictionaries for **Slovenian (`sl`)**, **Italian (`it`)**, and **English (`en`)**.
- `src/i18n/LanguageContext.tsx` is a simple React context that defaults to `sl` and exposes `language`, `setLanguage`, and `t` (the active dictionary).
- Public UI text is read from `t.*` paths; the rent module UI is mostly hard-coded in Slovenian.

## Rent module (Supabase)

The rent module requires Supabase credentials. In `src/lib/supabase.ts` the client is created from:

```ts
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_ANON_KEY
```

If these are missing, the module logs a warning and will not function.

### Database shape (inferred from code)

- `vehicles` table — columns roughly match `RentVehicle` in `src/types/rent.ts` (snake_case in DB, camelCase in app).
- `rental_orders` table — stores customer, rental, condition, signatures, and documents as JSON/JSONB columns.
- Supabase Storage buckets: `rental-pdfs`, `rental-signatures`, `rental-photos`.

### Edge functions (`supabase/`)

- `supabase/functions/rental-returned-notify/index.ts` — Deno edge function invoked by a Database Webhook on `UPDATE` of `rental_orders`; when `status` transitions to `returned` it sends a Telegram message via the Bot API. Secrets (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `RENTAL_WEBHOOK_SECRET`) are set with `supabase secrets set`; the webhook authenticates with the `x-rental-webhook-secret` header (`verify_jwt = false` in `supabase/config.toml`). Setup and test steps are in `supabase/README.md` (Slovenian).

### Key rent files

| File | Role |
|------|------|
| `src/lib/supabase.ts` | Supabase client + table types |
| `src/lib/rentMappers.ts` | DB row ↔ app model mapping |
| `src/lib/rentStorage.ts` | Upload PDFs/signatures/photos to Supabase Storage |
| `src/lib/pdfGenerator.ts` | Generate pre/post rental PDFs with jsPDF |
| `src/lib/pdfFonts.ts` / `src/lib/pdfLogo.ts` | Embedded font and logo assets for the generated PDFs |
| `src/lib/roles.ts` | Admin/worker role helpers (`isAdmin`, `isWorker`, `getRoleLabel`) |
| `src/hooks/useRentAuth.ts` | Supabase auth session hook |
| `src/hooks/useVehicles.ts` | Vehicles CRUD hook |
| `src/hooks/useRentals.ts` | Rental orders CRUD hook |
| `src/hooks/useLicensePlateOcr.ts` | Tesseract OCR for license plates |
| `src/hooks/useRentNotifications.ts` | Browser/service-worker notifications for the rent module; per-user preference stored in `localStorage` under `stucin-notifications-<email>` |
| `src/pages/rent/RentLayout.tsx` | Shared layout shell for authenticated rent pages |
| `src/pages/rent/UsersPage.tsx` | Admin user management page |
| `src/types/rent.ts` | Domain types and defaults |

## Code style and conventions

- **Imports:** Prefer `@/` path aliases for project files; use named exports for hooks/components unless the file is a page/route default export.
- **Components:** Functional components with hooks. shadcn/ui components are decorated with `cn()` from `src/lib/utils.ts` for class merging.
- **Styling:** Tailwind utility classes. Custom visual effects live in `src/index.css` under `@layer components`.
- **Naming:** Files use `PascalCase.tsx` for components/pages, `camelCase.ts` for utilities/hooks. Slovene/Italian translations are keyed in English for consistency.
- **Language:** The public site content and rent-module UI are in Slovenian; code comments in rent-module files (e.g. `src/lib/roles.ts`) are also Slovenian. Project-level docs (README, this file) are in English.
- **Forms:** Use `react-hook-form` + `zod` schemas where validation is required (some forms are simple controlled inputs).
- **Environment access:** Use `import.meta.env` for Vite env vars; Supabase keys are the only secrets currently consumed by the client.

## Testing instructions

- Tests live next to source code or in `src/test/`.
- Test file pattern: `src/**/*.{test,spec}.{ts,tsx}`.
- `src/test/setup.ts` imports `@testing-library/jest-dom` and polyfills `window.matchMedia` for jsdom.
- Current tests:
  - `src/test/example.test.ts` — placeholder.
  - `src/lib/pdfGenerator.test.ts` — verifies PDF data URLs are generated for pre- and post-rental documents.
- Run with `npm test`.

## Linting notes

`npm run lint` currently reports the following errors (build still succeeds):

- `src/components/ui/textarea.tsx` — empty interface equivalent to its supertype.
- `tailwind.config.ts` — `require("tailwindcss-animate")` violates `@typescript-eslint/no-require-imports`.

The warnings are mostly `react-refresh/only-export-components` in shadcn/ui components and hooks that export both components and utilities.

## Security considerations

- The Supabase anon key is exposed to the browser by design. Row-level security (RLS) must be enforced on the `vehicles` and `rental_orders` tables and storage buckets; the current code does not show RLS policies, so verify them in the Supabase dashboard.
- Admin authorization is enforced client-side only (`RequireAdmin` + `src/lib/roles.ts`, with a hard-coded admin email fallback). Server-side enforcement (RLS / Supabase Edge Functions) is required for real protection — treat the client guard as UX, not security.
- The rent module uses password-based Supabase auth. Do not store credentials in code.
- Contact form data on the public site is not wired to a backend in the visible code; if it is connected later, validate and sanitize inputs server-side.
- The `.env` file holds credentials; it is already in `.gitignore` but confirm it is never committed. Note: `supabase_login.json` sits in the repo root — treat it as sensitive and do not commit or expose it.

## Deployment

- The project builds a static site into `dist/` (`npm run build`); serve `dist/` with any static-file host.
- `public/manifest.json` and `public/sw.js` ship a basic PWA setup; the service worker is registered only in production builds.
- The README describes Lovable-hosted deployment (`Share -> Publish` in Lovable).
