// Service Worker - استراتيجية محسّنة للعمل بدون نت (مع تخزين الفيديوهات)
const CACHE_VERSION = "esmo-erof-v4";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const FONT_CACHE = `${CACHE_VERSION}-fonts`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const VIDEO_CACHE = `${CACHE_VERSION}-videos`;

// ✅ قائمة الكاشات الصالحة - تُستخدم لحذف القديمة بشكل صحيح
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

// تثبيت Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: تثبيت جديد");

  event.waitUntil(
    Promise.all([
      // تخزين الملفات الحرجة
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Service Worker: تخزين الملفات الثابتة");
        return cache.addAll(CRITICAL_ASSETS).catch((error) => {
          console.warn("Service Worker: بعض الملفات لم يتم تخزينها:", error);
        });
      }),
      // تخزين Google Fonts مسبقاً
      caches.open(FONT_CACHE).then((cache) => {
        console.log("Service Worker: تخزين الخطوط");
        return Promise.all(
          GOOGLE_FONTS.map((fontUrl) =>
            fetch(fontUrl)
              .then((response) => cache.put(fontUrl, response))
              .catch((error) =>
                console.warn("Service Worker: فشل تحميل الخط:", fontUrl, error)
              )
          )
        );
      }),
    ]).then(() => {
      console.log("Service Worker: تم التثبيت بنجاح");
      return caches.open(STATIC_CACHE).then(async (cache) => {
        for (const page of PAGES_TO_PRECACHE) {
          try {
            await cache.add(page);
            console.log("Service Worker: تم تخزين:", page);
          } catch (e) {
            console.warn("Service Worker: فشل تخزين:", page, e);
          }
        }
        console.log("Service Worker: اكتمل تخزين الصفحات");
        return self.skipWaiting();
      });
    })
  );
});

// تفعيل Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: تفعيل");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // ✅ إصلاح: احذف أي كاش غير موجود في القائمة الصالحة الحالية
            if (!VALID_CACHES.includes(cacheName)) {
              console.log(
                "Service Worker: حذف الذاكرة المؤقتة القديمة:",
                cacheName
              );
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(async () => {
        // ✅ احسب الأحجام الحالية عند البدء باستخدام storage.estimate
        await refreshCacheSizeEstimate();
        console.log("Service Worker: تم التفعيل بنجاح");
        return self.clients.claim();
      })
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

async function handlePageRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.warn("Service Worker: فشل جلب الصفحة من الإنترنت:", request.url);
  }

  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log("Service Worker: خدمة الصفحة من الذاكرة المؤقتة:", request.url);
    return cachedResponse;
  }

  const homeResponse = await caches.match("/");
  return homeResponse || new Response("الصفحة غير متاحة", { status: 503 });
}

async function handleVideoRequest(request) {
  const hasRange = request.headers && request.headers.get("range");
  const cache = await caches.open(VIDEO_CACHE);

  // عند وجود Range: مرّر الطلب مباشرة ولا تخزّن
  if (hasRange) {
    try {
      return await fetch(request);
    } catch (error) {
      console.error("Service Worker: فشل تحميل الفيديو (Range):", error);
      return new Response("فيديو غير متاح", { status: 503 });
    }
  }

  const urlOnlyReq = new Request(request.url, { method: "GET" });
  const cachedResponse = await cache.match(urlOnlyReq);

  if (cachedResponse) {
    if (
      cachedResponse.status === 206 ||
      cachedResponse.headers.get("content-range")
    ) {
      await cache.delete(urlOnlyReq).catch(() => {});
    } else {
      console.log("Service Worker: تشغيل الفيديو من الذاكرة:", request.url);
      return cachedResponse;
    }
  }

  try {
    console.log("Service Worker: تحميل الفيديو من الإنترنت:", request.url);
    const response = await fetch(request);

    if (
      response &&
      response.ok &&
      response.status === 200 &&
      !response.headers.get("content-range")
    ) {
      // ✅ استخدم storage.estimate بدلاً من حساب blob لكل ملف
      const withinLimit = await isWithinCacheLimit(MAX_VIDEO_CACHE_SIZE);
      if (withinLimit) {
        await cache.put(urlOnlyReq, response.clone());
        console.log("Service Worker: تم تخزين الفيديو:", request.url);
        await refreshCacheSizeEstimate();
      } else {
        console.warn("Service Worker: ذاكرة الفيديو امتلأت:", request.url);
      }
    }

    return response;
  } catch (error) {
    console.error("Service Worker: فشل تحميل الفيديو:", error);
    return new Response("فيديو غير متاح", { status: 503 });
  }
}

