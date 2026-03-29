// GET /api/me — returns current user's profile + role
exports.handler = async (event, context) => {
  const headers = { 'Content-Type': 'application/json' };
  const { user } = context.clientContext || {};

  if (!user) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Not authenticated' }) };
  }

  // Primary: check ADMIN_EMAILS env var (comma-separated, e.g. "a@b.com,c@d.com")
  // This bypasses JWT caching issues entirely
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  let isAdmin = adminEmails.includes((user.email || '').toLowerCase());

  // Fallback: check JWT claims (may be stale)
  if (!isAdmin) {
    const roles = [
      ...(user.app_metadata?.roles || []),
      ...(user.app_metadata?.authorization?.roles || []),
    ];
    isAdmin = roles.includes('admin');
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      id:    user.sub,
      email: user.email,
      name:  user.user_metadata?.full_name || user.email.split('@')[0],
      role:  isAdmin ? 'admin' : 'user',
    }),
  };
};
