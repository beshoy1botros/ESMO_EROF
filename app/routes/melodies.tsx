import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/melodies.css";

// 1. تعريف الأنواع (Type Definitions)
interface Video {
  id: string;
  title: string;
  url: string;
}

interface LevelVideos {
  first: Video[];
  second: Video[];
  gifted?: Video[]; // gifted is optional for some stages
}

// Define specific types for stages based on their structure
interface KindergartenStage extends LevelVideos {
  gifted: Video[]; // Kindergarten has gifted
}
interface FirstSecondStage extends LevelVideos {
  gifted: Video[];
}
interface ThirdFourthStage extends LevelVideos {
  gifted: Video[];
}
interface FifthSixthStage extends LevelVideos {
  gifted: Video[];
}
interface MiddleStage extends LevelVideos {
  gifted: Video[];
}
interface HighStage extends LevelVideos {
  gifted: Video[];
}
interface UniversityStage extends Omit<LevelVideos, "gifted"> {} // University does not have gifted
interface ServantsStage extends Omit<LevelVideos, "gifted"> {} // Servants does not have gifted
interface WeddingOfCanaStage extends Omit<LevelVideos, "gifted"> {}

interface VideoData {
  kindergarten: KindergartenStage;
  firstSecond: FirstSecondStage;
  thirdFourth: ThirdFourthStage;
  fifthSixth: FifthSixthStage;
  middle: MiddleStage;
  high: HighStage;
  university: UniversityStage;
  servants: ServantsStage;
  weddingOfCana: WeddingOfCanaStage;
}

// 5. استخدام الثوابت/Enums للمراحل والمستويات
enum StageKey {
  Kindergarten = "kindergarten",
  FirstSecond = "firstSecond",
  ThirdFourth = "thirdFourth",
  FifthSixth = "fifthSixth",
  Middle = "middle",
  High = "high",
  University = "university",
  Servants = "servants",
  WeddingOfCana = "weddingOfCana",
}

enum LevelKey {
  First = "first",
  Second = "second",
  Gifted = "gifted",
}

