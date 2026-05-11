# Forge — Visual Primitives

Mermaid diagram templates for the AS-IS and PROPOSED business-model diagrams rendered in the Forge intelligence report. Adapted from the Distill plugin's visual primitives, scoped to business-model representation.

The optimize skill loads this file during Phase 3 (Mermaid diagram synthesis).

---

## Node Types

Eight semantic node types mapped to Mermaid native shapes. The primitive name is the **first word** inside the node label.

| Primitive | Mermaid syntax | Shape | Use |
|---|---|---|---|
| OFFER | `id["OFFER: label"]` | Rounded rectangle | The product or service being sold |
| AVATAR | `id(["AVATAR: label"])` | Stadium | The customer/buyer |
| CHANNEL | `id[/"CHANNEL: label"/]` | Parallelogram | How customers find/reach the offer |
| CONVERSION | `id(("CONV: label"))` | Circle | Where prospects become customers |
| DELIVERY | `id[["DELIVERY: label"]]` | Subroutine | How value is delivered post-purchase |
| REVENUE | `id[("REVENUE: label")]` | Cylinder | Where money flows in |
| SYSTEM | `id{{"SYSTEM: label"}}` | Hexagon | Tools, platforms, infrastructure |
| FRICTION | `id{"FRICTION: label"}` | Rhombus | A leak, friction point, or constraint |

---

## Edge Types

| Edge | Mermaid syntax | Meaning |
|---|---|---|
| Standard flow | `-->` | Standard directional flow |
| Value exchange | `==>` | High-value transfer |
| Feedback loop | `-.->|"feedback"|` | Recursive or reinforcing path |
| Weak link | `-.->` (no label) | Uncertain or thin dependency |
| Broken path | `--x` | Dead end or blocked path |

---

## AS-IS Diagram Template

Used to render the operator's current business model in Section 3 of the report.

```
flowchart TD
  A["OFFER: current offer name"] ==> B(["AVATAR: customer description"])
  B --> C[/"CHANNEL: how they find us"/]
  C --> D(("CONV: conversion point"))
  D ==> E[["DELIVERY: how value is delivered"]]
  E --> F[("REVENUE: revenue stream")]
  G{"FRICTION: leak or constraint"} -.->|"friction"| D
  H{{"SYSTEM: tools and infrastructure"}} --> E
```

**Modifiers for AS-IS:**
- Apply `classDef friction fill:#ef4444,stroke:#dc2626,color:#fff` to all FRICTION nodes
- FRICTION nodes pulse: `animation: pulse-red 1.5s ease-in-out infinite`
- Label diagram clearly: **"AS-IS — Where The Business Is Today"** in red-toned header
- Node content pulled from BCD: OFFER from Q1, AVATAR from Q3, REVENUE from Q2, etc.

---

## PROPOSED Diagram Template

Used to render the optimized model in Section 5 of the report.

```
flowchart TD
  A["OFFER: redesigned offer"] ==> B(["AVATAR: sharper customer"])
  B --> C[/"CHANNEL: better channel"/]
  C --> D(("CONV: optimized conversion"))
  D ==> E[["DELIVERY: streamlined delivery"]]
  E --> F[("REVENUE: improved revenue")]
  H{{"SYSTEM: leaner stack"}} --> E
  I["OFFER: new addition [+]"] -.->|"opportunity"| B
```

**Modifiers for PROPOSED:**
- Apply `classDef added fill:#10b981,stroke:#059669,color:#fff` to new nodes (suffix `[+]`)
- Apply `classDef removed opacity:0.3` to removed nodes (suffix `[-]`)
- Apply `classDef changed fill:#f59e0b,stroke:#d97706,color:#fff` to changed nodes (suffix `[~]`)
- FRICTION nodes from AS-IS that have been resolved should be omitted (Via Negativa removed them) or shown with `[-]` suffix and `removed` class
- Label diagram clearly: **"PROPOSED — The Optimized Model"** in green-toned header

---

