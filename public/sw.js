// Service Worker - استراتيجية محسّنة للعمل بدون نت (مع تخزين الفيديوهات)
const CACHE_VERSION = "esmo-erof-v3";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const FONT_CACHE = `${CACHE_VERSION}-fonts`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const VIDEO_CACHE = `${CACHE_VERSION}-videos`;

// الملفات الأساسية - يجب تخزينها عند التثبيت
const CRITICAL_ASSETS = ["/", "/index.html"];

// Google Fonts URLs للتخزين المؤقت
const GOOGLE_FONTS = [
  "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+Coptic&display=swap",
];

// أحجام التخزين المؤقت (بالبايت)
const MAX_VIDEO_CACHE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB للفيديوهات
const MAX_IMAGE_CACHE_SIZE = 100 * 1024 * 1024; // 100MB للصور
const MAX_STATIC_CACHE_SIZE = 50 * 1024 * 1024; // 50MB للملفات الثابتة
const MAX_FONT_CACHE_SIZE = 10 * 1024 * 1024; // 10MB للخطوط

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
      return self.skipWaiting();
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
            // حذف التخزين المؤقت القديم
            if (
              !cacheName.includes(CACHE_VERSION) &&
              cacheName !== FONT_CACHE &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== VIDEO_CACHE
            ) {
              console.log(
                "Service Worker: حذف الذاكرة المؤقتة القديمة:",
                cacheName
              );
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: تم التفعيل بنجاح");
        return self.clients.claim();
      })
  );
});

// اعتراض الطلبات
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تخطي الطلبات غير HTTP/HTTPS
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // تخطي manifest.json لتجنب مشاكل الحقوق
  if (url.pathname.includes("manifest.json")) {
    return;
  }

  // معالجة الفيديوهات - خزّن عند التحميل
  if (isVideoRequest(request)) {
    event.respondWith(handleVideoRequest(request));
    return;
  }

  // Google Fonts - استراتيجية خاصة
  if (
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com")
  ) {
    event.respondWith(handleFontRequest(request));
    return;
  }

  // الصور - خزّن عند التحميل
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // الملفات الثابتة (CSS, JS) - استراتيجية stale-while-revalidate
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // HTML pages و routes - استراتيجية Network First لضمان العمل بدون نت
  if (request.method === "GET" && isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
    return;
  }

  // باقي الطلبات - حاول الإنترنت أولاً
  event.respondWith(handleGenericRequest(request));
});

// ============= معالجات الطلبات =============

// معالجة صفحات HTML/routes
async function handlePageRequest(request) {
  try {
    // حاول من الإنترنت أولاً
    const response = await fetch(request);
    if (response.ok) {
      // احفظ الصفحة للاستخدام بدون نت
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.warn("Service Worker: فشل جلب الصفحة من الإنترنت:", request.url);
  }

  // إذا فشل الإنترنت، استخدم النسخة المخزنة
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log("Service Worker: خدمة الصفحة من الذاكرة المؤقتة:", request.url);
    return cachedResponse;
  }

  // إذا لم نملك نسخة مخزنة، أرجع الصفحة الرئيسية كـ fallback
  const homeResponse = await caches.match("/");
  return homeResponse || new Response("الصفحة غير متاحة", { status: 503 });
}

// معالجة الفيديوهات مع دعم Range وتجنّب تخزين الاستجابات الجزئية
async function handleVideoRequest(request) {
  const hasRange = request.headers && request.headers.get("range");
  const cache = await caches.open(VIDEO_CACHE);

  // عند وجود Range: مرّر الطلب مباشرة للشبكة ولا تخزّنه
  if (hasRange) {
    try {
      return await fetch(request);
    } catch (error) {
      console.error("Service Worker: فشل تحميل الفيديو (Range):", error);
      return new Response("فيديو غير متاح", { status: 503 });
    }
  }

  // ابحث في الكاش بطلب URL فقط حتى نتجنّب مشاكل رؤوس المطابقة
  const urlOnlyReq = new Request(request.url, { method: "GET" });
  const cachedResponse = await cache.match(urlOnlyReq);

  if (cachedResponse) {
    // لا نستخدم استجابة جزئية 206، احذفها ثم واصل للشبكة
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

    // خزّن فقط الاستجابة الكاملة 200 بدون Content-Range
    if (
      response &&
      response.ok &&
      response.status === 200 &&
      !response.headers.get("content-range")
    ) {
      const cacheSize = await getCacheSize(VIDEO_CACHE);
      if (cacheSize < MAX_VIDEO_CACHE_SIZE) {
        await cache.put(urlOnlyReq, response.clone());
        console.log("Service Worker: تم تخزين الفيديو:", request.url);
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

// معالجة خطوط Google بكفاءة
async function handleFontRequest(request) {
  const cache = await caches.open(FONT_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // أرجع من الذاكرة وحاول التحديث في الخلفية
    fetch(request)
      .then((response) => {
        if (response.ok) {
          cache.put(request, response);
        }
      })
      .catch(() => {});
    return cachedResponse;
  }

  // لم نجد في الذاكرة، حاول من الإنترنت
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cacheSize = await getCacheSize(FONT_CACHE);
      if (cacheSize < MAX_FONT_CACHE_SIZE) {
        cache.put(request, response.clone());
      }
      return response;
    }
  } catch (error) {
    console.warn("Service Worker: فشل تحميل الخط:", request.url);
  }

  // في حالة الفشل، أرجع استجابة فارغة
  return new Response("", { status: 504 });
}

// معالجة الصور بكفاءة
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cacheSize = await getCacheSize(IMAGE_CACHE);
      if (cacheSize < MAX_IMAGE_CACHE_SIZE) {
        cache.put(request, response.clone());
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

// معالجة الملفات الثابتة (CSS, JS)
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

  // استخدم النسخة المخزنة
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  return new Response("ملف غير متاح", { status: 503 });
}

// معالجة الطلبات العامة
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.warn("Service Worker: فشل الطلب:", request.url);
    return new Response("خدمة غير متاحة", { status: 503 });
  }
}

