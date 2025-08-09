import { Link } from "react-router";

export function meta() {
  return [
    { title: "الصفحة غير موجودة - ⲥⲙⲟⲩ ⲉⲣⲟϥ" },
    { name: "description", content: "الصفحة التي تبحث عنها غير موجودة" },
  ];
}

export default function NotFoundPage() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            عذرًا، الصفحة التي تبحث عنها غير موجودة.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </main>
    </div>
  );
}

