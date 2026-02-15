import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LazyVideo from "../components/LazyVideo";
import "../styles/melodies.css";

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

interface TextContent {
  id: string;
  title: string;
  content: string;
}

type StageVideos = Record<string, Video[]>;
type StageTexts = Record<string, TextContent[]>;

// --- المراحل المتاحة ---
const STAGES = [
  { key: "حضانة", label: "حضانة" },
  { key: "اولي وتانيه وثالثة", label: "اولي وتانيه وثالثة" },
  { key: "رابعة وخامسة وسادسة", label: "رابعة وخامسة وسادسة" },
  { key: "اعدادي وثانوي", label: "اعدادي وثانوي" },
];
const BASE_URL =
  "https://res.cloudinary.com/dzetwllwd/video/upload/v1771085727";

// --- بيانات الفيديوهات ---
const preparatoryVideos: StageVideos = {
  حضانة: [
    {
      id: "k1",
      title: "اجيوس السنوي",
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
      title: "ذكصولوجية العذراء عشية بالنغمة السنوي (إيرى إبسول سيل إمماريام)",
      url: `${BASE_URL}/T_Hadana-2_hthdv5.mp4`,
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
    {
      id: "k3",
      title:
        "مرد انجيل الأحد الأول والثاني لشهر كيهك (تين تي نيمبي + إثفي فاي تين تي أوؤوني)",
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
      title: "ني شيروبيم للقداس الباسيلي",
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
        "مرد انجيل الأحد الثالث والرابع (تين اتشيسي اممو + اثفي فاي + جى افسمارؤوت)",
      url: `${BASE_URL}/Owla_tania-1-3_fdtqp8.mp4`,
      copticArabic:
        "تين تشيسى إممو خين أوو إم إبشا : نيم إليصابيت تى سينجينيس : جـى إتسماروؤوت إنثو خين نى هيومى : إف إسماروؤوت إنـجـى إب أوطاه إنتى تى نيـجـى \n\n اثفي فاي تين تي أوؤونى : هوس ثيئوطوكوس انسيو نيفين : ماتي هو ايه ابتشويس اى اهري ايجون : انتيف كانين نوفي نان ايفول \n\n جى افسمارؤوت انجى افيوت نيم ابشيري : نيم بي بنفما اثؤواب : تى ترياس اتجيك ايفول : تين اوؤشت امموس تين تي أو أوناس",
      copticcoptic:
        "Ⲧⲉⲛϭⲓⲥⲓ ⲙ̀ⲙⲟ ϧⲉⲛ ⲟⲩⲉⲙⲡ̀ϣⲁ: ⲛⲉⲙ Ⲉⲗⲓⲥⲁⲃⲉⲧ ⲧⲉⲥⲩⲅⲅⲉⲛⲏⲥ: ϫⲉ ⲉⲧⲥ̀ⲙⲁⲣⲱⲟⲩⲧ ⲛ̀ⲑⲟ ϧⲉⲛ ⲛⲓϩⲓⲟⲙⲓ: ϥ̀ⲥ̀ⲙⲁⲣⲱⲟⲩⲧ ⲛ̀ϫⲉ ⲡ̀ⲟⲩⲧⲁϩ ⲛ̀ⲧⲉ ⲧⲉⲛⲉϫⲓ.\n\n Ⲉⲑⲃⲉ ⲫⲁⲓ ⲧⲉⲛϯⲱ̀ⲟⲩ ⲛⲉ: ϩⲱⲥ Ⲑⲉⲟ̀ⲧⲟⲕⲟⲥ ⲛ̀ⲥⲏⲟⲩ ⲛⲓⲃⲉⲛ: ⲙⲁϯϩⲟ ⲉ̀Ⲡ̀ϭⲟⲓⲥ ⲉ̀ϩ̀ⲣⲏⲓ ⲉ̀ϫⲱⲛ: ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓ ⲛⲁⲛ ⲉ̀ⲃⲟⲗ.\n\nϪⲉ ϥ̀ⲥ̀ⲙⲁⲣⲟⲩⲱⲧ ⲛ̀ϫⲉ Ⲫ̀ⲓⲱⲧ ⲛⲉⲙ Ⲡ̀ϣⲏⲣⲓ: ⲛⲉⲙ Ⲡⲓⲡ̀ⲛⲉⲩⲙⲁ ⲉ̀ⲑⲟⲩⲁⲃ ϯⲧ̀ⲣⲓⲁⲥ ⲉⲧϫⲏⲕ ⲉ̀ⲃⲟⲗ: ⲧⲉⲛⲟⲩⲱϣⲧ ⲙ̀ⲙⲟⲥ ⲧⲉⲛϯⲱ̀ⲟⲩ ⲛⲁⲥ.",
      arabicTranslation:
        "نعظمك باستحقاق : مع أليصابات نسيبتك : قائلين مباركة أنتِ فى النساء : و مباركة هى ثمرة بطنك \n\n من أجل هذا نمجدك كوالدة الإله كل حين إسالي الرب عنا ليغفر لنا خطايانا \n\n لأنه مبارك الآب والإبن والروح القدس الثالوث الكامل نسجد له ونمجده",
    },
    {
      id: "p3",
      title:
        "مقدمة الذكصولوجيات بالنغمة الكيهكي السريعة للربعين (شيرى نى أوتى بارثينوس + تينتى هو آرى)",
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
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
    {
      id: "s2",
      title: "ذكصولوجية كي غار كاملة",
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
        "هيتين ني إبريسفيا إنتي بي أرشي آنجيليوس إثؤواب غابرييل بي فاي شينوفي إبتشويس ...\n\nهيتين ني إبريسفيا إنتي بي سينجينيس إن إممانوئيل يوأنس إبشيري إن زخارياس إبتشويس ...\n\nهيتين ني إفشي إنتي بي أوويب زخارياس نيم تيف إسهيمي إليصابيت إبتشويس ...\n\nهيتين ني إفشي إنتي ني خيللوي إت اسماروؤوت يواكيم نيم آنَّا إبتشويس ...",
      copticcoptic:
        "Ϩⲓⲧⲉⲛ ⲛⲓⲡ̀ⲣⲉⲥⲃⲓⲁ: ⲛ̀ⲧⲉ ⲡⲓⲁⲣⲭⲏⲁⲅⲅⲉⲗⲟⲥ ⲉⲑⲟⲩⲁⲃ: Ⲅⲁⲃⲣⲓⲏⲗ ⲡⲓϥⲁⲓϣⲉⲛⲛⲟⲩϥⲓ: Ⲡ̀ϭⲟⲓⲥ ....\n\nϨⲓⲧⲉⲛ ⲛⲓⲡ̀ⲣⲉⲥⲃⲓⲁ: ⲛ̀ⲧⲉ ⲡⲓⲥⲩⲅⲅⲉⲛⲏⲥ ⲛ̀Ⲉⲙⲙⲁⲛⲟⲩⲏⲗ: Ⲓⲱⲁⲛⲛⲏⲥ ⲡ̀ϣⲏⲣⲓ ⲛ̀Ⲍⲁⲭⲁⲣⲓⲁⲥ: Ⲡ̀ϭⲟⲓⲥ....\n\nϨⲓⲧⲉⲛ ⲛⲓⲉⲩⲭⲏ: ⲛ̀ⲧⲉ ⲡⲓⲟⲩⲏⲃ Ⲍⲁⲭⲁⲣⲓⲁⲥ: ⲛⲉⲙ ⲧⲉϥⲥ̀ϩⲓⲙⲓ Ⲉ̀ⲗⲓⲥⲁⲃⲉⲧ: Ⲡ̀ϭⲟⲓⲥ ....\n\nϨⲓⲧⲉⲛ ⲛⲓⲉⲩⲭⲏ: ⲛ̀ⲧⲉ ⲛⲓϧⲉⲗⲗⲟⲓ ⲧ̀ⲥ̀ⲙⲁⲣⲱⲟⲩⲧ: Ⲓⲱⲁ̀ⲕⲓⲙ ⲛⲉⲙ Ⲁⲛⲛⲁ: Ⲡ̀ϭⲟⲓⲥ ....",
      arabicTranslation:
        "بشفاعات رئيس الملائكة الطاهر غبريال المبشر، يا رب ...\n\nبشفاعات نسيب عمانوئيل، يوحنا إبن زكريا، يا رب ...\n\nبصلوات زكريا الكاهن و إمرأته أليصابات يا رب ...\n\nبصلوات الشيخين المباركين يواقيم وحنة، يا رب ...",
    },
  ],
  "اعدادي وثانوي": [
    {
      id: "hs1",
      title: "طاي شوري",
      url: `${BASE_URL}/Talta_rabaa_1_2_whwht7.mp4`,
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
      title: "ابصالية آدام علي الهوس الثاني (أباهيت نيم باالس) كاملة",
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
      title: "مرد الابركسيس الأحد الأول (شيري غبريل بي نشتي ان ارشي انجيلوس)",
      url: "",
      copticArabic: "",
      copticcoptic: "",
      arabicTranslation: "",
    },
  ],
};

// --- بيانات طقس اللحن ---
const preparatoryTextContent: StageTexts = {
  حضانة: [
    {
      id: "k-text1",
      title: "اجيوس السنوي",
      content: "",
    },
    {
      id: "k-text2",
      title: "ذكصولوجية العذراء عشية بالنغمة السنوي (إيرى إبسول سيل إمماريام)",
      content: "",
    },
    {
      id: "k-text3",
      title:
        "مرد انجيل الأحد الأول والثاني لشهر كيهك (تين تي نيمبي + إثفي فاي تين تي أوؤوني)",
      content: "",
    },
  ],
  "اولي وتانيه وثالثة": [
    {
      id: "p-text1",
      title: "ني شيروبيم للقداس الباسيلي",
      content: "",
    },
    {
      id: "p-text2",
      title:
        "مرد انجيل الأحد الثالث والرابع (تين اتشيسي اممو + اثفي فاي + جى افسمارؤوت)",
      content: "",
    },
    {
      id: "p-text3",
      title:
        "مقدمة الذكصولوجيات بالنغمة الكيهكي السريعة للربعين (شيرى نى أوتى بارثينوس + تينتى هو آرى)",
      content: "",
    },
  ],
  "رابعة وخامسة وسادسة": [
    {
      id: "s-text1",
      title: "أوشية المسافرين (قبطي + عربي)",
      content: "",
    },
    {
      id: "s-text2",
      title: "ذكصولوجية كي غار كاملة",
      content: "",
    },
    {
      id: "s-text3",
      title:
        "هيتنيات شهر كيهك كاملة (المالك غبلاير المبشر + يوحنا المعمدان نسيب عمانوئيل + الكاهن زكريا واليصابات + يواقيم وحنه)",
      content: "",
    },
  ],
  "اعدادي وثانوي": [
    {
      id: "hs-text1",
      title: "طاي شوري",
      content: "",
    },
    {
      id: "hs-text2",
      title: "ابصالية آدام علي الهوس الثاني (أباهيت نيم باالس) كاملة",
      content: "",
    },
    {
      id: "hs-text3",
      title: "مرد الابركسيس الأحد الأول (شيري غبريل بي نشتي ان ارشي انجيلوس)",
      content: "",
    },
  ],
};

// --- المكون الرئيسي ---
export default function PreparatoryPage() {
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [contentType, setContentType] = useState<"videos" | "text" | "">("");
  const [fullscreenLyrics, setFullscreenLyrics] = useState<Video | null>(null);

  // ====== خاصية التحكم في اللغات ======
  const [showCopticArabic, setShowCopticArabic] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [showCoptic, setShowCoptic] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // ====== خاصية التحكم في حجم الخط ======
  const [fontSize, setFontSize] = useState(18);

  // ====== خاصية التحكم في هزات اللحن ======
  const [showHazzat, setShowHazzat] = useState(false);
  const [showHazzatMenu, setShowHazzatMenu] = useState(false);

  const handleStageChange = (stage: string) => {
    setSelectedStage(stage);
    setContentType("");
  };

  const handleBackToStages = () => {
    setSelectedStage("");
    setContentType("");
  };

  const handleBackToContentTypes = () => {
    setContentType("");
  };

  // دوال التحكم في حجم الخط
  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 1, 20));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 1, 14));
  };

  // حساب عدد الأعمدة المرئية
  const visibleColumns = [showCopticArabic, showArabic, showCoptic].filter(
    Boolean,
  ).length;

  // التحقق من وجود صور هزات
  const hasHazzatImages =
    fullscreenLyrics &&
    (fullscreenLyrics.hazzatImage ||
      fullscreenLyrics.hazzatImage2 ||
      fullscreenLyrics.hazzatImage3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white font-sans">
      <Header />
      <main className="flex-1 page-bg-setup bg-about relative">
        <div className="bg-overlay" />
        <div className="relative z-10 pb-10">
          <div className="bg-gradient-to-b from-blue-900/30 to-transparent py-10 px-4 text-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-3">
              المنهج التمهيدي
            </h1>
            <p className="text-gray-400">
              اختر المرحلة ونوع المحتوى لعرض المنهج الدراسي
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            {!selectedStage ? (
              // اختيار المرحلة
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAGES.map((stage) => (
                  <button
                    key={stage.key}
                    onClick={() => handleStageChange(stage.key)}
                    className="p-6 rounded-xl border-2 bg-gray-900 border-gray-800 hover:border-gray-600 transition-all font-bold text-lg"
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            ) : !contentType ? (
              // اختيار نوع المحتوى
              <div>
                <button
                  onClick={handleBackToStages}
                  className="mb-6 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all"
                >
                  ← العودة إلى المراحل
                </button>
                <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
                  اختر نوع المحتوى لمرحلة:{" "}
                  <span className="text-white">{selectedStage}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <button
                    onClick={() => setContentType("videos")}
                    className="p-8 bg-gray-900 border-2 border-gray-800 hover:border-blue-500 rounded-xl transition-all hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4">🎥</div>
                      <h3 className="text-2xl font-semibold mb-3">
                        الفيديوهات
                      </h3>
                      <p className="text-gray-400">
                        مشاهدة فيديوهات تعليمية للألحان
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setContentType("text")}
                    className="p-8 bg-gray-900 border-2 border-gray-800 hover:border-blue-500 rounded-xl transition-all hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4">📖</div>
                      <h3 className="text-2xl font-semibold mb-3">طقس اللحن</h3>
                      <p className="text-gray-400">
                        قراءة شرح طقس اللحن والتفاصيل
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : contentType === "videos" ? (
              // عرض الفيديوهات
              <div>
                <button
                  onClick={handleBackToContentTypes}
                  className="mb-6 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all"
                >
                  ← العودة
                </button>
                <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
                  🎥 فيديوهات مرحلة:{" "}
                  <span className="text-white">{selectedStage}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {preparatoryVideos[selectedStage]?.map((video) => (
                    <div
                      key={video.id}
                      className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl"
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
                        <h3 className="text-xl font-bold mb-4">
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
              </div>
            ) : (
              // عرض طقس اللحن
              <div>
                <button
                  onClick={handleBackToContentTypes}
                  className="mb-6 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all"
                >
                  ← العودة
                </button>
                <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
                  📖 طقس اللحن لمرحلة:{" "}
                  <span className="text-white">{selectedStage}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {preparatoryTextContent[selectedStage]?.map((textItem) => (
                    <div
                      key={textItem.id}
                      className="bg-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl hover:scale-105 transition-all"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-blue-400 mb-4">
                          {textItem.title}
                        </h3>
                        {textItem.content && (
                          <p className="text-gray-300 leading-relaxed">
                            {textItem.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- مودال النصوص (ملء الشاشة) --- */}
      {fullscreenLyrics && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden">
          <header className="sticky top-0 z-50 p-3 md:p-4 bg-gray-900 border-b border-white/10 flex justify-between items-center gap-2">
            <h2 className="text-blue-400 font-bold text-sm md:text-lg truncate flex-1">
              {fullscreenLyrics.title}
            </h2>

            {/* ====== أزرار التحكم في حجم الخط ====== */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={decreaseFontSize}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 flex items-center justify-center transition-all"
                aria-label="تصغير الخط"
              >
                <span className="text-xl">-</span>
              </button>
              <span className="text-sm px-2">{fontSize}</span>
              <button
                onClick={increaseFontSize}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 flex items-center justify-center transition-all"
                aria-label="تكبير الخط"
              >
                <span className="text-xl">+</span>
              </button>
            </div>

            {/* ====== زر هزات اللحن ====== */}
            {hasHazzatImages && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowHazzatMenu(!showHazzatMenu)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-sm md:text-base transition-all"
                >
                  هزات
                </button>

                {showHazzatMenu && (
                  <div className="absolute left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 min-w-[180px] z-[51]">
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition-all">
                        <input
                          type="checkbox"
                          checked={showHazzat}
                          onChange={(e) => setShowHazzat(e.target.checked)}
                          className="w-5 h-5 accent-purple-600"
                        />
                        <span className="text-sm md:text-base">
                          إظهار الهزات
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={() => setShowHazzatMenu(false)}
                      className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-all"
                    >
                      إغلاق
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ====== زر اللغة ====== */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-sm md:text-base transition-all"
              >
                اللغة
              </button>

              {showLanguageMenu && (
                <div className="absolute left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 min-w-[180px] z-[51]">
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition-all">
                      <input
                        type="checkbox"
                        checked={showArabic}
                        onChange={(e) => setShowArabic(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                      />
                      <span className="text-sm md:text-base">عربي</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition-all">
                      <input
                        type="checkbox"
                        checked={showCopticArabic}
                        onChange={(e) => setShowCopticArabic(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                      />
                      <span className="text-sm md:text-base">قبطي معرب</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-2 rounded transition-all">
                      <input
                        type="checkbox"
                        checked={showCoptic}
                        onChange={(e) => setShowCoptic(e.target.checked)}
                        className="w-5 h-5 accent-blue-600"
                      />
                      <span className="text-sm md:text-base">قبطي</span>
                    </label>
                  </div>

                  <button
                    onClick={() => setShowLanguageMenu(false)}
                    className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-all"
                  >
                    إغلاق
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setFullscreenLyrics(null)}
              className="text-2xl md:text-3xl p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-gray-950 p-2 md:p-6">
            <div className="w-full max-w-7xl mx-auto">
              {/* Header Row */}
              {visibleColumns > 0 && (
                <div
                  className="grid gap-1 md:gap-4 border-b border-white/20 pb-4 mb-4 sticky top-0 bg-gray-950 z-10"
                  style={{
                    gridTemplateColumns: `repeat(${visibleColumns}, 1fr)`,
                  }}
                >
                  {showCopticArabic && (
                    <div className="text-center text-green-500 font-black text-xs md:text-lg">
                      قبطي معرب
                    </div>
                  )}
                  {showArabic && (
                    <div className="text-center text-amber-500 font-black text-xs md:text-lg">
                      عربي
                    </div>
                  )}
                  {showCoptic && (
                    <div className="text-center text-white font-black text-xs md:text-lg">
                      قبطي
                    </div>
                  )}
                </div>
              )}

              {/* Lyrics Content */}
              {(() => {
                const coptic = (fullscreenLyrics.copticcoptic || "").split(
                  "\n\n",
                );
                const copticAr = (fullscreenLyrics.copticArabic || "").split(
                  "\n\n",
                );
                const arabic = (fullscreenLyrics.arabicTranslation || "").split(
                  "\n\n",
                );
                const maxParts = Math.max(
                  coptic.length,
                  copticAr.length,
                  arabic.length,
                );

                return Array.from({ length: maxParts }).map((_, i) => (
                  <div
                    key={i}
                    className="grid gap-1 md:gap-6 py-6 border-b border-white/5 items-center hover:bg-white/[0.02]"
                    style={{
                      gridTemplateColumns: `repeat(${visibleColumns}, 1fr)`,
                    }}
                  >
                    {showCopticArabic && (
                      <div
                        className="text-center leading-relaxed px-1"
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight: "1.6",
                          color: "#4ade80",
                          wordBreak: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {copticAr[i] || "-"}
                      </div>
                    )}
                    {showArabic && (
                      <div
                        className="text-center leading-relaxed italic px-1"
                        style={{
                          fontSize: `${fontSize + 3}px`,
                          lineHeight: "1.6",
                          color: "#fbbf24",
                          wordBreak: "break-word",
                          hyphens: "auto",
                        }}
                      >
                        {arabic[i] || "-"}
                      </div>
                    )}
                    {showCoptic && (
                      <div
                        className="text-center font-copt leading-relaxed px-1"
                        style={{
                          fontSize: `${fontSize + 2}px`,
                          lineHeight: "1.7",
                          color: "#ffffff",
                          wordBreak: "break-word",
                        }}
                      >
                        {coptic[i] || "-"}
                      </div>
                    )}
                  </div>
                ));
              })()}

              {/* قسم صور هزات اللحن */}
              {showHazzat && hasHazzatImages && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-0 w-full auto-rows-max">
                  {fullscreenLyrics.hazzatImage && (
                    <div className="relative overflow-hidden w-full m-0 p-0 border-2 border-purple-500/30 rounded-lg">
                      <img
                        src={fullscreenLyrics.hazzatImage}
                        alt="هزات اللحن"
                        className="w-full h-auto object-contain m-0 p-0 block cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                  )}

                  {fullscreenLyrics.hazzatImage2 && (
                    <div className="relative overflow-hidden w-full m-0 p-0 border-2 border-purple-500/30 rounded-lg">
                      <img
                        src={fullscreenLyrics.hazzatImage2}
                        alt="هزات اللحن - صورة إضافية 1"
                        className="w-full h-auto object-contain m-0 p-0 block cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                  )}

                  {fullscreenLyrics.hazzatImage3 && (
                    <div className="relative overflow-hidden w-full m-0 p-0 border-2 border-purple-500/30 rounded-lg">
                      <img
                        src={fullscreenLyrics.hazzatImage3}
                        alt="هزات اللحن - صورة إضافية 2"
                        className="w-full h-auto object-contain m-0 p-0 block cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                  )}
                </div>
              )}
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
