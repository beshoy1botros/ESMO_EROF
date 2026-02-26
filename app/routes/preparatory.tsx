import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LazyVideo from "../components/LazyVideo";
import "../styles/melodies.css";
import "../styles/mobile-improvements.css";
import { prewarmVideos } from "../utils/swClient";

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

// --- المراحل المتاحة ---
const STAGES = [
  { key: "حضانة", label: "حضانة", icon: "🌱" },
  { key: "اولي وتانيه وثالثة", label: "أولى وثانية وثالثة", icon: "📚" },
  { key: "رابعة وخامسة وسادسة", label: "رابعة وخامسة وسادسة", icon: "🎓" },
  { key: "اعدادي وثانوي", label: "إعدادي وثانوي", icon: "🏆" },
];

const BASE_URL =
  "https://res.cloudinary.com/dzetwllwd/video/upload/v1771085727";

// --- بيانات الفيديوهات ---
const preparatoryVideos: StageVideos = {
  حضانة: [
    {
      id: "k1",
      title: "لحن أجيوس السنوي",
      url: `${BASE_URL}/Hadana-1-4_t4uuq6.mp4`,
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
      url: `${BASE_URL}/T_Hadana-2_hthdv5.mp4`,
      copticArabic:
        "إري إبسول سيل إم ماريام : خين ني فيؤوي إتصا إبشوي : صا أووينام إمبيس مينريت :إس طوبه إمموف إ إهري إجون\n\nكاطا إفريتي إطاف جوس :إنجيه دافيد خين بي بسالموس : جيه أس أوهي إراتس إنجيه تي أوورو :صا أووينام إمموك إب أوورو\n\nسولومون مووتي إروس :خين بي جو إنتيه ني جو :جيه طاسوني أووه طا إشفيري :طا بوليس إممي ييروساليم\n\nأفتي ميني غار إروس :خين هان ميش إنران إفتشوسي جيه أمي إفول خين بيكيبوس : أو ثي إتسوتب إن أروماطا\n\nشيري ني أو تي بارثينوس : تي أوورو إممي إن أليثيني : شيري إبشووشوو إنتيه بين جينوس : أري إجفو نان إن إممانوئيل\n\nتين تيهو أري بين ميفي : أوتي بروستاتيس إتينهوت : ناهرين بين تشويس إيسوس بي خريستوس : إنتيف كا نين نوفي نان إيفول",
      copticcoptic:
        "Ⲉ̀ⲣⲉ ⲡ̀ⲥⲟⲗⲥⲉⲗ ⲙ̀Ⲙⲁⲣⲓⲁⲙ: ϧⲉⲛ ⲛⲓⲫⲏⲟⲩⲓ̀ ⲉⲧ̀ⲥⲁ̀ⲡ̀ϣⲱⲓ ⲥⲁⲟⲩⲓ̀ⲛⲁⲙ ⲙ̀ⲡⲉⲥⲙⲉⲛⲣⲓⲧ: ⲉ̀ⲥⲧⲱⲃϩ ⲙ̀ⲙⲟϥ ⲉ̀ϩ̀ⲣⲏⲓ ⲉ̀ϫⲱⲛ.\n\n+ Ⲕⲁⲧⲁ ⲫ̀ⲣⲏϯ ⲉ̀ⲧⲁϥϫⲟⲥ: ⲛ̀ϫⲉ Ⲇⲁⲩⲓⲇ ϧⲉⲛ ⲡⲓⲯ̀ⲁⲗⲟⲙⲥ: ϫⲉ ⲁⲥⲟ̀ϩⲓ ⲉ̀ⲣⲁⲧⲥ ⲛ̀ϫⲉ ϯⲟⲩⲣⲱ: ⲥⲁⲟⲩⲓ̀ⲛⲁⲙ ⲙ̀ⲙⲟⲕ ⲡ̀Ⲟⲩⲣⲟ.\n\nⲤⲟⲗⲟⲙⲱⲛ ⲙⲟⲩϯ ⲉⲣⲟⲥ: ϧⲉⲛ ⲡⲓϫⲱ ⲛ̀ⲧⲉ ⲛⲓϫⲱ: ϫⲉ ⲧⲁⲥⲱⲛⲓ ⲟⲩⲟϩ ⲧⲁϣ̀ⲫⲉⲣⲓ: ⲧⲁⲡⲟⲗⲓⲥ ⲙ̀ⲙⲏⲓ Ⲓⲉⲣⲟⲩⲥⲁⲗⲏⲙ.\n\n+ Ⲁϥϯⲙⲏⲓⲛⲓ ⲅⲁⲣ ⲉ̀ⲣⲟⲥ: ϧⲉⲛ ϩⲁⲛⲙⲏϣ ⲛ̀ⲣⲁⲛ ⲉⲩϭⲟⲥⲓ: ϫⲉ ⲁ̀ⲙⲏ ⲉ̀ⲃⲟⲗϧⲉⲛ ⲡⲉⲕⲏ̀ⲡⲟⲥ: ⲱ̀ ⲑⲏⲉ̀ⲧⲁⲥⲱⲧⲡ ⲛ̀ⲁ̀ⲣⲱⲙⲁⲧⲁ.\n\nⲬⲉⲣⲉ ⲛⲉ ⲱ̀ ϯⲠⲁⲣⲑⲉⲛⲟⲥ: ϯⲟⲩⲣⲱ ⲙ̀ⲙⲏⲓ ⲛ̀ⲁ̀ⲗⲏⲑⲓⲛⲏ: ⲭⲉⲣⲉ ⲡ̀ϣⲟⲩϣⲟⲩ ⲛ̀ⲧⲉ ⲡⲉⲛⲅⲉⲛⲟⲥ: ⲁⲣⲉϫ̀ⲫⲟ ⲛⲁⲛ ⲛ̀Ⲉⲙⲙⲁⲛⲟⲩⲏⲗ.\n\n+ Ⲧⲉⲛϯϩⲟ ⲁ̀ⲣⲉⲡⲉⲛⲙⲉⲩⲓ̀: ⲱ̀ ϯⲡ̀ⲣⲟⲥⲧⲁⲧⲏⲥ ⲉ̀ⲧⲉⲛϩⲟⲧ: ⲛⲁϩⲣⲉⲛ ⲡⲉⲛⲟ̅ⲥ̅ Ⲓⲏ̅ⲥ̅ Ⲡⲭ̅ⲥ̅: ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.",
      arabicTranslation:
        "زينة مريم في السموات العلوية عن يمين حبيبها تطلب منه عنا\n\nكما قال داود المرتل في المزمور: قامت الملكة عن يمينك أيها الملك\n\nسليمان دعاها في نشيد الأنشاد قائلاً أختي و صديقتي المدينة الحقيقية أورشليم\n\nلأنه أعطي علامة عنها بأسماء كثيرة عالية قائلاً: أخرجي من بستانك أيتها العنبر المختار\n\nالسلام لك أيتها العذراء الملكة الحقيقية. السلام لفخر جنسنا ولدت لنا عمانوئيل\n\nنسألك أذكرينا أيتها الشفيعة المؤتمنة أمام ربنا يسوع المسيح ليغفر لنا خطايانا",
    },
    {
      id: "k3",
      title:
        "مرد إنجيل الأحد الأول والثاني لشهر كيهك (تين تي نيمبي + إثفي فاي تين تي أوؤوني)",
      url: `${BASE_URL}/Hadana-2-1_mq1g5o.mp4`,
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
      url: `${BASE_URL}/Owla_tania-1-4_fqkxms.mp4`,
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
      url: `${BASE_URL}/Owla_tania-1-3_fdtqp8.mp4`,
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
      url: `${BASE_URL}/Hadana-1-1_gf3h9c.mp4`,
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
      url: `${BASE_URL}/T_rabaa-1_v2ci2f.mp4`,
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
      url: `${BASE_URL}/Talta_rabaa-1-1_ivpyzv.mp4`,
      copticArabic:
        "كيه غار أيشان صاجي إثفيتي : أوبي هارما إن شيرووبيميكون : بالاس ناخيسي أن إينيه : تين إيرماكاريزين إممو \n\n جيه أوندوس غارتي نا شيني : شا ني أفليوو إنتيه إبئي إن دافيد : إنطاتشني إنؤو إسمي إيفول هيتوتف : إثري صاجي إمبيه طايو \n\n جيه أه إفنوتي أوهي إيراتف خين ني ثوش إنتيه تي يوذيآه : أفتي إنتيف إسمي خين أوثيليل : أه إتفيلي إن يوذا شوبف إيروس \n\n إتفيلي إن يوذا تي تي بارثينوس : ثي إيطاس ميسي إمبين صوتير : أووه أون مين إنصا إثريه ماسف : أسؤهي إسؤى إمبارثينوس \n\n إيفول غارهيتين تي فوني : إنتيه غاربييل بي أنجيلوس : تين تي نيه إمبي شيريه تيزموس : أوتي ثيؤطوكوس ماريا \n\n شيري ني إيفول هيتين إفنوتي : شيري ني إيفول هيتين غابرييل : شيري ني إيفول هيطوتين : جي شيري ني تين تشيسي إممو \n\n بي أنجيلوس إثؤواب غابرييل : أفهي شين نوفي إنتي بارثينوس : مين إنصا بي أسبازموس : أفطاجرو إمموس خين بيف صاجي \n\n جي إمبير إيرهوتي ماريام : أري جيمي غار إن أو إهموت : خاتين إفنوتي هيبي غار تيرا إيرفوكي : أووه إنتي ميسي إن أو شيري \n\n إف إيه تي ناف إنجي إبتشويس إفنوتي : إمبي إثرنوس إنتي دافيد بيف يوت : إفنا إيه أورو إيجين إبئى إن ياكوب : شا إينيه إنتي بي إينيه \n\n إثفيه فاي تين تي أوأوو ني : هوس ثيؤطوكوس إنسيو نيفين : ماتيهو إي إبتشويس إإهري إيجون : إنتيف كانين نوفي نان إيفول \n\n شيري ني أو تي بارثينوس  : تي أوورو إممي إن أليثيني  : شيري إبشوشو إنتي بين جينوس  : أري إجفو نان إن إممانوئيل \n\n تين تيهو أري بين ميفئي  : أوتي بروستاتيس إتينهوت  : ناهرين بين تشويس إيسوس بي خريستوس  : إنتيف كا نين نوفي نان إيفول",
      copticcoptic:
        "+ Ⲕⲉ ⲅⲁⲣ ⲁⲓϣⲁⲛⲥ­ⲁϫⲓ ⲉⲑⲃⲏϯ : ⲱ̀ ⲡⲓϩⲁⲣⲙⲁ ⲛ̀ⲭⲉⲣⲟⲩⲃ­ⲓⲙⲓⲕⲟⲛ : ⲡⲁⲗⲁⲥ ⲛⲁϧⲓⲥⲓ ⲁⲛ ⲉ̀ⲛⲉϩ : ⲧⲉⲛⲉⲣⲙ­ⲁⲕⲁⲣⲓⲍ­ⲓⲛ ⲙ̀ⲙⲟ.\n\n+ Ϫⲉ ⲟⲛⲧⲱⲥ ⲅⲁⲣ ϯⲛⲁϣⲉⲛ­ⲏⲓ : ϣⲁ ⲛⲓⲁⲩⲗⲉ­ⲏⲟⲩ ⲛ̀ⲧⲉ ⲡ̀ⲏⲓ ⲛ̀Ⲇⲁ̅ⲇ̅ : ⲛ̀ⲧⲁϭⲓ ⲛ̀ⲟⲩⲥ̀ⲙⲏ ⲉ̀ⲃⲟⲗ ϩⲓⲧⲟⲧϥ : ⲉⲑⲣⲓⲥⲁ­ϫⲓ ⲙ̀ⲡⲉⲧⲁⲓⲟ.\n\n+ Ϫⲉ ⲁ̀ Ⲫϯ ⲟ̀ϩⲓ ⲉ̀ⲣⲁⲧϥ : ϧⲉⲛ ⲛⲓⲑⲱϣ ⲛ̀ⲧⲉ Ϯⲓⲟⲩⲇⲉⲁ̀ : ⲁϥϯ ⲛ̀ⲧⲉϥⲥ̀ⲙⲏ ϧⲉⲛ ⲟⲩⲑⲉⲗⲏⲗ : ⲁ̀ ⲧ̀ⲫⲩⲗⲏ ⲛ̀Ⲓⲟⲩⲇⲁ ϣⲟⲡϥ ⲉ̀ⲣⲟⲥ.\n\n+ Ⲧ̀ⲫⲩⲗⲏ ⲛ̀Ⲓⲟⲩⲇⲁ ⲧⲉ Ϯⲡ̅ⲁ̅ⲣ̅ⲑ̅ : ⲑⲏⲉ̀ⲧⲁⲥⲙⲓⲥⲓ ⲙ̀Ⲡⲉⲛⲥ̅ⲱ̅ⲣ̅ : ⲟⲩⲟϩ ⲟⲛ ⲙⲉⲛⲉⲛⲥⲁ ⲑ̀ⲣⲉⲥⲙⲁⲥϥ : ⲁⲥⲟ̀ϩⲓ ⲉⲥⲟⲓ ⲙ̀ⲡ̅ⲁ̅ⲣ̅ⲑ̅.\n\n+ Ⲉ̀ⲃⲟⲗ ⲅⲁⲣ ϩⲓⲧⲉⲛ ϯⲫⲱⲛⲏ : ⲛ̀ⲧⲉ Ⲅⲁⲃⲣⲓⲏⲗ ⲡⲓⲁⲅⲅⲉ­ⲗⲟⲥ : ⲧⲉⲛϯ ⲛⲉ ⲙ̀ⲡⲓⲬⲉ̅­ⲧⲓⲥⲙⲟⲥ : ⲱ̀ Ϯⲑⲉⲟ̀ⲧⲟⲕⲟⲥ Ⲙⲁⲣⲓⲁ.\n\n+ Ⲭⲉ̅ ⲛⲉ ⲉ̀ⲃⲟⲗ ϩⲓⲧⲉⲛ Ⲫϯ : Ⲭⲉ̅ ⲛⲉ ⲉ̀ⲃⲟⲗ ϩⲓⲧⲉⲛ Ⲅⲁⲃⲣⲓⲏⲗ : Ⲭⲉ̅ ⲛⲉ ⲉ̀ⲃⲟⲗ ϩⲓⲧⲟⲧⲉⲛ : ϫⲉ Ⲭⲉ̅ ⲛⲉ ⲧⲉⲛϭⲓⲥⲓ ⲙ̀ⲙⲟ.\n\n+ Ⲡⲓⲁⲅⲅⲉ­ⲗⲟⲥ ⲉ̅ⲑ̅ⲩ̅ Ⲅⲁⲃⲣⲓⲏⲗ : ⲁϥϩⲓϣⲉ­ⲛⲛⲟⲩϥⲓ ⲛ̀Ϯⲡ̅ⲁ̅ⲣ̅ⲑ̅ : ⲙⲉⲛⲉⲛⲥⲁ ⲡⲓⲁⲥⲡⲁ­ⲥⲙⲟⲥ : ⲁϥⲧⲁϫⲣⲟ ⲙ̀ⲙⲟⲥ ϧⲉⲛ ⲡⲉϥⲥⲁϫⲓ.\n\n+ Ϫⲉ ⲙ̀ⲡⲉⲣⲉⲣϩ­ⲟϯ Ⲙⲁⲣⲓⲁⲙ : ⲁ̀ⲣⲉϫⲓⲙⲓ ⲅⲁⲣ ⲛ̀ⲟⲩϩ̀ⲙⲟⲧ : ϧⲁⲧⲉⲛ Ⲫϯ ϩⲏⲡⲡⲉ ⲅⲁⲣ ⲧⲉⲣⲁⲉⲣ­ⲃⲟⲕⲓ : ⲟⲩⲟϩ ⲛ̀ⲧⲉⲙⲓⲥⲓ ⲛ̀Ⲟⲩϣⲏⲣⲓ.\n\n+ Ⲉϥⲉ̀ϯ ⲛⲁϥ ⲛ̀ϫⲉ Ⲡ̀⳪ Ⲫϯ : ⲙ̀ⲡⲓⲑ̀ⲣⲟⲛⲟⲥ ⲛ̀ⲧⲉ Ⲇⲁ̅ⲇ̅ ⲡⲉϥⲓⲱⲧ : ϥ̀ⲛⲁⲉⲣⲟⲩ­ⲣⲟ ⲉ̀ϫⲉⲛ ⲡ̀ⲏⲓ ⲛ̀Ⲓⲁⲕⲱⲃ : ϣⲁ ⲉ̀ⲛⲉϩ ⲛ̀ⲧⲉ ⲡⲓⲉ̀ⲛⲉϩ.\n\n+ Ⲉⲑⲃⲉ ⲫⲁⲓ ⲧⲉⲛϯⲱ̀ⲟⲩ ⲛⲉ : ϩⲱⲥ Ⲑⲉⲟ̀ⲧⲟⲕⲟⲥ ⲛ̀ⲥⲏⲟⲩ ⲛⲓⲃⲉⲛ : ⲙⲁϯϩⲟ ⲉ̀Ⲡ̀⳪ ⲉ̀ϩ̀ⲣⲏⲓ ⲉ̀ϫⲱⲛ : ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.\n\n+ Ⲭⲉ̅ ⲛⲉ ⲱ̀ Ϯⲡ̅ⲁ̅ⲣ̅ⲑ̅ : ϯⲟⲩⲣⲱ ⲙ̀ⲙⲏⲓ ⲛ̀ⲁ̀ⲗⲏⲑⲓⲛⲏ : Ⲭⲉ̅ ⲡ̀ϣⲟⲩϣⲟⲩ ⲛ̀ⲧⲉ ⲡⲉⲛⲅⲉⲛ­ⲟⲥ : ⲁ̀ⲣⲉϫ̀ⲫⲟ ⲛⲁⲛ ⲛ̀Ⲉⲙⲙⲁⲛⲟ­ⲩⲏⲗ.\n\n+ Ⲧⲉⲛϯϩⲟ ⲁ̀ⲣⲉⲡⲉⲛⲙ­ⲉⲩⲓ̀ : ⲱ̀ ϯⲡ̀ⲣⲟⲥⲧⲁⲧ­ⲏⲥ ⲉ̀ⲧⲉⲛϩⲟⲧ : ⲛⲁϩⲣⲉⲛ Ⲡⲉⲛ⳪ Ⲓⲏ̅ⲥ̅ Ⲡⲭ̅ⲥ̅ : ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.",
      arabicTranslation:
        "لأني إذا ما تكلمت من أجلك ، أيتها المركبة الشاروبيمية ، لساني لا يتعب، أبداً نغبطك \n\n لأنني حقاً امضي ، إلي ديار بيت داود ، لآخذ صوتاً من قِبَله ، لكي انطق بكرامتك \n\n لأن الله وقف ، في حدود اليهودية ، وأعطي صوته بتهليل ، و سبط يهوذا قبله إليه \n\n سبط يهوذا هو العذراء ، التي ولدت مخلصنا ، و أيضاً بعد ما ولدته ، بقيت عذراء \n\n فمن قِبَل صوت ، غبريال الملاك ، نعطيك السلام ، يا والدة الإله مريم \n\n السلام لك من قبل الله ، السلام لك من قبل غبريال ، السلام لك من قبلنا ، قائلين السلام لك نرفعك \n\n الملاك القدس غبريال، بشر العذراء مريم ، و بعد السلام ، قواها بقوله \n\n لا تخافي يا مريم ، لأنك وجدت نعمة، عند الله ها ستحبلين ، و تلدبن ابنا \n\n ويعطيه الرب الإله ، كرسي داود أبيه ، و يملك علي بيت يعقوب ، إلي أبد الأبد \n\n من أجل هذا نمجدك ، كوالدة الإله كل حين ، إسألي الرب عنا ، ليغفر لنا خطايانا \n\n السلام لك أيتها العذراء ، الملكة الحقيقية ، السلام لفخر جنسنا ، ولدت لنا عمانوئيل \n\n نسألك أذكرينا أيتها الشفيعة المؤتمنة أمام ربنا يسوع المسيح ليغفر لنا خطايانا",
    },
    {
      id: "s3",
      title:
        "هيتنيات شهر كيهك كاملة (للملاك غبريال المبشر + يوحنا المعمدان نسيب عمانوئيل + زكريا الكاهن واليصابات + يواقيم وحنه)",
      url: `${BASE_URL}/Khamsa_satta-1-4_eyonvs.mp4`,
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
      url: `${BASE_URL}/Talta_rabaa-2-2_pfz3l0.mp4`,
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
      url: `${BASE_URL}/Middle-1-4_t1o5d9.mp4`,
      copticArabic:
        "أباهيت نيم بالاس : هوس إتي إترياس : أجيا إترياس  : إليسون إيماس.\n\nفون نيفين سيهوس ناك : أووه سي إرفوك ناك : أجيا إترياس : إليسون إيماس.\n\nجي غار إنثوك بينوتي : بين سوتير أووه بي نيشتي : أجيا إترياس : إليسون إيماس.\n\nذيس بوذي كيريون : أفئي أفسوتي إممون : أجيا إترياس : إليسون إيماس.\n\nإثفي نيك هاب إممي : ماإتسافوي إنيك ميثمي : أجيا إترياس : إليسون إيماس.\n\nذي أوش بي بيك ناي : جيم بين شيني خين بيك أوجاي : أجيا إترياس : إليسون إيماس.\n\nيس هيبي أنوك : إي إفوت هاروك : أجيا إترياس : إليسون إيماس.\n\nثوك تي تي جوم نيم بي أوؤو : أو بي أورو إنتى إب أوؤو : أجيا إترياس : إليسون إيماس.\n\nإيسوس بي تين هيلبيس : خين نين إثليبسيس : أجيا إترياس : إليسون إيماس.\n\nإك إسماروؤوت إيوس ثيؤس : ناهمين خين ني بي رازموس : أجيا إترياس : إليسون إيماس.\n\nلاؤس نيفين سيهوس ناك : أو إبؤرو بخرستوس : أجيا إترياس : إليسون إيماس.\n\nموي نان إنتيك هيريني : ماطالتشو إن نين شوني : أجيا إترياس : إليسون إيماس.\n\nإنثوك أو ريف شينهيت : أووه إن نا إيت : أجيا إترياس : إليسون إيماس.\n\nإك إسماروؤوت إنثوك : تين هوس ناك إسمو إيروك : أجيا إترياس : إليسون إيماس.\n\nأونيشتي إنطا إفمي : بي ريفتي هاب إممي : أجيا إترياس : إليسون إيماس.\n\nبيك ران إت إسماروؤوت : أو بي لوغوس إنطا إفمي : أجيا إترياس : إليسون إيماس.\n\nرويس إيرون  : خين تيك ميت أغاثوس : أجيا إترياس: إليسون إيماس.\n\nسوتيم اي ني ارنوفي : خين نو أنانكي : أجيا إترياس : إليسون إيماس.\n\nطا إبسيشي نيم بانوس : أو لو إ أورانوس : أجيا إترياس : إليسون إيماس.\n\nإيوس ثيؤس بين نوتي : موي نان إن أوسوتي : أجيا إترياس : إليسون إيماس.\n\nإفنوتي بي نا إيت : بي ريف أوأو إن هيت : أجيا إترياس : إليسون إيماس.\n\nإكؤواب إكؤواب إكؤواب : إبشيري إم في إثؤواب : أجيا إترياس : إليسون إيماس.\n\nإبسيشي إنين يوتي : ما إمتون نوؤو أو بي ريف سوتي : أجيا إترياس : إليسون إيماس.\n\nأوبين نيب أري بين ميفئي : خين تيك ميت أورو إن نا نيفيؤوي : أجيا إترياس : إليسون إيماس.",
      copticcoptic:
        "+ Ⲁⲡⲁϩⲏⲧ ⲛⲉⲙ ⲡⲁⲗⲁⲥ: ϩⲱⲥ ⲉ̀ϯⲧⲣⲓⲁⲥ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲃⲟⲛ Ⲛⲓⲃⲉⲛ ⲥⲉϩⲱⲥ ⲛⲁⲕ: ⲟⲩⲟϩ ⲥⲉⲉⲣⲃⲱⲕ ⲛⲁⲕ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲅⲉ ⲅⲁⲣ ⲛ̀ⲑⲟⲕ Ⲡⲉⲛⲟⲩϯ: Ⲡⲉⲛⲥ̅ⲱ̅ⲣ̅ ⲟⲩⲟϩ ⲡⲓⲛⲓϣϯ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲇⲉⲥⲡⲟⲩ­ⲇⲉ ⲕⲩⲣⲓⲟⲛ: ⲁϥⲓ̀ ⲁϥⲥⲱϯ ⲙ̀ⲙⲟⲛ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲉⲑⲃⲉ ⲛⲉⲥⲕϩⲁⲡ ⲙ̀ⲙⲏⲓ: ⲙⲁⲧⲥⲁⲃ­ⲟⲓ ⲉ̀ⲛⲉⲕⲙⲉⲑ­ⲙⲏⲓ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲍⲉⲟϣ ⲡⲉ ⲡⲉⲕⲛⲁⲓ: ϫⲉⲙ ⲡⲉⲛϣⲓⲛⲓ ϧⲉⲛ ⲡⲉⲕⲟⲩϫ­ⲁⲓ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲏⲥ ϩⲏⲡⲡⲉ ⲁ̀ⲛⲟⲕ: ⲉⲓⲉ̀ⲫⲱⲧ ϩⲁⲣⲟⲕ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲑⲱⲕ ⲧⲉ ϯϫⲟⲙ ⲛⲉⲙ ⲡⲓⲱ̀ⲟⲩ: ⲱ ⲡⲓⲟⲩⲣⲟ ⲛ̀ⲧⲉ ⲡ̀ⲱ̀ⲟⲩ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲓⲏ̅ⲥ̅ ⲡⲉ ⲧⲉⲛϩⲉⲗ­ⲡⲓⲥ: ϧⲉⲛ ⲛⲉⲛⲑ̀ⲗⲩⲫⲥⲓⲥ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲕ̀ⲥ̀ⲙⲁⲣⲟⲱⲧ Ⲩⲥ̅ Ⲑⲥ̅: ⲛⲁϩⲙⲉⲛ ϧⲉⲛ ⲛⲓⲡⲓⲣⲁ­ⲥⲙⲟⲥ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲗⲁⲟⲥ ⲛⲓⲃⲉⲛ ⲥⲉϩⲱⲥ ⲛⲁⲕ: ⲱ̀ ⲡ̀ⲟⲩⲣⲟ Ⲡⲭ̅ⲥ̅: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲙⲟⲓ ⲛⲁⲛ ⲛ̀ⲧⲉⲕϩⲓⲣ­ⲏⲛⲏ: ⲙⲁⲧⲁⲗϭⲟ ⲛ̀ⲛⲉⲛϣⲱⲛⲓ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲛ̀ⲑⲟⲕ ⲟⲩⲣⲉϥϣ­ⲉⲛϩⲏⲧ: ⲟⲩⲟϩ ⲛ̀ⲛⲁⲏⲧ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲝⲙⲁⲣⲱⲟ­ⲩⲧ ⲛ̀ⲑⲟⲕ: ⲧⲉⲛϩⲱⲥ ⲛⲁⲕ ⲥ̀ⲙⲟⲩ ⲉ̀ⲣⲟⲕ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲟⲩⲛⲓϣϯ ⲛ̀ⲧⲁⲫ̀ⲙⲏⲓ: ⲡⲓⲣⲉϥϯ­ϩⲁⲡ ⲙ̀ⲙⲏⲓ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲡⲉⲕⲣⲁⲛ ⲉⲧⲥ̀ⲙⲁⲣⲱⲟⲩⲧ: ⲱ̀ ⲡⲓⲗⲟⲅⲟⲥ ⲛ̀ⲧⲁⲫ̀ⲙⲏⲓ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲣⲱⲓⲥ ⲉ̀ⲡⲟⲛ ⲱ̀ Ⲡⲭ̅ⲥ̅: ϧⲉⲛ ⲧⲉⲕⲙⲉⲧⲁ̀ⲅⲁⲑⲟⲥ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲥⲱⲧⲉⲙ ⲉ̀ⲛⲓⲡⲉϥⲉ­ⲣⲛⲟⲃⲓ: ϧⲉⲛ ⲛⲟⲩⲁ̀ⲛⲁⲅⲕⲏ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲧⲁⲯⲩⲭⲏ ⲛⲉⲙ ⲡⲁⲛⲟⲩⲥ: ⲱ̀ⲗⲟⲩ ⲉⲟⲩⲣⲁⲛ­ⲟⲥ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲩⲥ̅ Ⲑⲥ̅ Ⲡⲉⲛⲛⲟⲩϯ: ⲙⲟⲓ ⲛⲁⲛ ⲛ̀ⲟⲩⲥⲱϯ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲫϯ ⲡⲓⲛⲁⲏⲧ: ⲡⲓⲣⲉϥⲱ­ⲟⲩⲛ̀ϩⲏⲧ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲭ̀ⲟⲩⲁⲃ ⲭⲭ̀ⲟⲩⲁⲃ ⲭ̀ⲭⲟⲩⲁⲃ: ⲡ̀ϣⲏⲣⲓ ⲙ̀Ⲫⲏ̅̅ⲉ̅ⲑ̅ⲩ̅: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲯⲩⲭⲏ ⲛ̀ⲛⲉⲛⲓⲟϯ: ⲙⲁⲙ̀ⲧⲟⲛ ⲛⲱⲟⲩ ⲱ̀ ⲡⲓⲣⲉϥⲥ­ⲱϯ: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.\n\n+ Ⲱ ⲡⲉⲛⲛⲏⲃ ⲣ̀ⲓⲡⲉⲛⲙⲉ­ⲩⲓ̀: ϧⲉⲛ ⲧⲉⲕⲙⲉⲧ­ⲟⲩⲣⲟ ⲛ̀ⲛⲁ ⲛⲓⲫⲏⲟⲩⲓ̀: ⲁ̀ⲅⲓⲁ ⲧ̀ⲣⲓⲁⲥ: ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ ⲏ̀ⲙⲁⲥ.",
      arabicTranslation:
        "قلبي ولساني: للثالوث يسبحان : أيها الثالوث : القدوس إرحمنا.\n\nكل أحد يسبحك : ويتعبد لك : أيها الثالوث : القدوس إرحمنا.\n\nلأنك أنت إلهنا : مخلصنا العظيم: أيها الثالوث : القدوس إرحمنا.\n\nأيها السيد الرب: أتى وخلصنا : أيها الثالوث : القدوس إرحمنا.\n\nمن أجل أحكامك: الحقيقية علمني عدلك: أيها الثالوث : القدوس إرحمنا.\n\nكثيرة هي رحمتك: تعهدنا بخلاصك: أيها الثالوث : القدوس إرحمنا.\n\nهوذا أنا ألتجأت: إليك: أيها الثالوث : القدوس إرحمنا.\n\nلك القوة والمجد: يا ملك المجد: أيها الثالوث : القدوس إرحمنا.\n\nيسوع هو رجاؤنا: في شدائدنا: أيها الثالوث : القدوس إرحمنا.\n\nتباركت يا أبن الله: نجنا من التجارب: أيها الثالوث : القدوس إرحمنا.\n\nكل الشعوب تسبحك: ايها الملك المسيح: أيها الثالوث : القدوس إرحمنا.\n\nأعطنا سلامك: إشف أمراضنا: أيها الثالوث : القدوس إرحمنا.\n\nأنت المتحنن وأنت الرحوم: أيها الثالوث : القدوس إرحمنا.\n\nتباركت أنت نسبحك ونباركك: أيها الثالوث : القدوس إرحمنا.\n\nعظيم بالحقيقة: الديان العادل: أيها الثالوث : القدوس إرحمنا.\n\nإسمك مبارك: أيها الكلمة الحقيقي: أيها الثالوث : القدوس إرحمنا.\n\nأحرسنا أيها المسيح: بصلاحك: أيها الثالوث : القدوس إرحمنا.\n\nإسمع الخطاة: في شدائدهم: أيها الثالوث : القدوس إرحمنا.\n\nنفسي وعقلي: إرفعهما إلى السماء: أيها الثالوث : القدوس إرحمنا.\n\nيا إبن الله إلهنا: أعطنا خلاصًا: أيها الثالوث : القدوس إرحمنا.\n\nالله الرحوم: طويل الأناة: أيها الثالوث : القدوس إرحمنا.\n\nقدوس قدوس قدوس: يا أبن القدوس: أيها الثالوث : القدوس إرحمنا.\n\nأباؤنا الراقدون: نيحهم أيها المخلص: أيها الثالوث : القدوس إرحمنا.\n\nيا ملكنا أذكرنا: في ملكوتك السماوي : أيها الثالوث  : القدوس إرحمنا.",
    },
    {
      id: "hs3",
      title:
        "أرباع الناقوس لشهر كيهك (شيرى غابرييل بى نيشتى إن آرشى أنجيلوس + شيري في ايطاف هي + شيرى يوأنس)",
      url: "",
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

// --- المكون الرئيسي ---
export default function PreparatoryPage() {
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [fullscreenLyrics, setFullscreenLyrics] = useState<Video | null>(null);

  const [showCopticArabic, setShowCopticArabic] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [showCoptic, setShowCoptic] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [showHazzat, setShowHazzat] = useState(false);
  const [rotateFromSidebar, setRotateFromSidebar] = useState(false);
  const [showControlsPanel, setShowControlsPanel] = useState(false);

  useEffect(() => {
    if (selectedStage) {
      const list = preparatoryVideos[selectedStage] || [];
      const urls = list.map((v) => v.url).filter(Boolean);
      prewarmVideos(urls);
    }
  }, [selectedStage]);

  const visibleColumns = [showCopticArabic, showArabic, showCoptic].filter(
    Boolean
  ).length;

  const disabledColumns = 3 - visibleColumns;
  const maxFontSize = 20 + disabledColumns * 2;

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 1, maxFontSize));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 1, 14));
  };

  useEffect(() => {
    setFontSize((prev) => Math.min(prev, maxFontSize));
  }, [maxFontSize]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white font-sans">
      <Header />
      <main className="flex-1 page-bg-setup bg-melodies relative">
        <div className="bg-overlay" />
        <div className="relative z-10 pb-10">
          {/* Header Section */}
          <div className="bg-gradient-to-b from-blue-900/30 to-transparent py-10 px-4 text-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-3">
              المنهج التمهيدي
            </h1>
            <p className="text-gray-400">
              {selectedStage
                ? `مرحلة: ${STAGES.find((s) => s.key === selectedStage)?.label}`
                : "اختر مرحلتك لعرض الفيديوهات"}
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            {/* Stage Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {STAGES.map((stage) => (
                <button
                  key={stage.key}
                  onClick={() => setSelectedStage(stage.key)}
                  className={`px-5 py-3 rounded-xl font-bold text-sm md:text-base transition-all border-2 ${
                    selectedStage === stage.key
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105"
                      : "bg-gray-900 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <span className="mr-1">{stage.icon}</span>
                  {stage.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            {!selectedStage ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-7xl mb-6 opacity-30">🎵</div>
                <p className="text-gray-500 text-xl">
                  اختر مرحلة من الأعلى للبدء
                </p>
              </div>
            ) : (
              /* Videos Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {preparatoryVideos[selectedStage]?.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl hover:border-blue-500/20 transition-all"
                  >
                    <div className="aspect-video bg-black relative">
                      {video.url ? (
                        <LazyVideo src={video.url} title={video.title} />
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
            )}
          </div>
        </div>
      </main>

      {/* --- مودال النصوص --- */}
      {fullscreenLyrics && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden">
          <header className="sticky top-0 z-50 p-3 md:p-4 bg-gray-900 border-b border-white/10 flex items-center gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowControlsPanel((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-gray-900/90 border border-white/20 flex flex-col items-center justify-center gap-0.5 hover:bg-gray-800 transition-all"
                  aria-label="إعدادات النص"
                >
                  <span className="w-5 h-0.5 bg-white rounded-full" />
                  <span className="w-5 h-0.5 bg-white rounded-full" />
                  <span className="w-5 h-0.5 bg-white rounded-full" />
                </button>

                {showControlsPanel && (
                  <div className="absolute top-full mt-2 left-1/3 -translate-x-1/3 md:left-auto md:right-0 md:translate-x-0 w-56 md:w-64 max-w-[90vw] z-30 bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-4 p-4 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-200">
                        إعدادات النص
                      </span>
                      <button
                        onClick={() => setShowControlsPanel(false)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] text-gray-400">
                        حجم الخط
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={decreaseFontSize}
                          className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 flex items-center justify-center transition-all"
                        >
                          <span className="text-lg">-</span>
                        </button>
                        <span className="flex-1 text-center text-sm text-gray-100">
                          {fontSize}
                        </span>
                        <button
                          onClick={increaseFontSize}
                          className="w-9 h-9 bg-gray-800 hover	bg-gray-700 rounded-lg border border-gray-700 flex items-center justify-center transition-all"
                        >
                          <span className="text-lg">+</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] text-gray-400">اللغات</span>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setShowArabic(!showArabic)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                            showArabic
                              ? "bg-blue-600 border-blue-400 text-white"
                              : "bg-gray-800 border-gray-700 text-gray-300"
                          }`}
                        >
                          عربي
                        </button>
                        <button
                          onClick={() => setShowCopticArabic(!showCopticArabic)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                            showCopticArabic
                              ? "bg-emerald-600 border-emerald-400 text-white"
                              : "bg-gray-800 border-gray-700 text-gray-300"
                          }`}
                        >
                          قبطي معرب
                        </button>
                        <button
                          onClick={() => setShowCoptic(!showCoptic)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                            showCoptic
                              ? "bg-indigo-600 border-indigo-400 text-white"
                              : "bg-gray-800 border-gray-700 text-gray-300"
                          }`}
                        >
                          قبطي
                        </button>
                      </div>
                    </div>

                    {(() => {
                      const count = [
                        fullscreenLyrics.hazzatImage,
                        fullscreenLyrics.hazzatImage2,
                        fullscreenLyrics.hazzatImage3,
                      ].filter(Boolean).length;
                      return (
                        count > 0 && (
                          <button
                            onClick={() => setShowHazzat(!showHazzat)}
                            className={`w-full px-3 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                              showHazzat
                                ? "bg-yellow-600 hover:bg-yellow-700"
                                : "bg-purple-600 hover:bg-purple-700"
                            }`}
                          >
                            <span>🎵</span>
                            <span>
                              {showHazzat ? "إخفاء الهزات" : "هزات اللحن"}
                            </span>
                          </button>
                        )
                      );
                    })()}

                    <button
                      onClick={() => {
                        const btn = document.getElementById(
                          "landscape-toggle-button"
                        ) as HTMLButtonElement | null;
                        if (btn) {
                          btn.click();
                          setRotateFromSidebar((prev) => !prev);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg font-bold text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 transition-all"
                    >
                      تدوير الشاشة
                    </button>
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-blue-400 font-bold text-sm md:text-lg flex-1 text-center md:text-right">
              {fullscreenLyrics.title}
            </h2>

            <button
              onClick={() => {
                setFullscreenLyrics(null);
                setShowHazzat(false);
                setRotateFromSidebar(false);
                setShowControlsPanel(false);
              }}
              className="text-2xl p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            >
              ✕
            </button>
          </header>

          <div className="relative flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-gray-950 p-2 md:p-6">
              <div className="w-full max-w-7xl mx-auto">
                {(() => {
                  const coptic = (fullscreenLyrics.copticcoptic || "").split(
                    "\n\n"
                  );
                  const copticAr = (fullscreenLyrics.copticArabic || "").split(
                    "\n\n"
                  );
                  const arabic = (
                    fullscreenLyrics.arabicTranslation || ""
                  ).split("\n\n");
                  const maxParts = Math.max(
                    coptic.length,
                    copticAr.length,
                    arabic.length
                  );

                  // دالة لاستخراج الرقم من العنوان العربي (مثلاً: القطعة الثانية -> 2)
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

                    // تحديد رقم العنصر للتلوين (سواء كان ربع أو عنوان قسم)
                    const colorReferenceNumber = isSectionHeader
                      ? getNumberFromTitle(arabic[i] || "")
                      : quarterNumber;

                    // تحديد لون الربع بناءً على رقمه
                    // الوضع الافتراضي: فردي بلون وزوجي بلون
                    // وضع الإبصالية: كل ربعين بنفس اللون (1-2 بلون، 3-4 بلون، إلخ)
                    const isPsali =
                      fullscreenLyrics.title &&
                      (fullscreenLyrics.title.includes("ابصالية") ||
                        fullscreenLyrics.title.includes("إبصالية"));

                    let isEvenRow = false;
                    if (colorReferenceNumber !== null) {
                      if (isPsali) {
                        // منطق الإبصالية: الربع 1 و 2 (فردي)، الربع 3 و 4 (زوجي)
                        isEvenRow =
                          Math.floor((colorReferenceNumber - 1) / 2) % 2 === 1;
                      } else {
                        // المنطق العادي: فردي وزوجي
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
                          <span>🎵</span> هزات اللحن <span>🎵</span>
                        </h3>
                      </div>
                      <div className="flex flex-col items-stretch">
                        {fullscreenLyrics.hazzatImage && (
                          <img
                            src={fullscreenLyrics.hazzatImage}
                            alt="هزات اللحن 1"
                            className="block w-full"
                            draggable={false}
                          />
                        )}
                        {fullscreenLyrics.hazzatImage2 && (
                          <img
                            src={fullscreenLyrics.hazzatImage2}
                            alt="هزات اللحن 2"
                            className="block w-full"
                            draggable={false}
                          />
                        )}
                        {fullscreenLyrics.hazzatImage3 && (
                          <img
                            src={fullscreenLyrics.hazzatImage3}
                            alt="هزات اللحن 3"
                            className="block w-full"
                            draggable={false}
                          />
                        )}
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

export function meta() {
  return [
    { title: "ⲥⲙⲟⲩ ⲉⲣⲟϥ - تمهيدي" },
    {
      name: "description",
      content: "موقع متخصص في تعليم الألحان القبطية للطلاب في مختلف المراحل",
    },
  ];
}
