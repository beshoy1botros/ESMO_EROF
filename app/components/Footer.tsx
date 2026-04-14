export default function Footer() {
  // عرض السنة الحالية بشكل تلقائي
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 p-6 sm:p-8 text-center mt-auto border-t border-blue-900">
      <p className="text-gray-300 text-base sm:text-lg">
        صُنع بحب بواسطة المهندس/ جوزيف صادق
        <span className="mr-2 text-white text-lg sm:text-2xl">
          © {currentYear}
        </span>
      </p>
    </footer>
  );
}
