import { Link, useLocation } from "react-router";
import { FaHome, FaMusic, FaBook, FaGraduationCap } from "react-icons/fa";

const navLinks = [
  { to: "/", label: "الرئيسية", icon: FaHome },
  { to: "/melodies", label: "الألحان", icon: FaMusic },
  { to: "/about", label: "طقس اللحن", icon: FaBook },
  { to: "/preparatory", label: "تمهيدي", icon: FaGraduationCap },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-blue-950 p-4 sm:p-6 text-center shadow-lg border-b border-blue-900">
      {/* الجزء العلوي (العنوان واللوجو) كما هو */}
      <div className="flex justify-between items-center mb-2">
        <div className="w-16"></div>
        <h1 className="font-newath text-2xl sm:text-3xl lg:text-6xl font-bold text-blue-500 drop-shadow-md">
          {"# Cmou ; Erof ; #"}
        </h1>
        <img
          src="/photos/العذراء مريم.ico"
          alt="Virgin Mary"
          className="w-16 h-16 sm:w-22 sm:h-22 object-contain"
        />
      </div>

      {/* تطوير شريط التنقل */}
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
                group relative flex items-center gap-2 px-4 py-2.5 transition-all duration-300 rounded-xl overflow-hidden
                ${
                  isActive
                    ? "text-blue-400 bg-blue-900/40 shadow-inner border border-blue-500/30"
                    : "text-gray-300 hover:text-white hover:bg-blue-800/20 border border-transparent"
                }
              `}
            >
              {/* تأثير خلفية بسيط عند الـ Hover */}
              <span className={`absolute inset-0 w-0 bg-blue-500/10 transition-all duration-300 group-hover:w-full ${isActive ? 'hidden' : ''}`}></span>

              {/* الأيقونة */}
              <Icon
                className={`z-10 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                }`}
                size={18}
              />

              {/* النص (يظهر كاملاً في كل الشاشات مع ضبط الحجم) */}
              <span className="z-10 text-sm sm:text-base font-semibold tracking-wide">
                {label}
              </span>

              {/* خط سفلي متحرك يظهر فقط عند النشاط أو الـ Hover */}
              <span 
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-300 
                ${isActive ? "w-1/2" : "w-0 group-hover:w-1/3"}`}
              ></span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}