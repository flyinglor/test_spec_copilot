# US2 — Projects Page: Manual Test Checklist

## Layout

- [ ] Featured projects (FlowBoard, Spectral CLI) render in the wider `featuredGrid` (2-col on ≥900 px)
- [ ] Non-featured projects render in the standard 3-column `grid` (narrows on mobile)
- [ ] Each card shows: title, description, tags, year
- [ ] Card links open in new tab (external URLs)

## Interactions

- [ ] Hovering a card lifts it (translateY -3 px) and shows a box shadow
- [ ] Arrow icon (↗) shifts colour to `--accent-light` on hover

## Edge cases

- [ ] If `projects` array is empty, `ProjectsEmptyState` message is displayed

## Responsive

- [ ] 375 px: all cards stack to single column; tags wrap correctly
- [ ] 768 px: grid switches to appropriate column count
