import { Link, useLocation } from "react-router-dom";
// استيراد الأيقونات من React Icons
import { FaHome, FaMusic, FaBook } from "react-icons/fa";

// أضفنا حقل icon إلى كل كائن في navLinks
const navLinks = [
  { to: "/", label: "الرئيسية", icon: FaHome },
  { to: "/melodies", label: "الألحان", icon: FaMusic },
  { to: "/about", label: "طقس اللحن", icon: FaBook },
  { to: "/preparatory", label: "تمهيدي", icon: FaBook },
];

export default function Header() {
  const location = useLocation();
  return (
    <header className="bg-blue-950 p-4 sm:p-6 text-center shadow-md">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 mb-3 sm:mb-4">
        ⲥⲙⲟⲩ ⲉⲣⲟϥ
      </h1>
      <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
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
                flex items-center gap-1 no-underline px-3 sm:px-4 py-2 transition-all font-medium text-sm sm:text-base rounded-lg
                ${
                  isActive
                    ? "text-blue-400 border-b-2 border-blue-500 bg-blue-900/30"
                    : "text-white hover:text-blue-400 hover:bg-blue-900/20"
                }
              `}
              style={{
                borderRadius: "0.5rem",
                background: isActive ? "rgba(59, 130, 246, 0.3)" : "none",
              }}
            >
              {/* أيقونة مع تلوين متغير بناء على حالة الـactive */}
              <Icon
                className={`
                  ${isActive ? "text-blue-400" : "text-white"}
                  ${isActive ? "" : "hover:text-blue-400"}
                `}
                size={16}
              />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden text-xs">{label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
