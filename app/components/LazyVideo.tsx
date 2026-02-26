import { useRef, useEffect, useState } from "react";
import { evictVideo } from "../utils/swClient";

/**
 * LazyVideo
 * — مكون فيديو بسيط يعتمد على عناصر الفيديو الأصلية مع ميزة:
 *   1) إيقاف بقية مقاطع الفيديو تلقائيًا عند تشغيل واحد منها.
 *   2) الحفاظ على واجهة استخدام نظيفة دون منيو مخصصة (مهيأة للتوسعة لاحقًا).
 * المكون لا يفعّل التحميل الكسول تلقائيًا، لكنه يستخدم preload=metadata لتقليل الحجم.
 */

interface LazyVideoProps {
  src: string;
  title: string;
  poster?: string | undefined;
  startTime?: number;
  onTimeUpdate?: (time: number) => void;
  onPlayChange?: (isPlaying: boolean) => void;
}

// Global array to track all video instances
const videoInstances: HTMLVideoElement[] = [];

export default function LazyVideo({ 
  src, 
  title, 
  poster, 
  startTime = 0,
  onTimeUpdate,
  onPlayChange
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialTimeSet = useRef(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    initialTimeSet.current = false;
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial time if provided (only once when src changes or on mount)
    if (startTime > 0 && !initialTimeSet.current) {
      video.currentTime = startTime;
      initialTimeSet.current = true;
    }

    // Add this video to the global instances
    videoInstances.push(video);

    // Handler to pause other videos when this one plays
    const handlePlay = () => {
      videoInstances.forEach((v) => {
        if (v !== video && !v.paused) {
          v.pause();
        }
      });
      setIsLoading(false);
      setIsWaiting(false);
      if (onPlayChange) onPlayChange(true);
    };

    const handlePause = () => {
      if (onPlayChange) onPlayChange(false);
    };

    const handleTimeUpdate = () => {
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }
    };

    const handleWaiting = () => setIsWaiting(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setIsWaiting(false);
    };
    const handleStalled = () => {
      // Stalled means the browser is trying to fetch data, but it is not coming
      // This is common on slow connections
      console.warn("Video playback stalled:", src);
    };

    const handleLoadStart = () => setIsLoading(true);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("loadstart", handleLoadStart);

    // Cleanup on unmount
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("loadstart", handleLoadStart);
      const index = videoInstances.indexOf(video);
      if (index > -1) {
        videoInstances.splice(index, 1);
      }
    };
  }, [startTime]); // Added startTime to dependency array

  // يمكن إضافة وظائف إضافية لاحقًا (تحميل/قائمة) إن لزم

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".video-menu-container")) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

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
        onError={() => {
          setHasError(true);
          setIsLoading(false);
          setIsWaiting(false);
        }}
        onLoadedData={() => setIsLoading(false)}
        aria-label={title}
        title={title}
      >
        <source src={src} type="video/mp4" />
        <p className="text-gray-400 text-sm text-center p-4">
          متصفحك لا يدعم تشغيل الفيديو. الرجاء تحديث المتصفح.
        </p>
      </video>

      {/* Loading & Waiting State Overlay */}
      {(isLoading || isWaiting) && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none transition-all duration-300">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin shadow-lg" />
          {isWaiting && (
            <p className="mt-3 text-xs text-white/80 font-bold bg-black/40 px-3 py-1 rounded-full border border-white/10 animate-pulse">
              جاري التحميل...
            </p>
          )}
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm sm:text-base p-4 rounded">
          <div className="text-center">
            <p>تعذّر تحميل الفيديو من المصدر البعيد.</p>
            <p className="opacity-80 mt-1">تحقق من اتصالك أو جرّب لاحقًا.</p>
            <button
              className="mt-2 inline-block bg-white text-black rounded px-3 py-1 mr-2"
              onClick={async () => {
                const video = videoRef.current;
                if (!video) return;
                try {
                  evictVideo(src);
                } catch {}
                setHasError(false);
                // أعد التحميل بعنوان فريد لتجاوز أي كاش وسيط
                const newSrc =
                  src + (src.includes("?") ? "&" : "?") + "retry=" + Date.now();
                const sourceEl = video.querySelector("source");
                if (sourceEl) {
                  sourceEl.setAttribute("src", newSrc);
                }
                video.load();
                try {
                  await video.play();
                } catch {}
              }}
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
