# Spec-Kit Agents Outline

This document summarizes each agent prompt under `.github/agents/`. The agents implement a **Spec-Driven Development (SDD)** workflow that moves a feature from a natural-language idea → spec → clarified spec → plan → tasks → analysis → implementation, with optional Git/GitHub integration agents acting as hooks.

All agents share a common pattern:

- A YAML front matter (`description`, optional `handoffs` to the next agent).
- A `## User Input` block consuming `$ARGUMENTS`.
- **Pre-Execution Hooks**: read `.specify/extensions.yml` for `hooks.before_<command>` entries and emit/execute them.
- A core **Outline / Execution Steps** section.
- **Post-Execution Hooks**: same logic for `hooks.after_<command>`.

The typical end-to-end flow:

```
constitution → specify → clarify → plan → tasks → (analyze) → implement
                                              ↓
                                      (taskstoissues for GitHub)

git.* agents act as hooks throughout (initialize, feature branch, commit, validate, remote)
```

---

## Core Workflow Agents

### 1. `speckit.constitution.agent.md`
**Purpose**: Create or update the project constitution (`.specify/memory/constitution.md`) — the non-negotiable principles governing all later phases.

**Steps**:
1. Run `before_constitution` hooks.
2. Load existing constitution (or copy from template); identify `[ALL_CAPS]` placeholders.
3. Collect/derive concrete values for placeholders (from user input, repo context, or prior versions).
4. Determine semantic version bump (MAJOR / MINOR / PATCH) and update dates (`RATIFICATION_DATE`, `LAST_AMENDED_DATE`).
5. Draft updated constitution: replace placeholders, ensure each Principle has rules + rationale, ensure Governance section.
6. Run consistency propagation against `plan-template.md`, `spec-template.md`, `tasks-template.md`, command files, and runtime guidance docs.
7. Produce a **Sync Impact Report** (HTML comment at the top): version delta, modified/added/removed sections, templates needing updates, deferred TODOs.
8. Validate: no leftover bracket tokens, ISO dates, declarative testable principles.
9. Write back to `.specify/memory/constitution.md`.
10. Output summary + suggested commit message.
11. Run `after_constitution` hooks.

**Handoff**: → `speckit.specify`

---

### 2. `speckit.specify.agent.md`
**Purpose**: Convert a natural-language feature description into a structured `spec.md`, focused on WHAT/WHY (no implementation details).

**Steps**:
1. Run `before_specify` hooks (typically `git.feature` to create a branch).
2. Generate a 2–4 word short name (action-noun format) from the description.
3. Resolve `SPECIFY_FEATURE_DIRECTORY` (under `specs/`, with sequential `NNN-` or timestamp `YYYYMMDD-HHMMSS-` prefix).
4. Create directory, copy `spec-template.md` to `spec.md`, persist path to `.specify/feature.json`.
5. Parse description → extract actors, actions, data, constraints.
6. Make informed guesses for ambiguities; mark up to **3** `[NEEDS CLARIFICATION]` markers only for high-impact items.
7. Fill User Scenarios, Functional Requirements (testable), Success Criteria (measurable, technology-agnostic), Key Entities.
8. Write the spec.
9. **Quality Validation**:
   - Generate `checklists/requirements.md` with content/completeness/readiness items.
   - Iterate up to 3 times to resolve failing items; resolve `[NEEDS CLARIFICATION]` interactively (max 3 questions, table format).
10. Report `SPECIFY_FEATURE_DIRECTORY`, `SPEC_FILE`, checklist results.
11. Run `after_specify` hooks.

**Handoffs**: → `speckit.clarify` or → `speckit.plan`

---

### 3. `speckit.clarify.agent.md`
**Purpose**: Reduce ambiguity in `spec.md` by asking up to **5 targeted questions** and writing answers back into the spec.

