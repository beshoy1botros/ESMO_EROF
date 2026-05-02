import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LazyVideo from "../components/LazyVideo";
import { getLevelsForStage, isValidStageLevel } from "../utils/stageUtils";
import { StageKey, videoData, stageVideoUrls } from "../data/melodiesData";
import type { Video, LevelVideos } from "../data/melodiesData";
import "../styles/melodies.css";
import "../styles/mobile-improvements.css";
import { prewarmVideos } from "../utils/swClient";

// --- مصفوفة البيانات (الألحان) - محدثة حسب المنهج 2026 ---

// --- 3. الدوال المساعدة ---

function getVideoUrl(
  video: Video,
  stage: StageKey,
  level: string,
): string | undefined {
  const levelMap: Record<string, keyof LevelVideos> = {
    الأول: "first",
    الثاني: "second",
    الموهوبين: "gifted",
  };
  const englishLevel = levelMap[level];
  if (!englishLevel) return undefined;

  const stageUrls = stageVideoUrls[stage];
  if (!stageUrls || !(englishLevel in stageUrls)) return undefined;

  const urls = stageUrls[englishLevel as keyof typeof stageUrls];
  if (!urls) return undefined;

  const stageVideos = videoData[stage];
  if (!stageVideos) return undefined;

  const levelVideos = stageVideos[englishLevel];
  if (!levelVideos) return undefined;

  const index = levelVideos.findIndex((v) => v.id === video.id);
  return urls[index] || undefined;
}

function getVideos(stage: StageKey, levelLabel: string): Video[] {
  const levelMap: Record<string, keyof LevelVideos> = {
    الأول: "first",
    الثاني: "second",
    الموهوبين: "gifted",
  };
  const englishLevel = levelMap[levelLabel];
  const stageData = videoData[stage];
  return stageData && englishLevel ? stageData[englishLevel] || [] : [];
}

// --- 4. أيقونة الترس (Gear Icon SVG Component) - تصميم احترافي ---

function GearIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className} // هنا قمنا باستخدام المتغير
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
// --- 5. المكون الرئيسي ---

