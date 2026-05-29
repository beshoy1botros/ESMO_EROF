/**
 * Offline Manager Component
 * واجهة تحكم المستخدم للتخزين والعمل بدون نت
 */

import { useState, useEffect } from "react";

interface OfflineManagerProps {
  className?: string;
}

interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

const APP_INSTALLED_KEY = "esmo-erof-app-installed";

function isStandaloneDisplayMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as IOSNavigator).standalone === true
  );
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

export function OfflineManager({ className = "" }: OfflineManagerProps) {
  // ✅ إصلاح SSR: ابدأ بـ true كقيمة آمنة للسيرفر
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [isPersistent, setIsPersistent] = useState(true);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // ✅ لا تعرض تحذير التخزين لمن ثبت التطبيق بالفعل
  useEffect(() => {
    const installed = isStandaloneDisplayMode() || getKnownInstalled();
    if (installed) {
      if (isStandaloneDisplayMode()) setKnownInstalled();
      setIsAppInstalled(true);
    }

    const handleAppInstalled = () => {
      setKnownInstalled();
      setIsAppInstalled(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("esmo-appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("esmo-appinstalled", handleAppInstalled);
    };
  }, []);

  // ✅ التحقق من التخزين الدائم (Persistence)
  useEffect(() => {
    async function checkPersist() {
      if (typeof navigator !== "undefined" && navigator.storage?.persisted) {
        try {
          const persisted = await navigator.storage.persisted();
          setIsPersistent(persisted);
        } catch (err) {
          console.warn("[Storage] فشل فحص التخزين الدائم:", err);
        }
      }
    }
    checkPersist();
  }, []);

  // ✅ تحديث حالة الاتصال الفعلية بعد الـ hydration على العميل فقط
  useEffect(() => {
    setIsOnline(navigator.onLine);
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true); // Show "Back Online" message
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      // Don't auto-hide offline notification
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setIsOnline(false);
      setShowNotification(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className={`offline-manager ${className}`}>
      <div className="offline-notifications-container">
        {/* Status Banner */}
        {showNotification && (
          <div className={`status-banner ${isOnline ? "online" : "offline"}`}>
            <div className="status-content">
              <span className="status-icon">{isOnline ? "✅" : "📴"}</span>
              <span>
                {isOnline
                  ? "تم استعادة الاتصال بالإنترنت"
                  : "أنت الآن تعمل بدون اتصال بالإنترنت"}
              </span>
            </div>
            {!isOnline && (
              <button
                onClick={() => setShowNotification(false)}
                aria-label="إغلاق"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Persistence Warning */}
        {!isPersistent && !isAppInstalled && (
          <div className="persistence-warning">
            <span>
              ⚠️ التخزين غير دائم — أضف التطبيق للشاشة الرئيسية لضمان بقاء
              الملفات
            </span>
          </div>
        )}
      </div>

      <style>{`
        .offline-manager {
          font-family: system-ui, -apple-system, sans-serif;
        }

        .offline-notifications-container {
          position: fixed;
          bottom: 24px;
          left: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 9999;
          pointer-events: none;
        }

        .status-banner, .persistence-warning {
          pointer-events: auto;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          border-radius: 12px;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .status-banner.offline {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .status-banner.online {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .persistence-warning {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeeba;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
          justify-content: center;
        }

        .status-content {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .status-banner button {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0 5px;
          opacity: 0.8;
          line-height: 1;
        }

        .status-banner button:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default OfflineManager;
