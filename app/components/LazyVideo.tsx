import { useRef, useEffect, useState, useCallback } from "react";
import { evictVideo } from "../utils/swClient";

interface LazyVideoProps {
  src: string;
  title: string;
  poster?: string | undefined;
  startTime?: number;
  currentTime?: number; // للالتزامن مع فيديوهات أخرى
  onTimeUpdate?: (time: number) => void;
  onPlayChange?: (isPlaying: boolean) => void;
  isActive?: boolean; // إذا كان هذا الفيديو هو الفيديو النشط (المASTER)
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
  currentTime,
  onTimeUpdate,
  onPlayChange,
  isActive = true,
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
  const [loadProgress, setLoadProgress] = useState(0);
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  // التزامن مع فيديو آخر
  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentTime === undefined || currentTime === null) return;

    // انتظر حتى يكون الفيديو جاهزاً للـ seeking
    if (
      video.readyState >= 2 &&
      Math.abs(video.currentTime - currentTime) > 0.5
    ) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

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

    setStallMessage(
      `جاري المحاولة... (${stallRetryCount.current})`
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
    setIsWaiting(false);
    setStallMessage(null);
    setLoadProgress(0);
    setShowInitialLoader(true);
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
      setShowInitialLoader(false);
      onPlayChange?.(true);
    };

    const handlePause = () => {
      clearStallTimer();
      onPlayChange?.(false);
    };

    const handleTimeUpdate = () => {
      lastCurrentTime.current = video.currentTime;
      // فقط الفيديو النشط يحدث الـ time
      if (isActive) {
        onTimeUpdate?.(video.currentTime);
      }
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
      // بدلاً من إظهار خطأ، استمر في المحاولة
      setStallMessage("جاري التحقق من الاتصال بالإنترنت...");
      setIsWaiting(true);
      attemptStalledRecovery();
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
    isActive,
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
    setLoadProgress(0);
    setShowInitialLoader(true);

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
      {/* Poster Background مع تأثير التمويه أثناء التحميل */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
          isLoading ? "blur-sm scale-105" : "blur-0 scale-100"
        }`}
        style={{
          backgroundImage: poster ? `url(${poster})` : "none",
          backgroundColor: poster ? "transparent" : "#1a1a2e",
        }}
      >
        {/* طبقة تظليل لتحسين وضوح الفيديو */}
        {!isLoading && <div className="absolute inset-0 bg-black/20" />}
      </div>

      <video
        ref={videoRef}
        className="relative w-full h-full max-w-full max-h-full object-contain bg-transparent"
        controls
        preload="metadata"
        poster={poster}
        playsInline
        crossOrigin="anonymous"
        disablePictureInPicture={false}
        aria-label={title}
        title={title}
        onError={() => {
          // بدلاً من إظهار خطأ، استمر في المحاولة
          setStallMessage("جاري التحقق من الاتصال بالإنترنت...");
          setIsWaiting(true);
          setIsLoading(true);
          attemptStalledRecovery();
        }}
        onLoadedData={() => {
          setIsLoading(false);
          setShowInitialLoader(false);
        }}
        onProgress={(e) => {
          const video = e.currentTarget;
          if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            const duration = video.duration;
            if (duration > 0) {
              setLoadProgress((bufferedEnd / duration) * 100);
            }
          }
        }}
      >
        <source src={src} type="video/mp4" />
        <p className="text-gray-400 text-sm text-center p-4">
          متصفحك لا يدعم تشغيل الفيديو. الرجاء تحديث المتصفح.
        </p>
      </video>

      {/* Loading Overlay - تصميم احترافي */}
      {(isLoading || isWaiting) && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
          {/* الـ Spinner الاحترافي */}
          <div className="relative">
            {/* الدائرة الخارجية */}
            <div className="w-20 h-20 border-[3px] border-white/10 rounded-full" />
            {/* الدائرة المتحركة */}
            <div className="absolute top-0 left-0 w-20 h-20">
              <div
                className="w-full h-full border-[3px] border-transparent border-t-blue-400 border-r-blue-400 rounded-full animate-spin"
                style={{ animationDuration: "1s" }}
              />
            </div>
            {/* الدائرة الداخلية المتأخرة */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12">
              <div
                className="w-full h-full border-[2px] border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin"
                style={{
                  animationDuration: "0.8s",
                  animationDirection: "reverse",
                }}
              />
            </div>
            {/* مركز الدائرة */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" />
          </div>

          {/* شريط التقدم */}
          <div className="mt-6 w-48 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${loadProgress}%`,
                boxShadow: "0 0 10px rgba(96, 165, 250, 0.5)",
              }}
            />
          </div>

          {/* رسالة الحالة */}
          {(isWaiting || stallMessage) && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <p className="text-sm text-white/90 font-medium bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm shadow-lg animate-pulse">
                {stallMessage ?? "جاري التحميل..."}
              </p>
              {/* نقاط التحميل */}
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* نص التحميل الأولي */}
          {isLoading && !isWaiting && !stallMessage && (
            <p className="mt-4 text-sm text-white/70 font-light animate-pulse">
              جاري تحميل الفيديو...
            </p>
          )}
        </div>
      )}

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
              يرجى التحقق من اتصالك بالإنترنت وسيتم تحميل الفيديو تلقائياً عند استعادة الاتصال.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
