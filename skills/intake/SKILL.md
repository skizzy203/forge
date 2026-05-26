---
name: intake
description: |
  INTERNAL HELPER — invoked by `/forge:optimize` (Mode C) when a facilitator needs a customized
  intake form. Not the default entry point. The standard operator workflow uses the hosted form
  at https://skizzy203.github.io/forge/ and the single `/forge:optimize` command. This skill
  exists for three facilitator-specific cases only: (1) per-workshop customization (different
  FACILITATOR_EMAIL, workshop name, branding line); (2) offline distribution (operator has no
  internet or the hosted URL is unreachable); (3) self-hosted variants (facilitator wants to
  host the form on their own domain).
when_to_use: >
  Auto-invoked by /forge:optimize when the operator's intent matches facilitator customization.
  Trigger phrases include: "custom intake form", "customize the questionnaire", "my workshop
  email is X", "white-label the form", "branded version for [client]", "offline copy of the
  form", "the hosted URL is down", "I need to email the form myself", "host the form on my
  own domain". Do not invoke this skill for routine BCD processing (that is /forge:optimize
  Mode A). Do not invoke when an operator simply wants to fill out the form (point them to
  the hosted URL via /forge:optimize Mode B).
disable-model-invocation: false
allowed-tools: Read Write
---

# Intake — Internal Customization Helper

> **This is an internal sub-skill.** The default Forge workflow uses the hosted form at
> https://skizzy203.github.io/forge/ and `/forge:optimize` as the single operator-facing
> command. This skill is invoked automatically by `/forge:optimize` Mode C when facilitator
> customization intent is detected. End-users should not need to interact with it directly.

This skill emits a customized self-contained HTML questionnaire artifact for facilitators who need a per-workshop variant of the form (different routing email, workshop branding, offline distribution). Distribute the resulting file by hosting on the facilitator's own domain, emailing to applicants, or handing over on USB. The applicant fills it out, the form generates a Business Context Document (BCD) as Markdown, the applicant downloads it and saves it to `~/forge-intake/` (or pastes it into a Claude Code conversation, which auto-triggers `/forge:optimize` Mode A).

## What you do

1. Read the template at `${CLAUDE_SKILL_DIR}/templates/questionnaire.html`. It is a complete, self-contained HTML file with inline CSS, inline JavaScript, and only one external dependency (Google Fonts).

   **Template variant.** A parallel `${CLAUDE_SKILL_DIR}/templates/questionnaire-pulsedesk.html` exists with the same form fields, validation, BCD generation, conditional reveal logic, and `FACILITATOR_EMAIL` constant — only the visual language differs (softer modern SaaS aesthetic: Plus Jakarta Sans, pill buttons, mint-cyan glass cards, dark-only). Use it when the operator asks for the "Pulsedesk template", "the new template", "the modern intake", "the SaaS variant", or otherwise references the Pulsedesk look. Default to `questionnaire.html` otherwise. Customization steps below apply identically to either file.

2. **Set the facilitator email.** Near the top of the `<script>` block the template has a `FACILITATOR_EMAIL` constant set to a placeholder (`'facilitator@distill.local'`). Replace it with the actual email of the workshop facilitator distributing this form — that's the address the "Email to Facilitator" button mails BCDs to. If the user hasn't given you their email, ask once before emitting the form (this is the only piece you cannot reasonably default). Also update `FACILITATOR_LABEL` if they want a custom display name in the subject line.

3. If the user has asked for any additional customization (workshop name, branding line, custom welcome copy), apply those edits to the template.

4. Write the customized HTML to the working directory as `forge-intake-form.html` (or a user-specified filename).

5. Tell the user:
   - Where the file was written
   - The facilitator email that was wired into the form
   - How to use it: open in a browser, share the URL if hosted, or distribute the file
   - That applicants get three submission options: Email to Facilitator (mailto), Download BCD (save locally), Copy to Clipboard (paste anywhere)
   - That dropping the BCD into `~/forge-intake/` triggers a SessionStart notice via the `hooks/auto-detect-bcd.json` hook. **Important — the hook is not real-time.** It fires at SessionStart only, because Claude Code does not currently support filesystem-watch events. A BCD dropped while Claude Code is closed will be surfaced the next time it opens. Workshop applicants should be told to expect their report on the facilitator's next working session, not within minutes of submitting.

## Form structure (7 pages)

Page 1 — Welcome + email gate
Page 2 — Business basics (what it does, revenue model, customer, biggest problem)
Page 3 — The numbers (revenue, gross margin, customer count, execution capacity)
Page 4 — Problem & history (what's been tried, current edge, winning condition)
Page 5 — Position & constraints (adaptive based on prior answers)
Page 6 — Operator Edge (background, expertise, cross-domain depth, credibility, contrarian belief)
Page 7 — Hypothesis + submit (margin/share lever hypothesis)

Each page has a progress indicator, Back/Next navigation, auto-save to localStorage. Light/dark toggle top-right.

## Design compliance

The template conforms to `references/DESIGN.md` (terminal-noir + terminal-blanc). Do not introduce deviations. If the user requests a custom color or font, redirect them: the brand system is the brand system.

## After submission

The form generates BCD Markdown in-browser, then offers three parallel delivery paths the applicant can pick from:

1. **Email to Facilitator (primary CTA).** Opens the applicant's default mail client with a pre-populated subject and body addressed to `FACILITATOR_EMAIL`. The download is also auto-triggered so the applicant can attach the .bcd.md file. If the BCD is short, the content is also pasted inline as a fallback for clients that strip attachments.
2. **Download BCD.** Saves the file locally. The applicant can then drop it into `~/forge-intake/` (the SessionStart hook surfaces pending BCDs the next time Claude Code starts) or paste it into Cowork / Claude Code where `/forge:optimize` Mode A auto-fires on detection.
3. **Copy to Clipboard.** Lets the applicant paste the full BCD into any channel — Slack DM, Notion, an email body, an issue tracker.

Facilitator-side: once a BCD arrives via any of the three paths, the model auto-invokes `/forge:optimize` Mode A. If invocation does not auto-fire (rare), saying "optimize this" or "/forge:optimize" with the BCD in scope is enough.
