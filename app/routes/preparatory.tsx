import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LazyVideo from "../components/LazyVideo";
import "../styles/melodies.css";
import "../styles/mobile-improvements.css";
import { prewarmVideos } from "../utils/swClient";
import { SUPABASE_VIDEO_BASE_URL } from "../utils/supabase";
import {
  preparatoryData,
  type PreparatoryItem,
} from "../utils/preparatoryData";
import { STAGE_KEYS } from "../utils/stageUtils";

// CSS مخصص للنصوص القبطية
const copticStyles = `
  .coptic-content .coptic-inline {
    font-family: "copt-main", "copt-alt", "copt-youssef", "Noto Sans Coptic", sans-serif;
    color: #a78bfa;
    display: inline-block;
    direction: ltr;
    margin: 0 4px;
  }
  
  .coptic-content {
    font-family: "copt-main", "copt-alt", "copt-youssef", "Noto Sans Coptic", sans-serif;
  }
  
  .coptic-content span[class*="coptic"] {
    font-family: "copt-main", "copt-alt", "copt-youssef", "Noto Sans Coptic", sans-serif;
  }
`;

// --- تعريفات الأنواع ---
interface Video {
  id: string;
  title: string;
  url: string;
  copticArabic: string;
  copticcoptic: string;
  arabicTranslation: string;
  hazzatImage?: string;
  hazzatImage2?: string;
  hazzatImage3?: string;
}

type StageVideos = Record<string, Video[]>;
type ViewMode = "videos" | "rites";

// --- المراحل المتاحة ---
const STAGES = [
  { key: "حضانة", label: "حضانة" },
  { key: "اولي وتانيه وثالثة", label: "أولى وثانية وثالثة" },
  { key: "رابعة وخامسة وسادسة", label: "رابعة وخامسة وسادسة" },
  { key: "اعدادي وثانوي", label: "إعدادي وثانوي" },
];

const BASE_URL = SUPABASE_VIDEO_BASE_URL;

