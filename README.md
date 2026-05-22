<img width="1774" height="887" alt="forge-product-card" src="https://github.com/user-attachments/assets/8f8fa87c-158a-4fa4-9e06-8f2ab7511553" />
# Forge

[![Netlify Status](https://api.netlify.com/api/v1/badges/7e43ad03-2f97-4b8b-91c4-c9c2f436afcf/deploy-status)](https://app.netlify.com/projects/forge-intake/deploys)
[![Release](https://img.shields.io/github/v/release/skizzy203/forge?label=release&color=10B981&style=flat-square)](https://github.com/skizzy203/forge/releases)
[![License: MIT](https://img.shields.io/github/license/skizzy203/forge?color=22E0FF&style=flat-square)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-plugin-22E0FF?logo=anthropic&logoColor=white&style=flat-square)](https://claude.com/claude-code)
[![Claude Cowork](https://img.shields.io/badge/Claude_Cowork-compatible-22E0FF?logo=anthropic&logoColor=white&style=flat-square)](https://claude.ai)
[![Last commit](https://img.shields.io/github/last-commit/skizzy203/forge?color=A855F7&style=flat-square)](https://github.com/skizzy203/forge/commits/main)
[![Stars](https://img.shields.io/github/stars/skizzy203/forge?style=flat-square&color=E8B33A)](https://github.com/skizzy203/forge/stargazers)

**Business model optimization for business owners and strategists. Adaptive 40-model analysis grounded in live market research. Output: before-and-after model flowcharts, implementation Gantt, revenue trajectory chart, and pressure test.**

Forge is a business model optimization plugin for business owners and strategists. It pressure-tests its own recommendations rather than just emitting them. The plugin runs your business context through a 40-model analysis chain anchored by named lenses (Jobs-to-Be-Done, Inversion, Via Negativa, others) and biased toward subtraction. Live market research grounds the analysis in TAM, competitive density, pricing distribution, and customer acquisition cost data. Output is an HTML report with before-and-after model flowcharts, a revenue-rewiring Sankey, a three-move implementation Gantt, a three-year revenue trajectory chart, and a Steelman / Strawman / Pre-Mortem attack on the resulting strategy.

---

## Install

```
/plugin install https://github.com/skizzy203/forge
```

The plugin exposes a single command, `/forge:optimize`, plus a SessionStart hook (`auto-detect-bcd`) that surfaces pending intakes from `~/forge-intake/`.

## Use

There's one command. It routes by intent.

### To get a report on your business

1. Fill out the intake form: **https://intake.builderbranding.co**
   The form takes about ten minutes. It's email-gated, multipage, and auto-saves between pages.
2. Submit. You'll get three paths:
   - **Email** the BCD to your facilitator (mailto, with the file attached)
   - **Download** the BCD — drop it into `~/forge-intake/` for the next Claude Code session to pick up, or paste it back into chat
   - **Copy to clipboard** — paste it directly into your conversation
3. Once Forge sees the BCD, it auto-runs the optimization. **No command needed** — pasting the BCD or surfacing it via the hook is enough.

If you want to be explicit, just type `/forge:optimize` after the BCD is in scope.

### To run with no BCD yet

Type `/forge:optimize` with no input. Forge will point you to the hosted form. Same end result.

### To customize the intake form (facilitators only)

Type `/forge:optimize` and say something like:

> "I need a custom intake form for my workshop. My facilitator email is `me@example.com` and the workshop name is `Q3 Builder Cohort`."

Forge will emit a customized HTML file (the questionnaire with your email and branding wired in) to your working directory. Host it on your own domain, email it, hand it over on USB.

This is also the path for **offline workshops** — if you can't reach the hosted form, ask Forge for an offline copy and you get a self-contained HTML file that runs from the local filesystem.

### What the report contains

Eight sections plus an appendix, rendered as a single HTML file with sticky theme toggle, reading progress bar, print stylesheet, and six Mermaid diagrams:

1. **Executive Summary** — single-screen snapshot, three move teasers
2. **Market Intelligence Brief** — TAM with sources, three macro signals, competitive density, opportunity windows
3. **Where The Business Is Today** — AS-IS flowchart, friction nodes, component breakdown
4. **Optimization Analysis** — diagnose findings, operator edge, design candidates, stress-test results
5. **The Proposed Model** — AS-IS vs PROPOSED contrast, PROPOSED flowchart, Revenue Diff Sankey
6. **The Implementation Plan** — three move cards plus Implementation Gantt
7. **Amplified Moves** — three compounding additions with three-year revenue projections and trajectory chart
8. **Pressure Test** — Steelman, Strawman, ranked Pre-Mortem failures with Quadrant chart, second-order consequences, What-Survives summary

The report writes to your working directory. Open in a browser, share, print, or upload.

### Behind the scenes — four-phase pipeline

`/forge:optimize` Mode A runs:

1. **Web supplement + market research** — scrapes the operator's website (if provided in the BCD), then WebSearch + WebFetch for TAM, macro signals, competitive density, and industry death-zone bands
2. **Adaptive chain** — mental-model selection with subtractive bias and causal-chain anchors (40-model catalog, 5 hard causal anchors)
3. **Mermaid diagram synthesis** — six diagrams: AS-IS flowchart, PROPOSED flowchart, Revenue Diff Sankey, Implementation Gantt, Pre-Mortem Quadrant, Revenue Trajectory Chart
4. **Report render** — 8-section terminal-noir HTML with the effectiveness layer (reading progress bar, scroll-triggered section fade-in, animated number count-up, hover-expand Appendix glossary), graceful offline fallback for Mermaid, mobile-responsive diagrams that scroll horizontally on narrow viewports

## Architecture

```
forge/
├── .claude-plugin/plugin.json
├── index.html           — redirect to the hosted intake form
├── skills/optimize/     — single command, three routing modes
├── skills/intake/       — internal helper for facilitator customization (no slash surface)
├── hooks/               — SessionStart auto-detect for pending BCDs
├── examples/            — sample rendered report
└── references/
    ├── DESIGN.md            — terminal-noir / terminal-blanc brand spec
    ├── catalog.md           — 40 mental models with kernels + scoring
    ├── visual-primitives.md — Mermaid templates for business-model diagrams
    └── report-structure.md  — gold-standard MBB-derived report structure
```

## Try the intake form

**[Open the live intake form →](https://intake.builderbranding.co)** (opens the rendered questionnaire in your browser, no clone required)

About ten minutes to fill. Email-gated, multipage, auto-saves between pages. On submit you get three delivery paths — email to facilitator, download locally, or copy to clipboard. The raw HTML source lives at [skills/intake/templates/questionnaire.html](skills/intake/templates/questionnaire.html).

## Sample output

**[View the rendered sample report →](https://intake.builderbranding.co/examples/mechanical-magic.html)** (opens in your browser, no clone required)

Real workshop output for a Cherokee County pressure-washing operator (Mechanical Magic LLC) showing all eight sections, six Mermaid diagrams (AS-IS flowchart, PROPOSED flowchart, Revenue Diff Sankey, Implementation Gantt, Pre-Mortem Quadrant, Revenue Trajectory), the sticky theme-toggle header, the reading progress bar, the count-up number animations, and the hover-expand Appendix glossary. The raw HTML source lives at [examples/mechanical-magic.html](examples/mechanical-magic.html).

## License

MIT. See LICENSE.

---

*A clear plan for your business, backed by market data.*
