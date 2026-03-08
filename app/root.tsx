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
  { rel: "preconnect", href: "https://res.cloudinary.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+Coptic&display=swap",
  },
  {
    rel: "shortcut icon",
    href: "/photos/العذراء مريم.ico",
    type: "image/x-icon",
  },
  {
    rel: "manifest",
    href: "/manifest.json",
  },
];

export function meta() {
  return [
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
    { name: "apple-mobile-web-app-title", content: "ⲥⲙⲟⲩ ⲉⲣⲟϥ" },
    { name: "application-name", content: "ⲥⲙⲟⲩ ⲉⲣⲟϥ - الألحان القبطية" },
    { name: "format-detection", content: "telephone=no" },
    { name: "msapplication-tap-highlight", content: "no" },
    { name: "msapplication-TileColor", content: "#1e3a8a" },
    { name: "msapplication-TileImage", content: "/photos/العذراء مريم.ico" },
    {
      name: "description",
      content:
        "تطبيق الألحان القبطية الأرثوذكسية - تعليم وتصفح الألحان القبطية بسهولة",
    },
    {
      name: "keywords",
      content: "ألحان قبطية, تعليم لحن, الكنيسة القبطية, ترانيم, طقس",
    },
    { name: "author", content: "ESMO EROF" },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: "ⲥⲙⲟⲩ ⲉⲣⲟϥ - الألحان القبطية" },
    {
      property: "og:description",
      content: "تعلم الألحان القبطية الأرثوذكسية مع أفضل تطبيق تعليمي",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://esmo-erof.com" },
    { property: "og:image", content: "/photos/العذراء مريم.ico" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "ⲥⲙⲟⲩ ⲉⲣⲟϥ - الألحان القبطية" },
    {
      name: "twitter:description",
      content: "تعلم الألحان القبطية الأرثوذكسية مع أفضل تطبيق تعليمي",
    },
    { name: "twitter:image", content: "/photos/العذراء مريم.ico" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // FIX: suppressHydrationWarning يمنع React من رفع خطأ عند اختلاف
    // className أو style بين الـ SSR والـ client بسبب dark mode والـ CSS vars.
    // هذا آمن لأن الاختلاف مقصود ومحدود بالـ <html> tag فقط.
    <html lang="ar" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*
          FIX: نقل script إعداد dark mode والـ CSS vars إلى <head>
          كـ blocking script حتى يتنفذ قبل أي render ويختفي الـ flash،
          وبذلك السيرفر والـ client بيبدأوا من نفس الحالة.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var root = document.documentElement;
                  root.style.setProperty('--safe-area-top',    'env(safe-area-inset-top)');
                  root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
                  root.style.setProperty('--safe-area-left',   'env(safe-area-inset-left)');
                  root.style.setProperty('--safe-area-right',  'env(safe-area-inset-right)');

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

        {/* Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) {
                      console.log('Service Worker registered:', reg.scope);
                    })
                    .catch(function(err) {
                      console.log('Service Worker failed:', err);
                    });
                });
              }
            `,
          }}
        />

        {/* تحميل مميزات الجوال المتقدمة */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function loadMobileFeatures() {
                  var script = document.createElement('script');
                  script.src   = '/app/utils/mobile-features.js';
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
