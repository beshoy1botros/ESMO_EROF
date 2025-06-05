import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const textData = {
  thirdFourth: {
    first: [
      {
        title: "ذكصولوجية الآباء الرسل (كيريوس)",
        content: `ذكصولوجية: كلمة يونانية معناها: تمجيد للبركة.

والذكصولوجيات هي قطع تقال في التسبحة بعد مجمع القديسين، وتقال في رفع بخور عشية وباكر بعد صلاة الشكر، وتقال بخمس طرق على مدار السنة وهي: (سنوي – فرايحي – صيامي – شعانيني – كيهكي). والذكصولوجيات عبارة عن تمجيدات للعذراء مريم والدة الإله، والملائكة، والرسل، والشهداء، والقديسين.

تقال ذكصولوجية الآباء الرسل بعد ذكصولوجية القديس يوحنا المعمدان وقبل ذكصولوجية القديس مار مرقس.`,
      },
      {
        title: "مرد امين امين طون ثاناطون",
        content:
          "يقال في ختام الرشومات أثناء تحول الخبز والخمر إلى جسد ودم والذي يعرف بسر الإفخارستيا ، أو سر التناول والذي أسسه السيد المسيح.",
      },
      {
        title: "مرد انجيل عشية في صوم العذراء (آ اوميش ان اسهيمي)",
        content:
          "يقال في صوم السيدة العذراء مريم وأعيادها في رفع بخور عشية بعد الإنجيل.",
      },
      {
        title: "لحن التمجيد (اك اسماروؤت)",
        content:
          "لحن إك إسماروؤت الذي يصلى في بدء التمجيد وفي القداس الالهي في التوزيع قبل لحن بي أويك وبعد المزمور ال ١٥٠ ويصلى أيضاً في إستقبال البابا البطريرك والمطران والاسقف.",
      },
    ],
    second: [
      {
        title: "طاي شوري السنوي",
        content:
          "يقال في القداس بعد تحليل الخدام في أيام السبوت والآحاد (ما عدا سبوت وآحاد الصوم الكبير) وفي الأعياد السيدية والخمسين وكل أيام الإفطار.",
      },
      {
        title: "ذكصولوجية العذراء في تسبحة نصف الليل",
        content: "تقال في تسبحة نصف الليل بعد مجمع القديسين وقبل الهوس الرابع.",
      },
      {
        title: "مرد الابركسيس لصوم الاباء الرسل (شيريه ناتشويس)",
        content: "يقال في صوم الاباء الرسل بعد الكاثوليكون وقبل الابركسيس.",
      },
      {
        title: "مرد (اوس بيرين) للقداس الغريغوري بالختام المطول",
        content: "يقال في القداس الغرغوري بعد قطعة(انثوك غار).",
      },
    ],
    gifted: [
      {
        title: "قطعة التمجيد (شاشف انسوب)",
        content:
          "تقال في تسبحة نصف الليل يوم الأحد وهي عبارة عن القطة الثامنة من ثيؤطوكية الأحد./ تقال ايضا في تمجيدالسيدة العذراء مريم بعد قطعة (اوكيريوس ميه طاسو ) وقبل قطعة (ذيفتيه بينتيس).",
      },
      {
        title: "لحن افشوليم لتسبحة الاحد",
        content:
          "يقال في تسبحة نصف الليل يوم الأحد وهو عبارة عن الربعين 15 ,16 من القطعة الخامسة عشر من ثيؤطوكية الأحد",
      },
      {
        title:
          "لحن بي ابنفما المقدمة فقط +المحير(الربع الاول والثاني الي خين هان ميش ان لاس)",
        content:
          "يقال في عيد حلول الروح القدس(العنصرة) بعد قطع الساعة الثالثة./ يقال ايضا في الاكاليل او الافراح.",
      },
    ],
  },
  fifthSixth: {
    first: [
      {
        title: "مرد فول ايفول للقداس الغريغوري",
        content: "",
      },
      {
        title: "مرد الابركسيس لصوم الاباء الرسل (شيريه ناتشويس)",
        content: "",
      },
      {
        title: "لحن البركة (بدون البرلكس)",
        content: "",
      },
      {
        title: "ذكصولوجية الاباء الرسل (كيريوس)",
        content: "",
      },
    ],
    second: [
      {
        title: "ذكصولوجية العذراء في تسبحة نصف الليل",
        content: "",
      },
      {
        title: "المزمور السنوي المختصر (او اويني افشاي)",
        content: "",
      },
      {
        title: "طاي شوري السنوي",
        content: "",
      },
      {
        title:
          "لبش الهوس الثاني (اول ربعين باللحن+التكملة دمج+اخر 4 ارباع باللحن)",
        content: "",
      },
    ],
    gifted: [
      {
        title: "لحن اطاي بارثينوس كاملا",
        content: "",
      },
      {
        title: "اوشية القرابين الكبيرة",
        content: "",
      },
      {
        title: "اسبسمس الادام(افرحي يا مريم )عربي كاملا",
        content: "",
      },
    ],
  },
  middle: {
    first: [
      {
        title: "ابصالية الاحد(ايكوتي) كاملة",
        content: "",
      },
      {
        title:
          "قطعة توزيع عيد العنصرة وصوم الاباء الرسل (اسومين) كاملا يوناني+قبطي+عربي",
        content: "",
      },
      {
        title: "المزمور السنوي المختصر",
        content: "",
      },
      {
        title: "اسبسمس الادام (اونوف اممو ماريا) قبطي كاملا",
        content: "",
      },
    ],
    second: [
      {
        title:
          "لحن اوندوس(المقدمة+ابوخروؤ+اري ابريسفيفين+طوبه ام ابتشويس للرسل)",
        content: "",
      },
      {
        title: "ابصالية الثلاثة فتية(اربصالين)",
        content: "",
      },
      {
        title: "اسبسمس ادام عربي للرسل(اباؤنا الرسل)",
        content: "",
      },
      {
        title: "طواف عشية + طواف باكر السنوي",
        content: "",
      },
    ],
    gifted: [
      {
        title: "ني اثنوس تيرو كاملا",
        content: "",
      },
      {
        title: "لحن الفضائل الاثني عشر قبطي (تي ميتي اسنوتي)",
        content: "",
      },
    ],
  },
  high: {
    first: [
      {
        title: "الهوس الاول كاملا",
        content: "",
      },
      {
        title: "اطاي بارثينوس كاملا",
        content: "",
      },
      {
        title: "اسبسمس واطس للعذراء(ماريا تي تشرومبي)",
        content: "",
      },
      {
        title: "مرد الابركسيس لعيد النيروز + الختام بالطريقة المطولة",
        content: "",
      },
    ],
    second: [
      {
        title: "تين اويه انسوك السنوي",
        content: "",
      },
      {
        title: "محير(افناف امبي اسمو) للعذراء",
        content: "",
      },
      {
        title: "ذكصولوجية باكر",
        content: "",
      },
      {
        title: "اوندوس",
        content: "",
      },
    ],
    gifted: [
      {
        title: "اسبازيستي الكبير",
        content: "",
      },
      {
        title: "مزمور عشية (جي افساجي)",
        content: "",
      },
    ],
  },
  university: {
    first: [
      {
        title: "اوندوس",
        content: "",
      },
      {
        title: "اطاي بارثينوس كاملا",
        content: "",
      },
      {
        title: "لحن افشوليم + ايفول هيتين الصغير",
        content: "",
      },
      {
        title: "محير التمجيد(فاي بي ابليمين)",
        content: "",
      },
    ],
    second: [
      {
        title: "الهوس الرابع كاملا",
        content: "",
      },
      {
        title: "التوزيع الفرايحي الكبير لعيد النيروز قبطيا كاملا",
        content: "",
      },
      {
        title: "لحن افئين بي ارشي",
        content: "",
      },
      {
        title: "لحن فاني تينه (للملاك ميخائيل)",
        content: "",
      },
    ],
  },
  servants: {
    first: [
      {
        title:
          "لحن بي إنفما كامل + المجمع (الربع الأول والثاني في خين هان ميش إن لاس)",
        content: "",
      },
      {
        title:
          "لحن تين ثينو الكبير كامل + التكملة حتى النهاية الأرباع (إبشويس إك إيسه أوراون إتنا إيسوتو أووه)",
        content: "",
      },
      {
        title: "لحن إسبازيسي الكبير كامل",
        content: "",
      },
    ],
    second: [
      {
        title: "لحن أفئين بي أرشي",
        content: "",
      },
      {
        title: "إبصالية آدم لصوم الآباء الرسل (أويك إيبشويس) كاملة",
        content: "",
      },
      {
        title:
          "لحن أوندوس (المقدمة + أبو إخراوؤو شينيف + آري إبؤسفيقين + طوبه إيبشويس للرسل)",
        content: "",
      },
      {
        title: "لحن سينا نشو للتمجيد",
        content: "",
      },
    ],
  },
};

