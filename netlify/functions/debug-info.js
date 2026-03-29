// Temporary debug endpoint — DELETE after fixing
exports.handler = async (event, context) => {
  const siteId = process.env.SITE_ID;
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  const results = {};

  // Try getting site details — may include identity config / JWT secret
  try {
    const r = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await r.json();
    // Extract only identity-related fields to keep response small
    results.siteInfo = {
      status: r.status,
      id: data.id,
      name: data.name,
      identity_instance_id: data.identity_instance_id,
      use_envelope: data.use_envelope,
      capabilities: data.capabilities,
    };
  } catch (e) { results.siteInfo = { error: e.message }; }

  // Try identity instance directly
  try {
    const r = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/identity`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    results.identityDirect = { status: r.status, body: await r.text() };
  } catch (e) { results.identityDirect = { error: e.message }; }

  // Try with site name instead of UUID
  try {
    const r = await fetch(`https://api.netlify.com/api/v1/sites/skillionedge-lap.netlify.app/identity/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    results.identityBySiteName = { status: r.status, body: await r.text() };
  } catch (e) { results.identityBySiteName = { error: e.message }; }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results, null, 2),
  };
};
