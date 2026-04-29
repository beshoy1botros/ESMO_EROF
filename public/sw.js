/**
 * ESMO_EROF Service Worker — Offline-First Edition
 *
 * ✅ الإصلاحات الجوهرية في هذه النسخة:
 * ─────────────────────────────────────────────────────────────────────────────
 * 🔴 FIX 1: buildRangedResponse → Streaming بدل blob()
 *    السبب: blob() كانت تحمّل الفيديو كله في الذاكرة (مثلاً 300MB دفعة واحدة)
 *    على الموبايل ده بيفشل صامتاً → لا 206 response → الفيديو مش بيشتغل
 *    الحل: TransformStream يقرأ بايت بايت بدون تحميل الكل
 *
 * 🔴 FIX 2: تخزين الفيديو مع Content-Length + Accept-Ranges مضمونة
 *    السبب: لو الـ response المخزنة مالهاش Content-Length، مش ممكن نعمل range
 *    الحل: إعادة بناء الـ response بعد التخزين مع inject الـ headers الناقصة
 *
 * 🔴 FIX 3: تنظيف الـ URL قبل البحث في الكاش
 *    السبب: LazyVideo بتضيف ?_cb=timestamp → مطابقة خاطئة → cache miss دايماً
 *    الحل: نشيل الـ query string قبل البحث والتخزين
 *
 * 🟡 FIX 4: منع إعادة التخزين لو الفيديو موجود بالفعل (مش offline)
 *    السبب: SWR كان بيعيد تحميل الفيديو كل مرة في الخلفية حتى لو موجود
 *
 * � FIX 5: تجاوز كاش الـ CDN الملوث (CORS Fix)
 *    السبب: طلبات الفيديوهات بدون CORS كانت تلوث كاش الـ CDN/Browser وتمنع التخزين المسبق.
 *    الحل: استخدام cache: 'no-store' و query param عشوائي لإجبار السيرفر على إرسال Headers صحيحة.
 *
 * 🟡 FIX 6: إبلاغ التطبيق بحالة persist()
 */

// ─── إصدارات الكاش ───────────────────────────────────────────────────────────
const CACHE_VERSION = "esmo-erof-v15"; // ✅ تم التحديث لـ v15

// ✅ جعل جميع الكاشات ثابتة لضمان بقاء البرنامج يعمل بدون نت للأبد حتى مع التحديثات
const STATIC_CACHE = `esmo-erof-permanent-static`;
const FONT_CACHE = `esmo-erof-permanent-fonts`;
const IMAGE_CACHE = `esmo-erof-permanent-images`;
const VIDEO_CACHE = `esmo-erof-permanent-videos`;

const VALID_CACHES = [STATIC_CACHE, FONT_CACHE, IMAGE_CACHE, VIDEO_CACHE];

// ─── حدود التخزين (بالبايت) ──────────────────────────────────────────────────
const MAX_VIDEO_CACHE_SIZE = 2 * 1024 ** 3; // 2 GB
const MAX_IMAGE_CACHE_SIZE = 100 * 1024 ** 2; // 100 MB
const MAX_STATIC_CACHE_SIZE = 50 * 1024 ** 2; // 50 MB
const MAX_FONT_CACHE_SIZE = 10 * 1024 ** 2; // 10 MB

// ─── الصفحات والأصول للتخزين المسبق ─────────────────────────────────────────
const PAGES_TO_PRECACHE = [
  "/",
  "/melodies",
  "/about",
  "/preparatory",
  "/index.html",
  "/melodies/index.html",
  "/about/index.html",
  "/preparatory/index.html",
];
const CRITICAL_ASSETS = ["/", "/index.html"];
const GOOGLE_FONTS = [
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Coptic&family=Noto+Sans+Arabic:wght@400;700&display=swap",
];

// ─── BroadcastChannel ────────────────────────────────────────────────────────
const broadcast = new BroadcastChannel("sw-updates");

