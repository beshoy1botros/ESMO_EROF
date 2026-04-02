/**
 * Service Worker Client - Optimized Version
 * واجهة للتواصل مع Service Worker من التطبيق
 * 
 * التحسينات:
 * - دعم التحميل المسبق بأولوية
 * - تحميل متوازي في Fallback
 * - معالجة أخطاء محسنة
 */

/**
 * تحميل مسبق للفيديوهات (عادي)
 */
export function prewarmVideos(urls: string[]) {
  try {
    if (!Array.isArray(urls) || urls.length === 0) return;
    const unique = Array.from(new Set(urls.filter(Boolean)));

    // أرسل رسالة إلى Service Worker إن كان مُسجلًا
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "PREWARM_VIDEOS",
        urls: unique,
      });
      // أضف روابط prefetch كإشارة للمُتصفح
      unique.forEach((href) => {
        try {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.as = "video";
          link.href = href;
          document.head.appendChild(link);
        } catch {}
      });
      return;
    }

    // ✅ في حالة عدم وجود SW، سخّن كاش HTTP عبر fetch متوازي
    prewarmVideosFallback(unique);
  } catch {}
}

/**
 * ✅ تحميل مسبق للفيديوهات بأولوية عالية
 */
export function prewarmVideosPriority(urls: string[]) {
  try {
    if (!Array.isArray(urls) || urls.length === 0) return;
    const unique = Array.from(new Set(urls.filter(Boolean)));

    // أرسل رسالة إلى Service Worker إن كان مُسجلًا
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "PREWARM_VIDEOS_PRIORITY",
        urls: unique,
      });
      // أضف روابط preload كإشارة للمُتصفح (أولوية أعلى من prefetch)
      unique.forEach((href) => {
        try {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "video";
          link.href = href;
          document.head.appendChild(link);
        } catch {}
      });
      return;
    }

    // في حالة عدم وجود SW، سخّن كاش HTTP عبر fetch متوازي
    prewarmVideosFallback(unique);
  } catch {}
}

/**
 * ✅ تحميل متوازي للفيديوهات في حالة عدم وجود Service Worker
 */
async function prewarmVideosFallback(urls: string[]) {
  const MAX_CONCURRENT = 3;
  
  for (let i = 0; i < urls.length; i += MAX_CONCURRENT) {
    const batch = urls.slice(i, i + MAX_CONCURRENT);
    
    await Promise.allSettled(
      batch.map((url) =>
        fetch(url, { mode: "no-cors" }).catch(() => {})
      )
    );
    
    // مهلة قصيرة بين الدفعات
    if (i + MAX_CONCURRENT < urls.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
}

/**
 * حذف فيديو من الكاش
 */
export function evictVideo(url: string) {
  try {
    if (!url) return;
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "EVICT_VIDEO",
        url,
      });
    }
  } catch {}
}

/**
 * ✅ الحصول على حجم الكاش
 */
export function getCacheSize(): Promise<{
  static: string;
  video: string;
  image: string;
  font: string;
  total: string;
} | null> {
  return new Promise((resolve) => {
    try {
      if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
        resolve(null);
        return;
      }

      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        if (event.data?.type === "CACHE_SIZE") {
          resolve(event.data);
        } else {
          resolve(null);
        }
      };

      navigator.serviceWorker.controller.postMessage(
        { type: "GET_CACHE_SIZE" },
        [channel.port2]
      );

      // Timeout after 5 seconds
      setTimeout(() => resolve(null), 5000);
    } catch {
      resolve(null);
    }
  });
}

/**
 * ✅ مسح جميع الكاشات
 */
export function clearAllCaches() {
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CLEAR_CACHES",
      });
    }
  } catch {}
}

/**
 * ✅ تخطي انتظار Service Worker الجديد
 */
export function skipWaiting() {
  try {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SKIP_WAITING",
      });
    }
  } catch {}
}
