<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
	- [PRINCIPLE_1_NAME] -> I. Static-First Delivery
	- [PRINCIPLE_2_NAME] -> II. Responsive and Accessible UI
	- [PRINCIPLE_3_NAME] -> III. Minimal Client-Side Complexity
	- [PRINCIPLE_4_NAME] -> IV. Verifiable Release Checks
	- [PRINCIPLE_5_NAME] -> V. Content and Asset Discipline
- Added sections:
	- Minimum Technical Standards
	- Delivery Workflow
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ no changes required: .specify/templates/plan-template.md
	- ✅ no changes required: .specify/templates/spec-template.md
	- ✅ no changes required: .specify/templates/tasks-template.md
- Follow-up TODOs:
	- None
-->

# Static Web App Constitution

## Core Principles

### I. Static-First Delivery
The application MUST be deployable as static files over standard web hosting.
Pages, assets, and routing MUST work without a server-side runtime unless a
deviation is explicitly approved in the relevant spec or plan.

### II. Responsive and Accessible UI
Every page MUST support current desktop and mobile viewport sizes.
Markup MUST use semantic HTML, keyboard navigation MUST remain usable, and text
and controls MUST preserve readable contrast and visible focus states.

### III. Minimal Client-Side Complexity
Client-side JavaScript MUST be limited to behavior that materially improves the
user experience. Content rendering, navigation, and primary page access MUST
not depend on heavy runtime logic when a simpler static approach is sufficient.

### IV. Verifiable Release Checks
Every releasable change MUST pass a production build or equivalent static export
check. Changed pages MUST be manually or automatically verified for broken
links, missing assets, and obvious layout regressions before merge.

### V. Content and Asset Discipline
All shipped assets MUST have a clear purpose and reasonable size for web
delivery. Images, fonts, and scripts MUST be optimized for the page they serve,
and unused files MUST not be committed as part of the release artifact.

## Minimum Technical Standards

- The site MUST be hostable from static files such as HTML, CSS, JavaScript,
	images, fonts, and other front-end assets.
- Public configuration values MAY be exposed in client code, but secrets MUST
	not be embedded in the static application.
- Paths and asset references MUST resolve correctly in the target hosting
	environment.
- If a framework is used, its output MUST be compatible with static hosting.

## Delivery Workflow

- Each feature spec and implementation plan MUST confirm compliance with the
	static-first, accessibility, and release-check principles.
- Pull requests MUST include evidence that the site builds successfully and that
	the changed UI was reviewed in a browser.
- Exceptions to these rules MUST be documented with a concrete reason and a
	simpler rejected alternative.

## Governance

This constitution supersedes conflicting local practices for static web app
work in this repository. Compliance MUST be checked during spec creation,
planning, implementation, and review.

Amendments MUST be made in the constitution file and reviewed through the same
process as code changes. Versioning follows semantic versioning: MAJOR for
breaking governance changes, MINOR for new or materially expanded rules, and
PATCH for clarifications that do not change intent.

**Version**: 1.0.0 | **Ratified**: 2026-05-27 | **Last Amended**: 2026-05-27
