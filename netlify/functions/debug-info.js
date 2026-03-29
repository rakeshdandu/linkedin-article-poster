// Temporary debug endpoint — DELETE after fixing
// Call this from admin panel JS, not directly in browser
exports.handler = async (event, context) => {
  const siteUrl = process.env.URL;
  const incomingAuth = event.headers.authorization || event.headers.Authorization || '';
  const results = { incomingAuthPresent: !!incomingAuth, incomingAuthPrefix: incomingAuth.substring(0, 20) };

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
