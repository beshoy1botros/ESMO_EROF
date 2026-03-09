import { Link, useLocation } from "react-router";
import { FaHome, FaMusic, FaBook, FaGraduationCap } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

declare module "react" {
  interface HTMLAttributes<T> {
    inert?: boolean | undefined;
  }
}

const navLinks = [
  { to: "/", label: "الرئيسية", icon: FaHome },
  { to: "/melodies", label: "الألحان", icon: FaMusic },
  { to: "/about", label: "طقس اللحن", icon: FaBook },
  { to: "/preparatory", label: "تمهيدي", icon: FaGraduationCap },
];

const NAV_DELAY_CLASSES = [
  "nav-item-delay-0",
  "nav-item-delay-1",
  "nav-item-delay-2",
  "nav-item-delay-3",
];

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      {/* ══════════════ الهيدر ══════════════ */}
      <header
        className={`
          header-blur sticky top-0 z-50 transition-all duration-300
          ${
            scrolled
              ? "bg-blue-950/95 shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-blue-800/60"
              : "bg-blue-950 border-b border-blue-900/40"
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* زر القائمة */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="
                md:hidden relative flex flex-col items-center justify-center
                w-11 h-11 rounded-xl
                text-white hover:text-blue-300
                bg-blue-900/40 hover:bg-blue-800/60
                border border-blue-700/40 hover:border-blue-500/60
                transition-all duration-200 active:scale-95
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
              "
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={isMenuOpen ? "true" : "false"}
              aria-controls="mobile-nav"
            >
              <span
                className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-200 my-[5px] ${isMenuOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
              />
            </button>

            {/* ✏️ الاسم الجديد بالإنجليزية */}
            <Link
              to="/"
              className="flex-1 flex items-center justify-center group focus-visible:outline-none"
              aria-label="الصفحة الرئيسية"
            >
              <h1
                className="
                font-newath font-bold leading-tight
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                text-blue-400 group-hover:text-blue-300
                transition-colors duration-200
                drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]
                group-hover:drop-shadow-[0_0_28px_rgba(96,165,250,0.5)]
                text-center tracking-wide
              "
              >
                ✦ Cmou ; Erof ;✦
              </h1>
            </Link>

            {/* اللوجو */}
            <Link to="/" tabIndex={-1}>
              <img
                src="/photos/العذراء مريم.ico"
                alt=""
                width={64}
                height={64}
                className="
                  w-16 h-16 sm:w-20 sm:h-20 object-contain
                  rounded-xl ring-1 ring-blue-700/40
                  hover:ring-blue-400/60 transition-all duration-200
                  hover:scale-105 active:scale-95
                "
                loading="eager"
              />
            </Link>
          </div>

          {/* شريط التنقل — سطح المكتب */}
          <nav
            className="hidden md:flex justify-center gap-1 pb-3"
            aria-label="القائمة الرئيسية"
          >
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`
                  group relative flex items-center gap-2
                  px-4 py-2 rounded-xl
                  text-sm font-semibold tracking-wide whitespace-nowrap
                  transition-all duration-200 active:scale-95
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                  ${
                    isActive(to)
                      ? "text-blue-300 bg-blue-800/50 border border-blue-600/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                      : "text-gray-300 hover:text-white hover:bg-blue-900/40 border border-transparent"
                  }
                `}
              >
                <Icon
                  size={15}
                  className={`transition-transform duration-200 group-hover:scale-110 ${isActive(to) ? "text-blue-400" : "text-gray-400 group-hover:text-blue-300"}`}
                />
                {label}
                {isActive(to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px rounded-full bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ══════════════ Overlay ══════════════ */}
      <div
        className={`
          nav-overlay fixed inset-0 z-40 md:hidden
          bg-black/60 transition-opacity duration-300
          ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto nav-overlay--open"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ══════════════ القائمة المتنقلة ══════════════ */}
      <div
        id="mobile-nav"
        ref={menuRef}
        className={`
          fixed top-0 right-0 bottom-0 z-50 md:hidden
          w-[min(280px,85vw)] flex flex-col
          bg-gradient-to-b from-blue-950 to-[#060d1f]
          border-l border-blue-800/50
          shadow-[-8px_0_40px_rgba(0,0,0,0.6)]
          transition-transform duration-300 ease-out
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
        inert={!isMenuOpen || undefined}
        role="dialog"
        aria-modal={isMenuOpen}
        aria-label="قائمة التنقل"
      >
        {/* رأس القائمة */}
        <div className="flex items-center justify-between px-5 pt-safe-top py-4 border-b border-blue-800/40">
          {/* ✏️ اسم الموقع داخل القائمة */}
          <span className="font-newath text-blue-400 text-xl tracking-wide">
             Cmou ; Erof ;
          </span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="
              w-9 h-9 flex items-center justify-center rounded-lg
              text-gray-400 hover:text-white
              bg-blue-900/40 hover:bg-blue-800/60
              transition-all duration-200 active:scale-90
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
            "
            aria-label="إغلاق القائمة"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.7 3.3a1 1 0 0 0-1.4 0L8 6.6 4.7 3.3a1 1 0 0 0-1.4 1.4L6.6 8l-3.3 3.3a1 1 0 1 0 1.4 1.4L8 9.4l3.3 3.3a1 1 0 0 0 1.4-1.4L9.4 8l3.3-3.3a1 1 0 0 0 0-1.4Z" />
            </svg>
          </button>
        </div>

        {/* روابط التنقل */}
        <nav
          className="flex-1 overflow-y-auto py-4 px-3"
          aria-label="روابط الصفحات"
        >
          {navLinks.map(({ to, label, icon: Icon }, index) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsMenuOpen(false)}
              className={`
                group flex items-center gap-3.5
                w-full px-4 py-3.5 mb-1.5 rounded-xl text-base font-semibold
                transition-all duration-200 active:scale-[0.97]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                ${NAV_DELAY_CLASSES[index] ?? ""}
                ${
                  isActive(to)
                    ? "text-blue-300 bg-blue-800/50 border border-blue-600/30 shadow-inner"
                    : "text-gray-300 hover:text-white hover:bg-blue-900/40 border border-transparent"
                }
              `}
            >
              <span
                className={`
                flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 transition-colors duration-200
                ${
                  isActive(to)
                    ? "bg-blue-600/30 text-blue-300"
                    : "bg-blue-900/50 text-gray-400 group-hover:text-blue-300 group-hover:bg-blue-800/50"
                }
              `}
              >
                <Icon size={17} />
              </span>

              {label}

              {isActive(to) && (
                <svg
                  className="mr-auto text-blue-500"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M10.3 8 6 3.7 4.6 5.1 8 8.5l-3.4 3.4L6 13.3z" />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* ذيل القائمة */}
        <div className="px-5 py-4 border-t border-blue-800/40 pb-safe-bottom">
          <p className="text-center text-xs text-blue-700/70 font-newath">
             الألحان القبطية  —  Cmou ; Erof ; 
          </p>
        </div>
      </div>
    </>
  );
}
