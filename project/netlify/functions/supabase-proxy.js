const DEFAULT_SUPABASE_URL = "https://gacgollaafyecyszczbs.supabase.co";
const envSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_URL = envSupabaseUrl.startsWith("https://")
  ? envSupabaseUrl.replace(/\/$/, "")
  : DEFAULT_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

async function requestSupabase(url, options) {
  const https = await import("node:https");
  const target = new URL(url);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: target.hostname,
        path: `${target.pathname}${target.search}`,
        method: options.method,
        headers: options.headers,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode || 500,
            contentType: res.headers["content-type"] || "application/json",
            body,
          });
        });
      }
    );

    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy(new Error("Supabase request timeout"));
    });

    if (options.body) req.write(options.body);
    req.end();
  });
}

export const handler = async (event) => {
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

  const targetUrl = `${SUPABASE_URL}${path}`;
  let response;

  try {
    response = await requestSupabase(targetUrl, {
      method: event.httpMethod,
      headers: {
        apikey: SUPABASE_KEY,
        authorization: `Bearer ${SUPABASE_KEY}`,
        "content-type": event.headers["content-type"] || "application/json",
        prefer: event.headers.prefer || "return=representation",
      },
      body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
    });
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: "Supabase fetch failed",
        targetUrl,
        cause: error instanceof Error ? error.message : String(error),
      }),
    };
  }

  return {
    statusCode: response.status,
    headers: {
      "content-type": response.contentType,
    },
    body: response.body,
  };
};
