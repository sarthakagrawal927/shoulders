# Shoulders

## Status: archived / paused

Paused by the owner on 2026-09-14. Resume only on an explicit owner request.

Owner decision: “I lost interest in this product. Move this to archived as paused.”

The complete local prototype, research, artwork and uncommitted files are preserved at `/Users/sarthak/Desktop/fleet-archive/shoulders`. The private GitHub repository is empty; the implementation has not been pushed or deployed. Previous plans below are suspended.


**The software behind your software.**

A static editorial explainer for VS Code, Supabase, OBS Studio, Firefox, Blender and Godot. Three direct foundations per product, 25 foundations and 32 sourced connections, generating 88 static pages. Architectural cutaway direction selected by the owner on 2026-09-14.

## Run

Node 24 and pnpm 10.33.2:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Production-equivalent local preview:

```sh
pnpm check
pnpm preview --port 4321
```

Astro 7 runs preview as a background server. `pnpm exec astro preview status` reports its address; `pnpm exec astro preview stop` stops it. Static output is `dist/`; all routes are pre-rendered HTML, not an SPA fallback.

## Checks

- `pnpm test`: evidence metadata, bounded scope, graph validity, correct transitive paths, compatibility exclusion and editorial gate tests.
- `pnpm check`: Astro/TypeScript checks, tests and production build.
- `pnpm test:e2e`: real Chrome locally, Playwright Chromium in CI; full visitor path, all internal routes, responsive screenshots, axe, keyboard/history, no JavaScript, reduced motion, privacy opt-out and request behavior.
- `pnpm exec prettier --check .`: formatting.
- `pnpm build:release`: refuses unreviewed or changed editorial content.

## Edit the research

`src/data/explorations.json` owns products, foundations and relationships. Each edge records source, target, relationship type, capability, explanation of both parties' contribution, primary evidence URLs, verification date, scope and any limitation. Code sources use pinned revisions; documentation sources are dated observations, not version guarantees.

Only add a connection after reading a primary source that supports that exact scope. `compatible with` is not traversed as a dependency. Product pages show direct relationships only; deeper routes are generated from documented paths.

Examples:

- `/products/vscode/` and `/products/vscode/#layer-electron`
- `/foundations/electron/` — standalone, shareable component page
- `/products/vscode/electron/` — retains the starting product
- `/products/vscode/chromium/` — breadcrumb retains Electron
- `/products/obs-studio/chromium/` — breadcrumb retains CEF

Every relationship has an expandable evidence panel. Empty cross-use results are explicitly scoped to this small dataset. Native fragment links target content inside disclosures, opening the matching foundation even without JavaScript (verified in Chrome). Contextual foundation routes also work without JavaScript. Older fragments such as `#electron` remain supported with JavaScript.

## Deeper trails and evidence boundaries

Schema version 2 adds a `layer` and an explicit evidence endpoint to foundations. Each relationship has a `basis`: `implementation`, `platform-example`, or `physical`. Linux execution paths are selected examples, never assertions about a visitor's machine or a managed deployment. Processor, transistor, silicon and electricity pages preserve that distinction. Material and power edges use `made from` and `requires power`, respectively. Compatibility is still excluded from traversal.

For example: `/products/vscode/node/` → V8 → Linux → Processor → Transistors → Silicon. Electricity is a separate energy branch from Processor. Every product can reach both physical endpoints. Foundation pages show one shortest sourced path per product, with the evidence chain collapsed until requested; these are explanatory paths, not navigation history or runtime traces.

The three new explorations use Mozilla's engine documentation, pinned Blender source, and Godot's component documentation. Blender's documentation host rejected automated access; its inspected source revision and the component maintainers' own documentation supplied the evidence instead. No Source Atlas dataset, price, invoice or supplier attribution was imported.

## Editorial review before publication

The owner's PRD excludes AI-generated published claims. This implementation is therefore an **editorial preview**, with `noindex,nofollow` and a visible draft footer. Source verification does not substitute for human approval of the written explanations.

After a human reviews the dataset and visible page copy, obtain the current content fingerprint:

```sh
node scripts/release-check.mjs --digest
```

Only with explicit human editorial approval, record `editorial.status: "approved"`, the actual `reviewedBy`, ISO `reviewedAt`, and `reviewedContentSha256` in the dataset. Never self-certify this approval. The release check covers data, templates and scripts, excluding the review record itself. Any later content change invalidates the recorded fingerprint. Deployment tooling must use `pnpm build:release`, not the local-preview build.