// 3. توحيد معرفات الفيديو (Video IDs) و 4. توحيد مسارات الفيديو (URL Paths)
const videoData: VideoData = {
  kindergarten: {
    first: [
      {
        id: "k1-1",
        title: "سوتيس امين دمج",
        url: "/الحان مهرجان الكرازة 2022 مرحلة الحضانة - المستوى الاول _ لحن سوتيس أمين دمجاً.mp4",
      },
      {
        id: "k1-2",
        title: "مرد مزمور عشية وباكر وقداس عيد النيروز",
        url: "/مرد مزمور - عيد النيروز - للمعلم ابراهيم عياد.mp4",
      },
      {
        id: "k1-3",
        title: "ختام الصلوات الاجتماعية(المياة والاهوية والزروع)",
        url: "/ختام الصلوات الاجتماعية السنوى - حضانة.mp4",
      },
      {
        id: "k1-4",
        title: "هيتين القداس للعذراء+الاباء الرسل",
        url: "/الهيتينيات.mp4",
      },
    ],
    second: [
      {
        id: "k2-1",
        title: "ذكصولوجية العذراء عشية (ايريه ابصول سيل)",
        url: "/ذكصولوجية السيدة العذراء في رفع بخور عشية للايبيذياكون اسامه لطفي.mp4",
      },
      {
        id: "k2-2",
        title: "مرد المجمع الباسيلي (ايريه بو اسمو)",
        url: "/الحان مهرجان الكرازة 2024 مرحلة الحضانة - المستوى الثاني _ مرد المجمع الباسيلي إيريه بو إسمو.mp4",
      },
      {
        id: "k2-3",
        title: "المزمور 150 الهوس الرابع بالطريقة السنوي",
        url: "/الحان مهرجان الكرازة 2022 مرحلة 3 ، 4 ابتدائي - المستوى الثاني _ المزمور 150 من الهوس الرابع السنوي .mp4",
      },
      {
        id: "k2-4",
        title: "مرد انجيل القداس السنوي أوأونياتو",
        url: "/الحان مهرجان الكرازة 2022 مرحلة الحضانة - المستوى الثاني _ مرد انجيل القداس السنوي أوأونياتو.mp4",
      },
    ],
    gifted: [
      {
        id: "kg-1",
        title: "تي شوري السنوي",
        url: "/لحن تى شورى السنوى_ قبطى كاملا بالهزات_للمعلم ابراهيم معوض.mp4",
      },
      {
        id: "kg-2",
        title: "لحن البركة (بدون البرلكس)",
        url: "/لحن البركة تين اواوشت بالهزات _ مهرجان الكرازة المرقسية 2023 -مرحلة اعدادى.mp4",
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
        title: "ذكصولوجية العذراء رفع بخور باكر",
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
        title: "ذكصولوجية الاباء الرسل (كيريوس)",
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
        url: "/الهوس الرابع (مز - 149).mp4",
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
        title: "ذكصولوجية الاباء الرسل (كيريوس)",
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
        title: "قطعة التمجيد (شاشف انسوب + أفموتي)",
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
          "لحن بي ابنفما المقدمة فقط +المحير(الربع الاول والثاني الي خين هان ميش ان لاس)",
        url: "/بي بنفما.mp4",
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
        title: "ذكصولوجية الاباء الرسل (كيريوس)",
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
        url: "/المزمور السنوي المختصر او اويني افشاي (2).mp4",
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
        url: "/المزمور السنوي المختصر او اويني افشاي (2).mp4",
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
        url: "/اباؤنا الرسل.mp3",
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
      { id: "h1-1", title: "الهوس الاول كاملا", url: "/الهوس الاول.mp4" },
      { id: "h1-2", title: "اطاي بارثينوس كاملا", url: "/اطاي بارثينوس.mp4" },
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
      { id: "h2-3", title: "ذكصولوجية باكر", url: "/ذكصولوجية باكر.mp4" },
      {
        id: "h2-4",
        title: "اوندوس",
        url: "/لحن أوندوس للمعلم إبراهيم عياد واالمعلم زاهر أندراوس من كاتدرائية البابا كيرلس بدير مارمينا بمريوط.mp4",
      },
    ],
    gifted: [
      { id: "hg-1", title: "اسبازيستي الكبير", url: "/اسبازيستي.mp4" },
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
      { id: "u1-2", title: "اطاي بارثينوس كاملا", url: "/اطاي بارثينوس.mp4" },
      {
        id: "u1-3",
        title: "لحن افشوليم + ايفول هيتين الصغير",
        url: "/afsholim_evol_hetin.mp4",
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
        title: "التوزيع الفرايحي الكبير لعيد النيروز قبطي كاملا",
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
          "لحن بي إبنفما كامل + المحير (الربع الأول والثاني الي خين هان ميش إن لاس)",
        url: "/لحن بي ابنفما - للمًعلم ابراهيم عياد.mp4",
      },
      {
        id: "s1-2",
        title: "لحن تين ثينو الكبير كامل + التكملة حتى نهاية الأرباع",
        url: "/لحن تين ثينو الكبير للمعلم ابراهيم عياد.mp4",
      },
      { id: "s1-3", title: "لحن اسبازيستي الكبير كامل", url: "/اسبازيستي.mp4" },
    ],
    second: [
      {
        id: "s2-1",
        title: "لحن أفئين بي أرشي",
        url: "/لحن أفئين بي ارشي ايريفس _ المعلم زاهر أندراوس.mp4",
      },
      {
        id: "s2-2",
        title: "إبصالية آدام لصوم الآباء الرسل (اي اوش أوفيك إبتشويس) كاملة",
        url: "/ابصالية ادام لصوم الاباء الرسل.mp4",
      },
      {
        id: "s2-3",
        title: "لحن أوندوس",
        url: "/لحن أوندوس للمعلم إبراهيم عياد واالمعلم زاهر أندراوس من كاتدرائية البابا كيرلس بدير مارمينا بمريوط.mp4",
      },
      {
        id: "s2-4",
        title: "لحن سينا تشو للتمجيد",
        url: "/لحن سينا اتشو 0 للمعلم ابراهيم معوض.mp4",
      },
    ],
  },
  weddingOfCana: {
    first: [
      {
        id: "wc-1",
        title: "ذكصولوجية الاباء الرسل (كيريوس)",
        url: "/ذكصولوجية ثانية للاباء الرسل تقال في صوم الرسل - للمُعلم ابراهيم عياد.mp4",
      },
      {
        id: "wc-2",
        title:
          "قطعة توزيع عيد العنصرة وصوم الاباء الرسل (اسومين) كاملا يوناني+قبطي+عربي",
        url: "/اسومين توزيع عيد العنصرة و صوم الاباء الرسل المعلم ابراهيم عياد.mp4",
      },
      {
        id: "wc-3",
        title:
          "لحن بي ابنفما المقدمة فقط +المحير(الربع الاول والثاني الي خين هان ميش ان لاس)",
        url: "/بي بنفما.mp4",
      },
    ],
    second: [],
  },
};

const levelMap: Record<string, LevelKey> = {
  الأول: LevelKey.First,
  الثاني: LevelKey.Second,
  الموهوبين: LevelKey.Gifted,
};

function mapArabicToEnglishLevel(arabicLevel: string): LevelKey | string {
  return levelMap[arabicLevel] || arabicLevel.toLowerCase();
}

// 2. تحسين دالة getVideos
function getVideos(stage: StageKey, level: string): Video[] {
  const englishLevel = mapArabicToEnglishLevel(level);
  const stageData = videoData[stage];

  if (!stageData) {
    return [];
  }

  // Type assertion to access properties safely based on LevelKey
  if (englishLevel === LevelKey.First) {
    return stageData.first;
  }
  if (englishLevel === LevelKey.Second) {
    return stageData.second;
  }
  if (englishLevel === LevelKey.Gifted && "gifted" in stageData) {
    return (
      (
        stageData as
          | KindergartenStage
          | FirstSecondStage
          | ThirdFourthStage
          | FifthSixthStage
          | MiddleStage
          | HighStage
      ).gifted || []
    );
  }

  return [];
}

export function meta() {
  return [
    { title: "ⲥⲙⲟⲩ ⲉⲣⲟϥ - الألحان" },
    {
      name: "description",
      content: "موقع متخصص في تعليم الألحان القبطية للطلاب في مختلف المراحل",
    },
  ];
}

export default function MelodiesPage() {
  const [stage, setStage] = useState<StageKey | "">("");
  const [level, setLevel] = useState<string>("");
  const [levels, setLevels] = useState<string[]>([]);
  const [videos, setVideos] = useState<Video[]>([]); // استخدام النوع Video[]

  useEffect(() => {
    if (
      [
        StageKey.Kindergarten,
        StageKey.FirstSecond,
        StageKey.ThirdFourth,
        StageKey.FifthSixth,
        StageKey.Middle,
        StageKey.High,
      ].includes(stage as StageKey)
    ) {
      setLevels(["الأول", "الثاني", "الموهوبين"]);
    } else if (
      [StageKey.University, StageKey.Servants].includes(stage as StageKey)
    ) {
      setLevels(["الأول", "الثاني"]);
    } else if (stage === StageKey.WeddingOfCana) {
      setLevels(["الأول"]);
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
    <div className="min-h-screen flex flex-col font-sans">
      {/* الهيدر في الأعلى */}
      <Header />
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat melodies-bg">
        {/* طبقة التعتيم */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        {/* المحتوى فوق الطبقة */}
        <div className="relative z-10 flex flex-col min-h-full bg-gray-900/0 text-white">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div className="space-y-4">
                <label
                  htmlFor="stage"
                  className="block mb-2 sm:mb-3 text-base sm:text-lg font-medium"
                >
                  المرحلة:
                </label>
                <select
                  id="stage"
                  value={stage}
                  onChange={(e) => setStage(e.target.value as StageKey)}
                  className="w-full p-3 sm:p-4 bg-gray-700 text-white border border-blue-500 rounded-lg cursor-pointer transition-all hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                >
                  <option value="">اختر المرحلة</option>
                  <option value={StageKey.Kindergarten}>حضانة</option>
                  <option value={StageKey.FirstSecond}>أولى و ثانية</option>
                  <option value={StageKey.ThirdFourth}>ثالثة و رابعة</option>
                  <option value={StageKey.FifthSixth}>خامسة و سادسة</option>
                  <option value={StageKey.Middle}>إعدادي</option>
                  <option value={StageKey.High}>ثانوي</option>
                  <option value={StageKey.University}>جامعة</option>
                  <option value={StageKey.Servants}>خدام و خادمات</option>
                  <option value={StageKey.WeddingOfCana}>
                    عرس قانا الجليل
                  </option>
                </select>
              </div>
              <div className="space-y-4">
                <label
                  htmlFor="level"
                  className="block mb-2 sm:mb-3 text-base sm:text-lg font-medium"
                >
                  المستوى:
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-3 sm:p-4 bg-gray-700 text-white border border-blue-500 rounded-lg cursor-pointer transition-all hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center flex-1">
              {/* 6. تحسين رسالة "لا يوجد فيديوهات" */}
              {videos.length === 0 && stage && level ? (
                <div className="col-span-full text-center p-6 sm:p-8 bg-gray-700 rounded-lg border border-blue-500">
                  <div className="text-4xl sm:text-5xl mb-4">🎵</div>
                  <p className="text-gray-400 text-sm sm:text-base">
                    لا توجد ألحان متاحة للمرحلة "{stage}" والمستوى "{level}".
                  </p>
                </div>
              ) : videos.length === 0 && stage && !level ? (
                <div className="col-span-full text-center p-6 sm:p-8 bg-gray-700 rounded-lg border border-blue-500">
                  <div className="text-4xl sm:text-5xl mb-4">📋</div>
                  <p className="text-gray-400 text-sm sm:text-base">
                    الرجاء اختيار مستوى لعرض الألحان.
                  </p>
                </div>
              ) : (
                videos.map((video) => (
                  <div
                    key={video.id} // استخدام video.id الموحد
                    className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-blue-500 transition-all hover:border-blue-400 hover:scale-105 flex flex-col"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 sm:mb-4 text-center">
                      {video.title}
                    </h3>
                    {video.url && (
                      <video
                        controls
                        className="w-full rounded-lg bg-black aspect-video"
                        src={video.url}
                      >
                        متصفحك لا يدعم تشغيل الفيديو
                      </video>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      {/* الفوتر في الأسفل */}
      <Footer />
    </div>
  );
}
