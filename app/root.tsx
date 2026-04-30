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
import "./app.css";
import "./styles/mobile-improvements.css";
import "./styles/mobile-advanced.css";

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
  { rel: "manifest", href: "/manifest-mobile.json" },
];

export function meta() {
  return [
    {
      title:
        "Coptic Hymns - ألحان مهرجان الكرازة لإيبارشية الشرقية والعاشر من رمضان",
    },
    { name: "og:site_name", content: "ألحان مهرجان الكرازة" },
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
      content: "Coptic Hymns - ألحان مهرجان الكرازة",
    },
    { name: "format-detection", content: "telephone=no" },
    { name: "msapplication-tap-highlight", content: "no" },
    { name: "msapplication-TileColor", content: "#1e3a8a" },
    { name: "msapplication-TileImage", content: "/photos/icon-192.png" },
    { name: "android-app-link", content: "https://esmo-erof.vercel.app" },
    {
      name: "description",
      content:
        "Coptic Hymns - Learn and explore Coptic Orthodox hymns with ease. Your complete guide to Coptic liturgical chants.",
    },
    {
      name: "keywords",
      content:
        "Coptic Hymns - ألحان قبطية, Coptic hymns, Coptic chants, Orthodox liturgy",
    },
    { name: "author", content: "Coptic Hymns" },
    { name: "robots", content: "index, follow" },
    {
      property: "og:title",
      content:
        "Coptic Hymns - ألحان مهرجان الكرازة لإيبارشية الشرقية والعاشر من رمضان",
    },
    {
      property: "og:description",
      content: "Learn Coptic Orthodox hymns with the best educational app.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://esmo-erof.vercel.app" },
    { property: "og:image", content: "/photos/icon-512.png" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content:
        "Coptic Hymns - ألحان مهرجان الكرازة لإيبارشية الشرقية والعاشر من رمضان",
    },
    {
      name: "twitter:description",
      content: "Learn Coptic Orthodox hymns with the best educational app.",
    },
    { name: "twitter:image", content: "/photos/icon-512.png" },
    { property: "al:ios:url", content: "https://esmo-erof.vercel.app" },
    { property: "al:ios:app_store_id", content: "" },
    { property: "al:ios:app_name", content: "Coptic Hymns" },
    { property: "al:android:url", content: "https://esmo-erof.vercel.app" },
    { property: "al:android:package", content: "" },
    { property: "al:android:app_name", content: "Coptic Hymns" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
                // ✅ FIX 1: طلب التخزين الدائم فوراً — قبل أي تخزين
                // بدون persist() المتصفح ممكن يمسح الكاش أي وقت
                if (navigator.storage && navigator.storage.persist) {
                  navigator.storage.persist().then(function(granted) {
                    console.log('[App] Persistent storage granted:', granted);
                    if (!granted) {
                      console.warn(
                        '[App] التخزين الدائم مرفوض. ' +
                        'أضف التطبيق للشاشة الرئيسية لضمان بقاء الكاش.'
                      );
                    }
                  });
                }

                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(reg) {
                        console.log('[SW] registered:', reg.scope);

                        // ✅ FIX 2: إزالة window.location.reload() التلقائي
                        // الـ reload المتكرر كان يمنع persist() من الاكتمال
                        // وكان يسبب إعادة تحميل كل مرة يوجد SW جديد
                        reg.addEventListener('updatefound', function() {
                          var newWorker = reg.installing;
                          if (newWorker) {
                            newWorker.addEventListener('statechange', function() {
                              if (
                                newWorker.state === 'installed' &&
                                navigator.serviceWorker.controller
                              ) {
                                // ✅ إبلاغ التطبيق بوجود نسخة جديدة فقط
                                // بدون reload تلقائي — المستخدم يختار وقت التحديث
                                console.log('[SW] نسخة جديدة جاهزة');
                                window.dispatchEvent(
                                  new CustomEvent('sw-update-available')
                                );
                              }
                            });
                          }
                        });
                      })
                      .catch(function(err) {
                        console.log('[SW] registration failed:', err);
                      });
                  });
                }

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

  // ✅ FIX 3: طلب persist() مرة ثانية من داخل React بعد الـ hydration
  // لضمان تنفيذه حتى لو الـ inline script فوق ما اشتغلش في وقت معين
  useEffect(() => {
    async function ensurePersistentStorage() {
      if (!navigator.storage?.persist) return;

      try {
        const alreadyPersisted = await navigator.storage.persisted();
        if (alreadyPersisted) {
          console.log("[App] التخزين الدائم مفعّل مسبقاً ✓");
          return;
        }

        const granted = await navigator.storage.persist();
        if (granted) {
          console.log("[App] ✅ التخزين الدائم تم تفعيله بنجاح");
        } else {
          console.warn(
            "[App] ⚠️ التخزين الدائم لم يُمنح. " +
              "المتصفح قد يمسح الكاش عند نقص المساحة. " +
              "أضف التطبيق للشاشة الرئيسية لضمان التخزين.",
          );
        }
      } catch (err) {
        console.warn("[App] فشل طلب التخزين الدائم:", err);
      }
    }

    ensurePersistentStorage();
  }, []);

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
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      }
      if (screen.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock("landscape");
      }
      setLandscapeEnabled(true);
    } catch {
      setLandscapeEnabled(true);
    }
  }

  async function disableLandscape() {
    try {
      if (screen.orientation && (screen.orientation as any).unlock) {
        (screen.orientation as any).unlock();
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
