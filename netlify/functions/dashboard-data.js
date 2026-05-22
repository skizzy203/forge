// netlify/functions/dashboard-data.js
//
// Proxies Netlify Forms submission data to the /dashboard analytics page.
// Requires a passphrase so the endpoint is not world-readable.
//
// Required environment variables (set in Netlify dashboard):
//   NETLIFY_ACCESS_TOKEN  — personal access token from app.netlify.com/user/applications
//                           (read:sites and read:forms scopes are sufficient)
//   NETLIFY_SITE_ID       — site ID from forge-intake Project settings > General
//   DASHBOARD_PASSPHRASE  — arbitrary passphrase set by the operator; the dashboard
//                           page prompts for this before making API calls

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

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: rows.length, submissions: rows }),
    };
  } catch (err) {
    console.error('[dashboard-data] unexpected error:', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Function error: ' + err.message }) };
  }
};
