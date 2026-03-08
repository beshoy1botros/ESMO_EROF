/**
 * Mobile Features — ESMO EROF
 * ميزات متقدمة للجوال
 *
 * ملاحظة: تسجيل Service Worker يتم في root.tsx.
 * هذا الملف يُحمَّل lazily بعد تحميل الصفحة ويضيف ميزات تفاعلية.
 */

(function () {
  "use strict";

  /* ══════════════════════════════════════════
     كشف نوع الجهاز
  ══════════════════════════════════════════ */
  const ua = navigator.userAgent;
  const device = {
    isMobile:
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
    isIOS: /iPad|iPhone|iPod/.test(ua) && !window.MSStream,
    isAndroid: /Android/.test(ua),
    isStandalone: window.matchMedia("(display-mode: standalone)").matches,
    isTouchDevice: navigator.maxTouchPoints > 0,
  };

  /* ══════════════════════════════════════════
     PWA — Install Banner
  ══════════════════════════════════════════ */
  let deferredInstallPrompt = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    // أظهر زر التثبيت إن وجد في الصفحة
    const btn = document.querySelector("[data-pwa-install]");
    if (btn) btn.classList.remove("hidden");
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    const btn = document.querySelector("[data-pwa-install]");
    if (btn) btn.classList.add("hidden");
  });

  function triggerInstallPrompt() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then(() => {
      deferredInstallPrompt = null;
    });
  }

  /* ══════════════════════════════════════════
     الشبكة — Online / Offline
  ══════════════════════════════════════════ */
  function showToast(message, type = "info", duration = 3500) {
    // أزل أي toast موجود
    const prev = document.querySelector(".esmo-toast");
    if (prev) prev.remove();

    const colors = {
      info: "from-blue-900/95 border-blue-600/40",
      success: "from-emerald-900/95 border-emerald-600/40",
      warning: "from-amber-900/95 border-amber-600/40",
      error: "from-red-900/95 border-red-600/40",
    };

    const icons = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" };

    const toast = document.createElement("div");
    toast.className = `
      esmo-toast fixed z-[9999]
      bottom-[max(1rem,env(safe-area-inset-bottom))]
      right-4 left-4 sm:left-auto sm:right-6 sm:max-w-sm
      flex items-center gap-3
      px-4 py-3 rounded-2xl
      bg-gradient-to-r ${colors[type] ?? colors.info}
      bg-slate-900/95
      border backdrop-blur-xl
      shadow-[0_8px_32px_rgba(0,0,0,0.5)]
      text-white text-sm font-medium
      translate-y-4 opacity-0
      transition-all duration-300 ease-out
    `;
    toast.innerHTML = `<span>${icons[type] ?? "ℹ️"}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
    });

    setTimeout(() => {
      toast.classList.add("translate-y-4", "opacity-0");
      toast.addEventListener("transitionend", () => toast.remove(), {
        once: true,
      });
    }, duration);
  }

  window.addEventListener("online", () =>
    showToast("تم استعادة الاتصال بالإنترنت ✨", "success"),
  );
  window.addEventListener("offline", () =>
    showToast("أنت الآن في وضع عدم الاتصال", "warning", 5000),
  );

  /* ══════════════════════════════════════════
     الشبكة — جودة الاتصال
  ══════════════════════════════════════════ */
  function applyNetworkQuality(connection) {
    if (!connection) return;
    const { effectiveType, saveData } = connection;

    document.body.classList.remove(
      "network-2g",
      "network-3g",
      "network-4g",
      "data-saver",
    );

    if (saveData || effectiveType === "slow-2g" || effectiveType === "2g") {
      document.body.classList.add("network-2g", "data-saver");
    } else if (effectiveType === "3g") {
      document.body.classList.add("network-3g");
    } else {
      document.body.classList.add("network-4g");
    }
  }

  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  if (conn) {
    applyNetworkQuality(conn);
    conn.addEventListener("change", () => applyNetworkQuality(conn));
  }

  /* ══════════════════════════════════════════
     إيماءات السحب (Swipe)
  ══════════════════════════════════════════ */
  if (device.isTouchDevice) {
    let sx = 0,
      sy = 0,
      startTarget = null;

    document.addEventListener(
      "touchstart",
      (e) => {
        sx = e.changedTouches[0].clientX;
        sy = e.changedTouches[0].clientY;
        startTarget = e.target;
      },
      { passive: true },
    );

    document.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        const MIN = 60;

        if (Math.abs(dx) < MIN && Math.abs(dy) < MIN) return;

        if (Math.abs(dx) > Math.abs(dy)) {
          // سحب أفقي — أغلق القائمة عند السحب لليسار (RTL: لليمين)
          if (dx < 0) {
            document.dispatchEvent(new CustomEvent("esmo:swipe-left"));
          } else {
            document.dispatchEvent(new CustomEvent("esmo:swipe-right"));
          }
        }
      },
      { passive: true },
    );
  }

  /* ══════════════════════════════════════════
     البحث الصوتي
  ══════════════════════════════════════════ */
  const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;

  if (SpeechAPI) {
    recognition = new SpeechAPI();
    recognition.lang = "ar-SA";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      // أرسل النتيجة للعناصر المهتمة
      document.dispatchEvent(
        new CustomEvent("esmo:voice-result", { detail: text }),
      );
      const input = document.querySelector(
        'input[type="search"], input[data-voice-target]',
      );
      if (input) {
        input.value = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== "aborted") showToast("تعذّر التعرف على الصوت", "error");
    };
  }

  function startVoiceSearch() {
    if (!recognition) {
      showToast("البحث الصوتي غير مدعوم في هذا المتصفح", "warning");
      return;
    }
    try {
      recognition.start();
      showToast("🎤 تحدث الآن...", "info", 5000);
    } catch {}
  }

  /* ══════════════════════════════════════════
     الإشعارات
  ══════════════════════════════════════════ */
  function requestNotifications() {
    if (!("Notification" in window) || Notification.permission !== "default")
      return;

    // أظهر بانر داخلي بدل طلب المتصفح المباشر (UX أفضل)
    const banner = document.createElement("div");
    banner.id = "notif-banner";
    banner.className = `
      fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))]
      right-4 left-4 sm:left-auto sm:right-6 sm:max-w-sm z-[9998]
      p-4 rounded-2xl
      bg-slate-900/95 backdrop-blur-xl
      border border-white/10
      shadow-[0_8px_40px_rgba(0,0,0,0.5)]
      text-white translate-y-4 opacity-0
      transition-all duration-300 ease-out
    `;
    banner.innerHTML = `
      <p class="text-sm font-semibold mb-1">🔔 تفعيل الإشعارات</p>
      <p class="text-xs text-gray-400 mb-3">احصل على تنبيهات بأحدث الألحان وأوقات الصلوات</p>
      <div class="flex gap-2">
        <button id="notif-allow" class="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-colors">السماح</button>
        <button id="notif-deny"  class="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors">لاحقاً</button>
      </div>
    `;

    document.body.appendChild(banner);
    requestAnimationFrame(() =>
      banner.classList.remove("translate-y-4", "opacity-0"),
    );

    const dismiss = () => {
      banner.classList.add("translate-y-4", "opacity-0");
      banner.addEventListener("transitionend", () => banner.remove(), {
        once: true,
      });
    };

    document.getElementById("notif-allow")?.addEventListener("click", () => {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") showToast("تم تفعيل الإشعارات", "success");
      });
      dismiss();
    });

    document.getElementById("notif-deny")?.addEventListener("click", dismiss);
  }

  /* ══════════════════════════════════════════
     التخزين — مؤشر الاستخدام
  ══════════════════════════════════════════ */
  async function checkStorage() {
    if (!navigator.storage?.estimate) return;
    try {
      const { usage, quota } = await navigator.storage.estimate();
      const pct = (usage / quota) * 100;
      if (pct > 90)
        showToast(
          `💾 التخزين امتلأ ${pct.toFixed(0)}% — يُنصح بالتنظيف`,
          "error",
          6000,
        );
      else if (pct > 75)
        showToast(`💾 التخزين ${pct.toFixed(0)}% مُستخدم`, "warning", 4000);
    } catch {}
  }

  /* ══════════════════════════════════════════
     تحسين الأداء — Lazy Images
  ══════════════════════════════════════════ */
  function initLazyImages() {
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;
          const img = target;
          if (img.dataset.src) img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.classList.add("loaded");
          observer.unobserve(img);
        });
      },
      { rootMargin: "200px" },
    );

    document
      .querySelectorAll("img[data-src]")
      .forEach((img) => obs.observe(img));
  }

  /* ══════════════════════════════════════════
     Resize — debounced
  ══════════════════════════════════════════ */
  let resizeTimer;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle("is-mobile", isMobile);
        document.body.classList.toggle("is-desktop", !isMobile);
      }, 200);
    },
    { passive: true },
  );

  /* ══════════════════════════════════════════
     Scroll — CSS variable
  ══════════════════════════════════════════ */
  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--scroll-y",
          `${window.scrollY}px`,
        );
        scrollTicking = false;
      });
      scrollTicking = true;
    },
    { passive: true },
  );

  /* ══════════════════════════════════════════
     Dark Mode Toggle
  ══════════════════════════════════════════ */
  function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("esmo-dark", isDark ? "1" : "0");
    } catch {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#060d1f" : "#ffffff");
  }

  /* ══════════════════════════════════════════
     Keyboard Shortcuts
  ══════════════════════════════════════════ */
  document.addEventListener("keydown", (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    switch (e.key) {
      case "f": {
        const input = document.querySelector('input[type="search"]');
        if (input) {
          e.preventDefault();
          input.focus();
        }
        break;
      }
      case "d":
        e.preventDefault();
        toggleDarkMode();
        break;
    }
  });

  /* ══════════════════════════════════════════
     Screen Reader Helper
  ══════════════════════════════════════════ */
  function announce(message, priority = "polite") {
    const el = document.createElement("div");
    el.setAttribute("aria-live", priority);
    el.setAttribute("aria-atomic", "true");
    el.className = "sr-only";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  /* ══════════════════════════════════════════
     التهيئة
  ══════════════════════════════════════════ */
  function init() {
    initLazyImages();
    checkStorage();

    // اطلب إشعارات بعد 30 ثانية (لا تزعج المستخدم فور الدخول)
    setTimeout(requestNotifications, 30_000);

    // صفّ الـ body
    document.body.classList.toggle("is-mobile", device.isMobile);
    document.body.classList.toggle("is-pwa", device.isStandalone);
    document.body.classList.toggle("is-ios", device.isIOS);
    document.body.classList.toggle("is-android", device.isAndroid);

    if (device.isStandalone) {
      // إصلاح الـ safe area للـ PWA header
      const header = document.querySelector("header");
      if (header) header.style.paddingTop = "var(--safe-top)";
    }
  }

  /* تشغيل بعد اكتمال DOM أو فوراً إن كان جاهزاً */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ══════════════════════════════════════════
     Public API
  ══════════════════════════════════════════ */
  window.esmoFeatures = {
    showToast,
    toggleDarkMode,
    startVoiceSearch,
    triggerInstallPrompt,
    announce,
    device,
  };
})();
