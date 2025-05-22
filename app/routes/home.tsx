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
      {/* خلفية فنية جديدة: موجات متداخلة وألوان هادئة مع نوتات شفافة */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(120deg, #0f172a 0%,rgb(25, 65, 152) 60%, #a21caf 100%)",
        }}
      >
        {/* موجات شفافة متداخلة */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.13 }}
        >
          <path d="M0 300 Q360 400 720 300 T1440 300 V500 H0Z" fill="#38bdf8" />
          <path d="M0 200 Q360 320 720 200 T1440 200 V500 H0Z" fill="#a21caf" />
          <path d="M0 100 Q360 180 720 100 T1440 100 V500 H0Z" fill="#2563eb" />
        </svg>
        {/* نوتات شفافة متداخلة */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.18 }}
        >
          <g>
            <circle cx="200" cy="120" r="18" fill="#fff" fillOpacity="0.18" />
            <rect
              x="195"
              y="70"
              width="8"
              height="50"
              rx="4"
              fill="#fff"
              fillOpacity="0.18"
            />
          </g>
          <g>
            <circle cx="900" cy="220" r="14" fill="#fff" fillOpacity="0.13" />
            <rect
              x="895"
              y="190"
              width="8"
              height="30"
              rx="4"
              fill="#fff"
              fillOpacity="0.13"
            />
          </g>
          <g>
            <circle cx="1300" cy="350" r="20" fill="#fff" fillOpacity="0.15" />
            <rect
              x="1295"
              y="310"
              width="8"
              height="40"
              rx="4"
              fill="#fff"
              fillOpacity="0.15"
            />
          </g>
        </svg>
      </div>
      <div className="relative z-10 min-h-screen bg-gray-900/70 text-white flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center my-12">
              <h2 className="text-4xl text-blue-500 mb-4 drop-shadow-lg">
                كل نسمة فلتسبح الرب. (مز ٦:١٥٠)
              </h2>
              <p className="text-xl text-gray-100 max-w-[600px] mx-auto drop-shadow">
                أهلاً بيك يا صديقي، يارب تكون بخير.
              </p>
              <p className="text-xl text-gray-100 max-w-[600px] mx-auto drop-shadow">
                قبل ما تبدأ اتمنى منك الالتزام، عشان نسمع صوتك الحلو في كنيستنا
                الجميلة.
              </p>
              <p className="text-xl text-gray-100 max-w-[600px] mx-auto drop-shadow">
                وجودك منورنا.
              </p>
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