async function handleFontRequest(request) {
  const cache = await caches.open(FONT_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    fetch(request)
      .then((response) => {
        if (response.ok) cache.put(request, response);
      })
      .catch(() => {});
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const withinLimit = await isWithinCacheLimit(MAX_FONT_CACHE_SIZE);
      if (withinLimit) {
        cache.put(request, response.clone());
        await refreshCacheSizeEstimate();
      }
      return response;
    }
  } catch (error) {
    console.warn("Service Worker: فشل تحميل الخط:", request.url);
  }

  return new Response("", { status: 504 });
}

async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) return cachedResponse;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const withinLimit = await isWithinCacheLimit(MAX_IMAGE_CACHE_SIZE);
      if (withinLimit) {
        cache.put(request, response.clone());
        await refreshCacheSizeEstimate();
      }
    }
    return response;
  } catch (error) {
    console.warn("Service Worker: فشل تحميل الصورة:", request.url);
    return new Response(
      new Blob(
        [
          "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82",
        ],
        { type: "image/png" }
      ),
      { status: 200, headers: { "Content-Type": "image/png" } }
    );
  }
}

async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.warn("Service Worker: فشل جلب ملف ثابت:", request.url);
  }

  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;

  return new Response("ملف غير متاح", { status: 503 });
}

async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.warn("Service Worker: فشل الطلب:", request.url);
    return new Response("خدمة غير متاحة", { status: 503 });
  }
}

// ============= وظائف مساعدة =============

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
    url.pathname === "/" ||
    url.pathname === "/melodies" ||
    url.pathname === "/about" ||
    url.pathname === "/preparatory" ||
    (url.pathname.startsWith("/") && !url.pathname.includes("."))
  );
}

// ✅ استخدم storage.estimate() للتحقق من الحد بدلاً من حساب كل blob
async function isWithinCacheLimit(maxBytes) {
  try {
    if (self.navigator?.storage?.estimate) {
      const { usage, quota } = await self.navigator.storage.estimate();
      const available = (quota || 0) - (usage || 0);
      return available > maxBytes * 0.1; // تأكد من وجود 10% على الأقل
    }
    return true; // إذا لم تكن estimate متاحة، اسمح بالتخزين
  } catch {
    return true;
  }
}

// ✅ تحديث تقدير الحجم الكلي بكفاءة عبر storage.estimate
async function refreshCacheSizeEstimate() {
  try {
    if (self.navigator?.storage?.estimate) {
      const { usage } = await self.navigator.storage.estimate();
      cacheSizeTracker._totalEstimate = usage || 0;
    }
  } catch {
    // تجاهل
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

// تقليم الذاكرة المؤقتة للحفاظ على حد الحجم
async function enforceCacheLimit(cacheName, maxBytes) {
  try {
    let size = await getCacheSize(cacheName);
    if (size <= maxBytes) return;
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    for (const key of keys) {
      await cache.delete(key);
      size = await getCacheSize(cacheName);
      if (size <= maxBytes) break;
    }
  } catch {
    // no-op
  }
}

// حالة تسخين الفيديوهات
const PREWARM_STATE = {
  queue: [],
  running: false,
};

async function processPrewarmQueue() {
  if (PREWARM_STATE.running) return;
  PREWARM_STATE.running = true;
  try {
    const cache = await caches.open(VIDEO_CACHE);
    while (PREWARM_STATE.queue.length > 0) {
      const url = PREWARM_STATE.queue.shift();
      if (!url) continue;
      try {
        const req = new Request(url, { mode: "cors", credentials: "omit" });
        const exists = await cache.match(req);
        if (!exists) {
          const resp = await fetch(req);
          if (resp && resp.ok) {
            await cache.put(req, resp.clone());
            await enforceCacheLimit(VIDEO_CACHE, MAX_VIDEO_CACHE_SIZE);
          }
        }
      } catch {
        // تجاهل أخطاء الطلب الفردي
      }
      await new Promise((r) => setTimeout(r, 300));
    }
  } finally {
    PREWARM_STATE.running = false;
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
        })()
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
                }
              } catch {}
            })
          );
        } catch {}
      })()
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
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  console.log("Service Worker: تم حذف جميع الذاكرات المؤقتة");
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
