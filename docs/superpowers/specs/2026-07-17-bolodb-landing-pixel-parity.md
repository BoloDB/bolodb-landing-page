# BoloDB Landing Page — Pixel-Parity Port

## Goal
Make the current Astro + React landing page visually identical to the reference DesignCompose file at `BoloDB Landing.dc.html`. Zero visual drift tolerated.

## Approach: Structure-level port from reference markup
Port the exact HTML/CSS DOM structure from the reference `.dc.html` into each `.astro`/`.tsx` file, mapping DesignCompose template syntax (`{{ }}`, `sc-for`, `sc-if`) to equivalent React/Astro logic. Preserve existing interactive components (LiveDemo, TrustFlip, ConnectTabs) — only adjust their wrapping markup where needed.

## Discrepancies Found

### Hero.astro
- "TEXT-TO-SQL FOR HUMANS" label: `text-xs` → explicit `font-size:12.5px`

### HowItWorks.astro
- Step card padding: `p-8` (32px all) → `32px 26px 36px` (top/left/right/bottom)

### Trust.astro (TrustFlip.tsx)
- Front-face card padding: `p-7` (28px) → `30px`

### ConnectTabs.tsx
- Tab bar padding: `p-2.5` (10px all) → `10px 12px`
- Content padding: `p-6` (24px all) → `24px 26px`

### Footer.astro
- Footer padding moved from inner `<div>` to `<footer>` element
- Add `align-items:flex-start` to flex container

## Files modified
- `src/components/Hero.astro`
- `src/components/HowItWorks.astro`
- `src/components/Trust.astro` (wrapper)
- `src/components/ConnectTabs.tsx`
- `src/components/Footer.astro`

## Verification
Run `npm run dev`, visually compare rendered output to reference structure.
