# Changelog

All notable changes to Forge are documented in this file.

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
