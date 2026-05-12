---
name: optimize
description: The single entry point for Forge. Routes by intent. (A) When a Business Context Document (BCD) is detected — pasted in chat, attached as a file, or sitting in ~/forge-intake/ — runs the full optimization pipeline (web supplement → market research → industry automation surface → adaptive 38-model mental-model chain → 8-section terminal-noir HTML intelligence report). (B) When no BCD is present and the operator wants to start, points them to the hosted intake form at https://skizzy203.github.io/forge/. (C) When a facilitator needs a customized version of the form (per-workshop email, branding, offline use), invokes the internal intake skill to emit a customized HTML file.
when_to_use: >
  Use whenever the operator interacts with Forge. The skill routes by intent.
  Mode A (BCD pipeline): triggered by a BCD attached/pasted, by the auto-detect hook surfacing
  a file in ~/forge-intake/, or by phrases like "optimize this business", "run forge on this",
  "analyze this BCD", "give me the redesign", "produce the intelligence report".
  Mode B (URL pointer): triggered when an operator asks how Forge works, how to get a report,
  or wants to start but no BCD is present in the conversation or watched folder.
  Mode C (facilitator customization): triggered by phrases like "custom intake form", "my
  workshop email is X", "white-label the form", "offline copy of the questionnaire", "branded
  version for [client]", "host the form on my domain".
  This is the only slash command surfaced for Forge.
argument-hint: "[bcd-path or natural-language intent]"
disable-model-invocation: false
allowed-tools: Read Write WebSearch WebFetch
---

# Forge — Business Model Optimization

The single entry point for the Forge plugin. Routes by intent.

## Routing modes

Before doing anything else, classify the operator's situation from the conversation context, attachments, and arguments.

### Mode A — BCD present, run the pipeline

**Triggers**
- A BCD file path is passed as `$ARGUMENTS`
- A markdown document matching the BCD schema is pasted into the conversation or attached as a file
- The auto-detect hook has surfaced a pending BCD in `~/forge-intake/` and the operator is ready to process
- The operator explicitly says "run this", "optimize", "process the latest BCD", or similar

**Action**: proceed with the four-phase pipeline described below (Phases 1A → 4). This is the bulk of the skill's work. The rest of this document specifies that pipeline.

### Mode B — No BCD present, operator wants to start

**Triggers**
- No BCD attached, no BCD in `~/forge-intake/`, no BCD-shaped content in the conversation
- The operator asks how Forge works, what they need to provide, how to get a report, etc.

**Action**: respond with the hosted intake form pointer. Adapt the wording to the specific operator; do not paste the example verbatim, but cover the same content:

> Forge needs a Business Context Document (BCD) to run. Fill this out first: **https://skizzy203.github.io/forge/**
>
> Takes about ten minutes. When you submit, the form gives you three paths:
> 1. **Email** the BCD to your workshop facilitator (mailto, with the file auto-downloaded)
> 2. **Download** the BCD locally — drop it into `~/forge-intake/` (next Claude Code session will pick it up) or paste it back here
> 3. **Copy** to clipboard — paste it directly into this conversation and I'll process it immediately
>
> Once I see the BCD, the analysis runs automatically. No commands needed.

Wait for the BCD. Do not invent business context.

### Mode C — Facilitator customization

**Triggers**
- Operator says: "custom form", "customize the intake", "my workshop email is X", "white-label the form", "branded version for [client]", "I need an offline copy of the questionnaire", "host the form on my own domain", "the hosted URL is down"

**Action**: invoke the internal intake skill at `skills/intake/SKILL.md`. That skill reads the questionnaire template, substitutes the `FACILITATOR_EMAIL` constant and any other requested branding, and writes the customized HTML file to the working directory.

After the intake skill returns, tell the operator the file path and how to distribute it (host on their own server, email directly to applicants, hand over on USB, etc.).

The intake skill is **internal**. It is not documented as an operator-facing slash command. Mode C is the only path through which it runs.

---

## Mode A — The four-phase pipeline

Once Mode A is selected, the operator's only remaining interaction was filling the intake form. This skill does the rest, autonomously, across four phases.

### Inputs

- BCD path from `$ARGUMENTS` (preferred), or
- BCD content pasted directly, or
- Most recent file in `~/forge-intake/` if no argument provided

Read the BCD before doing anything else. Extract every field. Note any thin/missing fields and record them for the Appendix.

