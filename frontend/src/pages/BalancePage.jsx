import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import { apiJson } from "../services/apiAuth";
import { User } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const resolveAvatar = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  if (avatar.startsWith("/media/")) return `${API_BASE}${avatar}`;
  return avatar;
};

function ProfileSidebar({ user, active, onNavigate, onLogout }) {
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

function fmtAmount(v) {
  const n = Number(v || 0);
  if (Number.isNaN(n)) return "$0";
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export default function BalancePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState("0");
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiJson("/api/auth/balance/", { auth: true });
        setTotal(res?.total_balance ?? "0");
        setDonations(res?.donations ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#eaf6ff] flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex gap-6">
            <ProfileSidebar
              user={user}
              active="Balance"
              onNavigate={(label) => {
                if (label === "Account Details") navigate("/profile");
                if (label === "Settings") navigate("/settings/account");
                if (label === "Balance") navigate("/balance");
                if (label === "Dashboard") navigate("/dashboard"); // wire later
              }}
              onLogout={logout}
            />

            <main className="flex-1">
              <div className="relative overflow-hidden rounded-2xl bg-white/70 p-10 shadow-lg">
                {/* Total balance card */}
                <div className="mx-auto mb-6 w-full max-w-[240px] rounded-xl bg-emerald-50 px-6 py-4 text-center shadow-sm">
                  <p className="text-xs font-semibold text-slate-600">Total balance</p>
                  <p className="mt-1 text-3xl font-extrabold text-emerald-700">
                    {fmtAmount(total)}
                  </p>
                  <p className="text-[11px] text-slate-500">received</p>
                </div>

                <h2 className="text-center text-2xl font-extrabold text-emerald-700">
                  Donations received
                </h2>

                <div className="mt-6 space-y-3">
                  {loading ? (
                    <div className="rounded-xl bg-white px-5 py-4 shadow-sm">Loading…</div>
                  ) : donations.length === 0 ? (
                    <div className="rounded-xl bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
                      No donations yet.
                    </div>
                  ) : (
                    donations.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between rounded-xl bg-emerald-50/60 px-5 py-4 shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {d.donor_name || "Anonymous"}
                          </p>
                          <p className="text-xs text-slate-500">{fmtDate(d.created_at)}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-extrabold text-emerald-700">
                            {fmtAmount(d.amount)}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {(d.frequency_label || "").trim() || "one-time"}{" "}
                            {d.status || "received"}
                          </p>
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
