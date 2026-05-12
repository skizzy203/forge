# Forge — Report Structure

The authoritative spec for the Forge Intelligence Report. Adapted from the McKinsey/BCG/Bain six-section market entry framework, applied to single-business optimization. Every Forge report follows this structure.

The structure moves the reader from context → evidence → conclusion in the exact order decision-makers need.

---

## Section 1 — Executive Summary

**Purpose:** The decision-maker should be able to read only this section and walk away with the gist. The rest of the report is the proof.

**Contents:**
- Brand-line hero ("THE DIAGNOSIS. / THE PLAN.") rendered per DESIGN.md §05 section opener block
- One-paragraph diagnosis (the single most important finding)
- Three implementation moves (1-line each, full versions appear in Section 6)
- Light/dark toggle, top-right

**Components used (from DESIGN.md §05):**
- Section opener block
- Pull-quote (one editorial italic line carrying the core diagnosis)
- Three move-card teasers in a horizontal row

**Length:** Single screen on desktop, no scrolling required. Aggressively short.

---

## Section 2 — Market Intelligence Brief

**Purpose:** Ground the analysis in current market reality. This is where the live WebSearch/WebFetch research surfaces in the report.

**Contents:**
- **TAM estimate** — total addressable market with cited sources (link to research)
- **Three macro signals** — recent trends, regulatory shifts, customer-behavior changes worth acting on
- **Competitive density assessment** — how crowded is this space, who are the top 3 alternatives
- **Pricing Power Audit** (added v1.4) — three-tier industry pricing distribution (low / median / premium) with cited example operators at each tier, plus an explicit placement of the operator's current pricing on the distribution
- **Customer Acquisition Cost** (added v1.4) — industry CAC range, primary channels, payback period, LTV/CAC ratio. Cited or omitted.
- **Opportunity windows** — timing-sensitive openings the market is creating right now

**Components used:**
- Component grid (3×2 or 2×2) for the macro signals
- 3-column grid for Pricing tiers; 2-column grid for CAC range vs. payback
- Callout box for the TAM headline
- Severity-tagged annotations on each signal (HIGH / WATCH / NOISE)

**Data sources:** Each cited fact links to its WebFetch source. No uncited claims allowed in this section. Pricing and CAC sub-blocks honor the same rule: cite or substitute with "Not benchmarked — pilot to measure."

---

## Section 3 — Where The Business Is Today (AS-IS)

**Purpose:** Reflect the business back sharper than the operator described it. After reading this, the operator should feel seen.

**Contents:**
- One-sentence diagnosis (the binding constraint, plain language)
- The AS-IS Mermaid diagram (per `visual-primitives.md`) with FRICTION nodes pulsing red
- The strategic insight layer (3 lines) below the diagram
- Per-component breakdown in collapsible sections: Offer, Customer, Channel, Conversion, Delivery, Revenue, Systems, Friction points
- Pull-quote in editorial italic carrying the one-sentence diagnosis
- The single most expensive assumption being treated as a hard constraint (callout box)

**Components used:**
- AS-IS diagram (Mermaid)
- Strategic insight layer
- Collapsible sections (DESIGN.md §05)
- Pull-quote
- Callout box (assumption)

**Voice:** No verbatim BCD echo. Operator's own words become the raw material; the section rewrites them in distilled language.

---

## Section 4 — The Optimization Analysis

**Purpose:** Show the lenses applied and what each surfaced. This is the meat — the evidence section.

**Contents:** Sub-sections, each generated from the relevant mental-model chain output:

### 4.1 — Diagnose Findings
- Root cause (from First Principles + 5 Whys if both ran)
- Binding constraint (from Theory of Constraints)
- Top elimination candidates (from Pareto 80/20 + Via Negativa pass 1)
- Stripped assumptions (from First Principles)

### 4.2 — Operator Edge
- Operator's cross-domain expertise mapped against market whitespace
- 2–3 niche positions only this operator could credibly occupy
- Scored by defensibility and market size
- The flagged highest-potential intersection (carries into Section 5)

### 4.3 — Design Candidates
- Redesigned offer description (from Value Equation)
- Highest-leverage intervention point (from Leverage Points)
- Pricing recalibration (from Pricing Strategy if applicable)
- Asymmetric bets identified (from Asymmetric Risk if applicable)

