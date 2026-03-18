/**
 * بيانات الألحان - ملف البيانات المنفصل
 * Melodies Data - Separated Data File
 * 
 * هذا الملف يحتوي على بيانات الفيديوهات والألحان المنفصلة عن مكون الصفحة
 * This file contains video and melody data separated from the page component
 */

// --- 1. التعريفات البرمجية (Types & Enums) ---

export interface Video {
  id: string;
  title: string;
  url: string;
  copticArabic: string;
  copticcoptic: string;
  arabicTranslation: string;
  hazzatImage?: string;
  hazzatImage2?: string;
  hazzatImage3?: string;
  hazzatImage4?: string;
  hazzatImage5?: string;
  hazzatImage6?: string;
  hazzatImage7?: string;
  hazzatImage8?: string;
  hazzatImage9?: string;
  hazzatImage10?: string;
}

export enum StageKey {
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

export interface LevelVideos {
  first: Video[];
  second: Video[];
  gifted?: Video[];
}

export type VideoData = Record<StageKey, LevelVideos>;

// ملاحظة: بيانات videoData الكاملة موجودة في ملف melodies.tsx الأصلي
// ويتم استيرادها من هناك لإعادة استخدام الكود الموجود
// The complete videoData is in the original melodies.tsx file
// and is imported from there to reuse existing code
