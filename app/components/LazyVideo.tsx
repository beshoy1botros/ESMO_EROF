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

const videoInstances: HTMLVideoElement[] = [];
const BASE_RETRY_DELAY = 2000;

// ✅ FIX: waiting ده مش دايماً خطأ — انتظر 5 ثواني قبل التدخل
const STALL_THRESHOLD_MS = 5000;

export default function LazyVideo({
  src,
  title,
  poster,
  startTime = 0,
  onTimeUpdate,
  onPlayChange,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceRef = useRef<HTMLSourceElement>(null);
  const initialTimeSet = useRef(false);
  const stallRetryCount = useRef(0);
  const stallTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // ✅ مؤقت لـ waiting event — لا نتدخل فوراً
  const waitingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [stallMessage, setStallMessage] = useState<string | null>(null);

  const clearStallTimer = useCallback(() => {
    if (stallTimer.current) {
      clearTimeout(stallTimer.current);
      stallTimer.current = null;
    }
  }, []);

  // ✅ FIX: تنظيف مؤقت الـ waiting أيضاً
  const clearWaitingTimer = useCallback(() => {
    if (waitingTimer.current) {
      clearTimeout(waitingTimer.current);
      waitingTimer.current = null;
    }
  }, []);

  const attemptStalledRecovery = useCallback(() => {
    const video = videoRef.current;
    const source = sourceRef.current;
    if (!video || !source) return;

    const delay = BASE_RETRY_DELAY * Math.pow(2, stallRetryCount.current % 5);
    const isOffline = !navigator.onLine;
    stallRetryCount.current += 1;

    setStallMessage(
      isOffline
        ? `جاري البحث في الكاش... (${stallRetryCount.current})`
        : `جاري استعادة الفيديو... (${stallRetryCount.current})`,
    );

    stallTimer.current = setTimeout(() => {
      if (!videoRef.current || !sourceRef.current) return;

      const wasPlaying = !videoRef.current.paused;
      const savedTime = videoRef.current.currentTime;

      // ✅ في الأوفلاين: استخدم المسار الأصلي بدون cache buster
      //    المسار الأصلي هو الي مخزن في الكاش
      let finalSrc = src;
      if (!isOffline) {
        const sep = src.includes("?") ? "&" : "?";
        finalSrc = `${src}${sep}_cb=${Date.now()}`;
      }

      sourceRef.current.src = finalSrc;
      videoRef.current.load();
      videoRef.current.currentTime = savedTime;

      if (wasPlaying) {
        videoRef.current.play().catch(() => {
          console.warn("[LazyVideo] فشل التشغيل التلقائي بعد التعافي");
        });
      }
    }, delay);
  }, [src]);

  // ── تحديث المصدر عند تغيير الفيديو ──────────────────────────────────────
  useEffect(() => {
    if (videoRef.current && sourceRef.current) {
      sourceRef.current.src = src;
      videoRef.current.load();
    }
    initialTimeSet.current = false;
    stallRetryCount.current = 0;
    setIsLoading(true);
    setStallMessage(null);
    clearStallTimer();
    clearWaitingTimer();
  }, [src, clearStallTimer, clearWaitingTimer]);

  // ── إدارة الأحداث ─────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (startTime > 0 && !initialTimeSet.current) {
      video.currentTime = startTime;
      initialTimeSet.current = true;
    }

    if (!videoInstances.includes(video)) videoInstances.push(video);

    const handlePlay = () => {
      videoInstances.forEach((v) => {
        if (v !== video && !v.paused) v.pause();
      });
      clearStallTimer();
      clearWaitingTimer();
      stallRetryCount.current = 0;
      setStallMessage(null);
      onPlayChange?.(true);
    };

    const handlePause = () => {
      clearStallTimer();
      clearWaitingTimer();
      onPlayChange?.(false);
    };

    const handleTimeUpdate = () => {
      // لو الفيديو بدأ يتحرك، الـ waiting انتهى بنجاح → نلغي المؤقت
      clearWaitingTimer();
      setStallMessage(null);
      onTimeUpdate?.(video.currentTime);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      clearStallTimer();
      clearWaitingTimer();
      setStallMessage(null);
    };

    const handleWaiting = () => {
      clearWaitingTimer();
      waitingTimer.current = setTimeout(() => {
        const currentVideo = videoRef.current;
        if (
          !currentVideo ||
          currentVideo.paused ||
          currentVideo.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
        ) {
          return;
        }

        setIsLoading(true);
        attemptStalledRecovery();
      }, STALL_THRESHOLD_MS);
    };

    // ✅ error ده خطأ حقيقي — تدخّل فوراً
    const handleError = () => {
      clearWaitingTimer();
      setIsLoading(true);
      attemptStalledRecovery();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting); // ✅ مؤقت 5 ثواني
    video.addEventListener("error", handleError); // ✅ فوري

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("error", handleError);
      clearStallTimer();
      clearWaitingTimer();
      const index = videoInstances.indexOf(video);
      if (index > -1) videoInstances.splice(index, 1);
    };
  }, [
    startTime,
    attemptStalledRecovery,
    clearStallTimer,
    clearWaitingTimer,
    onPlayChange,
    onTimeUpdate,
  ]);

  // ── إعادة المحاولة اليدوية ────────────────────────────────────────────────
  const handleManualRetry = async () => {
    try {
      evictVideo(src);
    } catch {}
    stallRetryCount.current = 0;
    clearWaitingTimer();
    attemptStalledRecovery();
  };

  return (
    <div className="relative w-full h-full max-h-full max-w-full bg-black overflow-hidden rounded-xl shadow-2xl flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full max-w-full max-h-full object-contain block"
        controls
        preload="auto"
        poster={poster}
        playsInline
        crossOrigin="anonymous"
        title={title}
      >
        <source ref={sourceRef} src={src} type="video/mp4" />
        <p className="text-white text-center p-4">
          متصفحك لا يدعم تشغيل الفيديو.
        </p>
      </video>

      {(isLoading || stallMessage) && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
          {stallMessage && (
            <div className="bg-black/60 px-4 py-2 rounded-full text-white text-xs animate-pulse">
              {stallMessage}
            </div>
          )}
        </div>
      )}

      {stallRetryCount.current > 2 && (
        <button
          onClick={handleManualRetry}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-red-600/90 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg transition-all z-20"
        >
          إعادة تحميل الفيديو يدوياً
        </button>
      )}
    </div>
  );
}
