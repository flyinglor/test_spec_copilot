# Tasks: Personal Website

**Input**: Design documents from `/specs/001-personal-site/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/site-routes.md](./contracts/site-routes.md)

**Tests**: Automated tests are not explicitly required in the specification. Validation tasks below use production build checks and manual responsive review.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js static site project and baseline tooling.

- [x] T001 Initialize the Next.js TypeScript project configuration in package.json
- [x] T002 Configure TypeScript and Next.js compiler settings in tsconfig.json
- [x] T003 Configure static export settings for the site in next.config.ts
- [x] T004 Create the base app-router directory structure in app/layout.tsx, app/page.tsx, app/cv/page.tsx, app/projects/page.tsx, and app/contact/page.tsx
- [x] T005 [P] Configure linting scripts and baseline ignore files in package.json, eslint.config.mjs, and .gitignore

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared content models, styling primitives, and navigation used by all stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Define shared site content types and helper interfaces in content/types.ts
- [x] T007 Create baseline mocked content collections and exports in content/profile.ts, content/cv.ts, content/projects.ts, and content/contact.ts
- [x] T008 [P] Implement the global site shell and metadata in app/layout.tsx
- [x] T009 [P] Build shared primary navigation for all routes in components/navigation/site-nav.tsx
- [x] T010 [P] Create reusable section and layout primitives in components/sections/section-shell.tsx and components/ui/container.tsx
- [x] T011 Implement the global responsive visual system in styles/globals.css
- [x] T012 Create a manual validation checklist for shared navigation and responsive review in tests/manual/foundation-checklist.md

**Checkpoint**: Foundation ready. User story implementation can now begin in priority order or in parallel if staffed.

---

## Phase 3: User Story 1 - Explore Personal Overview (Priority: P1) 🎯 MVP

**Goal**: Deliver a striking About page that introduces the site owner and anchors the personal brand.

**Independent Test**: Start the site, open `/`, and verify the visitor can understand who the owner is and navigate to the other three pages on desktop and mobile widths.

### Implementation for User Story 1

- [x] T013 [P] [US1] Refine the profile content for the About page in content/profile.ts
- [x] T014 [P] [US1] Implement the hero/about presentation component in components/sections/about-hero.tsx
- [x] T015 [P] [US1] Implement supporting highlight and intro blocks in components/sections/about-details.tsx
- [x] T016 [US1] Compose the About page route using shared components in app/page.tsx
- [x] T017 [US1] Add page-specific visual treatments for the About experience in styles/globals.css
- [x] T018 [US1] Document and perform manual validation for the About page in tests/manual/us1-about-page.md

**Checkpoint**: User Story 1 should be fully functional and independently reviewable as the MVP.

---

## Phase 4: User Story 2 - Review Projects (Priority: P2)

**Goal**: Deliver a projects page that showcases mocked featured work with a polished fallback state.

**Independent Test**: Open `/projects` directly and confirm a visitor can understand the showcased work or see an intentional empty state if no projects are present.

### Implementation for User Story 2

- [x] T019 [P] [US2] Refine mocked project entries and fallback content in content/projects.ts
- [x] T020 [P] [US2] Build the reusable project card/grid presentation in components/sections/projects-grid.tsx
- [x] T021 [P] [US2] Build the empty-state presentation for missing project data in components/sections/projects-empty-state.tsx
- [x] T022 [US2] Compose the Projects page route with mapped mocked content in app/projects/page.tsx
- [x] T023 [US2] Add project-page-specific visual styling and responsive adjustments in styles/globals.css
- [x] T024 [US2] Document and perform manual validation for the Projects page in tests/manual/us2-projects-page.md

**Checkpoint**: User Stories 1 and 2 should each work independently and preserve shared navigation and styling.

---

## Phase 5: User Story 3 - Read CV Highlights (Priority: P3)

**Goal**: Deliver a CV page that presents mocked experience, education, and skills in a structured, scannable layout.

**Independent Test**: Open `/cv` directly and verify the visitor can scan the mocked CV content quickly on desktop and mobile without relying on other pages.

### Implementation for User Story 3

- [x] T025 [P] [US3] Refine mocked CV entries and category groupings in content/cv.ts
- [x] T026 [P] [US3] Build reusable CV timeline and grouping sections in components/sections/cv-section.tsx
- [x] T027 [P] [US3] Build reusable skill-group presentation for the CV page in components/sections/cv-skill-groups.tsx
- [x] T028 [US3] Compose the CV page route using grouped mocked entries in app/cv/page.tsx
- [x] T029 [US3] Add CV-page-specific spacing and scanning refinements in styles/globals.css
- [x] T030 [US3] Document and perform manual validation for the CV page in tests/manual/us3-cv-page.md

**Checkpoint**: User Stories 1 through 3 should all be independently functional and visually cohesive.

---

## Phase 6: User Story 4 - Find Contact Information (Priority: P4)

**Goal**: Deliver a contact page with clear mocked contact methods and graceful handling of partial data.

**Independent Test**: Open `/contact` directly and confirm the visitor can immediately identify how to reach the site owner, even when some mocked methods are non-clickable.

### Implementation for User Story 4

- [x] T031 [P] [US4] Refine mocked contact methods and partial-data cases in content/contact.ts
- [x] T032 [P] [US4] Build the contact method list and detail presentation in components/sections/contact-methods.tsx
- [x] T033 [P] [US4] Build the non-clickable fallback treatment for partial contact data in components/sections/contact-fallback.tsx
- [x] T034 [US4] Compose the Contact page route with mocked contact methods in app/contact/page.tsx
- [x] T035 [US4] Add contact-page-specific layout and interaction styling in styles/globals.css
- [x] T036 [US4] Document and perform manual validation for the Contact page in tests/manual/us4-contact-page.md

**Checkpoint**: All four user stories should now be independently functional and connected through the shared shell.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Tighten quality across the entire static site before handoff.

- [x] T037 [P] Add shared SEO and social metadata defaults in app/layout.tsx and app/page.tsx
- [x] T038 [P] Curate and optimize static image/font assets used by the site in public/images/
- [x] T039 Improve final responsive polish and accessibility states across shared styles in styles/globals.css
- [x] T040 Update developer run and validation instructions in specs/001-personal-site/quickstart.md
- [x] T041 Run final manual validation for all primary routes and record outcomes in tests/manual/final-site-review.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion. Blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 7)**: Depends on completion of all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependency on other stories.
- **User Story 2 (P2)**: Starts after Foundational. Shares layout/navigation, but remains independently testable.
- **User Story 3 (P3)**: Starts after Foundational. Shares layout/navigation, but remains independently testable.
- **User Story 4 (P4)**: Starts after Foundational. Shares layout/navigation, but remains independently testable.

### Within Each User Story

- Content updates before route composition.
- Reusable section components before final page assembly.
- Page assembly before visual refinement and manual validation.

### Parallel Opportunities

- T005 can run alongside T002-T004 after the project is initialized.
- T008-T010 can run in parallel after shared content types are defined.
- Within each user story, content and section components marked `[P]` can run in parallel before the page composition task.
- Different user story phases can be staffed in parallel after Phase 2 if the team can absorb merge coordination on shared styles.

---

## Parallel Example: User Story 1

```text
Task: "Refine the profile content for the About page in content/profile.ts"
Task: "Implement the hero/about presentation component in components/sections/about-hero.tsx"
Task: "Implement supporting highlight and intro blocks in components/sections/about-details.tsx"
```

## Parallel Example: User Story 2

```text
Task: "Refine mocked project entries and fallback content in content/projects.ts"
Task: "Build the reusable project card/grid presentation in components/sections/projects-grid.tsx"
Task: "Build the empty-state presentation for missing project data in components/sections/projects-empty-state.tsx"
```

## Parallel Example: User Story 3

```text
Task: "Refine mocked CV entries and category groupings in content/cv.ts"
Task: "Build reusable CV timeline and grouping sections in components/sections/cv-section.tsx"
Task: "Build reusable skill-group presentation for the CV page in components/sections/cv-skill-groups.tsx"
```

## Parallel Example: User Story 4

```text
Task: "Refine mocked contact methods and partial-data cases in content/contact.ts"
Task: "Build the contact method list and detail presentation in components/sections/contact-methods.tsx"
Task: "Build the non-clickable fallback treatment for partial contact data in components/sections/contact-fallback.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the About page independently.

### Incremental Delivery

1. Complete Setup and Foundational work.
2. Deliver User Story 1 as the first polished public-facing slice.
3. Add Projects, then CV, then Contact while preserving independent route quality.
4. Finish with final responsive polish, metadata, and complete route review.

### Parallel Team Strategy

1. One developer can own setup/foundation while another prepares mocked content.
2. After Phase 2, separate developers can take Projects, CV, and Contact in parallel.
3. Reserve shared style refinements and final validation for coordinated finishing work.