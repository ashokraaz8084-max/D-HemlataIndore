# D Himmatlal and Company

Premium luxury e-commerce website for a 65-year heritage home furnishing brand based in Indore, Madhya Pradesh.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/himmatlal run dev` — run the frontend (port varies, proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifacts/himmatlal), Tailwind CSS, shadcn/ui, wouter, React Query
- API: Express 5 (artifacts/api-server)
- DB: PostgreSQL + Drizzle ORM (lib/db)
- Auth: JWT (Bearer token in localStorage + cookie), bcryptjs
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema.ts` — DB schema (source of truth)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API)
- `lib/api-client-react/src/generated/` — Generated hooks and Zod schemas (do not edit manually)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/himmatlal/src/` — React frontend
- `artifacts/himmatlal/src/pages/` — Public pages (Home, About, Products, Gallery, Blog, Testimonials, Contact)
- `artifacts/himmatlal/src/pages/admin/` — Admin CRUD pages
- `artifacts/himmatlal/src/components/` — Navbar, Footer, AdminLayout, AdminGuard

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → React Query hooks used throughout frontend
- Auth uses JWT stored in localStorage (via `setAuthTokenGetter`) attached as Bearer token to all requests
- Admin panel at `/admin` (login), `/admin/dashboard` and sub-routes (all protected by AdminGuard)
- WhatsApp integration on all product cards and hero CTA — links to `wa.me/{number}`
- Luxury color palette: dark brown (`hsl(28 35% 12%)`), gold (`hsl(42 80% 42%)`), cream background

## Product

- Public pages: Home (hero, categories, featured products, testimonials, CTA), About, Products (filtered by category), Product Detail, Gallery, Blog, Blog Detail, Testimonials, Contact
- Admin panel: Dashboard stats, Site Settings, Hero, About, Categories (CRUD), Products (CRUD), Gallery (CRUD), Blogs (CRUD), Testimonials (CRUD), Contact Details, Inquiries (view/delete)

## User preferences

- Luxury heritage aesthetic: serif fonts (Playfair Display), warm amber/gold palette, dark brown backgrounds for hero sections
- WhatsApp floating button and CTAs throughout the site
- No payment processing needed — inquiry-based business model

## Gotchas

- bcrypt hash must use `$2b$` prefix (from Node.js bcryptjs) — `$2a$` hashes will fail comparison
- Admin token stored in localStorage, passed via `setAuthTokenGetter` to API client
- API server runs at port 8080, proxied via shared proxy at `/api`
- Frontend workflow needs restart after code changes (Vite HMR usually handles it otherwise)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
