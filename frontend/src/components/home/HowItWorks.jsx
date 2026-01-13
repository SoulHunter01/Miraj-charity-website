import Card from "../common/Card";
import { PenSquare, Share2, DollarSign } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create your fundraiser",
      description:
        "Set your goal and tell your story in just a few minutes. Our intuitive platform guides you through every step.",
      icon: PenSquare,
      image:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop&q=80",
    },
    {
      number: "2",
      title: "Share with your network",
      description:
        "Spread the word through social media, email, and messaging. Reach supporters who care about your cause.",
      icon: Share2,
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&q=80",
    },
    {
      number: "3",
      title: "Receive funds securely",
      description:
        "Get donations quickly with secure payment processing. Withdraw anytime with no hidden fees.",
      icon: DollarSign,
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start fundraising in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} padding={false} className="group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                      <Icon className="w-5 h-5 text-emerald-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
