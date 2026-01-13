import Card from "../common/Card";
import { Users, Clock, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function FeaturedFundraisers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fundraisers = [
    {
      title: "Support Local Children's Hospital Wing",
      organizer: "Sarah Johnson",
      raised: 45230,
      goal: 50000,
      supporters: 892,
      category: "Medical",
      daysLeft: 12,
      image:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop&q=80",
    },
    {
      title: "Wildfire Community Relief Fund",
      organizer: "Community Foundation",
      raised: 128500,
      goal: 150000,
      supporters: 2145,
      category: "Emergency",
      daysLeft: 8,
      image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop&q=80",
    },
    {
      title: "Scholarships for Underprivileged Students",
      organizer: "Education Alliance",
      raised: 35800,
      goal: 40000,
      supporters: 567,
      category: "Education",
      daysLeft: 15,
      image:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop&q=80",
    },
    {
      title: "Animal Shelter Expansion Project",
      organizer: "Pets Haven Charity",
      raised: 22100,
      goal: 30000,
      supporters: 423,
      category: "Animals",
      daysLeft: 20,
      image:
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop&q=80",
    },
    {
      title: "Clean Water Initiative for Rural Areas",
      organizer: "Water for All",
      raised: 67800,
      goal: 80000,
      supporters: 1243,
      category: "Community",
      daysLeft: 18,
      image:
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&q=80",
    },
    {
      title: "Small Business Recovery Fund",
      organizer: "Local Business Alliance",
      raised: 89200,
      goal: 100000,
      supporters: 756,
      category: "Business",
      daysLeft: 10,
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop&q=80",
    },
  ];

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

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, slidesToShow]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) =>
      prev === 0 ? fundraisers.length - slidesToShow : prev - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(
      (prev) => (prev + 1) % (fundraisers.length - slidesToShow + 1)
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

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
            {fundraisers.map((fundraiser, index) => {
              const percentage = Math.round(
                (fundraiser.raised / fundraiser.goal) * 100
              );

              return (
                <div
                  key={index}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <Card padding={false} className="group overflow-hidden">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={fundraiser.image}
                        alt={fundraiser.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-emerald-700 text-xs font-semibold rounded-full">
                        {fundraiser.category}
                      </span>

                      <button className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {fundraiser.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4">
                        by <span className="font-semibold">{fundraiser.organizer}</span>
                      </p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-bold text-gray-900">
                            ${fundraiser.raised.toLocaleString()}
                          </span>
                          <span className="text-gray-600">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          of ${fundraiser.goal.toLocaleString()} goal
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {fundraiser.supporters}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {fundraiser.daysLeft} days left
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
