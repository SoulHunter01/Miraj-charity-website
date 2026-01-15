import Card from "../common/Card";
import { Users, Clock, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { apiJson } from "../../services/apiAuth";

export default function FeaturedFundraisers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);

  // responsive slides
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSlidesToShow(1);
      else if (window.innerWidth < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // fetch featured from backend
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await apiJson("/api/auth/fundraisers/featured/?limit=12", {
          method: "GET",
          auth: false, // public
        });
        setFundraisers(Array.isArray(data) ? data : []);
        setCurrentIndex(0);
      } catch (e) {
        console.error("Failed to load featured fundraisers:", e);
        setFundraisers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const maxIndex = useMemo(() => {
    const len = fundraisers.length;
    return Math.max(0, len - slidesToShow);
  }, [fundraisers.length, slidesToShow]);

  // autoplay
  useEffect(() => {
    if (fundraisers.length <= slidesToShow) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, slidesToShow, fundraisers.length]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    if (fundraisers.length === 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    if (fundraisers.length === 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const formatMoney = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return "0";
    return n.toLocaleString();
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">Loading featured fundraisers...</div>
        </div>
      </section>
    );
  }

  if (!fundraisers.length) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Featured fundraisers
              </h2>
              <p className="text-lg text-gray-600">
                Discover inspiring causes making a real difference
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            No active fundraisers available right now.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Featured fundraisers
            </h2>
            <p className="text-lg text-gray-600">
              Discover inspiring causes making a real difference
            </p>
          </div>

          <div className="hidden md:flex gap-2">
            <button
              onClick={goToPrevious}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-emerald-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-emerald-700" />
            </button>
            <button
              onClick={goToNext}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-emerald-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            }}
          >
            {fundraisers.map((f) => {
              const raised = Number(f.collected_amount || 0);
              const goal = Number(f.target_amount || 0);
              const percentage = goal > 0 ? Math.round((raised / goal) * 100) : 0;

              return (
                <div
                  key={f.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <Card padding={false} className="group overflow-hidden">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={f.image || "https://via.placeholder.com/600x400?text=Fundraiser"}
                        alt={f.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-emerald-700 text-xs font-semibold rounded-full">
                        {f.category || "General"}
                      </span>

                      <button className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {f.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4">
                        by <span className="font-semibold">{f.organizer || "Unknown"}</span>
                      </p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-bold text-gray-900">
                            Rs {formatMoney(raised)}
                          </span>
                          <span className="text-gray-600">{Math.min(percentage, 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          of Rs {formatMoney(goal)} goal
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {f.donations_count ?? 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {f.days_left ?? 0} days left
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
