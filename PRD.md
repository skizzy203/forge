# Forge — Product Requirements Document

**Version:** 1.5
**Author:** Scott Wise
**Status:** Shipped (v1.5 adds a scroll-driven cinematic Three.js layer bookending the report — depth-and-parallax behind the Section 1 hero, convergence scene before the Tally CTA; v1.4 adds three new research-driven sub-blocks; v1.3 added the Automation Surface; v1.2 consolidates the workflow to a single `/forge:optimize` command with three routing modes; v1.1 added Sections 7 and 8, six diagram types, effectiveness layer, and the graceful offline Mermaid fallback; v1.0 was the initial release. See CHANGELOG.md for the full history.)

---

## 1. Overview

Forge is a Claude Code plugin that takes a business owner through a structured questionnaire, runs an adaptive chain of mental-model lenses against the collected context with live market research, and produces a brand-consistent 8-section HTML intelligence report covering current state, optimization analysis, proposed redesign, three-move implementation plan, amplified moves with three-year revenue projections, and a pressure test of the resulting strategy.

The plugin exposes a single operator-facing command — `/forge:optimize` — that routes by intent. Mode A runs the full pipeline when a Business Context Document (BCD) is detected. Mode B points new operators to the hosted intake form at `https://skizzy203.github.io/forge/`. Mode C emits a customized questionnaire HTML file when a facilitator needs per-workshop branding or offline distribution.

The primary delivery context is live workshops with business owners. Every component — intake, analysis logic, report structure, visual system — is calibrated for that context: fast, brand-consistent, decision-grade output.

---

## 2. Goals & Non-goals

### Goals
- Produce a deliverable that meets gold-standard market intelligence reporting quality on a single-business scope (TAM, competitive landscape, diagnostic, redesign, implementation plan)
- Adapt the analysis to different business types via scored model selection
- Maintain brand consistency across every surface (Distill terminal-noir, light/dark toggle, voice rules)
- Automate end-to-end after the operator submits the questionnaire
- Empirically prune the model catalog over time based on real usage data

### Non-goals
- Dashboards, multi-tenant SaaS, real-time collaboration
- Inventing new mental models (the catalog is the substrate)
- A general-purpose strategy assistant (this is workshop-grade business model optimization, not consulting-at-large)

---

## 3. User & Use Case

**Primary user:** workshop facilitator running Forge against BCDs that applicants have submitted. The facilitator's interaction is a single command — `/forge:optimize` — which routes by intent depending on what's in scope (BCD present, no BCD, or facilitator customization).

**Secondary user:** solo operator who already has a BCD. Same single command, same routing logic. Mode A fires automatically when the BCD is pasted or attached.

**Workshop applicant:** the business owner filling the hosted questionnaire at `https://skizzy203.github.io/forge/`. They are the deliverable recipient — the HTML report is for them.

---

## 4. End-to-End Flow

1. Facilitator points applicants to the hosted intake form at `https://skizzy203.github.io/forge/`. (Or, if customization is needed — per-workshop email, branding, offline distribution — facilitator asks `/forge:optimize` for a custom form via Mode C and emits a tailored HTML file.)
2. Applicant fills the form. Pages auto-save to localStorage. Conditional pages reveal based on prior answers (retention questions surface if churn is mentioned; alignment questions surface if team friction is mentioned).
3. Applicant submits. The form generates a BCD as Markdown in-browser and offers three delivery paths: email to facilitator (mailto with file attached), download locally, or copy to clipboard.
4. BCD lands in the facilitator's Claude Code session — pasted into chat, dropped into `~/forge-intake/` for the SessionStart hook to surface, or attached as a file.
5. `/forge:optimize` Mode A auto-fires when the BCD is detected in conversation context.
6. The pipeline runs four phases: web supplement + market research → adaptive mental-model chain → Mermaid diagram synthesis (six diagrams) → 8-section HTML report render.
7. The report HTML lands in the working directory. Facilitator delivers it to the applicant.

---

## 5. The Optimization Logic

### Catalog
38 mental models in `references/catalog.md`, spanning Orient → Diagnose → Opportunity → Design → Decision → Stress-Test → Simplify. Each entry includes name, class, prompt kernel, key question, base relevance score (1–3), subtractive flag, causal dependencies, and BCD-trigger boosts.

