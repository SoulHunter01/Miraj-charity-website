import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, User } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { apiJson } from "../../services/apiAuth";
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function imgUrl(img) {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${API_BASE}${img}`;
}

function fmtMoney(v) {
  const n = Number(v || 0);
  if (Number.isNaN(n)) return "$0";
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function Sidebar({ user, active, onNavigate, onLogout }) {
  return (
    <aside className="w-[260px] min-w-[260px] rounded-xl bg-[#d9ecff] p-5 shadow-lg">
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="h-20 w-20 overflow-hidden rounded-full bg-white ring-2 ring-emerald-300">
          {user?.avatar ? (
            <img
              src={imgUrl(user.avatar)}
              alt="avatar"
              className="h-full w-full object-cover"
            />
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
        {[
          { label: "Account", key: "account" },
          { label: "My donations", key: "my_donations" },
          { label: "My fundraisers", key: "my_fundraisers" },
          { label: "Settings", key: "settings" },
        ].map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={[
                "w-full rounded-full px-4 py-2 text-left text-sm transition",
                isActive
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-white text-slate-700 hover:bg-emerald-50",
              ].join(" ")}
            >
              {item.label}
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

export default function FundraiserDetailPage() {
  const { fundraiserId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [fundraiser, setFundraiser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const fr = await apiJson(`/api/auth/fundraisers/${fundraiserId}/`, { auth: true });
      const dn = await apiJson(`/api/auth/fundraisers/${fundraiserId}/donations/`, { auth: true });

      setFundraiser(fr);
      setDonations(Array.isArray(dn) ? dn : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundraiserId]);

  const onCloseFundraiser = async () => {
    try {
      setClosing(true);
      await apiJson(`/api/auth/fundraisers/${fundraiserId}/close/`, {
        method: "POST",
        auth: true,
      });
      await load();
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eaf6ff] flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex gap-6">
            <Sidebar
              user={user}
              active="my_fundraisers"
              onNavigate={(key) => {
                if (key === "account") navigate("/profile");
                if (key === "my_fundraisers") navigate("/dashboard/my-fundraisers");
                if (key === "my_donations") navigate("/dashboard/my-donations"); // later
                if (key === "settings") navigate("/settings/account");
              }}
              onLogout={logout}
            />

            <main className="flex-1">
              <div className="rounded-2xl bg-white/70 p-8 shadow-lg">
                {/* ✅ BACK BUTTON */}
                <button
                  onClick={() => navigate("/dashboard/my-fundraisers")}
                  className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to My Fundraisers
                </button>

                {loading || !fundraiser ? (
                  <div className="rounded-xl bg-white px-5 py-4 shadow-sm">Loading…</div>
                ) : (
                  <>
                    {/* Header section */}
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="h-28 w-36 overflow-hidden rounded-xl bg-slate-200">
                          {fundraiser.image ? (
                            <img
                              src={imgUrl(fundraiser.image)}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>

                        <div>
                          <p className="text-lg font-bold text-emerald-700">
                            {fundraiser.title}
                          </p>
                          <p className="text-xs text-emerald-600">
                            ID #{fundraiser.id}
                          </p>

                          <p className="mt-2 text-xs text-slate-600">
                            <span className="font-semibold">Published:</span>{" "}
                            {fmtDate(fundraiser.created_at)}
                          </p>
                          <p className="text-xs text-slate-600">
                            <span className="font-semibold">Deadline:</span>{" "}
                            {fundraiser.deadline ? fmtDate(fundraiser.deadline) : "—"}
                          </p>

                          <p className="mt-2 text-xs font-semibold text-orange-600">
                            {fmtMoney(fundraiser.collected_amount)} of{" "}
                            {fmtMoney(fundraiser.target_amount)} collected
                          </p>
                        </div>
                      </div>

                      {/* actions */}
                      <div className="flex flex-col items-end gap-3">
                        <button
                          onClick={onCloseFundraiser}
                          disabled={closing || fundraiser.status === "closed"}
                          className="rounded-full bg-sky-400 px-5 py-2 text-xs font-semibold text-white hover:bg-sky-500 disabled:opacity-60"
                        >
                          {fundraiser.status === "closed"
                            ? "Closed"
                            : closing
                            ? "Closing..."
                            : "Close Fundraiser"}
                        </button>

                        <button className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:underline"
                                onClick={() => navigate(`/dashboard/my-fundraisers/${fundraiserId}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Donations received */}
                    <h2 className="mt-8 text-center text-xl font-extrabold text-emerald-700">
                      Donations received
                    </h2>

                    <div className="mt-5 space-y-3">
                      {donations.length === 0 ? (
                        <div className="rounded-xl bg-emerald-50/60 px-5 py-4 text-sm text-slate-600">
                          No donations received yet.
                        </div>
                      ) : (
                        donations.map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center justify-between rounded-xl bg-emerald-50/60 px-5 py-4"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {d.donor_name || "Anonymous"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {fmtDate(d.created_at)}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-extrabold text-emerald-700">
                                {fmtMoney(d.amount)}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {(d.frequency_label || "one-time")} •{" "}
                                {d.status || "received"}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}