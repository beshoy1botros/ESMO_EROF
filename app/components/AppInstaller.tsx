import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

interface LegacyWindow extends Window {
  MSStream?: unknown;
}

interface EsmoInstallWindow extends Window {
  __esmoDeferredInstallPrompt?: BeforeInstallPromptEvent | null;
  esmoFeatures?: {
    triggerInstallPrompt?: () => boolean | void;
  };
}

type InstallGuide = "ios" | "android" | "desktop" | "browser";
const APP_INSTALLED_KEY = "esmo-erof-app-installed";

function isStandaloneDisplayMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as IOSNavigator).standalone === true
  );
}

function isIOSDevice() {
  return (
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
    !(window as LegacyWindow).MSStream
  );
}

function getInstallGuide(): InstallGuide {
  const ua = navigator.userAgent;

  if (isIOSDevice()) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Windows|Macintosh|Mac OS X|Linux|CrOS/i.test(ua)) return "desktop";

  return "browser";
}

function getKnownInstalled() {
  try {
    return localStorage.getItem(APP_INSTALLED_KEY) === "true";
  } catch {
    return false;
  }
}

function setKnownInstalled() {
  try {
    localStorage.setItem(APP_INSTALLED_KEY, "true");
  } catch {
    // Storage may be blocked; standalone detection still covers installed launches.
  }
}

