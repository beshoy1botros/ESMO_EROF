import Header from "../components/Header";
import Footer from "../components/Footer";

export function meta() {
  return [
    { title: "ⲥⲙⲟⲩ ⲉⲣⲟϥ - الرئيسية" },
    {
      name: "description",
      content: "موقع متخصص في تعليم الألحان القبطية للطلاب في مختلف المراحل",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 relative home-background overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-0" />

        <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-col justify-center min-h-[calc(100vh-200px)] px-6 py-10 text-white text-center">
          
          {/* البسملة */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold leading-relaxed border-b border-blue-500/30 pb-4 inline-block drop-shadow-lg text-blue-50">
              باسم الآب والابن والروح القدس
              <br />
              <span className="text-blue-400">الإله الواحد. آمين.</span>
            </h2>
          </div>

          {/* الآية المركزية */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl mb-8 border border-white/10 shadow-2xl">
            <p className="text-2xl md:text-3xl font-medium leading-snug text-blue-100 drop-shadow-md">
              “أخبر باسمك إخوتي وفي وسط الكنيسة أسبّحك.”
            </p>
            <span className="block mt-2 text-sm text-gray-300 font-light italic">
              (عب ٢ : ١٢)
            </span>
          </div>

          {/* النص الوصفي - تم تكبير الخط هنا */}
          <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-loose font-normal text-gray-50 px-2 drop-shadow-md">
            <p>
              ما أجمل التسبيح في الكنيسة بأنغام موزونة؛ فالتسبيح هو عمل
              الملائكة، وهو الاشتراك الفعلي مع القوات السمائية في تسبيح الله الخالق.
            </p>

            <p>
              التسبيح بالألحان يزيد الكلمات جمالاً وعذوبةً ويشبع الإنسان في كل نواحي حياته من خلال
              الصلاة ومناجاة الله؛ ففيها: الشكر والتمجيد والتسبيح والطلب.
            </p>

            <p className="text-blue-200 font-medium">
              والمؤمن الذي يتعلم طرقها الهادئة الجميلة يصبح حاملاً لسرٍّ عظيم، وهو سرّ التسبيح لله كما يقول القديس بولس الرسول:
            </p>

            {/* الآية الختامية */}
            <p className="bg-blue-600/20 py-6 px-4 rounded-3xl italic text-xl md:text-2xl border-y border-blue-500/30 shadow-inner">
              “مكملين بعضكم بعضاً بمزامير وتسابيح وأغاني روحية، مترنّمين ومرتلين في قلوبكم للرب.”
              <span className="block not-italic text-sm mt-3 opacity-80 font-sans">
                (أف ٥ : ١٩)
              </span>
            </p>
          </div>

          <div className="mt-12"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}