// --- بيانات الفيديوهات ---
const preparatoryVideos: StageVideos = {
  حضانة: [
    {
      id: "k1",
      title: "لحن أجيوس السنوي",
      url: `${BASE_URL}/Hadana-1-4 Gkkcss.mp4`,
      copticArabic:
        "أجيوس أوثيؤس أجيوس إسشيروس أجيوس أثاناطوس أو إكبارثينو جيننيتيس إليسون إيماس \n\nأجيوس أوثيؤس أجيوس إسشيروس أجيوس أثاناطوس أو إسطافروتيس ديماس إليسون إيماس\n\nأجيوس أوثيؤس أجيوس إسشيروس أجيوس أثاناطوس أو أناسطاس إكطون نيكرون كى أنيلثون إسطوس أورانوس إليسون إيماس \n\nذوكساباتري كى إيو كى أجيو بنفماتي كى نين كى آ إى كى إسطوس إى أوناس طون إى أونون أمين . أجيا إترياس إليسون إيماس ",
      copticcoptic:
        "+ Ⲁⲅⲓⲟⲥ ⲟ̀ Ⲑⲥ̅: ⲁⲅⲓⲟⲥ Ⲓⲥⲭⲩⲣⲟⲥ: ⲁⲅⲓⲟⲥ Ⲁ̀ⲑⲁⲛⲁⲧⲟⲥ: ⲟ̀ ⲉⲕ Ⲡⲁⲣⲑⲉⲛ­ⲟⲩ ⲅⲉⲛⲛⲉⲑ­ⲏⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n  Ⲁ̀ⲅⲓⲟⲥ ⲟ̀ Ⲑⲥ̅: ⲁⲅⲓⲟⲥ ⲓⲥⲭⲩⲣⲟⲥ: ⲁ̀ⲅⲓⲟⲥ ⲁⲑⲁⲛⲁⲧ­ⲟⲥ: ⲟ̀ⲥ̀ⲧⲁⲩⲣⲟⲑ­ⲓⲥ ⲇⲓ ⲏ̀ⲙⲁⲥ ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n Ⲁⲅⲓⲟⲥ ⲟ̀ Ⲑⲥ̅: ⲁⲅⲓⲟⲥ Ⲓⲥⲭⲩⲣⲟⲥ: ⲁⲅⲓⲟⲥ Ⲁ̀ⲑⲁⲛⲁⲧⲟⲥ: ⲟ̀ ⲁⲛⲁⲥⲧⲁⲥ ⲉⲕ ⲧⲱⲛⲛⲉⲕⲣⲱⲛ ⲕⲉ ⲁ̀ⲛⲉⲗⲑⲱⲛ ⲓⲥ ⲧⲟⲩⲥ ⲟⲩⲣⲁⲛⲟⲥ ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n + Ⲇⲟⲝⲁ ⲡⲁⲧⲣⲓ ⲕⲉ Ⲩⲓⲱ: ⲕⲉ ⲁ̀ⲅⲓⲱ Ⲡⲉⲛⲉⲩⲙ­ⲁⲧⲓ: ⲕⲉ ⲛⲩⲛ ⲕⲉ ⲁ̀Ⲓ̀: ⲕⲉ ⲓⲥ ⲧⲟⲩⲥ ⲉ̀ⲱ̀ⲛⲁⲥ ⲧⲱⲛ ⲉ̀ⲱ̀ⲛⲱⲛ Ⲁⲙ̅. Ⲁⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.",
      arabicTranslation:
        "قدوس الله قدوس القوي قدوس الحي الذي لا يموت الذي ولد من العذراء إرحمنا \n\nقدوس الله قدوس القوي قدوس الحي الذي لا يموت الذي صلب عنا إرحمنا \n\nقدوس الله قدوس القوي قدوس الحي الذي لا يموت الذي قام من الأموات وصعد إلى السموات إرحمنا \n\nالمجد للآب والإبن والروح القدس الآن وكل أوان وإلى دهر الدهور أمين أيها الثالوث القدوس إرحمنا ",
    },
    {
      id: "k2",
      title: "ذكصولوجية العذراء عشية بالنغمة السنوي (إيرى إبصول سيل إمماريام)",
      url: `${BASE_URL}/T Hadana-2 Hthdv5.mp4`,
      copticArabic:
        "إري إبسول سيل إم ماريام : خين ني فيؤوي إتصا إبشوي : صا أووينام إمبيس مينريت :إس طوبه إمموف إ إهري إجون\n\nكاطا إفريتي إطاف جوس :إنجيه دافيد خين بي بسالموس : جيه أس أوهي إراتس إنجيه تي أوورو :صا أووينام إمموك إب أوورو\n\nسولومون مووتي إروس :خين بي جو إنتيه ني جو :جيه طاسوني أووه طا إشفيري :طا بوليس إممي ييروساليم\n\nأفتي ميني غار إروس :خين هان ميش إنران إفتشوسي جيه أمي إفول خين بيكيبوس : أو ثي إتسوتب إن أروماطا\n\nشيري ني أو تي بارثينوس : تي أوورو إممي إن أليثيني : شيري إبشووشوو إنتيه بين جينوس : أري إجفو نان إن إممانوئيل\n\nتين تيهو أري بين ميفي : أوتي بروستاتيس إتينهوت : ناهرين بين تشويس إيسوس بي خريستوس : إنتيف كا نين نوفي نان إيفول",
      copticcoptic:
        "Ⲉ̀ⲣⲉ ⲡ̀ⲥⲟⲗⲥⲉⲗ ⲙ̀Ⲙⲁⲣⲓⲁⲙ: ϧⲉⲛ ⲛⲓⲫⲏⲟⲩⲓ̀ ⲉⲧ̀ⲥⲁ̀ⲡ̀ϣⲱⲓ ⲥⲁⲟⲩⲓ̀ⲛⲁⲙ ⲙ̀ⲡⲉⲥⲙⲉⲛⲣⲓⲧ: ⲉ̀ⲥⲧⲱⲃϩ ⲙ̀ⲙⲟϥ ⲉ̀ϩ̀ⲣⲏⲓ ⲉ̀ϫⲱⲛ.\n\n+ Ⲕⲁⲧⲁ ⲫ̀ⲣⲏϯ ⲉ̀ⲧⲁϥϫⲟⲥ: ⲛ̀ϫⲉ Ⲇⲁⲩⲓⲇ ϧⲉⲛ ⲡⲓⲯ̀ⲁⲗⲟⲙⲥ: ϫⲉ ⲁⲥⲟ̀ϩⲓ ⲉ̀ⲣⲁⲧⲥ ⲛ̀ϫⲉ ϯⲟⲩⲣⲱ: ⲥⲁⲟⲩⲓ̀ⲛⲁⲙ ⲙ̀ⲙⲟⲕ ⲡ̀Ⲟⲩⲣⲟ.\n\nⲤⲟⲗⲟⲙⲱⲛ ⲙⲟⲩϯ ⲉⲣⲟⲥ: ϧⲉⲛ ⲡⲓϫⲱ ⲛ̀ⲧⲉ ⲛⲓϫⲱ: ϫⲉ ⲧⲁⲥⲱⲛⲓ ⲟⲩⲟϩ ⲧⲁϣ̀ⲫⲉⲣⲓ: ⲧⲁⲡⲟⲗⲓⲥ ⲙ̀ⲙⲏⲓ Ⲓⲉⲣⲟⲩⲥⲁⲗⲏⲙ.\n\n+ Ⲁϥϯⲙⲏⲓⲛⲓ ⲅⲁⲣ ⲉ̀ⲣⲟⲥ: ϧⲉⲛ ϩⲁⲛⲙⲏϣ ⲛ̀ⲣⲁⲛ ⲉⲩϭⲟⲥⲓ: ϫⲉ ⲁ̀ⲙⲏ ⲉ̀ⲃⲟⲗϧⲉⲛ ⲡⲉⲕⲏ̀ⲡⲟⲥ: ⲱ̀ ⲑⲏⲉ̀ⲧⲁⲥⲱⲧⲡ ⲛ̀ⲁ̀ⲣⲱⲙⲁⲧⲁ.\n\nⲬⲉⲣⲉ ⲛⲉ ⲱ̀ ϯⲠⲁⲣⲑⲉⲛⲟⲥ: ϯⲟⲩⲣⲱ ⲙ̀ⲙⲏⲓ ⲛ̀ⲁ̀ⲗⲏⲑⲓⲛⲏ: ⲭⲉⲣⲉ ⲡ̀ϣⲟⲩϣⲟⲩ ⲛ̀ⲧⲉ ⲡⲉⲛⲅⲉⲛⲟⲥ: ⲁⲣⲉϫ̀ⲫⲟ ⲛⲁⲛ ⲛ̀Ⲉⲙⲙⲁⲛⲟⲩⲏⲗ.\n\n+ Ⲧⲉⲛϯϩⲟ ⲁ̀ⲣⲉⲡⲉⲛⲙⲉⲩⲓ̀: ⲱ̀ ϯⲡ̀ⲣⲟⲥⲧⲁⲧⲏⲥ ⲉ̀ⲧⲉⲛϩⲟⲧ: ⲛⲁϩⲣⲉⲛ ⲡⲉⲛⲟ̅ⲥ̅ Ⲓⲏ̅ⲥ̅ Ⲡⲭ̅ⲥ̅: ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.",
      arabicTranslation:
        "زينة مريم في السموات العلوية عن يمين حبيبها تطلب منه عنا\n\nكما قال داود المرتل في المزمور: قامت الملكة عن يمينك أيها الملك\n\nسليمان دعاها في نشيد الأنشاد قائلاً أختي و صديقتي المدينة الحقيقية أورشليم\n\nلأنه أعطي علامة عنها بأسماء كثيرة عالية قائلاً: أخرجي من بستانك أيتها العنبر المختار\n\nالسلام لك أيتها العذراء الملكة الحقيقية الحقانية. السلام لفخر جنسنا ولدت لنا عمانوئيل\n\nنسألك أذكرينا أيتها الشفيعة المؤتمنة أمام ربنا يسوع المسيح ليغفر لنا خطايانا",
    },
    {
      id: "k3",
      title:
        "مرد إنجيل الأحد الأول والثاني لشهر كيهك (تين تي نيمبي + إثفي فاي تين تي أوؤوني)",
      url: `${BASE_URL}/Hadana-2-1 Sw4yc6.mp4`,
      copticArabic:
        " تين تي ني إمبي شيري تيسموس : نيم غابرييل بي آنجيلوس : جي شيري كي خاريتو : ميني أوكيريوس ميتاسو \n\nإثفي فاي تين تي أوؤوني : هوس ثيئوطوكوس إنسيو نيفين : ماتي هو إيه ابتشويس إي إهري إيجون : إنتيف كانين نوفي نان إيفول.",
      copticcoptic:
        "+ Ⲧⲉⲛϯ ⲛⲉ ⲙ̀ⲡⲓⲬⲉ̅­ⲧⲓⲥⲙⲟⲥ: ⲛⲉⲙ Ⲅⲁⲃⲣⲓⲏⲗ ⲡⲓⲁⲅⲅⲉ­ⲗⲟⲥ: ϫⲉ Ⲭⲉ̅ ⲕⲉⲭⲁⲣⲓ­ⲧⲱⲙⲉⲛⲏ: ⲟ̀ Ⲕⲥ̅ ⲙⲉⲧⲁ ⲥⲟⲩ.\n\n+ Ⲉⲑⲃⲉ ⲫⲁⲓ ⲧⲉⲛϯⲱ̀ⲟⲩ ⲛⲉ: ϩⲱⲥ Ⲑⲉⲟ̀ⲧⲟⲕⲟⲥ ⲛ̀ⲥⲏⲟⲩ ⲛⲓⲃⲉⲛ: ⲙⲁϯϩⲟ ⲉ̀Ⲡ̀⳪ ⲉ̀ϩ̀ⲣⲏⲓ ⲉ̀ϫⲱⲛ: ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.",
      arabicTranslation:
        "نحن نعطيك السلام مع غبريال الملاك قائلين السلام لكِ يا ممتلئة نعمة الرب معك \n\nمن اجل هذا نمجدك كوالدة الإله كل حين أسألي الرب عنا ليغفر لنا خطايانا.",
    },
  ],
  "اولي وتانيه وثالثة": [
    {
      id: "p1",
      title: "ني شيروبيم (قبطي)",
      url: `${BASE_URL}/Owla Tania-1-4 Fqkxms.mp4`,
      copticArabic:
        "ني شيروبيم سى أوأوشت : إمموك نيم ني سيرافيم سى تي أوأوو ناك : إفؤش إيفول إفجو إمموس : جى أجيوس أجيوس أجيوس كيريوس صاباؤوت : بلى ريس او أورانوس كى إيجي تيس أجياس سوذوكسيس",
      copticcoptic:
        "Ⲛⲓⲭⲉⲣⲟⲩⲃⲓⲙ ⲥⲉⲟⲩⲱϣⲧ ⲙ̀ⲙⲟⲕ: ⲛⲉⲙ Ⲛⲓⲥⲉⲣⲁⲫⲓⲙ ⲥⲉϯⲱ̀ⲟⲩ ⲛⲁⲕ: ⲉⲩⲱϣ ⲉ̀ⲃⲟⲗ ⲉⲩϫⲱ ⲙ̀ⲙⲟⲥ:Ϫⲉ ⲁ̀ⲅⲓⲟⲥ ⲁ̀ⲅⲓⲟⲥ ⲁ̀ⲅⲓⲟⲥ: Ⲕⲩⲣⲓⲟⲥ ⲥⲁⲃⲁⲱⲑ: ⲡⲗⲏⲣⲏⲥ ⲟ̀ ⲟⲩⲣⲁⲛⲟⲥ ⲕⲉ ⲏ̀ ⲅⲏ ⲧⲏⲥ ⲁ̀ⲅⲓⲁⲥ ⲥⲟⲩ ⲇⲟⲝⲏⲥ.",
      arabicTranslation:
        "الشاروبيم يسجدون لك والسيرافيم يمجدونك صارخين قائلين قدوس قدوس قدوس رب الصباؤوت السماء والأرض مملوءتان من مجدك الأقدس",
    },
    {
      id: "p2",
      title:
        "مرد إنجيل الأحد الثالث والرابع (تين تشيسي اممو + اثفي فاي تين + جى افسمارؤوت)",
      url: `${BASE_URL}/Owla Tania-1-3 Ndtdz9.mp4`,
      copticArabic:
        "تين تشيسى إممو خين أوو إم إبشا : نيم إليصابيت تى سينجينيس : جـى إتسماروؤوت إنثو خين نى هيومى : إف إسماروؤوت إنـجـى إب أوطاه إنتى تى نيـجـى \n\n اثفي فاي تين تي أوؤونى : هوس ثيئوطوكوس انسيو نيفين : ماتي هو ايه ابتشويس اى اهري ايجون : انتيف كانين نوفي نان ايفول \n\n جى افسمارؤوت انجى افيوت نيم ابشيري : نيم بي بنفما اثؤواب : تى ترياس اتجيك ايفول : تين اوؤشت امmوس تين تي أو أوناس",
      copticcoptic:
        "Ⲧⲉⲛϭⲓⲥⲓ ⲙ̀ⲙⲟ ϧⲉⲛ ⲟⲩⲉⲙⲡ̀ϣⲁ: ⲛⲉⲙ Ⲉⲗⲓⲥⲁⲃⲉⲧ ⲧⲉⲥⲩⲅⲅⲉⲛⲏⲥ: ϫⲉ ⲉⲧⲥ̀ⲙⲁⲣⲱⲟⲩⲧ ⲛ̀ⲑⲟ ϧⲉⲛ ⲛⲓϩⲓⲟⲙⲓ: ϥ̀ⲥ̀ⲙⲁⲣⲱⲟⲩⲧ ⲛ̀ϫⲉ ⲡ̀ⲟⲩⲧⲁϩ ⲛ̀ⲧⲉ ⲧⲉⲛⲉϫⲓ.\n\n Ⲉⲑⲃⲉ ⲫⲁⲓ ⲧⲉⲛϯⲱ̀ⲟⲩ ⲛⲉ: ϩⲱⲥ Ⲑⲉⲟ̀ⲧⲟⲕⲟⲥ ⲛ̀ⲥⲏⲟⲩ ⲛⲓⲃⲉⲛ: ⲙⲁϯϩⲟ ⲉ̀Ⲡ̀ϭⲟⲓⲥ ⲉ̀ϩ̀ⲣⲏⲓ ⲉ̀ϫⲱⲛ: ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.\n\nϪⲉ ϥ̀ⲥ̀ⲙⲁⲣⲟⲩⲱⲧ ⲛ̀ϫⲉ Ⲫ̀ⲓⲱⲧ ⲛⲉⲙ Ⲡ̀ϣⲏⲣⲓ: ⲛⲉⲙ Ⲡⲓⲡ̀ⲛⲉⲩⲙⲁ ⲉ̀ⲑⲟⲩⲁⲃ ϯⲧ̀ⲣⲓⲁⲥ ⲉⲧϫⲏⲕ ⲉ̀ⲃⲟⲗ: ⲧⲉⲛⲟⲩⲱϣⲧ ⲙ̀ⲙⲟⲥ ⲧⲉⲛϯⲱ̀ⲟⲩ ⲛⲁⲥ.",
      arabicTranslation:
        "نعظمك باستحقاق : مع أليصابات نسيبتك : قائلين مباركة أنتِ فى النساء : و مباركة هى ثمرة بطنك \n\n من أجل هذا نمجدك كوالدة الإله كل حين إسالي الرب عنا ليغفر لنا خطايانا \n\n لأنه مبارك الآب والإبن والروح القدس الثالوث الكامل نسجد له ونمجده",
    },
    {
      id: "p3",
      title: "اخر ربعين في مقدمة الذكصولوجيات الكيهكي بالطريقه السريعة",
      url: `${BASE_URL}/Hadana-1-1 Gf3h9c.mp4`,
      copticArabic:
        "شيرى نى أوتى بارثينوس: تى أورو إممى إن آليثينى: شيرى إبشوشو إنتى بين جينوس: آرى إجفونان إن إممانوئيل\n\nتينتى هو آرى بين ميفئى: أوتى إبروس تاتيس إيتين هوت: ناهرين بين تشويس إيسوس بخرستوس: إنتيف كانين نوفى نان إيفول",
      copticcoptic:
        "+ Ⲭⲉ̅ ⲛⲉ ⲱ̀ ϯⲡ̅ⲁ̅ⲣ̅ⲑ̅: ϯⲟⲩⲣⲱ ⲙ̀ⲙⲏⲓ ⲛ̀ⲁ̀ⲗⲏⲑⲓⲛⲏ: Ⲭⲉ̅ ⲡ̀ϣⲟⲩϣⲟⲩ ⲛ̀ⲧⲉ ⲡⲉⲛⲅⲉⲛ­ⲟⲥ: ⲁⲣⲉϫ̀ⲫⲟ ⲛⲁⲛ ⲛ̀Ⲉⲙⲙⲁⲛⲟ­ⲩⲏⲗ.\n\n+ Ⲧⲉⲛϯϩⲟ ⲁ̀ⲣⲓⲡⲉⲛⲙ­ⲉⲩⲓ̀: ⲱ̀ ϯⲡ̀ⲣⲟⲥⲧⲁⲧ­ⲏⲥ ⲉ̀ⲧⲉⲛϩⲟⲧ: ⲛⲁϩⲣⲉⲛ Ⲡⲉⲛ⳪ Ⲓⲏ̅ⲥ̅ Ⲡⲭ̅ⲥ̅: ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.",
      arabicTranslation:
        "السلام لك أيتها العذراء الملكة الحقيقية الحقانية السلام لفخر جنسنا ولدت لنا عمانوئيل\n\nنسألك أن تذكرينا أيتها الشفيعة المؤتمنة أمام ربنا يسوع المسيح ليغفر لنا خطايانا",
    },
  ],
  "رابعة وخامسة وسادسة": [
    {
      id: "s1",
      title: "أوشية المسافرين (قبطي + عربي)",
      url: `${BASE_URL}/T Rabaa-1 Wfjmsv.mp4`,
      copticArabic:
        "طوبه إيجين نينيوتى نيم نين إسنيو إيطاف شى إى إبشيممو يى نى إثميفئى إيشى خين ماى نيفين سوتون نومويت تيرو إيتى إيفول هيتين إفيوم يى نى ياروؤو يى نيليمنى يى نيمويت إمموش يى إفئيرى إمبو جينموشى إن ريتى نيفين هينا إنتى بى إخرستوس بيننوتى تاسطوؤو إى نيئتى نؤو إم ما إن شوبى خين أو هيرينى إنتيف كانين نوفى نان إيفول.",
      copticcoptic:
        "Ⲧⲱⲃϩ ⲉ̀ϫⲉⲛ ⲛⲉⲛⲓⲟϯ ⲛⲉⲙ ⲛⲉⲛⲥ̀ⲛⲏⲟⲩ ⲉ̀ⲧⲁⲩϣⲉ ⲉ̀ⲡ̀ϣⲉⲙⲙⲟ: ⲓⲉ ⲛⲏⲉⲑⲙⲉⲩⲓ ⲉ̀ϣⲉ ϧⲉⲛ ⲙⲁⲓ ⲛⲓⲃⲉⲛ: ⲥⲟⲩⲧⲱⲛ ⲛⲟⲩⲙⲱⲓⲧ ⲧⲏⲣⲟⲩ: ⲓ̀ⲧⲉ ⲉ̀ⲃⲟⲗ ϩⲓⲧⲉⲛ ⲫ̀ⲓⲟⲙ: ⲓⲉ ⲛⲓⲓⲁⲣⲱⲟⲩ: ⲓⲉ ⲛⲓⲗⲩⲙⲛⲏ ⲓⲉ ⲛⲓⲙⲱⲓⲧ ⲙ̀ⲙⲟϣⲓ: ⲓⲉ ⲡⲓⲁ̀ⲏⲣ ⲓⲉ ⲉⲩⲓ̀ⲣⲓ ⲙ̀ⲡⲟⲩϫⲓⲛⲙⲟϣⲓ ⲛ̀ⲣⲏϯ ⲛⲓⲃⲉⲛ: ϩⲓⲛⲁ ⲛ̀ⲧⲉ Ⲡⲓⲭ̀ⲣⲓⲥⲧⲟⲥ Ⲡⲉⲛⲛⲟⲩϯ ⲧⲁⲥⲑⲱⲟⲩ ⲉ̀ⲛⲏⲉ̀ⲧⲉ ⲛⲟⲩⲟⲩ ⲙ̀ⲙⲁ ⲛ̀ϣⲱⲛⲓ ϧⲉⲛ ⲟⲩϩⲓⲣⲏⲛⲏ: ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.",
      arabicTranslation:
        "أُطلبوا عن آبائنا وإخوتنا المسافرين، والذين يضمرون السفر في كل موضع، لكي يُسهل طرقهم أجمعين إن كان في البحر أو الأنهار أو البحيرات أو الطرق المسلوكة أو الجو أو المسافرين بكل نوع، لكي المسيح إلهنا يردهم إلى مساكنهم سالمين، ويغفر لنا خطايانا.",
    },
    {
      id: "s2",
      title: "ذكصولوجية شهر كيهك كي غار (كاملة)",
      url: `${BASE_URL}/Talta Rabaa-1-1 Kom2c4.mp4`,
      copticArabic:
        "كيه غار أيشان صاجي إثفيتي : أوبي هارما إن شيرووبيميكون : بالاس ناخيسي أن إينيه : تين إيرماكاريزين إممو \n\n جيه أوندوس غارتي نا شيني : شا ني أفليوو إنتيه إبئى إن دافيد : إنطاتشني إنؤو إسمي إيفول هيتوتف : إثري صاجي إمبيه طايو \n\n جيه أه إفنوتي أوهي إيراتف خين ني ثوش إنتيه تي يوذيآه : أفتي إنتيف إسمي خين أوثيليل : أه إتفيلي إن يوذا شوبف إيروس \n\n إتفيلي إن يوذا تي تي بارثينوس : ثي إيطاس ميسي إمبين صوتير : أووه أون مين إنصا إثريه ماسف : أسؤهي إسؤى إمبارثينوس \n\n إيفول غارهيتين تي فوني : إنتيه غاربييل بي أنجيلوس : تين تي نيه إمبي شيريه تيزموس : أوتي ثيؤطوكوس ماريا \n\n شيري ني إيفول هيتين إفنوتي : شيري ني إيفول هيتين غابرييل : شيري ني إيفول هيطوتين : جي شيري ني تين تشيسي إممو \n\n بي أنجيلوس إثؤواب غابرييل : أفهي شين نوفي إنتي بارثينوس : مين إنصا بي أسبازموس : أفطاجرو إمموس خين بيف صاجي \n\n جي إمبير إيرهوتي ماريام : أري جيمي غار إن أو إهموت : خاتين إفنوتي هيبي غار تيرا إيرفوكي : أووه إنتي ميسي إن أو شيري \n\n إف إيه تي ناف إنجي إبتشويس إفنوتي : إمبي إثرنوس إنتي دافيد بيف يوت : إفنا إيه أورو إيجين إبئى إن ياكوب : شا إينيه إنتي بي إينيه \n\n إثفيه فاي تين تي أوأوو ني : هوس ثيؤطوكوس إنسيو نيفين : ماتيهو إي إبتشويس إإهري إيجون : إنتيف كانين نوفي نان إيفول \n\n شيري ني أو تي بارثينوس  : تي أوورو إممي إن أليثيني  : شيري إبشوشو إنتي بين جينوس  : أري إجفو نان إن إممانوئيل \n\n تين تيهو أري بين ميفئي  : أوتي بروستاتيس إتينهوت  : ناهرين بين تشويس إيسوس بي خريستوس  : إنتيف كا نين نوفي نان إيفول",
      copticcoptic:
        "+ Ⲕⲉ ⲅⲁⲣ ⲁⲓϣⲁⲛⲥ­ⲁϫⲓ ⲉⲑⲃⲏϯ : ⲱ̀ ⲡⲓϩⲁⲣⲙⲁ ⲛ̀ⲭⲉⲣⲟⲩⲃ­ⲓⲙⲓⲕⲟⲛ : ⲡⲁⲗⲁⲥ ⲛⲁϧⲓⲥⲓ ⲁⲛ ⲉ̀ⲛⲉϩ : ⲧⲉⲛⲉⲣⲙ­ⲁⲕⲁⲣⲓⲍ­ⲓⲛ ⲙ̀ⲙⲟ.\n\n+ Ϫⲉ ⲟⲛⲧⲱⲥ ⲅⲁⲣ ϯⲛⲁϣⲉⲛ­ⲏⲓ : ϣⲁ ⲛⲓⲁⲩⲗⲉ­ⲏⲟⲩ ⲛ̀ⲧⲉ ⲡ̀ⲏⲓ ⲛ̀Ⲇⲁ̅ⲇ̅ : ⲛ̀ⲧⲁϭⲓ ⲛ̀ⲟⲩⲥ̀ⲙⲏ ⲉ̀ⲃⲟⲗ ϩⲓⲧⲟⲧϥ : ⲉⲑⲣⲓⲥⲁ­ϫⲓ ⲙ̀ⲡⲉⲧⲁⲓⲟ.\n\n+ Ϫⲉ ⲁ̀ Ⲫϯ ⲟ̀ϩⲓ ⲉ̀ⲣⲁⲧϥ : ϧⲉⲛ ⲛⲓⲑⲱϣ ⲛ̀ⲧⲉ Ϯⲓⲟⲩⲇⲉⲁ̀ : ⲁϥϯ ⲛ̀ⲧⲉϥⲥ̀ⲙⲏ ϧⲉⲛ ⲟⲩⲑⲉⲗⲏⲗ : ⲁ̀ ⲧ̀ⲫⲩⲗⲏ ⲛ̀Ⲓⲟⲩⲇⲁ ϣⲟⲡϥ ⲉ̀ⲣⲟⲥ.\n\n+ Ⲧ̀ⲫⲩⲗⲏ ⲛ̀Ⲓⲟⲩⲇⲁ ⲧⲉ Ϯⲡ̅ⲁ̅ⲣ̅ⲑ̅ : ⲑⲏⲉ̀ⲧⲁⲥⲙⲓⲥⲓ ⲙ̀Ⲡⲉⲛⲥ̅ⲱ̅ⲣ̅ : ⲟⲩⲟϩ ⲟⲛ ⲙⲉⲛⲉⲛⲥⲁ ⲑ̀ⲣⲉⲥⲙⲁⲥϥ : ⲁⲥⲟ̀ϩⲓ ⲉⲥⲟⲓ ⲙ̀ⲡ̅ⲁ̅ⲣ̅ⲑ̅.\n\n+ Ⲉ̀ⲃⲟⲗ ⲅⲁⲣ ϩⲓⲧⲉⲛ ϯⲫⲱⲛⲏ : ⲛ̀ⲧⲉ Ⲅⲁⲃⲣⲓⲏⲗ ⲡⲓⲁⲅⲅⲉ­ⲗⲟⲥ : ⲧⲉⲛϯ ⲛⲉ ⲙ̀ⲡⲓⲬⲉ̅­ⲧⲓⲥⲙⲟⲥ : ⲱ̀ Ϯⲑⲉⲟ̀ⲧⲟⲕⲟⲥ Ⲙⲁⲣⲓⲁ.\n\n+ Ⲭⲉ̅ ⲛⲉ ⲉ̀ⲃⲟⲗ ϩⲓⲧⲉⲛ Ⲫϯ : Ⲭⲉ̅ ⲛⲉ ⲉ̀ⲃⲟⲗ ϩⲓⲧⲉⲛ Ⲅⲁⲃⲣⲓⲏⲗ : Ⲭⲉ̅ ⲛⲉ ⲉ̀ⲃⲟⲗ ϩⲓⲧⲟⲧⲉⲛ : ϫⲉ Ⲭⲉ̅ ⲛⲉ ⲧⲉⲛϭⲓⲥⲓ ⲙ̀ⲙⲟ.\n\n+ Ⲡⲓⲁⲅⲅⲉ­ⲗⲟⲥ ⲉ̅ⲑ̅ⲩ̅ Ⲅⲁⲃⲣⲓⲏⲗ : ⲁϥϩⲓϣⲉ­ⲛⲛⲟⲩϥⲓ ⲛ̀Ϯⲡ̅ⲁ̅ⲣ̅ⲑ̅ : ⲙⲉⲛⲉⲛⲥⲁ ⲡⲓⲁⲥⲡⲁ­ⲥⲙⲟⲥ : ⲁϥⲧⲁϫⲣⲟ ⲙ̀ⲙⲟⲥ ϧⲉⲛ ⲡⲉϥⲥⲁϫⲓ.\n\n+ Ϫⲉ ⲙ̀ⲡⲉⲣⲉⲣϩ­ⲟϯ Ⲙⲁⲣⲓⲁⲙ : ⲁ̀ⲣⲉϫⲓⲙⲓ ⲅⲁⲣ ⲛ̀ⲟⲩϩ̀ⲙⲟⲧ : ϧⲁⲧⲉⲛ Ⲫϯ ϩⲏⲡⲡⲉ ⲅⲁⲣ ⲧⲉⲣⲁⲉⲣ­ⲃⲟⲕⲓ : ⲟⲩⲟϩ ⲛ̀ⲧⲉⲙⲓⲥⲓ ⲛ̀Ⲟⲩϣⲏⲣⲓ.\n\n+ Ⲉϥⲉ̀ϯ ⲛⲁϥ ⲛ̀ϫⲉ Ⲡ̀⳪ Ⲫϯ : ⲙ̀ⲡⲓⲑ̀ⲣⲟⲛⲟⲥ ⲛ̀ⲧⲉ Ⲇⲁ̅ⲇ̅ ⲡⲉϥⲓⲱⲧ : ϥ̀ⲛⲁⲉⲣⲟⲩ­ⲣⲟ ⲉ̀ϫⲉⲛ ⲡ̀ⲏⲓ ⲛ̀Ⲓⲁⲕⲱⲃ : ϣⲁ ⲉ̀ⲛⲉϩ ⲛ̀ⲧⲉ ⲡⲓⲉ̀ⲛⲉϩ.\n\n+ Ⲉⲑⲃⲉ ⲫⲁⲓ ⲧⲉⲛϯⲱ̀ⲟⲩ ⲛⲉ : ϩⲱⲥ Ⲑⲉⲟ̀ⲧⲟⲕⲟⲥ ⲛ̀ⲥⲏⲟⲩ ⲛⲓⲃⲉⲛ : ⲙⲁϯϩⲟ ⲉ̀Ⲡ̀⳪ ⲉ̀ϩ̀ⲣⲏⲓ ⲉ̀ϫⲱⲛ : ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.\n\n+ Ⲭⲉ̅ ⲛⲉ ⲱ̀ Ϯⲡ̅ⲁ̅ⲣ̅ⲑ̅ : ϯⲟⲩⲣⲱ ⲙ̀ⲙⲏⲓ ⲛ̀ⲁ̀ⲗⲏⲑⲓⲛⲏ : Ⲭⲉ̅ ⲡ̀ϣⲟⲩϣⲟⲩ ⲛ̀ⲧⲉ ⲡⲉⲛⲅⲉⲛ­ⲟⲥ : ⲁ̀ⲣⲉϫ̀ⲫⲟ ⲛⲁⲛ ⲛ̀Ⲉⲙⲙⲁⲛⲟ­ⲩⲏⲗ.\n\n+ Ⲧⲉⲛϯϩⲟ ⲁ̀ⲣⲉⲡⲉⲛⲙ­ⲉⲩⲓ̀ : ⲱ̀ ϯⲡ̀ⲣⲟⲥⲧⲁⲧ­ⲏⲥ ⲉ̀ⲧⲉⲛϩⲟⲧ : ⲛⲁϩⲣⲉⲛ Ⲡⲉⲛ⳪ Ⲓⲏ̅ⲥ̅ Ⲡⲭ̅ⲥ̅ : ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.",
      arabicTranslation:
        "لأني إذا ما تكلمت من أجلك ، أيتها المركبة الشاروبيمية ، لساني لا يتعب، أبداً نغبطك \n\n لأنني حقاً امضي ، إلي ديار بيت داود ، لآخذ صوتاً من قِبَله ، لكي انطق بكرامتك \n\n لأن الله وقف ، في حدود اليهودية ، وأعطي صوته بتهليل ، و سبط يهوذا قبله إليه \n\n سبط يهوذا هو العذراء ، التي ولدت مخلصنا ، و أيضاً بعد ما ولدته ، بقيت عذراء \n\n فمن قِبَل صوت ، غبريال الملاك ، نعطيك السلام ، يا والدة الإله مريم \n\n السلام لك من قبل الله ، السلام لك من قبل غبريال ، السلام لك من قبلنا ، قائلين السلام لك نرفعك \n\n الملاك القدس غبريال، بشر العذراء مريم ، و بعد السلام ، قواها بقوله \n\n لا تخافي يا مريم ، لأنك وجدت نعمة، عند الله ها ستحبلين ، و تلدبن ابنا \n\n ويعطيه الرب الإله ، كرسي داود أبيه ، و يملك علي بيت يعقوب ، إلي أبد الأبد \n\n من أجل هذا نمجدك ، كوالدة الإله كل حين ، إسألي الرب عنا ، ليغفر لنا خطايانا \n\n السلام لك أيتها العذراء ، الملكة الحقيقية ، السلام لفخر جنسنا ، ولدت لنا عمانوئيل \n\n نسألك أذكرينا أيتها الشفيعة المؤتمنة أمام ربنا يسوع المسيح ليغفر لنا خطايانا",
    },
    {
      id: "s3",
      title:
        "هيتنيات شهر كيهك كاملة (للملاك غبريال المبشر + يوحنا المعمدان نسيب عمانوئيل + زكريا الكاهن واليصابات + يواقيم وحنه)",
      url: `${BASE_URL}/Khamsa Satta-1-4 Eyonvs.mp4`,
      copticArabic:
        "هيتين ني إبريسفيا إنتي بي أرشي آنجيليوس إثؤواب غابرييل بي فاي شينوفي إبتشويس ...\n\nهيتين ني إبريسفيا إنتي بي سينجينيس إن إممانوئيل يوأنس إبشيري إن زخارياس إبتشويس ...\n\nهيتين ني إفشي إنتي بي أوويب زخارياس نيم تيف إسهيمي إليصابيت إبتشويس ...\n\nهيتين ني إفشي إنتي ني خيللوي إت اسماروؤوت يواكيم نيم آنَّا إبتشويس ...",
      copticcoptic:
        "Ϩⲓⲧⲉⲛ ⲛⲓⲡ̀ⲣⲉⲥⲃⲓⲁ: ⲛ̀ⲧⲉ ⲡⲓⲁⲣⲭⲏⲁⲅⲅⲉⲗⲟⲥ ⲉⲑⲟⲩⲁⲃ: Ⲅⲁⲃⲣⲓⲏⲗ ⲡⲓϥⲁⲓϣⲉⲛⲛⲟⲩϥⲓ: Ⲡ̀ϭⲟⲓⲥ ....\n\nϨⲓⲧⲉⲛ ⲛⲓⲡ̀ⲣⲉⲥⲃⲓⲁ: ⲛ̀ⲧⲉ ⲡⲓⲥⲩⲅⲅⲉⲛⲏⲥ ⲛ̀Ⲉⲙⲙⲁⲛⲟⲩⲏⲗ: Ⲓⲱⲁⲛⲛⲏⲥ ⲡ̀ϣⲏⲣⲓ ⲛ̀Ⲍⲁⲭⲁⲣⲓⲁⲥ: Ⲡ̀ϭⲟⲓⲥ....\n\nϨⲓⲧⲉⲛ ⲛⲓⲉⲩⲭⲏ: ⲛ̀ⲧⲉ ⲡⲓⲟⲩⲏⲃ Ⲍⲁⲭⲁⲣⲓⲁⲥ: ⲛⲉⲙ ⲧⲉϥⲥ̀ϩⲓⲙⲓ Ⲉ̀ⲗⲓⲥⲁⲃⲉⲧ: Ⲡ̀ϭⲟⲓⲥ ....\n\nϨⲓⲧⲉⲛ ⲛⲓⲉⲩⲭⲏ: ⲛ̀ⲧⲉ ⲛⲓϧⲉⲗⲗⲟⲓ ⲧ̀ⲥ̀ⲙⲁⲣⲱⲟⲩⲧ: Ⲓⲱⲁ̀ⲕⲓⲙ ⲛⲉⲙ Ⲁⲛⲛⲁ: Ⲡ̀ϭⲟⲓⲥ ....",
      arabicTranslation:
        "بشفاعات رئيس الملائكة الطاهر غبريال المبشر، يا رب ...\n\nبشفاعات نسيب عمانوئيل، يوحنا إبن زكريا، يا رب ...\n\nبصلوات زكريا الكاهن و إمرأته أليصابات يا رب ...\n\nبصلوات الشيخين المباركين يواقيم وحنة، يا رب ...",
    },
  ],
  "اعدادي وثانوي": [
    {
      id: "hs1",
      title: "لحن طاي شوري",
      url: `${BASE_URL}/Talta Rabaa-2-2 M7phqi.mp4`,
      copticArabic:
        "طاى شورى إن نوب إن كاثاروس إت فاى خا بى أروماطا إت خين نين ﭼيج إن آآرون بى أوويب إفطالى أو إستوى نوفى إى إبشوى إيجين بى ما إن إرشوؤوشى",
      copticcoptic:
        "+ Ⲧⲁⲓϣⲟⲩ­ⲣⲏ ⲛ̀ⲛⲟⲩⲃ ⲛ̀ⲕⲁⲑⲁⲣⲟⲥ: ⲉⲧϥⲁⲓ ϧⲁ ⲡⲓⲁⲣⲱⲙ­ⲁⲧⲁ: ⲉⲧϧⲉⲛ ⲛⲉⲛϫⲓϫ ⲛ̀Ⲁⲁⲣⲱⲛ ⲡⲓⲟ̀ⲩⲏⲃ: ⲉϥⲧⲁⲗⲉ ⲟⲩⲥ̀ⲑⲟⲓⲛⲟⲩ­ϥⲓ ⲉ̀ⲡ̀ϣⲱⲓ ⲉ̀ϫⲉⲛ ⲡⲓⲙⲁⲛ̀ⲉⲣϣⲱⲟⲩ­ϣⲓ.",
      arabicTranslation:
        "هذه المجمرة الذهب النقى، الحاملة العنبر، التي في يدى هارون الكاهن، يرفع بخورا على المذبح",
      hazzatImage: "/photos/طاي شوري.png",
    },
    {
      id: "hs2",
      title: "ابصالية الهوس الثاني كاملة لشهر كيهك",
      url: `${BASE_URL}/Middle-1-4 T1o5d9.mp4`,
      copticArabic:
        "أباهيت نيم بالاس : هوس إتي إترياس : أجيا إترياس  : إليسون إيماس.\n\nفون نيفين سيهوس ناك : أووه سي إرفوك ناك : أجيا إترياس : إليسون إيماس.\n\nجي غار إنثوك بينوتي : بين سوتير أووه بي نيشتي : أجيا إترياس : إليسون إيماس.\n\nذيس بوذي كيريون : أفئي أفسوتي إممون : أجيا إترياس : إليسون إيماس.\n\nإثفي نيك هاب إممي : ماإتسافوي إنيك ميثمي : أجيا إترياس : إليسون إيماس.\n\nذي أوش بي بيك ناي : جيم بين شيني خين بيك أوجاي : أجيا إترياس : إليسون إيماس.\n\nيس هيبي أنوك : إي إفوت هاروك : أجيا إترياس : إليسون إيماس.\n\nثوك تي تي جوم نيم بي أوؤو : أو بي أورو إنتى إب أوؤو : أجيا إترياس : إليسون إيماس.\n\nإيسوس بي تين هيلبيس : خين نين إثليبسيس : أجيا إترياس : إليسون إيماس.\n\nإك إسماروؤوت إيوس ثيؤس : ناهمين خين ني بي رازموس : أجيا إترياس : إليسون إيماس.\n\nلاؤس نيفين سيهوس ناك : أو إبؤرو بخرستوس : أجيا إترياس : إليسون إيماس.\n\nموي نان إنتيك هيريني : ماطالتشو إن نين شوني : أجيا إترياس : إليسون إيماس.\n\nإنثوك أو ريف شينهيت : أووه إن نا إيت : أجيا إترياس : إليسون إيماس.\n\nإك إسماروؤوت إنثوك : تين هوس ناك إسمو إيروك : أجيا إترياس : إليسون إيماس.\n\nأونيشتي إنطا إفمي : بي ريفتي هاب إممي : أجيا إترياس : إليسون إيماس.\n\nبيك ران إت إسماروؤوت : أو بي لوغوس إنطا إفمي : أجيا إترياس : إليسون إيماس.\n\nرويس إيرون  : خين تيك ميت أغاثوس : أجيا إترياس: إليسون إيماس.\n\nسوتيم اي ني ارنوفي : خين نو أنانكي : أجيا إترياس : إليسون إيماس.\n\nطا إبسيشي نيم بانوس : أو لو إ أورانوس : أجيا إترياس : إليسون إيماس.\n\nإيوس ثيؤس بين نوتي : موي نان إن أوسوتي : أجيا إترياس : إليسون إيماس.\n\nإفنوتي بي نا إيت : بي ريف أوأو إن هيت : أجيا إترياس : إليسون إيماس.\n\nإكؤواب إكؤواب إكؤواب : إبشيري إم في إثؤواب : أجيا إترياس : إليسون إيماس.\n\nإبسيشي إنين يوتي : ما إمتون نوؤو أو بي ريف سوتي : أجيا إترياس : إليسون إيماس.\n\nأوبين نيب أري بين ميفئي : خين تيك ميت أورو إن نا نيفيؤوي : أجيا إترياس : إليسون إيماس.",
      copticcoptic:
        "+ Ⲁⲡⲁϩⲏⲧ ⲛⲉⲙ ⲡⲁⲗⲁⲥ: ϩⲱⲥ ⲉ̀ϯⲧⲣⲓⲁⲥ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲃⲟⲛ Ⲛⲓⲃⲉⲛ ⲥⲉϩⲱⲥ ⲛⲁⲕ: ⲟⲩⲟϩ ⲥⲉⲉⲣⲃⲱⲕ ⲛⲁⲕ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲅⲉ ⲅⲁⲣ ⲛ̀ⲑⲟⲕ Ⲡⲉⲛⲟⲩϯ: Ⲡⲉⲛⲥ̅ⲱ̅ⲣ̅ ⲟⲩⲟϩ ⲡⲓⲛⲓϣϯ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲇⲉⲥⲡⲟⲩ­ⲇⲉ ⲕⲩⲣⲓⲟⲛ: ⲁϥⲓ̀ ⲁϥⲥⲱϯ ⲙ̀ⲙⲟⲛ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲉⲑⲃⲉ ⲛⲉⲥⲕϩⲁⲡ ⲙ̀ⲙⲏⲓ: ⲙⲁⲧⲥⲁⲃ­ⲟⲓ ⲉ̀ⲛⲉⲕⲙⲉⲑ­ⲙⲏⲓ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲍⲉⲟϣ ⲡⲉ ⲡⲉⲕⲛⲁⲓ: ϫⲉⲙ ⲡⲉⲛϣⲓⲛⲓ ϧⲉⲛ ⲡⲉⲕⲟⲩϫ­ⲁⲓ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲏⲥ ϩⲏⲡⲡⲉ ⲁ̀ⲛⲟⲕ: ⲉⲓⲉ̀ⲫⲱⲧ ϩⲁⲣⲟⲕ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲑⲱⲕ ⲧⲉ ϯϫⲟⲙ ⲛⲉⲙ ⲡⲓⲱ̀ⲟⲩ: ⲱ ⲡⲓⲟⲩⲣⲟ ⲛ̀ⲧⲉ ⲡ̀ⲱ̀ⲟⲩ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲓⲏ̅ⲥ̅ ⲡⲉ ⲧⲉⲛϩⲉⲗ­ⲓⲥ: ϧⲉⲛ ⲛⲉⲛⲑ̀ⲗⲩⲫⲥⲓⲥ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲕ̀ⲥ̀ⲙⲁⲣⲟⲱⲧ Ⲩⲥ̅ Ⲑⲥ̅: ⲛⲁϩⲙⲉⲛ ϧⲉⲛ ⲛⲓⲡⲓⲣⲁ­ⲥⲙⲟⲥ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲗⲁⲟⲥ ⲛⲓⲃⲉⲛ ⲥⲉϩⲱⲥ ⲛⲁⲕ: ⲱ̀ ⲡ̀ⲟⲩⲣⲟ Ⲡⲭ̅ⲥ̅: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲙⲟⲓ ⲛⲁⲛ ⲛ̀ⲧⲉⲕϩⲓⲣ­ⲏⲛⲏ: ⲙⲁⲧⲁⲗϭⲟ ⲛ̀ⲛⲉⲛϣⲱⲛⲓ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲛ̀ⲑⲟⲕ ⲟⲩⲣⲉϥϣ­ⲉⲛϩⲏⲧ: ⲟⲩⲟϩ ⲛ̀ⲛⲁⲏⲧ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲝⲙⲁⲣⲱⲟ­ⲩⲧ ⲛ̀ⲑⲟⲕ: ⲧⲉⲛϩⲱⲥ ⲛⲁⲕ ⲥ̀ⲙⲟⲩ ⲉ̀ⲣⲟⲕ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲟⲩⲛⲓϣϯ ⲛ̀ⲧⲁⲫ̀ⲙⲏⲓ: ⲡⲓⲣⲉϥϯ­ϩⲁⲡ ⲙ̀ⲙⲏⲓ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲡⲉⲕⲣⲁⲛ ⲉⲧⲥ̀ⲙⲁⲣⲱⲟⲩⲧ: ⲱ̀ ⲡⲓⲗⲟⲅⲟⲥ ⲛ̀ⲧⲁⲫ̀ⲙⲏⲓ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲣⲱⲓⲥ ⲉ̀ⲡⲟⲛ ⲱ̀ Ⲡⲭ̅ⲥ̅: ϧⲉⲛ ⲧⲉⲕⲙⲉⲧⲁ̀ⲅⲁⲑⲟⲥ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲥⲱⲧⲉⲙ ⲉ̀ⲛⲓⲡⲉϥⲉ­ⲣⲛⲟⲃⲓ: ϧⲉⲛ ⲛⲟⲩⲁ̀ⲛⲁⲅⲕⲏ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲧⲁⲯⲩⲭⲏ ⲛⲉⲙ ⲡⲁⲛⲟⲩⲥ: ⲱ̀ⲗⲟⲩ ⲉⲟⲩⲣⲁⲛ­ⲟⲥ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲩⲥ̅ Ⲑⲥ̅ Ⲡⲉⲛⲛⲟⲩϯ: ⲙⲟⲓ ⲛⲁⲛ ⲛ̀ⲟⲩⲥⲱϯ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲫϯ ⲡⲓⲛⲁⲏⲧ: ⲡⲓⲣⲉϥⲱ­ⲟⲩⲛ̀ϩⲏⲧ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲭ̀ⲟⲩⲁⲃ ⲭⲭ̀ⲟⲩⲁⲃ ⲭ̀ⲭⲟⲩⲁⲃ: ⲡ̀ϣⲏⲣⲓ ⲙ̀Ⲫⲏ̅̅ⲉ̅ⲑ̅ⲩ̅: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲯⲩⲭ⏢ ⲛ̀ⲛⲉⲛⲓⲟϯ: ⲙⲁⲙ̀ⲧⲟⲛ ⲛⲱⲟⲩ ⲱ̀ ⲡⲓⲣⲉϥⲥ­ⲱϯ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲱ ⲡⲉⲛⲛⲏⲃ ⲣ̀ⲓⲡⲉⲛⲙⲉ­ⲩⲓ̀: ϧⲉⲛ ⲧⲉⲕⲙⲉⲧ­ⲟⲩⲣⲟ ⲛ̀ⲛⲁ ⲛⲓⲫⲏⲟⲩⲓ̀: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.",
      arabicTranslation:
        "قلبي ولساني: للثالوث يسبحان : أيها الثالوث : القدوس إرحمنا.\n\nكل أحد يسبحك : ويتعبد لك : أيها الثالوث : القدوس إرحمنا.\n\nلأنك أنت إلهنا : مخلصنا العظيم: أيها الثالوث : القدوس إرحمنا.\n\nأيها السيد الرب: أتى وخلصنا : أيها الثالوث : القدوس إرحمنا.\n\nمن أجل أحكامك: الحقيقية علمني عدلك: أيها الثالوث : القدوس إرحمنا.\n\nكثيرة هي رحمتك: تعهدنا بخلاصك: أيها الثالوث : القدوس إرحمنا.\n\nهوذا أنا ألتجأت: إليك: أيها الثالوث : القدوس إرحمنا.\n\nلك القوة والمجد: يا ملك المجد: أيها الثالوث : القدوس إرحمنا.\n\nيسوع هو رجاؤنا: في شدائدنا: أيها الثالوث : القدوس إرحمنا.\n\nتباركت يا أبن الله: نجنا من التجارب: أيها الثالوث : القدوس إرحمنا.\n\nكل الشعوب تسبحك: ايها الملك المسيح: أيها الثالوث : القدوس إرحمنا.\n\nأعطنا سلامك: إشف أمراضنا: أيها الثالوث : القدوس إرحمنا.\n\nأنت المتحنن وأنت الرحوم: أيها الثالوث : القدوس إرحمنا.\n\nتباركت أنت نسبحك ونباركك: أيها الثالوث : القدوس إرحمنا.\n\nعظيم بالحقيقة: الديان العادل: أيها الثالوث : القدوس إرحمنا.\n\nإسمك مبارك: أيها الكلمة الحقيقي: أيها الثالوث : القدوس إرحمنا.\n\nأحرسنا أيها المسيح: بصلاحك: أيها الثالوث : القدوس إرحمنا.\n\nإسمع الخطاة: في شدائدهم: أيها الثالوث : القدوس إرحمنا.\n\nنفسي وعقلي: إرفعهما إلى السماء: أيها الثالوث : القدوس إرحمنا.\n\nيا إبن الله إلهنا: أعطنا خلاصًا: أيها الثالوث : القدوس إرحمنا.\n\nالله الرحوم: طويل الأناة: أيها الثالوث : القدوس إرحمنا.\n\nقدوس قدوس قدوس: يا أبن القدوس: أيها الثالوث : القدوس إرحمنا.\n\nأباؤنا الراقدون: نيحهم أيها المخلص: أيها الثالوث : القدوس إرحمنا.\n\nيا ملكنا أذكرنا: في ملكوتك السماوي : أيها الثالوث  : القدوس إرحمنا.",
    },
    {
      id: "hs3",
      title:
        "مرد الابركسيس الأحد الأول (شيري غابرييل بي نيشتي ان ارشي انجيلوس) ",
      url: `${BASE_URL}/Phigh-3 By1zw6.mp4`,
      copticArabic:
        "شيرى غابرييل : بى نيشتى إن أرشى أنجيلوس : شيرى فى إيطاف هى شينوفى : إم ماريا تى بارثينوس .",
      copticcoptic:
        "Ⲭⲉⲣⲉ Ⲅⲁⲃⲣⲓⲏⲗ: ⲡⲓⲛⲓϣϯ ⲛ̀ⲁⲣⲭⲏⲁⲅⲅⲉⲗⲟⲥ: ⲭⲉⲣⲉ ⲫⲏⲉ̀ⲧⲁϥϩⲓϣⲉⲛⲛⲟⲩϥⲓ: ⲙ̀Ⲙⲁⲣⲓⲁ Ϯⲡⲁⲣⲑⲉⲛⲟⲥ.",
      arabicTranslation:
        "السلام لغبريال ، رئيس الملائكة العظيم ، السلام للذى بشر ، مريم العذراء .",
      hazzatImage: "/photos/شيريه غابرييل بي نيشتي.png",
    },
  ],
};

