import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Header from "../components/Header";
import Footer from "../components/Footer";

export function meta({}: Route.MetaArgs) {
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

      {/* الخلفية والصورة */}
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1636228492762-a942c24b19fd?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3')",
        }}
      >
        {/* طبقة التعتيم */}
        <div className="absolute inset-0 bg-black/20 z-0" />

        {/* النص فوق الطبقة */}
        <div className="relative z-10 max-w-4xl w-full mx-auto text-center pt-15 px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl text-blue-300 mb-4 drop-shadow-lg">
              كُلُّ نَسَمَةٍ فَلْتُسَبِّحِ الرَّبَّ. (مز ٦:١٥٠)
          </h2>
          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* ... existing code ... */}
          </div>
        </div>
      </main>

      {/* الفوتر في الأسفل */}
      <Footer />
    </div>
  );
}
