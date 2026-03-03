export interface Hymn {
  name: string;
  video: string;
  lyrics: {
    coptic: string[];
    arabic: string[];
    copticArabic: string[];
  } | null;
}

export interface PreparatoryLevelData {
  level1: Hymn[];
  level2: Hymn[];
  level3: Hymn[];
  level4: Hymn[];
}

export type PreparatoryData = Record<string, PreparatoryLevelData>;

export const preparatoryData: PreparatoryData = {
  "أولى حضانة": {
    level1: [],
    level2: [],
    level3: [],
    level4: [],
  },
  "ثانية حضانة": {
    level1: [],
    level2: [],
    level3: [],
    level4: [],
  },
  "أولى وثانية ابتدائي": {
    level1: [],
    level2: [],
    level3: [],
    level4: [],
  },
  "ثالثة ورابعة ابتدائي": {
    level1: [],
    level2: [],
    level3: [],
    level4: [],
  },
  "رابعة وخامسة وسادسة": {
    level1: [
      {
        name: "لحن القيامة",
        video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        lyrics: {
          coptic: ["Ⲭⲣⲓⲥⲧⲟⲥ ⲁⲛⲉⲥⲧⲏ"],
          copticArabic: [" اخرستوس انيستي"],
          arabic: ["المسيح قام"],
        },
      },
    ],
    level2: [],
    level3: [],
    level4: [],
  },
  "اعدادي وثانوي": {
    level1: [],
    level2: [],
    level3: [],
    level4: [],
  },
};
