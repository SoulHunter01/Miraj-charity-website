import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Clock, ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { apiJson } from "../services/apiAuth";

const PAGE_SIZE = 6;

const SORT_OPTIONS = [
  { value: "newest", label: "Most Recent" },
  { value: "most_funded", label: "Most Funded" },
  { value: "ending_soon", label: "Ending Soon" },
  { value: "most_supporters", label: "Most Supporters" },
  { value: "needs_attention", label: "Needs Attention" },
];

const FALLBACK_IMG = "https://via.placeholder.com/1200x700?text=Fundraiser";

function formatMoney(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
}

function clampText(text, max = 90) {
  const t = (text || "").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max).trim() + "..." : t;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatCountdown(msLeft) {
  if (!Number.isFinite(msLeft)) return "";
  if (msLeft <= 0) return "Ended";

  const totalSeconds = Math.floor(msLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hhmmss = `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)} left`;
  return days > 0 ? `${days}d ${hhmmss}` : hhmmss;
}

function useCountdown(deadlineAtIso) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!deadlineAtIso) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [deadlineAtIso]);

  const msLeft = useMemo(() => {
    if (!deadlineAtIso) return NaN;
    const deadlineMs = Date.parse(deadlineAtIso);
    if (!Number.isFinite(deadlineMs)) return NaN;
    return deadlineMs - now;
  }, [deadlineAtIso, now]);

  return {
    msLeft,
    text: formatCountdown(msLeft),
  };
}

