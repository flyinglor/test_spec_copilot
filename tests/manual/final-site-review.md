# Final Site Review

**Build date**: 2025-07  
**Next.js version**: 15.5.18  
**Build command**: `npm run build`  
**Build exit code**: 0

## Build Output

All 5 routes compiled and exported to `out/` successfully:

| Route         | Output file                    | First Load JS |
|---------------|--------------------------------|---------------|
| `/`           | `out/index.html`               | 103 kB        |
| `/contact`    | `out/contact/index.html`       | 103 kB        |
| `/cv`         | `out/cv/index.html`            | 103 kB        |
| `/projects`   | `out/projects/index.html`      | 103 kB        |
| `/_not-found` | `out/404/index.html`           | 104 kB        |

All routes are prerendered as static content (`○ Static`). No server runtime required.

## TypeScript & Lint

- TypeScript: ✅ No errors after fixing `method.href` → `method.url` in `contact-methods.tsx`
- ESLint: ✅ Passed (no errors reported during build)

## Manual Validation Checklist

### Navigation (all routes)

- [ ] Fixed top nav visible on all four pages
- [ ] Active route highlighted in nav
- [ ] Hamburger menu appears at ≤640px and opens/closes correctly
- [ ] All four nav links navigate to the correct route

### About page (`/`)

- [ ] Giant gradient name renders in hero
- [ ] "Available for opportunities" badge with pulsing green dot visible
- [ ] Skills tags wrap correctly at narrow widths
- [ ] Bio and interests section visible below hero

### Projects page (`/projects`)

- [ ] Featured projects render in wider cards (two-column on desktop)
- [ ] Regular projects render in standard grid
- [ ] Cards link to `liveUrl` or `url` in a new tab
- [ ] Tags render inside each card

### CV page (`/cv`)

- [ ] Experience entries render in timeline with org name in accent color
- [ ] Education entry visible
- [ ] Skills grid shows all 4 groups
- [ ] Date formatting: past dates show "MMM YYYY"; current role shows "Present"
- [ ] Timeline stacks to single column at ≤768px

### Contact page (`/contact`)

- [ ] All 4 contact methods visible
- [ ] Email row has accent background highlight (primary)
- [ ] Non-email links open in a new tab
- [ ] Fallback card visible below contact methods

### Responsive

- [ ] No horizontal overflow at 375px viewport
- [ ] No horizontal overflow at 768px viewport
- [ ] Layout is comfortable at 1440px viewport

## Known Issues / Notes

- `npm audit` reports 2 moderate severity vulnerabilities in development-only transitive dependencies. Not exploitable in a static export deployed to a CDN.
- No binary image assets are included; the design uses CSS-only visual treatments.
