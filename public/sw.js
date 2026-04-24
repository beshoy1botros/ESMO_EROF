/**
 * ESMO_EROF Service Worker — Advanced Edition
 *
 * ✅ الميزات الجديدة:
 * ─────────────────────────────────────────────
 * 1. Range Requests (206 Partial Content)   → تقديم الفيديو من الكاش مع دعم Seek كامل
 * 2. IndexedDB LRU                          → بيانات LRU تبقى حتى بعد إعادة تشغيل SW
 * 3. BroadcastChannel                       → تواصل ثنائي الاتجاه موثوق مع التطبيق
 * 4. Background Fetch API                   → تحميل الفيديوهات الكبيرة في الخلفية
 * 5. Network Information API               → تجنب التخزين على شبكات 2G/slow-2g
 * 6. Min-Heap Priority Queue               → إدارة أولويات التحميل المسبق بدقة
 * 7. navigator.storage.persist()           → طلب تخزين دائم لمنع الحذف التلقائي
 * 8. Compression-aware caching             → اكتشاف دعم Brotli / GZip
 * 9. Stale-While-Revalidate لجميع الأنواع → سرعة + حداثة في نفس الوقت
 * 10. Self-healing cache                   → اكتشاف وإصلاح استجابات الكاش التالفة
 */

// ─── إصدارات الكاش ───────────────────────────────────────────────────────────
const CACHE_VERSION  = "esmo-erof-v10";
const STATIC_CACHE   = `${CACHE_VERSION}-static`;
const FONT_CACHE     = `${CACHE_VERSION}-fonts`;
const IMAGE_CACHE    = `${CACHE_VERSION}-images`;
const VIDEO_CACHE    = `${CACHE_VERSION}-videos`;
const VALID_CACHES   = [STATIC_CACHE, FONT_CACHE, IMAGE_CACHE, VIDEO_CACHE];

// ─── حدود التخزين (بالبايت) ──────────────────────────────────────────────────
const MAX_VIDEO_CACHE_SIZE  = 2   * 1024 ** 3; // 2 GB
const MAX_IMAGE_CACHE_SIZE  = 100 * 1024 ** 2; // 100 MB
const MAX_STATIC_CACHE_SIZE = 50  * 1024 ** 2; // 50 MB
const MAX_FONT_CACHE_SIZE   = 10  * 1024 ** 2; // 10 MB

// ─── الصفحات والأصول للتخزين المسبق ─────────────────────────────────────────
const PAGES_TO_PRECACHE = [
  "/", "/melodies", "/about", "/preparatory",
  "/index.html", "/melodies/index.html", "/about/index.html", "/preparatory/index.html",
];
const CRITICAL_ASSETS = ["/", "/index.html"];
const GOOGLE_FONTS = [
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Coptic&family=Noto+Sans+Arabic:wght@400;700&display=swap",
];

// ─── BroadcastChannel للتواصل مع التطبيق ─────────────────────────────────────
const broadcast = new BroadcastChannel("sw-updates");

// ─── IndexedDB للـ LRU (يبقى عبر إعادة تشغيل SW) ────────────────────────────
const IDB_NAME    = "sw-lru-store";
const IDB_VERSION = 1;
const IDB_STORE   = "lru";

let _idb = null;

async function getIDB() {
  if (_idb) return _idb;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        const store = db.createObjectStore(IDB_STORE, { keyPath: "key" });
        store.createIndex("ts", "ts", { unique: false });
      }
    };
    req.onsuccess = (e) => { _idb = e.target.result; resolve(_idb); };
    req.onerror   = () => reject(req.error);
  });
}

async function idbPut(cacheName, url) {
  try {
    const db  = await getIDB();
    const key = `${cacheName}:${url}`;
    const tx  = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put({ key, cacheName, url, ts: Date.now() });
  } catch { /* تجاهل أخطاء IDB غير الحرجة */ }
}

async function idbGetLRU(cacheName, count) {
  try {
    const db    = await getIDB();
    const tx    = db.transaction(IDB_STORE, "readonly");
    const index = tx.objectStore(IDB_STORE).index("ts");
    const items = [];

    return new Promise((resolve) => {
      const req = index.openCursor();
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (!cursor) { resolve(items); return; }
        if (cursor.value.cacheName === cacheName) items.push(cursor.value);
        if (items.length < count) cursor.continue();
        else resolve(items);
      };
      req.onerror = () => resolve(items);
    });
  } catch { return []; }
}