### 4.4 — Stress-Test Results
- Top 3 failure modes ranked by likelihood × impact (from Pre-Mortem)
- Failure conditions the plan inadvertently contains (from Inversion 2nd pass)
- Second-order risks (from Second-Order Thinking if applicable)

**Components used:**
- Comparison tables (trade-offs between design candidates)
- Severity-tagged annotations on failure modes (HIGH / MEDIUM / LOW)
- Collapsible details under each finding (evidence chain)
- Two-column contrast blocks where appropriate (e.g., 5 Whys symptom vs. root cause)

---

## Section 5 — The Proposed Model

**Purpose:** Show the redesigned business cleanly. This is what the operator walks away wanting to build.

**Contents:**
- Two-column contrast block: AS-IS vs. PROPOSED (per DESIGN.md §05) — headline summary in each column
- The PROPOSED Mermaid diagram (per `visual-primitives.md`) with added nodes in cyan-green
- The strategic insight layer below the diagram
- **What got removed** — Via Negativa output in plain language, list of stripped elements with one-sentence rationale each
- **What got sharpened** — the irreducible truths the new model is built on (from First Principles 2nd pass)
- **How the new model resists failure** — for each failure mode from Section 4.4, the design response

**Components used:**
- Two-column contrast block (signature element)
- PROPOSED diagram (Mermaid flowchart, animated morph from AS-IS if ≤12 nodes)
- Revenue Diff Sankey (Mermaid `sankey-beta`, AS-IS streams flowing into PROPOSED streams via a center "AS-IS total" node, with an "Eliminated" outflow for Via Negativa removals)
- Strategic insight layer
- Habit / step block for removed items
- Callout box for the sharpened truths

---

## Section 6 — The Implementation Plan

**Purpose:** Three moves, in order. This is what the operator does on Monday.

**Contents:** Three move cards, each one paragraph of operator language. No methodology. No model names. Just: do this, by when, here's why it matters.

### Move 1 — This week
- Highest-leverage subtractive or repositioning move
- Usually a removal, a pricing change, or a positioning sharpening
- Top border in cyan accent (DESIGN.md §05 move card)

### Move 2 — This month
- Structural change — the leverage point intervention
- Top border in green

### Move 3 — This quarter
- The compounding move — change whose effect grows over time
- Top border in purple

**Components used:**
- Three move cards in a column (mobile) or 3-col grid (desktop)
- Each card: timing label (mono-sm in accent color), display-md headline, body-md paragraph
- Implementation Gantt (Mermaid `gantt`, three sections matching the three moves, sub-tasks anchored to run timestamp)
- Optional fourth row: "What to watch" — the signal that tells the operator the moves are working

---

## Section 7 — Amplified Moves

**Purpose:** Show what compounds. The base plan in Section 6 has a ceiling. This section surfaces up to three additions that lift that ceiling by making existing elements more valuable, not by adding more elements.

**Contents:**
- Goal-framing callout (a "read before acting" caveat tying the additions back to what the operator actually wants — often surfaced from JTBD output)
- **7.0 — Automation Surface** (added v1.3) — industry-standard AI, automation, and agentic-AI use cases the operator could plug in immediately. Composed from Phase 1C research (not chain output). Renders only when Phase 1C surfaced at least one viable card.
- Up to three ranked compounding additions, each rendered as a two-cell pair: "The move" + "Revenue projection"
- A combined three-year revenue projection grid (Year 1, Year 2, Year 3) with conservative-and-optimistic ranges
- A death-zone warning callout (conditional render — only when Year 3 ceiling crosses an industry-known margin-compression band identified in Phase 1B research)
- A one-paragraph sequencing reminder

### 7.0b — First-Hire Roadmap (sub-block, added v1.4)

**Purpose:** Pair the industry's standard hiring sequence with a behavioral-fit assessment recommendation. Most first hires fail on behavioral mismatch rather than skill mismatch — the roadmap shows operators when and who to hire; the Predictive Index card shows them how to screen.

