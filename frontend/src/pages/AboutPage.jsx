import { Users, Shield, TrendingUp, Globe, Lightbulb, Heart } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description:
        "We believe in the power of human kindness and the impact of collective giving.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Your security and trust are paramount. We maintain the highest standards of platform integrity.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Our platform thrives on the strength and generosity of our global community.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We continuously evolve to provide the best fundraising experience possible.",
    },
  ];

  const milestones = [
    { year: "2020", title: "Foundation", description: "FundRise was founded with a mission to democratize fundraising" },
    { year: "2021", title: "$100M Raised", description: "Reached our first major milestone in total funds raised" },
    { year: "2022", title: "Global Expansion", description: "Expanded to 150+ countries worldwide" },
    { year: "2023", title: "1M Fundraisers", description: "Celebrated our millionth successful fundraiser" },
    { year: "2024", title: "$1B+ Impact", description: "Surpassed $1 billion in total donations facilitated" },
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
      bio: "15+ years in tech and social impact",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
      bio: "Former Google engineer with a passion for giving",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Community",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80",
      bio: "Nonprofit veteran and community builder",
    },
    {
      name: "James Wilson",
      role: "Chief Financial Officer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80",
      bio: "Financial services expert dedicated to transparency",
    },
  ];

  const stats = [
    { icon: Users, number: "2M+", label: "Active fundraisers" },
    { icon: Globe, number: "150+", label: "Countries served" },
    { icon: Heart, number: "100M+", label: "Donations received" },
    { icon: TrendingUp, number: "$1B+", label: "Total funds raised" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              To empower people everywhere to raise money for the causes they care about,
              making fundraising accessible, transparent, and impactful for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-xl mb-4">
                    <Icon className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  FundRise began with a simple belief: that everyone deserves access to financial support
                  when they need it most. Founded in 2025, we set out to create a platform that would
                  break down barriers to fundraising and make it easy for anyone to rally support around
                  their cause.
                </p>
                <p>
                  What started as a small team with big dreams has grown into a global platform serving
                  millions. We've helped people raise funds for medical treatments, disaster relief,
                  education, creative projects, and countless other causes.
                </p>
                <p>
                  Today, we're proud to be the world's leading crowdfunding platform, but our mission
                  remains the same: to empower people to turn their compassion into action and make a
                  real difference in the lives of others.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-xl mb-4">
                    <Icon className="w-8 h-8 text-emerald-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600">
              Key milestones in our growth and impact
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-emerald-200"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                    }`}
                  >
                    <Card className="inline-block">
                      <div className="text-emerald-700 font-bold text-lg mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {milestone.description}
                      </p>
                    </Card>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-lg text-gray-600">
              Passionate leaders dedicated to making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} padding={false} className="overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-emerald-700 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-emerald-50/90 mb-8">
            Be part of a movement that's changing lives around the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="primary"
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
            >
              Start Fundraising
            </Button>
            <button className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/50 rounded-lg font-semibold transition-all">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
