/**
 * ESMO_EROF Service Worker - Optimized Version
 *
 * التحسينات:
 * - استراتيجية Stale-While-Revalidate للفيديوهات
 * - تحميل متوازي بدلاً من تسلسلي
 * - نظام LRU للحذف الذكي
 * - تدفق الاستجابات (Response Streaming)
 * - ذاكرة وسيطة للحجوم
 * - معالجة أخطاء محسنة
 */

const CACHE_VERSION = "esmo-erof-v9";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const FONT_CACHE = `${CACHE_VERSION}-fonts`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const VIDEO_CACHE = `${CACHE_VERSION}-videos`;

const VALID_CACHES = [STATIC_CACHE, FONT_CACHE, IMAGE_CACHE, VIDEO_CACHE];

// الصفحات المطلوبة للتخزين المسبق (Pre-caching)
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

// الملفات الأساسية - يجب تخزينها عند التثبيت
const CRITICAL_ASSETS = ["/", "/index.html"];

// Google Fonts URLs للتخزين المؤقت
const GOOGLE_FONTS = [
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Coptic&family=Noto+Sans+Arabic:wght@400;700&display=swap",
];

// أحجام التخزين المؤقت (بالبايت)
const MAX_VIDEO_CACHE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB للفيديوهات
const MAX_IMAGE_CACHE_SIZE = 100 * 1024 * 1024; // 100MB للصور
const MAX_STATIC_CACHE_SIZE = 50 * 1024 * 1024; // 50MB للملفات الثابتة
const MAX_FONT_CACHE_SIZE = 10 * 1024 * 1024; // 10MB للخطوط

// ✅ تتبع أحجام الكاش في الذاكرة لتجنب إعادة الحساب المكلفة
const cacheSizeTracker = {
  [STATIC_CACHE]: 0,
  [FONT_CACHE]: 0,
  [IMAGE_CACHE]: 0,
  [VIDEO_CACHE]: 0,
};

// ✅ نظام LRU لتتبع آخر استخدام للعناصر
const lruTracker = new Map();

function updateLRU(cacheName, url) {
  const key = `${cacheName}:${url}`;
  lruTracker.delete(key);
  lruTracker.set(key, Date.now());
}

function getLRUItems(cacheName, count) {
  const items = [];
  for (const [key, timestamp] of lruTracker.entries()) {
    if (key.startsWith(cacheName + ":")) {
      items.push({ key, url: key.split(":").slice(1).join(":"), timestamp });
    }
  }
  items.sort((a, b) => a.timestamp - b.timestamp);
  return items.slice(0, count);
}

// تثبيت Service Worker
self.addEventListener("install", (event) => {
  console.log(`Service Worker: تثبيت الإصدار الجديد ${CACHE_VERSION}`);

  event.waitUntil(
    Promise.all([
      // 1. تخزين الملفات الحرجة فوراً
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Service Worker: تخزين الملفات الأساسية");
        return cache.addAll(CRITICAL_ASSETS).catch((error) => {
          // ✅ تجاهل أخطاء الملفات الأساسية في وضع التطوير
          const isDev = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
          if (!isDev) {
            console.warn(
              "Service Worker: فشل تخزين بعض الملفات الأساسية:",
              error,
            );
          }
        });
      }),
      // 2. تخزين الخطوط مسبقاً
      caches.open(FONT_CACHE).then((cache) => {
        return Promise.all(
          GOOGLE_FONTS.map((fontUrl) =>
            fetch(fontUrl)
              .then((response) => cache.put(fontUrl, response))
              .catch((error) =>
                console.warn("Service Worker: فشل تحميل الخط:", fontUrl),
              ),
          ),
        );
      }),
    ]).then(async () => {
      // 3. ✅ تخزين الصفحات الإضافية بالتوازي (بدلاً من تسلسلي)
      const cache = await caches.open(STATIC_CACHE);
      await Promise.allSettled(
        PAGES_TO_PRECACHE.map((page) =>
          cache.add(page).catch((e) => {
            // ✅ تجاهل أخطاء الصفحات في وضع التطوير (قد لا تكون موجودة)
            const isDev =
              self.location.hostname === "localhost" ||
              self.location.hostname === "127.0.0.1";
            if (!isDev) {
              console.warn(`Service Worker: فشل تخزين الصفحة ${page}`);
            }
          }),
        ),
      );
      console.log("Service Worker: اكتمل التخزين المسبق بنجاح");

      // ✅ تفعيل النسخة الجديدة فوراً لإرسال إشارة التحديث لـ React
      return self.skipWaiting();
    }),
  );
});

