import Card from "../common/Card";
import {
  Heart, AlertCircle, GraduationCap, Building2,
  Users, PawPrint, Briefcase, Home, ArrowRight,
} from "lucide-react";

export default function CategoryCards() {
  const categories = [
    { name: "Medical", icon: Heart, description: "Help cover medical bills and treatment costs",
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop&q=80",
      color: "from-emerald-400 to-teal-400",
    },
    { name: "Emergency", icon: AlertCircle, description: "Support urgent crisis and disaster relief",
      image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=400&h=300&fit=crop&q=80",
      color: "from-green-400 to-emerald-400",
    },
    { name: "Education", icon: GraduationCap, description: "Fund tuition and learning programs",
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop&q=80",
      color: "from-teal-400 to-cyan-400",
    },
    { name: "Nonprofit", icon: Building2, description: "Support charitable organizations",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop&q=80",
      color: "from-emerald-400 to-green-400",
    },
    { name: "Community", icon: Users, description: "Build stronger neighborhoods",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop&q=80",
      color: "from-teal-400 to-emerald-400",
    },
    { name: "Animals", icon: PawPrint, description: "Rescue and care for pets",
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop&q=80",
      color: "from-emerald-400 to-teal-500",
    },
    { name: "Business", icon: Briefcase, description: "Launch and grow ventures",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop&q=80",
      color: "from-green-400 to-teal-400",
    },
    { name: "Memorial", icon: Home, description: "Honor loved ones",
      image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&h=300&fit=crop&q=80",
      color: "from-emerald-400 to-slate-400",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Fundraise for what matters
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your cause and start making a difference today
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.name} padding={false} className="group cursor-pointer overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  <div className={`absolute top-4 right-4 w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  <button className="text-emerald-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
