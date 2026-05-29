import { Link, useLocation } from "react-router";
import {
  FaHome,
  FaMusic,
  FaBook,
  FaGraduationCap,
  FaQuestionCircle,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

declare module "react" {
  interface HTMLAttributes<T> {
    inert?: boolean | undefined;
  }
}

const navLinks = [
  { to: "/", label: "مقدمة", icon: FaHome },
  { to: "/melodies", label: "الألحان", icon: FaMusic },
  { to: "/about", label: "طقس اللحن", icon: FaBook },
  { to: "/preparatory", label: "تمهيدي", icon: FaGraduationCap },
  { to: "/help", label: "دليل الاستخدام", icon: FaQuestionCircle },
];

interface FloatingDot {
  width: string;
  height: string;
  top: string;
  right: string;
  opacity: number;
  animation: string;
  animationDelay: string;
}

function isIOSDevice() {
  const nav = window.navigator as Navigator & {
    maxTouchPoints?: number;
    platform?: string;
  };

  return (
    /iPad|iPhone|iPod/.test(nav.userAgent) ||
    (nav.platform === "MacIntel" && (nav.maxTouchPoints ?? 0) > 1)
  );
}

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [floatingDots, setFloatingDots] = useState<FloatingDot[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const wasMenuOpenRef = useRef(false);

  useEffect(() => {
    setIsIOS(isIOSDevice());
  }, []);

  useEffect(() => {
    const dots: FloatingDot[] = [...Array(18)].map(() => ({
      width: Math.random() * 2 + 1 + "px",
      height: Math.random() * 2 + 1 + "px",
      top: Math.random() * 100 + "%",
      right: Math.random() * 100 + "%",
      opacity: Math.random() * 0.4 + 0.1,
      animation: `float-dot ${2 + Math.random() * 3}s ease-in-out infinite`,
      animationDelay: Math.random() * 3 + "s",
    }));
    setFloatingDots(dots);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useBodyScrollLock(isMenuOpen);

  useEffect(() => {
    // تحديث aria-expanded بشكل مباشر لتجنب مشكلة التحليل الثابت للـ linter
    menuButtonRef.current?.setAttribute("aria-expanded", String(isMenuOpen));

    if (isMenuOpen) {
      requestAnimationFrame(() => firstMobileLinkRef.current?.focus());
    } else if (wasMenuOpenRef.current) {
      menuButtonRef.current?.focus();
    }
    wasMenuOpenRef.current = isMenuOpen;
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
          ${isIOS ? "ios-safe-header" : ""}
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
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen((v) => !v)}
              className="
                md:hidden relative flex flex-col items-center justify-center
                w-12 h-12 rounded-2xl
                text-white hover:text-blue-200
                bg-blue-900/60 hover:bg-blue-800/75
                border border-blue-700/50 hover:border-blue-500/70
                transition-all duration-200 active:scale-95 shadow-lg
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                mobile-menu-enhanced
                space-y-1.5
              "
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded="false"
              aria-controls="mobile-nav"
            >
              <span
                className={`block w-6 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
                  isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block w-6 h-[2px] bg-current rounded-full transition-all duration-200 ${
                  isMenuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
                  isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>

            {/* الاسم */}
            <div className="flex-1 flex items-center justify-center">
              <h1
                className="
                font-newath font-bold leading-tight
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                text-blue-400
                drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]
                text-center tracking-wide"
              >
                # Cmou ; Erof ;#
              </h1>
            </div>

            {/* اللوجو */}
            <Link to="/" tabIndex={-1}>
              <img
                src="/photos/favicon-96x96.png"
                alt=""
                width={50}
                height={50}
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
                  group relative flex flex-col items-center justify-center
                  gap-2 px-4 py-3 rounded-xl
                  text-sm font-semibold tracking-wide text-center
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
                  size={18}
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive(to)
                      ? "text-blue-400"
                      : "text-gray-400 group-hover:text-blue-300"
                  }`}
                />
                <span className="mt-1">{label}</span>
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
          bg-black/80 backdrop-blur-sm transition-opacity duration-300
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
          ${isIOS ? "ios-safe-drawer" : ""}
          w-[min(340px,92vw)] flex flex-col
          transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          scan-line-effect
          bg-[linear-gradient(160deg,#0f1e3d_0%,#071028_45%,#030b1a_100%)]
          border-l border-blue-500/25
          ${
            isMenuOpen
              ? "translate-x-0 shadow-[-20px_0_80px_rgba(0,0,0,0.9),-2px_0_0_rgba(59,130,246,0.15),inset_1px_0_0_rgba(96,165,250,0.08)]"
              : "translate-x-full"
          }
        `}
        inert={!isMenuOpen || undefined}
        role="dialog"
        aria-modal={isMenuOpen}
        aria-label="قائمة التنقل"
      >
        {/* ── نجوم خلفية زخرفية ── */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden
        >
          {floatingDots.map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400"
              style={dot}
            />
          ))}
          {/* توهج جانبي */}
          <div className="absolute top-0 right-0 w-40 h-72 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#3b82f6,transparent_70%)]" />
          <div className="absolute bottom-0 right-8 w-56 h-48 opacity-[0.08] pointer-events-none bg-[radial-gradient(ellipse_at_bottom,#1d4ed8,transparent_70%)]" />
        </div>

        {/* ══ رأس القائمة ══ */}
        <div className="relative flex items-center justify-between px-6 py-5 flex-shrink-0 bg-[linear-gradient(135deg,rgba(30,58,138,0.6)_0%,rgba(15,23,42,0.4)_100%)] border-b border-blue-500/20 backdrop-blur-[12px]">
          {/* شعار النص */}
          <div className="flex flex-col gap-0.5">
            <span className="shimmer-text font-newath font-bold tracking-[0.12em] text-[1.25rem]">
              Cmou ; Erof ;
            </span>
            <span className="text-blue-500/60 text-xs tracking-widest font-mono">
              ✦ COPTIC HYMNS ✦
            </span>
          </div>

          {/* زر الإغلاق */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="
              relative group flex items-center justify-center
              w-11 h-11 rounded-xl
              bg-blue-900/40 border border-blue-400/20
              shadow-[0_2px_12px_rgba(0,0,0,0.4)]
              transition-all duration-200 active:scale-90
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
            "
            aria-label="إغلاق القائمة"
          >
            <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-500/15" />
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              stroke="rgba(147,197,253,0.9)"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>

        {/* ── فاصل مضيء ── */}
        <div className="h-px flex-shrink-0 bg-[linear-gradient(90deg,transparent_0%,rgba(96,165,250,0.5)_40%,rgba(147,197,253,0.7)_60%,transparent_100%)]" />

        {/* ══ روابط التنقل ══ */}
        <nav
          className="relative flex-1 overflow-y-auto py-5 px-4 space-y-2 [scrollbar-width:none]"
          aria-label="روابط الصفحات"
        >
          {navLinks.map(({ to, label, icon: Icon }, index) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                ref={index === 0 ? firstMobileLinkRef : undefined}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  nav-item-enter nav-item-delay-${Math.min(index + 1, 5)}
                  group relative flex items-center gap-4
                  w-full px-4 py-3.5 rounded-2xl text-base font-semibold
                  transition-all duration-200 active:scale-[0.97]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                  overflow-hidden
                  ${
                    active
                      ? "active-link-glow bg-[linear-gradient(135deg,rgba(37,99,235,0.35)_0%,rgba(29,78,216,0.2)_100%)] border border-blue-400/40 text-blue-300"
                      : "bg-[rgba(15,28,63,0.4)] border border-blue-500/[0.08] text-slate-300"
                  }
                `}
              >
                {/* تأثير hover */}
                {!active && (
                  <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[linear-gradient(135deg,rgba(37,99,235,0.15)_0%,rgba(29,78,216,0.08)_100%)] border border-blue-400/20" />
                )}

                {/* بريق حركي عند الـ hover */}
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[linear-gradient(105deg,transparent_40%,rgba(147,197,253,0.06)_50%,transparent_60%)] bg-[length:200%_100%]" />

                {/* أيقونة */}
                <span
                  className={`
                    relative flex items-center justify-center flex-shrink-0
                    w-[42px] h-[42px] rounded-xl transition-all duration-200
                    ${
                      active
                        ? "bg-[linear-gradient(135deg,rgba(59,130,246,0.5),rgba(37,99,235,0.3))] border border-blue-400/50 shadow-[0_0_16px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] text-blue-300"
                        : "bg-[rgba(15,28,63,0.7)] border border-blue-500/15 text-slate-400"
                    }
                  `}
                >
                  <Icon size={19} />
                  {active && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-300 shadow-[0_0_6px_rgba(147,197,253,0.9)]" />
                  )}
                </span>

                {/* النص */}
                <span className="relative flex-1 text-right font-semibold tracking-wide text-[0.975rem]">
                  {label}
                </span>

                {/* مؤشر الصفحة النشطة */}
                {active ? (
                  <span className="relative flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-1.5 h-5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  </span>
                ) : (
                  <svg
                    className="relative flex-shrink-0 text-blue-600/40 group-hover:text-blue-400/70 transition-colors duration-200"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M10.3 8 6 3.7 4.6 5.1 8 8.5l-3.4 3.4L6 13.3z" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── فاصل مضيء ── */}
        <div className="h-px flex-shrink-0 mx-6 bg-[linear-gradient(90deg,transparent,rgba(96,165,250,0.3),transparent)]" />

        {/* ══ ذيل القائمة ══ */}
        <div className="relative px-6 py-5 flex-shrink-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.8)_0%,rgba(10,15,30,0.6)_100%)]">
          {/* نص الذيل */}
          <p className="text-center text-xs tracking-[0.15em] font-mono text-blue-400/55">
            الألحان القبطية
          </p>
          <p className="text-center font-newath text-xs mt-1 tracking-[0.1em] text-slate-400/35">
            Cmou ; Erof ;
          </p>

          {/* نقاط متحركة */}
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/35 [animation:float-dot_1.5s_ease-in-out_infinite]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[linear-gradient(135deg,#60a5fa,#3b82f6)] shadow-[0_0_12px_rgba(96,165,250,0.7)] [animation:float-dot_1.9s_ease-in-out_infinite] [animation-delay:200ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/35 [animation:float-dot_2.3s_ease-in-out_infinite] [animation-delay:400ms]" />
          </div>

          {/* خط إضاءة سفلي */}
          <div className="absolute bottom-0 left-6 right-6 h-px bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.4),transparent)]" />
        </div>
      </div>
    </>
  );
}
