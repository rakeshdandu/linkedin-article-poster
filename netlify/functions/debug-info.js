// Temporary debug endpoint — DELETE after fixing
exports.handler = async (event, context) => {
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  const instanceId = '69c83bcecc2403f76b57b923';
  const results = {};

  // Try Netlify identity instance API with instance ID
  const bases = [
    `https://api.netlify.com/api/v1/identity/${instanceId}/users`,
    `https://api.netlify.com/api/v1/identity-instances/${instanceId}/users`,
    `https://api.netlify.com/api/v1/sites/${instanceId}/identity/users`,
  ];

  for (const url of bases) {
    try {
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      results[url] = { status: r.status, body: await r.text() };
    } catch (e) { results[url] = { error: e.message }; }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results, null, 2),
  };
};
