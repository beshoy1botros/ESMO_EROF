import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const textData = {
  thirdFourth: {
    first: [
      {
        title: "ذوكصولوجية الاباء الرسل (كيريوس)",
        content: "محتوى الدرس الأول - الصف الثالث",
      },
      {
        title: "مرد امين امين طون ثاناطون",
        content: "محتوى الدرس الثاني - الصف الثالث",
      },
      {
        title: "مرد انجيل عشية في صوم العذراء (آ اوميش ان اسهيمي)",
        content: "محتوى الدرس الثالث - الصف الثالث",
      },
      {
        title: "لحن التمجيد (اك اسماروؤت)",
        content: "محتوى الدرس الرابع - الصف الثالث",
      },
    ],
    second: [
      {
        title: "طاي شوري السنوي",
        content: "محتوى الدرس الأول - الصف الرابع",
      },
      {
        title: "ذكصولوجية العذراء في تسبحة نصف الليل",
        content: "محتوى الدرس الثاني - الصف الرابع",
      },
      {
        title: "مرد الابركسيس لصوم الاباء الرسل (شيريه ناتشويس)",
        content: "محتوى الدرس الثالث - الصف الرابع",
      },
      {
        title: "مرد (اوس بيرين) للقداس الغريغوري بالختام المطول",
        content: "محتوى الدرس الرابع - الصف الرابع",
      },
    ],
    gifted: [
      {
        title: "قطعة التمجيد (شاشف انسوب)",
        content: "محتوى الدرس الأول - المستوى الموهوبين",
      },
      {
        title: "لحن افشوليم لتسبحة الاحد",
        content: "محتوى الدرس الثاني - المستوى الموهوبين",
      },
      {
        title:
          "لحن بي ابنفما المقدمة فقط +المحير(الربع الاول والثاني الي خين هان ميش ان لاس)",
        content: "محتوى الدرس الثالث - المستوى الموهوبين",
      },
    ],
  },
  fifthSixth: {
    first: [
      {
        title: "مرد فول ايفول للقداس الغريغوري",
        content: "محتوى الدرس الأول - الصف الخامس",
      },
      {
        title: "مرد الابركسيس لصوم الاباء الرسل (شيريه ناتشويس)",
        content: "محتوى الدرس الثاني - الصف الخامس",
      },
      {
        title: "لحن البركة (بدون البرلكس)",
        content: "محتوى الدرس الثالث - الصف الخامس",
      },
      {
        title: "ذوكصولوجية الاباء الرسل (كيريوس)",
        content: "محتوى الدرس الرابع - الصف الخامس",
      },
    ],
    second: [
      {
        title: "ذكصولوجية العذراء في تسبحة نصف الليل",
        content: "محتوى الدرس الأول - الصف السادس",
      },
      {
        title: "المزمور السنوي المختصر (او اويني افشاي)",
        content: "محتوى الدرس الثاني - الصف السادس",
      },
      {
        title: "طاي شوري السنوي",
        content: "محتوى الدرس الثالث - الصف السادس",
      },
      {
        title:
          "لبش الهوس الثاني (اول ربعين باللحن+التكملة دمج+اخر 4 ارباع باللحن)",
        content: "محتوى الدرس الرابع - الصف السادس",
      },
    ],
    gifted: [
      {
        title: "لحن اطاي بارثينوس كاملا",
        content: "محتوى الدرس الأول - المستوى الموهوبين",
      },
      {
        title: "اوشية القرابين الكبيرة",
        content: "محتوى الدرس الثاني - المستوى الموهوبين",
      },
      {
        title: "اسبسمس الادام(افرحي يا مريم )عربي كاملا",
        content: "محتوى الدرس الثالث - المستوى الموهوبين",
      },
    ],
  },
  middle: {
    first: [
      {
        title: "ابصالية الاحد(ايكوتي) كاملة",
        content: "محتوى الدرس الأول - الإعدادي الأول",
      },
      {
        title:
          "قطعة توزيع عيد العنصرة وصوم الاباء الرسل (اسومين) كاملا يوناني+قبطي+عربي",
        content: "محتوى الدرس الثاني - الإعدادي الأول",
      },
      {
        title: "المزمور السنوي المختصر",
        content: "محتوى الدرس الثالث - الإعدادي الأول",
      },
      {
        title: "اسبسمس الادام (اونوف اممو ماريا) قبطي كاملا",
        content: "محتوى الدرس الرابع - الإعدادي الأول",
      },
    ],
    second: [
      {
        title:
          "لحن اوندوس(المقدمة+ابوخروؤ+اري ابريسفيفين+طوبه ام ابتشويس للرسل)",
        content: "محتوى الدرس الأول - الإعدادي الثاني",
      },
      {
        title: "ابصالية الثلاثة فتية(اربصالين)",
        content: "محتوى الدرس الثاني - الإعدادي الثاني",
      },
      {
        title: "اسبسمس ادام عربي للرسل(اباؤنا الرسل)",
        content: "محتوى الدرس الثالث - الإعدادي الثاني",
      },
      {
        title: "طواف عشية + طواف باكر السنوي",
        content: "محتوى الدرس الرابع - الإعدادي الثاني",
      },
    ],
    gifted: [
      {
        title: "ني اثنوس تيرو كاملا",
        content: "محتوى الدرس الأول - المستوى الموهوبين",
      },
      {
        title: "لحن الفضائل الاثني عشر قبطي (تي ميتي اسنوتي)",
        content: "محتوى الدرس الثاني - المستوى الموهوبين",
      },
    ],
  },
  high: {
    first: [
      {
        title: "الهوس الاول كاملا",
        content: "محتوى الدرس الأول - الثانوي الأول",
      },
      {
        title: "اطاي بارثينوس كاملا",
        content: "محتوى الدرس الثاني - الثانوي الأول",
      },
      {
        title: "اسبسمس واطس للعذراء(ماريا تي تشرومبي)",
        content: "محتوى الدرس الثالث - الثانوي الأول",
      },
      {
        title: "مرد الابركسيس لعيد النيروز + الختام بالطريقة المطولة",
        content: "محتوى الدرس الرابع - الثانوي الأول",
      },
    ],
    second: [
      {
        title: "تين اويه انسوك السنوي",
        content: "محتوى الدرس الأول - الثانوي الثاني",
      },
      {
        title: "محير(افناف امبي اسمو) للعذراء",
        content: "محتوى الدرس الثاني - الثانوي الثاني",
      },
      {
        title: "ذوكصولوجية باكر",
        content: "محتوى الدرس الثالث - الثانوي الثاني",
      },
      {
        title: "اوندوس",
        content: "محتوى الدرس الرابع - الثانوي الثاني",
      },
    ],
    gifted: [
      {
        title: "اسبازيستي الكبير",
        content: "محتوى الدرس الأول - المستوى الموهوبين",
      },
      {
        title: "مزمور عشية (جي افساجي)",
        content: "محتوى الدرس الثاني - المستوى الموهوبين",
      },
    ],
  },
  university: {
    first: [
      {
        title: "اوندوس",
        content: "محتوى الدرس الأول - المستوى الأول",
      },
      {
        title: "اطاي بارثينوس كاملا",
        content: "محتوى الدرس الثاني - المستوى الأول",
      },
      {
        title: "لحن افشوليم + ايفول هيتين الصغير",
        content: "محتوى الدرس الثالث - المستوى الأول",
      },
      {
        title: "محير التمجيد(فاي بي ابليمين)",
        content: "محتوى الدرس الرابع - المستوى الأول",
      },
    ],
    second: [
      {
        title: "الهوس الرابع كاملا",
        content: "محتوى الدرس الأول - المستوى الثاني",
      },
      {
        title: "التوزيع الفرايحي الكبير لعيد النيروز قبطيا كاملا",
        content: "محتوى الدرس الثاني - المستوى الثاني",
      },
      {
        title: "لحن افئين بي ارشي",
        content: "محتوى الدرس الثالث - المستوى الثاني",
      },
      {
        title: "لحن فاني تينه (للملاك ميخائيل)",
        content: "محتوى الدرس الرابع - المستوى الثاني",
      },
    ],
  },
  servants: {
    first: [
      {
        title:
          "لحن بي إنفما كامل + المجمع (الربع الأول والثاني في خين هان ميش إن لاس)",
        content: "محتوى الدرس الأول - خدام وخادمات (الأول)",
      },
      {
        title:
          "لحن تين ثينو الكبير كامل + التكملة حتى النهاية الأرباع (إبشويس إك إيسه أوراون إتنا إيسوتو أووه)",
        content: "محتوى الدرس الثاني - خدام وخادمات (الأول)",
      },
      {
        title: "لحن إسبازيسي الكبير كامل",
        content: "محتوى الدرس الثالث - خدام وخادمات (الأول)",
      },
    ],
    second: [
      {
        title: "لحن أفئين بي أرشي",
        content: "محتوى الدرس الأول - خدام وخادمات (الثاني)",
      },
      {
        title: "إبصالية آدم لصوم الآباء الرسل (أويك إيبشويس) كاملة",
        content: "محتوى الدرس الثاني - خدام وخادمات (الثاني)",
      },
      {
        title:
          "لحن أوندوس (المقدمة + أبو إخراوؤو شينيف + آري إبؤسفيقين + طوبه إيبشويس للرسل)",
        content: "محتوى الدرس الثالث - خدام وخادمات (الثاني)",
      },
      {
        title: "لحن سينا نشو للتمجيد",
        content: "محتوى الدرس الرابع - خدام وخادمات (الثاني)",
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

export default function AboutPage() {
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
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden">
      {/* خلفية ديناميكية لصفحة الطقس */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-br from-amber-900 via-yellow-700 to-yellow-400 opacity-80"
        style={{
          background:
            "linear-gradient(120deg,rgb(34, 15, 120) 0%,rgb(105, 16, 120) 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 40,
            width: 180,
            height: 180,
            background: "rgba(50, 71, 192, 0.27)",
            borderRadius: "50%",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 60,
            width: 140,
            height: 140,
            background: "rgba(0, 246, 111, 0.1)",
            borderRadius: "50%",
          }}
        ></div>
      </div>
      <div className="relative z-10 min-h-screen bg-gray-900/70 text-white flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label htmlFor="stage" className="block mb-3 text-lg font-medium">
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
                <label htmlFor="level" className="block mb-3 text-lg font-medium">
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
                  <p className="text-gray-400">لا يوجد طقس لهذه المرحلة</p>
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
                    {/* تم إزالة حالة "مكتمل" من البيانات، لذلك نعرض فقط حالة افتراضية */}
                    <div className="flex justify-between items-center">
                      <span
                        className="px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400"
                      >
                        قيد التنفيذ
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
