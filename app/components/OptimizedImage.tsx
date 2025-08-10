import { useState, useRef, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // للصور المهمة التي يجب تحميلها فوراً
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // إذا كانت priority، حمّل فوراً
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer للتحميل التدريجي
  useEffect(() => {
    if (priority) return; // تخطي للصور ذات الأولوية

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // دالة لتوليد مصادر الصور المحسنة
  const generateSources = (originalSrc: string) => {
    const baseName = originalSrc.replace(/\.[^/.]+$/, "");
    const extension = originalSrc.split('.').pop();
    
    return {
      webp: `${baseName}.webp`,
      original: originalSrc,
    };
  };

  const sources = generateSources(src);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder أثناء التحميل */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
        >
          <div className="text-gray-400 text-sm">جاري التحميل...</div>
        </div>
      )}

      {/* رسالة الخطأ */}
      {error && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
        >
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-sm">فشل في تحميل الصورة</div>
          </div>
        </div>
      )}

      {/* الصورة الفعلية مع دعم WebP */}
      {isInView && (
        <picture>
          {/* WebP للمتصفحات التي تدعمه */}
          <source srcSet={sources.webp} type="image/webp" />
          
          {/* الصورة الأصلية كـ fallback */}
          <img
            ref={imgRef}
            src={sources.original}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`
              transition-opacity duration-300 
              ${isLoaded ? "opacity-100" : "opacity-0"}
              ${className}
            `}
            style={{
              aspectRatio: width && height ? `${width}/${height}` : undefined,
            }}
          />
        </picture>
      )}
    </div>
  );
}
