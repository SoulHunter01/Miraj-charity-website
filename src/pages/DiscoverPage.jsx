import { useState } from "react";
import {
  Search,
  Filter,
  Heart,
  Users,
  Clock,
  TrendingUp,
  MapPin,
  Tag,
} from "lucide-react";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All Causes", count: 8432 },
    { id: "medical", label: "Medical", count: 2145 },
    { id: "emergency", label: "Emergency", count: 1876 },
    { id: "education", label: "Education", count: 1234 },
    { id: "community", label: "Community", count: 987 },
    { id: "animals", label: "Animals", count: 654 },
    { id: "nonprofit", label: "Nonprofit", count: 532 },
    { id: "business", label: "Business", count: 1004 },
  ];

  const fundraisers = [
    {
      title: "Emergency Medical Fund for Cancer Treatment",
      organizer: "Sarah Johnson",
      location: "New York, NY",
      raised: 45230,
      goal: 50000,
      supporters: 892,
      category: "Medical",
      daysLeft: 12,
      image:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop&q=80",
      trending: true,
    },
    {
      title: "Rebuild After Wildfire Disaster",
      organizer: "Community Foundation",
      location: "California, CA",
      raised: 128500,
      goal: 150000,
      supporters: 2145,
      category: "Emergency",
      daysLeft: 8,
      image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop&q=80",
      trending: true,
    },
    {
      title: "Scholarships for Underprivileged Students",
      organizer: "Education Alliance",
      location: "Chicago, IL",
      raised: 35800,
      goal: 40000,
      supporters: 567,
      category: "Education",
      daysLeft: 15,
      image:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop&q=80",
      trending: false,
    },
    {
      title: "Animal Shelter Expansion Project",
      organizer: "Pets Haven Charity",
      location: "Austin, TX",
      raised: 22100,
      goal: 30000,
      supporters: 423,
      category: "Animals",
      daysLeft: 20,
      image:
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop&q=80",
      trending: false,
    },
    {
      title: "Clean Water Initiative for Rural Communities",
      organizer: "Water for All",
      location: "Denver, CO",
      raised: 67800,
      goal: 80000,
      supporters: 1243,
      category: "Community",
      daysLeft: 18,
      image:
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&q=80",
      trending: true,
    },
    {
      title: "Small Business Recovery Fund",
      organizer: "Local Business Alliance",
      location: "Seattle, WA",
      raised: 89200,
      goal: 100000,
      supporters: 756,
      category: "Business",
      daysLeft: 10,
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop&q=80",
      trending: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Discover Fundraisers
            </h1>
            <p className="text-xl text-gray-600">
              Find and support causes that matter to you
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
              <input
                type="text"
                placeholder="Search fundraisers by keyword, location, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-4 rounded-xl border border-emerald-200 bg-white
                           focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none
                           text-gray-900 placeholder-emerald-400"
              />

              {/* Keep same UI, theme it */}
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border border-emerald-100">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Filter by Category
                  </h3>
                </div>

                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? "bg-emerald-100 text-emerald-900 font-semibold"
                          : "text-gray-700 hover:bg-emerald-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.label}</span>
                        <span className="text-sm text-gray-500">
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Fundraiser Grid */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeCategory === "all"
                    ? "All Fundraisers"
                    : `${
                        categories.find((c) => c.id === activeCategory)?.label
                      } Fundraisers`}
                </h2>

                <select
                  className="px-4 py-2 border border-emerald-200 rounded-lg text-sm bg-white
                             focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none"
                >
                  <option>Most Recent</option>
                  <option>Most Funded</option>
                  <option>Ending Soon</option>
                  <option>Most Supporters</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fundraisers.map((fundraiser, index) => {
                  const percentage = Math.round(
                    (fundraiser.raised / fundraiser.goal) * 100
                  );

                  return (
                    <Card
                      key={index}
                      padding={false}
                      className="overflow-hidden cursor-pointer group border border-emerald-100"
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={fundraiser.image}
                          alt={fundraiser.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                        {/* Category badge */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/95 backdrop-blur-sm text-emerald-800 text-xs font-semibold rounded-full">
                            <Tag className="w-3 h-3" />
                            {fundraiser.category}
                          </span>
                        </div>

                        {/* Trending badge */}
                        {fundraiser.trending && (
                          <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                              <TrendingUp className="w-3 h-3" />
                              Trending
                            </span>
                          </div>
                        )}

                        {/* Like button */}
                        <button className="absolute bottom-4 right-4 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                          {fundraiser.title}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                          <span className="font-semibold">
                            {fundraiser.organizer}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-700" />
                            {fundraiser.location}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-bold text-gray-900">
                              ${fundraiser.raised.toLocaleString()}
                            </span>
                            <span className="text-gray-600">{percentage}%</span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            of ${fundraiser.goal.toLocaleString()} goal
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="font-semibold">
                              {fundraiser.supporters}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{fundraiser.daysLeft} days left</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                >
                  Load More Fundraisers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
