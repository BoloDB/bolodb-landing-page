# Responsive Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port responsive class names and CSS media queries from the reference `BoloDB Landing.dc.html` (v2) into `public/index.html`.

**Architecture:** Add CSS class selectors to existing DC HTML elements + inject a `<style>` block with `@media !important` rules to override inline styles at 3 breakpoints. No changes to DC runtime or JS logic.

**Tech Stack:** CSS media queries, DesignCompose (no changes)

## Global Constraints

- Desktop appearance must be pixel-identical to the current `public/index.html`
- No changes to the `<script type="text/x-dc">` DCLogic block
- Only file modified: `public/index.html`

---

### Task 1: Port class names + CSS media queries

**Files:**
- Modify: `public/index.html`

**Interfaces:**
- Consumes: existing DC template structure
- Produces: responsive `public/index.html`

- [ ] **Step 1: Add `bd-*` class names to elements**

Add these classes (in order of appearance):

| Element | Class |
|---|---|
| `<nav>` | `bd-nav` |
| `<div>` containing nav links (Demo, How, Trust, Docs) | `bd-navlinks` |
| `<section>` hero | `bd-hero` |
| `<section id="demo">` | `bd-section` |
| `<section id="how">` | `bd-section` |
| `<section id="trust">` | `bd-section` |
| `<section id="connect">` | `bd-section` |
| `<section>` final CTA | `bd-cta-section` |
| `<div data-reveal="1">` inside CTA | `bd-cta-pad` |
| `<div>` containing CTA buttons | `bd-cta-btns` |
| `<div class="bd-demo-pad">` inside demo (padding container, currently `padding:28px 28px 32px`) | `bd-demo-pad` |
| `<div>` demo user bubble (first child of demo-pad, `align-self:flex-end; max-width:80%`) | `bd-demo-bubble` |
| `<div>` around how-it-works grid (`grid-template-columns:repeat(3,1fr)`) | `bd-grid-how` |
| `<div>` around trust main grid (`grid-template-columns:1.1fr 0.9fr`) | `bd-grid-trust` |
| `<div>` flip card container | `bd-flip` |
| `<div>` inner 2-col grid in trust (`grid-template-columns:1fr 1fr`) | `bd-grid-2` |
| `<span>` hero headline spans (the two with `white-space:nowrap`) | `bd-headline` |
| `<a>` Log in link | `bd-login` |
| `<div>` trust levels row (`flex:1; display:flex; gap:12px; min-width:320px`) | `bd-trust-row` |
| `<footer>` | `bd-footer` |

- [ ] **Step 2: Inject responsive CSS block into `<helmet><style>`**

Add before the closing `</style>` tag:

```css
.bd-navlinks a, .bd-nav a, .bd-nav button { white-space: nowrap; }
@media (max-width: 1000px) {
  .bd-navlinks { display: none !important; }
  .bd-nav { grid-template-columns: 1fr auto !important; }
}
@media (max-width: 900px) {
  .bd-nav { grid-template-columns: 1fr auto !important; padding: 13px 18px !important; }
  .bd-navlinks { display: none !important; }
  .bd-hero { padding: 116px 20px 56px !important; gap: 26px !important; min-height: 92vh !important; }
  .bd-section { padding: 72px 20px !important; }
  .bd-cta-section { padding: 40px 16px 64px !important; }
  .bd-cta-pad { padding: 64px 22px !important; }
  .bd-demo-pad { padding: 20px 16px 24px !important; min-height: 340px !important; }
  .bd-grid-how { grid-template-columns: 1fr !important; }
  .bd-grid-how > div { min-height: 0 !important; padding: 24px 22px 26px !important; }
  .bd-grid-trust { grid-template-columns: 1fr !important; }
  .bd-footer { padding: 48px 20px 0 !important; }
}
@media (max-width: 600px) {
  .bd-login { display: none !important; }
  .bd-grid-2 { grid-template-columns: 1fr !important; }
  .bd-headline { white-space: normal !important; }
  .bd-flip { min-height: 430px !important; }
  .bd-demo-bubble { max-width: 100% !important; font-size: 14px !important; }
  .bd-trust-row { min-width: 0 !important; flex-direction: column !important; align-items: stretch !important; }
  .bd-cta-btns a { width: 100%; justify-content: center !important; box-sizing: border-box; }
  .bd-cta-btns { width: 100%; }
}
```

- [ ] **Step 3: Port extra SEO meta tags**

Add these to `<helmet>` after the existing meta tags:
- `<meta name="robots" content="index, follow">`
- `<meta name="theme-color" content="#070708">`
- `<link rel="canonical" href="https://bolodb.com/">`
- OG/Twitter meta tags
- JSON-LD schema

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: exit code 0, no errors.

- [ ] **Step 5: Dev server check**

```bash
npm run dev -- --host 0.0.0.0
```
Hit http://localhost:4321/ and verify 200 status.

- [ ] **Step 6: Commit**

```bash
git add public/index.html docs/superpowers/
git commit -m "feat: responsive landing page at 1000/900/600px breakpoints"
```