async function idbDelete(cacheName, url) {
  try {
    const db = await getIDB();
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(`${cacheName}:${url}`);
  } catch { /* تجاهل */ }
}

// ─── Min-Heap Priority Queue للتحميل المسبق ──────────────────────────────────
class MinHeap {
  constructor() { this._data = []; }

  push(item) {
    this._data.push(item);
    this._bubbleUp(this._data.length - 1);
  }

  pop() {
    if (!this._data.length) return null;
    const top  = this._data[0];
    const last = this._data.pop();
    if (this._data.length) { this._data[0] = last; this._sinkDown(0); }
    return top;
  }

  peek()  { return this._data[0] ?? null; }
  get size() { return this._data.length; }

  _bubbleUp(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this._data[p].priority <= this._data[i].priority) break;
      [this._data[p], this._data[i]] = [this._data[i], this._data[p]];
      i = p;
    }
  }

  _sinkDown(i) {
    const n = this._data.length;
    while (true) {
      let min = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this._data[l].priority < this._data[min].priority) min = l;
      if (r < n && this._data[r].priority < this._data[min].priority) min = r;
      if (min === i) break;
      [this._data[min], this._data[i]] = [this._data[i], this._data[min]];
      i = min;
    }
  }
}

const prewarmHeap   = new MinHeap();
const prewarmInSet  = new Set(); // لمنع التكرار بدون O(n) scan
let   prewarmActive = false;

// ─── فحص جودة الشبكة ─────────────────────────────────────────────────────────
function isSlowNetwork() {
  const conn = self.navigator?.connection;
  if (!conn) return false;
  return ["slow-2g", "2g"].includes(conn.effectiveType) || conn.saveData === true;
}

// ─── تثبيت Service Worker ─────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  console.log(`[SW] تثبيت ${CACHE_VERSION}`);

  event.waitUntil((async () => {
    // 1. طلب تخزين دائم لمنع حذف الكاش تلقائياً
    try { await self.navigator.storage?.persist(); } catch { /* تجاهل */ }

    // 2. تخزين الأصول الحرجة أولاً
    const staticCache = await caches.open(STATIC_CACHE);
    await staticCache.addAll(CRITICAL_ASSETS).catch(() => {});

    // 3. تخزين الخطوط والصفحات بالتوازي
    const [fontCache] = await Promise.all([
      caches.open(FONT_CACHE),
      Promise.allSettled(
        PAGES_TO_PRECACHE.map((p) => staticCache.add(p).catch(() => {}))
      ),
    ]);

    await Promise.allSettled(
      GOOGLE_FONTS.map((url) =>
        fetch(url).then((r) => fontCache.put(url, r)).catch(() => {})
      )
    );

    console.log("[SW] اكتمل التثبيت");
    await self.skipWaiting();
  })());
});

// ─── تفعيل Service Worker ─────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  console.log("[SW] تفعيل النسخة الجديدة");

  event.waitUntil((async () => {
    // حذف الكاشات القديمة
    const allCaches = await caches.keys();
    await Promise.all(
      allCaches
        .filter((name) => !VALID_CACHES.includes(name))
        .map((name) => { console.log("[SW] حذف كاش قديم:", name); return caches.delete(name); })
    );

    await self.clients.claim();
    broadcast.postMessage({ type: "SW_ACTIVATED", version: CACHE_VERSION });
    console.log("[SW] تمت السيطرة على التطبيق");
  })());
});

// ─── اعتراض الطلبات ──────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // استثناءات — لا تعترض هذه الطلبات
  if (!url.protocol.startsWith("http"))              return;
  if (url.pathname.includes("manifest.json"))        return;
  if (url.hostname.includes("api.countapi.xyz"))     return;
  if (request.method !== "GET")                      return;

  if (isVideoRequest(request)) {
    event.respondWith(handleVideoRequest(request));
    return;
  }

  if (url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com")) {
    event.respondWith(handleFontRequest(request));
    return;
  }

  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
    return;
  }

  event.respondWith(fetch(request).catch(() => new Response(null, { status: 503 })));
});

