// netlify/functions/dashboard-data.js
//
// Proxies Netlify Forms submission data + optimize session metrics to the /dashboard page.
// Requires a passphrase so the endpoint is not world-readable.
//
// Required environment variables (set in Netlify dashboard):
//   NETLIFY_ACCESS_TOKEN  — personal access token from app.netlify.com/user/applications
//                           (read:sites and read:forms scopes are sufficient)
//   NETLIFY_SITE_ID       — site ID from forge-intake Project settings > General
//   DASHBOARD_PASSPHRASE  — arbitrary passphrase set by the operator
//   GITHUB_TOKEN          — same fine-grained PAT used by submission-created / log-session
//   GITHUB_WORKSHOPS_REPO — defaults to skizzy203/forge-workshops

async function fetchSessions(token) {
  const repo = process.env.GITHUB_WORKSHOPS_REPO || 'skizzy203/forge-workshops';
  const resp = await fetch(`https://api.github.com/repos/${repo}/contents/sessions/index.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (resp.status === 404) return [];
  if (!resp.ok) throw new Error(`GitHub sessions fetch ${resp.status}`);
  const data = await resp.json();
  return JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
}

exports.handler = async function (event) {
  const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
  const NETLIFY_SITE_ID      = process.env.NETLIFY_SITE_ID;
  const DASHBOARD_PASSPHRASE = process.env.DASHBOARD_PASSPHRASE;

  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'x-dashboard-key',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (!DASHBOARD_PASSPHRASE) {
    return { statusCode: 503, headers: corsHeaders, body: JSON.stringify({ error: 'Dashboard not configured — DASHBOARD_PASSPHRASE env var not set' }) };
  }

  const provided = (
    event.headers['x-dashboard-key'] ||
    (event.queryStringParameters && event.queryStringParameters.key) ||
    ''
  ).trim();

  if (provided !== DASHBOARD_PASSPHRASE) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  if (!NETLIFY_ACCESS_TOKEN || !NETLIFY_SITE_ID) {
    return { statusCode: 503, headers: corsHeaders, body: JSON.stringify({ error: 'Dashboard not configured — NETLIFY_ACCESS_TOKEN or NETLIFY_SITE_ID env var not set' }) };
  }

  try {
    const resp = await fetch(
      `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/submissions?per_page=200`,
      { headers: { Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}` } }
    );

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      console.error('[dashboard-data] Netlify API error:', resp.status, text.slice(0, 200));
      return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: 'Netlify API error', status: resp.status }) };
    }

    const submissions = await resp.json();

    // Return only the fields needed by the dashboard — avoids sending raw form data unnecessarily
    const rows = submissions.map(s => ({
      id:            s.id,
      created_at:    s.created_at,
      business_name: s.data && s.data.business_name,
      applicant_name: s.data && s.data.applicant_name,
      email:         s.data && s.data.email,
      phase:         s.data && s.data.phase,
      phase_label:   s.data && s.data.phase_label,
      forge_version: s.data && s.data.forge_version,
    }));

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const sessions = GITHUB_TOKEN
      ? await fetchSessions(GITHUB_TOKEN).catch(err => {
          console.warn('[dashboard-data] sessions fetch failed:', err.message);
          return [];
        })
      : [];

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: rows.length, submissions: rows, sessions }),
    };
  } catch (err) {
    console.error('[dashboard-data] unexpected error:', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Function error: ' + err.message }) };
  }
};
