# Changelog

All notable changes to Forge are documented in this file.

## [1.10.3] — 2026-05-20

### Codename: Cohesion (inherited from v1.10.0)

Patch release. Fixes a render bug that could leave Section 7 (Amplified Moves) invisible with a sizable scroll gap on certain viewport sizes. Surfaced by a workshop run on a real BCD (Vital Vessel — chiropractic / wellness). DevTools confirmed the failure mode: `#sec7.in_view: false, opacity: '0'` while sections above and below rendered fine.

### Fixed — IntersectionObserver threshold too restrictive for tall sections

The scroll-triggered section fade-in used `threshold: 0.12` on the IntersectionObserver. For very tall sections (Section 7 with all five sub-blocks 7.0 + 7.0b + 7.0c + 7.1 + 7.2 + 7.3 + combined projections + trajectory chart + death-zone callout often exceeds 8000px rendered height), the max possible intersection ratio equals `viewport_height / section_height`. On a typical laptop viewport (~700–900px effective), an 8000px section can never reach 12% intersection, so the observer never fires and `.in-view` is never added. The section stays at `opacity: 0` from the `.fade-init .section` rule while still occupying scroll space — exactly the bug observed.

**Fix:** changed threshold from `0.12` to `0` and tightened `rootMargin` from `0px 0px -60px 0px` to `0px 0px -10% 0px`. With `threshold: 0`, any pixel intersection fires the observer — guaranteed to work for any section height. The `-10%` bottom margin preserves the "fade in slightly before bottom of viewport" UX that the 0.12 threshold was reaching for.

### Fixed — CSS selector collision with Mermaid Gantt SVG

Mermaid's Gantt-chart syntax (`section Move 1`, `section Move 2`, etc.) generates SVG `<g class="section">` elements for the background bands behind each section's bars. Our CSS rule `.fade-init .section { opacity: 0 }` and our `document.querySelectorAll('.section')` both matched these SVG elements as well as the actual `<section>` tags. Result: every Gantt chart added 3–5 phantom "sections" to the IntersectionObserver's watch list (visible in DevTools as `(no id)` entries with opacity `0.2`). Visually benign because Mermaid's own styling re-asserted, but it's class-name pollution and a real cleanliness issue.

**Fix:** tightened the selector from `.section` to `section.section` in both CSS (`.fade-init section.section`, `.fade-init section.section.in-view`, `@media (prefers-reduced-motion: reduce) .fade-init section.section`) and JavaScript (`document.querySelectorAll('section.section')`). Only matches `<section>` tags carrying the `.section` class — never SVG groups.

### Files changed

- `skills/optimize/templates/report.html` — CSS selector + JS selector + IntersectionObserver threshold/rootMargin
- `examples/sample-report.html` — same three fixes applied to the bundled sample so it ships with the corrected behavior
- `.claude-plugin/plugin.json` — `1.10.2` → `1.10.3`
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` → `v1.10.3`

### How to verify

Open any v1.10.3+ report in a browser, F12 → Console, paste:

```js
document.querySelector('#sec7').classList.contains('in-view')
```

Scrolling past Section 6 should now return `true` once Section 7 enters the viewport, with `getComputedStyle(document.querySelector('#sec7')).opacity` reading `1`.

## [1.10.2] — 2026-05-20

### Codename: Cohesion (inherited from v1.10.0)

Patch release. Plugin description and README intro rewrites. No behavior change, no chain change, no render change.

### Changed — `plugin.json` description (the "About" line)

**Before:** "Business model optimization. Email-gated HTML intake, adaptive mental-model analysis with live market research, and terminal-noir intelligence report."

**After:** "Business model optimization for business owners and strategists. Adaptive 40-model analysis grounded in live market research. Output: before-and-after model flowcharts, implementation Gantt, revenue trajectory chart, and pressure test."

Drops two phrases that telegraphed implementation detail (`Email-gated HTML intake`) and styling (`terminal-noir intelligence report`) but carried no value signal. Adds audience naming so non-target readers self-disqualify in the plugin browser, names three concrete diagram outputs so the visual layer reads as the deliverable rather than decoration, and closes on `pressure test` as the differentiator. No trending-keyword vocabulary (no "first principles," no "strip assumptions," no "axiomatic truths") — the structural property is named through the diagrams and the pressure-test clause instead.

### Changed — README tagline + intro paragraph

Tagline matches the new `plugin.json` description verbatim. Intro paragraph rewritten to:
- Lead with the differentiator: "It pressure-tests its own recommendations rather than just emitting them."
- Name three uniquely-identifiable mental-model lenses (Jobs-to-Be-Done, Inversion, Via Negativa) plus "others" — telegraphs depth without author attribution.
- Add the structural property: "biased toward subtraction" — captures Via Negativa / Pareto / First Principles thinking without using any of the trending-keyword vocabulary.
- Name the four Phase 1B market-research dimensions explicitly (TAM, competitive density, pricing distribution, customer acquisition cost).
- Name six concrete outputs in the closing sentence (before-and-after flowcharts, Sankey, Gantt, trajectory chart, Steelman / Strawman / Pre-Mortem attack).

### Files changed

- `.claude-plugin/plugin.json` — `description` field rewritten; `version` `1.10.1` → `1.10.2`
- `README.md` — bolded tagline + intro paragraph (lines 11–13) rewritten
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` → `v1.10.2`
- `examples/sample-report.html` — Appendix Run Metadata `forge v1.10.1` → `v1.10.2`

## [1.10.1] — 2026-05-20

### Codename: Cohesion (inherited from v1.10.0)

Patch release. Two doc-consistency fixes flagged in the v1.10.0 release notes as out-of-scope. No behavior change, no chain change, no operator-facing render change.

### Fixed — scoring formula consistency

`references/catalog.md` documented the runtime scoring formula as three factors (`base_relevance × subtractive_weight × bcd_multiplier`); `skills/optimize/SKILL.md` Phase 2 and `PRD.md` §5 both documented it as four factors with `market_multiplier` added. The 4-factor version is authoritative — the model-pruning JSON schema in SKILL.md captures `market_multiplier` as a top-level field per pruned model, and Phase 1B market research feeds the multiplier (commoditization signal boosts Via Negativa, etc.). `catalog.md:10` updated to match. The 4-factor formula now reads identically across all three documents.

### Fixed — "38 models" → "40 models" drift

v1.9.0 added catalog entries #39 (Money Model Architecture) and #40 (Cash Conversion Check), but the model count was left at 38 in four places:
- `references/catalog.md:3` — "The 38 models the optimize skill draws from"
- `PRD.md:214` — "40 models with kernels and scoring"
- `README.md:75` — "(40-model catalog, 5 hard causal anchors)"
- `README.md:91` — directory-tree comment "40 mental models with kernels + scoring"
- `skills/optimize/SKILL.md:3` — frontmatter description "adaptive 40-model mental-model chain"

All five updated to 40. The historical v1.1 entry in CHANGELOG.md ("38-model mental-model catalog") is left intact — it documents the catalog's state at v1.1 and changing it would rewrite history.

