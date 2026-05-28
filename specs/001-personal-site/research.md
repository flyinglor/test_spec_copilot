# Research: Personal Website

## Decision: Use Next.js app router with static export

**Rationale**: Next.js provides file-based routing, a solid React development model,
and a straightforward static hosting path. Static export satisfies the constitution's
static-first requirement while keeping deployment simple.

**Alternatives considered**:
- Plain HTML/CSS/JavaScript: simpler deployment, but weaker maintainability for a
  multi-page portfolio with reusable sections.
- Fully dynamic Next.js rendering: rejected because the feature explicitly does not
  need server-side runtime behavior or database-backed content.

## Decision: Store mocked content in embedded typed modules

**Rationale**: TypeScript content modules keep project data versioned with the UI,
remove the need for external storage, and make static generation deterministic.

**Alternatives considered**:
- Local JSON files: workable, but weaker typing and less ergonomic imports for a
  small TypeScript app.
- Headless CMS or database: rejected because the feature scope explicitly uses
  mocked embedded data and no database.

## Decision: Prioritize layout-driven visual identity over runtime interactivity

**Rationale**: The site needs to feel sleek and distinctive, which is better served by
strong typography, composition, color, and motion choices than by heavy client-side
logic. This also aligns with the constitution's minimal complexity rule.

**Alternatives considered**:
- Animation-heavy interactive experience: rejected because it risks hurting mobile
  usability and performance.
- Generic template styling: rejected because it would not meet the standout visual goal.

## Decision: Validate quality through build output plus manual responsive review

**Rationale**: For a static presentation site, the cheapest effective checks are a
production build/static export, browser review across mobile and desktop widths, and
inspection for broken links or missing assets.

**Alternatives considered**:
- Full end-to-end automation before first implementation: useful later, but not the
  minimum necessary planning baseline for this scope.