// ─── IndexedDB للـ LRU ────────────────────────────────────────────────────────
const IDB_NAME = "sw-lru-store";
const IDB_VERSION = 1;
const IDB_STORE = "lru";
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
    req.onsuccess = (e) => {
      _idb = e.target.result;
      resolve(_idb);
    };
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(cacheName, url) {
  try {
    const db = await getIDB();
    const key = `${cacheName}:${url}`;
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put({ key, cacheName, url, ts: Date.now() });
  } catch {
    /* تجاهل */
  }
}

async function idbGetLRU(cacheName, count) {
  try {
    const db = await getIDB();
    const tx = db.transaction(IDB_STORE, "readonly");
    const index = tx.objectStore(IDB_STORE).index("ts");
    const items = [];
    return new Promise((resolve) => {
      const req = index.openCursor();
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (!cursor) {
          resolve(items);
          return;
        }
        if (cursor.value.cacheName === cacheName) items.push(cursor.value);
        if (items.length < count) cursor.continue();
        else resolve(items);
      };
      req.onerror = () => resolve(items);
    });
  } catch {
    return [];
  }
}

async function idbDelete(cacheName, url) {
  try {
    const db = await getIDB();
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(`${cacheName}:${url}`);
  } catch {
    /* تجاهل */
  }
}

// ─── Min-Heap Priority Queue ──────────────────────────────────────────────────
class MinHeap {
  constructor() {
    this._data = [];
  }
  push(item) {
    this._data.push(item);
    this._bubbleUp(this._data.length - 1);
  }
  pop() {
    if (!this._data.length) return null;
    const top = this._data[0];
    const last = this._data.pop();
    if (this._data.length) {
      this._data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }
  peek() {
    return this._data[0] ?? null;
  }
  get size() {
    return this._data.length;
  }
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
      let min = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this._data[l].priority < this._data[min].priority) min = l;
      if (r < n && this._data[r].priority < this._data[min].priority) min = r;
      if (min === i) break;
      [this._data[min], this._data[i]] = [this._data[i], this._data[min]];
      i = min;
    }
  }
}

const prewarmHeap = new MinHeap();
const prewarmInSet = new Set();
let prewarmActive = false;

// لتجنب تكرار جلب نفس الفيديو في نفس الوقت
const activeVideoFetches = new Map();

// ─── فحص جودة الشبكة ─────────────────────────────────────────────────────────
function isSlowNetwork() {
  const conn = self.navigator?.connection;
  if (!conn) return false;
  return (
    ["slow-2g", "2g"].includes(conn.effectiveType) || conn.saveData === true
  );
}

// ─── ✅ دالة مساعدة: تنظيف URL من Cache Busters ──────────────────────────────
/**
 * نشيل أي query string زيادة (?_cb=... أو غيرها) عشان نضمن تطابق الكاش
 * الفيديو المخزن بـ /video.mp4 مش هيتلاقى لو طلبناه بـ /video.mp4?_cb=1234
 */
function cleanVideoUrl(url) {
  try {
    const u = new URL(url);
    // احتفظ بالـ query parameters الأصلية إلا لو كانت cache buster فقط
    u.searchParams.delete("_cb");
    // لو بعد الحذف ما فيش params تانية، ارجع الـ URL بدون query string
    if ([...u.searchParams.keys()].length === 0) {
      return u.origin + u.pathname;
    }
    return u.toString();
  } catch {
    // لو URL مش صالح، ارجعه زي ما هو
    return url.split("?")[0];
  }
}

