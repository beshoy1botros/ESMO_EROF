import { useState, useRef, useEffect } from "react";
import styles from "./OptimizedImage.module.css";

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
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      {/* Placeholder أثناء التحميل */}
      {!isLoaded && !error && (
        <div className={styles.placeholderContainer}>
          <div className={styles.loadingText}>جاري التحميل...</div>
        </div>
      )}

      {/* رسالة الخطأ */}
      {error && (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>🖼️</div>
            <div className={styles.errorText}>فشل في تحميل الصورة</div>
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
              ${styles.imageElement}
              ${isLoaded ? styles.imageLoaded : styles.imageLoading}
            `}
          />
        </picture>
      )}
    </div>
  );
}
