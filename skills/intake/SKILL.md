---
name: intake
description: Generates an email-gated multipage HTML questionnaire artifact that collects business context from a workshop applicant. The form outputs a Business Context Document (BCD) as a Markdown file when submitted. Use when starting a Forge engagement, distributing intake to a new applicant, or whenever a fresh BCD is needed.
when_to_use: >
  Use when the user says: "create the intake form", "new applicant", "send the questionnaire",
  "generate the BCD form", "start a new workshop intake", "I need the form", or any request
  to onboard a business owner into the Forge process.
disable-model-invocation: false
allowed-tools: Read Write
---

# Intake — Forge Questionnaire Generator

This skill emits a self-contained HTML questionnaire artifact. Distribute it to a workshop applicant (host it, email it, hand it over on USB). The applicant fills it out, the form generates a Business Context Document (BCD) as Markdown, the applicant downloads it and saves it to `~/forge-intake/` (or wherever the optimize skill is configured to watch).

## What you do

1. Read the template at `${CLAUDE_SKILL_DIR}/templates/questionnaire.html`. It is a complete, self-contained HTML file with inline CSS, inline JavaScript, and only one external dependency (Google Fonts).

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
2. **Download BCD.** Saves the file locally. The applicant can then drop it into `~/forge-intake/` (the SessionStart hook surfaces pending BCDs the next time Claude Code starts) or upload it to Cowork / Claude Code and run `/optimize` themselves.
3. **Copy to Clipboard.** Lets the applicant paste the full BCD into any channel — Slack DM, Notion, an email body, an issue tracker.

Facilitator-side: after a BCD arrives via any of the three paths, run `/optimize <path-to-bcd>` (or just `/optimize` to pick up the most recent file in `~/forge-intake/`).
