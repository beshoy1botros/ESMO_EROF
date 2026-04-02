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

// قائمة بجميع الفيديوهات النشطة للتحكم في التشغيل الحصري
const videoInstances: HTMLVideoElement[] = [];

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
  const sourceRef = useRef<HTMLSourceElement>(null); // مرجع مباشر للـ source لضمان تحديث الـ DOM
  const initialTimeSet = useRef(false);
  const stallRetryCount = useRef(0);
  const stallTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [stallMessage, setStallMessage] = useState<string | null>(null);

  // ── تنظيف المؤقتات ────────────────────────────────────────────────
  const clearStallTimer = useCallback(() => {
    if (stallTimer.current) {
      clearTimeout(stallTimer.current);
      stallTimer.current = null;
    }
  }, []);

  // ── استراتيجية التعافي التلقائي عند فشل التحميل ──────────────────────────
  const attemptStalledRecovery = useCallback(() => {
    const video = videoRef.current;
    const source = sourceRef.current;
    if (!video || !source) return;

    // استخدام Exponential Backoff لزيادة وقت الانتظار تدريجياً
    const delay = BASE_RETRY_DELAY * Math.pow(2, stallRetryCount.current % 5);
    stallRetryCount.current += 1;

    setStallMessage(
      `جاري محاولة استعادة الفيديو... (${stallRetryCount.current})`,
    );

    stallTimer.current = setTimeout(() => {
      if (!videoRef.current || !sourceRef.current) return;

      const wasPlaying = !videoRef.current.paused;
      const savedTime = videoRef.current.currentTime;

      // إضافة Cache Buster لكسر القفل وضمان طلب CORS جديد نظيف
      const sep = src.includes("?") ? "&" : "?";
      const bustSrc = `${src}${sep}_cb=${Date.now()}`;

      sourceRef.current.src = bustSrc;
      videoRef.current.load(); // إجبار المتصفح على إعادة تحميل المصدر الجديد

      videoRef.current.currentTime = savedTime;
      if (wasPlaying) {
        videoRef.current.play().catch(() => {
          console.warn("Service Worker: فشل التشغيل التلقائي بعد التعافي");
        });
      }
    }, delay);
  }, [src]);

  // ── التحديث عند تغيير الفيديو أو المسار ─────────────────────────────────
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
  }, [src, clearStallTimer]);

  // ── إدارة الأحداث والتحكم في الموارد ──────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (startTime > 0 && !initialTimeSet.current) {
      video.currentTime = startTime;
      initialTimeSet.current = true;
    }

    if (!videoInstances.includes(video)) {
      videoInstances.push(video);
    }

    const handlePlay = () => {
      // إيقاف أي فيديوهات أخرى تعمل في نفس الوقت
      videoInstances.forEach((v) => {
        if (v !== video && !v.paused) v.pause();
      });
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
      onTimeUpdate?.(video.currentTime);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      clearStallTimer();
      setStallMessage(null);
    };

    const handleError = () => {
      // بدلاً من إظهار شاشة خطأ، نبدأ محاولة التعافي فوراً
      setIsLoading(true);
      attemptStalledRecovery();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleError); // استدعاء التعافي عند الـ Buffering الطويل
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleError);
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

  // ── إعادة المحاولة اليدوية ──────────────────────────────────────────
  const handleManualRetry = async () => {
    try {
      evictVideo(src); // حذف النسخة البايظة من الكاش المحلي
    } catch {}
    stallRetryCount.current = 0;
    attemptStalledRecovery();
  };

  return (
    /* تأكد أن العنصر الأب لديه aspect-ratio أو طول محدد 
       استخدمنا aspect-video لضمان أبعاد 16:9 الافتراضية إذا لم يحدد الأب غير ذلك
    */
    <div className="relative w-full h-full max-h-full max-w-full bg-black overflow-hidden rounded-xl shadow-2xl flex items-center justify-center">
      <video
        ref={videoRef}
        /* استخدام max-full يضمن عدم خروج الفيديو عن حدود الـ div 
           object-contain يضمن رؤية الفيديو كاملاً مع وجود حواف سوداء إذا لم تتطابق الأبعاد
        */
        className="w-full h-full max-w-full max-h-full object-contain block"
        controls
        preload="metadata"
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

      {/* شاشة التحميل - ستبقى متمركزة دائماً بفضل flex في الأب */}
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

      {/* زر إعادة المحاولة */}
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
