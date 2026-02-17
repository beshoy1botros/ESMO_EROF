export default function Footer() {
  // عرض السنة الحالية بشكل تلقائي
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 p-6 sm:p-8 text-center mt-auto border-t border-blue-900">
      <p className="text-gray-300 text-base sm:text-lg">
        Made with
        <span role="img" aria-label="love" className="mx-1">
          ❤️
        </span>
        by
        <span className="font-newath text-white text-lg sm:text-2xl ml-1">
          Piswi Petroc
        </span>
        <span className="ml-2">© {currentYear}</span>
      </p>
    </footer>
  );
}
