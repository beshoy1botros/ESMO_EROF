import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const videoData = {
  kindergarten: {
    first: [
      {
        id: "dQw4w9WgXcQ",
        title: "سوتيس امين دمج",
        url: "https://www.youtube.com/watch?v=jFO2dlI7yyU",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "مرد مزمور عشية وباكر وقداس عيد النيروز",
        url: "https://www.youtube.com/watch?v=SOXEIj43DVg",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "ختام الصلوات الاجتماعية(المياة والاهوية)", //record
        url: "",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "هيتين القداس للعذراء+الاباء الرسل", //record
        url: "",
      },
    ],
    second: [
      {
        id: "dQw4w9WgXcQ",
        title: "ذكصولوجية العذراء عشية (ايريه ابصول سيل)",
        url: "https://www.youtube.com/watch?v=s9dP-j8u7u0",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "مرد المجمع الباسيلي (ايريه بو اسمو)",
        url: "https://www.youtube.com/watch?v=oa3dTfPzRNU",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "المزمور 150 الهوس الرابع بالطريقة السنوي",
        url: "https://www.youtube.com/watch?v=YWqBsxHXIgw",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "مرد انجيل القداس السنوي أوأونياتو",
        url: "https://www.youtube.com/watch?v=zMG1DkU-zng",
      },
    ],
    gifted: [
      {
        id: "dQw4w9WgXcQ",
        title: "تي شوري السنوي",
        url: "https://www.youtube.com/watch?v=ivRDyjwad3I",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "لحن البركة (بدون البرلكس)",
        url: "https://www.youtube.com/watch?v=iOJbe7u5CQQ",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "لحن خين افران (التمجيد)",
        url: "https://www.youtube.com/watch?v=cVjvecHRWkc",
      },
    ],
  },
  firstSecond: {
    first: [
      {
        id: "fs1-1",
        title: "الليلويا فاي بيه بي",
        url: "https://www.youtube.com/watch?v=YDG5SlbM-7M",
      },
      {
        id: "fs1-2",
        title: "مرد انجيل عيد النيروز",
        url: "https://www.youtube.com/watch?v=NnvMalZCeVA",
      },
      {
        id: "fs1-3",
        title: "ذوكصولوجية العذراء رفع بخور باكر",
        url: "https://www.youtube.com/watch?v=vjB7gY_wgtw",
      },
      {
        id: "fs1-4",
        title: "طلبة افنوتي ناي نان تسبحة نصف الليل",
        url: "https://www.youtube.com/watch?v=hXS3O8hkEKQ",
      },
    ],
    second: [
      {
        id: "fs2-1",
        title: "تي شوري السنوي",
        url: "https://www.youtube.com/watch?v=ivRDyjwad3I",
      },
      {
        id: "fs2-2",
        title: "ذوكصولوجية الاباء الرسل (كيريوس)",
        url: "https://www.youtube.com/watch?v=97QDmOgr2Zk",
      },
      {
        id: "fs2-3",
        title: "مرد (اوس بيرين) للقداس الباسيلي",
        url: "https://www.youtube.com/watch?v=UcBqXdocQsA",
      },
      {
        id: "fs2-4",
        title: "المزمور 149 الهوس الرابع",
        url: "", //record
      },
    ],
    gifted: [
      {
        id: "fsg-1",
        title:
          "لبش الهوس الاول خين اوشوت (اول ربعين باللحن+التكملة دمج+اخر 3 ارباع بالطريقة المطولة)",
        url: "https://www.youtube.com/watch?v=l7i80RIFCvw",
      },
      {
        id: "fsg-2",
        title: "مرد الابركسيس لصوم الاباء الرسل",
        url: "https://www.youtube.com/watch?v=o7Sa2sUkubk",
      },
    ],
  },
  thirdFourth: {
    first: [
      {
        id: "tf1-1",
        title: "ذوكصولوجية الاباء الرسل (كيريوس)",
        url: "https://www.youtube.com/watch?v=97QDmOgr2Zk",
      },
      {
        id: "tf1-2",
        title: "مرد امين امين طون ثاناطون",
        url: "https://www.youtube.com/watch?v=qLL5KcO1J3E",
      },
      {
        id: "tf1-3",
        title: "مرد انجيل عشية في صوم العذراء (آ اوميش ان اسهيمي)",
        url: "https://www.youtube.com/watch?v=84hnj4ZiQok",
      },
      {
        id: "tf1-4",
        title: "لحن التمجيد (اك اسماروؤت)",
        url: "https://www.youtube.com/watch?v=DGOl4Zjokog",
      },
    ],
    second: [
      {
        id: "tf2-1",
        title: "طاي شوري السنوي",
        url: "https://www.youtube.com/watch?v=YfWZRCkSNAs",
      },
      {
        id: "tf2-2",
        title: "ذكصولوجية العذراء في تسبحة نصف الليل",
        url: "https://www.youtube.com/watch?v=wM5ZBs3UD24",
      },
      {
        id: "tf2-3",
        title: "مرد الابركسيس لصوم الاباء الرسل (شيريه ناتشويس)",
        url: "https://www.youtube.com/watch?v=o7Sa2sUkubk",
      },
      {
        id: "tf2-4",
        title: "مرد (اوس بيرين) للقداس الغريغوري بالختام المطول",
        url: "https://www.youtube.com/watch?v=RSRSnMToKyw",
      },
    ],
    gifted: [
      {
        id: "tfg-1",
        title: "قطعة التمجيد (شاشف انسوب)",
        url: "https://www.youtube.com/watch?v=026lSE63o5I",
      },
      {
        id: "tfg-2",
        title: "لحن افشوليم لتسبحة الاحد",
        url: "https://www.youtube.com/watch?v=1ZoU2sMHuSI",
      },
      {
        id: "tfg-3",
        title:
          "لحن بي ابنفما المقدمة فقط +المحير(الربع الاول والثاني الي خين هان ميش ان لاس)", //record
        url: "",
      },
    ],
  },
  fifthSixth: {
    first: [
      {
        id: "fs1-1",
        title: "مرد فول ايفول للقداس الغريغوري",
        url: "https://www.youtube.com/watch?v=XZS-fw3Q8sE",
      },
      {
        id: "fs1-2",
        title: "مرد الابركسيس لصوم الاباء الرسل (شيريه ناتشويس)",
        url: "https://www.youtube.com/watch?v=o7Sa2sUkubk",
      },
      {
        id: "fs1-3",
        title: "لحن البركة (بدون البرلكس)",
        url: "https://www.youtube.com/watch?v=iOJbe7u5CQQ",
      },
      {
        id: "fs1-4",
        title: "ذوكصولوجية الاباء الرسل (كيريوس)",
        url: "https://www.youtube.com/watch?v=97QDmOgr2Zk",
      },
    ],
    second: [
      {
        id: "fs2-1",
        title: "ذكصولوجية العذراء في تسبحة نصف الليل",
        url: "https://www.youtube.com/watch?v=wM5ZBs3UD24",
      },
      {
        id: "fs2-2",
        title: "المزمور السنوي المختصر (او اويني افشاي)",
        url: "https://www.youtube.com/watch?v=3ZkBM6BcVi4",
      },
      {
        id: "fs2-3",
        title: "طاي شوري السنوي",
        url: "https://www.youtube.com/watch?v=YfWZRCkSNAs",
      },
      {
        id: "fs2-4",
        title:
          "لبش الهوس الثاني (اول ربعين باللحن+التكملة دمج+اخر 4 ارباع باللحن)",
        url: "https://www.youtube.com/watch?v=WqIpQWq057Y",
      },
    ],
    gifted: [
      {
        id: "fsg-1",
        title: "لحن اطاي بارثينوس كاملا",
        url: "https://www.youtube.com/watch?v=o_D149fkt6U",
      },
      {
        id: "fsg-2",
        title: "اوشية القرابين الكبيرة",
        url: "https://www.youtube.com/watch?v=XJbfHWUmNZo&list=PLYlhTsAnmNqXkcZHvWAOj93c_weL5HLom&index=5",
      },
      {
        id: "fsg-3",
        title: "اسبسمس الادام(افرحي يا مريم )عربي كاملا",
        url: "https://www.youtube.com/watch?v=VfRPnqm-vVw",
      },
    ],
  },
  middle: {
    first: [
      {
        id: "m1-1",
        title: "ابصالية الاحد(ايكوتي) كاملة",
        url: "https://www.youtube.com/watch?v=k4yPu3lYhe8",
      },
      {
        id: "m1-2",
        title:
          "قطعة توزيع عيد العنصرة وصوم الاباء الرسل (اسومين) كاملا يوناني+قبطي+عربي",
        url: "https://www.youtube.com/watch?v=dvRM2sayfJQ",
      },
      {
        id: "m1-3",
        title: "المزمور السنوي المختصر",
        url: "https://www.youtube.com/watch?v=3ZkBM6BcVi4",
      },
      {
        id: "m1-4",
        title: "اسبسمس الادام (اونوف اممو ماريا) قبطي كاملا",
        url: "https://www.youtube.com/watch?v=eAXJkkNnCUQ",
      },
    ],
    second: [
      {
        id: "m2-1",
        title:
          "لحن اوندوس(المقدمة+ابوخروؤ+اري ابريسفيفين+طوبه ام ابتشويس للرسل)",
        url: "https://www.youtube.com/watch?v=cTsZOCs9g2M",
      },
      {
        id: "m2-2",
        title: "ابصالية الثلاثة فتية(اربصالين)",
        url: "https://www.youtube.com/watch?v=PE-ZQlXZz9c",
      },
      {
        id: "m2-3",
        title: "اسبسمس ادام عربي للرسل(اباؤنا الرسل)",
        url: "", //record
      },
      {
        id: "m2-4",
        title: "طواف عشية + طواف باكر السنوي",
        url: "https://www.youtube.com/watch?v=ps65gYhlWx0",
      },
    ],
    gifted: [
      {
        id: "mg-1",
        title: "ني اثنوس تيرو كاملا",
        url: "https://www.youtube.com/watch?v=0Lt8B-Qbdz8",
      },
      {
        id: "mg-2",
        title: "لحن الفضائل الاثني عشر قبطي (تي ميتي اسنوتي)",
        url: "https://www.youtube.com/watch?v=FiYEsxAizQE",
      },
    ],
  },
  high: {
    first: [
      {
        id: "h1-1",
        title: "الهوس الاول كاملا",
        url: "https://www.youtube.com/watch?v=0u0nY31iXqE",
      },
      {
        id: "h1-2",
        title: "اطاي بارثينوس كاملا",
        url: "https://www.youtube.com/watch?v=o_D149fkt6U",
      },
      {
        id: "h1-3",
        title: "اسبسمس واطس للعذراء(ماريا تي تشرومبي)",
        url: "https://www.youtube.com/watch?v=BVVB4o0gqN0",
      },
      {
        id: "h1-4",
        title: "مرد الابركسيس لعيد النيروز + الختام بالطريقة المطولة",
        url: "https://www.youtube.com/watch?v=bzacrRVhRBE",
      },
    ],
    second: [
      {
        id: "h2-1",
        title: "تين اويه انسوك السنوي",
        url: "https://www.youtube.com/watch?v=ZM1CHrsAKZc",
      },
      {
        id: "h2-2",
        title: "محير(افناف امبي اسمو) للعذراء",
        url: "https://www.youtube.com/watch?v=563yhpV8INI",
      },
      {
        id: "h2-3",
        title: "ذوكصولوجية باكر",
        url: "https://www.youtube.com/watch?v=tbreXiaMnmE",
      },
      {
        id: "h2-4",
        title: "اوندوس",
        url: "https://www.youtube.com/watch?v=cTsZOCs9g2M",
      },
    ],
    gifted: [
      {
        id: "hg-1",
        title: "اسبازيستي الكبير",
        url: "https://www.youtube.com/watch?v=Rd7vZzwsNI0",
      },
      {
        id: "hg-2",
        title: "مزمور عشية (جي افساجي)",
        url: "/لحن جي افساجي - للمُعلم ابراهيم عياد.mp4",
      },
    ],
  },
  university: {
    first: [
      {
        id: "u1-1",
        title: "اوندوس",
        url: "https://www.youtube.com/watch?v=cTsZOCs9g2M",
      },
      {
        id: "u1-2",
        title: "اطاي بارثينوس كاملا",
        url: "https://www.youtube.com/watch?v=o_D149fkt6U",
      },
      {
        id: "u1-3",
        title: "لحن افشوليم + ايفول هيتين الصغير",
        url: "https://www.youtube.com/watch?v=BRX1GxomF8Q",
      },
      {
        id: "u1-4",
        title: "محير التمجيد(فاي بي ابليمين)",
        url: "https://www.youtube.com/watch?v=pd_ye6N8uvY",
      },
    ],
    second: [
      {
        id: "u2-1",
        title: "الهوس الرابع كاملا",
        url: "https://www.youtube.com/watch?v=-KWuTNViajg",
      },
      {
        id: "u2-2",
        title: "التوزيع الفرايحي الكبير لعيد النيروز قبطيا كاملا",
        url: "https://www.youtube.com/watch?v=jGqnGDFcqzE",
      },
      {
        id: "u2-3",
        title: "لحن افئين بي ارشي",
        url: "https://www.youtube.com/watch?v=4uIjX-dff1w",
      },
      {
        id: "u2-4",
        title: "لحن فاني تينه (للملاك ميخائيل)",
        url: "https://www.youtube.com/watch?v=GJG83hPESJA",
      },
    ],
  },
  servants: {
    first: [
      {
        id: "s1-1",
        title:
          "لحن بي إنفما كامل + المجمع (الربع الأول والثاني في خين هان ميش إن لاس)",
        url: "https://www.youtube.com/watch?v=Wjz0lpFXnZo",
      },
      {
        id: "s1-2",
        title:
          "لحن تين ثينو الكبير كامل + التكملة حتى النهاية الأرباع (إبشويس إك إيسه أوراون إتنا إيسوتو أووه)",
        url: "https://www.youtube.com/watch?v=GfznTDsfuBE",
      },
      {
        id: "s1-3",
        title: "لحن إسبازيسي الكبير كامل",
        url: "https://www.youtube.com/watch?v=Rd7vZzwsNI0",
      },
    ],
    second: [
      {
        id: "s2-1",
        title: "لحن أفئين بي أرشي",
        url: "https://www.youtube.com/watch?v=4uIjX-dff1w",
      },
      {
        id: "s2-2",
        title: "إبصالية آدم لصوم الآباء الرسل (اي اوش أوفيك إيبشويس) كاملة",
        url: "https://www.youtube.com/watch?v=9M3X9uq8S6k",
      },
      {
        id: "s2-3",
        title:
          "لحن أوندوس (المقدمة + أبو إخراوؤو شينيف + آري إبؤسفيقين + طوبه إيبشويس للرسل)",
        url: "https://www.youtube.com/watch?v=cTsZOCs9g2M",
      },
      {
        id: "s2-4",
        title: "لحن سينا نشو للتمجيد",
        url: "https://www.youtube.com/watch?v=DkwSGXy_Jec",
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

function getVideos(stage: string, level: string) {
  const englishLevel = mapArabicToEnglishLevel(level);
  // @ts-ignore
  return videoData[stage]?.[englishLevel] || [];
}

function getYouTubeEmbedUrl(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

export default function MelodiesPage() {
  const [stage, setStage] = useState("");
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

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
    setVideos([]);
  }, [stage]);

  useEffect(() => {
    if (stage && level) {
      setVideos(getVideos(stage, level));
    } else {
      setVideos([]);
    }
  }, [stage, level]);

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden">
      {/* خلفية ديناميكية جديدة للألحان */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(120deg,rgb(8, 30, 86) 0%,rgb(6, 26, 73) 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 60,
            width: 200,
            height: 200,
            backgroundImage: "rgba(34,197,94,0.10)",
            borderRadius: "50%",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: 100,
            right: 80,
            width: 160,
            height: 160,
            background: "rgba(20,184,166,0.10)",
            borderRadius: "50%",
          }}
        ></div>
      </div>
      <div className="relative z-10 min-h-screen bg-gray-900/70 text-white flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
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
              {videos.length === 0 && stage && level ? (
                <div className="col-span-full text-center p-8 bg-gray-800 rounded-lg border border-blue-500">
                  <p className="text-gray-400">
                    لا يوجد فيديوهات متاحة لهذه المرحلة والمستوى
                  </p>
                </div>
              ) : (
                videos.map((video) => (
                  <div
                    key={video.title}
                    className="bg-gray-800 p-6 rounded-lg border border-blue-500 transition-all hover:border-blue-400"
                  >
                    <h3 className="text-xl font-semibold text-blue-500 mb-4">
                      {video.title}
                    </h3>
                    <div className="relative w-full pt-[56.25%] mb-4">
                      {video.url ? (
                        <iframe
                          src={getYouTubeEmbedUrl(video.url)}
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                          <p className="text-gray-400">لا يوجد فيديو متاح</p>
                        </div>
                      )}
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