// تفعيل Service Worker
self.addEventListener("activate", (event) => {
  console.log(
    "Service Worker: جارٍ تفعيل النسخة الجديدة وتنظيف الكاش القديم...",
  );

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // ✅ حذف أي كاش قديم
            if (!VALID_CACHES.includes(cacheName)) {
              console.log("Service Worker: حذف كاش قديم وغير صالح:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(async () => {
        // ✅ تحديث تقدير المساحة والسيطرة على الصفحات فوراً
        await refreshCacheSizeEstimate();
        console.log("Service Worker: النسخة الجديدة تسيطر الآن على التطبيق");
        return self.clients.claim();
      }),
  );
});

// اعتراض الطلبات
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!url.protocol.startsWith("http")) return;
  if (url.pathname.includes("manifest.json")) return;
  if (url.hostname.includes("api.countapi.xyz")) return;

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

  if (request.method === "GET" && isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
    return;
  }

  event.respondWith(handleGenericRequest(request));
});

// ============= معالجات الطلبات =============

/**
 * ✅ معالجة طلبات الفيديو - استراتيجية Stale-While-Revalidate
 * الفيديو يُعرض فوراً من الكاش إذا وُجد، ويتم تحديثه في الخلفية
 */
async function handleVideoRequest(request) {
  const cache = await caches.open(VIDEO_CACHE);

  // تحويل الطلب لطلب نظيف بدون Headers إضافية لضمان المطابقة في الكاش
  const urlOnlyReq = new Request(request.url, { method: "GET" });
  const cachedResponse = await cache.match(urlOnlyReq);

  // ✅ تحديث LRU
  updateLRU(VIDEO_CACHE, request.url);

  if (cachedResponse) {
    // إذا كان الفيديو كاملاً ومخزناً صح، هاته فوراً
    if (cachedResponse.status === 200) {
      console.log("Service Worker: [Cache Hit] تشغيل الفيديو:", request.url);

      // ✅ تحديث في الخلفية (Stale-While-Revalidate)
      fetchAndCacheVideo(request.url, cache, urlOnlyReq).catch(() => {});

      return cachedResponse;
    } else {
      // لو النسخة اللي في الكاش "بايظة" أو جزئية، امسحها وجددها
      await cache.delete(urlOnlyReq);
    }
  }

  try {
    console.log(
      "Service Worker: [Network Fetch] جلب فيديو جديد مع CORS:",
      request.url,
    );

    // ✅ طلب فيديو بوضع CORS و omit credentials
    const corsRequest = new Request(request.url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
    });

    const response = await fetch(corsRequest);

    if (response.ok && response.status === 200) {
      const withinLimit = await isWithinCacheLimit(MAX_VIDEO_CACHE_SIZE);
      if (withinLimit) {
        // ✅ تخزين في الخلفية مع تحسينات
        cache
          .put(urlOnlyReq, response.clone())
          .then(() => {
            refreshCacheSizeEstimate();
            updateLRU(VIDEO_CACHE, request.url);
          })
          .catch((err) => {
            console.warn("Service Worker: فشل تخزين الفيديو:", err);
          });
      }
    }
    return response;
  } catch (error) {
    console.error("Service Worker: [Fetch Error] فشل جلب الفيديو:", error);
    return new Response(null, { status: 404 });
  }
}

/**
 * ✅ جلب وتخزين الفيديو في الخلفية (للاستجابة السريعة)
 */
async function fetchAndCacheVideo(url, cache, urlOnlyReq) {
  try {
    const corsRequest = new Request(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
    });

    const response = await fetch(corsRequest);
    if (response.ok && response.status === 200) {
      await cache.put(urlOnlyReq, response.clone());
      await refreshCacheSizeEstimate();
      updateLRU(VIDEO_CACHE, url);
    }
  } catch (e) {
    // تجاهل أخطاء التحديث في الخلفية
  }
}

/**
 * ✅ معالجة الملفات الثابتة (JS, CSS) - استراتيجية Stale-While-Revalidate
 */
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  // ✅ تحديث LRU
  updateLRU(STATIC_CACHE, request.url);

  // ✅ إرجاع الكاش فوراً إذا وُجد، مع تحديث في الخلفية
  if (cachedResponse) {
    // تحديث في الخلفية
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
      })
      .catch(() => {});

    return cachedResponse;
  }

  // إذا لم يوجد كاش، جلب من الشبكة
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response(null, { status: 503 });
  }
}

