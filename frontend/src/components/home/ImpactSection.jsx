import Card from "../common/Card";
import Button from "../common/Button";
import {
  GraduationCap,
  Building2,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function ImpactSection() {
  const successfulFundraisers = [
    {
      title: "Aenean egestas libero amet",
      desc:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hendrerit vel dolor et scelerisque at turpis.",
      raisedLabel: "Reached goal of $18,000",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80",
    },
    {
      title: "Aenean egestas libero amet",
      desc:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hendrerit vel dolor et scelerisque at turpis.",
      raisedLabel: "Reached goal of $18,000",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80",
    },
    {
      title: "Aenean egestas libero amet",
      desc:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hendrerit vel dolor et scelerisque at turpis.",
      raisedLabel: "Reached goal of $18,000",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80",
    },
  ];

  const nearbyCauses = [
    {
      title: "Lorem ipsum dias her as.",
      desc:
        "Pellentesque sit amet purus et lorem ultricies commodo. Sed et augue mauris.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80",
    },
    {
      title: "Lorem ipsum dias her as.",
      desc:
        "Pellentesque sit amet purus et lorem ultricies commodo. Sed et augue mauris.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80",
    },
    {
      title: "Lorem ipsum dias her as.",
      desc:
        "Pellentesque sit amet purus et lorem ultricies commodo. Sed et augue mauris.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80",
    },
  ];

  const exploreCategories = [
    {
      icon: GraduationCap,
      title: "Fund a Student",
      desc: "Support education and student needs.",
    },
    {
      icon: Building2,
      title: "Fund an Institution",
      desc: "Help schools, clinics, and organizations grow.",
    },
    {
      icon: HeartHandshake,
      title: "Fund an Organization",
      desc: "Back nonprofit missions and community projects.",
    },
  ];

  return (
    <section className="bg-emerald-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 1) Successful fundraisers */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-800">
            Successful fundraisers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successfulFundraisers.map((item, idx) => (
            <Card
              key={idx}
              padding={false}
              className="overflow-hidden group bg-white border border-emerald-100"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Check badge */}
                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shadow">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="p-5 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.desc}</p>

                <div className="flex items-center justify-center text-xs font-semibold text-emerald-700 gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  {item.raisedLabel}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Spacer */}
        <div className="h-14" />

        {/* 2) Donate to causes closest to home */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-800">
            Donate to causes closest to home
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nearbyCauses.map((item, idx) => (
            <Card
              key={idx}
              padding={false}
              className="overflow-hidden bg-white border border-emerald-100"
            >
              {/* Image with white divider like your screenshot */}
              <div className="relative h-40">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/90" />
              </div>

              <div className="p-5 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.desc}</p>

                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Spacer */}
        <div className="h-16" />

        {/* 3) Explore Categories (cloudy block) */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-emerald-100 shadow-sm">
          {/* soft clouds effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 to-white" />
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-100/60 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-teal-100/60 rounded-full blur-3xl" />

          <div className="relative px-6 sm:px-10 py-14">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-800">
                Explore Categories
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-xl mx-auto">
                Explore and support causes that make real impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {exploreCategories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div key={idx} className="text-center">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-emerald-700" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{cat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-16" />

        {/* 4) Success stories */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-800">
            Success stories
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-3xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=900&fit=crop&q=80"
              alt="Success story"
              className="w-full h-full object-cover"
            />
          </div>

          <Card className="border border-emerald-100 bg-white">
            <p className="text-gray-700 leading-relaxed">
              “Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Hendrerit vel dolor et scelerisque at turpis. In id purus
              posuere dui, et velit...”
            </p>

            <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-emerald-700 font-semibold">
                  Gathered $5,000 for (fundraiser name)
                </p>
                <p className="text-sm text-gray-500">— by Community Donors</p>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 rounded-full"
              >
                Read story
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
