/**
 * Offline Manager Component
 * واجهة تحكم المستخدم للتخزين والعمل بدون نت
 */

import { useState, useEffect } from "react";
import { getStorageEstimate, clearOfflineData } from "../utils/offlineDB";

interface CacheSize {
  static: string;
  video: string;
  image: string;
  font: string;
}

interface OfflineManagerProps {
  className?: string;
}

export function OfflineManager({ className = "" }: OfflineManagerProps) {
  // ✅ إصلاح SSR: ابدأ بـ true كقيمة آمنة للسيرفر
  const [isOnline, setIsOnline] = useState(true);
  const [cacheSize, setCacheSize] = useState<CacheSize | null>(null);
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    quota: number;
  } | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

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

  // Get cache sizes from Service Worker via MessageChannel
  useEffect(() => {
    const getCacheSizes = () => {
      try {
        if (!navigator.serviceWorker?.controller) return;

        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          if (event.data?.type === "CACHE_SIZE") {
            setCacheSize({
              static: event.data.static || "0 B",
              video: event.data.video || "0 B",
              image: event.data.image || "0 B",
              font: event.data.font || "0 B",
            });
          }
        };

        navigator.serviceWorker.controller.postMessage(
          { type: "GET_CACHE_SIZE" },
          [channel.port2]
        );
      } catch (error) {
        console.warn("[OfflineManager] Could not get cache sizes:", error);
      }
    };

    getCacheSizes();
    const interval = setInterval(getCacheSizes, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get storage estimate
  useEffect(() => {
    getStorageEstimate()
      .then(setStorageInfo)
      .catch((error) =>
        console.warn("[OfflineManager] Could not get storage estimate:", error)
      );
  }, []);

  const handleClearStorage = async () => {
    if (
      !confirm(
        "هل أنت متأكد من مسح جميع البيانات المخزنة؟\nسيؤدي هذا إلى حذف الفيديوهات والصور المخزنة للتحميل بدون نت."
      )
    ) {
      return;
    }

    setIsClearing(true);
    try {
      await clearOfflineData();

      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "CLEAR_CACHES",
        });
      }

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("[OfflineManager] Failed to clear storage:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTotalCacheSize = (): string => {
    if (!cacheSize) return "0 B";

    const parseSize = (sizeStr: string): number => {
      const match = sizeStr.match(/([\d.]+)\s*([KMGT]?B)/i);
      if (!match) return 0;
      const value = parseFloat(match[1]);
      const unit = match[2].toUpperCase();
      const multipliers: Record<string, number> = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
      };
      return value * (multipliers[unit] || 1);
    };

    const total =
      parseSize(cacheSize.static) +
      parseSize(cacheSize.video) +
      parseSize(cacheSize.image) +
      parseSize(cacheSize.font);

    return formatBytes(total);
  };

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

      {/* Storage Status Panel */}
      <div className="storage-panel">
        <h3 className="storage-title">💾 حالة التخزين</h3>

        <div className="storage-info">
          <div className="storage-item">
            <span className="storage-label">الفيديوهات:</span>
            <span className="storage-value">{cacheSize?.video || "0 B"}</span>
          </div>
          <div className="storage-item">
            <span className="storage-label">الصور:</span>
            <span className="storage-value">{cacheSize?.image || "0 B"}</span>
          </div>
          <div className="storage-item">
            <span className="storage-label">الملفات الثابتة:</span>
            <span className="storage-value">{cacheSize?.static || "0 B"}</span>
          </div>
          <div className="storage-item">
            <span className="storage-label">الخطوط:</span>
            <span className="storage-value">{cacheSize?.font || "0 B"}</span>
          </div>
          <div className="storage-item total">
            <span className="storage-label">الإجمالي:</span>
            <span className="storage-value">{getTotalCacheSize()}</span>
          </div>

          {storageInfo && storageInfo.quota > 0 && (
            <div className="storage-item">
              <span className="storage-label">المساحة المتاحة:</span>
              <span className="storage-value">
                {formatBytes(storageInfo.quota - storageInfo.used)}
              </span>
            </div>
          )}
        </div>

        <button
          className="clear-storage-btn"
          onClick={handleClearStorage}
          disabled={isClearing}
        >
          {isClearing ? "جاري المسح..." : "🗑️ مسح التخزين"}
        </button>
      </div>

      {/* Network Status Indicator */}
      <div className={`network-status ${isOnline ? "online" : "offline"}`}>
        <span className="status-icon">{isOnline ? "🟢" : "🔴"}</span>
        <span className="status-text">
          {isOnline ? "متصل بالإنترنت" : "غير متصل"}
        </span>
      </div>

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

        .offline-banner button {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0 10px;
        }

        .storage-panel {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 16px;
          margin: 16px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .storage-title {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #333;
        }

        .storage-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .storage-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: white;
          border-radius: 8px;
        }

        .storage-item.total {
          background: #e3f2fd;
          border: 2px solid #2196f3;
          font-weight: bold;
        }

        .storage-label {
          color: #666;
          font-size: 14px;
        }

        .storage-value {
          color: #333;
          font-weight: 500;
          font-size: 14px;
        }

        .clear-storage-btn {
          width: 100%;
          padding: 12px;
          background: #ff4757;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .clear-storage-btn:hover:not(:disabled) {
          background: #ff6b7a;
        }

        .clear-storage-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
