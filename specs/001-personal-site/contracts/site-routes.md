# UI Contract: Personal Website Routes

## Purpose

Define the user-facing route and content contract for the statically exported site.

## Global Contract

- All primary routes must be reachable through shared navigation.
- Each route must render successfully from embedded content with no network data dependency.
- Each route must preserve the site's shared visual identity and mobile usability.

## Route Contract

### `/`

**Page Role**: About page / landing page

**Required Content**:
- Personal introduction
- Distinct headline or hero statement
- Navigation to CV, Projects, and Contact

**Fallback Behavior**:
- If optional profile image or highlight items are absent, the page still renders a
  complete text-first introduction.

### `/cv`

**Page Role**: Resume / experience overview

**Required Content**:
- Experience, education, and skill sections sourced from embedded mocked entries

**Fallback Behavior**:
- If one CV category has no entries, the page omits or replaces that section without
  leaving broken spacing or empty placeholder frames.

### `/projects`

**Page Role**: Featured work showcase

**Required Content**:
- List or grid of mocked project entries
- Short summary for each visible project card or section

**Fallback Behavior**:
- If there are no project entries, the page shows an intentional empty state rather
  than a broken layout.

### `/contact`

**Page Role**: Contact information

**Required Content**:
- Visible mocked contact methods
- Clear indication of how a visitor would reach out

**Fallback Behavior**:
- If a method lacks a valid href, it renders as static informational text rather than
  a broken interactive element.