# Responsive Landing Page — Design Spec

## Goal

Make the DesignCompose-powered BoloDB landing page responsive at 3 breakpoints (1000px, 900px, 600px) while preserving pixel-identical desktop appearance.

## Approach

Add `bd-*` CSS class selectors to existing HTML elements and inject a `<style>` block with `@media` rules using `!important` to override inline styles (necessary because DesignCompose renders via inline styles).

## Breakpoints

| Breakpoint | Changes |
|---|---|
| ≤1000px | Hide nav links; nav becomes 2-column grid |
| ≤900px | Reduced section padding (hero, sections, CTA, footer); how-it-works grid → single column; trust grid → single column; demo card padding reduced |
| ≤600px | Hide login; inner 2-col grids → single column; hero headlines wrap normally; flip card taller; demo bubble full-width; trust levels row stacks vertically; CTA buttons full-width |

## Elements Modified

~20 elements get a `bd-*` class added. No structural changes to the DC template or JavaScript logic.

## Files Changed

- `public/index.html` — add classes, inject media query block, port extra SEO meta tags from responsive reference
- `src/pages/index.astro` — (unchanged, still reads `public/index.html` via `set:html`)

## Verification

Dev server at `localhost:4321`, resize browser to each breakpoint, compare against reference `(1)/BoloDB Landing.dc.html`.
