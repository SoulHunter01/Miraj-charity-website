import Button from "../common/Button";
import { ArrowRight } from "lucide-react";

// ✅ Adjust these paths to where your images actually are
import yourCause from "../../assets/image 1.png";
// import medicalImg from "../../assets/image2.png";
// import emergencyImg from "../../assets/image3.png";
// import educationImg from "../../assets/image4.png";
// import animalsImg from "../../assets/image5.png";
// import businessImg from "../../assets/image6.png";

export default function Hero() {
  const floatingCategories = [
    { label: "Your cause", image: yourCause, position: "top-8 left-[18%]", delay: "0s" },
    { label: "Medical", image: yourCause, position: "top-1/2 left-[8%] -translate-y-1/2", delay: "0.5s" },
    { label: "Emergency", image: yourCause, position: "bottom-16 left-[18%]", delay: "1s" },
    { label: "Education", image: yourCause, position: "top-8 right-[18%]", delay: "1.5s" },
    { label: "Animals", image: yourCause, position: "top-1/2 right-[8%] -translate-y-1/2", delay: "2s" },
    { label: "Business", image: yourCause, position: "bottom-16 right-[18%]", delay: "2.5s" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-hidden py-16 lg:py-24">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      {/* Floating images */}
      {floatingCategories.map((category, index) => (
        <div
          key={index}
          className={`hidden xl:block absolute ${category.position} animate-float`}
          style={{ animationDelay: category.delay }}
        >
          <div className="relative">
            <svg className="absolute -inset-2 w-36 h-36" style={{ transform: "rotate(-45deg)" }}>
              <circle
                cx="72"
                cy="72"
                r="66"
                fill="none"
                stroke="url(#greenGradient)"
                strokeWidth="8"
                strokeDasharray="280 420"
                strokeLinecap="round"
                opacity="0.8"
              />
              <defs>
                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img src={category.image} alt={category.label} className="w-full h-full object-cover" />
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-emerald-200">
              <span className="text-sm font-semibold text-emerald-700">{category.label}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Main */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-6 animate-fadeIn">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-emerald-200 text-emerald-800 text-sm font-medium shadow-sm">
              #1 Trusted fundraising platform
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6 animate-fadeIn">
            Online fundraising
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              that creates impact
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fadeIn animation-delay-500">
            Raise funds for causes that matter. Simple, secure, and trusted by communities worldwide.
          </p>

          <div className="animate-fadeIn animation-delay-1000 mb-12">
            <Button
              size="lg"
              variant="primary"
              className="text-base px-10 py-4 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-xl hover:shadow-2xl"
            >
              Start a Fundraiser
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fadeIn animation-delay-1500">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">1000+</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Cases Fulfilled</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">99991032</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Rupees Raised</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">10000+</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">Donors Obtained</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; opacity: 0; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
      `}</style>
    </section>
  );
}
