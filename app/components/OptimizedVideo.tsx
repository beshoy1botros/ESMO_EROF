import React, { useRef, useEffect, useState } from "react";

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
}

export function OptimizedVideo({
  src,
  poster,
  title,
  className,
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "50px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`video-wrapper ${!isLoaded ? "loading" : ""}`}>
      <video
        ref={videoRef}
        className={`optimized-video ${className || ""}`}
        poster={poster}
        preload="none"
        playsInline
        controls
        title={title}
        onLoadedData={handleLoadedData}
      >
        {isVisible && (
          <>
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </>
        )}
      </video>
      {!isLoaded && <div className="video-placeholder" />}
    </div>
  );
}