**Steps**:
1. Run `before_clarify` hooks.
2. Run `check-prerequisites.ps1 -Json -PathsOnly`; load spec.
3. Run a **structured ambiguity scan** across an 11-category taxonomy (Functional Scope, Domain & Data, UX Flow, Non-Functional, Integration, Edge Cases, Constraints, Terminology, Completion Signals, Misc/Placeholders), marking each Clear/Partial/Missing.
4. Build a prioritized queue of ≤5 candidate questions (multiple-choice 2–5 options OR ≤5-word answer).
5. **Sequential interactive loop**: ask one question at a time with a recommended/suggested answer + table of options; accept "yes"/"recommended"/"suggested" or option letter.
6. After each accepted answer, **incrementally update the spec**:
   - Ensure `## Clarifications` section + `### Session YYYY-MM-DD` subheading exist.
   - Append `- Q: ... → A: ...` bullet.
   - Apply the answer to the appropriate spec section (Functional Requirements, User Stories, Data Model, Success Criteria, Edge Cases, Terminology).
   - Save file atomically after every integration.
7. Validate: ≤5 accepted, no contradictions, headings intact.
8. Final report: questions count, sections touched, coverage table (Resolved / Deferred / Clear / Outstanding), suggested next command.
9. Run `after_clarify` hooks.

**Handoff**: → `speckit.plan`

---

