import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const videoData = {
  kindergarten: {
    first: [
      {
        id: "dQw4w9WgXcQ",
        title: "سوتيس امين دمج",
        url: "/الحان مهرجان الكرازة 2022 مرحلة الحضانة - المستوى الاول _ لحن سوتيس أمين دمجاً.mp4",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "مرد مزمور عشية وباكر وقداس عيد النيروز",
        url: "/مرد مزمور - عيد النيروز - للمعلم ابراهيم عياد.mp4",
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
        url: "/ذكصولوجية السيدة العذراء في رفع بخور عشية للايبيذياكون اسامه لطفي.mp4",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "مرد المجمع الباسيلي (ايريه بو اسمو)",
        url: "/الحان مهرجان الكرازة 2024 مرحلة الحضانة - المستوى الثاني _ مرد المجمع الباسيلي إيريه بو إسمو.mp4",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "المزمور 150 الهوس الرابع بالطريقة السنوي",
        url: "/الحان مهرجان الكرازة 2022 مرحلة 3 ، 4 ابتدائي - المستوى الثاني _ المزمور 150 من الهوس الرابع السنوي.mp4",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "مرد انجيل القداس السنوي أوأونياتو",
        url: "/الحان مهرجان الكرازة 2022 مرحلة الحضانة - المستوى الثاني _ مرد انجيل القداس السنوي أوأونياتو.mp4",
      },
    ],
    gifted: [
      {
        id: "dQw4w9WgXcQ",
        title: "تي شوري السنوي",
        url: "/لحن تى شورى السنوى_ قبطى كاملا بالهزات_للمعلم ابراهيم معوض.mp4",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "لحن البركة (بدون البرلكس)",
        url: "/لحن البركة تين اواوشت بالهزات _ مهرجان الكرازة المرقسية 2023 -مرحلة اعدادى.mp4",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "لحن خين افران (التمجيد)",
        url: "/لحن خين افران - بصوت المُعلم ابراهيم عياد.mp4",
      },
    ],
  },
  firstSecond: {
    first: [
      {
        id: "fs1-1",
        title: "الليلويا فاي بيه بي",
        url: "/لحن الليلويا فاى بيه بى بالقبطى بالهزات بصوت الايبذياكون اسامة لطفى.mp4",
      },
      {
        id: "fs1-2",
        title: "مرد انجيل عيد النيروز",
        url: "/مرد الانجيل لعيد النيروز للايبيذياكون اسامه لطفى.mp4",
      },
      {
        id: "fs1-3",
        title: "ذوكصولوجية العذراء رفع بخور باكر",
        url: "/ذكصولوجية السيدة العذراء في رفع بخور باكر للايبيذياكون اسامه لطفي.mp4",
      },
      {
        id: "fs1-4",
        title: "طلبة افنوتي ناي نان تسبحة نصف الليل",
        url: "/ختام التسبحة للمعلم ابراهيم عياد.mp4",
      },
    ],
    second: [
      {
        id: "fs2-1",
        title: "تي شوري السنوي",
        url: "/لحن تى شورى السنوى_ قبطى كاملا بالهزات_للمعلم ابراهيم معوض.mp4",
      },
      {
        id: "fs2-2",
        title: "ذوكصولوجية الاباء الرسل (كيريوس)",
        url: "/ذكصولوجية ثانية للاباء الرسل تقال في صوم الرسل - للمُعلم ابراهيم عياد.mp4",
      },
      {
        id: "fs2-3",
        title: "مرد (اوس بيرين للقداس الباسيلي) بدون امين المطولة",
        url: "/أوس بيرين للشماس مينا عبده.mp4",
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
        url: "/لحن لبش الهوس الاول ( خين اوشوت )مهرجان الكرازة ٢٠١٩ مرحلة اعدادي.mp4",
      },
      {
        id: "fsg-2",
        title: "مرد الابركسيس لصوم الاباء الرسل",
        url: "/مرد الابركسيس لصوم الاباء الرسل_ بالهزات_للمعلم ابراهيم معوض.mp4",
      },
    ],
  },
  thirdFourth: {
    first: [
      {
        id: "tf1-1",
        title: "ذوكصولوجية الاباء الرسل (كيريوس)",
        url: "/ذكصولوجية ثانية للاباء الرسل تقال في صوم الرسل - للمُعلم ابراهيم عياد.mp4",
      },
      {
        id: "tf1-2",
        title: "مرد امين امين طون ثاناطون",
        url: "/آمين آمين آمين طون ثاناطون للمعلم زاهر أندراوس.mp4",
      },
      {
        id: "tf1-3",
        title: "مرد انجيل عشية في صوم العذراء (آ اوميش ان اسهيمي)",
        url: "/مرد انجيل عشية صوم العذراء مريم - للمُعلم ابراهيم عياد.mp4",
      },
      {
        id: "tf1-4",
        title: "لحن التمجيد (اك اسماروؤت)",
        url: "/لحن إك إسماروؤت _ مبارك أنت بالحقيقة للتمجيد والتوزيع _ للمُعلم جاد لويس.mp4",
      },
    ],
    second: [
      {
        id: "tf2-1",
        title: "طاي شوري السنوي",
        url: "/لحن طاى شورى السنوى كاملا بالهزات_للمعلم ابراهيم معوض.mp4",
      },
      {
        id: "tf2-2",
        title: "ذكصولوجية العذراء في تسبحة نصف الليل",
        url: "/ذكصولوجية السيدة العذراء مريم نصف الليل المعلم زاهر اندراوس.mp4",
      },
      {
        id: "tf2-3",
        title: "مرد الابركسيس لصوم الاباء الرسل (شيريه ناتشويس)",
        url: "/مرد الابركسيس لصوم الاباء الرسل_ بالهزات_للمعلم ابراهيم معوض.mp4",
      },
      {
        id: "tf2-4",
        title: "مرد (اوس بيرين) للقداس الغريغوري بالختام المطول",
        url: "/مرد  اوس بيرين_للمعلم_جاد لويس.mp4",
      },
    ],
    gifted: [
      {
        id: "tfg-1",
        title: "قطعة التمجيد (شاشف انسوب)",
        url: "/قطعة شاشف انسوب للمعلم جاد لويز.mp4",
      },
      {
        id: "tfg-2",
        title: "لحن افشوليم لتسبحة الاحد",
        url: "/لحن افشوليم إيروف _ المعلم زاهر أندراوس.mp4",
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
        url: "/فول ايفول - المعلم جاد لويس.mp4",
      },
      {
        id: "fs1-2",
        title: "مرد الابركسيس لصوم الاباء الرسل (شيريه ناتشويس)",
        url: "/مرد الابركسيس لصوم الاباء الرسل_ بالهزات_للمعلم ابراهيم معوض.mp4",
      },
      {
        id: "fs1-3",
        title: "لحن البركة (بدون البرلكس)",
        url: "/لحن البركة تين اواوشت بالهزات _ مهرجان الكرازة المرقسية 2023 -مرحلة اعدادى.mp4",
      },
      {
        id: "fs1-4",
        title: "ذوكصولوجية الاباء الرسل (كيريوس)",
        url: "/ذكصولوجية ثانية للاباء الرسل تقال في صوم الرسل - للمُعلم ابراهيم عياد.mp4",
      },
    ],
    second: [
      {
        id: "fs2-1",
        title: "ذكصولوجية العذراء في تسبحة نصف الليل",
        url: "/ذكصولوجية السيدة العذراء مريم نصف الليل المعلم زاهر اندراوس.mp4",
      },
      {
        id: "fs2-2",
        title: "المزمور السنوي المختصر (او اويني افشاي)",
        url: "/المزمور السنوي المختصر او اويني افشاي.mp4",
      },
      {
        id: "fs2-3",
        title: "طاي شوري السنوي",
        url: "/لحن طاى شورى السنوى كاملا بالهزات_للمعلم ابراهيم معوض.mp4",
      },
      {
        id: "fs2-4",
        title:
          "لبش الهوس الثاني (اول ربعين باللحن+التكملة دمج+اخر 4 ارباع باللحن)",
        url: "/ليش الهوس الثاني _ مارين أووؤنه _ للمرتل زاهر أندراوس.mp4",
      },
    ],
    gifted: [
      {
        id: "fsg-1",
        title: "لحن اطاي بارثينوس كاملا",
        url: "/اطاي بارثينوس.mp4",
      },
      {
        id: "fsg-2",
        title: "اوشية القرابين الكبيرة",
        url: "/مردات الشماس داخل الهيكل  ما يقال أثناء رفع بخوري عشية وباكر  أوشية القرابين.mp4",
      },
      {
        id: "fsg-3",
        title: "اسبسمس الادام(افرحي يا مريم )عربي كاملا",
        url: "/الحان القداس _ الطقس السنوي _ للمعلم ابراهيم عياد _ لحن افرحي يا مريم.mp4",
      },
    ],
  },
  middle: {
    first: [
      {
        id: "m1-1",
        title: "ابصالية الاحد(ايكوتي) كاملة",
        url: "/ابصالية ايكوتى للمعلم ابراهيم عياد.mp4",
      },
      {
        id: "m1-2",
        title:
          "قطعة توزيع عيد العنصرة وصوم الاباء الرسل (اسومين) كاملا يوناني+قبطي+عربي",
        url: "/اسومين توزيع عيد العنصرة و صوم الاباء الرسل المعلم ابراهيم عياد.mp4",
      },
      {
        id: "m1-3",
        title: "المزمور السنوي المختصر",
        url: "/المزمور السنوي المختصر او اويني افشاي.mp4",
      },
      {
        id: "m1-4",
        title: "اسبسمس الادام (اونوف اممو ماريا) قبطي كاملا",
        url: "/اونوف اممو ماريا للمعلم ابراهيم عياد.mp4",
      },
    ],
    second: [
      {
        id: "m2-1",
        title:
          "لحن اوندوس(المقدمة+ابوخروؤ+اري ابريسفيفين+طوبه ام ابتشويس للرسل)",
        url: "/لحن أوندوس للمعلم إبراهيم عياد واالمعلم زاهر أندراوس من كاتدرائية البابا كيرلس بدير مارمينا بمريوط.mp4",
      },
      {
        id: "m2-2",
        title: "ابصالية الثلاثة فتية(اربصالين)",
        url: "/قطعة اريبصالين للمعلم ابراهيم عياد.mp4",
      },
      {
        id: "m2-3",
        title: "اسبسمس ادام عربي للرسل(اباؤنا الرسل)",
        url: "", //record
      },
      {
        id: "m2-4",
        title: "طواف عشية + طواف باكر السنوي",
        url: "/طوافات رفع بخوري عشية وباكر السنوي   للمعلم زاهر أندراوس.mp4",
      },
    ],
    gifted: [
      {
        id: "mg-1",
        title: "ني اثنوس تيرو كاملا",
        url: "/تسبحة الأيام وتسبحة العشية السنوي _ تسبحة يوم السبت _ لحن ني اثنوس تيرو.mp4",
      },
      {
        id: "mg-2",
        title: "لحن الفضائل الاثني عشر قبطي (تي ميتي اسنوتي)",
        url: "/لحن الفضائل تي ميت إسنوتي من قداس عيد القيامة 2013 للمعلم ابراهيم عياد وخوروس الاكليريكة.mp4",
      },
    ],
  },
  high: {
    first: [
      {
        id: "h1-1",
        title: "الهوس الاول كاملا",
        url: "/الهوس الاول.mp4",
      },
      {
        id: "h1-2",
        title: "اطاي بارثينوس كاملا",
        url: "/اطاي بارثينوس.mp4",
      },
      {
        id: "h1-3",
        title: "اسبسمس واطس للعذراء(ماريا تي تشرومبي)",
        url: "/ماريا تي تشرومبي.mp4",
      },
      {
        id: "h1-4",
        title: "مرد الابركسيس لعيد النيروز + الختام بالطريقة المطولة",
        url: "/مرد ابركسيس عيد النيروز بالتكملة الكبيرة - بصوت المرتل اسامة فوزي.mp4",
      },
    ],
    second: [
      {
        id: "h2-1",
        title: "تين اويه انسوك السنوي",
        url: "/تين اووية انسوك .mp4",
      },
      {
        id: "h2-2",
        title: "محير(افناف امبي اسمو) للعذراء",
        url: "/افناف امبي اسمو.mp4",
      },
      {
        id: "h2-3",
        title: "ذوكصولوجية باكر",
        url: "/ذكصولوجية باكر.mp4",
      },
      {
        id: "h2-4",
        title: "اوندوس",
        url: "/لحن أوندوس للمعلم إبراهيم عياد واالمعلم زاهر أندراوس من كاتدرائية البابا كيرلس بدير مارمينا بمريوط.mp4",
      },
    ],
    gifted: [
      {
        id: "hg-1",
        title: "اسبازيستي الكبير",
        url: "/اسبازيستي.mp4",
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
        url: "/لحن أوندوس للمعلم إبراهيم عياد واالمعلم زاهر أندراوس من كاتدرائية البابا كيرلس بدير مارمينا بمريوط.mp4",
      },
      {
        id: "u1-2",
        title: "اطاي بارثينوس كاملا",
        url: "/اطاي بارثينوس.mp4",
      },
      {
        id: "u1-3",
        title: "لحن افشوليم + ايفول هيتين الصغير",
        url: "/لحن افئين بى ارشى ايرفس+افشوليم+ايفول هيتين للمعلم ابراهيم عياد.mp4",
      },
      {
        id: "u1-4",
        title: "محير التمجيد(فاي بي ابليمين)",
        url: "/لحن فاى بى ابلمين لتماجيد العذراء_كاملا بالهزات_للمعلم ابراهيم معوض.mp4",
      },
    ],
    second: [
      {
        id: "u2-1",
        title: "الهوس الرابع كاملا",
        url: "/الهوس الرابع للمعلم ابراهيم عياد.mp4",
      },
      {
        id: "u2-2",
        title: "التوزيع الفرايحي الكبير لعيد النيروز قبطيا كاملا",
        url: "/مزمور التوزيع الكبير - عيد النيروز - للمعلم ابراهيم عياد.mp4",
      },
      {
        id: "u2-3",
        title: "لحن افئين بي ارشي",
        url: "/لحن أفئين بي ارشي ايريفس _ المعلم زاهر أندراوس.mp4",
      },
      {
        id: "u2-4",
        title: "لحن فاني تينه (للملاك ميخائيل)",
        url: "/لحن فاني تينه _ المعلم زاهر اندراوس _ يقال في أعياد الملاك ميخائيل.mp4",
      },
    ],
  },
  servants: {
    first: [
      {
        id: "s1-1",
        title:
          "لحن بي إنفما كامل + المجمع (الربع الأول والثاني في خين هان ميش إن لاس)",
        url: "/لحن بي ابنفما - للمًعلم ابراهيم عياد.mp4",
      },
      {
        id: "s1-2",
        title:
          "لحن تين ثينو الكبير كامل + التكملة حتى النهاية الأرباع (إبشويس إك إيسه أوراون إتنا إيسوتو أووه)",
        url: "/لحن تين ثينو الكبير للمعلم ابراهيم عياد.mp4",
      },
      {
        id: "s1-3",
        title: "لحن إسبازيسي الكبير كامل",
        url: "/اسبازيستي.mp4",
      },
    ],
    second: [
      {
        id: "s2-1",
        title: "لحن أفئين بي أرشي",
        url: "/لحن أفئين بي ارشي ايريفس _ المعلم زاهر أندراوس.mp4",
      },
      {
        id: "s2-2",
        title: "إبصالية آدم لصوم الآباء الرسل (اي اوش أوفيك إيبشويس) كاملة",
        url: "/ابصالية ادام لصوم الاباء الرسل.mp4",
      },
      {
        id: "s2-3",
        title:
          "لحن أوندوس (المقدمة + أبو إخراوؤو شينيف + آري إبؤسفيقين + طوبه إيبشويس للرسل)",
        url: "/لحن أوندوس للمعلم إبراهيم عياد واالمعلم زاهر أندراوس من كاتدرائية البابا كيرلس بدير مارمينا بمريوط.mp4",
      },
      {
        id: "s2-4",
        title: "لحن سينا نشو للتمجيد",
        url: "/لحن سينا اتشو 0 للمعلم ابراهيم معوض.mp4",
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
                        video.url.endsWith(".mp4") ? (
                          <video
                            src={video.url}
                            controls
                            preload="none"
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            style={{ background: "#222" }}
                          />
                        ) : (
                          <iframe
                            src={getYouTubeEmbedUrl(video.url)}
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            frameBorder="0"
                            allow="accelerometer; controls; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        )
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
