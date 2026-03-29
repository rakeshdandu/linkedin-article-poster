// Temporary debug endpoint — DELETE after fixing
exports.handler = async (event, context) => {
  const siteUrl = process.env.URL;
  const incomingAuth = event.headers.authorization || event.headers.Authorization || '';
  const results = {};

  // Decode JWT payload
  try {
    const token = incomingAuth.replace('Bearer ', '');
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    results.jwtPayload = payload;
  } catch (e) { results.jwtPayload = { error: e.message }; }

  // Try GoTrue admin API with user JWT
  try {
    const r = await fetch(`${siteUrl}/.netlify/identity/admin/users`, {
      headers: { Authorization: incomingAuth },
    });
    results.gotrueAdmin = { status: r.status, body: await r.text() };
  } catch (e) { results.gotrueAdmin = { error: e.message }; }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results, null, 2),
  };
};
