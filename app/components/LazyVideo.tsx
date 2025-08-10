import { useEffect, useRef, useState } from "react";
import { useServiceWorker } from "../utils/serviceWorker";

interface LazyVideoProps {
  src: string;
  title: string;
  className?: string;
  poster?: string;
  autoCache?: boolean; // تخزين تلقائي عند التحميل
}

export default function LazyVideo({
  src,
  title,
  className = "",
  poster,
  autoCache = true,
}: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { cacheVideo } = useServiceWorker();

  // Intersection Observer للكشف عن دخول الفيديو في منطقة الرؤية
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoaded) {
          setIsInView(true);
          setIsLoading(true);
        }
      },
      {
        threshold: 0.1, // يبدأ التحميل عندما يظهر 10% من الفيديو
        rootMargin: "50px", // يبدأ التحميل قبل 50px من دخول الفيديو للشاشة
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isLoaded]);

  // تحميل الفيديو عند دخوله منطقة الرؤية
  useEffect(() => {
    if (isInView && !isLoaded && videoRef.current) {
      const video = videoRef.current;

      const handleLoadedData = () => {
        setIsLoaded(true);
        setIsLoading(false);
        setError(null);

        // تخزين الفيديو تلقائياً إذا كان مفعلاً
        if (autoCache) {
          cacheVideo(src).catch(console.error);
        }
      };

      const handleError = () => {
        setIsLoading(false);
        setError("فشل في تحميل الفيديو");
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("error", handleError);

      // بدء تحميل الفيديو
      video.load();

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("error", handleError);
      };
    }
  }, [isInView, isLoaded]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Placeholder أثناء التحميل */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 rounded-lg flex flex-col items-center justify-center">
          {isLoading ? (
            <>
              {/* Loading Spinner */}
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
              <p className="text-gray-400 text-sm">جاري تحميل الفيديو...</p>
            </>
          ) : error ? (
            <>
              {/* Error State */}
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <p className="text-red-400 text-sm text-center">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setIsInView(true);
                  setIsLoading(true);
                }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                إعادة المحاولة
              </button>
            </>
          ) : (
            <>
              {/* Initial State */}
              <div className="text-blue-400 text-4xl mb-4">🎵</div>
              <p className="text-gray-400 text-sm text-center">
                سيتم تحميل الفيديو عند الحاجة
              </p>
            </>
          )}
        </div>
      )}

      {/* الفيديو الفعلي */}
      <video
        ref={videoRef}
        className={`w-full rounded-lg bg-black aspect-video transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        controls={isLoaded}
        preload="none" // منع التحميل التلقائي
        poster={poster}
        aria-label={title}
      >
        {isInView && <source src={src} type="video/mp4" />}
        متصفحك لا يدعم تشغيل الفيديو
      </video>

      {/* شريط التقدم للتحميل */}
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-700 rounded-b-lg">
          <div className="h-1 bg-blue-400 rounded-b-lg animate-pulse"></div>
        </div>
      )}
    </div>
  );
}
