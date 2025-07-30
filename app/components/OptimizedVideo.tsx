import React, { useRef, useEffect, useState } from "react";

interface VideoSource {
  src: string;
  type: string;
}

interface OptimizedVideoProps {
  src: string | VideoSource[]; // يمكن أن يكون سلسلة واحدة أو مصفوفة من المصادر
  poster?: string;
  title?: string;
  className?: string;
  rootMargin?: string; // خاصية جديدة لـ IntersectionObserver
  threshold?: number; // خاصية جديدة لـ IntersectionObserver
}

export function OptimizedVideo({
  src,
  poster,
  title,
  className,
  rootMargin = "50px", // قيمة افتراضية لـ rootMargin
  threshold = 0.1, // قيمة افتراضية لـ threshold
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false); // حالة جديدة لمعالجة الأخطاء

  useEffect(() => {
    const options = {
      root: null,
      rootMargin, // استخدام الخاصية الممررة أو القيمة الافتراضية
      threshold, // استخدام الخاصية الممررة أو القيمة الافتراضية
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // إيقاف المراقبة بمجرد أن يصبح مرئيًا
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current); // تنظيف الـ observer عند إلغاء تحميل المكون
      }
    };
  }, [rootMargin, threshold]); // إضافة rootMargin و threshold كـ dependencies

  const handleLoadedData = () => {
    setIsLoaded(true);
    setIsError(false); // إعادة تعيين حالة الخطأ عند التحميل الناجح
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(true); // ضمان إزالة مؤشر التحميل حتى في حالة الخطأ
  };

  return (
    <div className={`video-wrapper ${!isLoaded && !isError ? "loading" : ""}`}>
      <video
        ref={videoRef}
        className={`optimized-video ${className || ""}`}
        poster={poster}
        preload="none" // يمنع التحميل المسبق لبيانات الفيديو
        playsInline // يسمح بالتشغيل المضمن على الأجهزة المحمولة
        controls // يعرض عناصر التحكم الافتراضية للفيديو
        title={title}
        onLoadedData={handleLoadedData} // يتم استدعاؤه عندما يتم تحميل الإطار الأول
        onError={handleError} // يتم استدعاؤه عند حدوث خطأ في التحميل
      >
        {isVisible && ( // يتم عرض عناصر <source> فقط عندما يكون الفيديو مرئيًا
          <>
            {Array.isArray(src) ? ( // إذا كانت src مصفوفة من المصادر
              src.map((source, index) => (
                <source key={index} src={source.src} type={source.type} />
              ))
            ) : (
              <source src={src} type="video/mp4" /> // إذا كانت src سلسلة، افترض أنها MP4
            )}
            متصفحك لا يدعم وسم الفيديو.
          </>
        )}
      </video>
      {!isLoaded && !isError && (
        <div className="video-placeholder">
          {/* يمكن إضافة صورة poster ضبابية أو spinner هنا لتحسين تجربة المستخدم */}
          {poster && (
            <img
              src={poster}
              alt="Video thumbnail"
              className="video-placeholder-image"
            />
          )}
          <div className="spinner"></div>{" "}
          {/* مثال على spinner، يتطلب CSS لجعله مرئيًا */}
        </div>
      )}
      {isError && (
        <div className="video-error">
          فشل تحميل الفيديو. يرجى المحاولة لاحقًا.
        </div>
      )}
    </div>
  );
}