// ======================================================================
// أيقونة الترس (Gear Icon SVG Component)
// ======================================================================
function GearIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// --- المكون الرئيسي ---
export default function PreparatoryPage() {
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [fullscreenLyrics, setFullscreenLyrics] = useState<Video | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("videos");

  const [showCopticArabic, setShowCopticArabic] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [showCoptic, setShowCoptic] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [showHazzat, setShowHazzat] = useState(false);
  const [_rotateFromSidebar, setRotateFromSidebar] = useState(false);
  const [showControlsPanel, setShowControlsPanel] = useState(false);

  // حالات مودال الفيديو
  const [showVideoInModal, setShowVideoInModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [videoTime, setVideoTime] = useState<Record<string, number>>({});
  const [expandedIndices, setExpandedIndices] = useState<
    Record<number, boolean>
  >({});

  // ====== حالة تحريك الفيديو ======
  const [videoPosition, setVideoPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [, setWasJustDragging] = useState(false);

  // ====== Ref للإغلاق الذكي عند النقر خارج القائمة ======
  const controlsPanelRef = useRef<HTMLDivElement>(null);

  // ====== useEffect للإغلاق الذكي (Click Outside to Close) ======
  useEffect(() => {
    if (!showControlsPanel) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        controlsPanelRef.current &&
        !controlsPanelRef.current.contains(event.target as Node)
      ) {
        setShowControlsPanel(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showControlsPanel]);

  const hazzatImagesCount = useMemo(() => {
    if (!fullscreenLyrics) return 0;
    return [
      fullscreenLyrics.hazzatImage,
      fullscreenLyrics.hazzatImage2,
      fullscreenLyrics.hazzatImage3,
    ].filter(Boolean).length;
  }, [fullscreenLyrics]);

  // --- دالة لاستخراج روابط الفيديو لمرحلة محددة ---
  const getStageVideoUrls = (stageKey: string): string[] => {
    const videos = preparatoryVideos[stageKey] || [];
    return videos.map((v) => v.url).filter(Boolean);
  };

  // تخزين مسبق للفيديوهات عند اختيار مرحلة
  useEffect(() => {
    if (selectedStage) {
      const urls = getStageVideoUrls(selectedStage);
      if (urls.length > 0) {
        console.log(
          "[Preparatory] تخزين فيديوهات المرحلة:",
          selectedStage,
          urls.length,
          "فيديو",
        );
        prewarmVideos(urls);
      }
    }
  }, [selectedStage]);

  // ====== Memoized handlers for performance ======
  const handleStageSelect = useCallback((stageKey: string) => {
    setSelectedStage(stageKey);
    setViewMode("videos");
  }, []);

  const stageKey = useMemo(() => {
    if (!selectedStage) return null;
    if (selectedStage === "رابعة وخامسة وسادسة")
      return STAGE_KEYS.FOURTH_FIFTH_SIXTH;
    if (selectedStage === "اعدادي وثانوي") return STAGE_KEYS.MIDDLE_HIGH;
    return null;
  }, [selectedStage]);

  const riteContent = useMemo(() => {
    if (viewMode === "rites" && stageKey && preparatoryData[stageKey]) {
      return preparatoryData[stageKey].first || [];
    }
    return [];
  }, [viewMode, stageKey]);

  // ====== Memoized computed values ======
  const visibleColumns = useMemo(
    () => [showCopticArabic, showArabic, showCoptic].filter(Boolean).length,
    [showCopticArabic, showArabic, showCoptic],
  );

  const disabledColumns = useMemo(() => 3 - visibleColumns, [visibleColumns]);
  const maxFontSize = 20 + disabledColumns * 2;

  // ====== دوال تحريك الفيديو ======
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!("touches" in e)) e.preventDefault();
    e.stopPropagation();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragOffset({
      x: clientX - videoPosition.x,
      y: clientY - videoPosition.y,
    });
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    if (!("touches" in e)) e.preventDefault();
    e.stopPropagation();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;
    const videoWidth = isMinimized
      ? 64
      : Math.min(window.innerWidth * 0.85, 320);
    const videoHeight = isMinimized ? 64 : 180;
    const padding = 10;
    setVideoPosition({
      x: Math.max(
        padding,
        Math.min(newX, window.innerWidth - videoWidth - padding),
      ),
      y: Math.max(
        padding,
        Math.min(newY, window.innerHeight - videoHeight - padding),
      ),
    });
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setWasJustDragging(true);
      setTimeout(() => setWasJustDragging(false), 100);
    }
    setIsDragging(false);
  };

  const handleExpandVideo = () => {
    if (!isMinimized || isDragging) return;
    const videoWidth = Math.min(window.innerWidth * 0.85, 320);
    const videoHeight = 180;
    const padding = 10;
    let newX = Math.min(
      videoPosition.x,
      window.innerWidth - videoWidth - padding,
    );
    let newY = Math.min(
      videoPosition.y,
      window.innerHeight - videoHeight - padding,
    );
    if (newX !== videoPosition.x || newY !== videoPosition.y)
      setVideoPosition({ x: newX, y: newY });
    setIsMinimized(false);
  };

  const increaseFontSize = () =>
    setFontSize((prev) => Math.min(prev + 1, maxFontSize));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 1, 14));

  useEffect(() => {
    setFontSize((prev) => Math.min(prev, maxFontSize));
  }, [maxFontSize]);

  const showRiteToggle =
    selectedStage === "رابعة وخامسة وسادسة" ||
    selectedStage === "اعدادي وثانوي";

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white font-sans">
      <style dangerouslySetInnerHTML={{ __html: copticStyles }} />
      <Header />
      <main className="flex-1 page-bg-setup bg-melodies relative">
        <div className="bg-overlay" />
        <div className="relative z-10 pb-10">
          <div className="bg-gradient-to-b from-blue-900/30 to-transparent py-10 px-4 text-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-3">
              المنهج التمهيدي
            </h1>
            <p className="text-gray-400">
              {selectedStage
                ? `مرحلة: ${STAGES.find((s) => s.key === selectedStage)?.label}`
                : "اختر مرحلتك لعرض المحتوى"}
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            {/* Stage Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {STAGES.map((stage) => (
                <button
                  key={stage.key}
                  onClick={() => handleStageSelect(stage.key)}
                  className={`px-5 py-3 rounded-xl font-bold text-sm md:text-base transition-all border-2 ${
                    selectedStage === stage.key
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105"
                      : "bg-gray-900 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            {showRiteToggle && (
              <div className="flex justify-center mb-10">
                <div className="flex bg-gray-900/50 p-1 rounded-2xl border border-white/5">
                  <button
                    onClick={() => setViewMode("videos")}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${
                      viewMode === "videos"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    فيديوهات الألحان
                  </button>
                  <button
                    onClick={() => setViewMode("rites")}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${
                      viewMode === "rites"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    طقس الألحان
                  </button>
                </div>
              </div>
            )}

            {/* Content Area */}
            {!selectedStage ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-7xl mb-6 opacity-30">🎵</div>
                <p className="text-gray-500 text-xl">
                  اختر مرحلة من الأعلى للبدء
                </p>
              </div>
            ) : viewMode === "videos" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {preparatoryVideos[selectedStage]?.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl hover:border-blue-500/20 transition-all"
                  >
                    <div className="aspect-video bg-black relative">
                      {video.url ? (
                        <LazyVideo
                          src={video.url}
                          title={video.title}
                          startTime={videoTime[video.id] || 0}
                          onTimeUpdate={(time) =>
                            setVideoTime((prev) => ({
                              ...prev,
                              [video.id]: time,
                            }))
                          }
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600">
                          <span className="text-4xl mb-2">🎬</span>
                          <p className="italic">متاح قريباً</p>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-4 text-white leading-relaxed">
                        {video.title}
                      </h3>
                      <button
                        onClick={() => setFullscreenLyrics(video)}
                        className="w-full py-3 bg-blue-600/10 text-blue-400 border border-blue-600/30 rounded-xl font-bold hover:bg-blue-600/20 transition-all"
                      >
                        عرض كلمات اللحن
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {riteContent.length === 0 ? (
                  <div className="col-span-full text-center p-8 bg-gray-800 rounded-xl border border-blue-500/30">
                    <div className="text-5xl mb-4">📖</div>
                    <p className="text-gray-400">لا يوجد محتوى لهذه المرحلة</p>
                  </div>
                ) : (
                  riteContent.map((item: PreparatoryItem, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl hover:border-blue-500/30 transition-all flex flex-col"
                    >
                      <div className="p-6 flex flex-col h-full">
                        <h3 className="text-xl font-bold text-blue-400 mb-6 min-h-[3.5rem] flex items-center">
                          {item.title}
                        </h3>
                        <button
                          onClick={() =>
                            setExpandedIndices((prev) => ({
                              ...prev,
                              [index]: !prev[index],
                            }))
                          }
                          className={`w-full py-3 rounded-xl font-bold transition-all mb-4 ${
                            expandedIndices[index]
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-blue-600/10 text-blue-400 border border-blue-600/30 hover:bg-blue-600/20"
                          }`}
                        >
                          {expandedIndices[index]
                            ? "إخفاء طقس اللحن"
                            : "عرض طقس اللحن"}
                        </button>
                        {expandedIndices[index] && item.content && (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="h-px bg-white/10 mb-4" />
                            <p
                              className="text-gray-300 leading-relaxed whitespace-pre-line coptic-content"
                              dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ================================================================
          مودال نصوص اللحن
      ================================================================ */}
      {fullscreenLyrics && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden">
          {/* ============================================================
              الهيدر - أيقونة الترس مع الأنيميشن والإغلاق الذكي
          ============================================================ */}
          <header className="sticky top-0 z-50 p-3 md:p-4 bg-gray-900 border-b border-white/10 flex items-center gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* حاوية الترس مع الـ Ref للإغلاق الذكي */}
              <div className="relative" ref={controlsPanelRef}>
                {/* زر أيقونة الترس مع أنيميشن الدوران */}
                <button
                  onClick={() => setShowControlsPanel((prev) => !prev)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border active:scale-90 ${
                    showControlsPanel
                      ? "bg-blue-600/30 border-blue-400/60 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                      : "bg-gray-900/90 border-blue-500/30 text-blue-400 hover:bg-gray-800 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  }`}
                  aria-label="إعدادات العرض"
                  title="إعدادات العرض"
                >
                  {/* الترس يدور 90 درجة عند الفتح بـ spring animation */}
                  <motion.div
                    animate={{ rotate: showControlsPanel ? 90 : 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 180 }}
                  >
                    <GearIcon className="w-5 h-5" />
                  </motion.div>
                </button>

                {/* القائمة المنسدلة مع التجاوب الكامل رأسي/أفقي */}
                <AnimatePresence>
                  {showControlsPanel && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: -16, x: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -16, x: 8 }}
                      transition={{
                        type: "spring",
                        damping: 22,
                        stiffness: 320,
                      }}
                      className="
                        absolute top-full mt-3 right-0 z-30
                        bg-gray-900/98 border border-blue-500/20 rounded-2xl
                        shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl

                        flex flex-col gap-5 p-5
                        w-72 max-w-[92vw]

                        [@media(orientation:landscape)]:flex-row
                        [@media(orientation:landscape)]:gap-4
                        [@media(orientation:landscape)]:p-4
                        [@media(orientation:landscape)]:w-[92vw]
                        [@media(orientation:landscape)]:max-w-[820px]
                        [@media(orientation:landscape)]:items-start
                        [@media(orientation:landscape)]:overflow-x-auto
                      "
                    >
                      {/* رأس القائمة */}
                      <div
                        className="
                        flex items-center justify-between border-b border-white/5 pb-3
                        [@media(orientation:landscape)]:border-b-0
                        [@media(orientation:landscape)]:border-r
                        [@media(orientation:landscape)]:pb-0
                        [@media(orientation:landscape)]:pr-4
                        [@media(orientation:landscape)]:flex-col
                        [@media(orientation:landscape)]:items-start
                        [@media(orientation:landscape)]:gap-2
                        [@media(orientation:landscape)]:flex-shrink-0
                      "
                      >
                        <div className="flex items-center gap-2">
                          {/* ترس صغير يدور باستمرار في رأس القائمة */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <GearIcon className="w-3.5 h-3.5 text-blue-400" />
                          </motion.div>
                          <span className="text-sm font-bold text-gray-100 tracking-wide whitespace-nowrap">
                            إعدادات العرض
                          </span>
                        </div>
                        <button
                          onClick={() => setShowControlsPanel(false)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 hover:bg-red-900/40 hover:text-red-400 transition-colors text-gray-400 text-xs"
                        >
                          ✕
                        </button>
                      </div>

                      {/* --- قسم حجم الخط --- */}
                      <div
                        className="
                        flex flex-col gap-3
                        [@media(orientation:landscape)]:flex-shrink-0
                        [@media(orientation:landscape)]:min-w-[140px]
                      "
                      >
                        <label className="text-[11px] uppercase tracking-widest text-blue-400 font-bold px-1">
                          حجم الخط
                        </label>
                        <div className="flex items-center gap-3 bg-gray-800/50 p-1.5 rounded-xl border border-white/5">
                          <button
                            onClick={decreaseFontSize}
                            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 active:scale-95 rounded-lg flex items-center justify-center transition-all shadow-lg flex-shrink-0"
                          >
                            <span className="text-xl font-bold text-blue-400">
                              −
                            </span>
                          </button>
                          <div className="flex-1 text-center">
                            <span className="text-lg font-mono font-bold text-white">
                              {fontSize}
                            </span>
                            <span className="text-[10px] block text-gray-500">
                              px
                            </span>
                          </div>
                          <button
                            onClick={increaseFontSize}
                            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 active:scale-95 rounded-lg flex items-center justify-center transition-all shadow-lg flex-shrink-0"
                          >
                            <span className="text-xl font-bold text-blue-400">
                              +
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* --- قسم اللغات --- */}
                      <div
                        className="
                        flex flex-col gap-3 flex-1
                        [@media(orientation:landscape)]:min-w-[170px]
                      "
                      >
                        <label className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold px-1">
                          اللغات المفعلة
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            {
                              state: showArabic,
                              setter: setShowArabic,
                              label: "اللغة العربية",
                              activeClass:
                                "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]",
                              dotClass:
                                "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
                            },
                            {
                              state: showCopticArabic,
                              setter: setShowCopticArabic,
                              label: "قبطي معرَّب",
                              activeClass:
                                "bg-emerald-600/20 border-emerald-500/50 text-emerald-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]",
                              dotClass:
                                "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]",
                            },
                            {
                              state: showCoptic,
                              setter: setShowCoptic,
                              label: "اللغة القبطية",
                              activeClass:
                                "bg-indigo-600/20 border-indigo-500/50 text-indigo-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]",
                              dotClass:
                                "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]",
                            },
                          ].map((lang) => (
                            <button
                              key={lang.label}
                              onClick={() => lang.setter(!lang.state)}
                              className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 border ${
                                lang.state
                                  ? lang.activeClass
                                  : "bg-gray-800/40 border-gray-700/50 text-gray-500 hover:bg-gray-800 hover:border-gray-600"
                              }`}
                            >
                              <span>{lang.label}</span>
                              <div
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  lang.state ? lang.dotClass : "bg-gray-700"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* --- قسم الأدوات --- */}
                      <div
                        className="
                        flex flex-col gap-2 pt-2 border-t border-white/5
                        [@media(orientation:landscape)]:border-t-0
                        [@media(orientation:landscape)]:pt-0
                        [@media(orientation:landscape)]:flex-shrink-0
                        [@media(orientation:landscape)]:min-w-[150px]
                      "
                      >
                        <label className="text-[11px] uppercase tracking-widest text-orange-400 font-bold px-1">
                          الأدوات
                        </label>

                        {hazzatImagesCount > 0 && (
                          <button
                            onClick={() => setShowHazzat(!showHazzat)}
                            className={`w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-500 ${
                              showHazzat
                                ? "bg-yellow-600 text-white shadow-lg shadow-yellow-900/20"
                                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-95"
                            }`}
                          >
                            <span className="text-sm animate-bounce">🎵</span>
                            <span>
                              {showHazzat ? "إخفاء الهزات" : "عرض هزات اللحن"}
                            </span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const btn = document.getElementById(
                              "landscape-toggle-button",
                            ) as HTMLButtonElement | null;
                            if (btn) {
                              btn.click();
                              setRotateFromSidebar((prev) => !prev);
                            }
                          }}
                          className="w-full px-4 py-2.5 rounded-xl font-bold text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-all flex items-center justify-center gap-2"
                        >
                          <span className="text-sm">🔄</span>
                          تدوير الشاشة
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* نهاية حاوية الترس */}

              {/* زر تشغيل الفيديو المدمج */}
              {fullscreenLyrics.url && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowVideoInModal((prev) => !prev)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      showVideoInModal
                        ? "bg-red-600/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    } border active:scale-90`}
                    title={showVideoInModal ? "إخفاء الفيديو" : "تشغيل اللحن"}
                  >
                    <span className="text-base">
                      {showVideoInModal ? "✕" : "▶️"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <h2 className="text-blue-400 font-bold text-sm md:text-lg flex-1 text-center md:text-right">
              {fullscreenLyrics.title}
            </h2>

            <button
              onClick={() => {
                setFullscreenLyrics(null);
                setShowHazzat(false);
                setShowVideoInModal(false);
                setIsMinimized(false);
                setIsVideoPlaying(false);
                setRotateFromSidebar(false);
                setShowControlsPanel(false);
              }}
              className="text-2xl md:text-3xl p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </header>
          {/* ============================================================
              نهاية الهيدر
          ============================================================ */}

          <div className="relative flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-gray-950 p-2 md:p-6 relative scroll-smooth">
              <div className="w-full max-w-7xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {showVideoInModal && fullscreenLyrics?.url && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.5,
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 150,
                      }}
                      className={`fixed z-[60] shadow-2xl ${
                        isMinimized
                          ? "w-16 h-16 rounded-full cursor-pointer overflow-hidden border-2 border-blue-500 hover:scale-110 transition-all duration-300"
                          : "w-[70vw] max-w-[320px] md:max-w-[400px]"
                      } ${
                        isMinimized
                          ? isVideoPlaying
                            ? "animate-video-pulse-active"
                            : "animate-video-pulse-paused"
                          : ""
                      }`}
                      style={{
                        left: videoPosition.x,
                        top: videoPosition.y,
                        transition: isDragging ? "none" : "all 0.3s ease",
                        cursor: isDragging
                          ? "grabbing"
                          : isMinimized
                            ? "pointer"
                            : "grab",
                      }}
                      onMouseDown={handleDragStart}
                      onMouseMove={handleDragMove}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                      onTouchStart={handleDragStart}
                      onTouchMove={handleDragMove}
                      onTouchEnd={handleDragEnd}
                      onClick={handleExpandVideo}
                      onTap={handleExpandVideo}
                    >
                      <div
                        className={`relative rounded-2xl overflow-hidden border border-blue-500/30 bg-black shadow-[0_0_30px_rgba(0,0,0,0.5)] group ${
                          isMinimized ? "aspect-square" : "aspect-video"
                        }`}
                      >
                        {!isMinimized && (
                          <div
                            className={`absolute top-2 right-2 z-20 opacity-50 hover:opacity-80 transition-opacity cursor-move ${
                              isDragging ? "opacity-80" : ""
                            }`}
                            title="اسحب لتحريك الفيديو"
                          >
                            <svg
                              className="w-5 h-5 text-white/70"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </div>
                        )}
                        <div
                          className={`w-full h-full ${
                            isMinimized
                              ? "absolute opacity-0 pointer-events-none"
                              : "block"
                          }`}
                        >
                          <LazyVideo
                            key={fullscreenLyrics.id}
                            src={fullscreenLyrics.url}
                            title={fullscreenLyrics.title}
                            startTime={videoTime[fullscreenLyrics.id] || 0}
                            onTimeUpdate={(time) =>
                              setVideoTime((prev) => ({
                                ...prev,
                                [fullscreenLyrics.id]: time,
                              }))
                            }
                            onPlayChange={setIsVideoPlaying}
                          />
                        </div>

                        {!isMinimized ? (
                          <div className="absolute top-2 left-2 flex gap-2 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsMinimized(true);
                              }}
                              className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-blue-600/80 md:bg-blue-600/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-blue-600/80 transition-colors"
                              title="تصغير"
                            >
                              <svg
                                className="w-5 h-5 md:w-4 md:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowVideoInModal(false);
                              }}
                              className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-red-600/80 md:bg-red-600/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-red-600/80 transition-colors"
                              title="إغلاق"
                            >
                              <svg
                                className="w-5 h-5 md:w-4 md:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
                              isVideoPlaying
                                ? "bg-blue-600/30"
                                : "bg-gray-800/80 grayscale"
                            }`}
                          >
                            <span
                              className={`text-2xl transition-transform duration-300 ${
                                isVideoPlaying
                                  ? "scale-110"
                                  : "scale-90 opacity-50"
                              }`}
                            >
                              {isVideoPlaying ? "🎶" : "▶️"}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {(() => {
                  const coptic = (fullscreenLyrics.copticcoptic || "").split(
                    /\n\s*\n/,
                  );
                  const copticAr = (fullscreenLyrics.copticArabic || "").split(
                    /\n\s*\n/,
                  );
                  const arabic = (
                    fullscreenLyrics.arabicTranslation || ""
                  ).split(/\n\s*\n/);
                  const maxParts = Math.max(
                    coptic.length,
                    copticAr.length,
                    arabic.length,
                  );

                  const getNumberFromTitle = (title: string) => {
                    if (!title) return null;
                    const digitMatch = title.match(/\d+/);
                    if (digitMatch) return parseInt(digitMatch[0]);
                    const arabicNumbers: Record<string, number> = {
                      الأولى: 1,
                      الأول: 1,
                      الثانية: 2,
                      الثاني: 2,
                      الثالثة: 3,
                      الثالث: 3,
                      الرابعة: 4,
                      الرابع: 4,
                      الخامسة: 5,
                      الخامس: 5,
                      السادسة: 6,
                      السادس: 6,
                      السابعة: 7,
                      السابع: 7,
                      الثامنة: 8,
                      الثامن: 8,
                      التاسعة: 9,
                      التاسع: 9,
                      العاشرة: 10,
                      العاشر: 10,
                    };
                    for (const [key, value] of Object.entries(arabicNumbers)) {
                      if (title.includes(key)) return value;
                    }
                    return null;
                  };

                  let currentQuarter = 0;

                  const isPsalm150Full =
                    fullscreenLyrics.title &&
                    fullscreenLyrics.title.includes("المزمور ال150") &&
                    fullscreenLyrics.title.includes("الهوس الرابع");

                  const disableQuarterNumbers =
                    !isPsalm150Full && maxParts <= 3;

                  return Array.from({ length: maxParts }).map((_, i) => {
                    const arText = arabic[i] || "";
                    const caText = copticAr[i] || "";
                    const cText = coptic[i] || "";
                    const headerSource = arText || caText || cText;

                    const isAfEranav =
                      isPsalm150Full &&
                      (headerSource.includes("اف ايراناف") ||
                        headerSource.includes("Ⲉϥⲉ̀ⲣⲁⲛⲁϥ"));

                    const isSectionHeader =
                      !isAfEranav &&
                      (headerSource.includes("القطعة") ||
                        headerSource.includes("المزمور"));

                    if (!disableQuarterNumbers) {
                      if (isSectionHeader) {
                        currentQuarter = 0;
                      } else if (!isAfEranav) {
                        currentQuarter += 1;
                      }
                    }

                    const quarterNumber =
                      disableQuarterNumbers || isSectionHeader || isAfEranav
                        ? null
                        : currentQuarter;

                    const colorReferenceNumber = isSectionHeader
                      ? getNumberFromTitle(arabic[i] || "")
                      : quarterNumber;

                    const isPsali =
                      fullscreenLyrics.title &&
                      (fullscreenLyrics.title.includes("ابصالية") ||
                        fullscreenLyrics.title.includes("إبصالية"));

                    let isEvenRow = false;
                    if (colorReferenceNumber !== null) {
                      if (isPsali) {
                        isEvenRow =
                          Math.floor((colorReferenceNumber - 1) / 2) % 2 === 1;
                      } else {
                        isEvenRow = colorReferenceNumber % 2 === 0;
                      }
                    }

                    const quarterColorClass =
                      colorReferenceNumber === null
                        ? ""
                        : isEvenRow
                          ? "lyrics-row-even"
                          : "lyrics-row-odd";

                    return (
                      <div
                        key={i}
                        className={`lyrics-row ${
                          isSectionHeader ? "lyrics-row-section" : ""
                        } ${quarterColorClass}`}
                        style={{ ["--grid-columns" as any]: visibleColumns }}
                      >
                        {quarterNumber !== null && (
                          <div className="lyrics-quarter">
                            <div className="lyrics-quarter-badge">
                              {quarterNumber}
                            </div>
                          </div>
                        )}

                        {showCopticArabic && (
                          <div
                            dir="rtl"
                            lang="ar-EG"
                            className={`lyrics-col lyrics-col-coptic-arabic ${
                              isSectionHeader ? "lyrics-section-text" : ""
                            }`}
                            style={{ ["--font-size" as any]: `${fontSize}px` }}
                          >
                            {copticAr[i] || "-"}
                          </div>
                        )}
                        {showCoptic && (
                          <div
                            dir="ltr"
                            lang="cop"
                            className={`lyrics-col lyrics-col-coptic ${
                              isSectionHeader ? "lyrics-section-text" : ""
                            }`}
                            style={{ ["--font-size" as any]: `${fontSize}px` }}
                          >
                            {coptic[i] || "-"}
                          </div>
                        )}
                        {showArabic && (
                          <div
                            dir="rtl"
                            lang="ar"
                            className={`lyrics-col lyrics-col-arabic ${
                              isSectionHeader ? "lyrics-section-text" : ""
                            }`}
                            style={
                              {
                                "--font-size": `${fontSize + 3}px`,
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontFamily:
                                  "'Amiri', 'Traditional Arabic', 'Simplified Arabic', serif",
                              } as React.CSSProperties & {
                                "--font-size": string;
                              }
                            }
                          >
                            {arabic[i] || "-"}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}

                {showHazzat &&
                  (fullscreenLyrics.hazzatImage ||
                    fullscreenLyrics.hazzatImage2 ||
                    fullscreenLyrics.hazzatImage3) && (
                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-gradient-to-r from-purple-900/30 to-yellow-900/30 border border-purple-500/30 rounded-xl p-4 mb-6">
                        <h3 className="text-2xl font-bold text-center text-yellow-400 flex items-center justify-center gap-3">
                          <span className="text-3xl">🎵</span>
                          هزات اللحن
                          <span className="text-3xl">🎵</span>
                        </h3>
                      </div>
                      <div className="w-full overflow-hidden">
                        <div className="flex flex-col items-stretch m-0 p-0 leading-none text-[0]">
                          {fullscreenLyrics.hazzatImage && (
                            <img
                              src={fullscreenLyrics.hazzatImage}
                              alt="هزات اللحن - الصورة الأولى"
                              className="block w-full h-auto object-contain m-0 p-0 select-none pointer-events-none align-top -mt-px first:mt-0"
                              draggable={false}
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                          {fullscreenLyrics.hazzatImage2 && (
                            <img
                              src={fullscreenLyrics.hazzatImage2}
                              alt="هزات اللحن - الصورة الثانية"
                              className="block w-full h-auto object-contain m-0 p-0 select-none pointer-events-none align-top -mt-px first:mt-0"
                              draggable={false}
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                          {fullscreenLyrics.hazzatImage3 && (
                            <img
                              src={fullscreenLyrics.hazzatImage3}
                              alt="هزات اللحن - الصورة الثالثة"
                              className="block w-full h-auto object-contain m-0 p-0 select-none pointer-events-none align-top -mt-px first:mt-0"
                              draggable={false}
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
