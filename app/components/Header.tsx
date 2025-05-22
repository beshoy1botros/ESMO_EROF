import React from "react";
import { Link, useLocation } from "react-router";

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
        {navLinks.map((link) => {
          const isActive =
            link.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`no-underline px-4 py-2 transition-all font-medium
                ${
                  isActive
                    ? "text-blue-400 border-b-2 border-blue-500"
                    : "text-white hover:text-blue-400"
                }
              `}
              style={{ borderRadius: 0, background: "none" }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
