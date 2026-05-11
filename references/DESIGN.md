# DISTILL — DESIGN.md
## Brand & Production Standard · Terminal-Noir System
**Owner:** Distill Business Model Workshops
**Version:** 1.0
**Applies to:** Forge questionnaire artifacts, Forge intelligence reports, all surfaces produced by this plugin
**Status:** Authoritative. Anything produced by Forge must conform to this file.

---

## 00 / READ ME FIRST

This is the operating system for the Distill visual identity as applied to Forge plugin outputs. It exists so every artifact the plugin emits looks, sounds, and feels like it came from the same hand.

The system is **terminal-noir** by default with a **terminal-blanc** light-mode inversion: a deep black field, monospaced terminal cues at the edges, a single chromatic accent doing all the load-bearing emphasis, and editorial italics carrying the human voice over a brutalist display headline.

The aesthetic borrows from three places: developer terminals, late-90s editorial print, and dense info-poster design. The result reads as confident, technical, and distilled — never decorative.

If a choice isn't covered here, the answer is: **strip it down**. The best part is no part.

---

## 01 / VOICE & POSITIONING

### Brand line
**A clear plan for your business, backed by market data.**

### One-sentence positioning
Distill Business Model Workshops are first-principles intensives that strip a business to what's actually load-bearing, then rebuild it lean, leveraged, and ready to scale.

### Tone in three words
Direct. Distilled. Inevitable.

### Voice rules
- Conversational, never corporate. Contractions on. Real rhythm.
- Lead emotionally, carry logically. The hook lands first; the proof carries it.
- Sharp friction over polite agreement. If something's wrong, the copy says so on the first line.
- Plain language first. Terminology earns its place by being unavoidable, not impressive.
- Specific over abstract. A real number, a real noun, a real moment.

### Voice anti-patterns
Forbidden in any Distill copy across any surface:
- Em-dashes **in generated prose** (use hyphens, periods, line breaks, or rephrase). HTML entity em-dashes (`&mdash;`) used as structural punctuation in section headers, callout labels, and list separators are allowed — they are markup, not prose.
- Tricolon structures (rhythmic three-part lists for effect)
- Anaphora (repeated sentence openers used as a device)
- Sentences starting with "But" or "And"
- The words *genuinely*, *honestly*, *straightforward*
- **Contrastive reframes / negation as setup.** Any structure that denies one thing in order to assert another. Examples to avoid: *"X isn't Y. X is Z."*, *"It's not X — it's Y."*, *"This isn't about X."*, *"X aren't data."* (denial-as-instruction). These read as AI-slop sleight-of-hand. State the affirmative directly. **Instead of** *"The work isn't in the framework. It's in the distillation,"* **say** *"A clear plan for your business, backed by market data."* **Instead of** *"Generic answers aren't data,"* **say** *"Be specific."* If you catch yourself writing *"isn't"* or *"is not"* as setup for a contrast, rewrite the sentence — do not patch punctuation.
- Opening affirmations: *"Great question," "Absolutely," "That's a smart approach"*
- Throat-clearing intros that restate what was just asked
- Fake transitions: *"Let's dive in," "Here's the thing," "At the end of the day"*
- Excessive bolding as a substitute for real emphasis
- Numbered lists for non-sequential content
- Bullet-heavy responses where prose would carry it better

### Cadence patterns Distill *does* use
- Short. Then short. Then long enough to land the point and let it breathe.
- The single-line declarative used as a paragraph.
- The italicized aside in editorial serif when a thought needs to soften before the next hard line.
- The all-caps section anchor as a structural device, never as shouting.

---

## 02 / COLOR SYSTEM

### Terminal-Noir palette (default, dark mode)

