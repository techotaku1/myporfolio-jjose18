# Portfolio Responsive Headings Specification

## Purpose

Define responsive line wrapping and overflow-safe behavior for the prominent portfolio section headings while preserving independent wrapping behavior for project card titles.

## Requirements

### Requirement: Desktop section headings remain single-line

At verified desktop viewport widths, the portfolio page MUST render the localized headings corresponding to “PROYECTOS DESTACADOS” and “DESARROLLO AGÉNTICO” on one visual line. The headings MUST NOT contain a forced line break that prevents responsive layout behavior.

#### Scenario: Target headings fit on desktop

- GIVEN the localized portfolio page is displayed at a 1280px-wide viewport
- WHEN both target section headings are rendered
- THEN each heading MUST occupy exactly one visual line
- AND each heading MUST remain within its section-heading container

### Requirement: Narrow screens preserve natural wrapping

Below widths that safely support a single line, each target section heading MUST be allowed to wrap naturally at whitespace. Wrapping MUST preserve the complete localized text and MUST NOT reduce readability through clipping or forced horizontal scrolling.

#### Scenario: Target headings render on a narrow phone

- GIVEN the localized portfolio page is displayed at a 320px-wide viewport
- WHEN either target section heading requires more width than its container provides
- THEN the heading MUST wrap at a natural text boundary
- AND all heading text MUST remain visible within the container

#### Scenario: Narrow headings are not forcibly split

- GIVEN the localized portfolio page is displayed below the verified single-line threshold
- WHEN a target heading fits within its available container width
- THEN the heading MUST remain on one line
- AND it MUST NOT contain a presentation-enforced line break

### Requirement: Transition widths remain overflow-safe

At and around the responsive layout transition, target headings MUST remain fully contained regardless of whether they render on one line or wrap. Hidden page overflow MUST NOT be used as evidence that the heading itself fits.

#### Scenario: Headings remain contained around the layout transition

- GIVEN the portfolio page is tested at viewport widths of 759px, 760px, and 761px
- WHEN each target heading is rendered at every width
- THEN its left and right bounds MUST remain within its section-heading container
- AND no heading glyphs MUST be clipped
- AND the document MUST NOT gain horizontal overflow

### Requirement: Project card titles retain natural wrapping

Project card titles MUST remain independently eligible to wrap and MUST NOT inherit single-line behavior from section headings.

#### Scenario: Long card title wraps inside a narrow card

- GIVEN a project card is rendered at its supported 280px minimum width
- WHEN its localized title does not fit on one line
- THEN the title MUST wrap naturally onto additional lines
- AND the title MUST remain fully visible within the card
