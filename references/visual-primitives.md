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

**Modifiers for AS-IS (updated v1.6 — outline-only):**
- Apply `classDef friction fill:none` to all FRICTION nodes — the global Mermaid `themeCSS` override (see § Mermaid Theme below) supplies the amber stroke via `g.node.friction` selector
- The diagram source carries only the class name; all color is theme-driven so light/dark toggle re-themes the SVG without re-rendering
- FRICTION pulse animation deprecated — visual emphasis comes from the amber outline contrast against accent-cyan, not from motion
- Label diagram clearly: **"AS-IS — Where The Business Is Today"**
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

**Modifiers for PROPOSED (updated v1.6 — outline-only):**
- Apply `classDef added fill:none` to new nodes (suffix `[+]`) — themeCSS supplies the success-green stroke
- Apply `classDef removed fill:none` to removed nodes (suffix `[-]`) — themeCSS supplies the muted-gray dashed stroke and 0.7 opacity
- Apply `classDef changed fill:none` to changed nodes (suffix `[~]`) — themeCSS supplies the info-purple stroke
- All color is theme-driven via the Mermaid `themeCSS` injected in the report. Diagram source carries only class names; light/dark toggle re-themes the SVG without re-rendering.
- FRICTION nodes from AS-IS that have been resolved should be omitted (Via Negativa removed them) or shown with `[-]` suffix and `removed` class
- Label diagram clearly: **"PROPOSED — The Optimized Model"**

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

### v1.6 — Outline-only `themeCSS` (overrides node fill, supplies class-driven border semantics)

Pass `themeCSS` alongside `themeVariables` in `mermaid.initialize()`. Mermaid injects the CSS into the rendered SVG. Selectors use CSS custom properties so light/dark toggle re-themes the diagram without a re-render.

```css
.node rect, .node circle, .node polygon, .node ellipse, .node path {
  fill: transparent !important;
  stroke-width: 1.5px !important;
}
.node .label, .node .nodeLabel, .node text, .node foreignObject div {
  color: var(--text-primary) !important;
  fill: var(--text-primary) !important;
}
.edgePath path, .flowchart-link, .edgePaths .path {
  stroke-width: 1.5px !important;
}
g.node.friction rect, g.node.friction circle, g.node.friction polygon, g.node.friction ellipse, g.node.friction path {
  stroke: var(--warn) !important;
}
g.node.added rect, g.node.added circle, g.node.added polygon, g.node.added ellipse, g.node.added path {
  stroke: var(--success) !important;
}
g.node.changed rect, g.node.changed circle, g.node.changed polygon, g.node.changed ellipse, g.node.changed path {
  stroke: var(--info) !important;
}
g.node.removed rect, g.node.removed circle, g.node.removed polygon, g.node.removed ellipse, g.node.removed path {
  stroke: var(--text-muted) !important;
  stroke-dasharray: 4 3 !important;
  opacity: 0.7;
}
```

**Pairing with `classDef` in diagram source.** The chain emits each diagram with named classes (`friction`, `added`, `changed`, `removed`) applied via `class A,B,C classname`. The `classDef` declaration carries `fill:none` only — all color comes from `themeCSS`. This keeps the diagram source theme-agnostic and the styling reactive.

Example (AS-IS flowchart tail):

```
classDef friction fill:none
class G,H,I friction
```

Example (PROPOSED flowchart tail):

```
classDef added fill:none
classDef changed fill:none
classDef removed fill:none
class K,L,M,N added
class A,B,C,D,E,F changed
```

Pre-v1.6 hardcoded fill colors like `fill:#ef4444` are deprecated — they bypass the themeCSS and don't re-theme on toggle. New diagram emissions must use the outline-only `fill:none` pattern.

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

### Customer Ascension flowchart — Section 7.0c (added v1.9)

Rendered inside the Money Model Architecture sub-block. A 4-node `flowchart LR` showing tier progression: Front-door → Core → Premium → Subscription. Each tier-node carries the tier label plus the price anchor on a second line; edges carry typical conversion / attach rates from Phase 1B benchmarks where surfaced, otherwise `n/a`.

**Container class.** Wrap the `.diagram .mermaid` in `<div class="diagram money-model-ascension">` so the 4-tier semantic color CSS (in the document stylesheet) targets only this specific flowchart, not the AS-IS or PROPOSED diagrams which keep their friction/added/changed/removed class-driven colors.

**Semantic color cycle** (one new CSS block in `templates/report.html`, ~30 lines):

