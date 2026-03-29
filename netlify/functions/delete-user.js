// DELETE /api/delete-user — admin only
// Body: { userId }
const { requireAdmin } = require('./_admin-auth');

exports.handler = async (event, context) => {
  const headers = { 'Content-Type': 'application/json' };
  if (event.httpMethod !== 'DELETE') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const auth = requireAdmin(context);
  if (auth.error) return { statusCode: auth.status, headers, body: JSON.stringify({ error: auth.error }) };

  const { userId } = JSON.parse(event.body || '{}');
  if (!userId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId is required' }) };

  if (userId === auth.user.sub) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'You cannot delete your own account' }) };
  }

  const siteUrl = process.env.URL;
  const incomingAuth = event.headers.authorization || event.headers.Authorization || '';

  const res = await fetch(`${siteUrl}/.netlify/identity/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: incomingAuth },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { statusCode: res.status, headers, body: JSON.stringify({ error: data.msg || 'Failed to delete user' }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
};