## Animation — AS-IS → PROPOSED Morph

Activates when AS-IS has ≤ 12 nodes. Render both diagrams sharing stable node IDs, with CSS keyframe animation that morphs between states.

**Three-phase loop:**
1. Frame 1 (1s): AS-IS visible. FRICTION nodes pulse red.
2. Morph (1s): removed nodes fade to 0, added nodes fade in from 0, changed nodes cross-fade shape.
3. Frame 2 (1s): PROPOSED visible. Added nodes green.
4. Loop continuously.

**Hover to pause:** `.diagram-container:hover { animation-play-state: paused; }`

**CSS keyframes:**
```css
@keyframes pulse-red {
  0%, 100% { fill: #ef4444; opacity: 1; }
  50% { fill: #dc2626; opacity: 0.7; }
}
@keyframes fade-out {
  0% { opacity: 1; } 100% { opacity: 0; }
}
@keyframes fade-in {
  0% { opacity: 0; } 100% { opacity: 1; }
}
```

If AS-IS has > 12 nodes: render static side-by-side instead. Label: "AS-IS → PROPOSED diff (static — diagram too large to animate)."

---

## Mermaid Theme — Terminal-Noir

Pre-derived `themeVariables` matching DESIGN.md tokens. Inject into every diagram render.

**Dark mode (default):**
```
primaryColor: #11161A
primaryTextColor: #E8ECEE
primaryBorderColor: #22E0FF
lineColor: #22E0FF
secondaryColor: rgba(34, 224, 255, 0.12)
tertiaryColor: #0A0E11
background: #0A0E11
fontFamily: "Inter", system-ui, sans-serif
fontSize: 14px
look: classic
layout: elk
```

**Light mode (toggle active):**
```
primaryColor: #F4F6F7
primaryTextColor: #0A0E11
primaryBorderColor: #0FB8D6
lineColor: #0FB8D6
secondaryColor: rgba(15, 184, 214, 0.10)
tertiaryColor: #FFFFFF
background: #FFFFFF
fontFamily: "Inter", system-ui, sans-serif
fontSize: 14px
look: classic
layout: elk
```

**Theme-reactive init block (injected once per report):**
```html
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  function applyTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: isDark ? '#11161A' : '#F4F6F7',
        primaryTextColor: isDark ? '#E8ECEE' : '#0A0E11',
        primaryBorderColor: isDark ? '#22E0FF' : '#0FB8D6',
        lineColor: isDark ? '#22E0FF' : '#0FB8D6',
        secondaryColor: isDark ? 'rgba(34,224,255,0.12)' : 'rgba(15,184,214,0.10)',
        tertiaryColor: isDark ? '#0A0E11' : '#FFFFFF',
        background: isDark ? '#0A0E11' : '#FFFFFF',
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: '14px'
      },
      look: 'classic',
      layout: 'elk'
    });
  }
  applyTheme();
  document.getElementById('theme-toggle').addEventListener('click', () => {
    setTimeout(() => { applyTheme(); mermaid.contentLoaded(); }, 100);
  });
</script>
```

---

## Strategic Insight Layer

Render a 3-line structured block below each diagram. Source from chain execution output — no re-derivation.

```
Revenue leak:       [from Pareto or ToC — highest-loss item]
Leverage point:     [from Leverage Points or ToC — single intervention]
Removed constraint: [from First Principles — convention stripped]
```

Omit any line where the source field is absent from chain output. Never fabricate.

**HTML template:**
```html
<div class="insight-layer">
  <div class="insight-row">
    <span class="insight-label">Revenue leak</span>
    <span class="insight-value">{{value}}</span>
  </div>
  <div class="insight-row">
    <span class="insight-label">Leverage point</span>
    <span class="insight-value">{{value}}</span>
  </div>
  <div class="insight-row">
    <span class="insight-label">Removed constraint</span>
    <span class="insight-value">{{value}}</span>
  </div>
</div>
```

CSS in DESIGN.md §05 (callout/insight block).

---

