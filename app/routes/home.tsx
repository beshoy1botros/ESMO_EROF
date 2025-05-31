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
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <div className="relative z-10 min-h-screen text-white flex flex-col">
        <Header />
        <main
          className="flex-1 p-8"
          style={{
            backgroundImage: "url('icon.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center my-12">
              <h2 className="text-4xl text-blue-500 mb-4 drop-shadow-lg">
                كل نسمة فلتسبح الرب. (مز ٦:١٥٠)
              </h2>
            </div>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
              {/* ... existing code ... */}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
