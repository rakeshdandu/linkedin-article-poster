// POST /api/create-user — admin only
// Body: { email, password, fullName, role }
const { requireAdmin } = require('./_admin-auth');

exports.handler = async (event, context) => {
  const headers = { 'Content-Type': 'application/json' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const auth = requireAdmin(context);
  if (auth.error) return { statusCode: auth.status, headers, body: JSON.stringify({ error: auth.error }) };

  const { email, password, fullName, role = 'user' } = JSON.parse(event.body || '{}');
  if (!email || !password) return { statusCode: 400, headers, body: JSON.stringify({ error: 'email and password are required' }) };
  if (!['user', 'admin'].includes(role)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'role must be user or admin' }) };

  const siteUrl = process.env.URL;
  const incomingAuth = event.headers.authorization || event.headers.Authorization || '';

  const res = await fetch(`${siteUrl}/.netlify/identity/admin/users`, {
    method: 'POST',
    headers: { Authorization: incomingAuth, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      confirm: true,
      user_metadata: { full_name: fullName || email.split('@')[0] },
      app_metadata: { roles: [role] },
    }),
  });

  const data = await res.json();
  if (!res.ok) return { statusCode: res.status, headers, body: JSON.stringify({ error: data.msg || 'Failed to create user' }) };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ id: data.id, email: data.email, name: data.user_metadata?.full_name, role }),
  };
};
