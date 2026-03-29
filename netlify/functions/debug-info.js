// Temporary debug endpoint — DELETE after fixing
exports.handler = async (event, context) => {
  const siteUrl = process.env.URL;
  const results = {};

  // Forward the admin user's own bearer token to GoTrue admin API
  // Netlify's custom GoTrue may accept admin user JWTs for admin endpoints
  const incomingAuth = event.headers.authorization || event.headers.Authorization || '';

  try {
    const r = await fetch(`${siteUrl}/.netlify/identity/admin/users`, {
      headers: { Authorization: incomingAuth },
    });
    results.gotrueWithUserJwt = { status: r.status, body: await r.text() };
  } catch (e) { results.gotrueWithUserJwt = { error: e.message }; }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results, null, 2),
  };
};
