// netlify/functions/submission-created.js
//
// Fires automatically on every successful Netlify Forms submission.
// Sends two emails via Resend and commits the BCD to a private GitHub repo:
//   1. Applicant confirmation — BCD attached, report timeline set.
//   2. Facilitator notification — same BCD attached, ready to drop into /forge:optimize.
//   3. GitHub mirror — BCD committed to forge-workshops repo as submissions/TIMESTAMP-SLUG.md.
//
// Required environment variables (set in Netlify dashboard):
//   RESEND_API_KEY  — API key from resend.com
//
// Optional:
//   FROM_ADDRESS           — defaults to onboarding@resend.dev. Set to a verified domain address
//                            once builderbranding.co is verified in Resend.
//   FACILITATOR_EMAIL      — defaults to wisedesign.live@gmail.com.
//   GITHUB_TOKEN           — fine-grained PAT with Contents R/W on the workshops repo.
//                            Without this, the GitHub mirror step is silently skipped.
//   GITHUB_WORKSHOPS_REPO  — owner/repo slug, defaults to skizzy203/forge-workshops.

const { Resend } = require('resend');

const FROM_ADDRESS           = process.env.FROM_ADDRESS           || 'Forge Intake <onboarding@resend.dev>';
const FACILITATOR_EMAIL      = process.env.FACILITATOR_EMAIL      || 'wisedesign.live@gmail.com';
const GITHUB_WORKSHOPS_REPO  = process.env.GITHUB_WORKSHOPS_REPO  || 'skizzy203/forge-workshops';

async function commitBCDToGitHub(slug, bcdMarkdown, businessName, submittedAt) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('[submission-created] GITHUB_TOKEN not set — skipping GitHub mirror');
    return;
  }

  const date = submittedAt.toISOString().slice(0, 10);
  const timeCompact = submittedAt.toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const path = `submissions/${timeCompact}-${slug}.md`;

  const resp = await fetch(`https://api.github.com/repos/${GITHUB_WORKSHOPS_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization:        `Bearer ${token}`,
      'Content-Type':       'application/json',
      Accept:               'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      message:   `intake: ${businessName} — ${date}`,
      content:   Buffer.from(bcdMarkdown, 'utf-8').toString('base64'),
      committer: { name: 'Forge Intake', email: 'intake@builderbranding.co' },
    }),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    console.error('[submission-created] GitHub mirror failed:', resp.status, body.slice(0, 200));
    return;
  }
  const result = await resp.json().catch(() => ({}));
  console.log('[submission-created] BCD mirrored to GitHub:', result.content?.html_url || path);
}

exports.handler = async function (event) {
  // Netlify Forms POSTs the submission payload as JSON to this function on every
  // successful form submission. The function's name (submission-created) is the trigger.
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    console.error('[submission-created] payload not JSON:', err.message);
    return { statusCode: 400, body: 'Invalid JSON payload' };
  }

  // Netlify wraps the form data in payload.payload.data. Defensive lookup.
  const data = (payload && payload.payload && payload.payload.data) || payload.data || {};

  const applicantEmail = (data.email || '').trim();
  const applicantName  = (data.applicant_name || 'there').trim();
  const businessName   = (data.business_name || 'your business').trim();
  const phase          = (data.phase || '').trim();
  const phaseLabel     = (data.phase_label || phase || '').trim();
  const bcdMarkdown    = data.bcd_markdown || '';
  const forgeVersion   = (data.forge_version || '').trim();

  if (!applicantEmail) {
    console.warn('[submission-created] no applicant email — skipping confirmation send');
    return { statusCode: 200, body: 'Skipped (no email)' };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[submission-created] RESEND_API_KEY env var not set');
    return { statusCode: 500, body: 'Email service not configured' };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject = `Forge intake received — ${businessName}`;

  const textBody = [
    `Hi ${applicantName},`,
    '',
    `Your Forge Business Context Document for ${businessName} has been received.`,
    phaseLabel ? `Phase selected: ${phaseLabel}` : '',
    '',
    'Your intelligence report will be prepared in the next workshop slot and emailed back to you once ready. Reports cover current state, optimization analysis, proposed redesign, a three-move implementation plan, three-year revenue projections, and a Steelman / Strawman / Pre-Mortem pressure test.',
    '',
    'Your BCD is attached as a markdown file. Save it for reference, or to re-run the analysis later.',
    '',
    'In the meantime, take a look at a sample report:',
    'https://intake.builderbranding.co/examples/mechanical-magic.html',
    '',
    '— Forge / Builder Branding Co.',
    forgeVersion ? `(Generated by Forge ${forgeVersion})` : ''
  ].filter(Boolean).join('\n');

  const filename = `forge-bcd-${(businessName || 'business').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'business'}.md`;

  try {
    const { data: sent, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [applicantEmail],
      subject,
      text: textBody,
      attachments: [
        {
          filename,
          content: Buffer.from(bcdMarkdown, 'utf-8').toString('base64')
        }
      ]
    });

    if (error) {
      console.error('[submission-created] Resend error:', error);
      return { statusCode: 502, body: 'Email send failed: ' + (error.message || 'unknown') };
    }

    console.log('[submission-created] confirmation sent to', applicantEmail, '— id:', sent && sent.id);

    // Facilitator notification — non-blocking. A failure here does not affect the applicant
    // confirmation or the 200 response.
    const facilitatorSubject = `[Forge intake] ${businessName}${phaseLabel ? ' — ' + phaseLabel : ''}`;
    const facilitatorBody = [
      `New intake submission via Forge.`,
      '',
      `Business:  ${businessName}`,
      `Operator:  ${applicantName} <${applicantEmail}>`,
      phaseLabel ? `Phase:     ${phaseLabel}` : '',
      `Date:      ${new Date().toISOString().slice(0, 10)}`,
      forgeVersion ? `Version:   ${forgeVersion}` : '',
      '',
      'BCD is attached. Run /forge:optimize with the attached file to begin analysis.',
    ].filter(Boolean).join('\n');

    try {
      const { error: fErr } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: [FACILITATOR_EMAIL],
        subject: facilitatorSubject,
        text: facilitatorBody,
        attachments: [{ filename, content: Buffer.from(bcdMarkdown, 'utf-8').toString('base64') }]
      });
      if (fErr) {
        console.error('[submission-created] facilitator notification failed:', fErr);
      } else {
        console.log('[submission-created] facilitator notification sent to', FACILITATOR_EMAIL);
      }
    } catch (fErr) {
      console.error('[submission-created] facilitator notification error:', fErr.message);
    }

    // GitHub mirror — non-blocking. Failure logs but does not affect the 200 response.
    try {
      const slug = (businessName || 'business').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'business';
      await commitBCDToGitHub(slug, bcdMarkdown, businessName, new Date());
    } catch (gErr) {
      console.error('[submission-created] GitHub mirror error:', gErr.message);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: sent && sent.id })
    };
  } catch (err) {
    console.error('[submission-created] unexpected error:', err);
    return { statusCode: 500, body: 'Function error: ' + err.message };
  }
};
