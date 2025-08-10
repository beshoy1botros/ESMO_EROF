// Vercel Serverless Function: Ingest analytics events into Supabase
// Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Accepts JSON body: single event or { events: AnalyticsEvent[] }

export const config = { runtime: "nodejs" };

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const SUPABASE_URL = env("SUPABASE_URL");
  const SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");
  const restUrl = `${SUPABASE_URL}/rest/v1/events`;

  const events = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.events)
    ? payload.events
    : [payload];

  // Basic normalization: drop undefined fields (Supabase REST rejects them)
  const norm = events.map((e: Record<string, any>) => {
    const o: Record<string, any> = {};
    for (const [k, v] of Object.entries(e)) {
      if (v !== undefined) o[k] = v;
    }
    return o;
  });

  const res = await fetch(restUrl, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(norm),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(`Supabase error: ${res.status} ${text}`, { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, inserted: norm.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

