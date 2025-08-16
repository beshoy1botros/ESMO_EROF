// ملف مساعد لإدارة المراحل والمستويات

// تعريف الـ enum محلياً لتجنب مشاكل الاستيراد
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

/**
 * دالة للحصول على المستويات المتاحة لمرحلة معينة
 * @param stageKey - مفتاح المرحلة
 * @returns مصفوفة من المستويات المتاحة
 */
export const getLevelsForStage = (stageKey: string): string[] => {
  // التحقق من صحة المدخل
  if (!stageKey || typeof stageKey !== 'string') {
    return [];
  }

  // المراحل التي تحتوي على ثلاثة مستويات
  const threelevelsStages = [
    StageKey.Kindergarten,
    StageKey.FirstSecond,
    StageKey.ThirdFourth,
    StageKey.FifthSixth,
    StageKey.Middle,
    StageKey.High,
  ];

  // المراحل التي تحتوي على مستويين
  const twoLevelsStages = [
    StageKey.University,
    StageKey.Servants
  ];

  if (threelevelsStages.includes(stageKey as StageKey)) {
    return ["الأول", "الثاني", "الموهوبين"];
  } else if (twoLevelsStages.includes(stageKey as StageKey)) {
    return ["الأول", "الثاني"];
  } else if (stageKey === StageKey.WeddingOfCana) {
    return ["الأول"];
  } else {
    return [];
  }
};

/**
 * دالة للتحقق من صحة المرحلة والمستوى
 * @param stage - المرحلة المختارة
 * @param level - المستوى المختار
 * @returns true إذا كان الاختيار صحيحاً
 */
export const isValidStageLevel = (stage: string, level: string): boolean => {
  if (!stage || !level) {
    return false;
  }

  const availableLevels = getLevelsForStage(stage);
  return availableLevels.includes(level);
};

/**
 * دالة للحصول على اسم المرحلة باللغة العربية
 * @param stageKey - مفتاح المرحلة
 * @returns اسم المرحلة باللغة العربية
 */
export const getStageDisplayName = (stageKey: string): string => {
  const stageNames: Record<string, string> = {
    [StageKey.Kindergarten]: "حضانة",
    [StageKey.FirstSecond]: "أولى و ثانية",
    [StageKey.ThirdFourth]: "ثالثة و رابعة",
    [StageKey.FifthSixth]: "خامسة و سادسة",
    [StageKey.Middle]: "إعدادي",
    [StageKey.High]: "ثانوي",
    [StageKey.University]: "جامعة",
    [StageKey.Servants]: "خدام و خادمات",
    [StageKey.WeddingOfCana]: "عرس قانا الجليل"
  };

  return stageNames[stageKey] || stageKey;
};
