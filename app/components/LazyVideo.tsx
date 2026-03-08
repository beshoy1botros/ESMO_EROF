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
  const [isWaiting, setIsWaiting] = useState(false);
  const [stallMessage, setStallMessage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

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

    const retries = stallRetryCount.current;

    if (retries >= MAX_STALL_RETRIES) {
      // استنفدنا المحاولات → أظهر خطأ للمستخدم
      setHasError(true);
      setIsLoading(false);
      setIsWaiting(false);
      setStallMessage(null);
      stallRetryCount.current = 0;
      return;
    }

    const delay = BASE_RETRY_DELAY * Math.pow(2, retries); // 2s, 4s, 8s
    stallRetryCount.current += 1;

    setStallMessage(
      `جاري الاسترداد... (محاولة ${stallRetryCount.current}/${MAX_STALL_RETRIES})`,
    );

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
          // إذا فشل play()، أعد تحميل الـ src بـ timestamp لكسر الكاش
          const sep = src.includes("?") ? "&" : "?";
          const bustSrc = `${src}${sep}_cb=${Date.now()}`;
          const sourceEl = v.querySelector("source");
          if (sourceEl) sourceEl.setAttribute("src", bustSrc);
          v.load();
          v.currentTime = savedTime;
          v.play().catch(() => {
            setHasError(true);
            setIsLoading(false);
            setIsWaiting(false);
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
    setIsWaiting(false);
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

    videoInstances.push(video);

    const handlePlay = () => {
      // أوقف بقية الفيديوهات
      videoInstances.forEach((v) => {
        if (v !== video && !v.paused) v.pause();
      });
      // الفيديو شغّال → أعد ضبط حالات التوقف
      clearStallTimer();
      stallRetryCount.current = 0;
      setStallMessage(null);
      setIsLoading(false);
      setIsWaiting(false);
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

    const handleWaiting = () => setIsWaiting(true);

    const handleCanPlay = () => {
      clearStallTimer();
      stallRetryCount.current = 0;
      setStallMessage(null);
      setIsLoading(false);
      setIsWaiting(false);
    };

    const handleLoadStart = () => setIsLoading(true);

    const handleLoadedData = () => setIsLoading(false);

    const handleStalled = () => {
      // "stalled" = المتصفح طلب بيانات لكنها ما جاتش
      // نبدأ محاولة استرداد تلقائي فقط لو الفيديو كان شغّال
      if (!video.paused) {
        setIsWaiting(true);
        attemptStalledRecovery();
      }
    };

    const handleError = () => {
      clearStallTimer();
      setHasError(true);
      setIsLoading(false);
      setIsWaiting(false);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);

      clearStallTimer();
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

  // ── إغلاق القائمة عند الضغط خارجها ──────────────────────────────────
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".video-menu-container")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

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
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        controls
        preload="metadata"
        poster={poster}
        playsInline
        crossOrigin="anonymous"
        disablePictureInPicture={false}
        aria-label={title}
        title={title}
        onError={() => {
          clearStallTimer();
          setHasError(true);
          setIsLoading(false);
          setIsWaiting(false);
        }}
        onLoadedData={() => setIsLoading(false)}
      >
        <source src={src} type="video/mp4" />
        <p className="text-gray-400 text-sm text-center p-4">
          متصفحك لا يدعم تشغيل الفيديو. الرجاء تحديث المتصفح.
        </p>
      </video>

      {/* Loading / Waiting / Stall overlay */}
      {(isLoading || isWaiting) && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none transition-all duration-300">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin shadow-lg" />
          {(isWaiting || stallMessage) && (
            <p className="mt-3 text-xs text-white/80 font-bold bg-black/40 px-3 py-1 rounded-full border border-white/10 animate-pulse">
              {stallMessage ?? "جاري التحميل..."}
            </p>
          )}
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm sm:text-base p-4 rounded">
          <div className="text-center">
            <p>تعذّر تحميل الفيديو من المصدر البعيد.</p>
            <p className="opacity-80 mt-1">تحقق من اتصالك أو جرّب لاحقًا.</p>
            <button
              className="mt-2 inline-block bg-white text-black rounded px-3 py-1 mr-2"
              onClick={handleManualRetry}
            >
              إعادة المحاولة
            </button>
            {src && (
              <a
                className="inline-block mt-2 underline"
                href={src}
                target="_blank"
                rel="noreferrer"
              >
                فتح الرابط الأصلي في نافذة جديدة
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
