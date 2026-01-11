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

function Sidebar({ user, active, onClick, onLogout }) {
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
              onClick={() => onClick(label)}
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

function StatPill({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white/70 px-6 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-extrabold text-slate-800">{value}</p>
    </div>
  );
}

function SummaryCard({ title, titleColor = "text-emerald-700", bgClass, totalLabel, totalValue, active, closed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full max-w-[360px] rounded-2xl p-8 text-left shadow-lg transition hover:shadow-xl",
        bgClass,
      ].join(" ")}
    >
      <p className={`text-xl font-extrabold ${titleColor}`}>{title}</p>

      <div className="mt-3">
        <p className="text-2xl font-extrabold text-orange-600">{fmtAmount(totalValue)}</p>
        <p className="text-xs text-slate-500">{totalLabel}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatPill label="Active" value={active} />
        <StatPill label="Closed" value={closed} />
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    my_fundraisers: { total_received: "0", active: 0, closed: 0 },
    my_donations: { total_donated: "0", active: 0, closed: 0 },
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiJson("/api/auth/dashboard/", { auth: true });
        setData(res);
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
            <Sidebar
              user={user}
              active="Dashboard"
              onClick={(label) => {
                if (label === "Account Details") navigate("/profile");
                if (label === "Dashboard") navigate("/dashboard");
                if (label === "Balance") navigate("/balance");
                if (label === "Settings") navigate("/settings/account");
              }}
              onLogout={logout}
            />

            <main className="flex-1">
              <div className="relative overflow-hidden rounded-2xl bg-white/70 p-10 shadow-lg min-h-[520px]">
                <div className="mx-auto grid max-w-[820px] grid-cols-1 gap-6 md:grid-cols-2">
                  <SummaryCard
                    title="My Fundraisers"
                    titleColor="text-emerald-700"
                    bgClass="bg-emerald-50/70"
                    totalLabel="Total Received"
                    totalValue={loading ? "0" : data.my_fundraisers.total_received}
                    active={loading ? "—" : data.my_fundraisers.active}
                    closed={loading ? "—" : data.my_fundraisers.closed}
                    onClick={() => navigate("/dashboard/my-fundraisers")}
                  />

                  <SummaryCard
                    title="My Donations"
                    titleColor="text-sky-700"
                    bgClass="bg-sky-50/70"
                    totalLabel="Total Received"
                    totalValue={loading ? "0" : data.my_donations.total_donated}
                    active={loading ? "—" : data.my_donations.active}
                    closed={loading ? "—" : data.my_donations.closed}
                    onClick={() => {
                      // later: navigate("/my-donations")
                    }}
                  />
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
