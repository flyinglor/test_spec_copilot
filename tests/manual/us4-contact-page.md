# US4 — Contact Page: Manual Test Checklist

## Contact methods

- [ ] 4 methods render (email, github, linkedin, twitter)
- [ ] Email row uses `mailto:` href (no new tab)
- [ ] Other rows open in new tab with `rel="noopener noreferrer"`
- [ ] Primary method (email) has accent-dim background and accent border
- [ ] Each row shows: icon, label (uppercase), value

## Interactions

- [ ] Hovering a row slides it 4 px to the right
- [ ] Arrow (→) shifts colour to `--accent-light` on hover
- [ ] Icon background changes to accent-dim on hover

## Fallback card

- [ ] Fallback card renders below the methods with `contactFallback.heading` and `contactFallback.message`
- [ ] Card uses accent-dim background / subtle accent border

## Responsive

- [ ] 640 px: method rows shrink padding gracefully; icons still visible
