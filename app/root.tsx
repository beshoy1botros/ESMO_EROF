import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link, // أضف Link لاستخدامه في ErrorBoundary
} from "react-router-dom"; // أو "react-router-dom" إذا كنت تستخدمه

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+Coptic&display=swap",
  },
  {
    rel: "shortcut icon",
    href: "/العذراء مريم.ico", // تم تغيير اسم الملف
    type: "image/x-icon", // تم تغيير النوع إلى النوع القياسي
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
      content: "width=device-width, initial-scale=1",
    },
    { name: "theme-color", content: "#1e3a8a" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* لا تضع Header أو Footer هنا */}
        {children}
        <ScrollRestoration />
        <Scripts />
        {/* تسجيل Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('Service Worker registered successfully:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('Service Worker registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div dir="rtl">
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "عذرًا!"; // تم توطين الرسالة
  let details = "حدث خطأ غير متوقع."; // تم توطين الرسالة
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "خطأ"; // تم توطين الرسالة
    details =
      error.status === 404
        ? "الصفحة المطلوبة غير موجودة." // تم توطين الرسالة
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
