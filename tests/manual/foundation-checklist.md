# Foundation Checklist — Manual Tests

## Navigation

- [ ] Nav bar renders at top on all 4 routes (`/`, `/projects`, `/cv`, `/contact`)
- [ ] Active route link is visually distinct (accent colour or underline)
- [ ] Desktop: horizontal link row is visible
- [ ] Mobile (≤640 px): hamburger icon visible, links hidden; tap opens drawer, tap again closes it
- [ ] Logo/home link navigates to `/`

## Routes accessible

- [ ] `/` — About page loads without error
- [ ] `/projects` — Projects page loads without error
- [ ] `/cv` — CV page loads without error
- [ ] `/contact` — Contact page loads without error

## Responsive layout

| Breakpoint | Check |
|---|---|
| 375 px | No horizontal overflow; nav hamburger shown; single-column layout |
| 768 px | Partial two-column or single-column depending on section; nav links visible |
| 1100 px | Full-width container capped at `--max-width`; all multi-column grids active |

## Global styles

- [ ] Background is `#090909` dark across all pages
- [ ] Font (Inter) loads; body text is readable and anti-aliased
- [ ] No visible layout shift on load (no unstyled flash)
