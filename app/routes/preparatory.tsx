import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LazyVideo from "../components/LazyVideo";
import "../styles/melodies.css";

interface Video {
  id: string;
  title: string;
  url: string;
}

interface TextContent {
  id: string;
  title: string;
  content: string;
}

const preparatoryVideos: Record<string, Video[]> = {
  حضانة: [
    {
      id: "k1",
      title: "",
      url: "",
    },
    {
      id: "k2",
      title: "",
      url: "",
    },
    {
      id: "k3",
      title: "",
      url: "",
    },
  ],
  "اولي وتانيه وثالثة": [
    {
      id: "p1",
      title: "",
      url: "",
    },
    {
      id: "p2",
      title: "",
      url: "",
    },
    {
      id: "p3",
      title: "",
      url: "",
    },
  ],
  "رابعة وخامسة وسادسة": [
    {
      id: "s1",
      title: "",
      url: "",
    },
    {
      id: "s2",
      title: "",
      url: "",
    },
    {
      id: "s3",
      title: "",
      url: "",
    },
  ],
  "اعدادي وثانوي": [
    {
      id: "hs1",
      title: "",
      url: "",
    },
    {
      id: "hs2",
      title: "",
      url: "",
    },
    {
      id: "hs3",
      title: "",
      url: "",
    },
    {
      id: "hs4",
      title: "",
      url: "",
    },
  ],
};

// بيانات طقس اللحن للمراحل التمهيدية
const preparatoryTextContent: Record<string, TextContent[]> = {
  حضانة: [
    {
      id: "k-text1",
      title: "",
      content: "",
    },
    {
      id: "k-text2",
      title: "",
      content: "",
    },
    {
      id: "k-text3",
      title: "",
      content: "",
    },
  ],
  "اولي وتانيه وثالثة": [
    {
      id: "p-text1",
      title: "",
      content: "",
    },
    {
      id: "p-text2",
      title: "",
      content: "",
    },
    {
      id: "p-text3",
      title: "",
      content: "",
    },
  ],
  "رابعة وخامسة وسادسة": [
    {
      id: "s-text1",
      title: "",
      content: "",
    },
    {
      id: "s-text2",
      title: "",
      content: "",
    },
    {
      id: "s-text3",
      title: "",
      content: "",
    },
  ],
  "اعدادي وثانوي": [
    {
      id: "hs-text1",
      title: "",
      content: "",
    },
    {
      id: "hs-text2",
      title: "",
      content: "",
    },
    {
      id: "hs-text3",
      title: "",
      content: "",
    },
    {
      id: "hs-text4",
      title: "",
      content: "",
    },
  ],
};

export default function PreparatoryPage() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [contentType, setContentType] = useState<"videos" | "text" | null>(
    null
  );

  const handleStageClick = (stage: string) => {
    setSelectedStage(stage);
    setContentType(null); // إعادة تعيين نوع المحتوى عند اختيار مرحلة جديدة
  };

  const handleContentTypeClick = (type: "videos" | "text") => {
    setContentType(type);
  };

  const handleBackToStages = () => {
    setSelectedStage(null);
    setContentType(null);
  };

  const handleBackToContentTypes = () => {
    setContentType(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat melodies-bg">
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 flex flex-col min-h-full bg-gray-900/0 text-white">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
            {!selectedStage ? (
              // عرض المراحل
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {Object.keys(preparatoryVideos).map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => handleStageClick(stage)}
                      className="p-4 sm:p-6 bg-gray-700 text-white border border-blue-500 rounded-lg cursor-pointer transition-all hover:border-blue-400 hover:scale-105 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base lg:text-lg font-medium"
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            ) : !contentType ? (
              // عرض خيارات نوع المحتوى
              <div>
                <button
                  type="button"
                  onClick={handleBackToStages}
                  className="mb-4 sm:mb-6 p-2 sm:p-3 bg-gray-700 text-white border border-blue-500 rounded-lg cursor-pointer transition-all hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                >
                  ← العودة إلى المراحل
                </button>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-6 sm:mb-8 text-center">
                  اختر نوع المحتوى لمرحلة:{" "}
                  <span className="text-white">{selectedStage}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                  <button
                    type="button"
                    onClick={() => handleContentTypeClick("videos")}
                    className="p-6 sm:p-8 bg-gray-700 text-white border border-blue-500 rounded-lg cursor-pointer transition-all hover:border-blue-400 hover:scale-105 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl mb-4">🎥</div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3">
                        الفيديوهات
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base">
                        مشاهدة فيديوهات تعليمية للألحان
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContentTypeClick("text")}
                    className="p-6 sm:p-8 bg-gray-700 text-white border border-blue-500 rounded-lg cursor-pointer transition-all hover:border-blue-400 hover:scale-105 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl mb-4">📖</div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3">
                        طقس اللحن
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base">
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
                  type="button"
                  onClick={handleBackToContentTypes}
                  className="mb-4 sm:mb-6 p-2 sm:p-3 bg-gray-700 text-white border border-blue-500 rounded-lg cursor-pointer transition-all hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                >
                  ← العودة إلى اختيار نوع المحتوى
                </button>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-6 sm:mb-8 text-center">
                  🎥 فيديوهات مرحلة:{" "}
                  <span className="text-white">{selectedStage}</span>
                </h2>
                <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center flex-1">
                  {preparatoryVideos[selectedStage].map((video) => (
                    <div
                      key={video.id}
                      className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-blue-500 transition-all hover:border-blue-400 hover:scale-105 flex flex-col"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 sm:mb-4 text-center">
                        {video.title || ""}
                      </h3>
                      {video.url ? (
                        <LazyVideo
                          src={video.url}
                          title={video.title || "فيديو تمهيدي"}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full aspect-video bg-gray-600 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl sm:text-4xl mb-2">🎬</div>
                            <p className="text-gray-400 text-sm sm:text-base">
                              سيتم إضافة الفيديو قريباً
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // عرض طقس اللحن
              <div>
                <button
                  type="button"
                  onClick={handleBackToContentTypes}
                  className="mb-4 sm:mb-6 p-2 sm:p-3 bg-gray-700 text-white border border-blue-500 rounded-lg cursor-pointer transition-all hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                >
                  ← العودة إلى اختيار نوع المحتوى
                </button>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-6 sm:mb-8 text-center">
                  📖 طقس اللحن لمرحلة:{" "}
                  <span className="text-white">{selectedStage}</span>
                </h2>
                <div
                  className={`grid gap-4 sm:gap-6 lg:gap-8 justify-center flex-1 ${
                    selectedStage === "اعدادي وثانوي"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {preparatoryTextContent[selectedStage].map((textItem) => (
                    <div
                      key={textItem.id}
                      className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-blue-500 transition-all hover:border-blue-400 hover:scale-105 flex flex-col"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 sm:mb-4 text-center">
                        {textItem.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base flex-1">
                        {textItem.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
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