### BCD schema validation (runs first, before any phase)

Before kicking off Phase 1A, verify the BCD contains the minimum fields required to produce a coherent report. Required fields:

- **Operator name** OR **Business name** (need at least one for attribution)
- **Revenue range** (`Under $100K/year`, `$100K-$500K/year`, etc.) — needed for baseline trajectory and death-zone evaluation
- **Biggest problem / primary bottleneck** — needed to seed the chain's Diagnose class
- **What it does / Core offer** — needed for JTBD and market research

If any required field is missing or empty, abort the run and tell the user clearly which field(s) are missing and where in the intake form they correspond to. Do not produce a degraded report silently. Optional fields (operator email, business website, dream customer, etc.) can be empty — log them to the Appendix as gaps but proceed.

**Identity fields to extract first** (these populate report placeholders throughout):
- `Operator name:` → becomes `{{applicant_name}}` in the report template; used in "Prepared for [Name]" attribution in Section 1 and run metadata in Appendix
- `Operator email:` → becomes `{{operator_email}}` in run metadata
- `Business name:` (from Core Business section) → becomes `{{business_name}}` (full) and `{{business_name_short}}` (first 30 chars truncated cleanly on word boundary) throughout the report header and filename

If `Operator name` is missing from the BCD (older BCDs from prior intake versions): fall back to using the business name with "the operator at" prefix, e.g., "the operator at Acme Coffee". Log this gap to the Appendix so the intake can be flagged for that applicant.

## Phase 1A — Business Website Scrape

If the BCD includes a `Business website:` field with a URL (front matter or `## Core Business` block — either location), this phase runs **before** market research so its findings can shape both subsequent research queries and the BCD context the chain sees.

1. **Fetch the homepage.** WebFetch the URL provided. Capture: positioning headline, primary offer language, target customer language, any visible pricing, navigation labels (these reveal information architecture and category framing).

2. **Fetch the About page.** Try common paths in order — `/about`, `/about-us`, `/our-story`, `/team`, `/founder` — and stop on first success. Capture: founder/operator bio, business origin story, stated mission, years operating, any team composition.

3. **Fetch one pricing/services page if present.** Try `/pricing`, `/services`, `/products`, `/work-with-us`. Capture: actual pricing if displayed, package names, what's bundled in each tier, the structure of how offers are organized.

4. **Synthesize a Web Supplement block.** Compile into a section of accumulated context titled `WEB_SUPPLEMENT` with these fields, each filled if found and marked `[not found on site]` if not:
   - Stated offer (homepage)
   - Stated target customer (homepage / About)
   - Stated positioning (homepage hero / About mission)
   - Observed pricing structure
   - Founder/operator bio
   - Years operating
   - Notable signals (testimonials, case studies, press, partnerships)

