// Service Worker للتخزين المؤقت وتحسين الأداء
const CACHE_NAME = "esmo-erof-v1";
const STATIC_CACHE = "esmo-erof-static-v1";
const VIDEO_CACHE = "esmo-erof-videos-v1";
const IMAGE_CACHE = "esmo-erof-images-v1";

// الملفات الأساسية التي يجب تخزينها مؤقتاً
const STATIC_ASSETS = [
  "/",
  "/melodies",
  "/about",
  "/preparatory",
  "/العذراء مريم.ico",
  // لا نضيف manifest.json هنا لتجنب أخطاء 401
];

// أحجام التخزين المؤقت (بالبايت)
const MAX_VIDEO_CACHE_SIZE = 500 * 1024 * 1024; // 500MB للفيديوهات
const MAX_IMAGE_CACHE_SIZE = 100 * 1024 * 1024; // 100MB للصور
const MAX_STATIC_CACHE_SIZE = 50 * 1024 * 1024; // 50MB للملفات الثابتة

// تثبيت Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Installed successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Installation failed", error);
      })
  );
});

// تفعيل Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // حذف التخزين المؤقت القديم
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== VIDEO_CACHE &&
              cacheName !== IMAGE_CACHE
            ) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated successfully");
        return self.clients.claim();
      })
  );
});

// اعتراض الطلبات
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تخطي الطلبات غير HTTP/HTTPS
  if (!request.url.startsWith("http")) {
    return;
  }

  // تخطي manifest.json لتجنب أخطاء 401
  if (request.url.includes("manifest.json")) {
    return;
  }

  // استراتيجية مختلفة حسب نوع الملف
  if (isVideoRequest(request)) {
    event.respondWith(handleVideoRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// التحقق من نوع الطلب
function isVideoRequest(request) {
  return (
    request.url.includes(".mp4") ||
    request.url.includes(".webm") ||
    request.url.includes(".ogg")
  );
}

function isImageRequest(request) {
  return (
    request.url.includes(".jpg") ||
    request.url.includes(".jpeg") ||
    request.url.includes(".png") ||
    request.url.includes(".webp") ||
    request.url.includes(".gif")
  );
}

function isStaticAsset(request) {
  return (
    request.url.includes(".css") ||
    request.url.includes(".js") ||
    request.url.includes(".ico") ||
    request.url.includes("/assets/")
  );
}

// معالجة طلبات الفيديو
async function handleVideoRequest(request) {
  const cache = await caches.open(VIDEO_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    console.log("Service Worker: Serving video from cache", request.url);
    return cachedResponse;
  }

  try {
    console.log("Service Worker: Fetching video from network", request.url);
    const response = await fetch(request);

    if (response.ok) {
      // تحقق من حجم التخزين المؤقت قبل الإضافة
      const cacheSize = await getCacheSize(VIDEO_CACHE);
      if (cacheSize < MAX_VIDEO_CACHE_SIZE) {
        cache.put(request, response.clone());
        console.log("Service Worker: Video cached", request.url);
      } else {
        console.log(
          "Service Worker: Video cache full, not caching",
          request.url
        );
      }
    }

    return response;
  } catch (error) {
    console.error("Service Worker: Video fetch failed", error);
    return new Response("Video not available offline", { status: 503 });
  }
}

// معالجة طلبات الصور
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
    console.error("Service Worker: Image fetch failed", error);
    return new Response("Image not available offline", { status: 503 });
  }
}

// معالجة الملفات الثابتة
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    return (
      cachedResponse ||
      new Response("Resource not available offline", { status: 503 })
    );
  }
}

// معالجة الطلبات الديناميكية
async function handleDynamicRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    // إرجاع صفحة offline إذا كانت متاحة
    const cache = await caches.open(STATIC_CACHE);
    const offlinePage = await cache.match("/");
    return offlinePage || new Response("Offline", { status: 503 });
  }
}

// حساب حجم التخزين المؤقت
async function getCacheSize(cacheName) {
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
}

// تنظيف التخزين المؤقت عند امتلائه
async function cleanupCache(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  // ترتيب حسب تاريخ الوصول (الأقدم أولاً)
  const sortedKeys = keys.sort((a, b) => {
    // يمكن تحسين هذا بحفظ timestamps
    return 0;
  });

  let currentSize = await getCacheSize(cacheName);

  for (const key of sortedKeys) {
    if (currentSize <= maxSize) break;

    const response = await cache.match(key);
    if (response) {
      const blob = await response.blob();
      currentSize -= blob.size;
      await cache.delete(key);
      console.log("Service Worker: Cleaned up cache entry", key.url);
    }
  }
}

// رسائل من الصفحة الرئيسية
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_VIDEO") {
    const videoUrl = event.data.url;
    cacheVideoManually(videoUrl);
  }
});

// تخزين فيديو يدوياً
async function cacheVideoManually(videoUrl) {
  try {
    const cache = await caches.open(VIDEO_CACHE);
    const response = await fetch(videoUrl);

    if (response.ok) {
      await cache.put(videoUrl, response);
      console.log("Service Worker: Video cached manually", videoUrl);
    }
  } catch (error) {
    console.error("Service Worker: Manual video caching failed", error);
  }
}
