// Lightweight client-side analytics (temporary). Stores events in localStorage.
// To upgrade later: send events to a backend (e.g., Supabase) and build server dashboards.

export type AnalyticsEvent = {
  id: string;
  sessionId: string;
  timestamp: number; // epoch ms
  path: string;
  action:
    | "app_open"
    | "page_view"
    | "select_stage"
    | "select_level"
    | "select_content_type"
    | "video_play"
    | "video_pause"
    | "video_end";
  userAgent?: string;
  deviceType?: string;
  deviceVendor?: string;
  deviceId?: string; // stable per-device id
  // Optional metadata
  stage?: string;
  level?: string;
  videoId?: string;
  videoTitle?: string;
  currentTime?: number; // seconds
  watchedSeconds?: number; // seconds
};

const STORAGE_KEY = "app_analytics_events";
const SESSION_KEY = "app_analytics_session_id";
const DEVICE_ID_KEY = "app_analytics_device_id";

function uuid(): string {
  // Simple UUID v4-ish generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = uuid();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return "server-device";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function parseDevice(userAgent: string) {
  const ua = userAgent.toLowerCase();
  const isAndroid = ua.includes("android");
  const isIphone = ua.includes("iphone");
  const isIpad = ua.includes("ipad");
  const isMobile = isAndroid || isIphone || ua.includes("mobile");
  const deviceType = isMobile ? "mobile" : ua.includes("tablet") || isIpad ? "tablet" : "desktop";
  const vendor = isAndroid ? "Android" : isIphone || isIpad ? "Apple" : ua.includes("samsung") ? "Samsung" : ua.includes("huawei") ? "Huawei" : ua.includes("xiaomi") ? "Xiaomi" : undefined;
  return { deviceType, deviceVendor: vendor };
}

export function trackEvent(partial: Omit<AnalyticsEvent, "id" | "sessionId" | "timestamp" | "path">) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const userAgent = navigator.userAgent;
  const { deviceType, deviceVendor } = parseDevice(userAgent);
  const event: AnalyticsEvent = {
    id: uuid(),
    sessionId: getSessionId(),
    timestamp: now,
    path: window.location.pathname + window.location.search,
    userAgent,
    deviceType,
    deviceVendor,
    deviceId: getDeviceId(),
    ...partial,
  } as AnalyticsEvent;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    arr.push(event);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    // Swallow errors
    console.warn("Failed to write analytics event", e);
  }
}

export function getEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

export function clearEvents() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function trackAppOpenOnce() {
  if (typeof window === "undefined") return;
  const KEY = "app_open_tracked";
  if (!sessionStorage.getItem(KEY)) {
    trackEvent({ action: "app_open" });
    sessionStorage.setItem(KEY, "1");
  }
}

function shouldDedupe(action: AnalyticsEvent["action"]) {
  if (typeof window === "undefined") return false;
  try {
    const sig = `${action}|${window.location.pathname}${window.location.search}`;
    const prevSig = sessionStorage.getItem("last_event_sig") || "";
    const prevTs = parseInt(sessionStorage.getItem("last_event_ts") || "0", 10) || 0;
    const now = Date.now();
    if (prevSig === sig && now - prevTs < 1500) {
      return true; // duplicate within 1.5s
    }
    sessionStorage.setItem("last_event_sig", sig);
    sessionStorage.setItem("last_event_ts", String(now));
    return false;
  } catch {
    return false;
  }
}

export function trackPageView() {
  if (shouldDedupe("page_view")) return;
  trackEvent({ action: "page_view" });
}

