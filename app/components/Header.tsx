import React from "react";
import { Link, useLocation } from "react-router";
// استيراد الأيقونات من React Icons
import { FaHome, FaMusic, FaBook } from "react-icons/fa";

// أضفنا حقل icon إلى كل كائن في navLinks
const navLinks = [
  { to: "/", label: "الرئيسية", icon: FaHome },
  { to: "/melodies", label: "الألحان", icon: FaMusic },
  { to: "/about", label: "طقس اللحن", icon: FaBook },
];

export default function Header() {
  const location = useLocation();
  return (
    <header className="bg-blue-950 p-6 text-center shadow-md">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">ⲥⲙⲟⲩ ⲉⲣⲟϥ</h1>
      <nav className="flex justify-center gap-4">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`
                flex items-center gap-1 no-underline px-4 py-2 transition-all font-medium
                ${
                  isActive
                    ? "text-blue-400 border-b-2 border-blue-500"
                    : "text-white hover:text-blue-400"
                }
              `}
              style={{ borderRadius: 0, background: "none" }}
            >
              {/* أيقونة مع تلوين متغير بناء على حالة الـactive */}
              <Icon
                className={`
                  ${isActive ? "text-blue-400" : "text-white"} 
                  ${isActive ? "" : "hover:text-blue-400"}
                `}
                size={18}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