// ─── تثبيت Service Worker ─────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  console.log(`[SW] تثبيت ${CACHE_VERSION}`);
  event.waitUntil(
    (async () => {
      // 1. طلب تخزين دائم
      try {
        const granted = await self.navigator.storage?.persist();
        console.log(
          `[SW] Storage persist: ${granted ? "✅ ممنوح" : "⚠️ مرفوض"}`,
        );
        // أبلغ التطبيق بالنتيجة فور التفعيل
        broadcast.postMessage({
          type: "STORAGE_PERSIST_STATUS",
          granted: granted ?? false,
          warning: !granted
            ? "التخزين غير دائم — أضف التطبيق لشاشة الرئيسية لضمان بقاء الفيديوهات offline"
            : null,
        });
      } catch {
        /* تجاهل */
      }

      // 2. تخزين الأصول الحرجة
      const staticCache = await caches.open(STATIC_CACHE);
      await staticCache.addAll(CRITICAL_ASSETS).catch(() => {});

      // 3. تخزين الخطوط والصفحات بالتوازي
      const [fontCache] = await Promise.all([
        caches.open(FONT_CACHE),
        Promise.allSettled(
          PAGES_TO_PRECACHE.map((p) => staticCache.add(p).catch(() => {})),
        ),
      ]);

      await Promise.allSettled(
        GOOGLE_FONTS.map((url) =>
          fetch(url)
            .then((r) => fontCache.put(url, r))
            .catch(() => {}),
        ),
      );

      console.log("[SW] اكتمل التثبيت");
      await self.skipWaiting();
    })(),
  );
});

// ─── تفعيل Service Worker ─────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  console.log(`[SW] تفعيل النسخة الجديدة: ${CACHE_VERSION}`);
  event.waitUntil(
    (async () => {
      const allCaches = await caches.keys();

      await Promise.all(
        allCaches.map((name) => {
          // إذا كان الكاش ضمن القائمة الصالحة الحالية، لا تحذفه
          if (VALID_CACHES.includes(name)) return null;

          // ✅ حماية كاشات الفيديوهات والصور والخطوط والملفات الثابتة القديمة (Migration)
          if (
            name.includes("-videos") ||
            name.includes("-images") ||
            name.includes("-fonts") ||
            name.includes("-static")
          ) {
            console.log(
              "[SW] اكتشاف كاش قديم سيتم دمجه في الكاش الثابت:",
              name,
            );
            return migrateToPermanentCache(name);
          }

          console.log("[SW] حذف كاش قديم غير معروف:", name);
          return caches.delete(name);
        }),
      );
      await self.clients.claim();
      broadcast.postMessage({ type: "SW_ACTIVATED", version: CACHE_VERSION });
      console.log("[SW] تمت السيطرة على التطبيق بالنسخة الجديدة");
    })(),
  );
});

/**
 * دالة لنقل الملفات من الكاشات القديمة إلى الكاشات الثابتة الجديدة
 */
async function migrateToPermanentCache(oldCacheName) {
  const oldCache = await caches.open(oldCacheName);
  const keys = await oldCache.keys();

  let targetCacheName;
  if (oldCacheName.includes("-videos")) targetCacheName = VIDEO_CACHE;
  else if (oldCacheName.includes("-images")) targetCacheName = IMAGE_CACHE;
  else if (oldCacheName.includes("-fonts")) targetCacheName = FONT_CACHE;
  else if (oldCacheName.includes("-static")) targetCacheName = STATIC_CACHE;
  else return caches.delete(oldCacheName);

  const targetCache = await caches.open(targetCacheName);

  await Promise.all(
    keys.map(async (request) => {
      const response = await oldCache.match(request);
      if (response) {
        await targetCache.put(request, response);
      }
    }),
  );

  console.log(`[SW] تم نقل محتويات ${oldCacheName} إلى ${targetCacheName}`);
  return caches.delete(oldCacheName);
}

