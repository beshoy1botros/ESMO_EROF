/**
 * Offline Manager Component
 * واجهة تحكم المستخدم للتخزين والعمل بدون نت
 */

import { useState, useEffect } from "react";

interface OfflineManagerProps {
  className?: string;
}

export function OfflineManager({ className = "" }: OfflineManagerProps) {
  // ✅ إصلاح SSR: ابدأ بـ true كقيمة آمنة للسيرفر
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [isPersistent, setIsPersistent] = useState(true);

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
      setShowNotification(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className={`offline-manager ${className}`}>
      {/* Offline Notification Banner */}
      {showNotification && !isOnline && (
        <div className="offline-banner">
          <span>📴 أنت الآن تعمل بدون اتصال بالإنترنت</span>
          <button onClick={() => setShowNotification(false)} aria-label="إغلاق">
            ×
          </button>
        </div>
      )}

      {/* Persistence Warning */}
      {!isPersistent && (
        <div className="persistence-warning">
          <span>
            ⚠️ التخزين غير دائم — أضف التطبيق للشاشة الرئيسية لضمان بقاء الملفات
          </span>
        </div>
      )}

      {/* Network Status Indicator */}

      <style>{`
        .offline-manager {
          font-family: system-ui, -apple-system, sans-serif;
        }

        .offline-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 9999;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to   { transform: translateY(0); }
        }

        .persistence-warning {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeeba;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 13px;
          z-index: 9998;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          animation: fadeInUp 0.5s ease;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .offline-banner button {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0 10px;
        }

        .network-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .network-status.online {
          background: #d4edda;
          color: #155724;
        }

        .network-status.offline {
          background: #f8d7da;
          color: #721c24;
        }

        .status-icon {
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}

export default OfflineManager;
