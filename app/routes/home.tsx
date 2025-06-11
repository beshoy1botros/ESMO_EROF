// app/routes/home.tsx

import { Welcome } from "../welcome/welcome";
import Header from "../components/Header";
import Footer from "../components/Footer";

export function meta() {
  return [
    { title: "ⲥⲙⲟⲩ ⲉⲣⲟϥ" },
    {
      name: "description",
      content: "موقع متخصص في تعليم الألحان القبطية للطلاب في مختلف المراحل",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* الهيدر في الأعلى */}
      <Header />

      {/* لتعطيل تحذير Webhint no-inline-styles على العنصر التالي: */}
      {/* hint ignore: no-inline-styles */}
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat home-background">
        {/* طبقة التعتيم */}
        <div className="absolute inset-0 bg-black/20 z-0" />

        {/* النص فوق الطبقة */}
        <div className="relative z-10 max-w-4xl w-full mx-auto text-center pt-15 px-4 md:px-8 text-white">
          <h2 className="text-2xl md:text-4xl mb-6 drop-shadow-lg">
            باسم الآب والابن والروح القدس، الإله الواحد. آمين.
          </h2>
          <p className="text-lg md:text-2xl mb-4 drop-shadow-md">
            “أخبر باسمك إخوتي وفي وسط الكنيسة أسبّحك.” (عب ٢: ١٢)
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-4 drop-shadow-sm">
            ما أجمل التسبيح في الكنيسة بأنغام موزونة؛ فالتسبيح هو عمل الملائكة،
            وهو الاشتراك الفعلي مع القوات السمائية في تسبيح الله الخالق،
            والتسبيح بالألحان يزيد الكلمات جمالاً وعذوبةً ويشبع الإنسان في كل
            نواحي حياته من خلال الصلاة ومناجاة الله؛ ففيها: الشكر والتمجيد
            والتسبيح والطلب. والمؤمن الذي يتعلم طرقها الهادئة الجميلة يصبح
            حاملاً لسرٍّ عظيم، وهو سرّ التسبيح لله كما يقول القديس بولس الرسول:
          </p>
          <p className="text-lg md:text-2xl italic drop-shadow-md">
            “مكملين بعضكم بعضاً بمزامير وتسابيح وأغاني روحية، مترنّمين ومرتلين
            في قلوبكم للرب.” (أف ٥: ١٩)
          </p>
        </div>
      </main>

      {/* الفوتر في الأسفل */}
      <Footer />
    </div>
  );
}