const levelMap: Record<string, string> = {
  الأول: "first",
  الثاني: "second",
  الموهوبين: "gifted",
};

function mapArabicToEnglishLevel(arabicLevel: string) {
  return levelMap[arabicLevel] || arabicLevel.toLowerCase();
}

function getContent(stage: string, level: string) {
  const englishLevel = mapArabicToEnglishLevel(level);
  // @ts-ignore
  return textData[stage]?.[englishLevel] || [];
}

export default function About() {
  const [stage, setStage] = useState("");
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    if (
      [
        "kindergarten",
        "firstSecond",
        "thirdFourth",
        "fifthSixth",
        "middle",
        "high",
      ].includes(stage)
    ) {
      setLevels(["الأول", "الثاني", "الموهوبين"]);
    } else if (["university", "servants"].includes(stage)) {
      setLevels(["الأول", "الثاني"]);
    } else {
      setLevels([]);
    }
    setLevel("");
    setContent([]);
  }, [stage]);

  useEffect(() => {
    if (stage && level) {
      setContent(getContent(stage, level));
    } else {
      setContent([]);
    }
  }, [stage, level]);

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col font-sans relative overflow-hidden"
    >
      {/* الخلفية بالصورة taks.jpg */}
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/taks.jpg')",
        }}
      >
        {/* طبقة التعتيم */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        {/* المحتوى فوق الطبقة */}
        <div className="relative z-10 flex flex-col min-h-full bg-gray-900/0 text-white">
          <Header />

          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label
                    htmlFor="stage"
                    className="block mb-3 text-lg font-medium"
                  >
                    المرحلة:
                  </label>
                  <select
                    id="stage"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white border border-blue-500 rounded-lg cursor-pointer transition-all hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">اختر المرحلة</option>
                    <option value="kindergarten">حضانة</option>
                    <option value="firstSecond">أولي و تانية</option>
                    <option value="thirdFourth">ثالثة و رابعة</option>
                    <option value="fifthSixth">خامسة و سادسة</option>
                    <option value="middle">اعدادي</option>
                    <option value="high">ثانوي</option>
                    <option value="university">جامعة</option>
                    <option value="servants">خدام و خادمات</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="level"
                    className="block mb-3 text-lg font-medium"
                  >
                    المستوى:
                  </label>
                  <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white border border-blue-500 rounded-lg cursor-pointer transition-all hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    disabled={levels.length === 0}
                  >
                    <option value="">اختر المستوى</option>
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
                {content.length === 0 && stage && level ? (
                  <div className="col-span-full text-center p-8 bg-gray-700 rounded-lg border border-blue-500">
                    <p className="text-gray-400">لا يوجد محتوى لهذه المرحلة</p>
                  </div>
                ) : (
                  content.map((item) => (
                    <div
                      key={item.title}
                      className="bg-gray-800 p-6 rounded-lg border border-blue-500 transition-all hover:border-blue-400"
                    >
                      <h3 className="text-xl font-semibold text-blue-500 mb-4">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 mb-4">{item.content}</p>
                      <div className="flex justify-between items-center"></div>
                    </div>
                  ))
                )}
              </div>
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
