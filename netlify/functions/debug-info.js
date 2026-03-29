// Temporary debug endpoint — DELETE after fixing
exports.handler = async (event, context) => {
  const siteId = process.env.SITE_ID;
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  const siteUrl = process.env.URL;
  const results = {};

  // Test 1: Netlify API — get identity instance info
  try {
    const r = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/identity`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    results.netlifyIdentityInstance = { status: r.status, body: await r.text() };
  } catch (e) { results.netlifyIdentityInstance = { error: e.message }; }

  // Test 2: GoTrue admin API at site URL with personal access token
  try {
    const r = await fetch(`${siteUrl}/.netlify/identity/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    results.gotrueWithAccessToken = { status: r.status, body: await r.text() };
  } catch (e) { results.gotrueWithAccessToken = { error: e.message }; }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results, null, 2),
  };
};
