// --- تعريفات المراحل والمستويات ---

export const STAGE_KEYS = {
  KINDERGARTEN: "kindergarten",
  FIRST_SECOND: "firstSecond",
  THIRD_FOURTH: "thirdFourth",
  FIFTH_SIXTH: "fifthSixth",
  MIDDLE: "middle",
  HIGH: "high",
  UNIVERSITY: "university",
  SERVANTS: "servants",
  WEDDING_OF_CANA: "weddingOfCana",
  FOURTH_FIFTH_SIXTH: "fourthFifthSixth",
  MIDDLE_HIGH: "middlehigh",
} as const;

export const STAGE_LABELS = {
  [STAGE_KEYS.KINDERGARTEN]: "حضانة",
  [STAGE_KEYS.FIRST_SECOND]: "أولى و ثانية",
  [STAGE_KEYS.THIRD_FOURTH]: "ثالثة و رابعة",
  [STAGE_KEYS.FIFTH_SIXTH]: "خامسة و سادسة",
  [STAGE_KEYS.MIDDLE]: "إعدادي",
  [STAGE_KEYS.HIGH]: "ثانوي",
  [STAGE_KEYS.UNIVERSITY]: "جامعة",
  [STAGE_KEYS.SERVANTS]: "خدام وخادمات",
  [STAGE_KEYS.WEDDING_OF_CANA]: "عرس قانا الجليل",
  [STAGE_KEYS.FOURTH_FIFTH_SIXTH]: "رابعة و خامسة و سادسة",
  [STAGE_KEYS.MIDDLE_HIGH]: "إعدادي و ثانوي",
} as const;

export const LEVEL_LABELS = {
  FIRST: "الأول",
  SECOND: "الثاني",
  GIFTED: "الموهوبين",
} as const;

// --- دالة للحصول على المستويات المتاحة لكل مرحلة ---
export function getLevelsForStage(stage: string): string[] {
  const standardLevels = [
    LEVEL_LABELS.FIRST,
    LEVEL_LABELS.SECOND,
    LEVEL_LABELS.GIFTED,
  ];
  const twoLevels = [LEVEL_LABELS.FIRST, LEVEL_LABELS.SECOND];
  const oneLevel = [LEVEL_LABELS.FIRST];

  switch (stage) {
    case STAGE_KEYS.KINDERGARTEN:
    case STAGE_KEYS.FIRST_SECOND:
    case STAGE_KEYS.THIRD_FOURTH:
    case STAGE_KEYS.FIFTH_SIXTH:
    case STAGE_KEYS.MIDDLE:
    case STAGE_KEYS.HIGH:
    case STAGE_KEYS.FOURTH_FIFTH_SIXTH: // تمت الإضافة
    case STAGE_KEYS.MIDDLE_HIGH:        // تمت الإضافة
      return standardLevels;
    case STAGE_KEYS.UNIVERSITY:
    case STAGE_KEYS.SERVANTS:
      return twoLevels;
    case STAGE_KEYS.WEDDING_OF_CANA:
      return oneLevel;
    default:
      return [];
  }
}

// --- دالة للتحقق من صحة المرحلة والمستوى ---
export function isValidStageLevel(stage: string, level: string): boolean {
  const levels = getLevelsForStage(stage);
  return levels.includes(level);
}

// --- تحويل المستوى العربي إلى الإنجليزي ---
export function mapArabicToEnglishLevel(
  arabicLevel: string
): "first" | "second" | "gifted" {
  const levelMap: Record<string, "first" | "second" | "gifted"> = {
    [LEVEL_LABELS.FIRST]: "first",
    [LEVEL_LABELS.SECOND]: "second",
    [LEVEL_LABELS.GIFTED]: "gifted",
  };
  return levelMap[arabicLevel] || ("first" as const);
}