import { useRef, useEffect, useState } from "react";

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

  // Handle download

  // Handle menu toggle
 

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
        disablePictureInPicture={false}
        aria-label={title}
        title={title}
      >
        <source src={src} type="video/mp4" />
        <p className="text-gray-400 text-sm text-center p-4">
          متصفحك لا يدعم تشغيل الفيديو. الرجاء تحديث المتصفح.
        </p>
      </video>
    </div>
  );
}
