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
  if (isInstalled) {
    return null;
  }

  // iOS Smart Banner
  if (showiOSBanner && !dismissed) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99999,
          backgroundColor: "#1e3a8a",
          color: "white",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          fontFamily: "inherit",
          direction: "rtl",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/photos/icon-172.png"
            alt="Logo"
            width="40"
            height="40"
            style={{ borderRadius: "8px" }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>
              حمل التطبيق على جهازك
            </div>
            <div style={{ fontSize: "12px", opacity: 0.9 }}>
              اضغط على زر المشاركة ثم "أضف إلى الشاشة الرئيسية"
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            padding: "4px 8px",
            opacity: 0.8,
          }}
          aria-label="إغلاق"
        >
          ✕
        </button>
      </div>
    );
  }

  // Android Auto-Install Button (fallback if auto-prompt doesn't work)
  if (isInstallable && !dismissed) {
    return (
      <button
        onClick={handleInstall}
        className="install-button"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          padding: "14px 28px",
          backgroundColor: "#1e3a8a",
          color: "white",
          border: "none",
          borderRadius: "50px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(30, 58, 138, 0.4)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "all 0.3s ease",
          fontFamily: "inherit",
        }}
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