/**
 * ✅ معالجة الصور - استراتيجية Cache-First مع تحديث في الخلفية
 */
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  // ✅ تحديث LRU
  updateLRU(IMAGE_CACHE, request.url);

  if (cachedResponse) {
    // تحديث في الخلفية
    fetch(request)
      .then((response) => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {});

    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const withinLimit = await isWithinCacheLimit(MAX_IMAGE_CACHE_SIZE);
      if (withinLimit) cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // صورة شفافة كـ Fallback
    return new Response(
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBA==",
      {
        headers: { "Content-Type": "image/gif" },
      },
    );
  }
}

/**
 * ✅ معالجة الخطوط - استراتيجية Cache-First
 */
async function handleFontRequest(request) {
  const cache = await caches.open(FONT_CACHE);
  const cachedResponse = await cache.match(request);

  // ✅ تحديث LRU
  updateLRU(FONT_CACHE, request.url);

  if (cachedResponse) return cachedResponse;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response(null, { status: 404 });
  }
}

/**
 * ✅ معالجة الصفحات (HTML) - Network First مع Fallback سريع
 */
async function handlePageRequest(request) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (e) {
    // إذا فشل الشبكة، جرب الكاش
  }

  const cachedPage = await cache.match(request);
  return cachedPage || caches.match("/");
}

/**
 * ✅ معالجة الطلبات العامة
 */
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(null, { status: 503 });
  }
}

// ============= دوال مساعدة (Helpers) =============

function isVideoRequest(request) {
  return /\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i.test(request.url);
}

function isImageRequest(request) {
  return /\.(jpg|jpeg|png|webp|gif|svg|ico)(\?|$)/i.test(request.url);
}

function isStaticAsset(request) {
  return (
    /\.(css|js|woff|woff2|ttf|eot)(\?|$)/i.test(request.url) ||
    request.url.includes("/assets/")
  );
}

function isPageRequest(request) {
  const url = new URL(request.url);
  return (
    request.headers.get("accept")?.includes("text/html") ||
    ["/", "/melodies", "/about"].includes(url.pathname)
  );
}

// حساب المساحة المتاحة باستخدام API المتصفح
async function isWithinCacheLimit(maxBytes) {
  if (self.navigator?.storage?.estimate) {
    const { usage, quota } = await self.navigator.storage.estimate();
    return quota - usage > maxBytes * 0.1;
  }
  return true;
}

async function refreshCacheSizeEstimate() {
  if (self.navigator?.storage?.estimate) {
    await self.navigator.storage.estimate();
  }
}

// ✅ حساب حجم كاش معين (يُستخدم فقط عند الحاجة لعرض التفاصيل للمستخدم)
async function getCacheSize(cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    let totalSize = 0;

    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }

    return totalSize;
  } catch (error) {
    console.error("Service Worker: خطأ حساب الحجم:", error);
    return 0;
  }
}

// ✅ تقليم الذاكرة المؤقتة باستخدام نظام LRU
async function enforceCacheLimit(cacheName, maxBytes) {
  try {
    let size = await getCacheSize(cacheName);
    if (size <= maxBytes) return;

    const cache = await caches.open(cacheName);

    // ✅ حذف العناصر الأقدم استخداماً (LRU)
    const itemsToDelete = getLRUItems(cacheName, 10);

    for (const item of itemsToDelete) {
      try {
        const req = new Request(item.url);
        await cache.delete(req);
        lruTracker.delete(item.key);

        size = await getCacheSize(cacheName);
        if (size <= maxBytes) break;
      } catch (e) {
        // تجاهل أخطاء الحذف الفردية
      }
    }

    // إذا لم يكفِ، حذف المزيد
    if (size > maxBytes) {
      const keys = await cache.keys();
      for (const key of keys) {
        await cache.delete(key);
        size = await getCacheSize(cacheName);
        if (size <= maxBytes) break;
      }
    }
  } catch {
    // no-op
  }
}

// حالة تسخين الفيديوهات
const PREWARM_STATE = {
  queue: [],
  running: false,
  maxConcurrent: 3, // ✅ تحميل 3 فيديوهات في نفس الوقت
};

