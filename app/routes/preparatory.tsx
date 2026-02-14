import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LazyVideo from "../components/LazyVideo";
import "../styles/melodies.css";

// --- تعريفات الأنواع ---
interface Video {
  id: string;
  title: string;
  url: string;
  copticArabic: string;
  copticcoptic: string;
  arabicTranslation: string;
  hazzatImage?: string;
  hazzatImage2?: string;
  hazzatImage3?: string;
}

interface TextContent {
  id: string;
  title: string;
  content: string;
}

type StageVideos = Record<string, Video[]>;
type StageTexts = Record<string, TextContent[]>;

// --- المراحل المتاحة ---
const STAGES = [
  { key: "حضانة", label: "حضانة" },
  { key: "اولي وتانيه وثالثة", label: "اولي وتانيه وثالثة" },
  { key: "رابعة وخامسة وسادسة", label: "رابعة وخامسة وسادسة" },
  { key: "اعدادي وثانوي", label: "اعدادي وثانوي" },
];

// --- بيانات الفيديوهات ---
const preparatoryVideos: StageVideos = {
  حضانة: [
    {
      id: "k1",
      title: "اجيوس السنوي",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
    {
      id: "k2",
      title: "ذكصولوجية العذراء عشية بالنغمة السنوي (إيرى إبسول سيل إمماريام)",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
    {
      id: "k3",
      title:
        "مرد انجيل الأحد الأول والثاني لشهر كيهك (تين تي نيمبي + إثفي فاي تين تي أوؤوني)",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
  ],
  "اولي وتانيه وثالثة": [
    {
      id: "p1",
      title: "ني شيروبيم للقداس الباسيلي",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
    {
      id: "p2",
      title:
        "مرد انجيل الأحد الثالث والرابع (تين اتشيسي اممو + اثفي فاي + جى افسمارؤوت)",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
    {
      id: "p3",
      title:
        "مقدمة الذكصولوجيات بالنغمة الكيهكي السريعة للربعين (شيرى نى أوتى بارثينوس + تينتى هو آرى)",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
  ],
  "رابعة وخامسة وسادسة": [
    {
      id: "s1",
      title: "أوشية المسافرين (قبطي + عربي)",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
    {
      id: "s2",
      title: "ذكصولوجية كي غار كاملة",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
    {
      id: "s3",
      title:
        "هيتنيات شهر كيهك كاملة (المالك غبلاير المبشر + يوحنا المعمدان نسيب عمانوئيل + الكاهن زكريا واليصابات + يواقيم وحنه)",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
  ],
  "اعدادي وثانوي": [
    {
      id: "hs1",
      title: "طاي شوري",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
    {
      id: "hs2",
      title: "ابصالية آدام علي الهوس الثاني (أباهيت نيم باالس) كاملة",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
    {
      id: "hs3",
      title: "مرد الابركسيس الأحد الأول (شيري غبريل بي نشتي ان ارشي انجيلوس)",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
  ],
};

// --- بيانات طقس اللحن ---
const preparatoryTextContent: StageTexts = {
  حضانة: [
    {
      id: "k-text1",
      title: "اجيوس السنوي",
      content: "",
    },
    {
      id: "k-text2",
      title: "ذكصولوجية العذراء عشية بالنغمة السنوي (إيرى إبسول سيل إمماريام)",
      content: "",
    },
    {
      id: "k-text3",
      title:
        "مرد انجيل الأحد الأول والثاني لشهر كيهك (تين تي نيمبي + إثفي فاي تين تي أوؤوني)",
      content: "",
    },
  ],
  "اولي وتانيه وثالثة": [
    {
      id: "p-text1",
      title: "ني شيروبيم للقداس الباسيلي",
      content: "",
    },
    {
      id: "p-text2",
      title:
        "مرد انجيل الأحد الثالث والرابع (تين اتشيسي اممو + اثفي فاي + جى افسمارؤوت)",
      content: "",
    },
    {
      id: "p-text3",
      title:
        "مقدمة الذكصولوجيات بالنغمة الكيهكي السريعة للربعين (شيرى نى أوتى بارثينوس + تينتى هو آرى)",
      content: "",
    },
  ],
  "رابعة وخامسة وسادسة": [
    {
      id: "s-text1",
      title: "أوشية المسافرين (قبطي + عربي)",
      content: "",
    },
    {
      id: "s-text2",
      title: "ذكصولوجية كي غار كاملة",
      content: "",
    },
    {
      id: "s-text3",
      title:
        "هيتنيات شهر كيهك كاملة (المالك غبلاير المبشر + يوحنا المعمدان نسيب عمانوئيل + الكاهن زكريا واليصابات + يواقيم وحنه)",
      content: "",
    },
  ],
  "اعدادي وثانوي": [
    {
      id: "hs-text1",
      title: "طاي شوري",
      content: "",
    },
    {
      id: "hs-text2",
      title: "ابصالية آدام علي الهوس الثاني (أباهيت نيم باالس) كاملة",
      content: "",
    },
    {
      id: "hs-text3",
      title: "مرد الابركسيس الأحد الأول (شيري غبريل بي نشتي ان ارشي انجيلوس)",
      content: "",
    },
  ],
};

// --- المكون الرئيسي ---
export default function PreparatoryPage() {
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [contentType, setContentType] = useState<"videos" | "text" | "">("");
  const [fullscreenLyrics, setFullscreenLyrics] = useState<Video | null>(null);

  // ====== خاصية التحكم في اللغات ======
  const [showCopticArabic, setShowCopticArabic] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [showCoptic, setShowCoptic] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // ====== خاصية التحكم في حجم الخط ======
  const [fontSize, setFontSize] = useState(18);

  // ====== خاصية التحكم في هزات اللحن ======
  const [showHazzat, setShowHazzat] = useState(false);
  const [showHazzatMenu, setShowHazzatMenu] = useState(false);

  const handleStageChange = (stage: string) => {
    setSelectedStage(stage);
    setContentType("");
  };

  const handleBackToStages = () => {
    setSelectedStage("");
    setContentType("");
  };

  const handleBackToContentTypes = () => {
    setContentType("");
  };

  // دوال التحكم في حجم الخط
  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 1, 20));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 1, 14));
  };

  // حساب عدد الأعمدة المرئية
  const visibleColumns = [showCopticArabic, showArabic, showCoptic].filter(
    Boolean,
  ).length;

  // التحقق من وجود صور هزات
  const hasHazzatImages =
    fullscreenLyrics &&
    (fullscreenLyrics.hazzatImage ||
      fullscreenLyrics.hazzatImage2 ||
      fullscreenLyrics.hazzatImage3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white font-sans">
      <Header />
      <main className="flex-1 page-bg-setup bg-about relative">
        <div className="bg-overlay" />
        <div className="relative z-10 pb-10">
          <div className="bg-gradient-to-b from-blue-900/30 to-transparent py-10 px-4 text-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-3">
              المنهج التمهيدي
            </h1>
            <p className="text-gray-400">
              اختر المرحلة ونوع المحتوى لعرض المنهج الدراسي
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            {!selectedStage ? (
              // اختيار المرحلة
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAGES.map((stage) => (
                  <button
                    key={stage.key}
                    onClick={() => handleStageChange(stage.key)}
                    className="p-6 rounded-xl border-2 bg-gray-900 border-gray-800 hover:border-gray-600 transition-all font-bold text-lg"
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            ) : !contentType ? (
              // اختيار نوع المحتوى
              <div>
                <button
                  onClick={handleBackToStages}
                  className="mb-6 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all"
                >
                  ← العودة إلى المراحل
                </button>
                <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
                  اختر نوع المحتوى لمرحلة:{" "}
                  <span className="text-white">{selectedStage}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <button
                    onClick={() => setContentType("videos")}
                    className="p-8 bg-gray-900 border-2 border-gray-800 hover:border-blue-500 rounded-xl transition-all hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4">🎥</div>
                      <h3 className="text-2xl font-semibold mb-3">
                        الفيديوهات
                      </h3>
                      <p className="text-gray-400">
                        مشاهدة فيديوهات تعليمية للألحان
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setContentType("text")}
                    className="p-8 bg-gray-900 border-2 border-gray-800 hover:border-blue-500 rounded-xl transition-all hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4">📖</div>
                      <h3 className="text-2xl font-semibold mb-3">طقس اللحن</h3>
                      <p className="text-gray-400">
                        قراءة شرح طقس اللحن والتفاصيل
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : contentType === "videos" ? (
              // عرض الفيديوهات
              <div>
                <button
                  onClick={handleBackToContentTypes}
                  className="mb-6 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all"
                >
                  ← العودة
                </button>
                <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
                  🎥 فيديوهات مرحلة:{" "}
                  <span className="text-white">{selectedStage}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {preparatoryVideos[selectedStage]?.map((video) => (
                    <div
                      key={video.id}
                      className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl"
                    >
                      <div className="aspect-video bg-black relative">
                        {video.url ? (
                          <LazyVideo src={video.url} title={video.title} />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-600">
                            <span className="text-4xl mb-2">🎬</span>
                            <p className="italic">متاح قريباً</p>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-4">
                          {video.title}
                        </h3>
                        <button
                          onClick={() => setFullscreenLyrics(video)}
                          className="w-full py-3 bg-blue-600/10 text-blue-400 border border-blue-600/30 rounded-xl font-bold hover:bg-blue-600/20 transition-all"
                        >
                          عرض كلمات اللحن
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // عرض طقس اللحن
              <div>
                <button
                  onClick={handleBackToContentTypes}
                  className="mb-6 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all"
                >
                  ← العودة
                </button>
                <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
                  📖 طقس اللحن لمرحلة:{" "}
                  <span className="text-white">{selectedStage}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {preparatoryTextContent[selectedStage]?.map((textItem) => (
                    <div
                      key={textItem.id}
                      className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl hover:scale-105 transition-all"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-blue-400 mb-4">
                          {textItem.title}
                        </h3>
                        {textItem.content && (
                          <p className="text-gray-300 leading-relaxed">
                            {textItem.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- مودال النصوص (ملء الشاشة) --- */}
      {fullscreenLyrics && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden">
          <header className="sticky top-0 z-50 p-3 md:p-4 bg-gray-900 border-b border-white/10 flex justify-between items-center gap-2">
            <h2 className="text-blue-400 font-bold text-sm md:text-lg truncate flex-1">
              {fullscreenLyrics.title}
            </h2>

            {/* ====== أزرار التحكم في حجم الخط ====== */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={decreaseFontSize}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 flex items-center justify-center transition-all"
                aria-label="تصغير الخط"
              >
                <span className="text-xl">-</span>
              </button>
              <span className="text-sm px-2">{fontSize}</span>
              <button
                onClick={increaseFontSize}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 flex items-center justify-center transition-all"
                aria-label="تكبير الخط"
              >
                <span className="text-xl">+</span>
              </button>
            </div>

            {/* ====== زر هزات اللحن ====== */}
            {hasHazzatImages && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowHazzatMenu(!showHazzatMenu)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-sm md:text-base transition-all"
                >
                  هزات
                </button>

                {showHazzatMenu && (
                  <div className="absolute left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 min-w-[180px] z-[51]">
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition-all">
                        <input
                          type="checkbox"
                          checked={showHazzat}
                          onChange={(e) => setShowHazzat(e.target.checked)}
                          className="w-5 h-5 accent-purple-600"
                        />
                        <span className="text-sm md:text-base">
                          إظهار الهزات
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={() => setShowHazzatMenu(false)}
                      className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-all"
                    >
                      إغلاق
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ====== زر اللغة ====== */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-sm md:text-base transition-all"
              >
                اللغة
              </button>

              {showLanguageMenu && (
                <div className="absolute left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 min-w-[180px] z-[51]">
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition-all">
                      <input
                        type="checkbox"
                        checked={showArabic}
                        onChange={(e) => setShowArabic(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                      />
                      <span className="text-sm md:text-base">عربي</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition-all">
                      <input
                        type="checkbox"
                        checked={showCopticArabic}
                        onChange={(e) => setShowCopticArabic(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                      />
                      <span className="text-sm md:text-base">قبطي معرب</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition-all">
                      <input
                        type="checkbox"
                        checked={showCoptic}
                        onChange={(e) => setShowCoptic(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                      />
                      <span className="text-sm md:text-base">قبطي</span>
                    </label>
                  </div>

                  <button
                    onClick={() => setShowLanguageMenu(false)}
                    className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-all"
                  >
                    إغلاق
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setFullscreenLyrics(null)}
              className="text-2xl md:text-3xl p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-gray-950 p-2 md:p-6">
            <div className="w-full max-w-7xl mx-auto">
              {/* Header Row */}
              {visibleColumns > 0 && (
                <div
                  className="grid gap-1 md:gap-4 border-b border-white/20 pb-4 mb-4 sticky top-0 bg-gray-950 z-10"
                  style={{
                    gridTemplateColumns: `repeat(${visibleColumns}, 1fr)`,
                  }}
                >
                  {showCopticArabic && (
                    <div className="text-center text-green-500 font-black text-xs md:text-lg">
                      قبطي معرب
                    </div>
                  )}
                  {showArabic && (
                    <div className="text-center text-amber-500 font-black text-xs md:text-lg">
                      عربي
                    </div>
                  )}
                  {showCoptic && (
                    <div className="text-center text-white font-black text-xs md:text-lg">
                      قبطي
                    </div>
                  )}
                </div>
              )}

              {/* Lyrics Content */}
              {(() => {
                const coptic = (fullscreenLyrics.copticcoptic || "").split(
                  "\n\n",
                );
                const copticAr = (fullscreenLyrics.copticArabic || "").split(
                  "\n\n",
                );
                const arabic = (fullscreenLyrics.arabicTranslation || "").split(
                  "\n\n",
                );
                const maxParts = Math.max(
                  coptic.length,
                  copticAr.length,
                  arabic.length,
                );

                return Array.from({ length: maxParts }).map((_, i) => (
                  <div
                    key={i}
                    className="grid gap-1 md:gap-6 py-6 border-b border-white/5 items-center hover:bg-white/[0.02]"
                    style={{
                      gridTemplateColumns: `repeat(${visibleColumns}, 1fr)`,
                    }}
                  >
                    {showCopticArabic && (
                      <div
                        className="text-center leading-relaxed px-1"
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight: "1.6",
                          color: "#4ade80",
                          wordBreak: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {copticAr[i] || "-"}
                      </div>
                    )}
                    {showArabic && (
                      <div
                        className="text-center leading-relaxed italic px-1"
                        style={{
                          fontSize: `${fontSize+ 3}px`,
                          lineHeight: "1.6",
                          color: "#fbbf24",
                          wordBreak: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {arabic[i] || "-"}
                      </div>
                    )}
                    {showCoptic && (
                      <div
                        className="text-center font-copt leading-relaxed px-1"
                        style={{
                          fontSize: `${fontSize + 2}px`,
                          lineHeight: "1.7",
                          color: "#ffffff",
                          wordBreak: "break-word",
                        }}
                      >
                        {coptic[i] || "-"}
                      </div>
                    )}
                  </div>
                ));
              })()}

              {/* قسم صور هزات اللحن */}
              {showHazzat && hasHazzatImages && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-0 w-full auto-rows-max">
                  {fullscreenLyrics.hazzatImage && (
                    <div className="relative overflow-hidden w-full m-0 p-0 border-2 border-purple-500/30 rounded-lg">
                      <img
                        src={fullscreenLyrics.hazzatImage}
                        alt="هزات اللحن"
                        className="w-full h-auto object-contain m-0 p-0 block cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                  )}

                  {fullscreenLyrics.hazzatImage2 && (
                    <div className="relative overflow-hidden w-full m-0 p-0 border-2 border-purple-500/30 rounded-lg">
                      <img
                        src={fullscreenLyrics.hazzatImage2}
                        alt="هزات اللحن - صورة إضافية 1"
                        className="w-full h-auto object-contain m-0 p-0 block cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                  )}

                  {fullscreenLyrics.hazzatImage3 && (
                    <div className="relative overflow-hidden w-full m-0 p-0 border-2 border-purple-500/30 rounded-lg">
                      <img
                        src={fullscreenLyrics.hazzatImage3}
                        alt="هزات اللحن - صورة إضافية 2"
                        className="w-full h-auto object-contain m-0 p-0 block cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export function meta() {
  return [
    { title: "ⲥⲙⲟⲩ ⲉⲣⲟϥ - تمهيدي" },
    {
      name: "description",
      content: "موقع متخصص في تعليم الألحان القبطية للطلاب في مختلف المراحل",
    },
  ];
}
