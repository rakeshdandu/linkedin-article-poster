// Shared helper — verifies the caller has admin role
// and provides Netlify Identity API access via personal access token

function requireAdmin(context) {
  const { user } = context.clientContext || {};
  if (!user) return { error: 'Not authenticated', status: 401 };

  // Primary: check ADMIN_EMAILS env var (bypasses JWT caching)
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  if (adminEmails.includes((user.email || '').toLowerCase())) {
    return { user };
  }

  // Fallback: check JWT claims
  const appMeta = user.app_metadata || {};
  const roles = [...(appMeta.roles || []), ...(appMeta.authorization?.roles || [])].map(r => r.toLowerCase());
  if (!roles.includes('admin')) return { error: 'Admin access required', status: 403 };
  return { user };
}

function netlifyApiHeaders() {
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  if (!token) throw new Error('NETLIFY_ACCESS_TOKEN env var not set');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Site ID is automatically available in Netlify Functions
const siteId = () => process.env.SITE_ID;
const identityUrl = () => `https://api.netlify.com/api/v1/sites/${siteId()}/identity`;

module.exports = { requireAdmin, netlifyApiHeaders, identityUrl };