**Contents:**
- One-paragraph intro framing the first-hire decision against the operator's revenue range
- "When" + "Who" cell pair: the cited revenue threshold at which most operators in this industry make their first hire, and the role most commonly hired first
- "Delegate first" bulleted list — 3 to 5 specific responsibilities the operator typically hands off, in operator language
- Predictive Index highlight card — hot-linked logo, headline ("Behavioral fit before skill fit."), body copy recommending the operator take the PI Behavioral Assessment themselves before creating any role and screen every candidate against the role's behavioral profile, and a CTA link to https://www.predictiveindex.com/assessments/behavioral-assessment/

**Components used:**
- `.grid.cols-2` (When / Who pair)
- `.callout` with flex layout for the PI highlight card (logo left, body right)
- External `<img>` for the PI logo, hot-linked with `alt="Predictive Index"` and `max-width:180px`

**Data sources:** Phase 1D surfaces the When/Who/Delegate data with cited industry sources. The PI card is fixed copy and renders regardless of Phase 1D's success.

**Failure handling:** If Phase 1D surfaces no cited data, the When/Who cells are replaced with a single body paragraph noting the absence of industry benchmarks for that sector. The PI card still renders — its recommendation is industry-agnostic.

### 7.0 — Automation Surface (sub-block)

**Purpose:** Surface the lowest-effort, highest-leverage automation layer the operator's industry has already adopted. Most solo operators are unaware of the standard AI/automation toolbox in their sector. The cards sit before the bespoke compounding moves (7.1–7.3) so the operator sees the off-the-shelf wins first, then the chain-derived additions.

**Contents:**
- One-paragraph intro framing the automations as plug-ins to the base plan from Section 6 (no methodology talk)
- Total-hours-recoverable callout (sums cited cards only; uses `data-countup` animation on the range)
- Three-column grid of automation cards (3 to 6 cards). Each card carries: category chip (Standard / Emerging / Experimental), name, what-it-replaces, common stack, weekly hours saved (cited range or "Not benchmarked — pilot to measure")
- Inline source citations beneath the grid (full URL list, one link per cited card)

**Components used:**
- `.callout` (total hours headline with `data-countup`)
- `.grid.cols-3` (card grid; reuses existing `.cell`, `.cell-glyph`, `.cell-head`, `.cell-body`)
- `.tag.success` (STANDARD), `.tag.med` (EMERGING), `.tag.low` (EXPERIMENTAL) for the category chips
- `.body-sm` for the sources note

**Data sources:** Each card with a numeric hours figure links to its WebFetch source. No uncited claims sum into the total-hours callout — uncited cards render with "Not benchmarked — pilot to measure" instead of a number. Mirrors Section 2's citation discipline.

**Failure handling:** If Phase 1C surfaced nothing, the entire 7.0 block is omitted (the `{{automation_surface_block}}` token substitutes to empty string). If fewer than three cards survived, render what surfaced plus an Appendix flag noting the count.

**Components used:**
- `.callout` (goal-framing, death-zone)
- `.grid.cols-2` (per-addition move + projection cells)
- `.grid.cols-3` (three-year revenue projection cards)
- Revenue Trajectory Chart (Mermaid `xychart-beta`, three-line comparison of no-changes vs. base-plan vs. amplified scenarios; sits between the projection grid and the death-zone callout)

**Source-chain mapping:** Sub-section 7.0 is composed from Phase 1C automation research (not from the chain). Sub-section 7.0b is composed from Phase 1D first-hire research plus a fixed Predictive Index recommendation card. Sub-sections 7.1–7.3 are composed from Phase 2 chain outputs: Operator Edge, Leverage Points, Moats, Asymmetric Risk, and Feedback Loops contribute candidates; Value Equation and Pricing Strategy contribute the math; Phase 1B market research contributes the death-zone band data. See `forge/skills/optimize/SKILL.md` Phase 4 for the full mapping and the accretion filter applied during synthesis.

**Voice:** Each addition references specific elements from Sections 3–6 of the same report. No generic content. No mention of any other plugin or methodology.

---

## Section 8 — Pressure Test

**Purpose:** Attack the base plan plus the amplified additions from three angles before commit. Show the gap between the strongest defense and the weakest load-bearing point. Surface what survives.