| Tier (nth-of-type) | Stroke color | CSS variable |
|---|---|---|
| 1 — Front-door | accent-cyan | `--accent` |
| 2 — Core | info-purple | `--info` |
| 3 — Premium | warn-amber | `--warn` |
| 4 — Subscription | success-green | `--success` |

Edge arrows render in `--accent` at 0.7 stroke-opacity so the progression direction reads clearly without competing with the per-tier stroke colors.

**Source syntax** (composed by the chain into `{{money_model_block}}`):

```
flowchart LR
  A["Front-door tier name<br/>$price–anchor"] -->|"~conversion%"| B["Core tier name<br/>$price–anchor"]
  B -->|"~attach%"| C["Premium tier name<br/>$price–anchor"]
  B -->|"~join%"| D["Subscription tier name<br/>$price–anchor"]
  C --> D
```

Node IDs A/B/C/D map deterministically to nth-of-type 1/2/3/4 because Mermaid emits nodes in source declaration order. The C → D edge has no conversion label because it represents a natural pipeline rather than a measured attach rate.

**Theme reactivity.** Inherits from the outline-only Mermaid themeCSS (v1.6.4 heritage). Light/dark toggle re-themes via the CSS-variable cascade. No re-render required.

**Failure handling.** If Mermaid fails to render the ascension diagram, the v1.1 graceful offline notice replaces it (existing pattern; no new code).

---

## § Cinematic Header (rewritten v1.6, replaces the v1.5 scroll layer)

A single bounded raw-WebGL shader element renders the title "BUSINESS MODEL OPTIMIZATION REPORT" above Section 1. The v1.5 Three.js + GSAP + ScrollTrigger bundle (~380 KB) and its hero + footer scenes were retired in v1.6 — the new approach ships ~5 KB of inline code, no external library, no scroll dependency, no overlap with the `.bg-num` section numeral.

### Composition

- 480px-max tall element (`clamp(220px, 38vh, 460px)`) above Section 1, bounded by hairline `border-top` + `border-bottom`
- Raw WebGL2 (falls back to WebGL1) fragment shader on a fullscreen triangle
- A 2D canvas renders the title text in Inter Tight 800-weight crisp at the device pixel ratio (capped at 2). The shader samples that canvas as a texture.

### Shader effect

- Accent-tinted band sweeps left to right across the letterforms, looping every ~9 seconds
- Within the band, text color mixes from `--text-primary` toward `--accent` (clamped at 0.95 mix)
- Subtle pixel-aligned scanline at low amplitude (`0.94 + 0.06 * sin(y * resolution.y * 0.9)`) gives the impression of a CRT-broadcast feel without the kitsch
- Soft edge glow added where the band is hot — `accent * band * 0.18`

Brand fit: no chromatic aberration on the body of the glyph (which would degrade legibility), no bloom, no rotation. The motion is restrained and continuous — "computation happening" not "marketing demo."

### Theme reactivity

The shader reads `--accent` and `--text-primary` from `getComputedStyle(document.documentElement)` at init and on every `forge-theme-change` event. The text canvas re-paints with the new text color, the texture re-uploads, and the shader uniforms update — no flash, no layout shift.

### Failure budget

- **`prefers-reduced-motion: reduce`** → shader script exits at entry; the `.cine-header-fallback` static `<h1>` stays visible. Container height collapses to `auto`.
- **`@media print`** → entire `.cine-header` element hidden.
- **WebGL unavailable** → `gl.getContext()` returns null; script exits; fallback `<h1>` stays visible.
- **Shader compile/link failure** → script logs to console and exits; fallback `<h1>` stays visible.
- **Mobile pixel-ratio cap** → `Math.min(window.devicePixelRatio, 2)` prevents 4K retina screens from rendering at 4× cost.

### No external dependencies

No CDN imports. No Three.js, no GSAP, no ScrollTrigger. The ~150 lines of shader + setup code are inlined into the report template directly. Bundle reduction vs v1.5: ~380 KB → ~5 KB.

### Cleanup

`beforeunload` listener cancels the animation frame, deletes shader program, vertex/fragment shaders, attribute buffer, and texture to prevent GPU leaks on long-lived tabs.

### Retired in v1.6
- v1.5 hero scene (Three.js layered grid planes + accent point cloud + halo + scroll-pinned camera dolly) — replaced
- v1.5 footer convergence scene (six wireframe primitives converging to central accent sphere) — removed entirely. Tally CTA stands alone now.