| Token | Name | Hex | Use |
|---|---|---|---|
| `--bg-primary` | Obsidian | `#0A0E11` | Primary background. All surfaces default here. |
| `--bg-elevated` | Obsidian Raised | `#11161A` | Cards, callouts, elevated panels. |
| `--accent` | Distill Cyan | `#22E0FF` | Headline emphasis, links, CTAs, key terms. |
| `--accent-deep` | Distill Cyan Deep | `#0FB8D6` | Hover states, pressed states, secondary accent. |
| `--accent-soft` | Distill Cyan 12% | `rgba(34, 224, 255, 0.12)` | Callout backgrounds. |
| `--text-primary` | Bone | `#E8ECEE` | Primary body and headline text. |
| `--text-muted` | Ash | `#8A949A` | Secondary text, captions, header marks. |
| `--text-faint` | Char | `#4A535A` | Background numerals, watermark digits, system labels. |
| `--rule` | Hairline | `#1F2629` | Dividers, borders, grid lines. |
| `--warn` | Amber Signal | `#E8B33A` | Reserved. Incident logs, warnings, hard-layer callouts only. |

### Terminal-Blanc palette (light mode inversion)

| Token | Hex | Notes |
|---|---|---|
| `--bg-primary` | `#FFFFFF` | White field. |
| `--bg-elevated` | `#F4F6F7` | Off-white card surface. |
| `--accent` | `#0FB8D6` | Shifts to `--accent-deep` for legibility on light. |
| `--accent-deep` | `#0A8EA8` | Even deeper for hover. |
| `--accent-soft` | `rgba(15, 184, 214, 0.10)` | Soft callout backgrounds. |
| `--text-primary` | `#0A0E11` | Obsidian text on white. |
| `--text-muted` | `#5A646A` | Ash on light. |
| `--text-faint` | `#B8C0C5` | Background numerals on light. |
| `--rule` | `#D8DEE2` | Light dividers. |
| `--warn` | `#B8841F` | Amber, deeper for light. |

### Color logic
- **One accent at a time.** Cyan does emphasis. Amber does warnings. Never mix in a single component.
- **No gradients.** Solid fills only. Terminal-noir depends on flat surfaces.
- **No overlay tints on imagery** unless the image is a system component.
- **Accent rule of one-third.** No more than ~30% of any visible composition should be accent color. Scarcity is the point.

### Dark-mode-default with toggle
The system ships dark. Every artifact provides a light/dark toggle in the top-right corner. The toggle persists user preference via `localStorage`.

---

## 03 / TYPOGRAPHY

### Type stack

| Role | Family | Fallback | Use |
|---|---|---|---|
| **Display** | Inter Tight (700–900) | Helvetica Now Display, system-ui sans | Hero headlines. Tight tracking, oversize. |
| **Body** | Inter (400–600) | system-ui, -apple-system, Helvetica, sans-serif | All body, UI, captions. |
| **Editorial Italic** | Source Serif 4 Italic (400) | Georgia Italic, serif | Pull-quotes, asides, voice moments. |
| **Mono** | JetBrains Mono (400–500) | "SF Mono", Menlo, Consolas, monospace | Terminal cues, page marks, code, system labels, captions in caps. |

### Type scale

| Token | rem | px | Family | Weight | Tracking | Line-height |
|---|---|---|---|---|---|---|
| `display-xl` | 5.5 | 88 | Inter Tight | 800 | -0.02em | 0.95 |
| `display-lg` | 4.0 | 64 | Inter Tight | 800 | -0.02em | 0.98 |
| `display-md` | 3.0 | 48 | Inter Tight | 800 | -0.015em | 1.02 |
| `headline-lg` | 2.0 | 32 | Inter Tight | 700 | -0.01em | 1.1 |
| `headline-md` | 1.5 | 24 | Inter Tight | 700 | -0.005em | 1.2 |
| `body-lg` | 1.125 | 18 | Inter | 400 | 0 | 1.55 |
| `body-md` | 1.0 | 16 | Inter | 400 | 0 | 1.6 |
| `body-sm` | 0.875 | 14 | Inter | 400 | 0 | 1.55 |
| `editorial-lg` | 1.875 | 30 | Source Serif 4 Italic | 400 | 0 | 1.3 |
| `editorial-md` | 1.25 | 20 | Source Serif 4 Italic | 400 | 0 | 1.4 |
| `mono-md` | 0.8125 | 13 | JetBrains Mono | 400 | 0.08em | 1.4 |
| `mono-sm` | 0.75 | 12 | JetBrains Mono | 500 | 0.12em | 1.4 |
| `mono-xs` | 0.6875 | 11 | JetBrains Mono | 500 | 0.16em | 1.4 |