5. **Use the supplement to fill BCD gaps.** Compare each BCD field to the Web Supplement. Where the BCD is thin and the website provides the answer, treat the website-sourced value as supplemental context (do not overwrite the operator's own answer — augment it). Log every gap that got filled this way to the Appendix as "BCD field [X] supplemented from website" so the next intake iteration can be sharpened.

6. **Failure handling.** If the URL is unreachable, returns non-HTML, requires JS to render the content, or is blocked: log the failure to the Appendix and continue without the supplement. Do not stop the pipeline. The BCD alone is sufficient — the scrape is enhancement, not requirement.

7. **No scraping if no URL.** If `Business website:` is absent from the BCD, skip this phase entirely and proceed to Phase 1B. Note "No website provided" in the Appendix.

## Phase 1B — Market Research

Derive web-research queries from the BCD **plus the Web Supplement from Phase 1A** (if it ran). The supplement often reveals the actual industry vocabulary, competitor names, or pricing tier that should be researched.

1. **Industry/sector** (from Q1: what the business does, refined by Web Supplement positioning) → query for industry TAM, growth trajectory, 2026 outlook
2. **Customer segment** (from Q3, refined by Web Supplement target customer language) → query for customer behavior shifts, recent signals
3. **Competitive landscape** (from Q15 if present, else inferred from Web Supplement positioning) → query for top alternatives and their positioning
4. **Regulatory/macro** (industry-dependent) → query for relevant 2026 regulatory shifts or macro tailwinds/headwinds
5. **Adjacent disruption** (inferred from operator Cross-Domain Q27) → query for what's working in adjacent fields that could import
6. **Industry death-zone band** (added v1.1) → query for known revenue ranges where this industry experiences margin compression (e.g., pressure washing $500K–$1.2M, SaaS $1M–$3M, professional services $2M–$5M). If a band is surfaced, capture as `DEATH_ZONE_BAND = [low, high]` in accumulated context. If no band is surfaced for this industry, set `DEATH_ZONE_BAND = null`. Phase 4 uses this to decide whether to render the Section 7 death-zone callout — the callout fires only when the Year 3 amplified projection actually crosses the band.

Run 3–5 WebSearch queries. For each, WebFetch the top 2–3 sources to extract concrete facts (TAM numbers, citation links, signal descriptions). Synthesize into the Market Intelligence Brief that becomes Section 2 of the report.

Use the surfaced market signals to adjust CommercialLeverage scoring for affected models. Examples:
- If TAM is large and growing → boost Blue Ocean Strategy, Operator Edge
- If heavy commoditization signal → boost Via Negativa, Pareto, Pricing Strategy
- If regulatory tailwind detected → boost Asymmetric Risk, MVE
- If competitive saturation signal → boost Moats, Switching Costs

## Phase 1C — Automation Surface Research

Industry-standard AI, automation, and agentic-AI use cases that the operator could plug in without redesigning the business. This phase runs **after** Phase 1B (market research) and **before** Phase 2 (chain) so its output is available when the chain reasons about Operator Edge and Leverage Points, and so the synthesized cards can be rendered as Section 7.0 in Phase 4.

The phase is **research-driven, not chain-derived**. It mirrors Phase 1B's epistemic posture: no card carries a numeric weekly-hours-saved figure without a real WebFetch citation backing it.

**Inputs available at this point:**
- BCD-extracted: industry, what-it-does, biggest problem / primary bottleneck, revenue range
- Phase 1A `WEB_SUPPLEMENT`: actual industry vocabulary, positioning, and competitor framing — the operator's stated category often differs from the searchable industry term; **prefer the supplement's language** when constructing queries
- Phase 1B accumulated market context (TAM signals, competitive density, commoditization signals — informs which automations are most relevant)

**Query plan (3–5 WebSearch passes, each followed by 1–2 WebFetch on top results):**

1. `"[industry term] AI automation use cases 2026"` — surfaces vendor case studies and industry-press roundups
2. `"[business type] workflow automation hours saved"` — biases toward time-quantified benchmarks
3. `"[industry] agentic AI agents adopted"` — surfaces emerging-tier tools
4. `"[primary bottleneck from BCD] automation tools"` — anchors at least one card to the operator's stated problem
5. *(Conditional)* `"[industry] [customer-facing task] AI"` — fires if Phase 1B competitive density signal suggests customer-facing operations are a sector-wide constraint

**Synthesis into `AUTOMATION_SURFACE` accumulated context.** Each entry is a struct:

```
{
  name: string,                       // "Inbound lead triage agent"
  category: "Standard" | "Emerging" | "Experimental",
  what_it_replaces: string,           // "manually reading and routing every contact-form submission"
  common_tooling: string,             // "Make.com + GPT-4 + Slack" or "Intercom Fin + HubSpot"
  hours_per_week_saved: { low: number, high: number } | null,
  source_url: string | null,          // cited WebFetch URL the hours figure came from
  confidence: "cited" | "uncited"     // uncited cards render without an hours number
}
```

**Bound the work.** Maximum 5 WebSearch + 10 WebFetch calls for this phase. Hard cap at 6 cards rendered. Rank by hours-saved-per-week descending; cards with `confidence: "cited"` are surfaced first.

**Failure handling.** If fewer than three cards survive with cited hours figures, render whatever passes plus an Appendix flag: "Automation research surfaced N cited use cases." If web search is unreachable or returns nothing useful, **skip the 7.0 block entirely** (do not render a header with no content) and log the failure to the Appendix. Mirrors the existing "do not invent market research" rule.

**No hallucinated hours.** Each numeric `hours_per_week_saved` value must trace to a real WebFetch source surfaced during this phase. If a use case is well-known industry-wide but no time benchmark surfaced, still render the card — just with `hours_display = "Not benchmarked — pilot to measure"` and `confidence = "uncited"`. Uncited cards do not contribute to the total-hours-recoverable callout sum.

## Phase 2 — Adaptive Chain Construction & Execution

Load `references/catalog.md`. For each candidate model, compute:

```
score = base_relevance × subtractive_weight × bcd_multiplier × market_multiplier
```

Pick the highest-scoring causally-available model. Run its prompt kernel against the BCD + market research + accumulated outputs. Capture the labeled output. Re-score. Continue.

Enforce the five hard causal anchors from `catalog.md`:
1. JTBD opens
2. First Principles before Design-class
3. Diagnose-class before Opportunity-class
4. Design output before Stress-Test
5. Via Negativa + Musk's 5-Step close

Stop when 2 consecutive picks score below relevance threshold (4.0). Hard cap at 25 models (should never trigger).

Run close anchors:
- Via Negativa recursively until no further removals are safe
- Musk's 5-Step validation pass on the simplified model

Each model's output explicitly informs the next. Maintain causal continuity.

## Phase 3 — Mermaid Diagram Synthesis

Load `references/visual-primitives.md`. Generate five diagrams across the report:

**AS-IS flowchart (Section 3)** — from the BCD. Map the operator's current business as OFFER → AVATAR → CHANNEL → CONVERSION → DELIVERY → REVENUE, with SYSTEM nodes for infrastructure and FRICTION nodes pulled from Pareto/ToC findings. FRICTION nodes pulse red.

**PROPOSED flowchart (Section 5)** — from the chain's accumulated output. Apply changes:
- Removed elements (from Via Negativa) get `[-]` suffix and `removed` class
- Added elements (from Operator Edge, Blue Ocean) get `[+]` suffix and `added` class
- Changed elements (from Value Equation, Leverage Points) get `[~]` suffix and `changed` class

If AS-IS has ≤ 12 nodes: render as animated morph (per visual-primitives.md). Otherwise: render side-by-side static.

**Revenue Diff Sankey (Section 5)** — generated from BCD revenue breakdown plus Pareto, Value Equation, Pricing Strategy, and Via Negativa outputs. Renders AS-IS revenue streams flowing into a center "AS-IS total" node, then flowing out to PROPOSED streams (with an "Eliminated" outflow for removed lines). Native `sankey-beta` syntax. Weights are proportional estimates summing to ~100; do not invent dollar amounts the chain did not produce.

**Implementation Gantt (Section 6)** — generated from the three move paragraphs. Break each move into 2–3 concrete sub-tasks with imperative names. Anchor dates to the run timestamp (today for Move 1 start, +week, +month, +quarter for downstream tasks). Native `gantt` syntax.

**Pre-Mortem Quadrant (Section 8.2)** — generated from Pre-Mortem Analysis chain output. Each failure mode becomes a point on Likelihood × Impact axes. Translate Likelihood and Impact tags to 0.0–1.0 coordinates (Low=0.2, Med=0.5, High=0.75–0.8) with small offsets to prevent dot overlap. Native `quadrantChart` syntax.

**Revenue Trajectory Chart (Section 7)** — generated as a three-line xychart-beta showing how revenue diverges under three scenarios. Line 1 (No changes) = BCD current revenue compounded by Phase 1B market CAGR with a soft cap at the industry's solo-operator ceiling. Line 2 (Base plan only) = current revenue interpolated to Section 6's stated ceiling over three years (Year 1 ≈ 60% of ceiling, Year 2 = ceiling, Year 3 = ceiling). Line 3 (Base + amplifications) = year-by-year midpoint of Section 7's conservative-and-optimistic projection ranges. Use the inline `%%{init}%%` directive from `visual-primitives.md` to set the three-color palette (`#8A949A, #10B981, #0FB8D6`). Y-axis ceiling scales to ~120% of the amplified Year-3 high.

All six diagrams use the same theme-reactive Mermaid init block from `visual-primitives.md` so they re-render correctly when the light/dark toggle fires. The xychart's inline directive scopes the palette without overriding the global theme.

## Phase 4 — Report Render

Load `${CLAUDE_SKILL_DIR}/templates/report.html`. The template has placeholder tokens like `{{applicant_name}}`, `{{business_name}}`, `{{section_2_market_brief}}`, `{{as_is_mermaid}}`, `{{move_1_paragraph}}`, etc.

### Mermaid loading (CDN + offline graceful fallback)

The template loads Mermaid via the CDN ESM import in the rendered report. A small detection script runs three seconds after page load: if `window.mermaid` is still undefined (CDN unreachable, browser offline, etc.), every `.mermaid` block is replaced with a graceful notice telling the reader to reconnect. Reports degrade visibly rather than silently producing blank diagram divs.

Inline-bundling Mermaid into every report (to make diagrams render fully offline without any CDN dependency) was attempted in v1.1 development and reverted: the official `dist/mermaid.min.js` distribution contains `</script>` strings inside regex literals that terminate the parent `<script>` tag prematurely when inlined directly into HTML. Properly escaping those occurrences is deferred to v1.2. The bundle file lives at `templates/mermaid-bundle.js` if a future iteration wants to retry with escaping.

### Token substitution

Substitute every remaining `{{token}}` in the template. Identity tokens get the values you extracted in the Inputs section — `{{applicant_name}}` becomes the operator's name as they entered it, used in the "Prepared for [Name]" line under the Executive Summary headline and again in the appendix Run Metadata block. Analysis tokens get the chain outputs per `references/report-structure.md` mapping.

### Automation Surface (Section 7.0) render

If `AUTOMATION_SURFACE` from Phase 1C is non-empty, render the 7.0 block at the head of Section 7 before the chain-derived 7.1/7.2/7.3 additions. Token substitutions:

| Token | Source | Notes |
|---|---|---|
| `{{automation_surface_intro}}` | Phase 1C synthesis | 1–2 sentences specific to the operator's industry. No methodology talk. No "AI is transforming…" boilerplate. |
| `{{automation_total_hours_low}}` | Sum of cited-card lows | Integer. Uses `data-countup` animation. Includes only entries where `confidence == "cited"`. |
| `{{automation_total_hours_high}}` | Sum of cited-card highs | Integer. Same scoping rule. |
| `{{automation_total_caveat}}` | Generated | "Assumes full adoption of all N cited tools above. Each figure is sourced from the cited benchmark; uncited entries are excluded from the sum." |
| `{{automation_cards_html}}` | Loop over `AUTOMATION_SURFACE` | One `.cell` per entry. Cited-cards render first, then uncited. |
| `{{automation_sources_note}}` | Inline citation list | "Sourced from: [link1] · [link2] · …" using existing `.body-sm` muted styling. Only cited cards contribute links. |

For each card in `{{automation_cards_html}}`:
- `{{category_tag}}` renders as `STANDARD`, `EMERGING`, or `EXPERIMENTAL` (mono chip; green for Standard, accent-cyan for Emerging, purple `--info` for Experimental)
- `{{hours_display}}` renders as `4–7 hrs · cited` if confidence is `cited`, or `Not benchmarked — pilot to measure` if uncited

**Conditional skip.** If `AUTOMATION_SURFACE` is empty (Phase 1C skipped or returned nothing), substitute an empty string for the entire 7.0 block (the surrounding markers in the template account for this). Do not render an empty header.

### Death-zone callout conditional render

If `DEATH_ZONE_BAND` from Phase 1B is non-null AND the Year 3 amplified projection (high end) crosses or exceeds the band's low boundary, render the full death-zone callout block into `{{amp_death_zone_callout}}`. Otherwise substitute an empty string. The callout body should reference the specific band low and high values from the surfaced research, not generic numbers.

### Dynamic Appendix lens list

Emit `{{lenses_applied_list}}` as `<li>` items for *only* the models that actually fired during Phase 2 chain execution. Do not list models that scored below threshold or were skipped. Each `<li>` carries the model's name (in `.lens-name`) and the one-line key question from `catalog.md` (in `.lens-def`). The Appendix hover-expand CSS handles the rest.

### Source-Chain to Section Mapping (Sections 7–8)

Sections 7 (Amplified Moves) and 8 (Pressure Test) are rendered from chain output already produced in Phase 2. They do not introduce new phases or new lenses. No new reference files. No new catalog entries. The chain already runs the relevant models; Phase 4 surfaces their output to the report.

**Section 7 — Amplified Moves.** Compose three ranked compounding additions from these chain outputs:

| Chain output | Contributes to Section 7 |
|---|---|
| Operator Edge | Candidates that make existing assets produce more output |
| Leverage Points | Candidates where a small change produces a large downstream effect |
| Moats / Competitive Advantage | Candidates that make the plan harder to replicate over time |
| Asymmetric Risk | Candidates with limited downside and uncapped upside |
| Feedback Loops | Candidates that compound over time (reinforcing loops) |
| Value Equation + Pricing Strategy | Inputs to revenue projection math |
| Market research (Phase 1B) | Death-zone bands, conversion benchmarks, opportunity windows |

Apply the **accretion filter** to every candidate before ranking: "If this is added, do existing elements become more valuable, or does the plan just have more elements?" Discard anything that fails. Rank survivors by magnitude of compounding × durability × buildability × cost-of-being-wrong. Surface the top three.

**Revenue projection math** for Section 7:
- **Year 1 lift** = base ceiling from chain + any Q1-shippable addition's contribution (typically only Addition 1 ships in Year 1)
- **Year 2** = Year 1 + compounding from renewals, apprentice graduates, channel maturity (additions reaching first productive output)
- **Year 3** = stabilized state with all additions live; flag against industry death-zone bands from Phase 1B research if Year 3 ceiling crosses a known margin-compression range

Express each projection as a conservative-and-optimistic range with the assumptions named in the projection cell body.

**Section 8 — Pressure Test.** Compose attacks from these chain outputs:

| Chain output | Contributes to Section 8 |
|---|---|
| Pre-Mortem Analysis | Ranked failure modes with severity tags (HI / MED / LOW) |
| Inversion (2nd pass) | Strawman — failure conditions the plan resembles |
| Second-Order Thinking | Consequence chain when success creates a worse problem |
| Value Equation + Operator Edge + JTBD | Steelman — strongest case for the plan |
| Via Negativa + First Principles | What survived stress |

**Run Steelman and Strawman separately** before synthesizing the "What Survives" summary. Do not collapse them. The Steelman draws on Design-class chain outputs (the affirmative case). The Strawman draws on Stress-Test-class chain outputs (the weakest load-bearing point). The gap between them is where the actual risk lives, and "What Survives" names what holds across both attacks.

The "What Survives" summary classifies plan elements into three buckets: held across all attacks, crumbled but fixable (state the modification), crumbled fatal-as-designed (state what needs rethinking).

**Failure handling for thin chain output.** If Section 7's accretion filter passes fewer than 3 candidates, render the section honestly with whatever survives plus an Appendix flag noting "fewer than 3 compounding additions identified." If Section 8's Pre-Mortem produced no MED-or-higher failure modes, render Section 8 with a "stable across attacks" note rather than padding with weak failures. The report ships regardless.

### Voice compliance

Every word of generated copy must pass DESIGN.md §01 voice rules. No em-dashes. No tricolons. No "Let's dive in." No throat-clearing. Specific over abstract.

Write the populated HTML to the working directory as `forge-report-[business-slug]-[YYYY-MM-DD].html`. Tell the user the file path and how to open it.

## Failure modes to avoid

- **Do not produce generic content.** Every section must reference the specific business, the specific BCD, the specific chain output. If a section starts to feel generic, stop and look at the BCD again.
- **Do not skip Via Negativa recursion.** "Round 1 feels good enough" is how complexity creeps back in.
- **Do not include model names or chain mechanics in the operator-facing sections.** Only the Appendix names the models. Sections 1–8 are operator language only.
- **Do not invent market research.** Every citation in Section 2 links to a real WebFetch source. If web access fails, mark that section as "research unavailable for this run" and proceed without it rather than fabricating.
- **Do not introduce visual deviations from DESIGN.md.** If the brand system doesn't cover what you need, leave it out.
- **Do not invent new lenses for Sections 7 and 8.** They compose existing chain output per the mapping tables in Phase 4. If a candidate addition or attack is needed, it should already be in the chain — extend Phase 2 selection, do not bolt on a new model at render time.
- **Do not collapse Steelman and Strawman.** Section 8 must surface both attacks separately. The Steelman comes from Design-class outputs, the Strawman from Stress-Test-class outputs. The gap between them is the point.
- **Do not invent automation hours.** Every numeric `hours_per_week_saved` figure in Section 7.0 must trace to a real WebFetch source from Phase 1C. Uncited use cases still render — without a number, with `Not benchmarked — pilot to measure` in the hours slot. The total-hours-recoverable callout sums only cited entries.

## Output summary

When the report is rendered, tell the user:
- Path to the report HTML
- How to open in browser
- That the report contains Sections 1–8 plus a collapsible Appendix with the chain trace, scores, market sources cited, and BCD gap notes
- That re-running with the same BCD will produce a fresh report (market research data is live-fetched each run)
