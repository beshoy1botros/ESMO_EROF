import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  STAGE_KEYS,
  STAGE_LABELS,
  getLevelsForStage,
  mapArabicToEnglishLevel,
} from "../utils/stageUtils";
import "../styles/about.css";

// --- تعريفات الأنواع ---
interface TextItem {
  title: string;
  content: string;
}

interface LevelTextData {
  first: TextItem[];
  second: TextItem[];
  gifted?: TextItem[];
}

type TextData = Record<string, LevelTextData>;

// --- بيانات طقس اللحن - محدثة حسب المنهج 2026 ---
const textData: TextData = {
  [STAGE_KEYS.THIRD_FOURTH]: {
    first: [
      {
        title: "ذكصولوجية شهر كيهك كي غار (كاملة)",
        content: "",
      },
      {
        title: "مرد الإبركسيس توتي اليثوس",
        content: "",
      },
      {
        title: "مرد اوس بيرين (بدون امين المطولة)",
        content: "",
      },
      {
        title:
          "المزمور الـ150 للهوس الرابع لشهر كيهك كاملا + جملة (اف ايه راناف)",
        content: "",
      },
    ],
    second: [
      {
        title:
          "مرد الإبركسيس للأحد الثاني والرابع (شيري ني ماريا خين اوشيري افؤواب)",
        content: "",
      },
      {
        title: "لحن طاي شوري السنوي",
        content: "",
      },
      {
        title: "اوشية المياه بنغمة القداس (عربي + قبطي)",
        content: "",
      },
      {
        title: "مرد إنجيل الأحد الأول لشهر كيهك (آ ابتشويس أوأورب إن غابرييل)",
        content: "",
      },
    ],
    gifted: [
      {
        title:
          "لحن تين اوويه انسوك السنوي (ربعين باللحن الكبير + ربعين وسط + التكملة)",
        content: "",
      },
      {
        title: "لحن هيتين الكبيرة المطولة للسيدة العذراء",
        content: "",
      },
      {
        title: "اوشية الزروع بنغمة القداس (عربي + قبطي)",
        content: "",
      },
    ],
  },
  [STAGE_KEYS.FIFTH_SIXTH]: {
    first: [
      {
        title:
          "مردات الانافورا للقداس الغريغوري (كي ميطا تو + ايخومين ابروس + اكسيون)",
        content: "",
      },
      {
        title: "أول 10 أرباع من الهوس الثاني",
        content: "",
      },
      {
        title: "مرد الإبركسيس لشهر كيهك (شيري غابرييل بي فاي شنوفي)",
        content: "",
      },
      {
        title:
          "هيتنيات شهر كيهك كاملة (للملاك غبريال المبشر + يوحنا المعمدان نسيب عمانوئيل + زكريا الكاهن واليصابات + يواقيم وحنه)",
        content: "",
      },
    ],
    second: [
      {
        title: "أول 10 أرباع من الهوس الثالث",
        content: "",
      },
      {
        title: "مزمور سوتيم طاشيري الكيهكي (بداية بالليلويا المقدمة)",
        content: "",
      },
      {
        title: "اوشية الأهوية بنغمة القداس (عربي + قبطي)",
        content: "",
      },
      {
        title: "ختام الثيؤطوكيات الآدام (نيك ناي) بنغمة تسبحة باكر",
        content: "",
      },
    ],
    gifted: [
      {
        title: "لحن جي افسمارؤوت الكيهكي + اول 3 ارباع من لحن اف امبشا غار",
        content: "",
      },
      {
        title: "لحن شيري ني ماريا تسبحة نصف الليل",
        content: "",
      },
    ],
  },
  [STAGE_KEYS.MIDDLE]: {
    first: [
      {
        title:
          "مرد الإبركسيس لشهر كيهك الأسبوع الأول والثاني (شيري غابرييل بي نيشتي ان ارشي + شيري غابرييل بي فاي شنوفي)",
        content: "",
      },
      {
        title: "التفسير الأول والثاني من المعقب",
        content: "",
      },
      {
        title:
          "لحن هيتين الكبيرة المطولة للسيدة العذراء + جميع هيتنيات شهر كيهك",
        content: "",
      },
      {
        title: "ابصالية الهوس الثاني كاملة لشهر كيهك",
        content: "",
      },
    ],
    second: [
      {
        title: "ابصالية آدام علي الهوس الثالث (تي شيب إهموت انتوتك) كاملة",
        content: "",
      },
      {
        title: "لحن تينين (ربع تينين + الختام إفهوس)",
        content: "",
      },
      {
        title: "التفسير الثالث والرابع من المعقب",
        content: "",
      },
    ],
    gifted: [
      {
        title: "الليلويا التوزيع الكيهكي قبطيا كاملا + اللي كيه نين",
        content: "",
      },
      {
        title: "التفسير الأول والثاني من الرومي",
        content: "",
      },
      {
        title: "لحن سيموتي",
        content: "",
      },
    ],
  },
  [STAGE_KEYS.HIGH]: {
    first: [
      {
        title: "الهوس الرابع كاملا + مرد (اف ايه راناف)",
        content: "",
      },
      {
        title: "(الليلويا التوزيع الكيهكي (بدون اللي كي نين",
        content: "",
      },
      {
        title: "ذكصولوجية شهر كيهك كي غار (كاملة)",
        content: "",
      },
      {
        title: "التفسير الثالث والرابع من الرومي",
        content: "",
      },
    ],
    second: [
      {
        title: "لحن تينين كاملا (ربع تينين + الختام إفهوس)",
        content: "",
      },
      {
        title: "التفسير الرابع والخامس والسادس من المعقب",
        content: "",
      },
      {
        title: "لحن اسمو ابشويس",
        content: "",
      },
      {
        title: "لحن افشيس",
        content: "",
      },
    ],
    gifted: [
      {
        title: "لحن اللي القربان كاملا",
        content: "",
      },
      {
        title: "التفسير الرابع والخامس والسادس من الرومي",
        content: "",
      },
      {
        title: "لحن افئين بي آرشي (ربعين فقط)",
        content: "",
      },
    ],
  },
  [STAGE_KEYS.UNIVERSITY]: {
    first: [
      {
        title: "التوزيع الكيهكي قبطيا كاملا + اللي كيه نين",
        content: "",
      },
      {
        title: "ابصالية آدام علي الهوس الثالث (تي شيب إهموت انتوتك) كاملة",
        content: "",
      },
      {
        title: "التفسير رقم 7 و8 و9 من المعقب",
        content: "",
      },
    ],
    second: [
      {
        title: "لحن آري هوؤ تشاسف",
        content: "",
      },
      {
        title: "التفسير رقم 7 و 8 و 9 من الرومي",
        content: "",
      },
      {
        title: "لحن أونوف إممو ماريا",
        content:
          '1- اسبسمس الآدام السنوي <span class="coptic-inline">Ⲟⲛⲟϥ ⲙ̀ⲙⲟ</span>\n\n† اسبسمس: كلمة معربة من <span class="coptic-inline">ⲡⲓⲁⲥⲡⲁⲥⲙⲟⲥ</span> اليونانية والتي تعني السلام أو الصلح، وربما سمي بهذا الاسم لأنه يرتل قبيل القبلة المقدسة، والأسبسمسات تنقسم إلى آدام وواطس حيث يختلفان في النغمة وليس حسب أيام الأسبوع كما هو متبع في التسبحة:\n\n1- نغمة تسمى اصطلاحاً (آدام) تصلى بعد صلاة الصلح على وزن <span class="coptic-inline">Ⲟⲛⲟϥ ⲙ̀ⲙⲟ Ⲙⲁⲣⲓⲁ</span> (افرحي يامريم)، بعد أن يصلي الشماس قائلاً: <span class="coptic-inline">ⲁⲥⲡⲁⲍⲉⲥⲑⲉ</span> يصلي الأسبسمس\n\nالآدام ثم يكمل الشماس قائلاً: <span class="coptic-inline">Ⲕⲉ Ⲕⲉ</span> ويرفع الكاهن الأبروسفارين، وبعدها مرد صلاة الصلح <span class="coptic-inline">Ϩⲓⲧⲉⲛ ⲛⲓⲡⲣⲉⲥⲃⲓⲁ</span> أما كلمة آدام <span class="coptic-inline">Ⲁⲇⲁⲙ</span> فهي كلمة عبرية تعني "إنسان" ويقابلها في اليونانية (أنثروبوس)، وفي العربية "آدم" فآدم الأول أي الإنسان الأول، وآدم الثاني هو الرب يسوع المسيح.\n\n- كلمة "آدام" هي الكلمة الأولى من ثيؤطوكية يوم الاثنين في تسبحة نصف الليل، وهي تشير إلى مجموعة مميزة من الألحان تصلى إما على مدار الأسبوع كما في الذكصولوجيات (ذكصولوجية باكر آدام) والتي تصلى في نهاية صلاة باكر كل يوم قبل رفع البخور، أو الاسبسمس الآدام في القداس الإلهي لكافة المناسبات الكنسية، أو في أيام الأحد والاثنين والثلاثاء فقط من كل أسبوع للإبصاليات، والثيؤطوكيات، والالباش التي تصلى في هذه الأيام المذكورة في التسبحة اليومية.\n\n2- نغمة أخرى تسمى (واطس) تصلى قبل صلاة التقديس التي يصليها الكاهن <span class="coptic-inline">Ⲁⲅⲓⲟⲥ</span> وبدلاً من الأسبسمس الواطس المختصر <span class="coptic-inline">Ⲛⲓⲭⲉⲣⲟⲩⲃⲓⲙ</span>، وهو على وزن لحن <span class="coptic-inline">Ⲫϯ ⲛ̀ⲧⲉ ⲛⲓϫⲟⲙ</span> (أيها الرب إله القوات) وتتغير كلمات الأسبسمس بتغير المناسبة التي يصلى فيها ولكن يظل تركيبه كما ذكرنا، أما الأسبسمس الآدام هو الأسبسمس الآدام السنوي، ويتحدث اللحن عن مريم العذراء القديسة، لأنها ولدت الله الذي تسبحه الملائكة، فنشترك نحن أيضاً مع الملائكة: الشاروبيم والسيرافيم في تسبيحة الله قائلين: "قدوس قدوس قدوس أيها الرب ضابط الكل" ونطلب أن يحفظ لنا حياة أبينا المكرم البابا البطريرك، والمطران، والأسقف، ويوضح اللحن لنا عقيدة الثيؤطوكوس والشفاعة.',
      },
    ],
  },
  [STAGE_KEYS.SERVANTS]: {
    first: [
      {
        title:
          "لحن تين اوويه انثوك الكيهكي (ربعين بالطريقة الكبيرة + ربعين وسط + التكملة)",
        content: "",
      },
      {
        title:
          "ختام الثيؤطوكيات الواطس بالنغمة الكيهكي (أوبين تشويس إيسوس بخرستوس)",
        content: "",
      },
      {
        title: "لحن جي افسمارؤوت الكيهكي + اف امبشا غار (كاملا)",
        content: "",
      },
    ],
    second: [
      {
        title: "لحن تين ثينو الكبير",
        content: "",
      },
      {
        title: "التوزيع الكيهكي قبطيا كاملا + اللي كيه نين",
        content: "",
      },
      {
        title: "ذكصولوجية شهر كيهك الثانية (إيرى إبصول سيل انتى بارثينوس)",
        content: "",
      },
    ],
  },
  [STAGE_KEYS.WEDDING_OF_CANA]: {
    first: [
      {
        title: "لحن طاي شوري",
        content: "",
      },
      {
        title:
          "مقدمة الذكصولوجيات الكهيكي السريعة كاملة (خين بخرستوس + شيرى نى تين تى هو إرو + التكملة للنهاية + شيرى نى أوتى بارثينوس تى أورو إممى + تينتى هو آرى بين ميفئى)",
        content: "",
      },
      {
        title:
          "هيتنيات شهر كيهك كاملة (للملاك غبريال المبشر + يوحنا المعمدان نسيب عمانوئيل + زكريا الكاهن واليصابات + يواقيم وحنه)",
        content: "",
      },
      {
        title: "للتميز: ذكصولوجية شهر كيهك كي غار (كاملة)",
        content: "",
      },
    ],
    second: [],
  },
};

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
function getContent(stage: string, level: string): TextItem[] {
  const englishLevel = mapArabicToEnglishLevel(level);
  const stageData = textData[stage];
  return stageData?.[englishLevel] || [];
}

// --- المكون الرئيسي ---
export default function About() {
  const [stage, setStage] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [content, setContent] = useState<TextItem[]>([]);

  const levels = stage ? getLevelsForStage(stage) : [];

  const handleStageChange = (newStage: string) => {
    setStage(newStage);
    setLevel("");
    setContent([]);

    // إذا كانت المرحلة عرس قانا الجليل، عرض المحتوى مباشرة
    if (newStage === STAGE_KEYS.WEDDING_OF_CANA) {
      const weddingContent = getContent(newStage, "الأول");
      setContent(weddingContent);
      setLevel("الأول");
    }
  };

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    if (stage && newLevel) {
      setContent(getContent(stage, newLevel));
    } else {
      setContent([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
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
                  <div className="text-5xl mb-4">📖</div>
                  <p className="text-gray-400">لا يوجد محتوى لهذه المرحلة</p>
                </div>
              ) : (
                content.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl hover:scale-105 transition-all"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-blue-400 mb-4">
                        {item.title}
                      </h3>
                      {item.content && (
                        <p
                          className="text-gray-300 leading-relaxed whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
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
    {
      name: "description",
      content: "موقع متخصص في تعليم الألحان القبطية للطلاب في مختلف المراحل",
    },
  ];
}
