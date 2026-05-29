# Quickstart: Personal Website

## Prerequisites

- Node.js 20 LTS
- npm 10+ or compatible package manager

## Project Status

✅ Fully scaffolded. All 41 tasks complete.

## Setup & Development

1. Install dependencies:

```bash
npm install
```

2. Run the local development server:

```bash
npm run dev
# Starts at http://localhost:3000
```

3. Pages to review in a browser:
   - `/` — About (Jordan Lee hero + bio)
   - `/projects` — Projects grid with featured/regular cards
   - `/cv` — CV timeline + skills
   - `/contact` — Contact methods + fallback card

## Build & Export

```bash
npm run build
```

Output is written to `out/` as a fully static site (no server runtime required).
Deploy the `out/` directory to any static host (Netlify, Vercel static, GitHub Pages, etc.).

## Project Structure

```
app/               # Next.js App Router pages & root layout
  layout.tsx       # Root layout (Inter font, SiteNav, footer)
  page.tsx         # /  (About)
  cv/page.tsx      # /cv
  projects/page.tsx# /projects
  contact/page.tsx # /contact
  globals.css      # Design system (CSS variables, utility classes)

components/
  navigation/      # SiteNav (responsive hamburger)
  sections/        # Page-level section components + CSS Modules
  ui/              # Container, SectionShell

content/           # Mocked data (TypeScript modules — no API calls)
  types.ts         # Shared interfaces
  profile.ts       # Jordan Lee persona
  cv.ts            # Experience, education, skill groups
  projects.ts      # 5 projects (2 featured)
  contact.ts       # Contact methods + fallback

specs/001-personal-site/  # All design artifacts
  spec.md / plan.md / tasks.md / research.md / data-model.md
  contracts/ quickstart.md

tests/manual/      # Manual validation checklists per user story
```

## Validation Checklist

- [ ] `npm run build` completes with exit code 0 and writes to `out/`
- [ ] All four routes are present in `out/` (index.html, projects/index.html, cv/index.html, contact/index.html)
- [ ] Navigation works on desktop (horizontal links) and mobile (hamburger drawer)
- [ ] About page hero name renders in gradient; available badge shows green dot
- [ ] Projects grid renders featured cards in wider row, regular cards below
- [ ] CV timeline shows experience, education, and skills sections
- [ ] Contact page shows all 4 method rows; email has accent highlight
- [ ] No horizontal overflow at 375 px viewport width
- [ ] No TypeScript or ESLint errors (`npm run lint`)
