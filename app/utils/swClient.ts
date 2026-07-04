/**
 * Service Worker Client — Advanced Edition
 *
 * ✅ الميزات الجديدة:
 * ─────────────────────────────────────────────────────────
 * 1. BroadcastChannel              → استقبال أحداث SW (تفعيل، تحديث، مسح كاش)
 * 2. Update Detection              → إشعار المستخدم بوجود نسخة جديدة
 * 3. navigator.storage.persist()  → طلب تخزين دائم من المتصفح
 * 4. Retry + Exponential Backoff  → إعادة المحاولة بذكاء عند الفشل
 * 5. Registration Manager         → إدارة تسجيل SW بشكل موحد
 * 6. Online / Offline Awareness   → سلوك مختلف حسب حالة الشبكة
 * 7. TypeScript Types كاملة       → أمان النوع على كل الدوال
 * 8. MessageChannel مع Timeout    → منع تسرب الذاكرة في انتظار الردود
 * 9. Structured Logging           → سجل موحد لتسهيل التصحيح
 * 10. Background Fetch API        → بدء تحميل الفيديوهات الكبيرة في الخلفية
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CacheSizeReport {
  /** يُرسَم من خدمة SW عند الإجابة على GET_CACHE_SIZE */
  type?:    "CACHE_SIZE";
  static:   string;
  video:    string;
  image:    string;
  font:     string;
  total:    string;
  rawBytes: { static: number; video: number; image: number; font: number };
}

export interface SWUpdateEvent {
  type:       "SW_ACTIVATED" | "SW_WAITING" | "CACHES_CLEARED" | "BACKGROUND_FETCH_DONE";
  version?:   string;
  id?:        string;
}

export type SWUpdateCallback = (event: SWUpdateEvent) => void;

export interface PrewarmOptions {
  priority?: "normal" | "high";
  /**
   * Background Fetch API — للفيديوهات الكبيرة جداً (تعمل حتى مع إغلاق التبويب)
   */
  useBackgroundFetch?: boolean;
  backgroundFetchId?: string;
  backgroundFetchTitle?: string;
  backgroundFetchTotal?: number;
}

