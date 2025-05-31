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
      <main
        className="
          flex-1
          bg-[url('/icon.jpg')]
          bg-contain
          bg-center
          bg-no-repeat
          flex
          flex-col
          justify-center
          px-4
          md:px-8
          lg:px-8
        "
      >
        <div className="max-w-4xl w-full mx-auto text-white text-center">
          <h2 className="text-3xl md:text-4xl text-blue-500 mb-4 drop-shadow-lg">
            كل نسمة فلتسبح الرب. (مز ٦:١٥٠)
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