The catalog is kept full to provide edge-case coverage. Pruning happens empirically: models that don't fire across 5+ real workshops become candidates for removal.

### Scoring formula

```
score = base_relevance × subtractive_weight × bcd_multiplier × market_multiplier
```

- **base_relevance** (1–3) — how universally applicable to business optimization
- **subtractive_weight** — 1.5 if model's primary mechanism is removing elements (Via Negativa, Pareto, ToC, First Principles, Occam's Razor, Eisenhower, Comparative Advantage, Musk's 5-Step); 1.0 otherwise
- **bcd_multiplier** — 1.0 baseline; boosted by 1.5× per BCD trigger detected (capped at 2.0× total)
- **market_multiplier** — adjustments applied during Phase 1 based on web-sourced market signals (e.g., commoditization signal boosts Via Negativa)

The subtractive weight encodes the Musk principle ("best part is no part") structurally — removal-class models lead chains by default, only ceding the slot when an additive model has a strong BCD trigger justifying it.

### Chain construction
Adaptive, iterative. For each iteration:
1. Compute scores for all causally-available candidates
2. Pick the highest-scoring model
3. Run its prompt kernel against accumulated context
4. Capture output, append to running state
5. Re-score remaining candidates
6. Continue until convergence

Convergence: 2 consecutive picks score below relevance threshold (4.0). Hard cap at 25 models in the insertion zone (safety bound; should never trigger).

### Hard causal anchors (5)
Enforced as disqualification rules during scoring:
1. **JTBD opens.** First model in every chain.
2. **First Principles before Design.** Cannot design from fundamentals not yet uncovered.
3. **Diagnose-class before Opportunity-class.** Find the constraint before the path around it.
4. **Design output before Stress-Test.** Cannot attack a plan that doesn't exist.
5. **Via Negativa → Musk's 5-Step close.** Strip recursively, then validate. Always last.

Soft conventions (not hard rules — natural score ordering produces them):
- Pareto before Theory of Constraints
- Ikigai before Operator Edge
- Feedback Loops before Leverage Points
- Value Equation before Pricing Strategy

### No mid-flight operator review
The questionnaire is the only review gate. After CONFIRM is implicit at form submission, the pipeline runs autonomously. This is the deliberate design — workshop applicants are not chain operators; they're report recipients.

---

## 6. Component Specs

### 6.1 — Manifest (`.claude-plugin/plugin.json`)