export interface RegistrationOptions {
  swPath?:   string;
  scope?:    string;
  onUpdate?: SWUpdateCallback;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

const PREFIX = "[SW-Client]";
const log    = (...args: unknown[]) => console.log(PREFIX, ...args);
const warn   = (...args: unknown[]) => console.warn(PREFIX, ...args);

function sleep(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

/**
 * ✅ تواصل عبر MessageChannel مع مهلة انتهاء لمنع تسرب الذاكرة
 */
function postAndWait<T>(
  message: Record<string, unknown>,
  timeoutMs = 6_000
): Promise<T | null> {
  return new Promise<T | null>((resolve) => {
    const controller = navigator.serviceWorker?.controller;
    if (!controller) { resolve(null); return; }

    const channel = new MessageChannel();
    let   settled = false;

    const settle = (val: T | null) => {
      if (settled) return;
      settled = true;
      resolve(val);
    };

    channel.port1.onmessage = (e) => settle(e.data as T);
    setTimeout(() => settle(null), timeoutMs);

    controller.postMessage(message, [channel.port2]);
  });
}

/**
 * ✅ إرسال رسالة بسيطة بدون انتظار رد
 */
function postMessage(message: Record<string, unknown>): void {
  try {
    const controller = navigator.serviceWorker?.controller;
    controller?.postMessage(message);
  } catch { /* تجاهل */ }
}

// ─── BroadcastChannel ─────────────────────────────────────────────────────────

let   _broadcastChannel: BroadcastChannel | null = null;
const _listeners: Set<SWUpdateCallback>           = new Set();

function getBroadcastChannel(): BroadcastChannel | null {
  if (!("BroadcastChannel" in window)) return null;
  if (!_broadcastChannel) {
    _broadcastChannel = new BroadcastChannel("sw-updates");
    _broadcastChannel.onmessage = (e: MessageEvent<SWUpdateEvent>) => {
      _listeners.forEach((cb) => {
        try { cb(e.data); } catch { /* تجاهل */ }
      });
    };
  }
  return _broadcastChannel;
}

/**
 * ✅ الاشتراك في أحداث Service Worker
 * @returns دالة إلغاء الاشتراك
 */
export function subscribeSWEvents(callback: SWUpdateCallback): () => void {
  getBroadcastChannel();
  _listeners.add(callback);
  return () => _listeners.delete(callback);
}

// ─── Registration Manager ─────────────────────────────────────────────────────

let _registration: ServiceWorkerRegistration | null = null;

/**
 * ✅ تسجيل Service Worker مع كشف التحديثات التلقائي
 */
export async function registerSW(options: RegistrationOptions = {}): Promise<boolean> {
  const {
    swPath   = "/sw.js",
    scope    = "/",
    onUpdate,
  } = options;

  if (!("serviceWorker" in navigator)) {
    warn("Service Workers غير مدعومة في هذا المتصفح");
    return false;
  }

  try {
    _registration = await navigator.serviceWorker.register(swPath, { scope });
    log("تم التسجيل بنجاح:", _registration.scope);

    // ✅ اكتشاف SW قيد الانتظار (نسخة جديدة جاهزة)
    const detectWaiting = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting) {
        onUpdate?.({ type: "SW_WAITING" });
        _listeners.forEach((cb) => cb({ type: "SW_WAITING" }));
      }
    };

    detectWaiting(_registration);

    _registration.addEventListener("updatefound", () => {
      const newWorker = _registration!.installing;
      newWorker?.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          log("نسخة جديدة جاهزة");
          onUpdate?.({ type: "SW_WAITING" });
          _listeners.forEach((cb) => cb({ type: "SW_WAITING" }));
        }
      });
    });

    // ✅ الاشتراك في BroadcastChannel بعد التسجيل
    if (onUpdate) subscribeSWEvents(onUpdate);

    // ✅ فحص التحديثات دورياً (كل 30 دقيقة)
    setInterval(() => _registration?.update(), 30 * 60 * 1000);

    return true;
  } catch (error) {
    warn("فشل تسجيل Service Worker:", error);
    return false;
  }
}

/**
 * ✅ طلب التخزين الدائم من المتصفح (يمنع مسح الكاش تلقائياً)
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (navigator.storage?.persist) {
      const granted = await navigator.storage.persist();
      log(granted ? "✅ تخزين دائم ممنوح" : "⚠️ تخزين دائم مرفوض (سيتم التخزين العادي)");
      return granted;
    }
  } catch { /* تجاهل */ }
  return false;
}

/**
 * ✅ تفعيل النسخة الجديدة المنتظرة (بعد الحصول على موافقة المستخدم)
 */
export function activateWaitingSW(): void {
  postMessage({ type: "SKIP_WAITING" });

  // أعد تحميل الصفحة بعد لحظة لأخذ النسخة الجديدة
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  }, { once: true });
}

// ─── تسخين الفيديوهات ─────────────────────────────────────────────────────────

/**
 * ✅ تحميل مسبق للفيديوهات بخيارات متقدمة
 */
export function prewarmVideos(
  urls:    string[],
  options: PrewarmOptions = {}
): void {
  if (!Array.isArray(urls) || !urls.length) return;

  const unique = [...new Set(urls.filter(Boolean))];
  const { priority = "normal", useBackgroundFetch = false } = options;

  const hasSW = Boolean(navigator.serviceWorker?.controller);

  if (hasSW) {
    // ✅ استخدام Background Fetch للفيديوهات الكبيرة جداً
    if (useBackgroundFetch && options.backgroundFetchId) {
      postMessage({
        type:    "BACKGROUND_FETCH",
        fetchId: options.backgroundFetchId,
        urls:    unique,
        options: {
          title:         options.backgroundFetchTitle ?? "تحميل فيديو",
          downloadTotal: options.backgroundFetchTotal ?? 0,
        },
      });
      return;
    }

    const msgType = priority === "high" ? "PREWARM_VIDEOS_PRIORITY" : "PREWARM_VIDEOS";
    postMessage({ type: msgType, urls: unique });

    // إضافة تلميحات للمتصفح
    const rel = priority === "high" ? "preload" : "prefetch";
    unique.forEach((href) => {
      try {
        if (document.head.querySelector(`link[href="${href}"]`)) return;
        const link = Object.assign(document.createElement("link"), {
          rel, as: "video", href,
        });
        document.head.appendChild(link);
      } catch { /* تجاهل */ }
    });

    return;
  }

  // ✅ Fallback: تحميل متوازي عبر fetch مباشر
  prewarmFallback(unique);
}