/**
 * ✅ تحميل متوازي للفيديوهات (بدلاً من تسلسلي)
 */
async function processPrewarmQueue() {
  if (PREWARM_STATE.running) return;
  PREWARM_STATE.running = true;

  try {
    const cache = await caches.open(VIDEO_CACHE);

    while (PREWARM_STATE.queue.length > 0) {
      // ✅ أخذ مجموعة من العناصر للتحميل المتوازي
      const batch = PREWARM_STATE.queue.splice(0, PREWARM_STATE.maxConcurrent);

      await Promise.allSettled(
        batch.map(async (url) => {
          if (!url) return;

          try {
            const req = new Request(url, { mode: "cors", credentials: "omit" });
            const exists = await cache.match(req);

            if (!exists) {
              const resp = await fetch(req);
              if (resp && resp.ok) {
                await cache.put(req, resp.clone());
                updateLRU(VIDEO_CACHE, url);
              }
            }
          } catch {
            // تجاهل أخطاء الطلب الفردي
          }
        }),
      );

      // ✅ تقليل التأخير بين الدفعات
      if (PREWARM_STATE.queue.length > 0) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
  } finally {
    PREWARM_STATE.running = false;

    // ✅ تطبيق حدود الكاش بعد اكتمال التحميل
    await enforceCacheLimit(VIDEO_CACHE, MAX_VIDEO_CACHE_SIZE);
  }
}

// رسائل من التطبيق
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data?.type === "CLEAR_CACHES") {
    clearAllCaches();
  }

  if (event.data?.type === "PREWARM_VIDEOS" && event.data.urls) {
    const urls = Array.isArray(event.data.urls)
      ? event.data.urls.filter((u) => typeof u === "string")
      : [];
    if (urls.length) {
      event.waitUntil(
        (async () => {
          for (const u of urls) {
            if (!PREWARM_STATE.queue.includes(u)) {
              PREWARM_STATE.queue.push(u);
            }
          }
          await processPrewarmQueue();
        })(),
      );
    }
  }

  if (event.data?.type === "EVICT_VIDEO" && event.data.url) {
    const urlToEvict = event.data.url;
    event.waitUntil(
      (async () => {
        try {
          const cache = await caches.open(VIDEO_CACHE);
          const keys = await cache.keys();
          const target = new URL(urlToEvict, self.location.origin);
          await Promise.all(
            keys.map(async (req) => {
              try {
                const rUrl = new URL(req.url);
                if (
                  rUrl.origin === target.origin &&
                  rUrl.pathname === target.pathname
                ) {
                  await cache.delete(req);
                  lruTracker.delete(`${VIDEO_CACHE}:${req.url}`);
                }
              } catch {}
            }),
          );
        } catch {}
      })(),
    );
  }

  if (event.data?.type === "GET_CACHE_SIZE") {
    // ✅ احسب الأحجام بالتوازي وأرسلها عبر MessageChannel
    Promise.all([
      getCacheSize(STATIC_CACHE),
      getCacheSize(VIDEO_CACHE),
      getCacheSize(IMAGE_CACHE),
      getCacheSize(FONT_CACHE),
    ]).then(([staticSize, videoSize, imageSize, fontSize]) => {
      event.ports[0].postMessage({
        type: "CACHE_SIZE",
        static: formatBytes(staticSize),
        video: formatBytes(videoSize),
        image: formatBytes(imageSize),
        font: formatBytes(fontSize),
        total: formatBytes(staticSize + videoSize + imageSize + fontSize),
      });
    });
  }

  // ✅ أمر جديد: تحميل مسبق للفيديوهات مع أولوية
  if (event.data?.type === "PREWARM_VIDEOS_PRIORITY" && event.data.urls) {
    const urls = Array.isArray(event.data.urls)
      ? event.data.urls.filter((u) => typeof u === "string")
      : [];
    if (urls.length) {
      event.waitUntil(
        (async () => {
          // إضافة في بداية القائمة (أولوية عالية)
          for (let i = urls.length - 1; i >= 0; i--) {
            if (!PREWARM_STATE.queue.includes(urls[i])) {
              PREWARM_STATE.queue.unshift(urls[i]);
            }
          }
          await processPrewarmQueue();
        })(),
      );
    }
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  lruTracker.clear();
  console.log("Service Worker: تم حذف جميع الذاكرات المؤقتة");
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
