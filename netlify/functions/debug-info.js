// Temporary debug endpoint — DELETE after fixing
exports.handler = async (event, context) => {
  const { user } = context.clientContext || {};
  const siteId = process.env.SITE_ID;
  const hasToken = !!process.env.NETLIFY_ACCESS_TOKEN;
  const siteUrl = process.env.URL;

  // Try the identity API and return the raw response
  let apiResult = null;
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/identity/users?per_page=3`, {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const text = await res.text();
    apiResult = { status: res.status, body: text };
  } catch (e) {
    apiResult = { error: e.message };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ siteId, hasToken, siteUrl, userEmail: user?.email, apiResult }),
  };
};