## Source-Chain to Diagram Content Mapping

What each model's output contributes to the diagrams:

| Source | Contributes to |
|---|---|
| JTBD | AVATAR node label, OFFER framing |
| Pareto 80/20 | FRICTION nodes (bottom 80% as leaks), AS-IS only |
| ToC | The single binding FRICTION node (highlighted), AS-IS |
| Value Equation | Redesigned OFFER node label, PROPOSED |
| Pricing Strategy | REVENUE node label, PROPOSED |
| Via Negativa | Nodes marked `[-]` for removal, PROPOSED |
| Operator Edge | New AVATAR or CHANNEL nodes marked `[+]`, PROPOSED |
| Blue Ocean | New OFFER nodes marked `[+]`, PROPOSED |
| Leverage Points | The single highlighted CHANGED node `[~]`, PROPOSED |
| First Principles | Annotation on diagram: "Stripped: [convention]" |

---

## Auxiliary Diagrams (added v1.1)

Three additional Mermaid diagram types, each rendered inside a specific report section. Use the same theme-reactive init block from above — no separate themes. Each diagram type was chosen because it carries visual work no other Forge component does.

### Revenue Diff Sankey — Section 5 (alongside PROPOSED flowchart)

Shows how revenue rewires from AS-IS streams into PROPOSED streams. Native Mermaid v11 `sankey-beta` syntax. The diagram visualizes the *flow of money* before and after, complementing the structural rewiring shown by the flowchart.

**Template:**
```
sankey-beta
[AS-IS stream 1],[AS-IS total],<estimated weight>
[AS-IS stream 2],[AS-IS total],<estimated weight>
[AS-IS stream N],[AS-IS total],<estimated weight>
[AS-IS total],[PROPOSED stream 1],<reallocated weight>
[AS-IS total],[PROPOSED stream 2],<reallocated weight>
[AS-IS total],[Eliminated],<removed weight>
```

The center node ("AS-IS total" → "PROPOSED rebuild") makes the rewiring visible. Streams that disappear flow into an "Eliminated" node so the subtraction shows.

**Source-chain mapping:**
- AS-IS streams: from BCD revenue breakdown + Pareto 80/20 output
- PROPOSED streams: from Value Equation redesigned offer + Pricing Strategy + Operator Edge
- Eliminated: from Via Negativa output

**Weights:** estimated as proportional (sum to ~100 for readability). Do not invent specific dollar amounts the chain did not produce.

### Implementation Gantt — Section 6 (replaces or supplements the three move cards)

Shows the timing dependency between the three moves. Native Mermaid v11 `gantt` syntax.

**Template:**
```
gantt
title Implementation Timeline
dateFormat YYYY-MM-DD
axisFormat %b %d
tickInterval 2week
section Move 1
[Sub-task A] :m1a, <today>, <duration>
[Sub-task B] :m1b, after m1a, <duration>
section Move 2
[Sub-task A] :m2a, after m1b, <duration>
[Sub-task B] :m2b, after m2a, <duration>
section Move 3
[Sub-task A] :m3a, <Q2 start>, <duration>
[Sub-task B] :m3b, after m3a, <duration>
```

**Mobile readability notes:**
- **`tickInterval`** is critical for any Gantt spanning more than ~4 weeks. Without it, daily ticks crowd unreadably on narrow viewports. Use `1week` for ≤6 weeks total, `2week` for ≤3 months, `1month` for longer plans.
- **Keep section labels short** — `Move 1` rather than `Move 1 — This week`. The "this week / this month / this quarter" framing already lives in Section 6's move cards; the Gantt is the visual companion, not a re-statement.
- **Sub-task names should be imperatives under 35 chars** — long names overflow into the chart body on narrow viewports.
- **The parent `.diagram` container has `overflow-x: auto` and the mobile CSS sets `.diagram .mermaid { min-width: 560px }`** so any Gantt that doesn't fit horizontally becomes pannable rather than squashed.

