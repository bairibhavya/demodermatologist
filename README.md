# AUREL Dermatology — React + Vite (Photo Glassmorphism)

**This is the React/Vite implementation, not the earlier static HTML/Python version.** The code was redesigned to match `docs/APPROVED-VISUAL-DIRECTION.png`: photographic, ivory-and-blush aesthetic, floating glass cards, editorial typography and responsive layouts.

## Run on your Windows computer (VS Code)

1. Unzip this folder (you should see `package.json` and `src/` at the top level).
2. Open the **AUREL-Dermatology-React-Production** folder in VS Code.
3. In Terminal, run:

   ```powershell
   npm install
   npm run dev
   ```

4. Open the address printed by **Vite**, typically `http://localhost:5173/`. If you still have the previous Python website using 5173, run `npm run dev -- --port 5175 --strictPort` and use `http://localhost:5175/` instead.
5. To build: `npm run build`, then `npm run preview`.

**Do not use `python -m http.server` for this React project.**

## Pages

- `/` — photo-led, responsive glassmorphic homepage
- `/treatments` — filterable treatment directory
- `/treatments/acne-care` and five other detail pages — interactive information tabs
- `/concerns` — skin and hair concerns
- `/about` — about/clinic philosophy
- `/doctors` — clinician profile placeholders
- `/clinic` — editorial clinic photo gallery
- `/faq` — accordion FAQs
- `/contact` — contact information and consultation CTA
- `/book` — appointment request form
- `/request-received` — accessible only after a confirmed request submission, not a fake success state
- `/admin` — protected appointment request console (secure backend required)
- `/privacy`, `/terms` — demo legal information to replace before launch

## Images

The UI uses editorial **photographic** images, not cartoons. Primary image URLs are Unsplash-hosted. When those cannot load, the site displays bundled photographic concept crops in `public/images/`, made from the approved generated design reference. These local images are **conceptual**, not photographs of your clinic, actual patients, doctors or clinical results.

Before delivering to an actual dermatologist: replace all images with clinic-owned or correctly licensed photography (and obtain consent for patient images). Update `src/data.js` for treatment images and copy.

## Appointment requests: secure, not fake

Local Vite (`npm run dev`) previews the booking UI but **cannot submit real patient requests** because Vercel API routes aren't running. The form deliberately displays “Preview only” rather than claiming a request was saved.

To activate in a real clinic, you must:
1. Create a **separate, clinic-owned Supabase project**. Don't reuse your real-estate CRM database for patient requests.
2. Review and run `database/001_aurel_appointments.sql` in that clinic Supabase project.
3. Create clinic-approved Supabase Authentication admin user(s). Supply their UUID(s) in the `ADMIN_USER_IDS` **server-side** variable.
4. Create a Cloudflare Turnstile widget for the live domain.
5. Configure the Vercel environment values shown below, and deploy.
6. Test booking request → Supabase record → admin session → status update on the live domain.
7. Publish verified clinic details, privacy/retention terms and clinical review before accepting patient contact data.

All `SUPABASE_SERVICE_ROLE_KEY` and `TURNSTILE_SECRET_KEY` values MUST stay server-side. Never put them in `VITE_` variables or commit a populated `.env` to Git.

### Environment setup

Copy `.env.example` to `.env.local` for local **public** clinic details. Vercel backend secrets must be set in **Vercel Project → Settings → Environment Variables**:

| Name | Scope | Purpose |
| --- | --- | --- |
| `VITE_CLINIC_NAME`, `VITE_CLINIC_PHONE`, `VITE_CLINIC_EMAIL`, `VITE_CLINIC_ADDRESS` | public frontend | Verified clinic identity |
| `SUPABASE_URL` | server only | Separate clinic Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Appointment insert/access; never expose |
| `SUPABASE_ANON_KEY` | server only (admin login endpoint) | Supabase Auth sign-in |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | server only (site key published via /api/config) | Spam verification |
| `ADMIN_USER_IDS` | server only | Allowed clinic admin UUIDs (comma-separated) |
| `ALLOWED_ORIGIN` | server only | Production URL for origin check |
| `TURNSTILE_EXPECTED_HOSTNAME` | server only | Your live booking domain |
| `CLINIC_TIMEZONE` | server only | e.g. Asia/Kolkata |

## Deployment to Vercel

- Commit the project root, including `api/`, `lib/`, `src/`, `public/`, `index.html`, `package.json`, and `vercel.json`.
- Import repository in Vercel, **Root Directory = project root**.
- Framework Vite, Build Command `npm run build`, Output Directory `dist`.
- Enable secure environment variables and run the production flow tests. Do not expose the API without completed privacy/security checks.
- Test all client-side routes by refreshing each route, and verify mobile viewport scroll behavior.

## Production readiness and outstanding checks

Available checks during generation:
- TypeScript JSX/JS source parser checks passed (the code is JavaScript/JSX, not TypeScript).
- Relative imports resolved; CSS stylesheet parsed.
- Appointment/admin API smoke tests passed in a mocked environment.
- Archive integrity was verified.

**Not yet verified:** A full Vite `npm run build`, real browser run, live photography URLs, actual patient/clinic details, and deployed Supabase/Turnstile integration. This environment could not reach the npm registry (`EAI_AGAIN`) and Chromium navigation was blocked by its sandbox policy. Before selling/deploying to a clinic, perform the install, build, desktop/mobile browser tests and real security review. Treat the downloaded ZIP as a complete development package, not a clinically production-approved service.

## Performance and accessibility

- React Router routes instead of separate `.html` pages.
- Framer Motion reveal interactions; GSAP ScrollTrigger hero parallax; reduced-motion support.
- Responsive 3/2/1-column layouts, mobile menu, photo fallbacks, semantic headings, labels, and keyboard focus indicators.
- No fabricated doctor credentials or patient outcome claims.
