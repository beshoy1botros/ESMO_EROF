import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear(); // جلب السنة الحالية ديناميكيًا

  return (
    <footer className="bg-blue-950 p-4 sm:p-6 text-center mt-auto border-t border-blue-950">
      <p className="text-gray-400 text-sm sm:text-base">
        Made with{" "}
        <span role="img" aria-label="love">
          ❤️
        </span>{" "}
        by Beshoy Botros © {currentYear}
      </p>
    </footer>
  );
}