**Source-chain mapping:**
- Sub-tasks per move: from Section 6 prose, broken into 2–3 concrete steps each
- Dates: anchored to the run timestamp (today + week/month/quarter offsets)

**Voice on sub-task names:** operator language only. No model names. Imperative phrasing ("Pull side businesses", "Sign subcontractor agreement").

### Pre-Mortem Quadrant — Section 8.2 (alongside the failure-mode grid)

Plots failure modes on Likelihood × Impact axes. Native Mermaid v11 `quadrantChart` syntax.

**Template:**
```
quadrantChart
title Pre-Mortem Failure Modes
x-axis Low Likelihood --> High Likelihood
y-axis Low Impact --> High Impact
quadrant-1 Fix immediately
quadrant-2 Mitigate at design time
quadrant-3 Accept
quadrant-4 Monitor closely
[Failure mode label]: [x, y]
[Failure mode label]: [x, y]
```

**Source-chain mapping:**
- Labels: failure modes from Pre-Mortem Analysis output
- Coordinates: Likelihood and Impact tags translated to 0.0–1.0:
  - Likelihood: Low=0.2, Med=0.5, High=0.75
  - Impact: Low=0.2, Med=0.5, High=0.8
  - Add small offsets so dots don't overlap when ratings collide

The quadrant is a direct visual reading of the same ranking the text version surfaces. Both render — quadrant for at-a-glance prioritization, text for context.

### Revenue Trajectory Chart — Section 7 (between projection grid and death-zone callout)

Three-scenario line chart showing how revenue diverges under no-changes, base-plan, and amplified scenarios. Native Mermaid v11 `xychart-beta` with multiple line series. Answers the question the projection cards raise: "what does this look like over time?"

**Template:**
```
%%{init: {"themeVariables": {"xyChart": {"plotColorPalette": "#8A949A, #10B981, #0FB8D6", "backgroundColor": "transparent"}}}}%%
xychart-beta
  title "Revenue trajectory — three scenarios"
  x-axis [Today, "Year 1", "Year 2", "Year 3"]
  y-axis "Revenue (USD thousands)" 0 --> <ceiling>
  line "No changes" [<current>, <y1>, <y2>, <y3>]
  line "Base plan only" [<current>, <y1>, <y2>, <y3>]
  line "Base + amplifications" [<current>, <y1>, <y2>, <y3>]
```

**Line derivation:**

| Line | Source | Calculation |
|---|---|---|
| No changes | BCD current revenue + Phase 1B market CAGR | `current × (1 + cagr)^n`, soft-capped at the demonstrated solo ceiling from industry data |
| Base plan only | Section 6 ceiling | Year 1 = ~60% of ceiling (transition), Year 2 = ceiling, Year 3 = ceiling held |
| Base + amplifications | Section 7 projection cells | Year-by-year midpoint between the conservative and optimistic ranges, rounded for readability |

**Y-axis ceiling:** scaled to ~120% of the amplified Year-3 high so the steepest line has headroom.

**Color palette:** muted gray (no changes) → success green (base) → accent-deep cyan (amplified). Chosen to read in both light and dark modes without per-theme overrides. The `accent-deep` value (`#0FB8D6`) is used instead of the brighter `#22E0FF` accent specifically so the line is visible against light-mode backgrounds.

**No death-zone reference line.** Mermaid xychart-beta does not support shaded regions. The death-zone callout immediately below the chart carries the $500K–$1.2M margin compression warning in prose.

**Failure handling:** if a line cannot be populated (thin chain output), render the chart with the available lines and add a one-line caption explaining the omission.

### Theme compatibility

All four auxiliary diagrams use the existing theme-reactive init block. No new themes needed. Mermaid v11 ships with native styling for sankey, gantt, quadrant, and xychart that respects the `themeVariables` already passed in. The xychart-beta uses an inline `%%{init}%%` directive to scope its `plotColorPalette` so the three trajectory lines render with semantic colors rather than auto-assigned defaults. Verify on first render that line colors and text colors match the rest of the report in both themes.