### 4. `speckit.plan.agent.md`
**Purpose**: Produce the implementation plan (`plan.md`) plus design artifacts (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`).

**Steps**:
1. Run `before_plan` hooks.
2. Run `setup-plan.ps1 -Json` → get `FEATURE_SPEC`, `IMPL_PLAN`, `SPECS_DIR`, `BRANCH`.
3. Load spec and constitution; load IMPL_PLAN template.
4. Fill Technical Context (mark unknowns `NEEDS CLARIFICATION`); fill Constitution Check; evaluate gates.
5. **Phase 0 — Research**: dispatch research tasks for each unknown/dependency/integration; consolidate `research.md` (Decision / Rationale / Alternatives) until no `NEEDS CLARIFICATION` remain.
6. **Phase 1 — Design & Contracts**:
   - Extract entities → `data-model.md` (fields, relationships, validation, state transitions).
   - Define interface contracts (API/CLI/UI as appropriate) → `/contracts/`.
   - Update agent context between `<!-- SPECKIT START -->` / `<!-- SPECKIT END -->` markers in `.github/copilot-instructions.md`.
7. Re-evaluate Constitution Check post-design.
8. Stop after Phase 2 planning; report branch + IMPL_PLAN path + artifacts.
9. Run `after_plan` hooks.

**Handoffs**: → `speckit.tasks` or → `speckit.checklist`

---

### 5. `speckit.tasks.agent.md`
**Purpose**: Generate `tasks.md` — an actionable, dependency-ordered, user-story-organized task list.

**Steps**:
1. Run `before_tasks` hooks.
2. Run `setup-tasks.ps1 -Json` → get `FEATURE_DIR`, `TASKS_TEMPLATE`, `AVAILABLE_DOCS`.
3. Load `plan.md` (required), `spec.md` (required); optional: `data-model.md`, `contracts/`, `research.md`, `quickstart.md`.
4. Generate tasks organized **by user story** (P1, P2, P3 …):
   - Map entities, contracts, and components to the story they serve.
   - Build dependency graph and parallel-execution examples.
5. Generate `tasks.md` from the template with:
   - Phase 1: Setup
   - Phase 2: Foundational (blocking prerequisites)
   - Phase 3+: One phase per user story (in priority order)
   - Final Phase: Polish & cross-cutting
6. **Strict checklist format**: `- [ ] [TaskID] [P?] [Story?] Description with file path` (e.g., `T012 [P] [US1] Create User model in src/models/user.py`).
7. Tests are optional — only generated if explicitly requested or TDD mode.
8. Report task counts, parallel opportunities, MVP scope (usually US1).
9. Run `after_tasks` hooks.

**Handoffs**: → `speckit.analyze` or → `speckit.implement`

---

### 6. `speckit.analyze.agent.md`
**Purpose**: **Read-only** cross-artifact consistency/quality analysis across `spec.md`, `plan.md`, `tasks.md` before implementation.

**Steps**:
1. Run `before_analyze` hooks.
2. Run `check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`; resolve absolute paths to SPEC, PLAN, TASKS; abort if missing.
3. **Progressive load** only minimal sections from each artifact + the constitution.
4. Build internal semantic models: requirements inventory (FR-/SC- keys), user-story actions, task→requirement coverage map, constitution rule set.
5. **Six detection passes** (≤50 findings total):
   - A. Duplication
   - B. Ambiguity (vague adjectives, TODO/`<placeholder>`)
   - C. Underspecification
   - D. Constitution alignment (MUST principles)
   - E. Coverage gaps (requirement↔task)
   - F. Inconsistency (terminology drift, ordering, conflicts)
6. Assign severity: CRITICAL / HIGH / MEDIUM / LOW (constitution violations are always CRITICAL).
7. Output a Markdown report: findings table, coverage table, constitution issues, unmapped tasks, metrics.
8. Provide Next Actions (proceed or fix first) and offer remediation suggestions (do NOT auto-edit).
9. Run `after_analyze` hooks.

**Constraint**: STRICTLY READ-ONLY — never modifies any file.

---

### 7. `speckit.implement.agent.md`
**Purpose**: Execute `tasks.md` end-to-end to actually build the feature.

**Steps**:
1. Run `before_implement` hooks.
2. Run `check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`.
3. **Checklist gate**: scan `FEATURE_DIR/checklists/`; if any item incomplete, present table and ask the user to confirm before proceeding.
4. Load context: `tasks.md` + `plan.md` (required); `data-model.md`, `contracts/`, `research.md`, `constitution.md`, `quickstart.md` (optional).
5. **Project Setup Verification**: detect tech stack from plan.md and create/verify ignore files (`.gitignore`, `.dockerignore`, `.eslintignore`, `.prettierignore`, `.npmignore`, `.terraformignore`, `.helmignore`) using technology-specific pattern lists.
6. Parse `tasks.md` → extract phases (Setup, Tests, Core, Integration, Polish), dependencies, `[P]` markers.
7. **Execute phase-by-phase**:
   - Respect sequential vs. parallel `[P]` rules.
   - Same-file tasks always sequential.
   - TDD: tests before implementation when test tasks exist.
8. Track progress, mark completed tasks `[X]` in `tasks.md`, halt on non-parallel failure, continue on partial parallel failures.
9. Completion validation: tasks done, features match spec, tests pass, plan followed.
10. Run `after_implement` hooks.

---

### 8. `speckit.checklist.agent.md`
**Purpose**: Generate domain-specific quality checklists — described as **"Unit Tests for English"**, validating that *requirements are well-written*, NOT verifying implementation.

**Steps**:
1. Run `before_checklist` hooks.
2. Run `check-prerequisites.ps1 -Json`.
3. **Clarify intent**: dynamically generate up to 3 (escalation up to 5) questions covering scope, risk priority, depth, audience, exclusions, scenario gaps. Use markdown option tables.
4. Combine `$ARGUMENTS` + answers → derive theme (UX/security/API/performance/etc.), depth, audience.
5. Load relevant portions of `spec.md` / `plan.md` / `tasks.md` (progressive disclosure, no full dumps).
6. Create or append to `FEATURE_DIR/checklists/[domain].md`:
   - New file → IDs start at `CHK001`; existing file → continue numbering.
   - Items grouped by quality dimension: **Completeness, Clarity, Consistency, Acceptance Criteria, Scenario Coverage, Edge Cases, Non-Functional, Dependencies/Assumptions, Ambiguities/Conflicts**.
7. **Item rules**: every item is a question testing requirement quality (e.g., *"Is 'fast loading' quantified with specific timing thresholds? [Clarity, Spec §NFR-2]"*) — never `Verify/Test/Confirm` implementation behavior.
8. ≥80% items must include traceability `[Spec §X.Y]` or markers `[Gap]`/`[Ambiguity]`/`[Conflict]`/`[Assumption]`.
9. Soft-cap ~40 items; consolidate duplicates.
10. Report file path, item count, focus areas, depth, must-haves incorporated.
11. Run `after_checklist` hooks.

---

### 9. `speckit.taskstoissues.agent.md`
**Purpose**: Convert each task in `tasks.md` into a GitHub Issue via the GitHub MCP server.

**Tools**: `github/github-mcp-server/issue_write`

**Steps**:
1. Run `before_taskstoissues` hooks.
2. Run `check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`; locate `tasks.md`.
3. Run `git config --get remote.origin.url`.
4. **HARD GUARD**: only proceed if remote is a GitHub URL; never create issues in a different repo.
5. For each task → create one GitHub issue in the matching repo via MCP.
6. Run `after_taskstoissues` hooks.

---

## Git Extension Agents (Hooks)

These agents are usually triggered by the `before_*` / `after_*` hook system declared in `.specify/extensions.yml` and live under `.specify/extensions/git/`.

### `speckit.git.initialize.agent.md`
**Purpose**: Initialize a Git repository if missing.

**Steps**:
1. Run extension script (`initialize-repo.sh` / `.ps1`) or fall back to `git init && git add . && git commit -m "Initial commit from Specify template"`.
2. Skip if Git unavailable or already in a repo.
3. Surface errors and stop on partial init failure.

---

### `speckit.git.feature.agent.md`
**Purpose**: Create a feature branch using sequential or timestamp numbering. Branch creation only — spec dir/files are owned by `speckit.specify`.

**Steps**:
1. Verify Git available.
2. Determine numbering mode: `git-config.yml.branch_numbering` → `init-options.json.branch_numbering` → default `sequential`.
3. If user supplied `GIT_BRANCH_NAME`, pass through verbatim (skip prefix logic).
4. Generate a 2–4-word short name (action-noun, preserve acronyms).
5. Run `create-new-feature.sh/.ps1 --json --short-name "..." [--timestamp] "<feature description>"`.
6. Output JSON `BRANCH_NAME` + `FEATURE_NUM`. Always run only **once** per feature.

---

### `speckit.git.commit.agent.md`
**Purpose**: Auto-stage and commit changes after a Spec-Kit command.

**Steps**:
1. Determine the triggering event name (e.g., `after_specify`, `after_plan`).
2. Read `.specify/extensions/git/git-config.yml` → look up `auto_commit.<event>` and fall back to `auto_commit.default`.
3. Use per-command `message` if configured, else default.
4. If enabled and there are uncommitted changes → run `git add . && git commit`.
5. Graceful degradation: skip if no Git, no repo, no config, or no changes.

---

### `speckit.git.remote.agent.md`
**Purpose**: Detect the Git remote URL for GitHub integration (e.g., for `taskstoissues`).

**Steps**:
1. Verify Git/repo; warn and return empty if not.
2. Run `git config --get remote.origin.url`.
3. Parse owner / repo name from HTTPS or SSH form.
4. Set `Is GitHub` only if the URL truly points to `github.com`.
5. Return empty (no error) on missing remote or non-GitHub remote.

---

### `speckit.git.validate.agent.md`
**Purpose**: Validate the current branch name follows the feature-branch convention.

**Steps**:
1. Verify Git/repo.
2. Read current branch via `git rev-parse --abbrev-ref HEAD`.
3. Match against:
   - Sequential `^[0-9]{3,}-` (e.g., `001-feature-name`)
   - Timestamp `^[0-9]{8}-[0-9]{6}-` (e.g., `20260319-143022-feature-name`)
4. If on a feature branch: report; verify `specs/<prefix>-*` directory exists.
5. If not: emit guidance with the expected naming patterns.
6. Fallback: if Git unavailable, validate `SPECIFY_FEATURE` env var instead.

---

## Cross-Cutting Conventions

- **Hooks**: every core agent reads `.specify/extensions.yml` for `before_<cmd>` / `after_<cmd>` and either prints (optional) or executes (mandatory) the registered command.
- **Prerequisites scripts**: PowerShell-first (`.specify/scripts/powershell/*.ps1 -Json`) used for path discovery.
- **Path policy**: absolute paths for filesystem ops; project-relative paths in docs/agent context.
- **Constitution authority**: violations are always CRITICAL; resolved by amending spec/plan/tasks (not by weakening the principle).
- **Handoff chain**: `constitution → specify → clarify → plan → tasks → analyze → implement`, with `checklist` available off `plan` and `taskstoissues` available off `tasks`.
