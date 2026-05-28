# Implementation Plan: Personal Website

**Branch**: `001-build-personal-site` | **Date**: 2026-05-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-personal-site/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a visually distinctive personal website with About, CV, Projects, and
Contact pages using Next.js in static export mode. Content is embedded as mocked
site data, the UI is responsive for desktop and mobile, and delivery focuses on
strong visual identity with minimal client-side complexity.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x with Next.js 15 static site configuration on Node.js 20 LTS

**Primary Dependencies**: Next.js, React, TypeScript, CSS Modules or global CSS, ESLint

**Storage**: Embedded content modules/files in the repository; no database

**Testing**: Next.js production build, static export validation, manual responsive browser checks, optional component tests if added during implementation

**Target Platform**: Modern desktop and mobile browsers on static hosting

**Project Type**: Static web application

**Performance Goals**: Fast first render on static hosting, smooth scrolling/transitions on standard devices, page content readable without layout shift during normal navigation

**Constraints**: Must statically export, use no database, keep data mocked and embedded, remain responsive on mobile, avoid unnecessary client-side runtime complexity, keep asset usage intentional

**Scale/Scope**: Four primary pages, one shared navigation shell, small embedded content collections for profile, CV, projects, and contact methods

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Static-First Delivery**: PASS. Next.js will be configured for static export with no server-side runtime or database dependency.
- **Responsive and Accessible UI**: PASS. Plan includes responsive layouts, semantic page structure, keyboard-usable navigation, and visible focus states.
- **Minimal Client-Side Complexity**: PASS. Primary content is pre-rendered from embedded data, with client-side code limited to presentation enhancements only.
- **Verifiable Release Checks**: PASS. Implementation must pass production build/static export and page-level responsive review before merge.
- **Content and Asset Discipline**: PASS. Mocked content and assets remain curated, purposeful, and sized for web delivery.

Post-design review: PASS. The data model, route contract, and quickstart preserve static hosting compatibility and do not introduce non-compliant dependencies.

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-site/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
app/
├── layout.tsx
├── page.tsx
├── cv/
│   └── page.tsx
├── projects/
│   └── page.tsx
└── contact/
  └── page.tsx

components/
├── navigation/
├── sections/
└── ui/

content/
├── profile.ts
├── cv.ts
├── projects.ts
└── contact.ts

public/
└── images/

styles/
└── globals.css

tests/
└── manual/
```

**Structure Decision**: Use a single Next.js app-router project optimized for static
export. Route-level pages live under `app/`, reusable presentational pieces live in
`components/`, and all mocked content is kept in `content/` so the UI can remain
static, typed, and easy to revise without adding a backend or database.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
