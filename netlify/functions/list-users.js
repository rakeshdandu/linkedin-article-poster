// GET /api/list-users — admin only
const { requireAdmin, netlifyApiHeaders, identityUrl } = require('./_admin-auth');

exports.handler = async (event, context) => {
  const headers = { 'Content-Type': 'application/json' };
  const auth = requireAdmin(context);
  if (auth.error) return { statusCode: auth.status, headers, body: JSON.stringify({ error: auth.error }) };

  const res = await fetch(`${identityUrl()}/users?per_page=100`, {
    headers: netlifyApiHeaders(),
  });
  const data = await res.json();
  if (!res.ok) return { statusCode: res.status, headers, body: JSON.stringify({ error: data.msg || data.error || JSON.stringify(data), siteId: process.env.SITE_ID, hasToken: !!process.env.NETLIFY_ACCESS_TOKEN }) };

  const users = (data.users || []).map(u => ({
    id:        u.id,
    email:     u.email,
    name:      u.user_metadata?.full_name || u.email.split('@')[0],
    role:      u.app_metadata?.roles?.includes('admin') ? 'admin' : 'user',
    createdAt: u.created_at,
    lastLogin: u.last_sign_in_at || null,
    confirmed: !!u.confirmed_at,
  }));

  return { statusCode: 200, headers, body: JSON.stringify({ users }) };
};
