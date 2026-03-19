import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  STAGE_KEYS,
  STAGE_LABELS,
  getLevelsForStage,
  mapArabicToEnglishLevel,
} from "../utils/stageUtils";
import { riteData, type RiteItem } from "../utils/riteData";
import "../styles/about.css";

// CSS مخصص للنصوص القبطية - تم نقل حجم الخط إلى ملف CSS
const copticStyles = `
  .coptic-content .coptic-inline {
    font-family: "copt-main", "copt-alt", "copt-youssef", "Noto Sans Coptic", sans-serif;
    color: #a78bfa;
    display: inline-block;
    direction: ltr;
    margin: 0 4px;
  }
  
  .coptic-content {
    font-family: "copt-main", "copt-alt", "copt-youssef", "Noto Sans Coptic", sans-serif;
  }
  
  .coptic-content span[class*="coptic"] {
    font-family: "copt-main", "copt-alt", "copt-youssef", "Noto Sans Coptic", sans-serif;
  }
`;

// --- المراحل المتاحة (بدون حضانة وأولى وتانيه) ---
const AVAILABLE_STAGES = [
  {
    key: STAGE_KEYS.THIRD_FOURTH,
    label: STAGE_LABELS[STAGE_KEYS.THIRD_FOURTH],
  },
  { key: STAGE_KEYS.FIFTH_SIXTH, label: STAGE_LABELS[STAGE_KEYS.FIFTH_SIXTH] },
  { key: STAGE_KEYS.MIDDLE, label: STAGE_LABELS[STAGE_KEYS.MIDDLE] },
  { key: STAGE_KEYS.HIGH, label: STAGE_LABELS[STAGE_KEYS.HIGH] },
  { key: STAGE_KEYS.UNIVERSITY, label: STAGE_LABELS[STAGE_KEYS.UNIVERSITY] },
  { key: STAGE_KEYS.SERVANTS, label: STAGE_LABELS[STAGE_KEYS.SERVANTS] },
  {
    key: STAGE_KEYS.WEDDING_OF_CANA,
    label: STAGE_LABELS[STAGE_KEYS.WEDDING_OF_CANA],
  },
];

// --- دالة للحصول على المحتوى ---
function getContent(stage: string, level: string): RiteItem[] {
  const englishLevel = mapArabicToEnglishLevel(level);
  const stageData = riteData[stage];
  return stageData?.[englishLevel] || [];
}

// --- المكون الرئيسي ---
export default function About() {
  const [stage, setStage] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [content, setContent] = useState<RiteItem[]>([]);
  const [expandedIndices, setExpandedIndices] = useState<
    Record<number, boolean>
  >({});

  const levels = stage ? getLevelsForStage(stage) : [];

  const handleStageChange = (newStage: string) => {
    setStage(newStage);
    setLevel("");
    setContent([]);
    setExpandedIndices({});

    // إذا كانت المرحلة عرس قانا الجليل، عرض المحتوى مباشرة
    if (newStage === STAGE_KEYS.WEDDING_OF_CANA) {
      const weddingContent = getContent(newStage, "الأول");
      setContent(weddingContent);
      setLevel("الأول");
    }
  };

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    setExpandedIndices({});
    if (stage && newLevel) {
      setContent(getContent(stage, newLevel));
    } else {
      setContent([]);
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
      <style dangerouslySetInnerHTML={{ __html: copticStyles }} />
      <Header />

      <main className="flex-1 page-bg-setup bg-about relative">
        <div className="bg-overlay" />

        <div className="relative z-10 flex flex-col min-h-full bg-gray-900/0 text-white">
          <div className="bg-gradient-to-b from-blue-900/30 to-transparent py-10 px-4 text-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-3">طقس اللحن</h1>
            <p className="text-gray-400">
              اختر المرحلة والمستوى لعرض المنهج الدراسي
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4 pb-10">
            {/* اختيار المرحلة */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
              {AVAILABLE_STAGES.map((stageItem) => (
                <button
                  key={stageItem.key}
                  onClick={() => handleStageChange(stageItem.key)}
                  className={`p-4 rounded-xl border-2 transition-all font-bold ${
                    stage === stageItem.key
                      ? "bg-blue-600 border-blue-400 shadow-lg scale-95"
                      : "bg-gray-900 border-gray-800 hover:border-gray-600"
                  }`}
                >
                  {stageItem.label}
                </button>
              ))}
            </div>

            {/* اختيار المستوى - مخفي لعرس قانا الجليل */}
            {stage && stage !== STAGE_KEYS.WEDDING_OF_CANA && (
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

            {/* عرض المحتوى */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {content.length === 0 &&
              stage &&
              (stage === STAGE_KEYS.WEDDING_OF_CANA || level) ? (
                <div className="col-span-full text-center p-8 bg-gray-800 rounded-xl border border-blue-500/30">
                  <div className="text-5xl mb-4">⏳</div>
                  <p className="text-gray-400">
                    طقس هذا المستوى لم يُضاف بعد، سيتم عرضه قريباً.
                  </p>
                </div>
              ) : (
                content.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl hover:border-blue-500/30 transition-all flex flex-col"
                  >
                    <div className="p-6 flex flex-col h-full">
                      <h3 className="text-xl font-bold text-blue-400 mb-6 min-h-[3.5rem] flex items-center">
                        {item.title}
                      </h3>

                      <button
                        onClick={
                          item.content ? () => toggleRite(index) : undefined
                        }
                        disabled={!item.content}
                        aria-disabled={!item.content}
                        className={`w-full py-3 rounded-xl font-bold transition-all mb-4 ${
                          item.content
                            ? expandedIndices[index]
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-blue-600/10 text-blue-400 border border-blue-600/30 hover:bg-blue-600/20"
                            : "bg-blue-600/10 text-blue-400 border border-blue-600/30 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        {item.content
                          ? expandedIndices[index]
                            ? "إخفاء طقس اللحن"
                            : "عرض طقس اللحن"
                          : "⏳ قريباً"}
                      </button>

                      {expandedIndices[index] && item.content && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="h-px bg-white/10 mb-4" />
                          <p
                            className="text-gray-300 leading-relaxed whitespace-pre-line coptic-content"
                            dangerouslySetInnerHTML={{ __html: item.content }}
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