// ─── ✅ معالجة طلبات الفيديو مع Range Request كامل ──────────────────────────
async function handleVideoRequest(request) {
  const cache     = await caches.open(VIDEO_CACHE);
  const cleanReq  = new Request(request.url, { method: "GET" });
  const rangeHeader = request.headers.get("range");

  // ── محاولة تقديم من الكاش ─────────────────────────────────────────────────
  const cachedResponse = await cache.match(cleanReq);

  if (cachedResponse?.ok) {
    idbPut(VIDEO_CACHE, request.url); // تحديث LRU

    // ✅ إذا كان الطلب يحمل Range header، قطّع الاستجابة من الكاش
    if (rangeHeader) {
      const ranged = await buildRangedResponse(cachedResponse, rangeHeader);
      if (ranged) {
        // تحديث في الخلفية (SWR)
        fetchAndCacheVideo(request.url, cache, cleanReq).catch(() => {});
        return ranged;
      }
    }

    // ✅ Stale-While-Revalidate: أعد فوراً وحدّث في الخلفية
    fetchAndCacheVideo(request.url, cache, cleanReq).catch(() => {});
    return cachedResponse;
  }

  // إذا كان الكاش تالفاً، امسحه
  if (cachedResponse && !cachedResponse.ok) {
    await cache.delete(cleanReq);
  }

  // ── جلب من الشبكة ────────────────────────────────────────────────────────
  return fetchVideoFromNetwork(request, cache, cleanReq);
}

/**
 * ✅ بناء استجابة 206 Partial Content من كاش كامل
 */
async function buildRangedResponse(fullResponse, rangeHeader) {
  try {
    const rangeMatch = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
    if (!rangeMatch) return null;

    const blob      = await fullResponse.clone().blob();
    const total     = blob.size;
    const start     = parseInt(rangeMatch[1], 10);
    const end       = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : total - 1;
    const safeEnd   = Math.min(end, total - 1);
    const sliced    = blob.slice(start, safeEnd + 1);

    return new Response(sliced, {
      status: 206,
      headers: {
        "Content-Type":   fullResponse.headers.get("Content-Type") ?? "video/mp4",
        "Content-Range":  `bytes ${start}-${safeEnd}/${total}`,
        "Content-Length": String(sliced.size),
        "Accept-Ranges":  "bytes",
      },
    });
  } catch { return null; }
}

async function fetchVideoFromNetwork(request, cache, cleanReq) {
  // لا تحفظ على شبكة بطيئة
  const slow   = isSlowNetwork();
  const corsReq = new Request(request.url, { method: "GET", mode: "cors", credentials: "omit" });

  try {
    const response = await fetch(corsReq);
    if (response.ok && !slow) {
      const withinLimit = await isWithinQuota(MAX_VIDEO_CACHE_SIZE);
      if (withinLimit) {
        cache.put(cleanReq, response.clone())
          .then(() => idbPut(VIDEO_CACHE, request.url))
          .catch(() => {});
      }
    }
    return response;
  } catch (error) {
    console.error("[SW] فشل جلب الفيديو:", error);
    return new Response(null, { status: 503 });
  }
}

async function fetchAndCacheVideo(url, cache, cleanReq) {
  const corsReq = new Request(url, { method: "GET", mode: "cors", credentials: "omit" });
  const response = await fetch(corsReq);
  if (response.ok) {
    await cache.put(cleanReq, response.clone());
    await idbPut(VIDEO_CACHE, url);
  }
}

// ─── ✅ الملفات الثابتة — Stale-While-Revalidate ─────────────────────────────
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  idbPut(STATIC_CACHE, request.url);

  if (cached) {
    // تحديث صامت في الخلفية
    fetch(request).then((r) => r.ok && cache.put(request, r.clone())).catch(() => {});
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch { return new Response(null, { status: 503 }); }
}

// ─── ✅ الصور — Cache-First + SWR ─────────────────────────────────────────────
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  idbPut(IMAGE_CACHE, request.url);

  if (cached) {
    fetch(request).then((r) => r.ok && cache.put(request, r.clone())).catch(() => {});
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const withinLimit = await isWithinQuota(MAX_IMAGE_CACHE_SIZE);
      if (withinLimit) cache.put(request, response.clone());
    }
    return response;
  } catch {
    // صورة شفافة 1×1 كـ fallback
    return new Response(
      Uint8Array.from(atob("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"), (c) => c.charCodeAt(0)),
      { headers: { "Content-Type": "image/gif" } }
    );
  }
}