### Files changed
- `references/catalog.md` — scoring formula + model count
- `PRD.md` — model count in §10 file inventory
- `README.md` — model count in features list + directory tree
- `skills/optimize/SKILL.md` — model count in frontmatter description
- `.claude-plugin/plugin.json` — `1.10.0` → `1.10.1`
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` → `v1.10.1`
- `examples/sample-report.html` — Appendix Run Metadata `forge v1.10.0` → `v1.10.1` (footer reads `FORGE v1.10` major.minor — unchanged)

## [1.10.0] — 2026-05-20

### Codename: Cohesion

Two parallel tracks. Track 1 tightens the order-of-operations around v1.9's Section 7.0c Money Model Architecture sub-block so the tier ladder integrates with the rest of the report instead of reading as an island. Track 2 ships a release-codename system so every release on the GitHub Releases page carries a memorable single-word identifier alongside the version number.

### Track 1 — Order-of-Ops tightening (five gap fixes)

No new chain models. No catalog changes. No new questionnaire fields. All five are voice-rule and Phase 4 render-instruction insertions in existing files.

- **Gap A — Section 7 anchor rule.** Each of 7.1/7.2/7.3 must name its anchor: either a specific Section 3–6 element OR a 7.0c tier (Front-door / Core / Premium / Subscription) — and state which element/tier becomes more valuable when the addition lands. Additions without a concrete upstream surface fail the accretion filter.
- **Gap B — Section 8 source-chain table.** Money Model Architecture now feeds the Steelman (tier ladder as the affirmative architecture); Cash Conversion Check feeds the Strawman when verdict is `likely_failing` (cash-recovery gap as attackable mechanic).
- **Gap C — Core tier ≡ Section 4.3 redesigned offer.** The 7.0c Core tier card now carries the same offer name and value promise as Section 4.3's redesigned-offer heading. The 7.0c intro paragraph explicitly cites Section 4.3 by anchor. Front-door, Premium, and Subscription frame as the ladder built around that core.
- **Gap D — Cash-recovery Move 1 override.** When Cash Conversion verdict is `likely_failing`, Section 6 Move 1's first concrete sub-task must implement one of the verdict's `recommended_levers` (reduce CAC, raise prices, add upsell, accelerate collection). `indeterminate` verdicts don't override (cite-or-omit).
- **Gap E — Sequencing-note Move-1 reconciliation.** Before final render, the 7.0c `sequencing_note` is reconciled against Section 6 Move 1's tier focus. If they disagree, `sequencing_note` is rewritten to match Move 1. Move 1 is the authoritative tier-priority signal; 7.0c reinforces, never contradicts.

### Track 2 — Release codename system

- **New `CODENAMES.md` at repo root.** Single source of truth mapping each minor version to a single-word codename. Patch releases inherit their minor's codename. Reserved codenames (Schematic, Anchor) held for future themed releases; no retro-application to non-existent v1.0 or v1.4.
- **Auto-tag workflow patched.** `.github/workflows/auto-tag-release.yml` now reads CODENAMES.md on every merge, looks up the codename for the version's major.minor, and stamps the release title as `Forge vX.Y.Z — Codename — Business Model Optimization`. Falls back to a tag-only title with a workflow warning when no codename is found.
- **Retroactive title edits.** Existing GitHub releases v1.1.0 through v1.9.0 retitled via `gh release edit` to match the new title shape — metadata-only edits, no tag changes, no re-publish, release URLs unaffected. Performed as a manual post-merge step (workflow only handles new releases).

### What's not in this release

- **File-tree timestamps untouched.** Files like `LICENSE`, `.gitignore`, `.github/workflows/*`, and hooks keep their original commit timestamps. That's normal GitHub behavior for any repo where most files don't change with every release. Canonical version surface stays the version badge on the live sample report, the GitHub releases page, and this CHANGELOG.
- **No new chain models, no catalog changes, no questionnaire changes.** v1.9.0's two new entries (#39 Money Model Architecture, #40 Cash Conversion Check) carry through unchanged. All five gap fixes are render instructions, not new analytical capability.
- **No DESIGN.md component changes.** All five gap fixes use existing components, voice rules, and tier-anchor patterns.

### Files changed

- `skills/optimize/SKILL.md` — four voice-rule / instruction blocks inserted in existing Phase 4 sections (Gaps A, B, D, E)
- `references/report-structure.md` — Gap C voice rule + Gap E reconciliation rule inserted in §7.0c spec
- `examples/sample-report.html` — applied all five gap fixes to the Mechanical Magic sample: Core tier intro paragraph cites Section 4.3; 7.1/7.2/7.3 each carry explicit tier anchors (Subscription / Core / Premium); Section 8 Steelman + Strawman + "What Survives" reference Money Model Architecture and Cash Conversion Check; sequencing reminder rewritten to match Move 1's Core-tier focus. Footer + appendix version bumped.
- `CODENAMES.md` — new file at repo root
- `.github/workflows/auto-tag-release.yml` — new `Lookup codename from CODENAMES.md` step; `gh release create --title` now reads the codename-stamped title output
- `.claude-plugin/plugin.json` — `1.9.0` → `1.10.0`
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` → `v1.10.0`
- `PRD.md` — version header → 1.10; Status paragraph updated to cover v1.10 (codename Cohesion); §7 Section 7 description adds the v1.10 voice-rule integrations

### Pre-existing inconsistency carried forward (still out of scope)

`catalog.md:10` documents scoring formula with 3 factors; `SKILL.md` Phase 2 and `PRD.md` §5 document it as 4 factors (adding `market_multiplier`). Not introduced by this work. Flag for a separate v1.x patch.

## [1.9.0] — 2026-05-19

### Added — Section 7.0c Money Model Architecture (new sub-block) + two new chain models

The existing Value Equation chain model surfaces a single redesigned-offer description in Section 4.3. v1.9 adds a deeper treatment: a multi-tier offer architecture mapping the operator across four sequential tiers — **Front-door → Core → Premium → Subscription** — plus a probabilistic check on whether the offer mechanics recoup their own customer-acquisition cost within ~30 days. Renders as a new sub-block 7.0c inside Section 7 (Amplified Moves), alongside the existing 7.0 Automation Surface and 7.0b First-Hire Roadmap sub-blocks. No top-level renumbering; no `bg-num` visual rhythm break.

### Added — `Money Model Architecture (Hormozi)` chain model (catalog #39)

Design-class model that fires after Value Equation and soft-fires before Pricing Strategy. Consumes Q10d (pricing snapshot), Q12 (revenue stream split), Q13 (top acquisition channels), plus the Value Equation output. Produces a 4-tier offer canvas, each tier with name, target audience, price anchor, value promise, gross profit estimate, time to deliver, and a Section 5 revenue-stream anchor. Closes with a sequencing note telling the operator which tier to design or sharpen first given their primary bottleneck.

### Added — `Cash Conversion Check (30-day rule)` chain model (catalog #40)

Stress-Test-class model that fires after Money Model Architecture and consumes Phase 1B `CAC_BENCHMARK` for the operator's top channel. Probabilistically estimates whether first-30-day cash recovered per new customer exceeds estimated CAC, producing a verdict of `likely_passing` / `likely_failing` / `indeterminate` plus confidence (low/med/high). Confidence drops one tier per loose-or-missing input; low confidence forces an indeterminate verdict. Outputs 2-4 recommended levers (reduce CAC, raise prices, add upsell, accelerate cash collection) tuned to the operator's specific gap. Voice precedent matches Section 2 CAC sub-block — pilot-to-measure fallback when inputs are thin.

### Added — Customer Ascension flowchart (Section 7.0c)

4-node `flowchart LR` rendering the tier progression with semantic colors: Front-door → `--accent` (cyan), Core → `--info` (purple), Premium → `--warn` (amber), Subscription → `--success` (green). Edge labels carry typical conversion / attach rates from Phase 1B benchmarks where surfaced, otherwise `n/a`. Scoped via a new `.money-model-ascension` class on the `.diagram` container so the 4-tier color cycle applies only to this specific flowchart, not the AS-IS or PROPOSED diagrams. Inherits the outline-only Mermaid themeCSS from v1.6.4; re-themes on light/dark toggle via the CSS-variable cascade.

### Brand attribution policy

Operator-facing Sections 1–8 stay brand-neutral. Tier labels are universal vocabulary (Front-door / Core / Premium / Subscription), not framework-specific terms. Framework source is named only in two places:
- `references/catalog.md` — model titles `Money Model Architecture (Hormozi)` and `Cash Conversion Check (30-day rule)`, following the existing `Value Equation (Hormozi)` precedent at line 94
- Appendix lens list — two new entries with one-line definitions naming the source framework

### No new questionnaire fields

Cash Conversion Check uses existing v1.8 BCD fields: Q10a (revenue), Q10b (margin), Q10d (pricing snapshot), Q13 (top acquisition channels), plus Phase 1B `CAC_BENCHMARK`. If workshop data shows the verdict is consistently `indeterminate`, v1.10 can add Q10e (estimated CAC) and Q10f (first-transaction gross profit) for a hard pass/fail. Deferred until data justifies the intake friction.

### Files changed
- `references/catalog.md` — two new model entries (#39 Money Model Architecture, #40 Cash Conversion Check); BCD trigger table gains 5 new signal rows; soft conventions gain two new ordering rules
- `references/report-structure.md` — new `### 7.0c — Money Model Architecture` sub-block spec; Section 7 source-chain mapping updated
- `skills/optimize/SKILL.md` — Phase 4 gains `### Section 7.0c render` subsection with token list, verdict color-class mapping, Section 5 anchor enforcement rule, and the soft-signal Cash Conversion inference algorithm + confidence-tier rules
- `skills/optimize/templates/report.html` — `{{money_model_block}}` token inserted between `{{first_hire_block}}` and the 7.1 heading; 4-tier semantic color CSS for `.money-model-ascension` flowcharts added to the document stylesheet
- `examples/sample-report.html` — representative Section 7.0c rendered for Mechanical Magic (Quick Rinse Drop-By → Master Restoration Day → MRD + Carrier Pack → MM Membership); Customer Ascension flowchart; Cash Conversion verdict (likely_passing, med confidence); sequencing note pointing to Subscription tier as first move. Appendix gains two new lens entries. Footer + appendix version bumped.
- `references/visual-primitives.md` — new `### Customer Ascension flowchart — Section 7.0c (added v1.9)` subsection documenting the source syntax, container class, and 4-tier semantic color cycle
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` → `v1.9.0`. **No new questions.**
- `.claude-plugin/plugin.json` — `1.8.0` → `1.9.0`
- `PRD.md` — version header → 1.9; model count 38 → 40; Section 7 description in §7 mentions 7.0c

### Pre-existing inconsistency flagged (out of scope)
`catalog.md:10` documents scoring formula with 3 factors; `SKILL.md` Phase 2 and `PRD.md` §5 document it as 4 factors (adding `market_multiplier`). Not introduced by this work. Flag for a separate v1.x patch.

## [1.8.0] — 2026-05-13

### Added — five new questionnaire fields anchoring report sections previously inferred from prose

A coverage audit cross-referenced each report section against the questions that fed it and found four high-priority gaps where the chain was inventing or guessing data because the questionnaire never asked for it. v1.8.0 closes the gaps with three required and two optional new fields, all on Page 3 of the intake alongside the existing financial baseline.

**Q10d — Pricing snapshot** (required). "What does the offer cost today?" Real price points, per-unit / per-job / per-month. Anchors the Section 2 Pricing Power Audit "where you sit" placement — replaces the chain's prose-inferred guess with the operator's actual numbers.

**Q12 — Revenue stream split** (required). Per-line-item percentage of revenue, summing to ~100. Anchors the Section 5 Revenue Diff Sankey's AS-IS source proportions. Previously the chain invented these proportions or pulled them from Q2 prose; now they come from the operator directly. SKILL.md Phase 3 updated with the rule: "Do not invent AS-IS proportions — if Q12 is empty, render the Sankey with a single AS-IS Revenue 100% stream and an Appendix flag."

**Q13 — Top acquisition channels** (required). Ranked top 3 sources of new customers. Anchors:
- Section 2 CAC Benchmark "where you sit" — chain cross-references industry CAC ranges against the channels the operator actually uses
- Section 3 AS-IS flowchart CHANNEL nodes — sourced one node per ranked channel rather than inferred from prose

**Q14 — Where the week goes** (optional). Top 3 categories of work consuming weekly hours with rough %. Anchors:
- Section 7.0 Automation Surface recommendations — automations are ranked against the operator's actual top tasks
- Section 7.0b First-Hire Roadmap "Delegate first" list — items pulled from the operator's stated time-consumers

**Q19 — Tools in use today** (optional). Software running the business today. Phase 1C updated with the rule: "Do not recommend tools the operator already runs. If a card's `common_tooling` matches a tool listed in Q19, swap for an alternative or annotate as a workflow-refinement opportunity instead of net-new install."

### Added — explicit deep-dive checkboxes on Page 4

The conditional sections on Page 5 (operational complexity, retention, team alignment) previously fired only via the `detectTriggers()` keyword regex on Q4 and Q7 prose. Phrasing like "operations are eating my evenings" wouldn't match the operational keyword set.

New `Q4b` on Page 4 — "Want to go deeper on any of these? (pick 0–3)" with three explicit checkboxes:
- Operations & workload
- Retention & churn
- Team alignment & incentives

`detectTriggers()` rewritten to OR the explicit checkbox state with the legacy prose keyword match. The checkbox is the primary signal; prose keywords remain as a fallback for operators who skip the checkboxes but describe the problem in matching language.

Checked-box state is written to the BCD under a new `## Requested Deep-Dive Areas` section so the chain can surface it as a signal in the Appendix.

### Added — Wispr Flow dictation tip card on Page 1

Promo card above the form on Page 1 recommending [Wispr Flow](https://wisprflow.ai/) — a free dictation tool — as a way to give richer answers. Standard `.callout` style with accent border, mono label `[ 🎤 ] PRO TIP — DICTATE YOUR ANSWERS`, brief copy ("3–4× more detail than typing alone"), and a CTA link to https://wisprflow.ai/. Standard nominative-use linking, same pattern as the Predictive Index recommendation in Section 7.0b.

### Files changed
- `skills/intake/templates/questionnaire.html` — Wispr Flow card on Page 1; five new fields on Page 3 (Q10d, Q12, Q13, Q14, Q19); Q4b checkbox on Page 4; `detectTriggers()` rewritten to OR checkbox + keyword signals; `buildBCD()` writer extended with new fields plus a `## Requested Deep-Dive Areas` block; `FORGE_VERSION` → `v1.8.0`
- `skills/optimize/SKILL.md` — Phase 1B query 7 (Pricing) anchored by Q10d; query 8 (CAC) anchored by Q13; Phase 1C anchored by Q14 + Q19 (don't recommend tools already in use); Phase 1D anchored by Q14; Phase 3 AS-IS flowchart CHANNEL nodes sourced from Q13; Phase 3 Revenue Diff Sankey sourced from Q12 with explicit "do not invent" rule
- `examples/sample-report.html` — appendix `forge v1.8.0`, footer `FORGE v1.8`
- `.claude-plugin/plugin.json` — `1.7.0` → `1.8.0`
- `CHANGELOG.md` — `[1.8.0]` entry

### Rationale
The audit found that the chain was repeatedly guessing or inventing data the report displayed as concrete (pricing tier placement, Sankey revenue proportions, channel mix, tool stack). Closing four of the gaps with three required + two optional questions adds ~3–5 minutes to the intake but moves the report from "looks specific" to "actually specific" in the most visually prominent diagrams (Sankey, AS-IS flowchart, Section 2 sub-blocks). The fifth gap (geographic scope for local-service businesses) was triaged to a future release as low-impact.

The Wispr Flow card is a separate but related improvement — operators who dictate produce richer prose for the long-form questions (Q1, Q4, Q5, Q7, Q25–Q30), which feeds the chain's qualitative analysis. The card is a recommendation, not required; intake works the same without it.

## [1.7.0] — 2026-05-13

### Changed — cinematic header rebuilt around UnicornStudio shader

The v1.6.x raw WebGL shader (multicolor glow blobs behind hollow outlined text) is retired. Replaced with the UnicornStudio shader at `data-us-project="bmaMERjX2VZDtPrh4Zwx"`, with the title `Business Model Optimization Report` overlaid on top — no outlines, semi-transparent fill (`rgba(232,236,238,0.92)`), accent-cyan glow via two-layer `text-shadow`.

Why the shift: the user provided UnicornStudio's official embed snippet for the specific shader they wanted. UnicornStudio is a third-party shader-as-a-service product — their CDN loads the project visual via `cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34`. We embed it the same way we embed Mermaid: load the loader script, mark the container with the `data-us-project` attribute, let the library handle the rest. Standard public-CDN embed usage.

### Title overlay

The title sits in a separate `.cine-header-title` layer above the shader (`z-index: 1`). Display font, 800 weight, `clamp(28px, 5.2vw, 64px)`. First line in `--text-primary` at 92% opacity, second line in `--accent`. Two-layer text-shadow gives a soft accent glow that reads in both themes (`[data-theme="light"]` swaps the glow color to the light-mode accent).

### Failure budget

- **`prefers-reduced-motion: reduce`** → loader script exits at entry; `.cine-header-bg` hidden via CSS. Bare title sits on the `--bg-elevated` panel — clean, readable.
- **`@media print`** → full `.cine-header` hidden.
- **CDN unreachable** → `script.onerror` logs a warning to console; `.cine-header-bg` stays empty. The title is always visible on the elevated panel, so the report reads correctly without the shader.
- **Light/dark theme toggle** → title text-shadow swaps to light-mode accent via `[data-theme="light"]` override. The UnicornStudio shader itself doesn't theme — it's fixed per the project's design — but its visual works against both backgrounds.

### Bundle weight

The v1.6 raw WebGL shader was ~5 KB inline. UnicornStudio loader is ~50 KB minified, plus the project data downloads from their CDN behind the scenes. Acceptable for the brand-coherent visual upgrade.

### Files changed
- `skills/optimize/templates/report.html` — `.cine-header` CSS restructured into bg + title + fallback layers; DOM swapped for UnicornStudio embed + title overlay; v1.6 raw WebGL shader script removed; UnicornStudio loader script added before `</body>`
- `examples/sample-report.html` — same mirror + appendix `v1.7.0` + footer `FORGE v1.7`
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` → `v1.7.0`
- `.claude-plugin/plugin.json` — `1.6.4` → `1.7.0` (minor bump for the shader architecture change)

### Why a minor bump (1.6 → 1.7)
The visual API doesn't break — the `.cine-header` element is in the same place with the same dimensions. But the underlying shader implementation switches from in-tree raw WebGL to an external CDN-hosted shader service. That's a significant architecture change worth a minor version, not just a patch.

## [1.6.4] — 2026-05-13

### Fixed — Sankey path model misunderstood through v1.6.3

Three earlier releases tried to force `fill: var(--accent)` on the Sankey flow paths. Wrong model: **Mermaid v11 sankey-beta renders flow paths via stroke**, with `fill="none"` and a per-link `stroke-width` set proportional to the flow value. Forcing fill on a stroke-rendered path inverts the rendering — the path becomes a hairline filled region instead of a wide stroked ribbon. That's why the flows looked "collapsed" through v1.6.1, v1.6.2, and v1.6.3.

### Restyle, rebuilt with the correct model

**Flow paths** now keep Mermaid's stroke-with-gradient model. The CSS no longer touches `fill` or `stroke` directly — just opacity and blend mode. Mermaid's per-link `stroke="url(#linkGradient-N)"` references are preserved.

**Node bars** cycle through the brand palette via `:nth-of-type(4n+1)`, `(4n+2)`, `(4n+3)`, `(4n+4)` — `--accent` / `--info` / `--warn` / `--success`. Solid fills, no strokes. Each node gets a distinct color from the four-color brand cycle.

**Multicolor flow gradients** restored by overriding the `<linearGradient>` stop colors in `<defs>` via the same nth-of-type cycle. Each link's gradient transitions between two brand colors instead of Mermaid's d3 schemeTableau10 palette (the pink/yellow/random colors visible in earlier screenshots). Cycle: accent→info, info→warn, warn→success, success→accent, repeating.

**Mix-blend-mode** stays — `screen` in dark theme so overlapping flows brighten where they cross, `multiply` in light theme for white-bg legibility.

**Labels** stay uniform `var(--text-primary)` in mono.

### Selector strategy unchanged
Document-level CSS (not Mermaid themeCSS — that channel is ignored by sankey-beta). Scoped via `:has(g.links)` structural selector plus `aria-roledescription="sankey-beta"` / `"sankey"` fallbacks for browsers without `:has()`.

### Files changed
- `skills/optimize/templates/report.html` — Sankey CSS rebuilt with correct stroke-path model + nth-of-type palette cycling
- `examples/sample-report.html` — same mirror + appendix `v1.6.4`
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` → `v1.6.4`
- `.claude-plugin/plugin.json` → `1.6.4`

## [1.6.3] — 2026-05-13

### Fixed — Sankey CSS escaped Mermaid's themeCSS into the document stylesheet

v1.6.2's Sankey overrides lived inside Mermaid's `themeCSS` config option. Live-URL inspection after that release showed the node labels were still rendering in Mermaid's auto-assigned per-node color palette (pink for "Mixed house wash", yellow for "Drone photography", cyan for "Master Restoration Day", etc.) — strong evidence that **Mermaid v11 sankey-beta does not honor the `themeCSS` option for its rendered nodes and links**, even though it does for flowcharts. Two release iterations of themeCSS overrides had no effect on the Sankey at all.

**Fix:** moved every Sankey selector out of `themeCSS` and into the document's main `<style>` block. Document-level CSS cascades into inline SVGs unconditionally, so it doesn't depend on Mermaid's injection mechanism working for any specific diagram type.

Three selector strategies are stacked for robustness across Mermaid versions:

1. `svg[aria-roledescription="sankey-beta"]` — preferred when Mermaid sets that attribute on the root SVG
2. `svg[aria-roledescription="sankey"]` — fallback for variants where Mermaid drops the `-beta` suffix
3. `svg:has(g.links)` — structural fallback. Sankey is the only diagram type that produces a `<g class="links">` element, so this reliably catches the Sankey SVG regardless of aria attributes. Modern browser support is good (Chrome 105+, Firefox 121+, Safari 15.4+).

After this fix:
- Node bars render at full accent-cyan saturation
- Flow ribbons render at 0.55 fill-opacity with `mix-blend-mode: screen` so overlapping flows brighten where they cross
- Labels render in `var(--text-primary)` mono at 12px (Mermaid's per-node palette is fully suppressed)
- Light mode switches blend mode to `multiply` for white-bg readability

### Lessons recorded
- Mermaid v11 sankey-beta's CSS extension surface is incomplete relative to flowchart-v2. Document-level CSS is the durable path for sankey styling. Saved to project memory.
- The `:has()` structural selector is the most version-stable way to identify the Sankey SVG when aria attributes vary.

### Files changed
- `skills/optimize/templates/report.html` — Sankey CSS block moved out of `OUTLINE_CSS` (which is passed as `themeCSS`) into the document's main `<style>` section. The themeCSS sankey rules from v1.6.2 stay too, as harmless backup for any future Mermaid release that does honor them.
- `examples/sample-report.html` — same change mirrored + appendix version bump
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` → `v1.6.3`
- `.claude-plugin/plugin.json` — `1.6.2` → `1.6.3`

## [1.6.2] — 2026-05-13

### Fixed — Sankey diagram restyle from scratch

v1.6.1's Sankey overrides didn't reach far enough. Two screenshots in dark and light themes confirmed the node bars were still nearly invisible and the flow ribbons were thin lines, not proportional streams. Diagnosis: Mermaid v11 sankey-beta sets `fill="#color"` and `opacity="0.6"` as **inline SVG attributes** on its node `<rect>` and link `<path>` elements. CSS selectors like `rect.node` matched, but the inline-attribute precedence was beating the override on some browsers, and the `mix-blend-mode` wasn't kicking in at all.

**Rewrote the Sankey CSS scoped via `svg[aria-roledescription="sankey-beta"]`** — the attribute Mermaid v11 sets on the root SVG. Every selector targets that scope:

- Node bars (`rect`, `g.nodes rect`, `rect.node`) → `fill: var(--accent)`, `fill-opacity: 1`, `opacity: 1`, `stroke-width: 0`. The bars now render at full accent-cyan saturation against the dark bg.
- Flow ribbons (`path`, `g.links path`, `path.link`) → `fill: var(--accent)`, `fill-opacity: 0.55`, `mix-blend-mode: screen` so overlapping flows brighten where they cross.
- Hover state → `fill-opacity: 0.80` for tactile feedback.
- Labels → `var(--text-primary)` color, mono font 12px with letter-spacing.
- Light mode → switches `mix-blend-mode` from `screen` to `multiply` and drops fill-opacity to 0.45 so flows stay readable against the white background.

### Added — percentage labels on Sankey values

The numbers were percentages all along (AS-IS sources sum to 100, outflows sum to 100), but nothing in the diagram or caption signaled that they were percentages. The values could have been read as dollars-in-thousands or job counts.

**Fix:** added a `%%{init}%%` config directive at the top of the Sankey source:

```
---
config:
  sankey:
    showValues: true
    suffix: "%"
    nodeAlignment: justify
---
```

`suffix: "%"` appends `%` to every node value. Labels now read `Driveway-only jobs 28%`, `Master Restoration Day 55%`, `Cut from offer (Via Negativa) 15%`, etc.

### Changed — Sankey caption rewritten for clarity

Old caption talked about "revenue share" without explicitly naming the percentage convention. New caption opens with "Numbers are percentages of total revenue. AS-IS source streams on the left (sum to 100%) flow into the central revenue hub and rewire into PROPOSED destinations on the right." The "Cut from offer" language is reinforced as an exit, not a destination.

### Files changed
- `skills/optimize/templates/report.html` — Sankey CSS rebuilt from scratch with aria-roledescription scoping + light-mode blend-mode override
- `examples/sample-report.html` — same CSS + `%%{init}%%` directive + caption rewrite + appendix version bump
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` → `v1.6.2`
- `.claude-plugin/plugin.json` — `1.6.1` → `1.6.2`

## [1.6.1] — 2026-05-12

### Fixed — Sankey diagram visibility and clarity

Three issues surfaced on the first live read of the v1.6.0 Sankey:

**Node bars blending into the background.** The v1.6.0 outline-only `themeCSS` rule targeted `.node rect` as a descendant selector, which doesn't match Sankey's `<rect class="node">` direct-element pattern. But Mermaid's `themeVariables.primaryColor: '#11161A'` (the dark elevated background) was being applied as the Sankey node fill, so the bars rendered in nearly the same color as the page. Added an explicit `rect.node` override in `themeCSS` that paints Sankey node bars in `var(--accent)` at 0.92 fill-opacity. Restores the prominent colored side and center bars from v1.5.

**Flow ribbons too dim against the dark background.** Default Sankey-beta link rendering was muted. Added overrides for `.sankey-link`, `g.links path`, and `path.link` that fill in accent cyan at 0.45 opacity (lifting to 0.65 on hover). Ribbons now read clearly against the terminal-noir bg without competing with the node bars.

**"Eliminated lines 15" reading as a proposed revenue destination.** The original spec modeled the cut revenue as an outflow from the AS-IS Revenue hub (so the math balances at 100), but the label "Eliminated lines" in the destination column read as a fourth proposed revenue stream alongside Master Restoration Day and Subscription book. Renamed to `Cut from offer (Via Negativa)` so it's explicit that this is revenue being removed from the model, not redirected to a new destination. Updated the caption beneath to reinforce: "the 'Cut from offer' outflow is revenue Via Negativa removes from the model — not a destination, just where the eliminated lines land in the math."

### Files changed
- `skills/optimize/templates/report.html` — Sankey-specific overrides appended to `OUTLINE_CSS`
- `examples/sample-report.html` — same overrides + "Eliminated lines" → "Cut from offer (Via Negativa)" label rename + caption update
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` → `v1.6.1`
- `.claude-plugin/plugin.json` — `1.6.0` → `1.6.1`

### Auto-tag workflow first activation
v1.6.0 added `.github/workflows/auto-tag-release.yml` but the workflow couldn't fire on its own v1.6.0 merge (it wasn't on main yet). v1.6.1 is the first release where the workflow auto-creates the tag and GitHub release on merge — the manual `git tag` + `gh release create` steps from earlier releases are skipped.

## [1.6.0] — 2026-05-12

### Changed — cinematic header redesign

The v1.5 Three.js + GSAP + ScrollTrigger scroll layer was retired. First live reads exposed real problems: the hero scene's 100vh canvas overlapped the `.bg-num` "01" section numeral (leaving it floating mid-section with nothing under it), Chrome had occasional rendering hiccups, and the ~380 KB library bundle was outsized for what the scenes actually conveyed.

Replaced with a single bounded **raw-WebGL shader header** above Section 1 that renders the title `BUSINESS MODEL OPTIMIZATION REPORT` in Inter Tight 800 with an accent-tinted sweep across the letterforms and a faint scanline overlay. ~150 lines of inline shader code, no external libraries, ~5 KB on the wire (vs 380 KB before). Sits *above* Section 1 instead of *behind* it, so the `.bg-num` numeral stays in its own visual lane.

The v1.5 footer convergence scene was removed entirely. The Tally CTA now stands alone at the document's close.

### Changed — Mermaid diagrams restyled to outline-only

The AS-IS flowchart's FRICTION nodes used `fill:#ef4444` (red) with `color:#fff`, and the PROPOSED flowchart used `fill:#10b981` (green) and `fill:#f59e0b` (amber). On the terminal-noir dark background the saturated fills overpowered the page and white labels were hard to read against the brighter portions.

Switched to **outline-only via Mermaid's `themeCSS` option**: every node renders with `fill: transparent` and a 1.5px stroke. Class-driven border semantics — `g.node.friction` gets `--warn` (amber), `g.node.added` gets `--success` (green), `g.node.changed` gets `--info` (purple), `g.node.removed` gets `--text-muted` dashed at 0.7 opacity. Labels render in `--text-primary`, contrast-correct in both themes. Light/dark toggle re-themes the SVG in place via CSS custom-property cascade — no re-render.

Diagram source carries only class names; the hardcoded hex fills are gone. `references/visual-primitives.md` updated to reflect the new pattern.

### Added — model-pruning instrumentation (PRD §5 follow-through)

Phase 4 now writes two artifacts on every run so the PRD's empirical-pruning roadmap can actually happen:

- **`~/forge-runs/[business-slug]-[YYYY-MM-DD].models.json`** — full chain trace: every catalog model that was scored, whether it fired, its score components (`base_relevance`, `subtractive_weight`, `bcd_multiplier`, `market_multiplier`), output size, plus BCD context (industry, revenue range, primary bottleneck) and phase durations. Lets you analyze a single run end-to-end.
- **`~/forge-runs/model-fires.csv`** — one row per `(run, model)` appended on every run, header written on first creation. Columns: `run_id, timestamp, industry, revenue_range, model_name, model_class, fired, score`. Pivot-table source for the across-workshops analysis described in PRD §5.

The Appendix Run Metadata block gains a new `Pruning log:` line linking to the per-run JSON. Falls back to the working directory if `~/forge-runs/` is not writable. Never aborts the report render on log-write failure.

### Fixed
- **Mobile scroll gap between sections.** The 96px `.section` margin-bottom was visually overlong on narrow viewports, producing a multi-screen blank between Section 6's "What to watch" and Section 7. Added a `@media (max-width: 640px)` rule that compresses section gaps to 56px.

### Polish iterations folded into v1.6.0
- **Shader effect redesigned to multicolor glow + hollow text.** First live read showed the bump-textured filled letters didn't read as cleanly as intended. Replaced with three drifting glow blobs (`--accent` cyan + `--info` purple + `--warn` amber) behind hollow outlined text. The text canvas paints a filled alpha mask; the fragment shader edge-detects that mask to produce a thin accent-cyan outline. The glow shines through the transparent letter interiors. All three blob positions drift on independent slow cycles for continuous motion.
- **All six Mermaid diagrams centered within their `.diagram` row.** Previously the rendered SVG sat left-justified inside the container, leaving uneven negative space on the right. Added `.diagram .mermaid { text-align: center }` and `.diagram .mermaid svg { display: inline-block; margin: 0 auto }` so AS-IS, PROPOSED, Sankey, Gantt, Pre-Mortem Quadrant, and Revenue Trajectory all center cleanly. Wide diagrams still scroll horizontally on mobile via the existing `.diagram { overflow-x: auto }`.
- **PI highlight card stacks vertically on viewports <640px.** The inline `display:flex` was cramping the logo + text row on phone widths. Added `.pi-card` class and a `@media (max-width:640px)` rule that flips to `flex-direction: column`, centers everything, and caps the logo at 140px. SKILL.md PI card spec updated to require the class.
- **Auto-tag GitHub Action.** `.github/workflows/auto-tag-release.yml` reads `plugin.json` on every push to main and creates a matching `v*` tag + GitHub release whose notes come from the matching `## [x.y.z]` section of CHANGELOG.md. Detects existing tags and exits cleanly to avoid duplicate releases. Activates from v1.6.1 onward; v1.6.0 itself is tagged manually before the workflow lands on main.

### Removed
- v1.5 `.cine-hero` element from Section 1 and `.cine-footer` element from before the Tally CTA
- v1.5 inline Three.js + GSAP + ScrollTrigger script block (~350 lines, ~380 KB CDN payload)
- All hardcoded fill colors in Mermaid `classDef` declarations (replaced with `fill:none` + `themeCSS` semantics)
- v1.6.0 first-iteration shader (filled letters with band sweep + scanline) — superseded by the multicolor-glow + hollow-text redesign described above

### Files changed
- `skills/optimize/templates/report.html` — cinematic CSS/DOM/script swap, Mermaid `themeCSS` injection, mobile margin rule, Appendix pruning-log line
- `examples/sample-report.html` — mirrored changes + sample diagrams switched to outline-only `classDef fill:none` + sample pruning-log path in Run Metadata
- `skills/optimize/SKILL.md` — Phase 4 gains a "Model-pruning instrumentation" subsection specifying JSON + CSV outputs and failure handling
- `references/visual-primitives.md` — Mermaid Theme section gains `themeCSS` spec; AS-IS and PROPOSED diagram modifier guidance switched to `fill:none`; Cinematic Layer section rewritten for v1.6
- `skills/intake/templates/questionnaire.html` — `FORGE_VERSION` bumped to `v1.6.0`
- `examples/sample-report.html` — footer reads `FORGE v1.6`, appendix reads `forge v1.6.0`
- `.claude-plugin/plugin.json` — `1.5.2` → `1.6.0`
- `PRD.md` — version header → 1.6

### Rationale
Three honest reads on what shipped in v1.5 — the Chrome rendering issues, the bg-num overlap, the Mermaid color overload, the mobile gap — drove this release. v1.6 trades the v1.5 dependency-heavy scroll cinematic for a single restrained shader, restyles the diagrams toward the brand's "technical schematic" aesthetic, and instruments the pipeline so the next 5+ workshops produce data that can actually inform PRD §5's catalog pruning.

Workshop-ready: the deliverable now stays clean in both themes, the diagrams read at a glance instead of fighting for attention, and the cinematic motion is bounded and unobtrusive.

## [1.5.2] — 2026-05-12

### Fixed
- **Bare `<a>` tags rendered in browser-default blue.** The Automation Surface and First-Hire Roadmap source notes use `<p class="body-sm">Sourced from: <a>…</a></p>` markup. The existing `.sources a` rule is class-scoped and didn't apply to these paragraphs, so the links fell back to the user-agent default `#0000EE` blue — unreadable against the terminal-noir dark background. Added a base `a` rule that styles every anchor in the document with `var(--accent)`, prevents the dreaded purple `:visited` color, and underlines on hover for affordance. More-specific rules (`.sources a`, `a.move`, inline-styled CTAs) continue to override.
- **Stale `v1.3.1` literal version strings in the rendered sample report.** When v1.5.0 and v1.5.1 shipped, the template's tokenized version substitutions (`{{plugin_version_full}}`, `{{plugin_version_short}}`) were bumped via `plugin.json`, but the static sample at `examples/sample-report.html` still carried the literal `v1.3.1` / `v1.3` strings rendered when v1.3.1 was current. Resynced both to `v1.5.2` / `v1.5` so the live GitHub Pages sample matches the rest of the deliverable.
- **Stale `FORGE_VERSION` constant in the intake form.** `skills/intake/templates/questionnaire.html` carried `FORGE_VERSION = 'v1.3.1'` left over from the v1.3.1 release. BCDs generated from the form were stamped with the wrong version. Bumped to `v1.5.2`.
- **Stale `v1.2.0` reference in PRD §10 verification text.** Replaced with a version-agnostic instruction so the verification step doesn't drift again on future releases.

### Rationale
Comprehensive surface-area audit triggered by a reader screenshot showing the source-note hyperlinks rendering as dark unreadable blue on the dark theme. The audit also surfaced three version-string drift bugs that had no functional impact but eroded the polish of the deliverable. All four fixes ship together as a single patch release. No template structure, no behavior changes, no new dependencies.

### Cross-checked and confirmed correct
- `references/DESIGN.md` §08 cinematic exception ✓
- `references/visual-primitives.md` § Cinematic Layer ✓
- `references/report-structure.md` 7.0 + 7.0b sub-block specs ✓
- `PRD.md` §6.3 covers Phases 1A/1B/1C/1D ✓
- `PRD.md` §7 mentions all v1.4 sub-blocks and the v1.5 cinematic layer ✓
- CHANGELOG entries for 1.3.0, 1.3.1, 1.4.0, 1.5.0, 1.5.1 all present in correct order ✓
- README "Try the intake form" + "Sample output" links present ✓
- All hot-linked external assets (PI logo, Three.js, GSAP via jsdelivr) reference by URL only, no asset redistribution ✓

## [1.5.1] — 2026-05-12

### Fixed — cinematic layer was barely visible

v1.5.0 shipped the two Three.js scenes, but the first live render exposed the issue immediately: the footer scene's six wireframe primitives faded fully to `opacity: 0` at the timeline midpoint, so any reader who scrolled past the trigger range was left looking at a lone pulsing dot. The hero scene's back grid layers were at `opacity: 0.18` and `0.32` on the dark background — close to invisible — and neither scene had any motion when the user wasn't actively scrolling.

This patch addresses all three:

**Hero scene visibility.** Grid layer opacities boosted from `0.18 / 0.32 / 0.55 / 0.85` to `0.45 / 0.65 / 0.85 / 1.0`. Plane scales bumped up. Grid line width set to 1.5px in the canvas texture. Point cloud doubled in density (60 → 120 points) and brightness, with a second `Points` layer in `AdditiveBlending` mode acting as a real glow halo. Camera dolly extended from `z: 5 → 1.8` to `z: 5 → 0.6` for a more cinematic depth pull.

**Ambient motion in both scenes.** Both render loops now advance a continuous time variable and drive small motion regardless of scroll state. Hero gets subtle camera sway on x/y plus slow rotation on the point cloud. Footer gets continuous rotation on each wireframe primitive with a randomized spin speed per cube. The scenes feel alive even when the reader is idle.

**Footer convergence stays visible.** Primitives no longer fade to `opacity: 0` at the end of the convergence — they end at `opacity: 0.4` so the converged composition reads at any scroll position. Primitive color switched from `--text-faint` to `--accent` so they read against the dark background.

**Center pulse is now a beat, not a flicker.** Scale range expanded from `1 → 1.4` to `1 → 2.2`, cadence sped from 1.6s to 1.2s. A halo sphere (additive blending, 2.5× the radius) pulses on a slightly offset 1.5s cycle for a layered breathing effect. The central sphere now starts at `opacity: 0.4` instead of `0` so the reader sees the dot before scroll even fires the timeline.

**Footer trigger range widened.** ScrollTrigger range loosened from `top 80% / bottom 30%` to `top 90% / bottom 40%` so the convergence is in-view for a larger scroll window.

### Files changed
- `skills/optimize/templates/report.html` — `buildHeroScene`, `buildFooterScene`, both ScrollTrigger timelines, both pulse loops
- `examples/sample-report.html` — identical changes mirrored so the live GitHub Pages sample reflects the fix
- `.claude-plugin/plugin.json` — `1.5.0` → `1.5.1`

### Rationale
The brand spec says "restraint is the brand," but restraint that nobody can see is just absence. v1.5.0 over-corrected on the side of subtlety. v1.5.1 keeps the geometry-only, palette-respecting brand discipline — every change above stays within the existing DESIGN.md §02 palette and the §08 cinematic exception — while bringing the scenes far enough above the perceptual floor that they actually register as motion.

## [1.5.0] — 2026-05-12

### Added — cinematic scroll layer

Two scroll-driven Three.js scenes bookend the intelligence report. The middle of the document stays 2D — the cinematic layer frames the deliverable rather than running through it.

**Hero scene (Section 1).** Four `PlaneGeometry` layers carrying procedural grid textures, receding in z behind the `THE DIAGNOSIS. / THE PLAN.` headline. A 60-point accent cloud glows in `--accent`. ScrollTrigger pinned to `#sec1` dollies the camera from `z: 5` to `z: 1.8` while the four layers separate further in z. The accent point cloud rotates 0.35 rad on Y and intensifies from 55% to 95% opacity. Display text stays anchored above the canvas throughout.

**Footer scene (convergence into the Tally CTA).** Six wireframe `BoxGeometry` primitives start scattered and converge to `(0, 0, 0)` as the user scrolls into the footer region. At the midpoint they fade out; a central accent sphere fades in and runs an infinite sine-in-out pulse loop. Reinforces the report's diagnose-and-converge narrative — many candidate moves resolve into one clear plan, then the Tally CTA presents the next action.

### Brand discipline (DESIGN.md §08 amendment)

The existing §08 Motion rule banned parallax and infinite loops outright. v1.5 adds a tightly-scoped exception for the cinematic layer:

- **Geometry only.** No photographic imagery, no people, no products. Procedural grid textures, wireframe primitives, accent points.
- **Palette discipline.** Scene materials read from the same CSS custom properties (`--accent`, `--text-faint`, `--rule`, `--bg-primary`) as the rest of the document. No new colors.
- **Bookended, not pervasive.** Scenes are confined to Section 1 and the footer. The middle of the report stays 2D.
- **Opt-out by default.** `prefers-reduced-motion: reduce` skips the layer entirely. Print stylesheet hides both containers. CDN failure leaves containers transparent.

### Library loading

Three.js + GSAP + ScrollTrigger load asynchronously from `cdn.jsdelivr.net` via dynamic ESM `import()`:

- `three@0.160` — `build/three.module.js`
- `gsap@3.12.5` — `index.js`
- `gsap@3.12.5/ScrollTrigger.js`

Bundle weight is ~380 KB minified+gzipped over the wire, loaded async after first paint so it does not block document render. All three libraries are accessed by URL only; no library code is redistributed in the deliverable.

### Theme reactivity

Both scenes read their palette from CSS custom properties at init. The existing theme toggle now dispatches a `forge-theme-change` CustomEvent that each scene listens for — point materials swap to the new accent color, grid textures regenerate from the new rule color. No flash, no layout shift.

### Failure budget

- **`prefers-reduced-motion: reduce`** → cinematic layer skipped at script entry. Static document reads normally.
- **`@media print`** → containers hidden by CSS. PDF exports unaffected.
- **CDN unreachable** → dynamic `import()` rejects, script throws and exits, `.cine-*` containers stay transparent. Reader sees the static document.
- **Mobile pixel-ratio cap** → `Math.min(window.devicePixelRatio, 2)` prevents 4K retina screens from rendering at 4x cost.
- **GPU cleanup** → `beforeunload` listener disposes both renderers' WebGL contexts and cancels animation frames.

### Files changed

- `skills/optimize/templates/report.html` — 2 scene containers, ~12 lines of CSS, ~230 lines of inline scene script, theme-toggle dispatch line
- `examples/sample-report.html` — same additions mirrored so the live GitHub Pages sample plays the scenes
- `references/visual-primitives.md` — new "§ Cinematic Layer" subsection
- `references/DESIGN.md` — §08 Motion gains a "Cinematic layer exception" sub-section
- `PRD.md` — version → 1.5
- `.claude-plugin/plugin.json` — `1.4.0` → `1.5.0`

### Rationale
v1.4 closed the operator-content gap. v1.5 closes the visual-distinctiveness gap. The cinematic layer makes the report feel like a deliverable that someone built, not a template that someone filled. Restraint is the brand — scenes are confined to two bookends, geometry-only, palette-respecting, with graceful fallback at every degraded path.

## [1.4.0] — 2026-05-12

### Added — three new research-driven sub-blocks

**Pricing Power Audit (Section 2 sub-block).** Three-tier industry pricing distribution (low / median / premium) with cited example operators at each tier, plus an explicit "Where you sit" placement of the operator's current pricing on the distribution. Most solo operators have never seen their pricing positioned against the full industry spread; the audit makes the next tier up visible and shows what moving up requires.

**Customer Acquisition Cost (Section 2 sub-block).** Industry-typical CAC range, primary channels, payback period, and LTV/CAC ratio. Cited or substituted with "Not benchmarked — pilot to measure." Pairs with Section 7's compounding additions — most amplifications either lower CAC or lift LTV, and now the operator has the benchmark to measure against.

**First-Hire Roadmap (Section 7.0b sub-block).** Cited revenue-threshold benchmarks for when most operators in the sector make their first hire, the role most commonly hired first, and the responsibilities most often delegated. Paired with a **Predictive Index highlight card** recommending the operator take the PI Behavioral Assessment themselves before creating any role and screen every candidate against the role's behavioral profile. The PI card is fixed copy (industry-agnostic) and renders even when Phase 1D surfaces no cited hiring benchmarks for the sector.

### Added — pipeline phases

- **Phase 1B extension** in `optimize/SKILL.md`. Query types 7 (Pricing distribution) and 8 (Customer acquisition cost) join the existing six market-reality queries. Both honor the cite-or-omit discipline from Phases 1C/1D.
- **Phase 1D — First-Hire Research.** New phase between Phase 1C (Automation Surface) and Phase 2 (Chain). 3–4 WebSearch queries derived from the operator's industry, business type, and stated bottleneck. Bounded at 4 searches + 8 fetches. Synthesizes the `FIRST_HIRE` context with `{trigger_revenue, first_role, what_to_delegate_first, why_this_role, source_url, confidence}`.

### Added — template tokens

Section 2 gains: `{{pricing_power_intro}}`, `{{pricing_low_range}}`, `{{pricing_median_range}}`, `{{pricing_premium_range}}`, `{{pricing_low_examples}}`, `{{pricing_median_examples}}`, `{{pricing_premium_examples}}`, `{{pricing_where_you_sit}}`, `{{cac_intro}}`, `{{cac_range_body}}`, `{{cac_payback_body}}`.

Section 7 gains a single composite token `{{first_hire_block}}` (mirroring the `{{automation_surface_block}}` pattern). The pipeline assembles the full sub-block at render time so an empty Phase 1D still leaves a clean substitution — and the PI highlight card always renders.

### Changed
- **`references/report-structure.md`** documents the three new sub-blocks, including the PI logo handling (hot-linked via `<img src>` at max-width 180px with alt text), the cite-or-omit discipline, and the Phase 1D → 7.0b source-chain mapping.
- **`PRD.md`** version → 1.4. §6.3 documents Phase 1D. §7 mentions the three new sub-blocks under Sections 2 and 7.
- **`examples/sample-report.html`** renders representative content for all three new blocks for the Mechanical Magic (pressure-washing) sample, including a cited 3-tier pricing distribution, CAC range with payback math, and a First-Hire Roadmap with the PI highlight card.

### Implementation notes
- No new CSS introduced. Reuses `.grid.cols-3`, `.grid.cols-2`, `.cell`, `.cell-glyph`, `.cell-head`, `.cell-body`, `.callout`, and `.body-sm`.
- The Predictive Index logo is hot-linked from PI's own CDN (`media.predictiveindex.com`) with `alt="Predictive Index"` for accessibility. The deliverable references the URL only; the logo asset is not redistributed.
- Cite-or-omit discipline holds across all three new blocks. The Pricing Power Audit and CAC Benchmark substitute with "Not benchmarked — pilot to measure" when no benchmark surfaces. The First-Hire Roadmap substitutes the When/Who cells but the PI card always renders.

### Rationale
A, B, and C from the prior session's brainstorm — the three sections rated highest on insight density, researchability, and compounding-with-existing-sections — now ship together. The PI partnership card recognizes that the most expensive part of a first hire is not the salary; it is hiring the wrong behavioral profile. The card grounds the *how to screen* in a real behavioral-assessment tool, while Phase 1D grounds the *when and who* in cited industry data.

## [1.3.1] — 2026-05-12

### Fixed
- **Stale `v1.0` version strings across the report and intake form.** Three locations were carrying the original release's hardcoded version string and no longer reflected reality. Fixed by introducing template tokens that pull from `.claude-plugin/plugin.json` at render time, so future bumps update one place and propagate:
  - Report Appendix Run Metadata: `Plugin version: forge v1.0.0` → `Plugin version: forge {{plugin_version_full}}` (renders as `forge v1.3.1`)
  - Report brand footer-mark: `FORGE v1.0` → `FORGE {{plugin_version_short}}` (renders as `FORGE v1.3`, dropping the patch suffix)
  - Intake form BCD-generation script: `Generated by: Forge Intake v1.0` → now interpolates a new `FORGE_VERSION` constant alongside the existing `FACILITATOR_EMAIL` constant

### Added
- **Live workshop CTA in the report footer.** A new `.callout` block between the Appendix and the brand footer-mark invites recipients to apply for the next live Business Model Strip Down (Thursdays at 7pm, hosted at https://tally.so/r/aQj7dy). Reuses the existing `.callout` component — accent border, accent-soft background, inherits light/dark theme automatically. No new CSS introduced.

### Changed
- **`optimize/SKILL.md` Phase 4** documents the new `{{plugin_version_full}}` and `{{plugin_version_short}}` substitutions, including the fallback when `plugin.json` is unreadable. Also documents the Tally CTA as a fixed template element (not a token).

### Rationale
The stale `v1.0` strings made every shipped report carry a small lie about its provenance. The Tally CTA gives recipients a clear next step — the report ends with action, not just a footer. Both fixes are small but visible: this is what every operator sees when they reach the bottom of their report.

## [1.3.0] — 2026-05-12

### Added
- **Section 7.0 — Automation Surface** in the intelligence report. A research-driven sub-block at the head of Section 7 (Amplified Moves) that surfaces 3–6 industry-standard AI, automation, and agentic-AI use cases the operator could plug in immediately. Each card carries a category chip (Standard / Emerging / Experimental), what it replaces, common tooling stack, and a cited weekly-hours-saved range. A total-hours-recoverable callout sums the cited cards above the grid with `data-countup` animation. Inline source citations beneath the grid list every WebFetch URL the hours figures came from.
- **Phase 1C — Automation Surface Research** in `optimize/SKILL.md`. Runs after Phase 1B (market research) and before Phase 2 (chain). Derives 3–5 WebSearch queries from the operator's industry term, business type, and stated bottleneck — preferring the Phase 1A Web Supplement's positioning language over the raw BCD field when industry vocabulary diverges. Bound at 5 searches + 10 fetches. Hard cap at 6 cards rendered.

### Changed
- **`optimize/SKILL.md` Phase 4** extended with the Automation Surface render section. Documents the token list (`{{automation_surface_block}}`, `{{automation_surface_intro}}`, `{{automation_total_hours_low/high}}`, `{{automation_total_caveat}}`, `{{automation_cards_html}}`, `{{automation_sources_note}}`) and the per-card structure with category chip mapping (Standard → `.tag.success`, Emerging → `.tag.med`, Experimental → `.tag.low`).
- **`optimize/SKILL.md` "Failure modes to avoid"** gained a "Do not invent automation hours" rule. Every numeric `hours_per_week_saved` figure in Section 7.0 must trace to a real WebFetch source from Phase 1C. Uncited use cases still render — without a number, with `Not benchmarked — pilot to measure` in the hours slot. The total-hours callout sums only cited entries.
- **`optimize/SKILL.md` front-matter description** updated from "four-phase" to the pipeline-step list, since Phase 1C is a new step but does not break the four-phase mental model (1A/1B/1C are sub-phases of "Phase 1 — Research").
- **`templates/report.html`** has a single new token `{{automation_surface_block}}` inserted between the goal-framing callout and the 7.1 heading. The pipeline composes the full sub-block (header, callout, grid, sources note) into this token; if Phase 1C surfaced nothing, the substitution is the empty string and the section flows from the goal caveat straight to 7.1.
- **`references/report-structure.md`** now documents Section 7.0 as a v1.3 sub-block under Section 7, including the per-card structure, component reuse (`.tag.success` / `.tag.med` / `.tag.low` for category chips), and failure handling.

### Rationale
Most solo operators have never seen the off-the-shelf AI/automation toolbox their sector has already adopted. The chain produces bespoke compounding moves but does not surface this layer — which is the lowest-effort, highest-leverage tier available to almost any operator. Putting it at the head of Section 7 (before the bespoke compounding moves) means the operator sees the plug-in wins first and the chain-derived additions second. Research-only sourcing with citations matches the existing Section 2 discipline; no invented numbers.

### Documentation
- PRD.md updated: version header bumped to 1.3, Phase 1C added to §6.3, Section 7 description in §7 updated to mention 7.0.
- `examples/sample-report.html` extended with a representative 7.0 block for the pressure-washing sample BCD.

## [1.2.2] — 2026-05-11

### Changed (voice)
- **All public-facing copy now leads with the dream outcome, no contrastive reframes.** Earlier surfaces opened with "isn't / is" inversions that DESIGN.md §01 had always banned in principle but the artifacts kept violating in practice. Replaced across every public surface:
  - **Intake form Page 1 hero**: `YOUR BUSINESS ISN'T BROKEN. / YOUR ASSUMPTIONS ARE.` → **`WHERE YOUR BUSINESS IS. / WHERE IT COULD GO.`**
  - **Report Section 1 hero**: `THE FRAMEWORK ISN'T THE WORK. / THE DISTILLATION IS.` → **`THE DIAGNOSIS. / THE PLAN.`**
  - **Brand tagline** (used in README closing, intake top + bottom, report footer, DESIGN.md canonical brand line): `The work isn't in the framework. It's in the distillation.` → **`A clear plan for your business, backed by market data.`**
  - **Report footer signature**: `Your business isn't broken. Your assumptions are.` → unified with the brand tagline above; one slogan to maintain instead of two.
  - **Intake field probe** on Page 4 Q5: `One specific example. Generic answers aren't data.` → **`One specific example. Be concrete.`**
  - **Sample report (DJ Moran / Mechanical Magic)**: rewrote two diagnostic sentences that used the same contrastive pattern (`The gap is not a marketing problem and not a lead problem. The gap is that…` and `The bottleneck is not demand. The bottleneck is…`) to lead with the affirmative finding instead.
- **DESIGN.md §01 anti-pattern rule expanded.** The one-line ban on contrastive reframes now spells out the failure modes (`X isn't Y. X is Z.`, `It's not X — it's Y.`, `This isn't about X.`, denial-as-instruction), gives explicit before/after examples, and tells the writer to rewrite the sentence rather than patch punctuation when caught.
- **`report-structure.md`** updated so the Section 1 brand-line hero spec matches the new `THE DIAGNOSIS. / THE PLAN.` text.

### Rationale
The old slogans were clever-by-negation and read as AI-slop to anyone who has read more than a few AI-written sales pages. The new line states the deliverable directly: a clear plan, for your business, backed by market data. Coherent across the journey — intake says "here's where we'll take you," report opens with "here's the diagnosis and plan," footer signs off with the brand line.

## [1.2.1] — 2026-05-11

### Documentation polish (no functional changes)
- README: six-badge row at the top (release, license, Claude Code, Claude Cowork, last commit, stars) colored from the terminal-noir DESIGN.md palette
- README: sample-report link now points to the GitHub Pages rendered view (https://skizzy203.github.io/forge/examples/sample-report.html), so clicking it opens the report in a browser rather than showing raw HTML source
- `optimize/SKILL.md`: deduped a stray `## Inputs` heading left over from the v1.2 refactor; Mode A section now reads `## Mode A — The four-phase pipeline` with `### Inputs` as a subsection
- `PRD.md`: full v1.2 alignment — §3 User & Use Case, §4 End-to-End Flow, §6.2 Intake, §6.4 Hook, §6.5 References, §9 Open Questions, and §10 Build Sequence & Verification all rewritten to reflect the single-command, three-mode architecture; version header bumped from 1.1 to 1.2 with an accurate three-version status line
- `intake/SKILL.md`: applicant-workflow references updated from `/optimize` to `/forge:optimize` Mode A auto-invocation

## [1.2.0] — 2026-05-11

### Changed
- **Workflow consolidated to a single command.** `/forge:optimize` is now the only surfaced slash command. It routes by intent across three modes:
  - **Mode A** — BCD detected (pasted, attached, or in `~/forge-intake/`) → run the four-phase pipeline
  - **Mode B** — no BCD present → point operator to the hosted intake form at `https://skizzy203.github.io/forge/`
  - **Mode C** — facilitator asks for customization ("custom form", "my workshop email is X", "offline copy") → invoke the internal intake helper to emit a tailored HTML file
- **`/forge:intake` removed from the operator-facing surface.** The intake skill survives in `skills/intake/` as an internal helper invoked only by `/forge:optimize` Mode C. Its description and `when_to_use` clearly mark it as internal; the README no longer mentions it as a command. End-users interact with one command for everything.
- **Hosted intake form is the default path.** Operators are pointed to `https://skizzy203.github.io/forge/` (root index redirects to the questionnaire) rather than asked to generate their own copy. Customization remains available through Mode C.
- **Hook notice text updated.** The auto-detect-bcd hook no longer mentions `/optimize` by name. It now says "Ask Forge to process the latest one when you are ready," matching the auto-invocation model.

### Added
- **`index.html` at the repo root** — meta-refresh redirect to `skills/intake/templates/questionnaire.html`. Lets the hosted URL be `https://skizzy203.github.io/forge/` (clean, brandable) rather than the long template path.

### Rationale
The slash command pair `/intake` + `/optimize` exposed two failure modes: (1) "intake" felt clinical (waiting-room language) compared to the actual output (an optimized business model); (2) typing `/optimize` with no BCD in scope produced a dead-end. Consolidating to one verb that matches the deliverable — and routing by intent rather than command name — eliminates both. Customization, offline resilience, and facilitator power-tooling are preserved as routing modes inside the single command.

## [1.1.0] — 2026-05-11

### Added
- **Section 7 (Amplified Moves)** in the intelligence report — surfaces up to three compounding additions to the base plan, each with a three-year revenue projection. Composed at render time from existing Phase 2 chain output (Operator Edge, Leverage Points, Moats, Asymmetric Risk, Feedback Loops) via the accretion filter. No new mental models added.
- **Section 8 (Pressure Test)** — surfaces Steelman, Strawman, ranked Pre-Mortem failure modes, second-order consequences, and a What-Survives summary. Composed from existing Phase 2 chain output (Pre-Mortem Analysis, Inversion 2nd pass, Second-Order Thinking, Value Equation, Operator Edge, JTBD, Via Negativa, First Principles).
- **Four new Mermaid diagram types** rendered inside the report:
  - Revenue Diff Sankey (Section 5) — `sankey-beta`, AS-IS revenue streams flowing into PROPOSED streams
  - Implementation Gantt (Section 6) — three moves with dependency chain
  - Pre-Mortem Quadrant (Section 8.2) — failure modes on Likelihood × Impact axes
  - Revenue Trajectory Chart (Section 7) — three-line `xychart-beta` showing no-changes vs. base-plan vs. base-plus-amplifications
- **HTML effectiveness layer** — reading progress bar, scroll-triggered section fade-in, animated number count-up on hero figures, hover-expand mental-model glossary in Appendix
- **Print stylesheet** — `@media print` block disables animations, hides progress bar, forces page-break-inside avoid on diagram containers, switches to light theme for ink savings
- **Anchor-link navigation** — Section 1 move teasers link to their full versions in Section 6; section anchors are deep-linkable
- **Offline graceful fallback for Mermaid** — a small detection script runs three seconds after page load. If Mermaid failed to load (CDN unreachable, browser offline), every `.mermaid` block is replaced with a clear notice telling the reader to reconnect. Reports degrade visibly rather than silently producing blank diagrams.
- **BCD schema validation** — Phase 1 now validates required BCD fields (operator name, business name, revenue range, biggest problem) before the chain runs. Missing fields produce a clear error rather than silently degrading report quality.
- **Industry-aware death-zone callout** — Phase 1B research surfaces industry-specific margin compression bands. The Section 7 death-zone callout only fires when the Year 3 projection actually crosses a surfaced band.
- **Dynamic Appendix lens list** — the Appendix now reflects only the models that actually fired during chain execution, not a hardcoded list.
- **Cross-platform auto-detect hook** — `hooks/auto-detect-bcd.json` switched from bash to `node -e` so SessionStart notice works identically on Windows, macOS, and Linux.
- **Mobile responsive auxiliary diagrams** — Sankey and Gantt scale down via overflow-x containers and `@media (max-width: 640px)` rules.
- **Captions on auxiliary diagrams** — Sankey, Gantt, and Quadrant now ship with a `.body-sm` caption beneath each, identifying what the visualization encodes.

### Changed
- **DESIGN.md §01 voice rule on em-dashes softened.** Em-dashes are now banned in generated prose only. HTML entity em-dashes (`&mdash;`) used as structural punctuation in section headers, callout labels, and list separators are explicitly allowed. Codifies the actual practice that v1.0 violated in every report.
- **`optimize/SKILL.md` Phase 3** extended from 2 diagrams to 6 (added Sankey, Gantt, Quadrant, Trajectory specs).
- **`optimize/SKILL.md` Phase 4** extended with the Source-Chain to Section Mapping subsection — documents how Sections 7 and 8 compose existing chain output without new lenses.
- **`references/report-structure.md`** updated to authoritatively describe Sections 7, 8, the new diagrams, and the visual enhancements layer.
- **`references/visual-primitives.md`** extended with the four new diagram type templates and source-chain mappings.

### Documentation
- README.md, PRD.md updated to reflect the 8-section report, the six diagram types, and the v1.1 capabilities.
- `intake/SKILL.md` clarifies that the auto-detect hook fires at SessionStart (not in real-time) so applicants know when to expect their report.

### Deferred to v1.2
- **Inline-bundled Mermaid for full offline rendering.** Attempted in v1.1 development and reverted. The official `dist/mermaid.min.js` bundle contains `</script>` strings inside regex literals that terminate the parent `<script>` tag prematurely when inlined directly into HTML. Proper escaping of those occurrences is the remaining work. The downloaded bundle file is retained at `skills/optimize/templates/mermaid-bundle.js` for the v1.2 retry. For now, reports use CDN-loaded Mermaid with the new graceful offline fallback notice.

## [1.0.0] — 2026-05-11

### Added
- Initial plugin release
- `/intake` skill — generates email-gated multipage HTML questionnaire artifact (7 pages, light/dark toggle, localStorage auto-save)
- `/optimize` skill — four-phase pipeline: market research → adaptive mental-model chain → Mermaid diagram synthesis → terminal-noir HTML report render
- 38-model mental-model catalog with relevance scoring, BCD-trigger boosts, and subtractive bias (1.5×)
- Five hard causal anchors enforcing the diagnose-design-stress-simplify arc
- Live market research via WebSearch + WebFetch (TAM, macro signals, competitive density)
- AS-IS and PROPOSED Mermaid business-model diagrams themed from DESIGN.md tokens
- Terminal-noir DESIGN.md spec with terminal-blanc light-mode inversion
- MBB-derived 6-section intelligence report structure with Operator Edge sub-section
- `auto-detect-bcd` SessionStart hook — surfaces pending BCDs in `~/forge-intake/` when Claude Code starts
- Applicant name capture on Page 1 of intake; "Prepared for [Name]" attribution in report header + appendix metadata
- Three parallel delivery paths from intake submit page: Email to Facilitator (mailto with auto-download), Download BCD, Copy to Clipboard
- Configurable `FACILITATOR_EMAIL` constant near the top of the questionnaire script (set per workshop before distribution)
- Business website URL field on Page 1 of intake (optional); when provided, `/optimize` runs a Phase 1A website scrape (homepage + About + pricing/services) before market research to supplement BCD gaps with offer structure, target market, current pricing, and founder bio