// ============= وظائف مساعدة =============

// التحقق من نوع الطلب
function isVideoRequest(request) {
  return (
    request.url.includes(".mp4") ||
    request.url.includes(".webm") ||
    request.url.includes(".ogg") ||
    request.url.includes(".mov") ||
    request.url.includes(".avi") ||
    request.url.includes(".mkv")
  );
}

function isImageRequest(request) {
  return (
    request.url.includes(".jpg") ||
    request.url.includes(".jpeg") ||
    request.url.includes(".png") ||
    request.url.includes(".webp") ||
    request.url.includes(".gif") ||
    request.url.includes(".svg") ||
    request.url.includes(".ico")
  );
}

function isStaticAsset(request) {
  return (
    request.url.includes(".css") ||
    request.url.includes(".js") ||
    request.url.includes(".woff") ||
    request.url.includes(".woff2") ||
    request.url.includes(".ttf") ||
    request.url.includes(".eot") ||
    request.url.includes("/assets/")
  );
}

function isPageRequest(request) {
  // تتحقق من أن الطلب هو HTML page وليس asset
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

// حساب حجم الذاكرة المؤقتة بسرعة
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
    // احذف الأقدم أولاً حتى نصبح تحت الحد
    for (const key of keys) {
      await cache.delete(key);
      size = await getCacheSize(cacheName);
      if (size <= maxBytes) break;
    }
  } catch (e) {
    // no-op
  }
}

// حالة تسخين الفيديوهات: طابور متسلسل لتفادي الضغط على السيرفر
const PREWARM_STATE = {
  queue: [], // قائمة عناوين الفيديو المطلوب تسخينها
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
      } catch (_) {
        // تجاهل أخطاء الطلب الفردي وتابع
      }
      // مهلة قصيرة بين كل عنصر لتخفيف الحمل
      await new Promise((r) => setTimeout(r, 300));
    }
  } finally {
    PREWARM_STATE.running = false;
  }
}

// رسائل من التطبيق
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHES") {
    clearAllCaches();
  }

  if (event.data && event.data.type === "PREWARM_VIDEOS" && event.data.urls) {
    const urls = Array.isArray(event.data.urls)
      ? event.data.urls.filter((u) => typeof u === "string")
      : [];
    if (urls.length) {
      event.waitUntil(
        (async () => {
          try {
            // أدخل العناوين في طابور التسخين بالترتيب، مع إزالة التكرارات البسيطة
            for (const u of urls) {
              if (!PREWARM_STATE.queue.includes(u)) {
                PREWARM_STATE.queue.push(u);
              }
            }
            await processPrewarmQueue();
          } catch (_) {}
        })()
      );
    }
  }

  // حذف فيديو محدد من كاش الفيديوهات
  if (event.data && event.data.type === "EVICT_VIDEO" && event.data.url) {
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
                if (rUrl.origin === target.origin && rUrl.pathname === target.pathname) {
                  await cache.delete(req);
                }
              } catch {}
            })
          );
        } catch {}
      })()
    );
  }

  if (event.data && event.data.type === "GET_CACHE_SIZE") {
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

// تنظيف جميع الذاكرات المؤقتة
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  console.log("Service Worker: تم حذف جميع الذاكرات المؤقتة");
}

// تنسيق حجم الملف
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