export function AppInstaller() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [fallbackGuide, setFallbackGuide] = useState<InstallGuide>("browser");
  const [isReadyToShow, setIsReadyToShow] = useState(false);
  const [installGuide, setInstallGuide] = useState<InstallGuide | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState<InstallGuide | null>(null);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      const fallbackPrompt = (window as EsmoInstallWindow).esmoFeatures
        ?.triggerInstallPrompt;

      if (fallbackPrompt) {
        const didPrompt = fallbackPrompt();
        if (didPrompt) return;
      }

      setInstallGuide(fallbackGuide);
      setActiveTab(fallbackGuide);
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setKnownInstalled();
      setIsInstalled(true);
    }

    (window as EsmoInstallWindow).__esmoDeferredInstallPrompt = null;
    setDeferredPrompt(null);
    setIsInstallable(false);
    if (outcome === "dismissed") {
      setInstallGuide(fallbackGuide);
      setActiveTab(fallbackGuide);
    }
  }, [deferredPrompt, fallbackGuide]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    setIsInstallable(false);
    setInstallGuide(null);
  }, []);

  useEffect(() => {
    if (isStandaloneDisplayMode() || getKnownInstalled()) {
      if (isStandaloneDisplayMode()) setKnownInstalled();
      setIsInstalled(true);
      return;
    }

    const currentGuide = getInstallGuide();
    setFallbackGuide(currentGuide);
    setActiveTab(currentGuide);
    const showTimer = setTimeout(() => setIsReadyToShow(true), 900);

    const cachedPrompt = (window as EsmoInstallWindow)
      .__esmoDeferredInstallPrompt;
    if (cachedPrompt) {
      setDeferredPrompt(cachedPrompt);
      setIsInstallable(true);
      setIsReadyToShow(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installPrompt = e as BeforeInstallPromptEvent;
      (window as EsmoInstallWindow).__esmoDeferredInstallPrompt = installPrompt;
      setDeferredPrompt(installPrompt);
      setIsInstallable(true);
      setIsReadyToShow(true);
    };

    const handleCapturedBeforeInstallPrompt = () => {
      const prompt = (window as EsmoInstallWindow).__esmoDeferredInstallPrompt;
      if (!prompt) return;
      setDeferredPrompt(prompt);
      setIsInstallable(true);
      setIsReadyToShow(true);
    };

    const handleAppInstalled = () => {
      setKnownInstalled();
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setInstallGuide(null);
      (window as EsmoInstallWindow).__esmoDeferredInstallPrompt = null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener(
      "esmo-beforeinstallprompt",
      handleCapturedBeforeInstallPrompt,
    );
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("esmo-appinstalled", handleAppInstalled);

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener(
        "esmo-beforeinstallprompt",
        handleCapturedBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("esmo-appinstalled", handleAppInstalled);
    };
  }, []);

  if (isInstalled || dismissed || !isReadyToShow) return null;

  const currentGuide =
    activeTab ?? installGuide ?? (!isInstallable ? fallbackGuide : null);

  const getGuideContent = (guide: InstallGuide | null) => {
    switch (guide) {
      case "ios":
        return 'اضغط على "تحميل التطبيق"، وإذا لم تظهر نافذة التثبيت، افتح الموقع من Safari، اضغط زر المشاركة، اختر "إضافة إلى الشاشة الرئيسية"، ثم اضغط "إضافة".';
      case "android":
        return 'اضغط على "تحميل التطبيق"، وإذا لم تظهر نافذة التثبيت، افتح قائمة Chrome ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".';
      case "desktop":
        return 'اضغط على "تحميل التطبيق"، وإذا لم تظهر نافذة التثبيت، استخدم أيقونة التثبيت في شريط العنوان أو قائمة Chrome/Edge ثم اختر "Install app".';
      default:
        return isInstallable
          ? 'اضغط على "تحميل التطبيق" وسيظهر لك تأكيد التثبيت من المتصفح.'
          : 'اضغط على "تحميل التطبيق"، وإذا لم تظهر نافذة التثبيت، افتح قائمة المتصفح واختر "تثبيت التطبيق" أو "Add to Home screen".';
    }
  };

  const getGuideLabel = (guide: InstallGuide | null) => {
    switch (guide) {
      case "ios":
        return "iPhone";
      case "android":
        return "Android";
      case "desktop":
        return "الكمبيوتر";
      default:
        return "أخرى";
    }
  };

  return (
    <div
      className="
        fixed left-1/2 top-1/2 z-[9999]
        w-[min(94vw,420px)] -translate-x-1/2 -translate-y-1/2
        pointer-events-none
      "
      dir="rtl"
    >
      <div
        className="
          pointer-events-auto relative overflow-hidden
          rounded-[1.5rem] sm:rounded-[2.1rem] border border-blue-300/25
          bg-[radial-gradient(circle_at_85%_15%,rgba(96,165,250,0.25),transparent_32%),linear-gradient(150deg,rgba(15,32,72,0.98),rgba(4,11,29,0.98))]
          px-4 sm:px-6 pb-4 sm:pb-6 pt-4 text-white
          shadow-[0_30px_95px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.1)]
          backdrop-blur-2xl
          animate-fade-up
          max-h-[90vh] overflow-y-auto
        "
      >
        <div
          className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-blue-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl"
          aria-hidden
        />

        <button
          type="button"
          onClick={handleDismiss}
          onPointerDown={(event) => event.stopPropagation()}
          className="
            absolute left-2 top-2 sm:left-3 sm:top-3 z-30 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center
            rounded-full border border-white/12 bg-slate-950/35 text-lg sm:text-xl leading-none text-white/80
            shadow-[0_8px_20px_rgba(0,0,0,0.25)]
            transition hover:bg-white/12 hover:text-white active:scale-95
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300
          "
          aria-label="إغلاق زر تحميل التطبيق"
        >
          ×
        </button>

        <div className="relative z-10 flex items-start gap-3 sm:gap-4 pl-8 sm:pl-10">
          <img
            src="/photos/icon-172.png"
            alt=""
            width="56"
            height="56"
            className="mt-1 rounded-xl sm:rounded-2xl ring-1 ring-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.38)] sm:w-[64px] sm:h-[64px]"
          />
          <div className="min-w-0 flex-1 text-right">
            <p className="text-[0.6rem] sm:text-[0.7rem] font-bold uppercase tracking-[0.22em] text-blue-200/75">
              Coptic Hymns
            </p>
            <h2 className="mt-0.5 sm:mt-1 text-[1.1rem] sm:text-[1.35rem] font-black leading-7 sm:leading-8 text-white">
              حمل Coptic Hymns على جهازك
            </h2>
          </div>
        </div>

        <div className="relative z-10 mt-4 sm:mt-5 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.055] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex gap-1 mb-1">
            {(["android", "ios", "desktop"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 py-1.5 sm:py-2 text-[0.65rem] sm:text-xs font-bold rounded-lg sm:rounded-xl transition-all duration-200
                  ${
                    activeTab === tab
                      ? "bg-blue-600/40 text-white shadow-[0_2px_10px_rgba(37,99,235,0.2)] border border-blue-400/30"
                      : "text-blue-200/50 hover:text-blue-100 hover:bg-white/5"
                  }
                `}
              >
                {getGuideLabel(tab)}
              </button>
            ))}
          </div>

          <div className="px-3 sm:px-4 py-2 sm:py-3">
            <p className="mb-1 sm:mb-2 text-[0.55rem] sm:text-[0.65rem] font-bold uppercase tracking-wider text-blue-300/70">
              تعليمات {getGuideLabel(currentGuide)}
            </p>
            <p className="text-xs sm:text-sm font-medium leading-6 sm:leading-7 text-slate-100/90">
              {getGuideContent(currentGuide)}
            </p>
          </div>
        </div>

        <button
          type="button"
          data-pwa-install
          onClick={handleInstall}
          className="
            install-button relative z-10 mt-4 sm:mt-5 flex w-full items-center justify-center gap-2 sm:gap-3
            rounded-xl sm:rounded-[1.35rem] border border-blue-200/25
            bg-[linear-gradient(135deg,#4f8cff,#2357df)]
            px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg font-black text-white
            shadow-[0_18px_38px_rgba(37,99,235,0.42),inset_0_1px_0_rgba(255,255,255,0.16)]
            transition duration-300
            hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(37,99,235,0.52)]
            active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200
          "
          aria-label="تحميل التطبيق"
        >
          <svg
            width="20"
            height="20"
            className="sm:w-[23px] sm:h-[23px]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M12 3v11m0 0 4-4m-4 4-4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>تحميل التطبيق</span>
        </button>
      </div>
    </div>
  );
}