// ─── اعتراض الطلبات ──────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!url.protocol.startsWith("http")) return;
  if (url.pathname.includes("manifest.json")) return;
  if (url.hostname.includes("api.countapi.xyz")) return;
  if (request.method !== "GET") return;

  if (isVideoRequest(request)) {
    event.respondWith(handleVideoRequest(request));
    return;
  }
  if (
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com")
  ) {
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

  event.respondWith(
    fetch(request).catch(() => new Response(null, { status: 503 })),
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// ✅ FIX 1+2+3: معالجة طلبات الفيديو — الإصلاح الجوهري
// ═══════════════════════════════════════════════════════════════════════════════

async function handleVideoRequest(request) {
  const cache = await caches.open(VIDEO_CACHE);
  // ✅ FIX 3: نظّف الـ URL من cache busters قبل البحث
  const cleanUrl = cleanVideoUrl(request.url);
  const cleanReq = new Request(cleanUrl, { method: "GET" });
  const rangeHeader = request.headers.get("range");

  // ── بحث في الكاش (البحث في كل كاشات الفيديوهات المتاحة) ────────────────────────
  let cachedResponse = await cache.match(cleanReq);

  if (!cachedResponse) {
    // البحث في الكاشات القديمة إذا لم يوجد في الكاش الحالي
    const allCaches = await caches.keys();
    for (const name of allCaches) {
      if (name.includes("-videos") && name !== VIDEO_CACHE) {
        const oldCache = await caches.open(name);
        cachedResponse = await oldCache.match(cleanReq);
        if (cachedResponse) {
          console.log(`[SW] تم العثور على الفيديو في كاش قديم: ${name}`);
          // اختيارياً: نقل الفيديو للكاش الجديد
          cache.put(cleanReq, cachedResponse.clone());
          break;
        }
      }
    }
  }

  if (cachedResponse) {
    // تأكد إن الـ response الجاية من الكاش صالحة
    if (!cachedResponse.ok && cachedResponse.status !== 206) {
      console.warn("[SW] كاش تالف، حذف وإعادة جلب:", cleanUrl);
      await cache.delete(cleanReq);
      await idbDelete(VIDEO_CACHE, cleanUrl);
      return fetchVideoFromNetwork(request, cache, cleanReq, cleanUrl);
    }

    idbPut(VIDEO_CACHE, cleanUrl);

    if (rangeHeader) {
      // ✅ FIX 1: Streaming Range — بدون تحميل الفيديو كله في الذاكرة
      const ranged = await buildRangedResponseStreaming(
        cachedResponse,
        rangeHeader,
      );
      if (ranged) return ranged;
      // Fallback: ارجع الملف كاملاً، المتصفح يتعامل معاه
      console.warn("[SW] Range fallback → 200 كامل");
      return cachedResponse;
    }

    // ✅ FIX 4: SWR فقط لو الفيديو مش offline وفيه شبكة
    if (navigator.onLine && !isSlowNetwork()) {
      fetchAndCacheVideo(cleanUrl, cache, cleanReq).catch(() => {});
    }
    return cachedResponse;
  }

  // ── مش في الكاش → جلب من الشبكة ──────────────────────────────────────────
  return fetchVideoFromNetwork(request, cache, cleanReq, cleanUrl);
}

// ─── ✅ FIX 1: Streaming Range Response — قلب الحل ───────────────────────────
/**
 * يخدم جزء من فيديو مخزن بدون تحميله كله في الذاكرة.
 *
 * الفرق عن النسخة القديمة:
 *   قديم → blob() → يحمّل 300MB+ في RAM → OOM على الموبايل → null → فشل
 *   جديد → ReadableStream → يقرأ chunk بـ chunk → لا استهلاك ذاكرة زيادة
 */
async function buildRangedResponseStreaming(fullResponse, rangeHeader) {
  try {
    const rangeMatch = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
    if (!rangeMatch) return null;

    const contentLength = fullResponse.headers.get("content-length");
    if (!contentLength) {
      // بدون Content-Length مش نعرف نحسب النطاق → ارجع null
      console.warn("[SW] Content-Length مفقود — لا يمكن بناء Range response");
      return null;
    }

    const total = parseInt(contentLength, 10);
    const start = parseInt(rangeMatch[1], 10);
    const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : total - 1;
    const safeEnd = Math.min(end, total - 1);
    const needed = safeEnd - start + 1;

    // نطاق غير صالح
    if (start >= total || needed <= 0) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${total}` },
      });
    }

    // ✅ TransformStream: لا blob، لا ArrayBuffer كامل في الذاكرة
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = fullResponse.body.getReader();

    // شغّل القراءة في الخلفية
    (async () => {
      let position = 0; // بايت قرأناه من أول الملف
      let bytesWritten = 0; // بايت كتبناه في الـ stream

      try {
        while (bytesWritten < needed) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStart = position;
          const chunkEnd = position + value.length - 1;
          position += value.length;

          // هذا الـ chunk قبل النطاق المطلوب → تجاهله كاملاً
          if (chunkEnd < start) continue;

          // هذا الـ chunk بعد نهاية النطاق → وقّف
          if (chunkStart > safeEnd) break;

          // احسب التقاطع بين الـ chunk والنطاق المطلوب
          const sliceFrom = Math.max(0, start - chunkStart);
          const sliceTo = Math.min(value.length, safeEnd - chunkStart + 1);
          const slice = value.subarray(sliceFrom, sliceTo);

          await writer.write(slice);
          bytesWritten += slice.length;
        }
      } catch (err) {
        // تجاهل أخطاء الإلغاء العادية (AbortError) أو الأخطاء غير المعرفة
        if (err && err.name !== "AbortError") {
          console.error("[SW] Stream error:", err);
        }
      } finally {
        try {
          await writer.close();
        } catch {
          /* تجاهل */
        }
        try {
          await reader.cancel();
        } catch {
          /* تجاهل */
        }
      }
    })();

    return new Response(readable, {
      status: 206,
      headers: {
        "Content-Type": fullResponse.headers.get("Content-Type") ?? "video/mp4",
        "Content-Range": `bytes ${start}-${safeEnd}/${total}`,
        "Content-Length": String(needed),
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err) {
    console.error("[SW] buildRangedResponseStreaming خطأ:", err);
    return null;
  }
}

// ─── ✅ FIX 2: تخزين الفيديو مع ضمان Content-Length + Accept-Ranges ──────────
/**
 * المشكلة: لو الـ response المخزنة مالهاش Content-Length،
 * مش هنقدر نعمل range requests من الكاش → الفيديو لن يعمل offline.
 *
 * الحل: بعد ما نجيب الفيديو من الشبكة، لو Content-Length ناقص،
 * نقرأ الـ body ونحسب الحجم بنفسنا ونحط الـ headers يدوياً.
 */
async function fetchVideoFromNetwork(request, cache, cleanReq, cleanUrl) {
  const slow = isSlowNetwork();
  const targetUrl = cleanUrl ?? request.url;

  const corsOptions = {
    method: "GET",
    mode: "cors",
    credentials: "omit",
    headers: {},
  };

  try {
    let response = await fetch(new Request(targetUrl, corsOptions));

    // إذا فشل الطلب الأول (احتمال تلوث الكاش)، جرب مع bypass
    if (!response.ok && response.status !== 404) {
      const bypassUrl =
        targetUrl +
        (targetUrl.includes("?") ? "&" : "?") +
        "cors_retry=" +
        Date.now();
      response = await fetch(
        new Request(bypassUrl, { ...corsOptions, cache: "no-store" }),
      );
    }

    if (response.ok && !slow) {
      const withinLimit = await isWithinQuota(MAX_VIDEO_CACHE_SIZE);
      if (withinLimit) {
        // استخدام fetchAndCacheVideo لضمان عدم التكرار
        fetchAndCacheVideo(cleanUrl || request.url, cache, cleanReq).catch(
          () => {},
        );
      }
    }

    return response;
  } catch (error) {
    if (error.name === "TypeError" && !navigator.onLine) {
      // نحن في وضع الأوفلاين والفيديو غير مخزن
    } else {
      console.error(
        "[SW] فشل جلب الفيديو من الشبكة (احتمال مشكلة CORS):",
        error,
      );
      console.warn(
        "[SW] ⚠️ تنبيه: يجب إضافة Origin 'https://esmo-erof.vercel.app' في إعدادات Cloudflare R2 bucket CORS.",
      );
    }
    return new Response(null, { status: 503 });
  }
}

/**
 * يخزّن الفيديو مع إضافة Content-Length و Accept-Ranges إن كانا غائبَين.
 * هذا هو ما يضمن قدرتنا على Range requests لاحقاً من الكاش.
 */
async function cacheVideoWithHeaders(response, cache, cleanReq, cleanUrl) {
  const existingCL = response.headers.get("content-length");
  const isVideo = isVideoRequest({ url: cleanUrl || cleanReq.url });

  let finalResponse;

  if (existingCL && (isVideo ? response.headers.get("accept-ranges") : true)) {
    // ✅ الـ headers موجودة → خزّن مباشرة
    finalResponse = response;
  } else {
    // ⚠️ الـ headers ناقصة → اقرأ الـ body وحسب الحجم
    const bodyBuffer = await response.arrayBuffer();
    const size = bodyBuffer.byteLength;

    const headers = new Headers(response.headers);
    headers.set("Content-Length", String(size));

    if (isVideo) {
      headers.set("Accept-Ranges", "bytes");
      if (!headers.get("content-type")) {
        headers.set("Content-Type", "video/mp4");
      }
    } else if (!headers.get("content-type")) {
      // محاولة استنتاج نوع الصورة من الامتداد
      const url = cleanUrl || cleanReq.url;
      if (url.endsWith(".png")) headers.set("Content-Type", "image/png");
      else if (url.endsWith(".jpg") || url.endsWith(".jpeg"))
        headers.set("Content-Type", "image/jpeg");
      else if (url.endsWith(".webp")) headers.set("Content-Type", "image/webp");
      else headers.set("Content-Type", "image/jpeg");
    }

    finalResponse = new Response(bodyBuffer, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  await cache.put(cleanReq, finalResponse);
  await idbPut(isVideo ? VIDEO_CACHE : IMAGE_CACHE, cleanUrl ?? cleanReq.url);
  console.log(
    `[SW] ✅ تم التخزين بنجاح (${isVideo ? "فيديو" : "صورة"}):`,
    cleanReq.url,
  );
}

async function fetchAndCacheVideo(url, cache, cleanReq) {
  const cleanUrl = cleanVideoUrl(url);
  if (activeVideoFetches.has(cleanUrl)) return activeVideoFetches.get(cleanUrl);

  const fetchPromise = (async () => {
    // إضافة query param لتجاوز كاش الـ CDN الذي قد يكون ملوثاً بطلبات No-CORS
    const bypassUrl =
      cleanUrl +
      (cleanUrl.includes("?") ? "&" : "?") +
      "cors_fix=" +
      Date.now();
    const corsReq = new Request(bypassUrl, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store", // إجبار المتصفح على جلب نسخة جديدة من السيرفر
      referrerPolicy: "no-referrer",
    });
    try {
      const response = await fetch(corsReq);
      if (response.ok) {
        await cacheVideoWithHeaders(response, cache, cleanReq, cleanUrl);
      }
    } catch (err) {
      if (err.name === "TypeError" && navigator.onLine) {
        console.warn(
          `[SW] فشل التخزين المسبق لـ ${cleanUrl} بسبب CORS. يرجى مراجعة إعدادات R2.`,
        );
      }
    } finally {
      activeVideoFetches.delete(cleanUrl);
    }
  })();

  activeVideoFetches.set(cleanUrl, fetchPromise);
  return fetchPromise;
}

// ─── الملفات الثابتة — Stale-While-Revalidate ────────────────────────────────
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  idbPut(STATIC_CACHE, request.url);

  if (cached) {
    fetch(request)
      .then((r) => r.ok && cache.put(request, r.clone()))
      .catch(() => {});
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response(null, { status: 503 });
  }
}

// ─── الصور — Cache-First + SWR ───────────────────────────────────────────────
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  idbPut(IMAGE_CACHE, request.url);

  if (cached) {
    fetch(request)
      .then((r) => r.ok && cache.put(request, r.clone()))
      .catch(() => {});
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
    return new Response(
      Uint8Array.from(
        atob("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"),
        (c) => c.charCodeAt(0),
      ),
      { headers: { "Content-Type": "image/gif" } },
    );
  }
}

// ─── الخطوط — Cache-First دائم ───────────────────────────────────────────────
async function handleFontRequest(request) {
  const cache = await caches.open(FONT_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response(null, { status: 503 });
  }
}

// ─── الصفحات — Network-First مع Fallback ─────────────────────────────────────
async function handlePageRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      cache.put(request, response.clone());
      return response;
    }
  } catch {
    /* Fallback */
  }

  return (
    (await cache.match(request)) ??
    (await caches.match("/")) ??
    new Response(null, { status: 503 })
  );
}

// ─── Min-Heap Prewarm ─────────────────────────────────────────────────────────
function enqueuePrewarm(url, priority = 5) {
  if (!url || prewarmInSet.has(url)) return;
  prewarmInSet.add(url);
  prewarmHeap.push({ url, priority });
}

async function processPrewarmQueue() {
  if (prewarmActive) return;
  prewarmActive = true;

  try {
    const videoCache = await caches.open(VIDEO_CACHE);
    const imageCache = await caches.open(IMAGE_CACHE);
    const CONCURRENT = isSlowNetwork() ? 1 : 3;

    while (prewarmHeap.size > 0) {
      const batch = [];
      for (let i = 0; i < CONCURRENT && prewarmHeap.size > 0; i++) {
        batch.push(prewarmHeap.pop().url);
      }

      await Promise.allSettled(
        batch.map(async (rawUrl) => {
          try {
            const url = cleanVideoUrl(rawUrl);
            const isVideo = isVideoRequest({ url });
            const cache = isVideo ? videoCache : imageCache;

            const cleanReq = new Request(url, {
              mode: "cors",
              credentials: "omit",
            });

            const exists = await cache.match(cleanReq);
            if (!exists) {
              // استخدام fetchAndCacheVideo بدلاً من الجلب المباشر لضمان عدم التكرار
              await fetchAndCacheVideo(url, cache, cleanReq);
            }
          } catch {
            /* تجاهل */
          } finally {
            prewarmInSet.delete(rawUrl);
          }
        }),
      );

      if (prewarmHeap.size > 0) await sleep(100);
    }
  } finally {
    prewarmActive = false;
    enforceLRULimit(VIDEO_CACHE, MAX_VIDEO_CACHE_SIZE).catch(() => {});
    enforceLRULimit(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE).catch(() => {});
  }
}

// ─── Background Fetch ─────────────────────────────────────────────────────────
async function startBackgroundFetch(id, urls, options = {}) {
  try {
    if (!self.registration.backgroundFetch) return false;
    const existing = await self.registration.backgroundFetch.get(id);
    if (existing) return true;
    await self.registration.backgroundFetch.fetch(id, urls, {
      title: options.title ?? "تحميل فيديو",
      icons: options.icons ?? [],
      downloadTotal: options.downloadTotal ?? 0,
    });
    return true;
  } catch {
    return false;
  }
}

self.addEventListener("backgroundfetchsuccess", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VIDEO_CACHE);
      const records = await event.registration.matchAll();
      await Promise.allSettled(
        records.map(async (record) => {
          const response = await record.responseReady;
          if (response.ok) {
            const url = cleanVideoUrl(record.request.url);
            const cleanReq = new Request(url, { method: "GET" });
            await cacheVideoWithHeaders(response, cache, cleanReq, url);
          }
        }),
      );
      broadcast.postMessage({
        type: "BACKGROUND_FETCH_DONE",
        id: event.registration.id,
      });
    })(),
  );
});

// ─── معالجة رسائل التطبيق ────────────────────────────────────────────────────
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
        event.waitUntil(
          (async () => {
            urls.forEach((u) => enqueuePrewarm(u, 5));
            await processPrewarmQueue();
          })(),
        );
      }
      break;
    }

    case "PREWARM_VIDEOS_PRIORITY": {
      const urls = toStringArray(data.urls);
      if (urls.length) {
        event.waitUntil(
          (async () => {
            urls.forEach((u) => enqueuePrewarm(u, 0));
            await processPrewarmQueue();
          })(),
        );
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
      event.waitUntil(
        (async () => {
          try {
            const cache = await caches.open(VIDEO_CACHE);
            const clean = cleanVideoUrl(urlToEvict);
            const target = new URL(clean);
            const keys = await cache.keys();
            await Promise.all(
              keys.map(async (req) => {
                const rUrl = new URL(req.url);
                if (
                  rUrl.origin === target.origin &&
                  rUrl.pathname === target.pathname
                ) {
                  await cache.delete(req);
                  await idbDelete(VIDEO_CACHE, req.url);
                }
              }),
            );
          } catch {
            /* تجاهل */
          }
        })(),
      );
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
          type: "CACHE_SIZE",
          static: formatBytes(s),
          video: formatBytes(v),
          image: formatBytes(img),
          font: formatBytes(f),
          total: formatBytes(s + v + img + f),
          rawBytes: { static: s, video: v, image: img, font: f },
        });
      });
      break;
    }

    // ✅ طلب إعادة فحص حالة الـ persist
    case "CHECK_PERSIST": {
      event.waitUntil(
        (async () => {
          try {
            const persisted = await self.navigator.storage?.persisted();
            ports[0]?.postMessage({
              type: "PERSIST_STATUS",
              persisted: persisted ?? false,
            });
          } catch {
            ports[0]?.postMessage({ type: "PERSIST_STATUS", persisted: false });
          }
        })(),
      );
      break;
    }

    default:
      break;
  }
});

// ─── دوال مساعدة ──────────────────────────────────────────────────────────────

function isVideoRequest(req) {
  return /\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i.test(req.url);
}
function isImageRequest(req) {
  return /\.(jpg|jpeg|png|webp|gif|svg|ico|avif)(\?|$)/i.test(req.url);
}
function isStaticAsset(req) {
  return (
    /\.(css|js|woff2?|ttf|eot)(\?|$)/i.test(req.url) ||
    req.url.includes("/assets/")
  );
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function isWithinQuota(needed) {
  try {
    const { quota, usage } = await self.navigator.storage.estimate();
    return quota - usage > needed * 0.1;
  } catch {
    return true;
  }
}

async function getCacheSize(cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    let total = 0;
    let unknownCount = 0;

    for (const key of keys) {
      const resp = await cache.match(key, { ignoreVary: true });
      if (!resp) continue;
      const cl = resp.headers.get("content-length");
      if (cl) {
        total += parseInt(cl, 10);
      } else if (unknownCount++ < 20) {
        try {
          const blob = await resp.clone().blob();
          total += blob.size;
        } catch {
          /* تجاهل */
        }
      }
    }
    return total;
  } catch {
    return 0;
  }
}

async function enforceLRULimit(cacheName, maxBytes) {
  try {
    let size = await getCacheSize(cacheName);
    if (size <= maxBytes) return;

    const cache = await caches.open(cacheName);
    const victims = await idbGetLRU(cacheName, 20);

    for (const item of victims) {
      if (size <= maxBytes * 0.9) break;
      const req = new Request(item.url);
      await cache.delete(req);
      await idbDelete(cacheName, item.url);
      size = await getCacheSize(cacheName);
    }

    if (size > maxBytes) {
      const keys = await cache.keys();
      for (const key of keys) {
        await cache.delete(key);
        await idbDelete(cacheName, key.url);
        size = await getCacheSize(cacheName);
        if (size <= maxBytes * 0.9) break;
      }
    }
  } catch {
    /* تجاهل */
  }
}

async function clearAllCaches() {
  const names = await caches.keys();
  await Promise.all(names.map((n) => caches.delete(n)));
  try {
    const db = await getIDB();
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).clear();
  } catch {
    /* تجاهل */
  }
  broadcast.postMessage({ type: "CACHES_CLEARED" });
  console.log("[SW] تم مسح جميع الكاشات");
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${units[i]}`;
}
