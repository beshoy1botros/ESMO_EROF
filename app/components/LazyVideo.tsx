import { useRef, useEffect, useState, useCallback } from "react";
import { evictVideo } from "../utils/swClient";

interface LazyVideoProps {
  src: string;
  title: string;
  poster?: string | undefined;
  startTime?: number;
  onTimeUpdate?: (time: number) => void;
  onPlayChange?: (isPlaying: boolean) => void;
}

// قائمة بجميع الفيديوهات النشطة
const videoInstances: HTMLVideoElement[] = [];

// عدد محاولات الاسترداد التلقائي قبل إظهار خطأ للمستخدم
const MAX_STALL_RETRIES = 3;
// الانتظار بين كل محاولة (ms) — يتضاعف مع كل محاولة (exponential backoff)
const BASE_RETRY_DELAY = 2000;

export default function LazyVideo({
  src,
  title,
  poster,
  startTime = 0,
  onTimeUpdate,
  onPlayChange,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialTimeSet = useRef(false);
  const stallRetryCount = useRef(0);
  const stallTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCurrentTime = useRef(0);

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stallMessage, setStallMessage] = useState<string | null>(null);

  // ── مسح الـ stall timer عند الـ unmount أو تغيير الـ src ──────────────
  const clearStallTimer = useCallback(() => {
    if (stallTimer.current) {
      clearTimeout(stallTimer.current);
      stallTimer.current = null;
    }
  }, []);

  // ── محاولة استرداد تلقائي عند التوقف ────────────────────────────────
  const attemptStalledRecovery = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // دايماً حاول استرداد الفيديو بدون حدود
    const delay = BASE_RETRY_DELAY * Math.pow(2, stallRetryCount.current % 5); // 2s, 4s, 8s, 16s, 32s
    stallRetryCount.current += 1;

    setStallMessage(`جاري المحاولة... (${stallRetryCount.current})`);

    stallTimer.current = setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;

      const wasPlaying = !v.paused;
      const savedTime = v.currentTime;

      // الحيلة: تحريك الوقت بشكل طفيف يجبر المتصفح على طلب بيانات جديدة
      try {
        v.currentTime = Math.max(0, savedTime - 0.1);
      } catch {}

      if (wasPlaying) {
        v.play().catch(() => {
          // أعد تحميل الـ src بـ timestamp لكسر الكاش
          const sep = src.includes("?") ? "&" : "?";
          const bustSrc = `${src}${sep}_cb=${Date.now()}`;
          const sourceEl = v.querySelector("source");
          if (sourceEl) sourceEl.setAttribute("src", bustSrc);
          v.load();
          v.currentTime = savedTime;
          v.play().catch(() => {
            // تابع المحاولة بدون إظهار خطأ
          });
        });
      }
    }, delay);
  }, [src]);

  // ── إعادة ضبط عند تغيير الـ src ─────────────────────────────────────
  useEffect(() => {
    initialTimeSet.current = false;
    stallRetryCount.current = 0;
    setHasError(false);
    setIsLoading(true);
    setStallMessage(null);
    clearStallTimer();
  }, [src, clearStallTimer]);

  // ── ربط أحداث الفيديو ────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (startTime > 0 && !initialTimeSet.current) {
      video.currentTime = startTime;
      initialTimeSet.current = true;
    }

    // تسجيل الفيديو في قائمة الفيديوهات النشطة
    if (!videoInstances.includes(video)) {
      videoInstances.push(video);
    }

    const handlePlay = () => {
      // أوقف بقية الفيديوهات عند تشغيل هذا الفيديو
      videoInstances.forEach((v) => {
        if (v !== video && !v.paused) v.pause();
      });
      // الفيديو شغّال → أعد ضبط حالات التوقف
      clearStallTimer();
      stallRetryCount.current = 0;
      setStallMessage(null);
      onPlayChange?.(true);
    };

    const handlePause = () => {
      clearStallTimer();
      onPlayChange?.(false);
    };

    const handleTimeUpdate = () => {
      lastCurrentTime.current = video.currentTime;
      onTimeUpdate?.(video.currentTime);
    };

    const handleCanPlay = () => {
      clearStallTimer();
      stallRetryCount.current = 0;
      setStallMessage(null);
    };

    const handleStalled = () => {
      // "stalled" = المتصفح طلب بيانات لكنها ما جاتش
      // نبدأ محاولة استرداد تلقائي فقط لو الفيديو كان شغّال
      if (!video.paused) {
        attemptStalledRecovery();
      }
    };

    const handleError = () => {
      // بدلاً من إظهار خطأ، استمر في المحاولة
      setStallMessage("جاري التحقق من الاتصال بالإنترنت...");
      attemptStalledRecovery();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("error", handleError);

      clearStallTimer();
      // إزالة الفيديو من قائمة الفيديوهات النشطة
      const index = videoInstances.indexOf(video);
      if (index > -1) videoInstances.splice(index, 1);
    };
  }, [
    startTime,
    attemptStalledRecovery,
    clearStallTimer,
    onPlayChange,
    onTimeUpdate,
  ]);

  // ── إعادة المحاولة اليدوية (زر المستخدم) ────────────────────────────
  const handleManualRetry = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      evictVideo(src);
    } catch {}

    stallRetryCount.current = 0;
    setHasError(false);
    setIsLoading(true);
    setStallMessage(null);

    const sep = src.includes("?") ? "&" : "?";
    const newSrc = `${src}${sep}retry=${Date.now()}`;
    const sourceEl = video.querySelector("source");
    if (sourceEl) sourceEl.setAttribute("src", newSrc);
    video.load();

    try {
      await video.play();
    } catch {}
  };

  return (
    <div className="relative w-full h-full group">
      {/* Poster Background - removed loading overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 blur-0 scale-100"
        style={{
          backgroundImage: poster ? `url(${poster})` : "none",
          backgroundColor: poster ? "transparent" : "#1a1a2e",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <video
        ref={videoRef}
        className="relative w-full h-full max-w-full max-h-full object-contain bg-transparent"
        controls
        preload="auto"
        poster={poster}
        playsInline
        crossOrigin="anonymous"
        disablePictureInPicture={false}
        aria-label={`${title}${isLoading ? " (جارٍ التحميل)" : ""}${stallMessage ? " - " + stallMessage : ""}`}
        title={title}
        onError={() => {
          // بدلاً من إظهار خطأ، استمر في المحاولة
          setStallMessage("جاري التحقق من الاتصال بالإنترنت...");
          setIsLoading(true);
          attemptStalledRecovery();
        }}
        onLoadedData={() => {
          setIsLoading(false);
        }}
      >
        <source src={src} type="video/mp4" />
        <p className="text-gray-400 text-sm text-center p-4">
          متصفحك لا يدعم تشغيل الفيديو. الرجاء تحديث المتصفح.
        </p>
      </video>

      {/* Error Overlay - تصميم محسّن */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/70 to-black/90 text-white p-6 backdrop-blur-sm">
          <div className="text-center max-w-sm">
            {/* أيقونة الخطأ */}
            <div className="mb-4 relative">
              <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <svg
                  className="w-10 h-10 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              تحقق من الاتصال بالإنترنت
            </h3>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              يرجى التحقق من اتصالك بالإنترنت وسيتم تحميل الفيديو تلقائياً عند
              استعادة الاتصال.
            </p>

            <button
              onClick={handleManualRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
