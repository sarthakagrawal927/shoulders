# Shoulders review — 2026-09-14

Method: dual-agent (A: design_review; B: technical_review). Assessments were independent; B's findings were withheld until A finished. Review is of the local editorial preview, not a published service. Target slug: `src-pages-index-astro`; no critique ignore file existed.

## Direction and purpose

Owner approved A, Architectural cutaway. Initial A review found a P1: generic static art was disconnected from disclosure state. Corrected with a labelled product room, clickable named foundation bays and synchronized vermilion selection. A independently rechecked at 390/1440. Mobile relationship labels were restored and explanation text raised to 15px.

Final A critique: **36/40**. Purpose: **94/100** (product24, audience14, value14, mechanism14, proof13, nextAction15). No remaining P0/P1 in the targeted recheck.

Independent comprehension answers:

1. Curated explainer showing the software underneath familiar tools.
2. Curious software users and builders.
3. Understand foundational capabilities versus the finished product creator's work.
4. Choose a product, open a foundation, follow documented deeper relationships.
5. Evidence disclosures, primary sources, scoped claims and explicit unresolved questions.
6. Open a foundation, read documentation, explore another tool or suggest an addition.

## Technical audit

B scored **16/20**: accessibility3, performance4, responsive3, theming3, integrity3. This is a review score, not a Lighthouse result. No load profiling or screen-reader certification is claimed.

B found two P2 defects, both fixed: labelled-bay interaction bypassed opening analytics, and whitespace-only suggestions returned silently. Browser regressions now cover the diagram event, selection state and recoverable input validation. B's remaining P2 notes compact secondary metadata; main explanatory prose is 15px. Product images are optimized WebP and fonts are local. The local preview deliberately has no connected analytics provider.

## Detector and browser evidence

Exactly one CLI detector pass over `src`: exit0, `[]`, zero findings. Browser overlay snapshots before the final edits reported tiny-text/undersized-ui-text, all-caps-body, ai-color-palette/cream-palette, line-length and repeated-section-kickers across shared layout, product panels and foundation pages. Counts were preliminary (home10, product29, Electron9, request4); not final-build scores. The palette and repeating disclosure anatomy are intentional owner-approved decisions. Body type findings drove the 15px correction. Compact metadata remains a disclosed advisory.

B created its own tab. Native CUA was unavailable; the available Playwright connector provided the fallback. Mutable injection preflight and visible overlay succeeded. The temporary detector server (port8400) was stopped; navigation removed overlays. No currently visible overlay is claimed. Root's preview remains available for product review, not merely for critique. No source injection or source cleanup was needed; tool screenshots/logs were retained in `/tmp/codevetter-playwright-mcp/`.

## Verification scope

Production static build, data/graph/editorial-gate tests, direct-route/internal-link validation, complete VS Code→Electron→Chromium→OBS journey, evidence, keyboard/history, no-JS navigation, reduced motion, storage-disabled behavior, privacy opt-out, email-draft semantics and responsive axe scans. Root screenshots: `after-{390,768,1440}.png`, product and Chromium images alongside them.

Publication approval, real hosting and live analytics collection remain release work. Email delivery was not tested or sent; the form's observable contract is creating a draft for the visitor to send.

Follow-up corrections preserve the approved direction: evidence and scope text is now 13px, compact relation labels 12px, and native layer fragments open their disclosures without JavaScript. Request tests inspect validity without submitting or launching external apps. Mock provider receipt and failure-isolation tests cover the analytics adapter; live collection remains unverified. The independent scores above precede these narrow follow-up corrections.

Final verification: `pnpm check` passed with zero diagnostics, six unit/data tests and 31 static pages; `pnpm test:e2e` passed all 15 tests; Prettier check passed. `pnpm build:release` correctly refused the current unreviewed draft.

## Owner typography correction

Preserve lane: replaced Libre Caslon Display with the sturdier Libre Caslon Text face and raised Public Sans body weight to 450. Build and three responsive browser checks pass at 390/768/1440, including axe and overflow assertions across homepage, three products and Chromium. Updated screenshots were visually inspected on desktop and mobile. Prior independent scores are historical, not new scores for this font adjustment. Before evidence: `font-before-1440.png`.

## Illustration extension

Owner requested more images in the existing style. Built-in image generation produced three companion cutaways, now used in product pages and cards. Original hero retained. Exact prompts and asset paths: `illustration-prompts.json`. Card images use responsive WebP, lazy loading and empty alt within an already-labelled link; product plates have descriptive conceptual alt text and separate semantic labels. No research claims are inferred from machinery. Build/check passed with zero diagnostics and six data tests, followed by all 15 browser tests. Final card sizing is covered by the responsive rerun. Existing independent review scores precede this bounded extension. Source Atlas was supplied as a pasted summary only; its files and pricing claims were not inspected or imported.

## Illustration restraint correction

Owner rejected repeated detailed imagery. Restored original line-drawn product cards and their original height. Detailed art is limited to the homepage hero and the corresponding product exploration. Earlier illustration-extension notes describe the superseded card treatment.

## Expanded edition: software to physical resources

Owner requested more products, electricity/silicon depth, and pixel art. Added Firefox, Blender and Godot with three direct foundations each. Current dataset: six products, 25 foundations, 32 relationships. Every product has a path to silicon and electricity. Implementation, selected Linux execution examples and general physical explanations are visibly distinct. Neither support documentation nor a physical dependency establishes a deployed vendor or energy supply chain. Material and energy are separate branches. Endpoint notes record the unresolved boundary.

Visual review preserves the existing layout and hero. Three pixel-art vignettes appear only on Node.js, Processor and Electricity. Product cards retain simple line illustrations. New product pages use labelled foundation selections without duplicated hero art. Next-layer navigation precedes collapsible evidence chains; one shortest sourced path per product is shown. Original independent scores above are historical; no new independent rescore is claimed. Root inspected processor desktop, electricity mobile and Firefox mobile screenshots. No clipping or overlap observed; source and scope labels remain readable.

Validation: zero Astro diagnostics, eight data tests, 88 static pages. All 17 browser tests passed, including the complete Node.js-to-silicon journey, all internal routes, physical endpoint without JavaScript, responsive axe checks at 390/768/1440, keyboard, opt-out and provider failure isolation. The accessibility scanner runs only in JavaScript-enabled contexts; no-JavaScript functionality is separately verified. Final copy refinement removes duplicate endpoint text and changes the physical-resource link label from project to background. No mail submission, publication, commit or push. Pixel asset paths and exact built-in generation prompts are retained in `pixel-prompts.json`.
