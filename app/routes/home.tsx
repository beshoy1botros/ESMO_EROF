import Header from "../components/Header";
import Footer from "../components/Footer";

export function meta() {
  return [
    { title: "Coptic Hymns — الرئيسية" },
    {
      name: "description",
      content: "موقع متخصص في تعليم الألحان القبطية للطلاب في مختلف المراحل",
    },
  ];
}

const verses = [
  {
    text: "ما أجمل التسبيح في الكنيسة بأنغام موزونة؛ فالتسبيح هو عمل الملائكة، وهو الاشتراك الفعلي مع القوات السمائية في تسبيح الله الخالق.",
    delay: "delay-200",
  },
  {
    text: "التسبيح بالألحان يزيد الكلمات جمالاً وعذوبةً ويشبع الإنسان في كل نواحي حياته من خلال الصلاة ومناجاة الله؛ ففيها: الشكر والتمجيد والتسبيح والطلب.",
    delay: "delay-300",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 relative home-background overflow-hidden">
        {/* طبقة الظلام */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#060d1f]/75 to-[#060d1f]/95 z-0" />

        {/* زخرفة — FIX: أزلنا inline style واستبدلناها بـ CSS class */}
        <div
          aria-hidden="true"
          className="home-radial-glow absolute inset-0 z-0 opacity-20 pointer-events-none"
        />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 text-white text-center">
          {/* البسملة — FIX: delay-0 بدل style={{ animationDelay: "0ms" }} */}
          <header className="mb-8 sm:mb-12 animate-fade-up delay-0">
            <div className="inline-block">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed text-blue-50/90 pb-3 border-b border-blue-500/25">
                باسم الآب والابن والروح القدس
                <br />
                <span className="text-blue-400 font-bold">
                  الإله الواحد. آمين.
                </span>
              </h2>
            </div>
          </header>

          {/* الآية المركزية — FIX: delay-100 بدل style={{ animationDelay: "120ms" }} */}
          <div className="glass-card-dark mb-8 sm:mb-12 px-5 sm:px-8 py-6 sm:py-8 animate-fade-up delay-100">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-blue-50 drop-shadow">
              "أخبر باسمك إخوتي وفي وسط الكنيسة أسبّحك."
            </p>
            <cite className="block mt-3 text-xs sm:text-sm text-blue-300/70 not-italic font-light tracking-wide">
              (عب ٢ : ١٢)
            </cite>
          </div>

          {/* النصوص الوصفية */}
          <div className="space-y-5 sm:space-y-6 mb-8 sm:mb-12">
            {verses.map((v, i) => (
              <p
                key={i}
                className={`
                  text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose
                  text-gray-200/90 text-justify sm:text-center
                  animate-fade-up ${v.delay}
                `}
              >
                {v.text}
              </p>
            ))}

            {/* FIX: delay-[400ms] بدل style={{ animationDelay: "400ms" }} */}
            <p className="text-blue-300 font-medium text-base sm:text-lg md:text-xl leading-relaxed text-center animate-fade-up delay-[400ms]">
              والمؤمن الذي يتعلم طرقها الهادئة الجميلة يصبح حاملاً لسرٍّ عظيم،
              وهو سرّ التسبيح لله كما يقول القديس بولس الرسول:
            </p>
          </div>

          {/* الآية الختامية — FIX: delay-[500ms] بدل style={{ animationDelay: "500ms" }} */}
          <blockquote
            className="glass-card border-blue-500/20 px-5 sm:px-8 py-6 sm:py-8 animate-fade-up delay-[500ms]"
            cite="أف ٥ : ١٩"
          >
            <div className="w-12 h-px mx-auto mb-4 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

            <p className="text-lg sm:text-xl md:text-2xl italic leading-relaxed text-blue-50">
              "مكملين بعضكم بعضاً بمزامير وتسابيح وأغاني روحية، مترنّمين ومرتلين
              في قلوبكم للرب."
            </p>

            <cite className="block mt-4 not-italic text-xs sm:text-sm text-blue-300/70 tracking-wide font-light">
              (أف ٥ : ١٩)
            </cite>

            <div className="w-12 h-px mx-auto mt-4 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          </blockquote>

          <div className="mt-10 sm:mt-16" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
