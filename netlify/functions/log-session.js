// netlify/functions/log-session.js
//
// Receives session metrics from the /forge:optimize skill after report generation.
// Appends one session record to sessions/index.json in the forge-workshops GitHub repo.
// Called by the skill non-blockingly after writing the HTML report to disk.
//
// Required environment variables:
//   LOG_SESSION_KEY       — shared secret the skill sends in x-session-key header
//   GITHUB_TOKEN          — fine-grained PAT with Contents R/W on forge-workshops
//   GITHUB_WORKSHOPS_REPO — defaults to skizzy203/forge-workshops

const SESSIONS_PATH = 'sessions/index.json';

async function readSessions(token, repo) {
  const resp = await fetch(`https://api.github.com/repos/${repo}/contents/${SESSIONS_PATH}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (resp.status === 404) return { sessions: [], sha: null };
  if (!resp.ok) throw new Error(`GitHub GET ${resp.status}`);
  const data = await resp.json();
  return {
    sessions: JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')),
    sha: data.sha,
  };
}

async function writeSessions(token, repo, sessions, sha) {
  const last = sessions[sessions.length - 1];
  const body = {
    message: `log-session: ${last?.business_name || 'unknown'} (${last?.phase || '?'})`,
    content: Buffer.from(JSON.stringify(sessions, null, 2), 'utf-8').toString('base64'),
    committer: { name: 'Forge Intake', email: 'intake@builderbranding.co' },
  };
  if (sha) body.sha = sha;

  const resp = await fetch(`https://api.github.com/repos/${repo}/contents/${SESSIONS_PATH}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`GitHub PUT ${resp.status}: ${text.slice(0, 200)}`);
  }
}

exports.handler = async function (event) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'x-session-key, Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };

  const LOG_SESSION_KEY = process.env.LOG_SESSION_KEY;
  if (!LOG_SESSION_KEY) {
    return { statusCode: 503, headers: corsHeaders, body: JSON.stringify({ error: 'LOG_SESSION_KEY not configured' }) };
  }

  const providedKey = (event.headers['x-session-key'] || '').trim();
  if (providedKey !== LOG_SESSION_KEY) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return { statusCode: 503, headers: corsHeaders, body: JSON.stringify({ error: 'GITHUB_TOKEN not configured' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  for (const field of ['session_id', 'business_name', 'phase']) {
    if (!payload[field]) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: `Missing required field: ${field}` }) };
    }
  }

  const repo = process.env.GITHUB_WORKSHOPS_REPO || 'skizzy203/forge-workshops';

  try {
    const { sessions, sha } = await readSessions(GITHUB_TOKEN, repo);

    sessions.push({
      session_id:               String(payload.session_id),
      logged_at:                new Date().toISOString(),
      business_name:            String(payload.business_name),
      phase:                    String(payload.phase).toUpperCase(),
      models_fired:             Array.isArray(payload.models_fired) ? payload.models_fired.map(String) : [],
      revenue_current_midpoint: Number(payload.revenue_current_midpoint) || 0,
      revenue_y3_low:           Number(payload.revenue_y3_low) || 0,
      revenue_y3_high:          Number(payload.revenue_y3_high) || 0,
    });

    await writeSessions(GITHUB_TOKEN, repo, sessions, sha);

    console.log(`[log-session] Logged session for ${payload.business_name} — ${sessions.length} total`);
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, total: sessions.length }),
    };
  } catch (err) {
    console.error('[log-session] error:', err.message);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