### Type rules
- Display headlines split two colors: `Bone` for setup, `Distill Cyan` for payoff. The cyan line carries meaning.
- Editorial italic serif only in pull-quotes and short voice asides. Never in headlines. Never longer than 3 lines.
- Mono is always uppercased when used as a label. Letter-spacing increases as size decreases.
- Body copy stays under 65 characters per line.
- Body italic is forbidden for emphasis. Use Distill Cyan inline instead.

---

## 04 / GRID & LAYOUT

### Page architecture
Every Forge long-form surface (questionnaire page, report section) follows this architecture:

```
┌─ TICKMARK ─────────────────── TICKMARK ─┐
│ HEADER MARK                  PAGE MARK  │   ← mono-sm, ash
│ ──────────── HAIRLINE RULE ──────────── │
│                                          │
│  SECTION NUMBER                          │   ← mono-md, accent
│  DISPLAY HEADLINE (BONE)                 │   ← display-lg
│  DISPLAY HEADLINE PAYOFF (CYAN)          │   ← display-lg, accent
│                                          │
│  Body opener. One paragraph max.         │   ← body-lg
│                                          │
│  ┌─ CALLOUT or PULL-QUOTE ─────────────┐ │
│  │  Editorial italic, 1–3 lines        │ │
│  │  — ATTRIBUTION                      │ │
│  └──────────────────────────────────────┘│
│                                          │
│  Continuation paragraph. Carries logic.  │   ← body-md
│                                          │
│  [GIANT BACKGROUND NUMERAL — char tone] │   ← display-xl outline
│                                          │
│ ──────────── HAIRLINE RULE ──────────── │
│ FOOTER MARK · SYSTEM TAG    PAGE MARK   │   ← mono-sm, ash
└─ TICKMARK ─────────────────── TICKMARK ─┘
```

### Grid spec
- **Web (desktop):** 12-column, max content width 1280px, gutter 24px, side padding 64px.
- **Web (tablet):** 8-column, max width 768px, gutter 20px, side padding 32px.
- **Web (mobile):** 4-column, full bleed with 20px side padding.

### The corner tickmarks
Four corner glyphs — small `+` marks in mono, ash tone, sized at `mono-sm`. They frame the page like terminal crop marks. Mandatory on hero sections and section openers; optional on body sections.

### The background numeral
Each section page carries an oversized section number bleeding off the right edge in `--text-faint`. Sized at roughly 60% of the page height. Present, never loud.

### The hairline rules
Two hairline rules per page: one below the header mark, one above the footer mark. Stroke 1px in `--rule`. Structural, not decorative.

### Spacing scale
Multiples of 8. Whole system runs on an 8px baseline.

| Token | Value | Use |
|---|---|---|
| `space-1` | 4px | Inline icon-to-text |
| `space-2` | 8px | Tight grouping |
| `space-3` | 16px | Paragraph spacing |
| `space-4` | 24px | Component internal padding |
| `space-5` | 32px | Section-internal break |
| `space-6` | 48px | Major section spacing |
| `space-7` | 64px | Page-level breathing |
| `space-8` | 96px | Hero zones |

---

## 05 / SYSTEM COMPONENTS

### Page header mark
```
─ 0X / SECTION NAME                                    P. 0X / 0Y
```
Mono-sm, ash tone. Section number in accent. Page mark right-aligned. Hairline rule directly beneath.

