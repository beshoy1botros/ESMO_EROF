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

    // في حالة عدم وجود SW، سخّن كاش HTTP عبر fetch خفيف — بالتتابع
    (async () => {
      for (const url of unique) {
        try {
          await fetch(url, { mode: "no-cors" }).catch(() => {});
        } catch {}
        // مهلة قصيرة بين الطلبات لتخفيف الحمل
        await new Promise((r) => setTimeout(r, 300));
      }
    })();
  } catch {}
}

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
