export default function Footer() {
  // عرض السنة الحالية بشكل تلقائي
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 p-6 sm:p-8 text-center mt-auto border-t border-blue-900">
      <p className="text-gray-300 text-base sm:text-lg">
        صُنع بواسطة فريق كنيسة السيدة العذراء مريم بأبوحماد
        <span className="mr-2 text-white text-lg sm:text-2xl">
          © {currentYear}
        </span>
      </p>
      <p className="mt-3 text-gray-300 text-sm sm:text-base">
        للتواصل عبر الواتساب:
        <a
          href="https://wa.me/201210138629"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 mx-1"
        >
          201210138629
        </a>
      </p>
    </footer>
  );
}
