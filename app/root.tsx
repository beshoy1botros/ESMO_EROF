import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "react-router";

import type { Route } from "./+types/root";
import { useEffect, useState } from "react";
import { AppInstaller } from "./components/AppInstaller";
import { OfflineManager } from "./components/OfflineManager";
import { UpdateToast, useUpdateToast } from "./components/UpdateToast";
import { registerSW, requestPersistentStorage, subscribeSWEvents } from "./utils/swClient";
import "./app.css";
import "./styles/mobile-improvements.css";
import "./styles/mobile-advanced.css";

interface WebKitFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

const OPEN_REFRESH_LIMIT = 3;
const OPEN_REFRESH_KEY = "esmo-erof-open-refresh-count";

function shouldReloadOnOpen() {
  if (typeof window === "undefined") return false;

  try {
    const current = Number(sessionStorage.getItem(OPEN_REFRESH_KEY) ?? "0");
    if (current < OPEN_REFRESH_LIMIT) {
      sessionStorage.setItem(OPEN_REFRESH_KEY, String(current + 1));
      window.setTimeout(() => window.location.reload(), 150);
      return true;
    }

    sessionStorage.removeItem(OPEN_REFRESH_KEY);
  } catch {
    // If storage is blocked, keep the app usable and skip the forced refresh loop.
  }

  return false;
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "preconnect",
    href: "https://pub-25e727cf0c0e49799268f333275e7cf2.r2.dev",
  },
  {
    rel: "canonical",
    href: "https://esmo-erof.vercel.app",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Coptic&family=Noto+Sans+Arabic:wght@400;700&display=swap",
  },
  {
    rel: "shortcut icon",
    href: "/photos/favicon.ico",
    type: "image/x-icon",
  },
  {
    rel: "icon",
    href: "/photos/favicon-96x96.png",
    type: "image/png",
    sizes: "96x96",
  },
  {
    rel: "apple-touch-icon",
    href: "/photos/apple-touch.png",
  },
  {
    rel: "manifest",
    href: "/manifest.json",
  },
];

