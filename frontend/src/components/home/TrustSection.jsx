import { useMemo, useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import {
  Shield,
  CheckCircle,
  Headphones,
  Zap,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrustSection() {
  const navigate = useNavigate();
  const trustFeatures = [
    {
      icon: Shield,
      title: "Secure & Protected",
      description:
        "Bank-level security with encryption and fraud protection for every donation.",
    },
    {
      icon: CheckCircle,
      title: "Giving Guarantee",
      description:
        "Your donation is protected. If something goes wrong, we've got you covered.",
    },
    {
      icon: Headphones,
      title: "Expert Support",
      description: "24/7 customer support team ready to help you succeed.",
    },
    {
      icon: Zap,
      title: "Fast & Easy",
      description:
        "Set up in minutes and receive funds quickly with no waiting period.",
    },
  ];

  // ✅ Your real 3 testimonials (design like screenshot)
  const testimonials = [
    {
      quote:
        "This platform helped us raise funds for our daughter's medical treatment. The support was incredible and we reached our goal in just two weeks.",
      author: "Michael Chen",
      role: "Fundraiser Organizer",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80",
    },
    {
      quote:
        "Simple, transparent, and trustworthy. I've donated to several causes and love seeing the direct impact of my contributions.",
      author: "Emily Rodriguez",
      role: "Regular Donor",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=80",
    },
    {
      quote:
        "Started my campaign in minutes. The tools and guidance made everything so straightforward. Highly recommend to anyone needing support.",
      author: "James Wilson",
      role: "Small Business Owner",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80",
    },
  ];

  // Carousel state
  const [tIndex, setTIndex] = useState(0);

  const prev = () =>
    setTIndex((v) => (v - 1 + testimonials.length) % testimonials.length);
  const next = () => setTIndex((v) => (v + 1) % testimonials.length);

  // Show 2 cards on desktop, 1 on mobile (CSS), but we provide 2 items always
  const visible = useMemo(() => {
    const first = testimonials[tIndex % testimonials.length];
    const second = testimonials[(tIndex + 1) % testimonials.length];
    return [first, second];
  }, [tIndex]);

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trust and Safety
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to keeping your fundraising safe and successful
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {trustFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="text-center group hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-xl mb-4 group-hover:bg-emerald-600 transition-colors">
                  <Icon className="w-7 h-7 text-emerald-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Testimonials (design like screenshot) */}
        <div className="mb-16">
          <h3 className="text-lg font-bold text-emerald-800 text-center mb-8">
            Testimonials
          </h3>

          <div className="relative flex items-center justify-center">
            {/* Left arrow (desktop) */}
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full
                         bg-emerald-600 text-white shadow hover:bg-emerald-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Cards container */}
            <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl">
              {visible.map((t, idx) => (
                <div
                  key={`${t.author}-${idx}`}
                  className="bg-white rounded-2xl border border-emerald-100 shadow-lg overflow-hidden"
                >
                  <div className="p-7">
                    {/* Stars */}
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-emerald-600 fill-current"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-gray-800 text-lg leading-relaxed">
                      "{t.quote}"
                    </p>

                    {/* Divider */}
                    <div className="my-6 border-t border-gray-100" />

                    {/* Author row */}
                    <div className="flex items-center gap-4">
                      <img
                        src={t.image}
                        alt={t.author}
                        className="w-14 h-14 rounded-full object-cover border border-emerald-100"
                      />
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {t.author}
                        </p>
                        <p className="text-gray-600">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right arrow (desktop) */}
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full
                         bg-emerald-600 text-white shadow hover:bg-emerald-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Mobile arrows (below) */}
            <div className="sm:hidden absolute -bottom-12 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={prev}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full
                           bg-emerald-600 text-white shadow hover:bg-emerald-700 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full
                           bg-emerald-600 text-white shadow hover:bg-emerald-700 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1400&h=600&fit=crop&q=80"
              alt="People collaborating"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/90 to-teal-950/90"></div>
          </div>

          <div className="relative text-center py-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to make a difference?
            </h2>
            <p className="text-lg text-emerald-50/90 mb-8 max-w-2xl mx-auto">
              Join millions of people raising money for causes they care about.
              Start your free fundraiser today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
              >
                Start your fundraiser
                <ArrowRight className="w-5 h-5" />
              </Button>

              <button onClick={() => navigate("/faq")} className="px-8 py-3.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/50 rounded-lg font-semibold transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