Minimal, valid against the [Claude Code plugin manifest schema](https://json.schemastore.org/claude-code-plugin-manifest.json). No `commands`/`skills`/`references` arrays — those are auto-discovered from their directories.

### 6.2 — Intake skill (internal, invoked by `/forge:optimize` Mode C)

Generates a self-contained HTML questionnaire artifact (`skills/intake/templates/questionnaire.html`). Not a default operator surface — invoked internally by `/forge:optimize` when facilitator customization intent is detected. The default operator path is the hosted form at `https://skizzy203.github.io/forge/`; this skill exists for per-workshop customization, offline distribution, and self-hosted variants.

Seven pages:

1. Welcome + email gate (email is used once, for report delivery — no marketing)
2. Business basics (Q1–Q4: what it does, revenue model, customer, biggest problem)
3. The numbers (Q10a-c: revenue, gross margin %, customer count; Q11a-b: execution capacity in hours and capital)
4. Problem & history (Q5: winning condition; Q6: constraints; Q7: what's been tried; Q8: current edge)
5. Position & constraints (Q15–Q16 always; Q17 conditional on operational complexity; Q21–Q22 conditional on retention concern; Q23–Q24 conditional on alignment friction)
6. Operator Edge (Q25–Q30: background, insider knowledge, cross-domain depth, cross-domain import opportunity, unique credibility, contrarian belief)
7. Hypothesis + submit (Q9: margin/share lever hypothesis)

Per-page progress indicator. Auto-save to localStorage. Light/dark toggle top-right (persists to localStorage). On submit: BCD generated in-browser, downloadable as `[business-slug]-[YYYY-MM-DD].bcd.md`.

Conditional reveal logic: Page 5 reveals additional question groups by inspecting Q4 (biggest problem) and Q7 (what's been tried) for keyword triggers (operational complexity, retention, alignment).

### 6.3 — Optimize skill

Four phases, autonomous:

**Phase 1A — Web supplement.** If a business website URL is present in the BCD, fetches homepage, About, and pricing/services pages to fill BCD gaps before market research runs.

**Phase 1B — Market research.** Derives queries from BCD plus the Web Supplement. Runs 3–6 WebSearch queries (industry, customer segment, competitive landscape, regulatory/macro, adjacent disruption, and industry death-zone band). WebFetches top 2–3 sources per query. Synthesizes the Market Intelligence Brief (Section 2 of report) and captures the death-zone band (if surfaced) for Phase 4. Applies market multipliers to model scores.

**Phase 1C — Automation surface research.** Runs 3–5 WebSearch queries against the operator's industry term and stated bottleneck to surface common AI, automation, and agentic-AI use cases. WebFetches top results for weekly-hours-saved benchmarks. Synthesizes the `AUTOMATION_SURFACE` context (3–6 cards each with name, category tier, what-it-replaces, common stack, cited hours-saved range). Cards without a cited time benchmark render with "Not benchmarked — pilot to measure" instead of a number. Feeds Section 7.0 of the report.

**Phase 1D — First-hire research (added v1.4).** Runs 3–4 WebSearch queries against the operator's industry to surface revenue-threshold benchmarks for first hire, the role most commonly hired first, and the responsibilities most often delegated. Synthesizes `FIRST_HIRE` context. Feeds Section 7.0b. Pairs with a fixed Predictive Index behavioral-assessment recommendation card that renders even when industry hiring benchmarks are absent.

**Phase 2 — Adaptive chain execution.** Walks the catalog using the scoring formula. Enforces the 5 causal anchors. Runs each selected model's prompt kernel against accumulated context. Maintains causal continuity (each output explicitly informs the next). Closes with Via Negativa (recursive until convergence) → Musk's 5-Step (validation pass). The chain output produced here feeds Sections 3–8 of the report.

**Phase 3 — Mermaid diagram synthesis.** Generates six diagrams: AS-IS flowchart (Section 3), PROPOSED flowchart (Section 5), Revenue Diff Sankey (Section 5), Implementation Gantt (Section 6), Pre-Mortem Quadrant (Section 8), and Revenue Trajectory Chart (Section 7). All diagrams use the theme-reactive Mermaid init block. The trajectory chart uses an inline `%%{init}%%` directive to scope its three-color palette without overriding the global theme.

**Phase 4 — Report render.** Loads `skills/optimize/templates/report.html`. Injects chain outputs into placeholder tokens for Sections 1–8. Conditionally renders the Section 7 death-zone callout only when the Year 3 amplified projection crosses the industry-specific band surfaced in Phase 1B. Emits a dynamic Appendix lens list covering only the models that actually fired. Mermaid loads from CDN at view time with a graceful offline fallback notice if unreachable (inline bundling attempted in v1.1 development and deferred to v1.2 — see CHANGELOG). Voice compliance against DESIGN.md §01 rules. Writes `forge-report-[business-slug]-[YYYY-MM-DD].html` to working directory.

### 6.4 — Hook (`hooks/auto-detect-bcd.json`)

SessionStart hook that scans `~/forge-intake/` for pending `*.bcd.md` files and surfaces a notice on session open ("[Forge] N pending BCD(s) in ~/forge-intake/..."). Claude Code does not currently support filesystem-watch events, so SessionStart is the closest supported pattern. Implemented as a cross-platform `node -e` one-liner. Optional — the plugin works without it; `/forge:optimize` Mode A also auto-fires on BCDs pasted directly into chat.

### 6.5 — References

- **`DESIGN.md`** — terminal-noir / terminal-blanc brand spec. Authoritative for all visual surfaces.
- **`catalog.md`** — 38 mental models with prompt kernels, scoring data, causal dependencies.
- **`visual-primitives.md`** — Mermaid templates for AS-IS / PROPOSED business model diagrams, theme derivation, animation rules.
- **`report-structure.md`** — authoritative spec for the 8-section intelligence report (extends the McKinsey/BCG/Bain six-section market-entry framework with Amplified Moves and Pressure Test as Sections 7 and 8). Documents per-section components, source-chain mappings, and the v1.1 visual enhancements layer.

---

## 7. Output Format

The report extends the McKinsey/BCG/Bain six-section market entry framework with two additional sections (Amplified Moves, Pressure Test) that surface what the chain already produces but earlier versions did not render:

1. **Executive Summary** — single-screen snapshot. Brand-line hero, one-paragraph diagnosis, three move teasers linked to Section 6.
2. **Market Intelligence Brief** — TAM with sources, three macro signals (severity-tagged), competitive density, **Pricing Power Audit** (3-tier industry distribution with "where you sit" placement), **Customer Acquisition Cost** (industry CAC range, payback period, LTV/CAC ratio), opportunity windows.
3. **Where The Business Is Today** — diagnostic snapshot rewritten sharper than the operator's intake. AS-IS Mermaid flowchart with pulsing FRICTION nodes. Insight layer. Collapsible component breakdown. Pull-quote diagnosis.
4. **Optimization Analysis** — the lenses applied and what each surfaced. Sub-sections: Diagnose Findings, Operator Edge, Design Candidates, Stress-Test Results. Comparison cards, severity tags, collapsible evidence chains.
5. **The Proposed Model** — two-column contrast (AS-IS / PROPOSED). PROPOSED Mermaid flowchart. Revenue Diff Sankey showing where money rewires. Insight layer. What got removed.
6. **The Implementation Plan** — three moves (this week / this month / this quarter). Each move = one paragraph, operator language only. Implementation Gantt below the move cards showing dependency timing.
7. **Amplified Moves** — opens with the **Automation Surface (7.0)**: industry-standard AI/automation/agentic-AI use cases surfaced by Phase 1C research, rendered as a grid of cards with cited weekly-hours-saved estimates and a total-hours-recoverable callout. Followed by the **First-Hire Roadmap (7.0b, added v1.4)**: cited revenue-threshold benchmarks for when most operators in this sector make their first hire, which role they hire, and what they delegate first — paired with a fixed Predictive Index behavioral-assessment recommendation card. Below those, up to three bespoke compounding additions (7.1–7.3) composed from existing chain output (Operator Edge, Leverage Points, Moats, Asymmetric Risk, Feedback Loops) via the accretion filter. Three-year revenue projection cards plus the trajectory chart (no-changes vs. base-plan vs. base-plus-amplifications). Industry-aware death-zone callout when Year 3 crosses a surfaced band.
8. **Pressure Test** — Steelman and Strawman attacks, ranked Pre-Mortem failure modes with severity tags, Pre-Mortem Quadrant chart, second-order consequence chain, What-Survives summary (held / fixable / fatal-as-designed).

**Appendix** (collapsed by default) — Lenses Applied (dynamic, only models that fired; hover-expand definitions), market research sources cited, run metadata.

Throughout: terminal-noir by default, light/dark toggle top-right, voice compliance against DESIGN.md §01, HTML effectiveness layer (reading progress bar, scroll-triggered section fade-in, animated number count-up, hover-expand Appendix glossary), print stylesheet, anchor-linkable section IDs.

---

## 8. Design System Compliance

All visual surfaces conform to `references/DESIGN.md`. Specifically:
- Color tokens from §02 (terminal-noir default, terminal-blanc light)
- Type stack from §03 (Inter Tight / Inter / Source Serif 4 Italic / JetBrains Mono)
- Layout structure from §04 (corner tickmarks, background numerals, hairline rules, 8px baseline)
- Components from §05 (section opener, pull-quote, callout, two-column contrast, component grid, move cards, etc.)
- Voice rules from §01 (no em-dashes, no tricolons, no anaphora, no fake transitions)
- Mermaid theme from §11 (theme-reactive init block)

If a design need arises that DESIGN.md doesn't cover, follow the §12 governance process (build once, propose on second occurrence, codify on third) rather than introducing one-off deviations.

---

## 9. Open Questions / First-Run Calibration

1. **Relevance score threshold (4.0).** Starting value. Tune based on first 5 workshop runs — if chains converge too early (under 6 models), lower threshold to 3.5; if they don't converge at all (chains hit hard cap), raise to 4.5.

2. **Market research query templates.** Generic templates ship in `skills/optimize/SKILL.md`. Once Phase 1 has been observed across distinct industries, sharpen query templates per industry vertical.

3. **Hook reliability across operating systems.** The `auto-detect-bcd.json` hook uses cross-platform `node -e` so the SessionStart notice works identically on Windows, macOS, and Linux. Fallback is always `/forge:optimize` invoked manually after pasting the BCD into chat — document clearly for users on platforms where the hook doesn't fire.

4. **BCD trigger detection sensitivity.** The intake form uses keyword-matching to surface conditional Page 5 questions. If too many or too few conditional questions appear in practice, adjust the regex patterns in the form's `detectTriggers()` function.

5. **Mermaid animation performance.** The AS-IS → PROPOSED morph animation may stutter on older browsers when node count approaches the 12-node threshold. If observed, fall back to side-by-side static at 8 nodes.

---

## 10. Build Sequence & Verification

### Files in build order
1. `.claude-plugin/plugin.json` — manifest, validation foundation
2. `references/DESIGN.md` — brand spec, loaded by all surface generators
3. `references/catalog.md` — 38 models with kernels and scoring
4. `references/visual-primitives.md` — Mermaid templates (six diagram types)
5. `references/report-structure.md` — 8-section report spec
6. `skills/intake/SKILL.md` + `templates/questionnaire.html` — internal customization helper (invoked by /forge:optimize Mode C)
7. `skills/optimize/SKILL.md` + `templates/report.html` — single entry point, three routing modes
8. `hooks/auto-detect-bcd.json` — SessionStart pending-BCD notice
9. `index.html` — root redirect to the hosted questionnaire (for GitHub Pages)
10. `examples/sample-report.html` — rendered sample output for the README
11. `PRD.md`, `README.md`, `LICENSE`, `CHANGELOG.md`, `.gitignore` — plugin metadata

### Verification

**1. Plugin install validation.** Run `/plugin install https://github.com/skizzy203/forge`. Confirm zero validation errors and that the manifest version matches the current release in `.claude-plugin/plugin.json` (kept in lockstep with the latest tagged release on GitHub).

**2. Mode B (no BCD) test.** Open a fresh Claude Code session. Type `/forge:optimize` with no BCD in scope. Verify the model responds with the hosted-URL pointer (`https://skizzy203.github.io/forge/`) and explains the three submission paths. The pipeline must not run; no business context must be invented.

**3. Mode A (BCD pipeline) test.** Construct three BCDs of distinct problem profiles (pricing-led SaaS, positioning-stuck consultancy, scaling marketplace with retention concerns). For each: paste the BCD into chat. Verify:
- `/forge:optimize` auto-fires without explicit invocation
- Phase 1A fires (if `Business website:` in the BCD) and produces the Web Supplement
- Phase 1B WebSearch queries surface real signals with citations
- Each BCD produces a different chain (subtractive bias visible: Pareto / Via Negativa appear early)
- Operator Edge section appears with proper Layer 3 data
- Report HTML renders with all six Mermaid diagrams (AS-IS flowchart, PROPOSED flowchart, Revenue Diff Sankey, Implementation Gantt, Pre-Mortem Quadrant, Revenue Trajectory)
- Light/dark toggle re-renders Mermaid correctly (snapshot-before-init pattern holds)
- All eight sections populated; no placeholder tokens visible
- Implementation Plan has three concrete moves; Amplified Moves carries up to three accretive additions; Pressure Test surfaces Steelman, Strawman, ranked failures, and second-order chain

**4. Mode C (facilitator customization) test.** Type `/forge:optimize` and say "I need a custom intake form for my workshop, my facilitator email is `me@example.com`." Verify:
- The model invokes the internal intake skill
- A customized HTML file is written to the working directory with `FACILITATOR_EMAIL` set to the requested address
- The form is otherwise identical to the hosted version

**5. Auto-trigger hook test.** Drop a BCD into `~/forge-intake/`. Open a new Claude Code session. Verify the SessionStart hook surfaces the "[Forge] N pending BCD(s)" notice with the latest filename. Then ask Forge to process it — verify the pipeline runs.

**5. Design compliance audit.** Spot-check both artifacts against DESIGN.md §01 (voice — no em-dashes, no tricolons, no "Let's dive in"), §02 (colors), §03 (typography), §05 (components). Mermaid themes match active palette.

**6. Empirical data capture.** Note which models fired across the three synthetic BCDs. Models that never fire become catalog-pruning candidates after 5+ live workshop runs (per the empirical-pruning preference).
