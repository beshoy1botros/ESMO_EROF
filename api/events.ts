// Vercel Serverless Function: Read analytics events from Supabase for the dashboard
// Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Query params: limit, since, deviceId, sessionId, excludeDeviceId

export const config = { runtime: "nodejs" };

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}


export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405 });

  // Protect this endpoint with a server-only secret. Management UI must send it.
  const mgmtSecret = process.env.MGMT_SECRET;
  const clientSecret = request.headers.get("x-mgmt-secret") || "";
  if (!mgmtSecret || clientSecret !== mgmtSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const limit = url.searchParams.get("limit") || "200";
  const since = url.searchParams.get("since"); // epoch ms
  const deviceId = url.searchParams.get("deviceId");
  const sessionId = url.searchParams.get("sessionId");
  const excludeDeviceId = url.searchParams.get("excludeDeviceId");

  const SUPABASE_URL = env("SUPABASE_URL");
  const SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");
  let restUrl = `${SUPABASE_URL}/rest/v1/events`;

  const filters: string[] = [];
  if (since) filters.push(`timestamp=gte.${since}`);
  if (deviceId) filters.push(`deviceId=eq.${deviceId}`);
  if (sessionId) filters.push(`sessionId=eq.${sessionId}`);
  if (excludeDeviceId) filters.push(`deviceId=neq.${excludeDeviceId}`);

  const qs = new URLSearchParams();
  if (filters.length) qs.set("and", `(${filters.join(",")})`);
  qs.set("order", "timestamp.desc");
  qs.set("limit", limit);

  restUrl += `?${qs.toString()}`;

  const res = await fetch(restUrl, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(`Supabase error: ${res.status} ${text}`, { status: 500 });
  }

  return new Response(await res.text(), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