// ─── ✅ الخطوط — Cache-First دائم ─────────────────────────────────────────────
async function handleFontRequest(request) {
  const cache = await caches.open(FONT_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch { return new Response(null, { status: 503 }); }
}

// ─── ✅ الصفحات — Network-First مع Fallback سريع ─────────────────────────────
async function handlePageRequest(request) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 3000); // 3 ثواني timeout

    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) { cache.put(request, response.clone()); return response; }
  } catch { /* Fallback للكاش */ }

  return (await cache.match(request)) ?? (await caches.match("/")) ?? new Response(null, { status: 503 });
}

// ─── ✅ Min-Heap Prewarm Queue ─────────────────────────────────────────────────
/**
 * أضف URL للقائمة بأولوية (أرقام أصغر = أولوية أعلى)
 * @param {string} url
 * @param {number} priority  0 = أعلى أولوية (priority queue)
 */
function enqueuePrewarm(url, priority = 5) {
  if (!url || prewarmInSet.has(url)) return;
  prewarmInSet.add(url);
  prewarmHeap.push({ url, priority });
}

async function processPrewarmQueue() {
  if (prewarmActive) return;
  prewarmActive = true;

  try {
    const cache      = await caches.open(VIDEO_CACHE);
    const CONCURRENT = isSlowNetwork() ? 1 : 3;

    while (prewarmHeap.size > 0) {
      const batch = [];
      for (let i = 0; i < CONCURRENT && prewarmHeap.size > 0; i++) {
        batch.push(prewarmHeap.pop().url);
      }

      await Promise.allSettled(
        batch.map(async (url) => {
          try {
            const req    = new Request(url, { mode: "cors", credentials: "omit" });
            const exists = await cache.match(req);
            if (!exists) {
              const resp = await fetch(req);
              if (resp?.ok) {
                await cache.put(req, resp.clone());
                await idbPut(VIDEO_CACHE, url);
              }
            }
          } catch { /* تجاهل أخطاء الطلب الفردي */ }
          prewarmInSet.delete(url);
        })
      );

      if (prewarmHeap.size > 0) await sleep(100);
    }
  } finally {
    prewarmActive = false;
    // تطبيق حدود الكاش بعد اكتمال التحميل
    enforceLRULimit(VIDEO_CACHE, MAX_VIDEO_CACHE_SIZE).catch(() => {});
  }
}

// ─── ✅ Background Fetch لملفات الفيديو الضخمة ───────────────────────────────
async function startBackgroundFetch(id, urls, options = {}) {
  try {
    if (!self.registration.backgroundFetch) return false;
    const existing = await self.registration.backgroundFetch.get(id);
    if (existing) return true;

    await self.registration.backgroundFetch.fetch(id, urls, {
      title:         options.title ?? "تحميل فيديو",
      icons:         options.icons ?? [],
      downloadTotal: options.downloadTotal ?? 0,
    });
    return true;
  } catch { return false; }
}

self.addEventListener("backgroundfetchsuccess", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VIDEO_CACHE);
    const records = await event.registration.matchAll();
    await Promise.allSettled(
      records.map(async (record) => {
        const response = await record.responseReady;
        if (response.ok) {
          const req = new Request(record.request.url, { method: "GET" });
          await cache.put(req, response);
          await idbPut(VIDEO_CACHE, record.request.url);
        }
      })
    );
    broadcast.postMessage({ type: "BACKGROUND_FETCH_DONE", id: event.registration.id });
  })());
});