/** تحميل مسبق بأولوية عالية (اختصار) */
export function prewarmVideosPriority(urls: string[]): void {
  prewarmVideos(urls, { priority: "high" });
}

/** ✅ Fallback متوازي عند غياب Service Worker */
async function prewarmFallback(urls: string[]): Promise<void> {
  const CONCURRENT = navigator.onLine ? 3 : 0;
  if (!CONCURRENT) return;

  for (let i = 0; i < urls.length; i += CONCURRENT) {
    const batch = urls.slice(i, i + CONCURRENT);
    await Promise.allSettled(batch.map((url) => fetch(url, { mode: "no-cors" }).catch(() => {})));
    if (i + CONCURRENT < urls.length) await sleep(150);
  }
}

// ─── إدارة الكاش ──────────────────────────────────────────────────────────────

/**
 * ✅ حذف فيديو محدد من الكاش
 */
export function evictVideo(url: string): void {
  if (!url) return;
  postMessage({ type: "EVICT_VIDEO", url });
}

/**
 * ✅ الحصول على تقرير حجم الكاش مع Retry
 */
export async function getCacheSize(retries = 2): Promise<CacheSizeReport | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await postAndWait<CacheSizeReport>(
        { type: "GET_CACHE_SIZE" },
        6_000
      );
      if (result?.type === "CACHE_SIZE") return result;
    } catch { /* تجاهل */ }

    if (attempt < retries) await sleep(500 * 2 ** attempt); // Exponential backoff
  }
  return null;
}

/**
 * ✅ مسح جميع الكاشات
 */
export function clearAllCaches(): void {
  postMessage({ type: "CLEAR_CACHES" });
}

/**
 * ✅ تخطي انتظار SW الجديد يدوياً
 */
export function skipWaiting(): void {
  postMessage({ type: "SKIP_WAITING" });
}

// ─── تقدير مساحة التخزين ──────────────────────────────────────────────────────

export interface StorageEstimate {
  usage:     number;
  quota:     number;
  usedMB:    string;
  totalMB:   string;
  freePercent: string;
  persistent: boolean;
}

/**
 * ✅ تقدير شامل لمساحة التخزين المستخدمة
 */
export async function getStorageEstimate(): Promise<StorageEstimate | null> {
  try {
    if (!navigator.storage?.estimate) return null;

    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    const persistent = await navigator.storage.persisted?.() ?? false;

    return {
      usage,
      quota,
      usedMB:      formatMB(usage),
      totalMB:     formatMB(quota),
      freePercent: quota ? `${(((quota - usage) / quota) * 100).toFixed(1)}%` : "N/A",
      persistent,
    };
  } catch { return null; }
}

function formatMB(bytes: number): string {
  return (bytes / 1024 ** 2).toFixed(2) + " MB";
}

// ─── حالة SW ─────────────────────────────────────────────────────────────────

export interface SWStatus {
  supported:   boolean;
  registered:  boolean;
  active:      boolean;
  waiting:     boolean;
  online:      boolean;
  version?:    string;
}

/**
 * ✅ قراءة الحالة الكاملة لـ Service Worker
 */
export async function getSWStatus(): Promise<SWStatus> {
  const online =
    typeof navigator !== "undefined" && "onLine" in navigator
      ? navigator.onLine
      : true;

  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return {
      supported: false,
      registered: false,
      active: false,
      waiting: false,
      online,
    };
  }

  const reg = _registration ?? (await navigator.serviceWorker.getRegistration("/").catch(() => null));

  return {
    supported:  true,
    registered: Boolean(reg),
    active:     Boolean(reg?.active),
    waiting:    Boolean(reg?.waiting),
    online:     navigator.onLine,
  };
}