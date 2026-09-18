# Architectural cutaway

Owner selected A on 2026-09-14. The approved concept is retained in artifacts/design/direction-a.png.

## Contract

THESIS: Familiar software is a room built on several independent supporting bays. Explain both the foundation and the maker's work.
OWN-WORLD: Warm ivory paper, charcoal ink, vermilion selection marks; Libre Caslon Text headings, Public Sans body, fine rules, ink-and-wash architecture.
STORY: Recognize a product, open a foundation, understand the contribution, follow a sourced connection or use the foundation independently.
FIRST VIEWPORT: Editorial headline left; large architectural plate right; the curated product cards immediately below. The exploration puts product contribution above foundation disclosures.
FORM: Owner-approved A, architectural cutaway. No random selection required; the explicit owner decision controls.

## System

- Ivory #f7f4ed; charcoal #272821; muted #64665e; accent #a93425; rules #c9c7bb.
- Broad desktop margins, reading measure under 72 characters, 48px minimum disclosure targets.
- Layer illustrations are conceptual; all labels and interactive content are semantic HTML.
- Separate foundations are siblings. Vertical position never silently establishes a dependency.
- Native details/summary is the maintained browser disclosure primitive, chosen over the reviewed Preline JS accordion for no-JS access and zero runtime dependency. Sources: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details and https://preline.co/docs/components/accordion.html . No copied Preline source.
- Product-specific architectural plate and bay composition are authorized by the PRD and direction A. Reuse native controls for standard interactions.
- Disclosure motion uses a short content reveal; native navigation retains direct URLs. Reduced motion disables animation and smooth scrolling.
- Mobile is a single vertical reading sequence; artwork stays secondary to usable labels. No fixed sidebar, network canvas, or physics engine.

## Editorial boundary

Generated art is illustrative. Research text is not approved publication copy. Release checks must require recorded human editorial review before producing publishable output.

## Illustration family

Owner requested more of the original architectural illustration. Preserve the approved medium and composition with three companion plates: VS Code workshop, Supabase data utility house and OBS broadcast studio. Use each only on its product exploration page; keep the original homepage hero and simpler line-drawn product cards. The owner rejected repeating the detailed illustrations in cards. Semantic labels remain HTML and the artwork remains conceptual. Responsive WebP derivatives bound transfer size. Exact built-in generation prompts are in `artifacts/design/illustration-prompts.json`.

## Typography correction

Owner rejected the thin display face. Preserve direction A with sturdier Libre Caslon Text regular headings and Public Sans body at weight 450. Self-hosted font asset replaces the previous display package; layout, colors and interaction remain established.

## Deeper edition

Owner explicitly requested pixel art, more products, and trails to electricity and silicon. Preserve the established layout, serif typography and original hero; use three distinct pixel-art vignettes only on Node.js, Processor and Electricity detail pages. New product pages use simple labelled foundation bays. Hardware pages mark the change from implementation to selected platform examples and general physical explanations. Onward navigation precedes expandable chain evidence. This extends the selected direction without repeating artwork in cards.

## Approved simple tree revision — 2026-09-14

Owner selected the branching-tree proposal A with “but much simpler”, then instructed “go”. Product explorations now use small pixel-style SVG icons, restrained pine selection, labelled branches and one visible explanation. The homepage illustration and selective foundation artwork remain. The former product cutaway plates are retained as source assets but are no longer rendered on exploration pages.

Only direct foundations appear initially. Native nested disclosures reveal deeper branches; exact ancestry fragments (for example `#layer-electron--node--v8`) support sharing and history. Mobile uses a vertical sequence without accumulating indentation. Platform-example and physical boundaries remain explicit. Evidence and standalone foundation routes remain available.

Validation: 8 data tests and 88-page static build pass. Browser coverage includes nested selection, sibling replacement, exact-path restoration, no-JavaScript fragments, keyboard navigation, responsive axe checks and analytics. Screenshots: `artifacts/design/tree-{390,768,1440}.png`. This revision has no fresh independent design score. Local preview only; no commit, push or deployment.

## Illustrated tree correction

The owner rejected the tiny-icon treatment as negligible. The approved tree now gives pixel artwork substantial space: a 260px workstation root and 160px foundation objects, continuous pine branches, unboxed labels, and one supporting explanation. Open ancestors compact as the reader descends. On phones, 116px objects accompany a vertical branch. Long names wrap. Existing native disclosures, deep links and evidence semantics are retained.

The built-in image tool produced `src/data/tree-objects-ivory.png`; prompt and revision provenance live in `artifacts/design/tree-object-prompt.json`. The atlas is illustrative, with semantic HTML labels conveying actual relationships. The rejected transparent attempt contains a painted checkerboard and is not rendered. Production WebP atlas is approximately 101 kB. Root browser review covers 390, 768 and 1440px. No fresh independent score is claimed.