### Page footer mark
```
DISTILL          — ITALIC SERIF DESCRIPTOR —          0X / 0Y
```
Mono-sm, ash tone. Editorial italic descriptor in muted center. Hairline rule directly above.

### Section opener block
- Section number in mono accent
- Two-line display headline (line 1 bone, line 2 cyan)
- Body opener paragraph (body-lg)
- Background numeral (display-xl, char tone, right-bleed)

### Pull-quote block
Hairline-rule-bracketed. Editorial italic serif in cyan. Attribution in mono-sm ash, em-spaced uppercase, prefixed with `— `.

### Two-column contrast block (AS-IS / PROPOSED)
The signature comparison frame. Used for before/after. Both columns on `--bg-elevated` with 1px `--rule` border. Left column heading in muted ash, right column heading in cyan accent.

### Component grid (anatomy block)
6-cell grid (3×2) for breakdowns. Each cell is a square card on `--bg-elevated` with `--rule` border. Bracketed mono glyph at top-left in cyan, numeric index top-right in ash, headline in display-md, body-sm description, italic editorial line at bottom in cyan.

### Callout box (KEY MESSAGE)
Full-width, 1px cyan border, `--accent-soft` fill, internal padding `space-4`. Headline in cyan all-caps headline-lg. Supporting paragraph in body-md bone.

### Incident log
Reserved callout variant. Top edge: `INCIDENT LOG` tab in amber. Border in `--rule`. Body uses italic editorial serif for narration, then body-md takeaway. Only place amber appears in body content.

### Habit / step block
Numbered step blocks. Step number in mono cyan small-caps (`01 / The Move`), single-line all-caps headline in bone, body-md description, optional terminal-style example in mono block at bottom.

### Terminal example block
Code-style example zone. `--bg-elevated` fill, mono-md text, `--rule` border.
- `× ` prefix in `--warn` for the wrong example
- `→ ` prefix in cyan for the right example

### CTA block
Full-width cyan filled rectangle. Headline in obsidian (inverted). Body small in obsidian-on-cyan. Single forward arrow link `LABEL →` in mono uppercase.

### Move card (Implementation Plan)
Used for the three Implementation Plan moves in reports. `--bg-elevated` card with 2px top border (cyan / green / purple by sequence position), `mtiming` mono label at top, headline in display-md, body paragraph.

---

## 06 / ICONOGRAPHY & SYMBOLS

### Bracket glyphs
Square brackets enclosing a single technical glyph. Cyan accent, mono family. Section markers and component icons.

Approved glyphs: `[ § ]` `[ ≡ ]` `[ → ]` `[ ·|· ]` `[ </> ]` `[ ≈ ]` `[ ◆ ]` `[ + ]` `[ × ]` `[ // ]`

Typeset, not designed. Custom illustrated icons are off-system.

### Bullet character
`◆` (black diamond) in cyan. Single, system-wide. No round bullets, no checkmarks, no emoji.

### Arrow conventions
- `→` forward direction, sequence, transition
- `▶` play/replay/CTA only
- `↓` `↑` scroll/expand UI
- `>` reserved for code only

---

## 07 / IMAGERY & MEDIA

Forge is typographically driven. Imagery is the exception.

Allowed: high-contrast B&W documentary portraits on deep black; schematic line drawings or wireframes in cyan-on-obsidian; screenshots of real artifacts framed in `--bg-elevated` cards with `--rule` border and mono caption.

Forbidden: stock photography of business people; generic AI/tech aesthetic (glowing brains, circuits, robots, data swirls); soft gradients; lifestyle imagery; color photography that doesn't match the obsidian field.

Caption format: mono-sm uppercase in ash, prefixed `─ FIG. 0X / DESCRIPTOR`.

---

## 08 / MOTION

Terminal motion: type that types itself, rules that draw themselves, panels that snap into place. Never decorative.

