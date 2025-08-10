import { useEffect, useMemo, useState } from "react";
import type { AnalyticsEvent } from "../utils/analytics";
import Header from "../components/Header";
import Footer from "../components/Footer";

export function meta() {
  return [
    { title: "لوحة التحكم - الإدارة" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function groupBy<T, K extends string | number>(arr: T[], keyFn: (t: T) => K) {
  return arr.reduce((map, item) => {
    const k = keyFn(item);
    (map[k] ||= []).push(item);
    return map;
  }, {} as Record<K, T[]>);
}

export default function ManagementDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [query, setQuery] = useState("");

  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    // Fetch from server API (centralized), exclude this device if available
    const controller = new AbortController();

    async function refetch() {
      try {
        const excludeDeviceId =
          (typeof window !== "undefined" &&
            localStorage.getItem("app_analytics_device_id")) ||
          undefined;
        const qs = new URLSearchParams();
        if (excludeDeviceId) qs.set("excludeDeviceId", excludeDeviceId);
        const res = await fetch(`/api/events?${qs.toString()}`, {
          signal: controller.signal,
          headers: { "x-mgmt-secret": (window as any).MGMT_SECRET || "" },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = (await res.json()) as AnalyticsEvent[];
        setEvents(data);
      } catch (e) {
        console.warn("Failed to fetch events", e);
      }
    }

    refetch();
    return () => controller.abort();
  }, []);

  // Auto refresh every 10s if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      (async () => {
        try {
          const excludeDeviceId =
            (typeof window !== "undefined" &&
              localStorage.getItem("app_analytics_device_id")) ||
            undefined;
          const qs = new URLSearchParams();
          if (excludeDeviceId) qs.set("excludeDeviceId", excludeDeviceId);
          const res = await fetch(`/api/events?${qs.toString()}`, {
            headers: { "x-mgmt-secret": (window as any).MGMT_SECRET || "" },
          });
          if (res.ok) {
            setEvents((await res.json()) as AnalyticsEvent[]);
          }
        } catch {}
      })();
    }, 10000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  async function manualRefresh(secret: string) {
    try {
      const excludeDeviceId =
        (typeof window !== "undefined" &&
          localStorage.getItem("app_analytics_device_id")) ||
        undefined;
      const qs = new URLSearchParams();
      if (excludeDeviceId) qs.set("excludeDeviceId", excludeDeviceId);
      const res = await fetch(`/api/events?${qs.toString()}`, {
        headers: { "x-mgmt-secret": secret },
      });
      if (res.ok) setEvents((await res.json()) as AnalyticsEvent[]);
    } catch {}
  }

  const filtered = useMemo(() => {
    if (!query) return events;
    const q = query.toLowerCase();
    return events.filter((e) => JSON.stringify(e).toLowerCase().includes(q));
  }, [events, query]);

  const byDevice = useMemo(
    () => groupBy(filtered, (e) => e.deviceId || "unknown"),
    [filtered]
  );
  const sessions = useMemo(
    () => groupBy(filtered, (e) => e.sessionId),
    [filtered]
  );

  const counts = useMemo(() => {
    const c = {
      total: filtered.length,
      sessions: Object.keys(sessions).length,
      byAction: {} as Record<string, number>,
      devices: {} as Record<string, number>,
    };
    for (const e of filtered) {
      c.byAction[e.action] = (c.byAction[e.action] || 0) + 1;
      const dev = `${e.deviceType || "unknown"}${
        e.deviceVendor ? " - " + e.deviceVendor : ""
      }`;
      c.devices[dev] = (c.devices[dev] || 0) + 1;
    }
    return c;
  }, [filtered, sessions]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                لوحة تحكم المطور
              </h1>
              <p className="text-gray-400 text-sm">
                عرض سجلات استخدام التطبيق من الجهاز المحلي.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="بحث في الأحداث..."
                className="px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-500/30"
              />
              <button
                type="button"
                onClick={() => manualRefresh((window as any).MGMT_SECRET || "")}
                className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500"
              >
                تحديث
              </button>
              <button
                type="button"
                onClick={() => setEvents([])}
                className="px-3 py-2 rounded bg-red-600 hover:bg-red-500"
              >
                مسح المعروض
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded bg-gray-800 border border-blue-500">
              <div className="text-gray-400 text-sm">إجمالي الأحداث</div>
              <div className="text-2xl font-semibold">{counts.total}</div>
            </div>
            <div className="p-4 rounded bg-gray-800 border border-blue-500">
              <div className="text-gray-400 text-sm">الجلسات</div>
              <div className="text-2xl font-semibold">{counts.sessions}</div>
            </div>
            <div className="p-4 rounded bg-gray-800 border border-blue-500">
              <div className="text-gray-400 text-sm">الأجهزة</div>
              <div className="text-sm space-y-1 mt-2">
                {Object.entries(counts.devices).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <span>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded bg-gray-800 border border-blue-500">
              <div className="text-gray-400 text-sm">حسب الفعل</div>
              <div className="text-sm space-y-1 mt-2">
                {Object.entries(counts.byAction).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <span>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-blue-500 rounded">
            <div className="px-4 py-3 border-b border-gray-700 font-semibold">
              الأحداث
            </div>
            <div className="divide-y divide-gray-700 max-h-[60vh] overflow-auto">
              {/* Grouped by device: always shown, updates on refresh button */}
              <div className="space-y-4">
                {Object.entries(byDevice)
                  .sort((a, b) => (a[0] > b[0] ? 1 : -1))
                  .map(([deviceId, devEvents]) => (
                    <div
                      key={deviceId}
                      className="bg-gray-800 border border-blue-500 rounded overflow-hidden"
                    >
                      <div className="px-4 py-2 bg-gray-700 border-b border-gray-600 flex items-center justify-between">
                        <div className="text-sm text-gray-300">
                          جهاز: <span className="font-mono">{deviceId}</span> •
                          أحداث: {devEvents.length}
                        </div>
                        <div className="text-xs text-gray-400">
                          {devEvents[0]?.deviceType || "unknown"}
                          {devEvents[0]?.deviceVendor
                            ? ` • ${devEvents[0].deviceVendor}`
                            : ""}
                        </div>
                      </div>
                      <div className="divide-y divide-gray-700">
                        {devEvents
                          .slice()
                          .reverse()
                          .map((e) => (
                            <div key={e.id} className="px-4 py-3 text-sm">
                              <div className="flex flex-wrap gap-2 items-center justify-between">
                                <div className="font-mono text-gray-300">
                                  {formatDate(e.timestamp)}
                                </div>
                                <div className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300">
                                  {e.action}
                                </div>
                              </div>
                              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                                <div>
                                  المسار:{" "}
                                  <span className="text-gray-400">
                                    {e.path}
                                  </span>
                                </div>
                                <div>
                                  الجلسة:{" "}
                                  <span className="text-gray-400">
                                    {e.sessionId}
                                  </span>
                                </div>
                                {e.stage && (
                                  <div>
                                    المرحلة:{" "}
                                    <span className="text-gray-400">
                                      {e.stage}
                                    </span>
                                  </div>
                                )}
                                {e.level && (
                                  <div>
                                    المستوى:{" "}
                                    <span className="text-gray-400">
                                      {e.level}
                                    </span>
                                  </div>
                                )}
                                {e.videoTitle && (
                                  <div>
                                    الفيديو:{" "}
                                    <span className="text-gray-400">
                                      {e.videoTitle}
                                    </span>
                                  </div>
                                )}
                                {e.currentTime != null && (
                                  <div>
                                    الزمن الحالي:{" "}
                                    <span className="text-gray-400">
                                      {Math.round(e.currentTime || 0)}s
                                    </span>
                                  </div>
                                )}
                                {e.watchedSeconds != null && (
                                  <div>
                                    المدة المشاهدة:{" "}
                                    <span className="text-gray-400">
                                      {Math.round(e.watchedSeconds || 0)}s
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Flat list removed to avoid duplication. Show empty state only. */}
              {filtered.length === 0 && (
                <div className="p-4 text-gray-400">لا توجد بيانات بعد.</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
