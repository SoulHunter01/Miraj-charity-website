import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Pencil, User } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { apiJson } from "../../services/apiAuth";
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function resolveAvatar(avatar) {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  if (avatar.startsWith("/media/")) return `${API_BASE}${avatar}`;
  return avatar;
}

function imgUrl(img) {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${API_BASE}${img}`;
}

function Sidebar({ user, active, onNavigate, onLogout }) {
  const avatarUrl = resolveAvatar(user?.avatar);
  const items = useMemo(
    () => ["Account Details", "Dashboard", "Balance", "Settings"],
    []
  );

  return (
    <aside className="w-[260px] min-w-[260px] rounded-xl bg-[#d9ecff] p-5 shadow-lg">
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="h-20 w-20 overflow-hidden rounded-full bg-white ring-2 ring-emerald-300">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-emerald-600">
              <User className="h-8 w-8" />
            </div>
          )}
        </div>

        <p className="text-sm font-semibold text-slate-800">
          {user?.username || "User"}
        </p>
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

function formatMoney(v) {
  const n = Number(v || 0);
  if (Number.isNaN(n)) return "$0";
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function MyFundraisersPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [status, setStatus] = useState("active"); // active | closed | draft
  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiJson(
        `/api/auth/dashboard/my-fundraisers/?status=${status}`,
        { auth: true }
      );
      setList(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filtered = list.filter((f) =>
    (f?.title || "").toLowerCase().includes(keyword.toLowerCase())
  );

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
                {/* Search bar */}
                <div className="flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-3">
                  <Search className="h-5 w-5 text-slate-500" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search a keyword"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Tabs + sort */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-3">
                    {[
                      { key: "active", label: "Active" },
                      { key: "closed", label: "Closed" },
                      { key: "draft", label: "Drafts" },
                    ].map((t) => {
                      const isActive = status === t.key;
                      return (
                        <button
                          key={t.key}
                          onClick={() => setStatus(t.key)}
                          className={[
                            "rounded-full px-8 py-2 text-sm font-semibold transition",
                            isActive
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                          ].join(" ")}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>

                  <button className="rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm text-slate-700 hover:bg-emerald-50">
                    Sort by
                  </button>
                </div>

                {/* List */}
                <div className="mt-6 space-y-4">
                  {loading ? (
                    <div className="rounded-xl bg-white px-5 py-4 shadow-sm">
                      Loading…
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="rounded-xl bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
                      No fundraisers found.
                    </div>
                  ) : (
                    filtered.map((f) => {
                      const collected = f?.collected_amount ?? 0;
                      const target = f?.target_amount ?? 0;

                      return (
                        <div
                          key={f.id}
                          className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-white p-4 shadow-sm"
                        >
                          {/* image */}
                          <div className="h-20 w-28 overflow-hidden rounded-lg bg-slate-200">
                            {f.image ? (
                              <img
                                src={imgUrl(f.image)}
                                alt={f.title}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>

                          {/* title + meta */}
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800">
                              {f.title}
                            </p>
                            <p className="mt-1 text-xs text-emerald-700">
                              ID #{f.id}
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                              Deadline: {formatDate(f.deadline)}
                            </p>
                          </div>

                          {/* right info */}
                          <div className="text-right">
                            <p className="text-xs text-slate-500">
                              <span className="font-semibold text-emerald-700">
                                {formatMoney(collected)}
                              </span>{" "}
                              of {formatMoney(target)} collected
                            </p>

                            <div className="mt-2 flex justify-end gap-1">
                              <span className="h-3 w-3 rounded-full bg-emerald-600" />
                              <span className="h-3 w-3 rounded-full bg-emerald-400" />
                              <span className="h-3 w-3 rounded-full bg-emerald-200" />
                            </div>

                            <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline">
                              <Pencil className="h-4 w-4" /> Edit
                            </button>
                          </div>
                        </div>
                      );
                    })
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