export function meta() {
  return [
    {
      title: "ألحان مهرجان الكرازة لإيبارشية الشرقية ومدينة العاشر من رمضان",
    },
    { name: "og:site_name", content: "Coptic Hymns" },
    { charset: "utf-8" },
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
    },
    { name: "theme-color", content: "#1e3a8a" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },
    { name: "apple-mobile-web-app-title", content: "Coptic Hymns" },
    {
      name: "application-name",
      content: "Coptic Hymns",
    },
    { name: "format-detection", content: "telephone=no" },
    { name: "msapplication-tap-highlight", content: "no" },
    { name: "msapplication-TileColor", content: "#1e3a8a" },
    { name: "msapplication-TileImage", content: "/photos/icon-512.png" },
    { name: "android-app-link", content: "https://esmo-erof.vercel.app" },
    {
      name: "description",
      content:
        "Coptic Hymns - التطبيق الرسمي لألحان مهرجان الكرازة لإيبارشية الشرقية ومدينة العاشر من رمضان. تعلم الألحان القبطية الأرثوذكسية وطقوسها الكنسية بسهولة.",
    },
    {
      name: "keywords",
      content:
        "Coptic Hymns, ألحان مهرجان الكرازة, إيبارشية الشرقية, العاشر من رمضان, ألحان قبطية, تعليم ألحان, الكنيسة القبطية الأرثوذكسية, Coptic chants, Orthodox liturgy",
    },
    { name: "author", content: "Coptic Hymns" },
    { name: "robots", content: "index, follow" },
    {
      property: "og:title",
      content: "Coptic Hymns",
    },
    {
      property: "og:description",
      content:
        "Learn Coptic Orthodox hymns with the best educational app. Discover the beauty of Coptic liturgical chants.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://esmo-erof.vercel.app" },
    {
      property: "og:image",
      content: "https://esmo-erof.vercel.app/photos/icon-512.png",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Coptic Hymns",
    },
    {
      name: "twitter:description",
      content:
        "Learn Coptic Orthodox hymns with the best educational app. Discover the beauty of Coptic liturgical chants.",
    },
    {
      name: "twitter:image",
      content: "https://esmo-erof.vercel.app/photos/icon-512.png",
    },
    { property: "al:ios:url", content: "https://esmo-erof.vercel.app" },
    { property: "al:ios:app_name", content: "Coptic Hymns" },
    { property: "al:android:url", content: "https://esmo-erof.vercel.app" },
    { property: "al:android:app_name", content: "Coptic Hymns" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Coptic Hymns",
    alternateName: "ألحان مهرجان الكرازة - إيبارشية الشرقية والعاشر من رمضان",
    url: "https://esmo-erof.vercel.app",
    image: "https://esmo-erof.vercel.app/photos/icon-512.png",
    description:
      "تطبيق تعليمي متخصص في الألحان القبطية الأرثوذكسية وطقوسها الكنسية، يخدم إيبارشية الشرقية ومدينة العاشر من رمضان.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web, Android, iOS",
    author: {
      "@type": "Organization",
      name: "إيبارشية الشرقية والعاشر من رمضان",
      url: "https://esmo-erof.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Coptic Hymns",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EGP",
    },
  };

  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var root = document.documentElement;
                  root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
                  root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
                  root.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
                  root.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    root.style.setProperty('--theme-color', '#0f172a');
                    root.classList.add('dark');
                  } else {
                    root.style.setProperty('--theme-color', '#ffffff');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.__esmoDeferredInstallPrompt = null;
                window.addEventListener('beforeinstallprompt', function(event) {
                  event.preventDefault();
                  window.__esmoDeferredInstallPrompt = event;
                  window.dispatchEvent(new Event('esmo-beforeinstallprompt'));
                });
                window.addEventListener('appinstalled', function() {
                  window.__esmoDeferredInstallPrompt = null;
                  try {
                    localStorage.setItem('esmo-erof-app-installed', 'true');
                  } catch (e) {}
                  window.dispatchEvent(new Event('esmo-appinstalled'));
                });
              })();
            `,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function loadMobileFeatures() {
                  var script = document.createElement('script');
                  script.src = '/scripts/mobile-features.js';
                  script.async = true;
                  document.head.appendChild(script);
                }
                if ('requestIdleCallback' in window) {
                  requestIdleCallback(loadMobileFeatures);
                } else {
                  setTimeout(loadMobileFeatures, 1000);
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  const [landscapeEnabled, setLandscapeEnabled] = useState(false);
  const { visible: updateToastVisible, show: showUpdateToast } =
    useUpdateToast(2000);

  useEffect(() => {
    if (shouldReloadOnOpen()) return;

    async function initializePwaRuntime() {
      try {
        if (
          navigator.storage?.persisted &&
          (await navigator.storage.persisted())
        ) {
          console.log("[App] التخزين الدائم مفعّل مسبقاً ✓");
        } else {
          await requestPersistentStorage();
        }
      } catch (err) {
        console.warn("[App] فشل طلب التخزين الدائم:", err);
      }

      await registerSW({});
    }

    if (document.readyState === "complete") {
      initializePwaRuntime();
      return;
    }

    window.addEventListener("load", initializePwaRuntime, { once: true });
    return () => window.removeEventListener("load", initializePwaRuntime);
  }, []);

  // ✅ Auto-skip waiting SW (تحديث تلقائي بدون مطالبة المستخدم)
  useEffect(() => {
    const unsubscribe = subscribeSWEvents((event) => {
      if (event.type === "SW_WAITING") {
        // إخبر SW لتخطي الانتظار وتفعيل نفسها فوراً
        navigator.serviceWorker.controller?.postMessage({
          type: "SKIP_WAITING",
        });
      } else if (event.type === "SW_ACTIVATED") {
        // تحديث تم بنجاح - عرض إشعار قصير
        showUpdateToast();
        console.log("[App] تم تحديث التطبيق إلى النسخة:", event.version);
      }
    });
    return unsubscribe;
  }, [showUpdateToast]);

  useEffect(() => {
    if (landscapeEnabled) {
      document.body.classList.add("landscape-enabled");
    } else {
      document.body.classList.remove("landscape-enabled");
    }
    return () => {
      document.body.classList.remove("landscape-enabled");
    };
  }, [landscapeEnabled]);

  async function enableLandscape() {
    try {
      const docEl = document.documentElement as WebKitFullscreenElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      }
      if (screen.orientation?.lock) {
        await screen.orientation.lock("landscape");
      }
      setLandscapeEnabled(true);
    } catch {
      setLandscapeEnabled(true);
    }
  }

  async function disableLandscape() {
    try {
      if (screen.orientation?.unlock) {
        screen.orientation.unlock();
      }
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {}
    setLandscapeEnabled(false);
  }

  const toggleLandscape = () => {
    if (landscapeEnabled) disableLandscape();
    else enableLandscape();
  };

  return (
    <div dir="rtl">
      <Outlet />

      <AppInstaller />

      {/* ✅ FIX 4: تفعيل OfflineManager — كان موجود في الكود بس مش متضمّن هنا */}
      {/* هو اللي بيعرض تحذير "أضف للشاشة الرئيسية" للمستخدم */}
      <OfflineManager />

      {/* ✅ عرض إشعار التحديث التلقائي */}
      <UpdateToast visible={updateToastVisible} />

      <button
        id="landscape-toggle-button"
        onClick={toggleLandscape}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      >
        {landscapeEnabled ? "إيقاف الوضع الأفقي" : "الوضع الأفقي"}
      </button>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "عذرًا!";
  let details = "حدث خطأ غير متوقع.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "خطأ";
    details =
      error.status === 404
        ? "الصفحة المطلوبة غير موجودة."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">{message}</h1>
      <p className="text-lg mb-8">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-gray-100 rounded-md text-left mb-8">
          <code>{stack}</code>
        </pre>
      )}
      <Link
        to="/"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </main>
  );
}