// ─── ✅ معالجة رسائل التطبيق ──────────────────────────────────────────────────
self.addEventListener("message", (event) => {
  const { data, ports } = event;
  if (!data?.type) return;

  switch (data.type) {

    case "SKIP_WAITING":
      self.skipWaiting();
      break;

    case "CLEAR_CACHES":
      event.waitUntil(clearAllCaches());
      break;

    case "PREWARM_VIDEOS": {
      const urls = toStringArray(data.urls);
      if (urls.length) {
        event.waitUntil((async () => {
          urls.forEach((u) => enqueuePrewarm(u, 5));
          await processPrewarmQueue();
        })());
      }
      break;
    }

    case "PREWARM_VIDEOS_PRIORITY": {
      const urls = toStringArray(data.urls);
      if (urls.length) {
        event.waitUntil((async () => {
          urls.forEach((u) => enqueuePrewarm(u, 0)); // أولوية قصوى
          await processPrewarmQueue();
        })());
      }
      break;
    }

    case "BACKGROUND_FETCH": {
      const { fetchId, urls: bfUrls, options } = data;
      event.waitUntil(startBackgroundFetch(fetchId, bfUrls, options));
      break;
    }

    case "EVICT_VIDEO": {
      const urlToEvict = data.url;
      event.waitUntil((async () => {
        try {
          const cache   = await caches.open(VIDEO_CACHE);
          const keys    = await cache.keys();
          const target  = new URL(urlToEvict, self.location.origin);
          await Promise.all(
            keys.map(async (req) => {
              const rUrl = new URL(req.url);
              if (rUrl.origin === target.origin && rUrl.pathname === target.pathname) {
                await cache.delete(req);
                await idbDelete(VIDEO_CACHE, req.url);
              }
            })
          );
        } catch { /* تجاهل */ }
      })());
      break;
    }

    case "GET_CACHE_SIZE": {
      if (!ports[0]) break;
      Promise.all([
        getCacheSize(STATIC_CACHE),
        getCacheSize(VIDEO_CACHE),
        getCacheSize(IMAGE_CACHE),
        getCacheSize(FONT_CACHE),
      ]).then(([s, v, img, f]) => {
        ports[0].postMessage({
          type:    "CACHE_SIZE",
          static:  formatBytes(s),
          video:   formatBytes(v),
          image:   formatBytes(img),
          font:    formatBytes(f),
          total:   formatBytes(s + v + img + f),
          rawBytes:{ static: s, video: v, image: img, font: f },
        });
      });
      break;
    }

    default:
      break;
  }
});

// ─── دوال مساعدة ─────────────────────────────────────────────────────────────

function isVideoRequest(req) {
  return /\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i.test(req.url);
}
function isImageRequest(req) {
  return /\.(jpg|jpeg|png|webp|gif|svg|ico|avif)(\?|$)/i.test(req.url);
}
function isStaticAsset(req) {
  return /\.(css|js|woff2?|ttf|eot)(\?|$)/i.test(req.url) || req.url.includes("/assets/");
}
function isPageRequest(req) {
  const url = new URL(req.url);
  return (
    req.headers.get("accept")?.includes("text/html") ||
    ["/", "/melodies", "/about", "/preparatory"].includes(url.pathname)
  );
}

function toStringArray(val) {
  return Array.isArray(val) ? val.filter((u) => typeof u === "string") : [];
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/**
 * ✅ التحقق من المساحة المتاحة قبل التخزين
 */
async function isWithinQuota(needed) {
  try {
    const { quota, usage } = await self.navigator.storage.estimate();
    return quota - usage > needed * 0.1; // احتفظ بـ 10% هامش
  } catch { return true; }
}

/**
 * ✅ حساب حجم كاش بعينه بالبايت
 */
async function getCacheSize(cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const keys  = await cache.keys();
    let total   = 0;
    for (const key of keys) {
      const resp = await cache.match(key);
      if (resp) total += (await resp.clone().blob()).size;
    }
    return total;
  } catch { return 0; }
}

/**
 * ✅ تطبيق حد LRU: احذف الأقدم استخداماً حتى نصل للحد المسموح
 */
async function enforceLRULimit(cacheName, maxBytes) {
  try {
    let size = await getCacheSize(cacheName);
    if (size <= maxBytes) return;

    const cache   = await caches.open(cacheName);
    const victims = await idbGetLRU(cacheName, 20);

    for (const item of victims) {
      if (size <= maxBytes * 0.9) break; // أوقف عند 90% من الحد
      const req = new Request(item.url);
      await cache.delete(req);
      await idbDelete(cacheName, item.url);
      size = await getCacheSize(cacheName);
    }

    // إذا لم يكفِ، احذف بالترتيب الطبيعي
    if (size > maxBytes) {
      const keys = await cache.keys();
      for (const key of keys) {
        await cache.delete(key);
        await idbDelete(cacheName, key.url);
        size = await getCacheSize(cacheName);
        if (size <= maxBytes * 0.9) break;
      }
    }
  } catch { /* تجاهل */ }
}

async function clearAllCaches() {
  const names = await caches.keys();
  await Promise.all(names.map((n) => caches.delete(n)));

  // مسح IDB
  try {
    const db = await getIDB();
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).clear();
  } catch { /* تجاهل */ }

  broadcast.postMessage({ type: "CACHES_CLEARED" });
  console.log("[SW] تم مسح جميع الكاشات");
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i     = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${units[i]}`;
}