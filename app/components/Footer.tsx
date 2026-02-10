import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 p-6 sm:p-8 text-center mt-auto border-t border-blue-900">
      <p className="text-gray-300 text-base sm:text-lg">
        {" "}
        {/* تكبير الخط العام هنا */}
        Made with{" "}
        <span role="img" aria-label="love">
          ❤️
        </span>{" "}
        by{" "}
        <span className="font-newath text-white text-lg sm:text-2xl ml-1">
          {" "}
          {/* تكبير النص القبطي ليكون أوضح */}
          Piswi Petroc
        </span>{" "}
        <span className="ml-2">© {currentYear}</span>
      </p>
    </footer>
  );
}
