import {
  CheckCircle,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Heart,
  Globe,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Start your fundraiser",
      description:
        "Tell your story and set your fundraising goal. Our guided setup takes just minutes.",
      details: [
        "Choose your fundraising category",
        "Set a realistic funding goal",
        "Write a compelling story",
        "Add photos or videos",
      ],
      image:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop&q=80",
    },
    {
      number: "02",
      title: "Share with your network",
      description:
        "Reach potential donors through multiple channels with our built-in sharing tools.",
      details: [
        "Share on social media platforms",
        "Send email invitations",
        "Create custom sharing messages",
        "Track engagement metrics",
      ],
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&q=80",
    },
    {
      number: "03",
      title: "Receive donations",
      description:
        "Accept secure donations from supporters around the world with multiple payment options.",
      details: [
        "Multiple payment methods",
        "Secure transaction processing",
        "Real-time notifications",
        "Donor management tools",
      ],
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&q=80",
    },
    {
      number: "04",
      title: "Withdraw your funds",
      description:
        "Access your funds quickly and easily with flexible withdrawal options.",
      details: [
        "Fast processing times",
        "No waiting periods",
        "Multiple withdrawal methods",
        "Transparent fee structure",
      ],
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop&q=80",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Bank-level security with SSL encryption protecting every transaction.",
    },
    {
      icon: Zap,
      title: "Fast Setup",
      description: "Launch your fundraiser in minutes with our intuitive platform.",
    },
    {
      icon: Users,
      title: "Global Reach",
      description: "Connect with donors from over 150 countries worldwide.",
    },
    {
      icon: Heart,
      title: "No Platform Fee",
      description: "Keep more of what you raise with our transparent pricing.",
    },
    {
      icon: TrendingUp,
      title: "Success Tools",
      description: "Access analytics and tips to maximize your fundraising.",
    },
    {
      icon: Globe,
      title: "24/7 Support",
      description: "Get help whenever you need it from our dedicated team.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              How FundRise Works
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Four simple steps to start making a difference. No experience needed—just a story to tell and a goal to reach.
            </p>
            <Button
              size="lg"
              variant="primary"
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
            >
              Start Your Fundraiser
            </Button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold mb-4">
                    STEP {step.number}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {step.description}
                  </p>

                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why choose FundRise?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a successful fundraising campaign
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center group hover:shadow-xl">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-xl mb-4 group-hover:bg-emerald-600 transition-colors">
                    <Icon className="w-8 h-8 text-emerald-700 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-emerald-50/90 mb-8">
            Join millions of people raising money for what matters most
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="primary"
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
            >
              Start Fundraising Free
            </Button>
            <button className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/50 rounded-lg font-semibold transition-all">
              View Success Stories
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
