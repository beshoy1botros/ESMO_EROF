import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  STAGE_KEYS,
  STAGE_LABELS,
  mapArabicToEnglishLevel,
} from "../utils/stageUtils";

// استيراد البيانات والأنواع
import { preparatoryData } from "../utils/preparatoryData";
import "../styles/about.css";

// تعريف واجهة للعنصر الواحد (اللحن أو الدرس) لمنع خطأ الـ Rendering
interface PreparatoryItem {
  title: string;
  content: string;
}

// --- المراحل المتاحة ---
const AVAILABLE_STAGES = [
  {
    key: STAGE_KEYS.FOURTH_FIFTH_SIXTH,
    label: STAGE_LABELS[STAGE_KEYS.FOURTH_FIFTH_SIXTH],
  },
  {
    key: STAGE_KEYS.MIDDLE_HIGH,
    label: STAGE_LABELS[STAGE_KEYS.MIDDLE_HIGH],
  },
];

// --- دالة للحصول على المحتوى ---
function getContent(stage: string, level: string): PreparatoryItem[] {
  const englishLevel = mapArabicToEnglishLevel(level);

  // الوصول للمرحلة بأمان
  const stageData = preparatoryData[stage as keyof typeof preparatoryData];

  if (!stageData) return [];

  // الوصول للمستوى (first, second, or gifted)
  // تم استخدام "as any" هنا لتخطي تعقيدات الـ Indexing في TypeScript للمفاتيح الديناميكية
  const levelData = (stageData as any)[englishLevel];

  return Array.isArray(levelData) ? levelData : [];
}

export default function About() {
  const [stage, setStage] = useState<string>("");
  const [level, setLevel] = useState<string>("");

  // تصحيح: الـ content هو مصفوفة من العناصر (Items) وليس الـ Data الكلية
  const [content, setContent] = useState<PreparatoryItem[]>([]);

  const [expandedIndices, setExpandedIndices] = useState<
    Record<number, boolean>
  >({});

  const handleStageChange = (newStage: string) => {
    setStage(newStage);
    // تلقائياً اختر المستوى الأول عند اختيار المرحلة
    setLevel("الأول");
    setContent([]);
    setExpandedIndices({});
    // جلب المحتوى مباشرة للمستوى الأول
    if (newStage) {
      const data = getContent(newStage, "الأول");
      setContent(data);
    }
  };

  const toggleRite = (index: number) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 page-bg-setup bg-about relative">
        <div className="bg-overlay" />

        <div className="relative z-10 flex flex-col min-h-full text-white">
          <div className="bg-gradient-to-b from-blue-900/30 to-transparent py-10 px-4 text-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-3">طقس اللحن</h1>
            <p className="text-gray-400">
              اختر المرحلة والمستوى لعرض المنهج الدراسي
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4 pb-10">
            {/* اختيار المرحلة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
              {AVAILABLE_STAGES.map((stageItem) => (
                <button
                  key={stageItem.key}
                  onClick={() => handleStageChange(stageItem.key)}
                  className={`p-5 rounded-xl border-2 transition-all font-bold text-lg ${
                    stage === stageItem.key
                      ? "bg-blue-600 border-blue-400 shadow-lg scale-95"
                      : "bg-gray-900 border-gray-800 hover:border-gray-600"
                  }`}
                >
                  {stageItem.label}
                </button>
              ))}
            </div>

            {/* عرض المحتوى */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {content.length === 0 && stage && level ? (
                <div className="col-span-full text-center p-8 bg-gray-800 rounded-xl border border-blue-500/30">
                  <div className="text-5xl mb-4">📖</div>
                  <p className="text-gray-400">لا يوجد محتوى لهذه المرحلة</p>
                </div>
              ) : (
                content.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex flex-col"
                  >
                    <div className="p-6 flex flex-col h-full">
                      {/* حل المشكلة: التأكد أن item.title هو نص (string) */}
                      <h3 className="text-xl font-bold text-blue-400 mb-6 min-h-[3.5rem] flex items-center">
                        {String(item.title)}
                      </h3>

                      <button
                        onClick={() => toggleRite(index)}
                        className={`w-full py-3 rounded-xl font-bold transition-all mb-4 ${
                          expandedIndices[index]
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-blue-600/10 text-blue-400 border border-blue-600/30 hover:bg-blue-600/20"
                        }`}
                      >
                        {expandedIndices[index]
                          ? "إخفاء طقس اللحن"
                          : "عرض طقس اللحن"}
                      </button>

                      {expandedIndices[index] && item.content && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="h-px bg-white/10 mb-4" />
                          <p
                            className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base"
                            dangerouslySetInnerHTML={{
                              __html: String(item.content),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function meta() {
  return [
    { title: "ⲥⲙⲟⲩ ⲉⲣⲟϥ - طقس اللحن" },
    { name: "description", content: "موقع متخصص في تعليم الألحان القبطية" },
  ];
}
