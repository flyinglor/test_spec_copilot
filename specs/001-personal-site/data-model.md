# Data Model: Personal Website

## Profile

**Purpose**: Supplies the core About page content and shared brand identity.

**Fields**:
- `name`: display name shown in hero and metadata
- `headline`: short positioning statement
- `summary`: longer biography or introduction copy
- `location`: optional geographic context
- `portraitImage`: optional image asset reference
- `highlights`: short list of supporting traits or specialties

**Validation Rules**:
- `name`, `headline`, and `summary` are required
- `highlights` may be empty but should not exceed concise display-friendly copy
- Image references must point to static assets available at build time

## CV Entry

**Purpose**: Represents a resume-style entry for experience, education, or skills.

**Fields**:
- `id`: stable unique identifier
- `category`: `experience`, `education`, or `skill-group`
- `title`: role, degree, or skill group name
- `organization`: company, school, or grouping label
- `startDate`: display-ready start date
- `endDate`: display-ready end date or `Present`
- `description`: supporting summary text
- `bullets`: optional list of key points

**Validation Rules**:
- `id`, `category`, and `title` are required
- `description` or `bullets` must be present so the entry is meaningful
- Entries must render coherently even when `organization` or `endDate` is omitted

## Project Entry

**Purpose**: Represents a featured project on the Projects page.

**Fields**:
- `id`: stable unique identifier
- `title`: project name
- `summary`: short project description
- `details`: optional longer supporting copy
- `tags`: optional list of technologies or themes
- `image`: optional static visual reference
- `linkLabel`: optional CTA text for mocked link presentation
- `linkHref`: optional href for mocked or placeholder destination

**Validation Rules**:
- `id`, `title`, and `summary` are required
- Empty project collections must trigger an intentional fallback state in the UI
- Optional links must not be rendered as active controls when href is absent

## Contact Method

**Purpose**: Represents a visible contact path on the Contact page.

**Fields**:
- `id`: stable unique identifier
- `label`: display label such as Email or LinkedIn
- `value`: mocked contact destination or handle
- `href`: optional clickable target
- `note`: optional supporting context

**Validation Rules**:
- `id`, `label`, and `value` are required
- Partial contact data must still render without broken links or empty shells

## Relationships

- One `Profile` record anchors the site identity across all pages.
- Multiple `CV Entry` records are grouped by category for the CV page.
- Multiple `Project Entry` records populate the Projects page.
- Multiple `Contact Method` records populate the Contact page.