| Behavior | Use | Spec |
|---|---|---|
| Type-on | Section titles, key lines | Mono caret-led typing, ~40ms per character, no easing |
| Hairline draw | Rule lines entering | 320ms, ease-out, left-to-right or top-to-bottom |
| Panel snap | Cards entering | 180ms linear, opacity 0→1 + Y translate 8px→0 |
| Numeric counter | Page numbers, stats | 600ms ease-out, increment from 0 |
| Crop-mark settle | Tickmarks anchoring | 240ms ease-out, scale 0.6→1 + opacity 0→1 |
| Cyan flash | Emphasis on key term | 120ms in, 600ms hold, 240ms fade — accent pulse |

Rules: no bounce, no spring, no overshoot, no parallax, no floating elements, no infinite loops except cursor caret (1Hz). 60fps minimum. Page-load animation budget 1.2s. Individual elements cap at 600ms.

---

## 09 / SURFACE-SPECIFIC RULES

### Questionnaire (HTML artifact)
- Multipage flow with progress indicator (mono-sm `0X / 0Y` top-right)
- Page transitions: `panel snap` only
- Email gate on Page 1, terminal-style input with caret blink
- Auto-save to localStorage between pages
- Submit triggers BCD generation in-browser, shows Download button + drop instruction
- Light/dark toggle top-right on every page

### Intelligence Report (HTML artifact)
- Six-section MBB-derived structure (see `references/report-structure.md`)
- Section openers follow §05 block
- Mermaid diagrams use `Mermaid Theme` block below
- Two-column contrast block for AS-IS / PROPOSED
- Move cards for Implementation Plan
- Appendix collapsible by default
- Light/dark toggle top-right
- Fully self-contained HTML (inline CSS + JS, only Google Fonts external)

---

## 10 / TOKENS (COPY-PASTE READY)

### CSS variables (dark mode default)
```css
:root {
  --bg-primary: #0A0E11;
  --bg-elevated: #11161A;
  --accent: #22E0FF;
  --accent-deep: #0FB8D6;
  --accent-soft: rgba(34, 224, 255, 0.12);
  --text-primary: #E8ECEE;
  --text-muted: #8A949A;
  --text-faint: #4A535A;
  --rule: #1F2629;
  --warn: #E8B33A;

  --font-display: "Inter Tight", "Helvetica Now Display", system-ui, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, Helvetica, sans-serif;
  --font-italic: "Source Serif 4", Georgia, serif;
  --font-mono: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;

  --space-1: 4px;  --space-2: 8px;  --space-3: 16px;  --space-4: 24px;
  --space-5: 32px; --space-6: 48px; --space-7: 64px;  --space-8: 96px;

  --radius-card: 12px;
  --rule-stroke: 1px;
}

[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-elevated: #F4F6F7;
  --accent: #0FB8D6;
  --accent-deep: #0A8EA8;
  --accent-soft: rgba(15, 184, 214, 0.10);
  --text-primary: #0A0E11;
  --text-muted: #5A646A;
  --text-faint: #B8C0C5;
  --rule: #D8DEE2;
  --warn: #B8841F;
}
```

### Theme toggle (drop into every artifact)
```html
<button id="theme-toggle" aria-label="Toggle theme">[ ◑ ]</button>
<script>
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('forge-theme');
  if (stored === 'light') document.documentElement.setAttribute('data-theme', 'light');
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('forge-theme', next);
  });
</script>
```

---

## 11 / MERMAID THEME

Inject into every artifact that renders Mermaid diagrams:

```html
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  const isDark = !document.documentElement.hasAttribute('data-theme') ||
                  document.documentElement.getAttribute('data-theme') !== 'light';
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
</script>
```

---

## 12 / GOVERNANCE

This file lives at `forge-v1/references/DESIGN.md`. Every Forge artifact must reference and conform to it.

When a new pattern emerges:
1. Build it once for the artifact at hand
2. If it appears a second time, propose it as a system addition
3. Only after the third use does it enter `DESIGN.md`

The system stays small on purpose. Restraint is the brand.

---

*Distill — A clear plan for your business, backed by market data.*