## Hosting and analytics handoff

This new product has no provisioned domain or hosting resource. `dist/` is compatible with Fleet's static hosting conventions. No provider configuration, credentials, deployment, DNS change, commit or push was performed. Register the eventual host to the Shoulders canonical identity before release.

Analytics reuses the existing Fleet taxonomy: `page_view`, `activated` and `core_action`, with `project_id: "shoulders"`. Specific actions are `foundation_opened`, `relationship_followed`, `second_product_explored`, `product_selected` and `request_draft_opened`. No signup event is fabricated for an account-free site.

`src/lib/browser.ts` calls an existing `window.posthog.capture` if the hosting integration supplies it, and exposes a bounded 50-event `window.shouldersEvents` buffer plus a `shoulders:analytics` CustomEvent for integration/testing. It does **not** install a new provider or transmit data by itself. For an event-listener adapter, subscribe before the site module or drain the buffer once, and do not also attach `window.posthog` (which would double-count). Respect the adapter's Do Not Track / Global Privacy Control check. Before activating any collection, use the existing shared Fleet provider with `project_id: shoulders`, verify real receipts, and update the privacy page to reflect the actual provider. Do not reuse another product's Clarity ID.

The request form opens the visitor's email app using the owner's existing public Fleet contact address, already published in SaaS Maker's privacy and terms pages. Delivery occurs only when the visitor sends the email. No request text enters analytics; no backend or form storage was introduced.

Browser tests inspect request input validity without submitting the form or launching external apps. Analytics tests verify a mock provider's receipts and failure isolation; they do not establish live collection.

## Fleet registration limitation

The owning private repository and issue exist. The canonical catalog/dossier addition remains pending: the current dossier generator requires a matching verbatim owner archive entry and operations record for every new product, and refresh writes `site-health/apps/backend/config/project-operations.json`. Those production configuration changes are outside the current authorization. No partial catalog row was added that would break the existing generator, and unrelated dirty catalog/dossier work was preserved.

## Assets and interface sources

- Original generated architectural plate: `src/data/cutaway.png`; build emits responsive WebP derivatives. Art is conceptual, never evidence of a software relationship.
- Companion illustrations: `src/data/cutaway-vscode.png`, `src/data/cutaway-supabase.png`, `src/data/cutaway-obs-studio.png`; product exploration mapping in `src/lib/illustrations.ts`. Built-in image generation prompts are retained in `artifacts/design/illustration-prompts.json`.
- Pixel art: `src/data/pixel-runtime.png`, `src/data/pixel-processor.png`, `src/data/pixel-electricity.png`; selectively shown on Node.js, Processor and Electricity. Built-in generation prompts: `artifacts/design/pixel-prompts.json`.
- Approved concept: `artifacts/design/direction-a.png`.
- Fonts: Libre Caslon Text and Public Sans, self-hosted through their Fontsource packages. Their package licenses remain with installed source.
- Product marks are small identifying vector renditions, not endorsements.
- Standard disclosures use native HTML `details`/`summary`. Preline's accordion was reviewed; browser-native disclosure was a better fit for zero-runtime, no-JS operation. No Preline source or runtime is copied.

Tracking: https://github.com/sarthakagrawal927/shoulders/issues/1

## Approved simple tree revision — 2026-09-14

Owner selected the branching-tree proposal A with “but much simpler”, then instructed “go”. Product explorations now use small pixel-style SVG icons, restrained pine selection, labelled branches and one visible explanation. The homepage illustration and selective foundation artwork remain. The former product cutaway plates are retained as source assets but are no longer rendered on exploration pages.

Only direct foundations appear initially. Native nested disclosures reveal deeper branches; exact ancestry fragments (for example `#layer-electron--node--v8`) support sharing and history. Mobile uses a vertical sequence without accumulating indentation. Platform-example and physical boundaries remain explicit. Evidence and standalone foundation routes remain available.

Validation: 8 data tests and 88-page static build pass. Browser coverage includes nested selection, sibling replacement, exact-path restoration, no-JavaScript fragments, keyboard navigation, responsive axe checks and analytics. Screenshots: `artifacts/design/tree-{390,768,1440}.png`. This revision has no fresh independent design score. Local preview only; no commit, push or deployment.
