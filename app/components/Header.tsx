import React from "react";
import { useLocation, Link } from "react-router";

const navLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/melodies", label: "الألحان" },
  { to: "/about", label: "طقس اللحن" },
];

export default function Header() {
  const location = useLocation();
  return (
    <header className="bg-blue-950 p-6 text-center shadow-md">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">ⲥⲙⲟⲩ ⲉⲣⲟϥ</h1>
      <nav className="flex justify-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={
              location.pathname === link.to
                ? "text-blue-400 font-bold border-b-2 border-blue-400 pb-1"
                : "text-gray-300 hover:text-blue-300 transition-colors"
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
