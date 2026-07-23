const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://gacgollaafyecysczbs.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

exports.handler = async (event) => {
  if (!SUPABASE_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Missing SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY" }),
    };
  }

  const path = event.queryStringParameters?.path;
  if (!path || !path.startsWith("/")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing path query parameter" }),
    };
  }

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: event.httpMethod,
    headers: {
      apikey: SUPABASE_KEY,
      authorization: `Bearer ${SUPABASE_KEY}`,
      "content-type": event.headers["content-type"] || "application/json",
      prefer: event.headers.prefer || "return=representation",
    },
    body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
  });

  const body = await response.text();
  return {
    statusCode: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "application/json",
    },
    body,
  };
};
