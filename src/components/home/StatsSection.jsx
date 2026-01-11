import { TrendingUp, Heart, Globe, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export default function StatsSection() {
  const stats = [
    {
      number: "1000+",
      label: "Cases Fulfilled",
      icon: (
        <svg viewBox="0 0 120 80" className="w-24 h-16 mx-auto">
          <g fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <path d="M38 26h44v30H38z" />
            <path d="M38 32l10-6h24l10 6" />
            <path d="M12 44c10-8 18-10 26-8l10 6" />
            <path d="M108 44c-10-8-18-10-26-8l-10 6" />
            <path d="M22 52c10 6 18 7 26 4" />
            <path d="M98 52c-10 6-18 7-26 4" />
          </g>
          <g fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500">
            <path d="M52 22l10 8 16-16" />
          </g>
        </svg>
      ),
    },
    {
      number: "99,991,032",
      label: "Rupees Raised",
      icon: (
        <svg viewBox="0 0 120 80" className="w-24 h-16 mx-auto">
          <g fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <path d="M40 18h40" />
            <path d="M46 12h28v6H46z" />
            <path d="M44 18h32c4 0 6 3 6 7v34c0 6-4 9-9 9H47c-5 0-9-3-9-9V25c0-4 2-7 6-7z" />
          </g>
          <g fill="currentColor" className="text-emerald-500">
            <path d="M58 38c-3-4-10-2-10 4 0 6 10 10 10 10s10-4 10-10c0-6-7-8-10-4z" />
            <path d="M78 34c-2-3-7-2-7 3 0 4 7 7 7 7s7-3 7-7c0-5-5-6-7-3z" opacity="0.9" />
            <path d="M48 30c-2-3-7-2-7 3 0 4 7 7 7 7s7-3 7-7c0-5-5-6-7-3z" opacity="0.9" />
          </g>
        </svg>
      ),
    },
    {
      number: "10,000+",
      label: "Donors Onboard",
      icon: (
        <svg viewBox="0 0 120 80" className="w-24 h-16 mx-auto">
          <g fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <path d="M32 44c8-6 18-6 26 0" />
            <path d="M62 44c8-6 18-6 26 0" />
            <path d="M28 48c10 10 20 14 32 12" />
            <path d="M92 48c-10 10-20 14-32 12" />
            <path d="M40 34c2-8 10-14 20-14s18 6 20 14" />
          </g>
          <g fill="currentColor" className="text-emerald-500">
            <path d="M60 30c-3-4-10-2-10 4 0 6 10 10 10 10s10-4 10-10c0-6-7-8-10-4z" />
            <path d="M78 26c-2-3-7-2-7 3 0 4 7 7 7 7s7-3 7-7c0-5-5-6-7-3z" opacity="0.85" />
          </g>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Headings */}
        <div className="text-center mb-10">
          <Link to="/impact" className="inline-block">
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 hover:text-emerald-900 transition-colors">
              Our Impact So Far
            </h2>
          </Link>

          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Together, we are creating real change by supporting causes and communities across the country.
          </p>
        </div>

        {/* Stats Container */}
        <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 shadow-sm px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-slate-500">{stat.icon}</div>
                <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-orange-500">
                  {stat.number}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
