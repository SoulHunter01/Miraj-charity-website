import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ImpactSection from "../components/home/ImpactSection"; // the section you already added
import StatsSection from "../components/home/StatsSection";

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Top block (like screenshot: text left, image right) */}
      <section className="bg-emerald-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: text */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-4">
                Something along the lines of a slogan!
              </h1>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                luctus, lorem id viverra fermentum, libero augue posuere augue,
                in cursus risus ligula nec risus. Integer euismod, sapien sed
                maximus volutpat, nibh ipsum dignissim nisl, sed feugiat ligula
                eros sed mi.
              </p>

              <p className="text-gray-700 leading-relaxed mt-4">
                This page is where you can show impact, transparency, and trust —
                highlight real metrics, stories, and initiatives.
              </p>
            </div>

            {/* Right: image */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-emerald-100 bg-white">
              <img
                src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1400&h=900&fit=crop&q=80"
                alt="Impact"
                className="w-full h-80 lg:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Middle: stats + categories + stories (reusing your existing section) */}
      <main>
        <StatsSection />
      </main>

      <Footer />
    </div>
  );
}
