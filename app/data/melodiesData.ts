/**
 * بيانات الألحان - ملف البيانات المنفصل
 * Melodies Data - Separated Data File
 * 
 * هذا الملف يحتوي على أنواع البيانات والتصدير
 * This file contains data types and exports
 */

import { CLOUDFLARE_VIDEO_BASE_URL } from "../utils/cloudflare";

// --- ١. التعريفات البرمجية (Types & Enums) ---

export interface Video {
  id: string;
  title: string;
  copticArabic: string;
  copticcoptic: string;
  arabicTranslation: string;
  hazzatImage?: string;
  hazzatImage٢?: string;
  hazzatImage٣?: string;
  hazzatImage٤?: string;
  hazzatImage٥?: string;
  hazzatImage٦?: string;
  hazzatImage٧?: string;
  hazzatImage٨?: string;
  hazzatImage٩?: string;
  hazzatImage١٠?: string;
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

// --- ١. الإعدادات والروابط الأساسية ---
const BASE_URL = CLOUDFLARE_VIDEO_BASE_URL;
export const stageVideoUrls = {
  [StageKey.Kindergarten]: {
    first: [
      `${BASE_URL}/Hadana-1-1.mp4`,
      `${BASE_URL}/Hadana-1-2.mp4`,
      `${BASE_URL}/Hadana-1-3.mp4`,
      `${BASE_URL}/Hadana-1-4.mp4`,
    ],
    second: [
      `${BASE_URL}/Hadana-2-1.mp4`,
      `${BASE_URL}/Hadana-2-2.mp4`,
      `${BASE_URL}/Hadana-2-3.mp4`,
      `${BASE_URL}/Hadana-2-4.mp4`,
    ],
    gifted: [
      `${BASE_URL}/Hadana-3-1.mp4`,
      `${BASE_URL}/Hadana-3-2.mp4`,
      `${BASE_URL}/Hadana-3-3.mp4`,
    ],
  },
  [StageKey.FirstSecond]: {
    first: [
      `${BASE_URL}/Owla_Tania-1-1.mp4`,
      `${BASE_URL}/Owla_Tania-1-2.mp4`,
      `${BASE_URL}/Owla_Tania-1-3.mp4`,
      `${BASE_URL}/Owla_Tania-1-4.mp4`,
    ],
    second: [
      `${BASE_URL}/Owla_Tania-2-1.mp4`,
      `${BASE_URL}/Owla_Tania-2-2.mp4`,
      `${BASE_URL}/Owla_Tania-2-3.mp4`,
      `${BASE_URL}/Owla_Tania-2-4.mp4`,
    ],
    gifted: [
      `${BASE_URL}/Owla_Tania-3-1.mp4`,
      `${BASE_URL}/Owla_Tania-3-2.mp4`,
      `${BASE_URL}/Owla_Tania-3-3.mp4`,
    ],
  },
  [StageKey.ThirdFourth]: {
    first: [
      `${BASE_URL}/Talta_Rabaa-1-1.mp4`,
      `${BASE_URL}/Talta_Rabaa-1-2.mp4`,
      `${BASE_URL}/Talta_Rabaa-1-3.mp4`,
      `${BASE_URL}/Talta_Rabaa-1-4.mp4`,
    ],
    second: [
      `${BASE_URL}/Talta_Rabaa-2-1.mp4`,
      `${BASE_URL}/Talta_Rabaa-2-2.mp4`,
      `${BASE_URL}/Talta_Rabaa-2-3.mp4`,
      `${BASE_URL}/Talta_Rabaa-2-4.mp4`,
    ],
    gifted: [
      `${BASE_URL}/Talta_Rabaa-3-1.mp4`,
      `${BASE_URL}/Talta_Rabaa-3-2.mp4`,
      `${BASE_URL}/Talta_Rabaa-3-3.mp4`,
    ],
  },
  [StageKey.FifthSixth]: {
    first: [
      `${BASE_URL}/Khamsa_Satta-1-1.mp4`,
      `${BASE_URL}/Khamsa_Satta-1-2.mp4`,
      `${BASE_URL}/Khamsa_Satta-1-3.mp4`,
      `${BASE_URL}/Khamsa_Satta-1-4.mp4`,
    ],
    second: [
      `${BASE_URL}/Khamsa_Satta-2-1.mp4`,
      `${BASE_URL}/Khamsa_Satta-2-2.mp4`,
      `${BASE_URL}/Khamsa_Satta-2-3.mp4`,
      `${BASE_URL}/Khamsa_Satta-2-4.mp4`,
    ],
    gifted: [
      `${BASE_URL}/Khamsa_Satta-3-1.mp4`,
      `${BASE_URL}/Khamsa_Satta-3-2.mp4`,
    ],
  },
  [StageKey.Middle]: {
    first: [
      `${BASE_URL}/Middle-1-1.mp4`,
      `${BASE_URL}/Middle-1-2.mp4`,
      `${BASE_URL}/Middle-1-3.mp4`,
      `${BASE_URL}/Middle-1-4.mp4`,
    ],
    second: [
      `${BASE_URL}/Middle-2-1.mp4`,
      `${BASE_URL}/Middle-2-2.mp4`,
      `${BASE_URL}/Middle-2-3.mp4`,
    ],
    gifted: [
      `${BASE_URL}/Middle-3-1.mp4`,
      `${BASE_URL}/Middle-3-2.mp4`,
      `${BASE_URL}/Middle-3-3.mp4`,
    ],
  },
  [StageKey.High]: {
    first: [
      `${BASE_URL}/High-1-1.mp4`,
      `${BASE_URL}/High-1-2.mp4`,
      `${BASE_URL}/Talta_Rabaa-1-1.mp4`,   // مشترك — لا يوجد High-1-3 في المجلد
      `${BASE_URL}/High-1-4.mp4`,
    ],
    second: [
      `${BASE_URL}/Middle-2-2.mp4`,          // مشترك — لا يوجد High-2-1 في المجلد
      `${BASE_URL}/High-2-2.mp4`,
      `${BASE_URL}/High-2-3.mp4`,
      `${BASE_URL}/High-2-4.mp4`,
    ],
    gifted: [
      `${BASE_URL}/High-3-1.mp4`,
      `${BASE_URL}/High-3-2.mp4`,
      `${BASE_URL}/High-3-3.mp4`,
    ],
  },
  [StageKey.University]: {
    first: [
      `${BASE_URL}/Middle-3-1.mp4`,          // مشترك
      `${BASE_URL}/Middle-2-1.mp4`,          // مشترك
      `${BASE_URL}/University-1-3.mp4`,
    ],
    second: [
      `${BASE_URL}/University-2-1.mp4`,
      `${BASE_URL}/University-2-2.mp4`,
      `${BASE_URL}/University-2-3.mp4`,
    ],
  },
  [StageKey.Servants]: {
    first: [
      `${BASE_URL}/Servants-1-1.mp4`,
      `${BASE_URL}/Servants-1-2.mp4`,
      `${BASE_URL}/Servants-1-3.mp4`,
    ],
    second: [
      `${BASE_URL}/Servants-2-1.mp4`,
      `${BASE_URL}/Middle-3-1.mp4`,          // مشترك — لا يوجد Servants-2-2 في المجلد
      `${BASE_URL}/Servants-2-3.mp4`,
    ],
  },
  [StageKey.WeddingOfCana]: {
    first: [
      `${BASE_URL}/Talta_Rabaa-2-2.mp4`,     // مشترك
      `${BASE_URL}/Weddingofcana-2.mp4`,
      `${BASE_URL}/Khamsa_Satta-1-4.mp4`,    // مشترك
      `${BASE_URL}/Talta_Rabaa-1-1.mp4`,     // مشترك
    ],
  },
} as const;
type StageVideosModule = { default: LevelVideos };

const stageVideoLoaders: Record<StageKey, () => Promise<StageVideosModule>> = {
  [StageKey.Kindergarten]: () => import("./melodies/kindergarten"),
  [StageKey.FirstSecond]: () => import("./melodies/firstSecond"),
  [StageKey.ThirdFourth]: () => import("./melodies/thirdFourth"),
  [StageKey.FifthSixth]: () => import("./melodies/fifthSixth"),
  [StageKey.Middle]: () => import("./melodies/middle"),
  [StageKey.High]: () => import("./melodies/high"),
  [StageKey.University]: () => import("./melodies/university"),
  [StageKey.Servants]: () => import("./melodies/servants"),
  [StageKey.WeddingOfCana]: () => import("./melodies/weddingOfCana"),
};

export async function loadStageVideos(stage: StageKey): Promise<LevelVideos> {
  const loader = stageVideoLoaders[stage];
  if (!loader) {
    throw new Error(`No melody data loader configured for stage: ${stage}`);
  }

  const module = await loader();
  return module.default;
}

export async function loadAllVideoData(): Promise<VideoData> {
  const entries = await Promise.all(
    Object.values(StageKey).map(async (stage) => [stage, await loadStageVideos(stage)] as const),
  );

  return Object.fromEntries(entries) as VideoData;
}
