import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { apiJson } from "../../services/apiAuth";
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function absUrl(pathOrUrl) {
    if (!pathOrUrl) return "";
    if (pathOrUrl.startsWith("http")) return pathOrUrl;

    // if backend returns "fundraisers/xyz.png" without /media
    if (!pathOrUrl.startsWith("/")) pathOrUrl = `/${pathOrUrl}`;
    if (!pathOrUrl.startsWith("/media/")) pathOrUrl = `/media${pathOrUrl}`;

    return `${API_BASE}${pathOrUrl}`;
}

function Sidebar({ user, active, onNavigate, onLogout }) {
  const items = useMemo(
    () => ["Account Details", "Dashboard", "Balance", "Settings"],
    []
  );

  return (
    <aside className="w-[260px] min-w-[260px] rounded-xl bg-[#d9ecff] p-5 shadow-lg">
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="h-20 w-20 overflow-hidden rounded-full bg-white ring-2 ring-emerald-300">
          {user?.avatar ? (
            <img src={absUrl(user.avatar)} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-emerald-600">
              <User className="h-8 w-8" />
            </div>
          )}
        </div>
        <p className="text-sm font-semibold text-slate-800">{user?.username || "User"}</p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {items.map((label) => {
          const isActive = label === active;
          return (
            <button
              key={label}
              onClick={() => onNavigate(label)}
              className={[
                "w-full rounded-full px-4 py-2 text-left text-sm transition",
                isActive
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-white text-slate-700 hover:bg-emerald-50",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}

        <button
          onClick={onLogout}
          className="mt-2 w-full rounded-full bg-white px-4 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

function money(v) {
  const n = Number(v || 0);
  if (Number.isNaN(n)) return "$0";
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function MyDonationsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest"); // latest | most | least
  const [sortOpen, setSortOpen] = useState(false);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.set("q", keyword.trim());
      params.set("sort", sort);

      const res = await apiJson(`/api/auth/dashboard/my-donations/?${params.toString()}`, {
        auth: true,
      });

      setList(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  };

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => load(), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, sort]);

  return (
    <div className="min-h-screen bg-[#eaf6ff] flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex gap-6">
            <Sidebar
              user={user}
              active="Dashboard"
              onNavigate={(label) => {
                if (label === "Account Details") navigate("/profile");
                if (label === "Dashboard") navigate("/dashboard");
                if (label === "Balance") navigate("/balance");
                if (label === "Settings") navigate("/settings/account");
              }}
              onLogout={logout}
            />

            <main className="flex-1">
              <div className="rounded-2xl bg-white/70 p-8 shadow-lg">
                {/* Search */}
                <div className="flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-3">
                  <Search className="h-5 w-5 text-slate-500" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search a keyword"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Sort */}
                <div className="mt-3 flex justify-center">
                  <div className="relative">
                    <button
                      onClick={() => setSortOpen((p) => !p)}
                      className="rounded-full border border-emerald-200 bg-white px-6 py-2 text-sm text-slate-700 hover:bg-emerald-50"
                    >
                      Sort by
                    </button>

                    {sortOpen && (
                      <div className="absolute left-1/2 z-20 mt-2 w-64 -translate-x-1/2 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-lg">
                        {[
                          { key: "latest", label: "Latest donation" },
                          { key: "most", label: "Most amount donated" },
                          { key: "least", label: "Least amount donated" },
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => {
                              setSort(opt.key);
                              setSortOpen(false);
                            }}
                            className={[
                              "w-full px-4 py-2 text-left text-sm hover:bg-emerald-50",
                              sort === opt.key ? "font-semibold text-emerald-700" : "text-slate-700",
                            ].join(" ")}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="mt-6 space-y-4">
                  {loading ? (
                    <div className="rounded-xl bg-white px-5 py-4 shadow-sm">Loading…</div>
                  ) : list.length === 0 ? (
                    <div className="rounded-xl bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
                      No donations found.
                    </div>
                  ) : (
                    list.map((d) => (
                      <div
                        key={d.fundraiser_id}
                        className="flex items-stretch overflow-hidden rounded-2xl border border-emerald-300 bg-white shadow-sm"
                      >
                        {/* image */}
                        <div className="w-[170px] min-w-[170px] bg-slate-200">
                          {d.image ? (
                            <img
                              src={absUrl(d.image)}
                              alt={d.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full" />
                          )}
                        </div>

                        {/* middle */}
                        <div className="flex flex-1 flex-col px-5 py-4">
                          <p className="text-base font-semibold text-slate-900">{d.title}</p>
                          <p className="text-xs font-semibold text-emerald-600">ID #{d.fundraiser_id}</p>

                          <p className="mt-2 text-xs text-slate-600">
                            {money(d.total_donated)} donated{" "}
                            {d.frequency_label ? d.frequency_label : ""}
                          </p>

                          <p className="mt-2 text-xs text-slate-600">
                            Published by <span className="font-semibold">{d.published_by || "—"}</span>
                          </p>
                        </div>

                        {/* right */}
                        <div className="flex w-[220px] min-w-[220px] flex-col items-end px-5 py-4">
                          <p className="text-sm font-bold text-orange-500">
                            {money(d.left)} left
                          </p>

                          <button
                            className="mt-auto rounded-full bg-orange-500 px-6 py-2 text-xs font-semibold text-white hover:bg-orange-600"
                            onClick={() => {
                              // you can change this to your public fundraiser route later
                              alert("Donate again screen comes next.");
                            }}
                          >
                            Donate again
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
