# US1 — About Page: Manual Test Checklist

## Hero section

- [ ] Name "Jordan Lee" renders in large gradient text (purple → lighter)
- [ ] "Available for work" badge is visible with pulsing green dot when `profile.available === true`
- [ ] Role ("Full-Stack Engineer") is displayed below the name
- [ ] Tagline renders in italic style
- [ ] All skills from `profile.skills` appear as pill tags
- [ ] Location ("San Francisco, CA") shows with a map pin indicator

## Details section

- [ ] Bio text renders with correct line breaks (`white-space: pre-line`)
- [ ] Interests sidebar card shows all items from `profile.interests`
- [ ] Two-column layout on desktop (content + sticky sidebar)
- [ ] Stacks to single column on mobile (≤768 px)

## Visual treatment

- [ ] Ambient radial glow behind hero name on wider screens
- [ ] Section fades in / has correct spacing from nav bar (64 px offset)
- [ ] No layout overflow at any tested breakpoint
