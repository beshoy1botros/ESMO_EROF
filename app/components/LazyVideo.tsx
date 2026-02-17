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
}

// Global array to track all video instances
const videoInstances: HTMLVideoElement[] = [];

export default function LazyVideo({ src, title, poster }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add this video to the global instances
    videoInstances.push(video);

    // Handler to pause other videos when this one plays
    const handlePlay = () => {
      videoInstances.forEach((v) => {
        if (v !== video && !v.paused) {
          v.pause();
        }
      });
    };

    video.addEventListener("play", handlePlay);

    // Cleanup on unmount
    return () => {
      video.removeEventListener("play", handlePlay);
      const index = videoInstances.indexOf(video);
      if (index > -1) {
        videoInstances.splice(index, 1);
      }
    };
  }, []);

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
        className="w-full h-full object-contain"
        controls
        preload="metadata"
        poster={poster}
        playsInline
        crossOrigin="anonymous"
        disablePictureInPicture={false}
        onError={() => setHasError(true)}
        aria-label={title}
        title={title}
      >
        <source src={src} type="video/mp4" />
        <p className="text-gray-400 text-sm text-center p-4">
          متصفحك لا يدعم تشغيل الفيديو. الرجاء تحديث المتصفح.
        </p>
      </video>
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
