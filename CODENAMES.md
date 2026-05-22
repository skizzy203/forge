# Forge release codenames

Each minor version carries a single-word codename. Patch releases inherit the codename of their minor.

Release titles are stamped automatically by `.github/workflows/auto-tag-release.yml`, which reads this table on every merge to `main` and builds the GitHub release title as `Forge vX.Y.Z — [Codename] — Business Model Optimization`.

| Version | Codename     | Theme                                                       |
|---------|--------------|-------------------------------------------------------------|
| v1.1.x  | Cornerstone  | Initial release — foundational scaffolding                  |
| v1.2.x  | Routing      | Single command, route by intent                             |
| v1.3.x  | Plug-in      | Automation Surface — industry-grade AI use cases            |
| v1.5.x  | Hero         | Cinematic header layer                                      |
| v1.6.x  | Outline      | Outline-only Mermaid, model-pruning logs                    |
| v1.7.x  | Iridescence  | UnicornStudio shader header                                 |
| v1.8.x  | Intake       | Questionnaire deepened — five new fields, Page 4 deep-dive  |
| v1.9.x  | Ladder       | Section 7.0c Money Model Architecture + Cash Conversion     |
| v1.10.x | Cohesion     | Order-of-Ops tightening + release codename system           |
| v1.11.x | Phase        | Pre-questionnaire phase modal + Netlify Forms backend + BCD format overhaul |

## Reserved

These codenames are held for future versions that match the theme. Do not retro-apply.

- **Schematic** — reserved for a future version that ships a structural diagram refactor (e.g., a new diagram primitive in `visual-primitives.md` or a top-level Section restructure).
- **Anchor** — reserved for a future version that hardens cite-or-omit discipline (e.g., a new validation pass on chain outputs that won't render numbers without a Phase 1B citation).

## Versions without releases

No GitHub releases exist for `v1.0.x` or `v1.4.x` — those minor numbers were never published. The table above only lists versions with corresponding entries on the [Releases page](https://github.com/skizzy203/forge/releases).

## How a new codename gets chosen

One word. Concrete noun preferred over abstraction. Should evoke the *primary feature* of the minor version, not the bug-fix work. Patch releases inherit the minor's codename. When the auto-tag workflow runs, it reads this file, looks up the codename for the version's major.minor, and stamps the GitHub release title accordingly. If the workflow can't find a match, it falls back to a tag-only title and emits a warning — add the new row to this file before the next release if that happens.
