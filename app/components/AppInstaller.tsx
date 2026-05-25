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

const INSTALL_DISMISSED_KEY = "app-install-dismissed";

function isStandaloneDisplayMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as IOSNavigator).standalone === true
  );
}

function isIOSDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as LegacyWindow).MSStream
  );
}

function getInstallDismissed() {
  try {
    return localStorage.getItem(INSTALL_DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}

function setInstallDismissed() {
  try {
    localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
  } catch {
    // Storage can be blocked in private browsing; dismissal still works in state.
  }
}

export function AppInstaller() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showiOSBanner, setShowiOSBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    setShowiOSBanner(false);
    setIsInstallable(false);
    setInstallDismissed();
  }, []);

  useEffect(() => {
    if (isStandaloneDisplayMode()) {
      setIsInstalled(true);
      return;
    }

    const wasDismissed = getInstallDismissed();
    setDismissed(wasDismissed);

    let iosTimer: ReturnType<typeof setTimeout> | undefined;

    if (isIOSDevice()) {
      iosTimer = setTimeout(() => {
        if (!wasDismissed) {
          setShowiOSBanner(true);
        }
      }, 1500);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(!wasDismissed);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowiOSBanner(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      if (iosTimer) clearTimeout(iosTimer);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Don't render if already installed
  if (isInstalled) return null;

  // iOS Smart Banner
  if (showiOSBanner && !dismissed) {
    return (
      <div
        className="
          fixed top-0 left-0 right-0 z-[99999]
          bg-blue-900 text-white
          px-4 py-3
          flex items-center justify-between
          shadow-[0_2px_10px_rgba(0,0,0,0.2)]
          font-inherit
          direction-rtl
          rtl
        "
      >
        <div className="flex items-center gap-3">
          <img
            src="/photos/icon-172.png"
            alt="Logo"
            width="40"
            height="40"
            className="rounded-lg"
          />
          <div>
            <div className="font-bold text-sm">حمل التطبيق على جهازك</div>
            <div className="text-xs opacity-90">
              اضغط على زر المشاركة ثم "أضف إلى الشاشة الرئيسية"
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="
            bg-transparent border-none text-white
            text-2xl cursor-pointer
            px-2 py-1 opacity-80
            hover:opacity-100 transition-opacity duration-200
          "
          aria-label="إغلاق"
        >
          ✕
        </button>
      </div>
    );
  }

  // Android Auto-Install Button
  if (isInstallable && !dismissed) {
    return (
      <button
        onClick={handleInstall}
        className="
          install-button
          fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999]
          px-7 py-3.5
          bg-blue-900 text-white
          border-none rounded-full
          text-base font-semibold cursor-pointer
          shadow-[0_4px_20px_rgba(30,58,138,0.4)]
          flex items-center gap-2.5
          transition-all duration-300 ease-in-out
          hover:bg-blue-800 hover:shadow-[0_6px_24px_rgba(30,58,138,0.6)] hover:-translate-y-0.5
          active:scale-95
        "
        aria-label="تثبيت التطبيق"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 22V12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 7L12 12L4 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>تحميل التطبيق</span>
      </button>
    );
  }

  return null;
}