**Contents:**
- Steelman cell — the strongest case for the plan (drawn from Design-class chain output)
- Strawman cell — the weakest load-bearing point (drawn from Stress-Test-class chain output)
- Pre-Mortem grid — three ranked failure modes with severity tags (HI / MED / LOW) and one-line rationales
- Second-Order consequence chain — what success triggers, and which trigger creates a worse problem than the one being solved
- "What Survives" summary callout with three sub-blocks: held across attacks, crumbled but fixable (with modification), crumbled fatal-as-designed (with what needs rethinking)

**Components used:**
- `.grid.cols-2` (Steelman + Strawman side by side)
- `.grid.cols-3` (Pre-Mortem failure modes with severity tags)
- Pre-Mortem Quadrant (Mermaid `quadrantChart`, failure modes plotted on Likelihood × Impact axes — at-a-glance prioritization beside the textual ranking)
- `.body-md` paragraph (Second-Order chain)
- `.callout` (What Survives summary)
- `.tag.hi`, `.tag.med`, `.tag.low` (severity markers)

**Source-chain mapping:** Pre-Mortem Analysis, Inversion (2nd pass), Second-Order Thinking, Value Equation, Operator Edge, JTBD, Via Negativa, and First Principles all already run in Phase 2. Section 8 surfaces their outputs in the dialectical structure. See `forge/skills/optimize/SKILL.md` Phase 4 for the full mapping.

**Voice:** Steelman and Strawman must be run separately, never collapsed. Specific to the plan being attacked, not generic. Every failure mode names specific elements from earlier sections.

---

## Appendix — Methodology & Lenses Applied

**Purpose:** Transparency. The reader can see what shaped the analysis without it dominating the deliverable.

**Default state:** Collapsed. Reader can expand if curious.

**Contents:**
- List of mental models applied (name + one-line definition each — no scores, no math)
- Market research sources cited in Section 2 (full URL list)
- Run metadata: when generated, BCD file referenced, plugin version

**Components used:**
- Collapsible section (closed by default)
- Mono-formatted list (terminal aesthetic)

---

## Cross-section rules

### Voice rules (applies throughout)
Per DESIGN.md §01 voice anti-patterns. No em-dashes. No tricolons. No anaphora. No "Let's dive in." No throat-clearing. No fake transitions. No "It's not X, it's Y" reframes. Specific over abstract. Real numbers, real nouns, real moments.

### Visual rules
- All sections render in terminal-noir by default
- Light/dark toggle in top-right of every page, persists to localStorage
- All Mermaid diagrams use the theme-reactive init block from `visual-primitives.md`
- Corner tickmarks on Sections 1 and 5 (the section openers); optional elsewhere
- Background numeral on each section page (`01`, `02`, ...) per DESIGN.md §04

### Component reuse
The report is composed primarily of components defined in DESIGN.md §05. Inventing new components for one-off use violates the brand system. If a need arises that components don't cover, propose it via the §12 governance process.

### Length
Total report runs 8–12 screens at desktop. Aggressively short per section. Density over length.

### Visual enhancements (added v1.1)

Four restrained techniques layered onto the existing terminal-noir template. Each serves the deliverable; none adds ornament. Future changes should not remove these or duplicate them with alternates.

- **Reading progress bar.** A thin 2px accent-colored bar fixed to the top of the viewport that fills left-to-right as the user scrolls through the document. Adds orientation on a long deliverable. Implemented as one `.reading-progress` element with its width tied to `scrollY / scrollHeight` via a single scroll listener.
- **Scroll-triggered section fade-in.** Each `.section` block starts at opacity 0 and translates up 12px, then fades to opacity 1 and resets translation when it enters the viewport. Uses IntersectionObserver, runs once per section. Reinforces section-as-unit hierarchy.
- **Animated number count-up.** Numeric headlines marked with `data-countup="<target>"` tick from 0 to target over ~800ms when entering the viewport. Applied to TAM headlines, revenue projection ranges, review counts, ceiling figures. Adds gravitas to the numbers without theatrics.
- **Hover-expand mental-model glossary in Appendix.** The Appendix lens list reveals its definitions on hover (desktop) or tap (touch). Cleaner default state, same depth on demand.

Declined deliberately: margin annotations on Mermaid diagrams (SVG overlay positioning is fragile; the existing `.insight` block already serves this purpose), sticky section indicators (duplicates the existing `.bg-num` floating numeral), tabbed conservative/optimistic toggle in Section 7 (breaks static-deliverable assumption; both projections live side-by-side instead).
