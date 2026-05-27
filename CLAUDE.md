# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Forge is a Claude Code plugin (`v1.2.2`) that delivers business model optimization for workshop facilitators. The single user-facing command — `/forge:optimize` — routes across three modes, then runs a four-phase pipeline that ends with a written HTML intelligence report.

There is no build step. The plugin ships as Markdown skill definitions, HTML templates, reference docs, and a JSON hook — no compilation, no package manager, no test runner.

## Local Preview

Two launch configurations exist (`.claude/launch.json`):

```
python -m http.server 8000   # preview questionnaire/report HTML
npx -y serve . -l 8001       # alternative
```

Open `skills/intake/templates/questionnaire.html` or a generated `forge-report-*.html` directly in a browser to inspect output.

## Plugin Structure

```
.claude-plugin/plugin.json   — manifest (name, version, keywords)
skills/optimize/SKILL.md     — operator-facing entry point (/forge:optimize)
skills/intake/SKILL.md       — internal helper, invoked by optimize Mode C only
hooks/auto-detect-bcd.json   — SessionStart hook: scans ~/forge-intake/ for pending BCDs
references/catalog.md        — 38-model scoring catalog
references/visual-primitives.md — Mermaid node/edge templates
references/report-structure.md  — 8-section output spec
```

## The Three Routing Modes

| Mode | Trigger | Action |
|------|---------|--------|
| A — Full pipeline | BCD file present in working dir | Runs all four phases, writes `forge-report-[slug]-[date].html` |
| B — Pointer | No BCD present | Directs operator to hosted intake form |
| C — Facilitator customization | Facilitator requests custom form | Invokes `intake` skill to emit a branded questionnaire HTML |

## Four-Phase Pipeline (Mode A)

1. **Web Supplement** — Scrapes operator's website to augment the BCD
2. **Market Research** — WebSearch for TAM, competitive landscape, macro signals; computes market multipliers
3. **Adaptive Model Chain** — Scores and selects from `references/catalog.md` (38 models); hard anchors enforce causal order; stops when 2 consecutive picks fall below 4.0 or at 25 models
4. **Report Render** — Fills `{{token}}` placeholders in `skills/optimize/templates/report.html`; writes output file

### Model Scoring Formula

```
score = base_relevance × subtractive_weight × bcd_multiplier × market_multiplier
```

Five hard causal anchors always fire in order: JTBD opens, First Principles before Design, Diagnose before Opportunity, Design before Stress-Test, Via Negativa/Musk's 5-Step closes.

## Templates

Each skill has a `templates/` directory:

- `skills/optimize/templates/report.html` — canonical 8-section terminal-noir report
- `skills/optimize/templates/report-nexus.html` — Nexus Core autonomous-systems variant (same token schema)
- `skills/intake/templates/questionnaire.html` — 7-page intake form
- `skills/intake/templates/questionnaire-pulsedesk.html` — modern SaaS variant

Both template variants share the same `{{token}}` placeholder schema. `mermaid-bundle.js` is a local UMD fallback for offline diagram rendering — do not edit it.

## Design System

The canonical spec is `DESIGN.md`. Key rules that affect generated HTML:

- **Color system:** terminal-noir (dark default) + terminal-blanc (light toggle); cyan accent `#00E5FF`
- **Typography:** Inter Tight (display), Inter (body), Source Serif 4 (editorial italic), JetBrains Mono (labels/code)
- **Voice rule (v1.2.2):** State the affirmative — no contrastive reframes ("Rather than X, do Y" is banned; say "Do Y" directly)
- CSS tokens are defined in `DESIGN.md §10` and must be used in any new template work

## Key References

| File | Purpose |
|------|---------|
| `PRD.md` | Authoritative spec — all phases, scoring logic, output format, verification steps |
| `DESIGN.md` | Brand and design system — colors, type, components, voice rules |
| `references/catalog.md` | All 38 mental models with scoring metadata, prompt kernels, BCD triggers |
| `CHANGELOG.md` | Version rationale — consult before changing core behavior |

## BCD Format

A Business Context Document (`.bcd.md`) is the required input for Mode A. Required fields are validated before Phase 1 runs. BCDs live in `~/forge-intake/` by convention and are excluded from git via `.gitignore`.

## Verification

Per `PRD.md §10`, manual verification covers:
1. Mode routing (A/B/C correct detection)
2. Phase execution (all four phases complete, no hallucinated sources)
3. HTML output (all 8 sections present, diagrams render, light/dark toggle works)
4. Voice compliance (no contrastive reframes in generated copy)
5. Design compliance (color tokens, typography, component patterns match `DESIGN.md`)

## Git Workflow

This plugin is maintained in a GitHub repository at `github.com/skizzy203/forge`. The Dropbox folder is the working copy. The Claude Code plugin install path (`~/.claude/plugins/marketplaces/local-desktop-app-uploads/forge/`) is a **separate copy** — it does NOT auto-sync with GitHub. After any plugin update, you must re-upload via the desktop app.

### Every session — start

```bash
git pull origin main
```

Always pull before editing. The remote may have commits from a prior worktree session or a different machine.

### Every session — end

Stage only the files you intentionally changed, then commit and push:

```bash
git add skills/optimize/SKILL.md        # example — be explicit, never git add -A
git commit -m "feat: describe the change"
git push origin main
```

The `Stop` hook in `.claude/settings.local.json` auto-commits anything still staged at session end as a safety net. It does **not** auto-stage — you must `git add` deliberately.

### Version bumping

Edit `.claude-plugin/plugin.json` → `"version"` on the same commit as the behavioral change.

| Change type | Version bump |
|---|---|
| New phase, new model, new report section | minor (`1.X.0`) |
| Bug fix, copy fix, scoring tweak | patch (`1.14.X`) |
| Breaking BCD schema change | major (`X.0.0`) |

### Commit prefix conventions

| Prefix | When to use |
|---|---|
| `feat:` | New capability added to SKILL.md or templates |
| `fix:` | Corrects wrong behavior (legal error, broken diagram, bad token) |
| `style:` | Design/CSS change only — no behavioral change |
| `docs:` | CLAUDE.md, PRD.md, CHANGELOG.md, README.md updates |
| `release:` | Version bump + CHANGELOG entry only |
| `chore:` | Housekeeping (gitignore, tool permission updates, etc.) |

### Never commit

- `.bcd.md` / `.bcd 1.md` intake files (operator PII)
- Generated `forge-report-*.html` output files
- `.claude/worktrees/` contents
- Any file matching `forge-runs/`

These are all covered by `.gitignore`. Verify with `git status` before committing.

### Updating the installed copy

After pushing to GitHub, sync the install:

1. Pull from GitHub: `git pull origin main` in this working copy
2. Re-upload via Claude Code desktop app → **Plugins** → re-select the local folder
3. Verify version number in the installed copy's `plugin.json` matches

There is no auto-install on push — the two copies drift if you skip step 2.