function FundraiserCard({ f, onClick, onDonate }) {
  const raised = Number(f.raised || 0);
  const goal = Number(f.target_amount || 0);
  const percentage = goal > 0 ? Math.round((raised / goal) * 100) : 0;

  const supporters = f.supporters ?? 0;
  const countdown = useCountdown(f.deadline_at);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
    >
      {/* Image */}
      <div className="h-44 w-full bg-gray-100 overflow-hidden">
        <img
          src={f.image || FALLBACK_IMG}
          alt={f.title}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full bg-gray-200">
        <div
          className="h-full bg-orange-400"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Raised / Goal */}
      <div className="flex items-center justify-between px-5 pt-3 text-[13px]">
        <span className="text-orange-500 font-semibold">
          Raised: {formatMoney(raised)}
        </span>
        <span className="text-gray-700 font-semibold">
          Goal: {formatMoney(goal)}
        </span>
      </div>

      {/* Title + Description */}
      <div className="px-5 pt-3">
        <h3 className="text-[20px] font-extrabold text-gray-900 leading-snug text-center">
          {f.title}
        </h3>
        <p className="mt-2 text-[13px] text-gray-600 leading-relaxed text-center">
          {clampText(f.description || "", 120)}
        </p>
      </div>

      {/* Bottom row */}
      <div className="mt-4 px-5 pb-5 flex items-center justify-between">
        {/* supporters / donees */}
        <div className="flex items-center gap-2 text-orange-500">
          <div className="flex -space-x-2">
            <span className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white" />
            <span className="w-7 h-7 rounded-full bg-gray-500 border-2 border-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold">{supporters}</div>
            <div className="text-xs font-semibold -mt-0.5">donees</div>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full bg-sky-500 px-8 py-2 text-white text-sm font-semibold hover:bg-sky-600 active:scale-[0.99]"
          onClick={(e) => {
            e.stopPropagation();
            onDonate?.(f);
          }}
        >
          Donate
        </button>

        {/* time left */}
        <div className="flex items-center gap-2 text-orange-500">
          <div className="w-9 h-9 rounded-full border-2 border-orange-400 flex items-center justify-center">
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-xs font-semibold">
            {countdown.text || (f.daysLeft != null ? `${f.daysLeft}d left` : "")}
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalSection({ title, items, onPrev, onNext, onDonate, onOpen }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="w-8 h-8 rounded-lg border border-emerald-200 flex items-center justify-center hover:bg-emerald-50"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-700" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="w-8 h-8 rounded-lg border border-emerald-200 flex items-center justify-center hover:bg-emerald-50"
          >
            <ChevronRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          id={title}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
        >
          {items.map((f) => (
            <div key={f.id} className="min-w-[340px] max-w-[340px] snap-start">
              <FundraiserCard
                f={f}
                onDonate={onDonate}
                onClick={() => onOpen?.(f)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [categories, setCategories] = useState([
    { id: "all", label: "All Causes", count: 0 },
  ]);

  // main list
  const [fundraisers, setFundraisers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  // top sections
  const [urgent, setUrgent] = useState([]);
  const [attention, setAttention] = useState([]);

  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const selectedCategoryLabel = useMemo(() => {
    const found = categories.find((c) => c.id === activeCategory);
    return found?.label || "All Causes";
  }, [activeCategory, categories]);

  const hasMore = fundraisers.length < total;

  useEffect(() => {
    (async () => {
      try {
        const data = await apiJson("/api/auth/fundraisers/categories/", {
          method: "GET",
          auth: false,
        });
        setCategories(
          Array.isArray(data) && data.length
            ? data
            : [{ id: "all", label: "All Causes", count: 0 }]
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const buildDiscoverUrl = ({ categoryLabel, q, sort, off, lim }) => {
    const cat = categoryLabel || "all";
    return (
      `/api/auth/fundraisers/discover/?` +
      `category=${encodeURIComponent(cat)}` +
      `&q=${encodeURIComponent(q || "")}` +
      `&sort=${encodeURIComponent(sort || "newest")}` +
      `&offset=${off ?? 0}` +
      `&limit=${lim ?? PAGE_SIZE}`
    );
  };

  const fetchMain = async ({ reset }) => {
    const catLabel = activeCategory === "all" ? "all" : selectedCategoryLabel;
    const off = reset ? 0 : offset;

    const url = buildDiscoverUrl({
      categoryLabel: catLabel,
      q: searchQuery,
      sort: sortBy,
      off,
      lim: PAGE_SIZE,
    });

    try {
      reset ? setLoadingMain(true) : setLoadingMore(true);

      const data = await apiJson(url, { method: "GET", auth: false });

      const results = data?.results || [];
      setTotal(data?.total || 0);

      if (reset) {
        setFundraisers(results);
        setOffset(PAGE_SIZE);
      } else {
        setFundraisers((prev) => [...prev, ...results]);
        setOffset((prev) => prev + PAGE_SIZE);
      }
    } catch (e) {
      console.error("Discover fetch failed:", e);
      if (reset) {
        setFundraisers([]);
        setTotal(0);
        setOffset(0);
      }
    } finally {
      reset ? setLoadingMain(false) : setLoadingMore(false);
    }
  };

  const fetchTopSections = async () => {
    const catLabel = activeCategory === "all" ? "all" : selectedCategoryLabel;

    try {
      const [urgentRes, attentionRes] = await Promise.all([
        apiJson(
          buildDiscoverUrl({
            categoryLabel: catLabel,
            q: searchQuery,
            sort: "ending_soon",
            off: 0,
            lim: 6,
          }),
          { method: "GET", auth: false }
        ),
        apiJson(
          buildDiscoverUrl({
            categoryLabel: catLabel,
            q: searchQuery,
            sort: "needs_attention",
            off: 0,
            lim: 6,
          }),
          { method: "GET", auth: false }
        ),
      ]);

      setUrgent(urgentRes?.results || []);
      setAttention(attentionRes?.results || []);
    } catch (e) {
      console.error(e);
      setUrgent([]);
      setAttention([]);
    }
  };

  useEffect(() => {
    fetchMain({ reset: true });
    fetchTopSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const onSearch = () => {
    setOffset(0);
    fetchMain({ reset: true });
    fetchTopSections();
  };

  const onChangeSort = (v) => {
    setSortBy(v);
    setOffset(0);
    setTimeout(() => fetchMain({ reset: true }), 0);
  };

  const scrollById = (id, delta) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const openFundraiser = (f) => {
    navigate(`/donate/${f.id}`);
  };

  const donateFundraiser = (f) => {
    navigate(`/donate/${f.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Top area */}
      <section className="bg-[#e9efee] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-emerald-100 p-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSearch();
                  }
                }}
                placeholder="Search with keyword"
                className="w-full h-12 pl-12 pr-4 rounded-full border border-emerald-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-emerald-200 text-sm"
              />
            </div>

            <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onSearch}
                  className="rounded-full border border-emerald-500 px-6 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                >
                  Search
                </button>
                <button
                  type="button"
                  className="rounded-full border border-emerald-200 px-6 py-2 text-sm text-gray-700 hover:bg-emerald-50"
                  onClick={() => {
                    document
                      .getElementById("discover-categories")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Categories
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => onChangeSort(e.target.value)}
                  className="px-4 py-2 border border-emerald-200 rounded-full text-sm bg-white
                             focus:ring-2 focus:ring-emerald-200 focus:border-transparent outline-none"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar categories */}
            <div className="lg:col-span-1" id="discover-categories">
              <Card className="sticky top-24 border border-emerald-100">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                </div>

                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setOffset(0);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? "bg-emerald-100 text-emerald-900 font-semibold"
                          : "text-gray-700 hover:bg-emerald-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.label}</span>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right side */}
            <div className="lg:col-span-3">
              <HorizontalSection
                title="Urgent funds needed"
                items={urgent}
                onPrev={() => scrollById("Urgent funds needed", -360)}
                onNext={() => scrollById("Urgent funds needed", 360)}
                onDonate={donateFundraiser}
                onOpen={openFundraiser}
              />

              <HorizontalSection
                title="Fundraisers in need of more attention"
                items={attention}
                onPrev={() => scrollById("Fundraisers in need of more attention", -360)}
                onNext={() => scrollById("Fundraisers in need of more attention", 360)}
                onDonate={donateFundraiser}
                onOpen={openFundraiser}
              />

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-800">
                  {activeCategory === "all" ? "All fundraisers" : selectedCategoryLabel}
                  {searchQuery.trim() ? (
                    <span className="text-gray-500 font-normal">
                      {" "}
                      — results for “{searchQuery.trim()}”
                    </span>
                  ) : null}
                </h2>
              </div>

              {loadingMain ? (
                <div className="text-sm text-gray-600">Loading...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fundraisers.map((f) => (
                      <FundraiserCard
                        key={f.id}
                        f={f}
                        onDonate={donateFundraiser}
                        onClick={() => openFundraiser(f)}
                      />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="text-center mt-10">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                        disabled={loadingMore}
                        onClick={() => fetchMain({ reset: false })}
                      >
                        {loadingMore ? "Loading..." : "Load More"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
