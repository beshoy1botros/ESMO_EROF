import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ContactType = "مشكلة" | "اقتراح" | "أخرى";

interface ContactOption {
  type: ContactType;
  label: string;
  icon: string;
  color: string;
  hoverColor: string;
  message: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PHONE_NUMBER = "201210138629";

const CONTACT_OPTIONS: ContactOption[] = [
  {
    type: "مشكلة",
    label: "الإبلاغ عن مشكلة",
    icon: "⚠",
    color: "bg-rose-600/90 border-rose-500",
    hoverColor: "hover:bg-rose-500",
    message: "مرحباً، لدي مشكلة في التطبيق: ",
  },
  {
    type: "اقتراح",
    label: "إرسال اقتراح",
    icon: "✦",
    color: "bg-sky-600/90 border-sky-500",
    hoverColor: "hover:bg-sky-500",
    message: "مرحباً، لدي اقتراح لتحسين التطبيق: ",
  },
  {
    type: "أخرى",
    label: "استفسار عام",
    icon: "✉",
    color: "bg-slate-600/90 border-slate-500",
    hoverColor: "hover:bg-slate-500",
    message: "مرحباً، أريد التواصل بخصوص: ",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function openWhatsApp(message: string) {
  const encoded = encodeURIComponent(message);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    // On mobile: try deep link first, fallback to web after 1.5s
    window.location.href = `whatsapp://send?phone=${PHONE_NUMBER}&text=${encoded}`;
    setTimeout(() => {
      window.open(
        `https://wa.me/${PHONE_NUMBER}?text=${encoded}`,
        "_blank",
        "noopener,noreferrer",
      );
    }, 1500);
  } else {
    // On desktop: open web WhatsApp directly
    window.open(
      `https://web.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encoded}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
/** Animated WhatsApp icon */
function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ContactModal({ isOpen, onClose }: ModalProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  // Handle open/close animation lifecycle
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
      setTimeout(() => firstButtonRef.current?.focus(), 80);
      return;
    }
    setAnimating(false);
    const t = setTimeout(() => setVisible(false), 280);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!visible) return null;

  const handleSelect = (option: ContactOption) => {
    openWhatsApp(option.message);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      dir="rtl"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: animating ? 1 : 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl transition-all duration-300 ease-out"
        style={{
          transform: animating
            ? "translateY(0) scale(1)"
            : "translateY(40px) scale(0.96)",
          opacity: animating ? 1 : 0,
        }}
      >
        {/* Gold top accent line */}
        <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-6 pt-4 pb-6">
          <h3
            id="modal-title"
            className="text-center text-base font-semibold text-white/90 mb-1"
          >
            تواصل معنا
          </h3>
          <p className="text-center text-xs text-white/40 mb-5">
            اختر نوع استفسارك وسيتم فتح واتساب تلقائياً
          </p>

          <div className="flex flex-col gap-3">
            {CONTACT_OPTIONS.map((option, i) => (
              <button
                key={option.type}
                ref={i === 0 ? firstButtonRef : undefined}
                onClick={() => handleSelect(option)}
                className={`
                  flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/90
                  border border-white/10 backdrop-blur-sm font-medium text-sm
                  active:scale-[0.97]
                  ${option.color} ${option.hoverColor}
                `}
                style={{
                  transitionProperty: "transform, opacity",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "ease-out",
                  transitionDelay: animating ? `${i * 40}ms` : "0ms",
                  transform: animating ? "translateX(0)" : "translateX(16px)",
                  opacity: animating ? 1 : 0,
                }}
              >
                <span
                  className="text-base w-6 h-6 flex items-center justify-center rounded-lg bg-white/10"
                  aria-hidden="true"
                >
                  {option.icon}
                </span>
                <span className="flex-1 text-right">{option.label}</span>
                <WhatsAppIcon className="w-4 h-4 opacity-50 flex-shrink-0" />
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2.5 rounded-xl text-white/50 text-sm
              border border-white/8 hover:bg-white/5 hover:text-white/70
              transition-colors duration-200 active:scale-[0.98]"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <footer
        dir="rtl"
        className="
          relative overflow-hidden
          bg-gradient-to-b from-blue-950 via-blue-950 to-slate-950
          border-t border-blue-900/40 mt-auto
          px-6 py-8 sm:py-10 text-center
        "
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 120%, rgba(59,130,246,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-lg mx-auto">
          {/* Church name */}
          <p className="text-blue-200/70 text-sm tracking-wider uppercase mb-1 font-light">
            كنيسة السيدة العذراء مريم - أبو حماد
          </p>

          {/* Copyright */}
          <p className="text-white/80 text-base sm:text-lg font-medium mb-6">
            جميع الحقوق محفوظة
            <span className="mx-2 text-amber-400/80">{currentYear} ©</span>
          </p>

          {/* WhatsApp button */}
          <button
            onClick={openModal}
            aria-label="تواصل معنا عبر واتساب"
            className="
              inline-flex items-center gap-2.5 px-5 py-2.5
              bg-white/10 hover:bg-white/20 active:bg-white/5
              text-white text-sm font-medium rounded-full
              border border-white/20
              transition-all duration-200 active:scale-[0.97]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950
            "
          >
            <WhatsAppIcon className="w-4 h-4" />
            تواصل عبر الواتساب
          </button>
          {/* تنبيه أخطاء */}
          <p className="mt-5 text-white/60 text-xs leading-relaxed">
            <span className="text-yellow-90">⚠</span> احتمال وجود أخطاء في بعض كلمات اللحن أو الطقس،
            <br />
            يُرجى مراجعتهما جيداً مع مدرس الألحان.
          </p>
        </div>
      </footer>

      <ContactModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
