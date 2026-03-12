import { useState, useEffect, useRef } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Track installation locally
export function trackInstallation(platform: string) {
  // Store in localStorage (simple counter per device)
  const installData = JSON.parse(localStorage.getItem("app_installs") || "{}");
  installData[platform] = (installData[platform] || 0) + 1;
  installData.total = (installData.total || 0) + 1;
  installData.lastInstall = new Date().toISOString();
  localStorage.setItem("app_installs", JSON.stringify(installData));

  // Log for debugging
  console.log("📱 App Installed!", installData);

  // Also track globally
  import("../utils/analytics").then(({ trackGlobalInstallation }) => {
    trackGlobalInstallation();
  });
}

export function getInstallStats() {
  return JSON.parse(localStorage.getItem("app_installs") || "{}");
}

export function AppInstaller() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showiOSBanner, setShowiOSBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const hasAttemptedInstall = useRef(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
        return true;
      }
      // @ts-ignore - navigator.standalone is iOS specific
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Check if user previously dismissed the banner
    const wasDismissed =
      localStorage.getItem("app-install-dismissed") === "true";
    if (wasDismissed) {
      setDismissed(true);
    }

    if (checkInstalled()) return;

    // Detect iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIOS) {
      // Show iOS install banner after a short delay
      setTimeout(() => {
        if (!wasDismissed) {
          setShowiOSBanner(true);
        }
      }, 1500);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      // Auto-show the install prompt after a short delay (for Android)
      if (!hasAttemptedInstall.current && !wasDismissed) {
        hasAttemptedInstall.current = true;
        setTimeout(() => {
          handleInstall();
        }, 2000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowiOSBanner(false);

      // Track the installation
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      trackInstallation(isIOS ? "iOS" : "Android");

      // Also track page visit as backup
      fetch("https://api.countapi.xyz/hit/esmo-erof-v1/downloads")
        .then(() => console.log("Download tracked"))
        .catch(() => {});
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if beforeinstallprompt was already fired (some browsers)
    setTimeout(() => {
      if (!hasAttemptedInstall.current && deferredPrompt) {
        hasAttemptedInstall.current = true;
        handleInstall();
      }
    }, 3000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowiOSBanner(false);
    setIsInstallable(false);
    localStorage.setItem("app-install-dismissed", "true");
  };

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
              اضغط على {} ثم "أضف إلى الشاشة الرئيسية"
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