export default function MelodiesPage() {
  const [stage, setStage] = useState<StageKey | "">("");
  const [level, setLevel] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [fullscreenLyrics, setFullscreenLyrics] = useState<Video | null>(null);

  // ====== خاصية التحكم في اللغات ======
  const [showCopticArabic, setShowCopticArabic] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [showCoptic, setShowCoptic] = useState(true);

  // ====== خاصية التحكم في حجم الخط ======
  // يبدأ بحجم أصغر، ويمكن تصغيره حتى 10px (بدلاً من 14px سابقاً)
  const [fontSize, setFontSize] = useState(12);

  // ====== خاصية التحكم في صور الهزات ======
  const [showHazzat, setShowHazzat] = useState(false);
  const [isHazzatZoomed, setIsHazzatZoomed] = useState(false);
  const [showVideoInModal, setShowVideoInModal] = useState(false);
  const [videoTime, setVideoTime] = useState<Record<string, number>>({});

  const [_rotateFromSidebar, setRotateFromSidebar] = useState(false);
  const [showControlsPanel, setShowControlsPanel] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // ====== حالة تحريك الفيديو ======
  const [videoPosition, setVideoPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [, setWasJustDragging] = useState(false);

  // ====== Ref للإغلاق الذكي عند النقر خارج القائمة ======
  const controlsPanelRef = useRef<HTMLDivElement>(null);
  const lastPrewarmedUrls = useRef<Set<string>>(new Set());

  // ====== useEffect لتحميل الفيديوهات وصور الهزات مسبقاً ======
  // يتم التحميل عند اختيار المرحلة أو المستوى أو تغير الفيديوهات
  useEffect(() => {
    if (!stage) return;

    const stageKey = stage as StageKey;
    const allUrlsToPrewarm: string[] = [];

    // 1. جمع صور الهزات للمرحلة (فقط إذا لم يتم تحميلها من قبل في هذه الجلسة للمرحلة الحالية)
    const stageData = videoData[stageKey];
    if (stageData) {
      Object.values(stageData).forEach((levelVideos) => {
        if (Array.isArray(levelVideos)) {
          levelVideos.forEach((video) => {
            if (video.hazzatImage) allUrlsToPrewarm.push(video.hazzatImage);
            if (video.hazzatImage٢) allUrlsToPrewarm.push(video.hazzatImage٢);
            if (video.hazzatImage٣) allUrlsToPrewarm.push(video.hazzatImage٣);
            if (video.hazzatImage٤) allUrlsToPrewarm.push(video.hazzatImage٤);
            if (video.hazzatImage٥) allUrlsToPrewarm.push(video.hazzatImage٥);
            if (video.hazzatImage٦) allUrlsToPrewarm.push(video.hazzatImage٦);
            if (video.hazzatImage٧) allUrlsToPrewarm.push(video.hazzatImage٧);
            if (video.hazzatImage٨) allUrlsToPrewarm.push(video.hazzatImage٨);
            if (video.hazzatImage٩) allUrlsToPrewarm.push(video.hazzatImage٩);
            if (video.hazzatImage١٠) allUrlsToPrewarm.push(video.hazzatImage١٠);
          });
        }
      });
    }

    // 2. جمع فيديوهات المستوى الحالي
    if (level && videos.length > 0) {
      videos.forEach((v) => {
        const url = getVideoUrl(v, stageKey, level);
        if (url) allUrlsToPrewarm.push(url);
      });
    }

    // إرسال الكل في طلب واحد للـ SW
    if (allUrlsToPrewarm.length > 0) {
      // إزالة التكرار وفلترة الروابط التي تم طلبها بالفعل في هذه الجلسة
      const uniqueUrls = [...new Set(allUrlsToPrewarm)];
      const newUrls = uniqueUrls.filter(
        (url) => !lastPrewarmedUrls.current.has(url),
      );

      if (newUrls.length > 0) {
        console.log(
          `[Melodies] طلب تخزين مسبق لـ ${newUrls.length} مورد جديد (من أصل ${uniqueUrls.length})`,
          { stage, level },
        );
        newUrls.forEach((url) => lastPrewarmedUrls.current.add(url));
        prewarmVideos(newUrls);
      }
    }
  }, [stage, level, videos]);

  // ====== useEffect للإغلاق الذكي (Click Outside to Close) ======
  useEffect(() => {
    if (!showControlsPanel) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        controlsPanelRef.current &&
        !controlsPanelRef.current.contains(event.target as Node)
      ) {
        setShowControlsPanel(false);
      }
    };

    // تأخير بسيط لتجنب التعارض مع حدث النقر على زر الفتح نفسه
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showControlsPanel]);

  const levels = stage ? getLevelsForStage(stage as string) : [];

  // ====== Memoized handlers for performance ======
  const handleStageChange = useCallback((newStage: StageKey) => {
    setStage(newStage);
    setLevel("");
    setVideos([]);

    if (newStage === StageKey.WeddingOfCana) {
      const weddingContent = getVideos(newStage, "الأول");
      setVideos(weddingContent);
      setLevel("الأول");
    }
  }, []);

  const handleLevelChange = useCallback(
    (newLevel: string) => {
      setLevel(newLevel);
      if (stage && newLevel && isValidStageLevel(stage, newLevel)) {
        setVideos(getVideos(stage as StageKey, newLevel));
      } else setVideos([]);
    },
    [stage],
  );

  // ====== Memoized computed values ======
  const visibleColumns = useMemo(
    () => [showCopticArabic, showArabic, showCoptic].filter(Boolean).length,
    [showCopticArabic, showArabic, showCoptic],
  );

  const disabledColumns = useMemo(() => 3 - visibleColumns, [visibleColumns]);

  const maxFontSize = useMemo(
    () => 20 + disabledColumns * 2,
    [disabledColumns],
  );

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 1, maxFontSize));
  }, [maxFontSize]);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 1, 10));
  }, []);

  // ====== دوال تحريك الفيديو ======
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!("touches" in e)) {
      e.preventDefault();
    }
    e.stopPropagation();

    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    setDragOffset({
      x: clientX - videoPosition.x,
      y: clientY - videoPosition.y,
    });
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    if (!("touches" in e)) {
      e.preventDefault();
    }
    e.stopPropagation();

    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;

    const videoWidth = isMinimized
      ? 64
      : Math.min(window.innerWidth * 0.85, 320);
    const videoHeight = isMinimized ? 64 : 180;

    const padding = 10;
    const maxX = window.innerWidth - videoWidth - padding;
    const maxY = window.innerHeight - videoHeight - padding;

    setVideoPosition({
      x: Math.max(padding, Math.min(newX, maxX)),
      y: Math.max(padding, Math.min(newY, maxY)),
    });
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setWasJustDragging(true);
      setTimeout(() => setWasJustDragging(false), 100);
    }
    setIsDragging(false);
  };

  const handleExpandVideo = () => {
    if (!isMinimized) return;
    if (isDragging) return;

    const videoWidth = Math.min(window.innerWidth * 0.85, 320);
    const videoHeight = 180;
    const padding = 10;

    let newX = videoPosition.x;
    let newY = videoPosition.y;

    const maxX = window.innerWidth - videoWidth - padding;
    const maxY = window.innerHeight - videoHeight - padding;

    if (newX > maxX) newX = maxX;
    if (newY > maxY) newY = maxY;

    if (newX !== videoPosition.x || newY !== videoPosition.y) {
      setVideoPosition({ x: newX, y: newY });
    }

    setIsMinimized(false);
  };

  useEffect(() => {
    // حافظ على حجم الخط داخل النطاق المسموح به
    setFontSize((prev) => Math.min(Math.max(prev, 10), maxFontSize));
  }, [maxFontSize]);

  const hazzatImagesCount = fullscreenLyrics
    ? [
        fullscreenLyrics.hazzatImage,
        fullscreenLyrics.hazzatImage٢,
        fullscreenLyrics.hazzatImage٣,
        fullscreenLyrics.hazzatImage٤,
        fullscreenLyrics.hazzatImage٥,
        fullscreenLyrics.hazzatImage٦,
        fullscreenLyrics.hazzatImage٧,
        fullscreenLyrics.hazzatImage٨,
        fullscreenLyrics.hazzatImage٩,
        fullscreenLyrics.hazzatImage١٠,
      ].filter(Boolean).length
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white font-sans">
      <Header />

      <main className="flex-1 page-bg-setup bg-melodies relative">
        <div className="bg-overlay" />
        <div className="relative z-10 pb-10">
          <div className="bg-gradient-to-b from-blue-900/30 to-transparent py-10 px-4 text-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-3">
              مكتبة الألحان
            </h1>
            <p className="text-gray-400">
              اختر المرحلة والمستوى لعرض المنهج الدراسي
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            {/* Stage Selection */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
              {[
                { key: StageKey.Kindergarten, label: "حضانة" },
                { key: StageKey.FirstSecond, label: "أولى و ثانية" },
                { key: StageKey.ThirdFourth, label: "ثالثة و رابعة" },
                { key: StageKey.FifthSixth, label: "خامسة و سادسة" },
                { key: StageKey.Middle, label: "إعدادي" },
                { key: StageKey.High, label: "ثانوي" },
                { key: StageKey.University, label: "جامعة" },
                { key: StageKey.Servants, label: "خدام وخادمات" },
                { key: StageKey.WeddingOfCana, label: "عرس قانا الجليل" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleStageChange(item.key)}
                  className={`p-4 rounded-xl border-2 transition-all font-bold ${
                    stage === item.key
                      ? "bg-blue-600 border-blue-400 shadow-lg scale-95"
                      : "bg-gray-900 border-gray-800 hover:border-gray-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* اختيار المستوى - مخفي لعرس قانا الجليل */}
            {stage && stage !== StageKey.WeddingOfCana && (
              <div className="flex flex-wrap gap-4 mb-10 justify-center animate-in fade-in zoom-in duration-300">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    className={`px-10 py-3 rounded-full border-2 font-bold transition-all ${
                      level === lvl
                        ? "bg-green-600 border-green-400"
                        : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            )}

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((v) => (
                <div
                  key={v.id}
                  className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl"
                >
                  <div className="aspect-video bg-black relative">
                    {getVideoUrl(v, stage as StageKey, level) ? (
                      <LazyVideo
                        src={getVideoUrl(v, stage as StageKey, level)!}
                        title={v.title}
                        startTime={videoTime[v.id] || 0}
                        onTimeUpdate={(time) =>
                          setVideoTime((prev) => ({ ...prev, [v.id]: time }))
                        }
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-600 italic">
                        <span className="text-4xl mb-2">🎬</span> متاح قريباً
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">{v.title}</h3>
                    <button
                      onClick={() => setFullscreenLyrics(v)}
                      className="w-full py-3 bg-blue-600/10 text-blue-400 border border-blue-600/30 rounded-xl font-bold hover:bg-blue-600/20 transition-all"
                    >
                      عرض كلمات اللحن
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ================================================================
          مودال نصوص اللحن
      ================================================================ */}
      {fullscreenLyrics && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden">
          {/* ============================================================
              الهيدر المُعدَّل - أيقونة الترس مع الأنيميشن والإغلاق الذكي
          ============================================================ */}
          <header className="sticky top-0 z-50 p-3 md:p-4 bg-gray-900 border-b border-white/10 flex items-center gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* حاوية الترس مع الـ Ref للإغلاق الذكي */}
              <div className="relative" ref={controlsPanelRef}>
                {/* زر أيقونة الترس مع أنيميشن الدوران */}
                <button
                  onClick={() => setShowControlsPanel((prev) => !prev)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border active:scale-90 ${
                    showControlsPanel
                      ? "bg-blue-600/30 border-blue-400/60 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                      : "bg-gray-900/90 border-blue-500/30 text-blue-400 hover:bg-gray-800 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  }`}
                  aria-label="إعدادات العرض"
                  title="إعدادات العرض"
                >
                  {/* الترس يدور 90 درجة عند الفتح بـ spring animation */}
                  <motion.div
                    animate={{ rotate: showControlsPanel ? 90 : 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 180 }}
                  >
                    <GearIcon className="w-5 h-5" />
                  </motion.div>
                </button>

                {/* القائمة المنسدلة مع التجاوب الكامل رأسي/أفقي */}
                <AnimatePresence>
                  {showControlsPanel && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: -16, x: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -16, x: 8 }}
                      transition={{
                        type: "spring",
                        damping: 22,
                        stiffness: 320,
                      }}
                      className="
                        absolute top-full mt-3 right-0 z-30
                        bg-gray-900/98 border border-blue-500/20 rounded-2xl
                        shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl

                        flex flex-col gap-5 p-5
                        w-72 max-w-[92vw]

                        [@media(orientation:landscape)]:flex-row
                        [@media(orientation:landscape)]:gap-4
                        [@media(orientation:landscape)]:p-4
                        [@media(orientation:landscape)]:w-[92vw]
                        [@media(orientation:landscape)]:max-w-[820px]
                        [@media(orientation:landscape)]:items-start
                        [@media(orientation:landscape)]:overflow-x-auto
                      "
                    >
                      {/* رأس القائمة */}
                      <div
                        className="
                        flex items-center justify-between border-b border-white/5 pb-3
                        [@media(orientation:landscape)]:border-b-0
                        [@media(orientation:landscape)]:border-r
                        [@media(orientation:landscape)]:pb-0
                        [@media(orientation:landscape)]:pr-4
                        [@media(orientation:landscape)]:flex-col
                        [@media(orientation:landscape)]:items-start
                        [@media(orientation:landscape)]:gap-2
                        [@media(orientation:landscape)]:flex-shrink-0
                      "
                      >
                        <div className="flex items-center gap-2">
                          {/* ترس صغير يدور باستمرار في رأس القائمة */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <GearIcon className="w-3.5 h-3.5 text-blue-400" />
                          </motion.div>
                          <span className="text-sm font-bold text-gray-100 tracking-wide whitespace-nowrap">
                            إعدادات العرض
                          </span>
                        </div>
                        <button
                          onClick={() => setShowControlsPanel(false)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 hover:bg-red-900/40 hover:text-red-400 transition-colors text-gray-400 text-xs"
                        >
                          ✕
                        </button>
                      </div>

                      {/* --- قسم حجم الخط --- */}
                      <div
                        className="
                        flex flex-col gap-3
                        [@media(orientation:landscape)]:flex-shrink-0
                        [@media(orientation:landscape)]:min-w-[140px]
                      "
                      >
                        <label className="text-[11px] uppercase tracking-widest text-blue-400 font-bold px-1">
                          حجم الخط
                        </label>
                        <div className="flex items-center gap-3 bg-gray-800/50 p-1.5 rounded-xl border border-white/5">
                          <button
                            onClick={decreaseFontSize}
                            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 active:scale-95 rounded-lg flex items-center justify-center transition-all shadow-lg flex-shrink-0"
                          >
                            <span className="text-xl font-bold text-blue-400">
                              −
                            </span>
                          </button>
                          <div className="flex-1 text-center">
                            <span className="text-lg font-mono font-bold text-white">
                              {fontSize}
                            </span>
                            <span className="text-[10px] block text-gray-500">
                              px
                            </span>
                          </div>
                          <button
                            onClick={increaseFontSize}
                            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 active:scale-95 rounded-lg flex items-center justify-center transition-all shadow-lg flex-shrink-0"
                          >
                            <span className="text-xl font-bold text-blue-400">
                              +
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* --- قسم اللغات --- */}
                      <div
                        className="
                        flex flex-col gap-3 flex-1
                        [@media(orientation:landscape)]:min-w-[170px]
                      "
                      >
                        <label className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold px-1">
                          اللغات المفعلة
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            {
                              state: showArabic,
                              setter: setShowArabic,
                              label: "اللغة العربية",
                              activeClass:
                                "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]",
                              dotClass:
                                "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
                            },
                            {
                              state: showCopticArabic,
                              setter: setShowCopticArabic,
                              label: "قبطي معرَّب",
                              activeClass:
                                "bg-emerald-600/20 border-emerald-500/50 text-emerald-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]",
                              dotClass:
                                "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]",
                            },
                            {
                              state: showCoptic,
                              setter: setShowCoptic,
                              label: "اللغة القبطية",
                              activeClass:
                                "bg-indigo-600/20 border-indigo-500/50 text-indigo-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]",
                              dotClass:
                                "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]",
                            },
                          ].map((lang) => (
                            <button
                              key={lang.label}
                              onClick={() => lang.setter(!lang.state)}
                              className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 border ${
                                lang.state
                                  ? lang.activeClass
                                  : "bg-gray-800/40 border-gray-700/50 text-gray-500 hover:bg-gray-800 hover:border-gray-600"
                              }`}
                            >
                              <span>{lang.label}</span>
                              <div
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  lang.state ? lang.dotClass : "bg-gray-700"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* --- قسم الأدوات --- */}
                      <div
                        className="
                        flex flex-col gap-2 pt-2 border-t border-white/5
                        [@media(orientation:landscape)]:border-t-0
                        [@media(orientation:landscape)]:pt-0
                        [@media(orientation:landscape)]:flex-shrink-0
                        [@media(orientation:landscape)]:min-w-[150px]
                      "
                      >
                        <label className="text-[11px] uppercase tracking-widest text-orange-400 font-bold px-1">
                          الأدوات
                        </label>

                        {hazzatImagesCount > 0 && (
                          <button
                            onClick={() => setShowHazzat(!showHazzat)}
                            className={`w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-500 ${
                              showHazzat
                                ? "bg-yellow-600 text-white shadow-lg shadow-yellow-900/20"
                                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-95"
                            }`}
                          >
                            <span className="text-sm animate-bounce">🎵</span>
                            <span>
                              {showHazzat ? "إخفاء الهزات" : "عرض هزات اللحن"}
                            </span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const btn = document.getElementById(
                              "landscape-toggle-button",
                            ) as HTMLButtonElement | null;
                            if (btn) {
                              btn.click();
                              setRotateFromSidebar((prev) => !prev);
                            }
                          }}
                          className="w-full px-4 py-2.5 rounded-xl font-bold text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-all flex items-center justify-center gap-2"
                        >
                          <span className="text-sm">🔄</span>
                          تدوير الشاشة
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* نهاية حاوية الترس */}

              {/* زر تشغيل الفيديو المدمج */}
              {getVideoUrl(fullscreenLyrics, stage as StageKey, level) && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowVideoInModal((prev) => !prev)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      showVideoInModal
                        ? "bg-red-600/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    } border active:scale-90`}
                    title={showVideoInModal ? "إخفاء الفيديو" : "تشغيل اللحن"}
                  >
                    <span className="text-base">
                      {showVideoInModal ? "✕" : "▶️"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <h2 className="text-blue-400 font-bold text-sm md:text-lg flex-1 text-center md:text-right">
              {fullscreenLyrics.title}
            </h2>

            <button
              onClick={() => {
                setFullscreenLyrics(null);
                setShowHazzat(false);
                setShowVideoInModal(false);
                setIsMinimized(false);
                setIsVideoPlaying(false);
                setRotateFromSidebar(false);
                setShowControlsPanel(false);
              }}
              className="text-2xl md:text-3xl p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </header>
          {/* ============================================================
              نهاية الهيدر
          ============================================================ */}

          <div className="relative flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-gray-950 p-2 md:p-6 relative scroll-smooth">
              <div className="w-full max-w-7xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {showVideoInModal &&
                    getVideoUrl(fullscreenLyrics!, stage as StageKey, level) &&
                    fullscreenLyrics && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.5,
                          transition: { duration: 0.2 },
                        }}
                        transition={{
                          type: "spring",
                          damping: 30,
                          stiffness: 150,
                        }}
                        className={`fixed z-[60] shadow-2xl ${
                          isMinimized
                            ? "w-16 h-16 rounded-full cursor-pointer overflow-hidden border-2 border-blue-500 hover:scale-110 transition-all duration-300"
                            : "w-[70vw] max-w-[320px] md:max-w-[400px]"
                        } ${
                          isMinimized
                            ? isVideoPlaying
                              ? "animate-video-pulse-active"
                              : "animate-video-pulse-paused"
                            : ""
                        }`}
                        style={{
                          left: videoPosition.x,
                          top: videoPosition.y,
                          transition: isDragging ? "none" : "all 0.3s ease",
                          cursor: isDragging
                            ? "grabbing"
                            : isMinimized
                              ? "pointer"
                              : "grab",
                        }}
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        onTouchEnd={handleDragEnd}
                        onClick={handleExpandVideo}
                        onTap={handleExpandVideo}
                      >
                        <div
                          className={`relative rounded-2xl overflow-hidden border border-blue-500/30 bg-black shadow-[0_0_30px_rgba(0,0,0,0.5)] group ${
                            isMinimized ? "aspect-square" : "aspect-video"
                          }`}
                        >
                          {!isMinimized && (
                            <div
                              className={`absolute top-2 right-2 z-20 opacity-50 hover:opacity-80 transition-opacity cursor-move ${
                                isDragging ? "opacity-80" : ""
                              }`}
                              title="اسحب لتحريك الفيديو"
                            >
                              <svg
                                className="w-5 h-5 text-white/70"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </svg>
                            </div>
                          )}
                          <div
                            className={`w-full h-full ${
                              isMinimized
                                ? "absolute opacity-0 pointer-events-none"
                                : "block"
                            }`}
                          >
                            <LazyVideo
                              key={fullscreenLyrics.id}
                              src={
                                getVideoUrl(
                                  fullscreenLyrics,
                                  stage as StageKey,
                                  level,
                                )!
                              }
                              title={fullscreenLyrics.title}
                              startTime={videoTime[fullscreenLyrics.id] || 0}
                              onTimeUpdate={(time) =>
                                setVideoTime((prev) => ({
                                  ...prev,
                                  [fullscreenLyrics.id]: time,
                                }))
                              }
                              onPlayChange={setIsVideoPlaying}
                            />
                          </div>

                          {!isMinimized ? (
                            <>
                              <div className="absolute top-2 left-2 flex gap-2 z-10">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMinimized(true);
                                  }}
                                  className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-blue-600/80 md:bg-blue-600/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-blue-600/80 transition-colors"
                                  title="تصغير"
                                >
                                  <svg
                                    className="w-5 h-5 md:w-4 md:h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowVideoInModal(false);
                                  }}
                                  className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-red-600/80 md:bg-red-600/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-red-600/80 transition-colors"
                                  title="إغلاق"
                                >
                                  <svg
                                    className="w-5 h-5 md:w-4 md:h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </>
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
                                isVideoPlaying
                                  ? "bg-blue-600/30"
                                  : "bg-gray-800/80 grayscale"
                              }`}
                            >
                              <span
                                className={`text-2xl transition-transform duration-300 ${
                                  isVideoPlaying
                                    ? "scale-110"
                                    : "scale-90 opacity-50"
                                }`}
                              >
                                {isVideoPlaying ? "🎶" : "▶️"}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>

                {(() => {
                  const coptic = (fullscreenLyrics.copticcoptic || "").split(
                    /\n\s*\n/,
                  );
                  const copticAr = (fullscreenLyrics.copticArabic || "").split(
                    /\n\s*\n/,
                  );
                  const arabic = (
                    fullscreenLyrics.arabicTranslation || ""
                  ).split(/\n\s*\n/);
                  const maxParts = Math.max(
                    coptic.length,
                    copticAr.length,
                    arabic.length,
                  );

                  const getNumberFromTitle = (title: string) => {
                    if (!title) return null;
                    const digitMatch = title.match(/\d+/);
                    if (digitMatch) return parseInt(digitMatch[0]);

                    const arabicNumbers: Record<string, number> = {
                      الأولى: 1,
                      الأول: 1,
                      الثانية: 2,
                      الثاني: 2,
                      الثالثة: 3,
                      الثالث: 3,
                      الرابعة: 4,
                      الرابع: 4,
                      الخامسة: 5,
                      الخامس: 5,
                      السادسة: 6,
                      السادس: 6,
                      السابعة: 7,
                      السابع: 7,
                      الثامنة: 8,
                      الثامن: 8,
                      التاسعة: 9,
                      التاسع: 9,
                      العاشرة: 10,
                      العاشر: 10,
                    };

                    for (const [key, value] of Object.entries(arabicNumbers)) {
                      if (title.includes(key)) return value;
                    }
                    return null;
                  };

                  let currentQuarter = 0;

                  const allLyricsText =
                    (fullscreenLyrics.arabicTranslation || "") +
                    (fullscreenLyrics.copticArabic || "") +
                    (fullscreenLyrics.copticcoptic || "");

                  const afEranavRegex =
                    /ايراناف|إيراناف|راناف|ⲣⲁⲛⲁϥ|يليق\s*ل[اإأآ]لهنا/i;

                  const hasAfEranav = afEranavRegex.test(allLyricsText);

                  const isKhatamTasbeha =
                    fullscreenLyrics.title &&
                    fullscreenLyrics.title.includes(
                      "ختام التسبحة السنوي (افنوتي ناي نان)",
                    );

                  const disableQuarterNumbers =
                    !hasAfEranav && maxParts <= 3 && !isKhatamTasbeha;

                  return Array.from({ length: maxParts }).map((_, i) => {
                    const arText = (arabic[i] || "").trim();
                    const caText = (copticAr[i] || "").trim();
                    const cText = (coptic[i] || "").trim();

                    if (!arText && !caText && !cText) return null;

                    const combinedRowText = `${arText} ${caText} ${cText}`;

                    const isAfEranav = afEranavRegex.test(combinedRowText);

                    const headerSource = arText || caText || cText;
                    const isSectionHeader =
                      !isAfEranav &&
                      (headerSource.includes("القطعة") ||
                        headerSource.includes("المزمور"));

                    if (!disableQuarterNumbers) {
                      if (isSectionHeader) {
                        currentQuarter = 0;
                      } else if (!isAfEranav) {
                        currentQuarter += 1;
                      }
                    }

                    // For ختام التسبحة السنوي: skip first quarter, start numbering from second quarter as 1
                    let displayQuarter: number | null = currentQuarter;
                    if (
                      isKhatamTasbeha &&
                      currentQuarter !== null &&
                      currentQuarter > 0
                    ) {
                      displayQuarter =
                        currentQuarter === 1 ? null : currentQuarter - 1;
                    }

                    // إخفاء آخر ربع (16) من الليلويا التوزيع الكيهكي
                    const isAlleluiaKiahk = fullscreenLyrics?.title?.includes(
                      "الليلويا التوزيع الكيهكي",
                    );
                    if (isAlleluiaKiahk && displayQuarter === 16) {
                      displayQuarter = null;
                    }

                    const quarterNumber =
                      disableQuarterNumbers || isSectionHeader || isAfEranav
                        ? null
                        : currentQuarter;

                    // استخدم آخر رقم معروف لتلوين الصفوف حتى لو لم نعرض رقم الربع (مثل حالات (اف ايراناف))
                    const colorReferenceNumber = isSectionHeader
                      ? getNumberFromTitle(arabic[i] || "")
                      : isAfEranav
                        ? currentQuarter || 1
                        : isKhatamTasbeha
                          ? displayQuarter !== null
                            ? displayQuarter + 1
                            : quarterNumber
                          : quarterNumber;

                    const isPsali =
                      fullscreenLyrics.title &&
                      (fullscreenLyrics.title.includes("ابصالية") ||
                        fullscreenLyrics.title.includes("إبصالية"));

                    let isEvenRow = false;
                    if (colorReferenceNumber !== null) {
                      if (isPsali) {
                        isEvenRow =
                          Math.floor((colorReferenceNumber - 1) / 2) % 2 === 1;
                      } else {
                        isEvenRow = colorReferenceNumber % 2 === 0;
                      }
                    }

                    const quarterColorClass = isEvenRow
                      ? "lyrics-row-even"
                      : "lyrics-row-odd";

                    return (
                      <div
                        key={i}
                        className={`lyrics-row ${
                          isSectionHeader ? "lyrics-row-section" : ""
                        } ${quarterColorClass} ${disableQuarterNumbers ? "lyrics-row-no-numbering" : ""}`}
                        style={
                          {
                            "--grid-columns": visibleColumns,
                          } as React.CSSProperties & {
                            "--grid-columns": number;
                          }
                        }
                      >
                        {(!!displayQuarter || isAfEranav) && (
                          <div className="lyrics-quarter">
                            {!!displayQuarter && !isAfEranav && (
                              <div className="lyrics-quarter-badge">
                                {displayQuarter}
                              </div>
                            )}
                          </div>
                        )}

                        {showCopticArabic && (
                          <div
                            dir="rtl"
                            lang="ar-EG"
                            className={`lyrics-col lyrics-col-coptic-arabic ${
                              isSectionHeader ? "lyrics-section-text" : ""
                            }`}
                            style={
                              {
                                "--font-size": `${fontSize}px`,
                              } as React.CSSProperties & {
                                "--font-size": string;
                              }
                            }
                          >
                            {copticAr[i] || "-"}
                          </div>
                        )}

                        {showCoptic && (
                          <div
                            dir="ltr"
                            lang="cop"
                            className={`lyrics-col lyrics-col-coptic ${
                              isSectionHeader ? "lyrics-section-text" : ""
                            }`}
                            style={
                              {
                                "--font-size": `${fontSize}px`,
                              } as React.CSSProperties & {
                                "--font-size": string;
                              }
                            }
                          >
                            {coptic[i] || "-"}
                          </div>
                        )}

                        {showArabic && (
                          <div
                            dir="rtl"
                            lang="ar"
                            className={`lyrics-col lyrics-col-arabic ${
                              isSectionHeader ? "lyrics-section-text" : ""
                            }`}
                            style={
                              {
                                "--font-size": `${fontSize + 3}px`,
                              } as React.CSSProperties & {
                                "--font-size": string;
                              }
                            }
                          >
                            {arabic[i] || "-"}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}

                {showHazzat && hazzatImagesCount > 0 && (
                  <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gradient-to-r from-purple-900/30 to-yellow-900/30 border border-purple-500/30 rounded-xl p-4 mb-6">
                      <h3 className="text-2xl font-bold text-center text-yellow-400 flex items-center justify-center gap-3">
                        <span className="text-3xl">🎵</span>
                        هزات اللحن
                        <span className="text-3xl">🎵</span>
                      </h3>
                      <p className="text-center text-gray-400 text-sm mt-2"></p>
                    </div>

                    <div className="w-full bg-black/20 rounded-xl overflow-hidden">
                      <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={8}
                        centerOnInit={false}
                        initialPositionX={0}
                        initialPositionY={0}
                        onTransform={(ref) => {
                          const zoomed = ref.state.scale > 1.01;
                          if (zoomed !== isHazzatZoomed) {
                            setIsHazzatZoomed(zoomed);
                          }
                        }}
                        onZoomStop={(ref) => {
                          const zoomed = ref.state.scale > 1.01;
                          if (zoomed !== isHazzatZoomed) {
                            setIsHazzatZoomed(zoomed);
                          }
                        }}
                        panning={{
                          disabled: !isHazzatZoomed,
                          velocityDisabled: false,
                          allowLeftClickPan: true,
                          allowRightClickPan: true,
                          lockAxisX: false,
                          lockAxisY: false,
                          excluded: ["input", "button", "a"],
                        }}
                        pinch={{
                          disabled: false,
                        }}
                        doubleClick={{
                          disabled: false,
                          mode: "toggle",
                          step: 2.5,
                        }}
                        wheel={{ disabled: true }}
                      >
                        <TransformComponent
                          wrapperClass="!w-full !h-auto"
                          contentClass="!w-full !h-auto"
                          wrapperStyle={{
                            touchAction: isHazzatZoomed ? "none" : "pan-y",
                            width: "100%",
                          }}
                        >
                          <div className="flex flex-col items-stretch m-0 p-0 leading-[0] text-[0] w-full bg-black">
                            {fullscreenLyrics.hazzatImage && (
                              <img
                                src={fullscreenLyrics.hazzatImage}
                                alt="هزات اللحن - الصورة الأولى"
                                className="block w-full h-auto object-contain m-0 p-0 align-top"
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            {fullscreenLyrics.hazzatImage٢ && (
                              <img
                                src={fullscreenLyrics.hazzatImage٢}
                                alt="هزات اللحن - الصورة الثانية"
                                className="block w-full h-auto object-contain m-0 p-0 align-top -mt-[0.5px]"
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            {fullscreenLyrics.hazzatImage٣ && (
                              <img
                                src={fullscreenLyrics.hazzatImage٣}
                                alt="هزات اللحن - الصورة الثالثة"
                                className="block w-full h-auto object-contain m-0 p-0 align-top -mt-[0.5px]"
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            {fullscreenLyrics.hazzatImage٤ && (
                              <img
                                src={fullscreenLyrics.hazzatImage٤}
                                alt="هزات اللحن - الصورة الرابعة"
                                className="block w-full h-auto object-contain m-0 p-0 align-top -mt-[0.5px]"
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            {fullscreenLyrics.hazzatImage٥ && (
                              <img
                                src={fullscreenLyrics.hazzatImage٥}
                                alt="هزات اللحن - الصورة الخامسة"
                                className="block w-full h-auto object-contain m-0 p-0 align-top -mt-[0.5px]"
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            {fullscreenLyrics.hazzatImage٦ && (
                              <img
                                src={fullscreenLyrics.hazzatImage٦}
                                alt="هزات اللحن - الصورة السادسة"
                                className="block w-full h-auto object-contain m-0 p-0 align-top -mt-[0.5px]"
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            {fullscreenLyrics.hazzatImage٧ && (
                              <img
                                src={fullscreenLyrics.hazzatImage٧}
                                alt="هزات اللحن - الصورة السابعة"
                                className="block w-full h-auto object-contain m-0 p-0 align-top -mt-[0.5px]"
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            {fullscreenLyrics.hazzatImage٨ && (
                              <img
                                src={fullscreenLyrics.hazzatImage٨}
                                alt="هزات اللحن - الصورة الثامنة"
                                className="block w-full h-auto object-contain m-0 p-0 align-top -mt-[0.5px]"
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            {fullscreenLyrics.hazzatImage٩ && (
                              <img
                                src={fullscreenLyrics.hazzatImage٩}
                                alt="هزات اللحن - الصورة التاسعة"
                                className="block w-full h-auto object-contain m-0 p-0 align-top -mt-[0.5px]"
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            {fullscreenLyrics.hazzatImage١٠ && (
                              <img
                                src={fullscreenLyrics.hazzatImage١٠}
                                alt="هزات اللحن - الصورة العاشرة"
                                className="block w-full h-auto object-contain m-0 p-0 align-top -mt-[0.5px]"
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                          </div>
                        </TransformComponent>
                      </TransformWrapper>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
