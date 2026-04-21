import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router";
import {
  FaMusic,
  FaLayerGroup,
  FaFont,
  FaHeadphones,
  FaRedo,
  FaPlay,
  FaHandPaper,
  FaQuestionCircle,
  FaWifi,
} from "react-icons/fa";

const helpSections = [
  {
    title: "١. اختيار اللحن",
    icon: FaMusic,
    items: [
      {
        label: "اختيار المرحلة الدراسية",
        description:
          "في صفحة الألحان، اضغط على أحد أزرار المراحل الدراسية: حضانة، أولى و ثانية، ثالثة و رابعة، خامسة و سادسة، إعدادي، ثانوي، جامعة، خدام، أو عرس قانا الجليل",
      },
      {
        label: "اختيار المستوى",
        description:
          "بعد اختيار المرحلة، اختر المستوى المناسب: الأول، الثاني، أو الموهوبين",
      },
      {
        label: "فتح اللحن",
        description:
          "اضغط على أي زر من ألحان المرحلة المعروضة لتشغيل مقطع الفيديو أو عرض كلمات اللحن",
      },
    ],
  },
  {
    title: "٢. لوحة الإعدادات",
    icon: FaQuestionCircle,
    items: [
      {
        label: "فتح الإعدادات",
        description:
          "اضغط على أيقونة الترس (⚙️) في أعلى نافذة كلمات اللحن لفتح لوحة الإعدادات",
      },
      {
        label: "إغلاق الإعدادات",
        description:
          "اضغط على أيقونة الإغلاق (✕) في رأس لوحة الإعدادات أو اضغط في أي مكان خارجها لإغلاقها",
      },
    ],
  },
  {
    title: "٣. عرض كلمات اللحن",
    icon: FaLayerGroup,
    items: [
      {
        label: "فتح نافذة الكلمات",
        description:
          "اضغط على زر 'عرض كلمات اللحن' أسفل كل لحن لفتح نافذة كاملة تعرض كلمات اللحن بثلاث لغات",
      },
      {
        label: "اللغات المتاحة",
        description:
          "يمكنك اختيار إظهار أو إخفاء كل لغة: اللغة العربية، القبطي المُعرَّب، واللغة القبطية",
      },
    ],
  },
  {
    title: "٤. التحكم في حجم الخط",
    icon: FaFont,
    items: [
      {
        label: "تكبير وتصغير الخط",
        description:
          "اضغط على زر (+) أو (-) في لوحة الإعدادات لتكبير أو تصغير حجم الخط للنصوص",
      },
      {
        label: "نطاق حجم الخط",
        description:
          "يتراوح حجم الخط بين 10px إلى 24px حسب عدد اللغات المفعّلة",
      },
      {
        label: "زيادة الخط",
        description:
          "عند إلغاء تفعيل لغة من اللغات، يزداد الحد الأقصى لحجم الخط بمقدار 2 بكسل",
      },
    ],
  },
  {
    title: "٥. عرض الهزات",
    icon: FaHeadphones,
    items: [
      {
        label: "تفعيل عرض الهزات",
        description:
          "في لوحة الإعدادات، اضغط على زر 'عرض هزات اللحن' لإظهار صور الهزات",
      },
      {
        label: "إخفاء الهزات",
        description: "اضغط مرة أخرى لإخفاء صور الهزات",
      },
    ],
  },
  {
    title: "٦. تدوير الشاشة",
    icon: FaRedo,
    items: [
      {
        label: "التدوير الأفقي",
        description:
          "اضغط على زر 'تدوير الشاشة' في لوحة الإعدادات لتدوير الشاشة ووضعها أفقياً",
      },
      {
        label: "الوضع العمودي",
        description: "اضغط مرة أخرى للعودة للوضع العمودي",
      },
    ],
  },
  {
    title: "٧. تشغيل الفيديو",
    icon: FaPlay,
    items: [
      {
        label: "تشغيل وإيقاف الفيديو",
        description:
          "اضغط على زر التشغيل (▶️) في النافذة لبدء تشغيل مقطع الفيديو، أو على زر الإغلاق (✕) لإيقافه",
      },
      {
        label: "تصغير الفيديو",
        description:
          "اضغط على أيقونة التصغير (ثلاثة خطوط أفقية متلامسة بلون أزرق) في أعلى يمين الفيديو لإخفائه في زاوية الشاشة",
      },
      {
        label: "توسيع الفيديو",
        description: "اضغط على الفيديو المصغر في أي وقت لتوسيعه مرة أخرى",
      },
    ],
  },
  {
    title: "٨. تحريك الفيديو",
    icon: FaHandPaper,
    items: [
      {
        label: "سحب الفيديو",
        description:
          "اسحب الفيديو من أي مكان في الشاشة لتحريكه إلى المكان المناسب",
      },
      {
        label: "التحكم باللمس",
        description: "يمكنك استخدام الماوس أو إصبعك على شاشة اللمس للسحب",
      },
    ],
  },
  {
    title: "٩. العمل بدون إنترنت (التخزين المحلي)",
    icon: FaWifi,
    items: [
      {
        label: "الفكرة",
        description:
          "عند الدخول على البرنامج لأول مرة وأنت متصل بالإنترنت، يقوم البرنامج بتخزين الألحان والفيديوهات والصور على جهازك تلقائياً، حتى تتمكن من مشاهدتها لاحقاً بدون إنترنت",
      },
      {
        label: "كيف يعمل",
        description:
          "عند تشغيل أي لحن أو مشاهدته، يقوم البرنامج بتخزينه مؤقتاً على جهازك في الخلفية دون أن تشعر. يمكنك إغلاق البرنامج أو فصل الإنترنت وسيظل كل شيء يعمل",
      },
      {
        label: "ما الذي يُخزَّن؟",
        description:
          "يتم تخزين الفيديوهات والصور والنصوص بشكل تلقائي حتى تتمكن من استخدامها في أي وقت بدون اتصال",
      },
      {
        label: "كيف تتأكد من التخزين؟",
        description:
          "لضمان توفر جميع المحتويات بدون إنترنت، افتح البرنامج مرة واحدة وأنت متصل بالإنترنت وتصفح الألحان التي تريدها. سيقوم البرنامج بتخزينها تلقائياً",
      },
      {
        label: "إعادة التشغيل بدون نت",
        description:
          "بمجرد أن يتم تخزين المحتوى على جهازك، يمكنك إغلاق البرنامج وفصل الإنترنت وإعادة فتحه - ستجد كل شيء يعمل بشكل طبيعي بدون أي مشكلة",
      },
    ],
  },
];

export default function Help() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#060d1f]/75 to-[#060d1f]/95 z-0" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <header className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-900/50 border border-blue-500/30 mb-4">
              <FaQuestionCircle className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              دليل استخدام برنامج الألحان
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
              شرح تفصيلي لجميع ميزات البرنامج وكيفية استخدامها
            </p>
          </header>

          <div className="space-y-6 sm:space-y-8">
            {helpSections.map((section, sectionIndex) => (
              <section
                key={section.title}
                className="glass-card-dark p-5 sm:p-6 md:p-8"
                style={{
                  animationDelay: `${sectionIndex * 100}ms`,
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-800/40 border border-blue-600/30">
                    <section.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-blue-300">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/20"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.label}
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-8 sm:mt-12 glass-card border-blue-500/20 p-5 sm:p-6 md:p-8">
            <h2 className="text-xl font-bold text-blue-300 mb-5 text-center">
              هل تحتاج مساعدة إضافية؟
            </h2>
            <p className="text-gray-300 text-base leading-relaxed text-center">
              إذا كانت لديك أي استفسارات عن استخدام البرنامج، يمكنك التواصل معنا
              عبر الواتساب في أسفل الصفحة
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
