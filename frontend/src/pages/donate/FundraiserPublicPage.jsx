import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Share2 } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { apiJson } from "../../services/apiAuth";

const FALLBACK_IMG = "https://via.placeholder.com/1200x700?text=Fundraiser";

function formatMoney(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
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

  const hhmmss = `${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;
  return days > 0 ? `${days}d ${hhmmss} remaining` : `${hhmmss} remaining`;
}

// ✅ best-effort auth check (works for most JWT localStorage setups)
function isAuthed() {
  const access =
    localStorage.getItem("access") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt_access");
  return Boolean(access);
}

export default function FundraiserPublicPage({ openAuthModal }) {
  const { fundraiserId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
        try {
        await apiJson("/api/auth/me/", { method: "GET", auth: true });
        setLoggedIn(true);
        } catch (e) {
        setLoggedIn(false);
        } finally {
        setAuthChecked(true);
        }
    })();
  }, []);

  // countdown tick
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiJson(`/api/auth/fundraisers/${fundraiserId}/public/`, {
          method: "GET",
          auth: false,
        });
        setData(res);
      } catch (e) {
        console.error(e);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [fundraiserId]);

  const msLeft = useMemo(() => {
    if (!data?.deadline_at) return NaN;
    const d = Date.parse(data.deadline_at);
    if (!Number.isFinite(d)) return NaN;
    return d - now;
  }, [data?.deadline_at, now]);

  const raised = Number(data?.raised || 0);
  const goal = Number(data?.target_amount || 0);
  const pct = goal > 0 ? Math.round((raised / goal) * 100) : 0;

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: data?.title || "Fundraiser", url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied ✅");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ✅ Donate button behavior (no form here)
  const onDonateStart = () => {
    const nextPath = `/donate/${fundraiserId}/checkout`;
  
    // wait until auth is verified (prevents false modal)
    if (!authChecked) return;
  
    if (loggedIn) {
      navigate(nextPath);
      return;
    }
  
    if (openAuthModal) {
      openAuthModal({
        title: "Sign up required",
        message: "Please create an account (or log in) to donate to this fundraiser.",
        confirmText: "Go to Sign Up",
        onConfirm: () => navigate(`/signup?next=${encodeURIComponent(nextPath)}`),
      });
      return;
    }
  
    navigate(`/signup?next=${encodeURIComponent(nextPath)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {loading ? (
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600">Loading...</div>
      ) : !data ? (
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600">
          Fundraiser not found.
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Title + timer */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-emerald-700">{data.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-orange-500 text-sm font-semibold">
              <Clock className="w-4 h-4" />
              {formatCountdown(msLeft)}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="lg:col-span-2">
              <Card className="border border-emerald-100">
                <div className="rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={data.image_url || FALLBACK_IMG}
                    alt={data.title}
                    className="w-full h-[340px] object-cover"
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  />
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {data.description || "No description provided yet."}
                  </p>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Supporting Documents</h2>

                  {Array.isArray(data.documents) && data.documents.length ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {data.documents.map((d) => (
                        <a
                          key={d.id}
                          href={d.url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition"
                          onClick={(e) => {
                            if (!d.url) e.preventDefault();
                          }}
                          title={d.name}
                        >
                          <div className="text-xs text-gray-700 font-semibold line-clamp-2">
                            {d.name || "Document"}
                          </div>
                          <div className="mt-2 text-[11px] text-gray-500">Open</div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No documents uploaded.</div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border border-emerald-100 bg-emerald-50/40">
                {/* progress */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-start justify-between text-sm">
                    <div>
                      <div className="text-gray-600 text-xs">Collected Amount:</div>
                      <div className="font-extrabold text-emerald-700">Rs {formatMoney(raised)}</div>

                      <div className="mt-2 text-xs text-gray-600">
                        Organizer: <span className="font-semibold">{data.organizer || "—"}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-600">
                        Ends on: <span className="font-semibold">{data.deadline || "—"}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-gray-600 text-xs">Target Amount:</div>
                      <div className="font-extrabold text-emerald-700">Rs {formatMoney(goal)}</div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-full" onClick={onDonateStart}>
                    Donate
                  </Button>

                  <button
                    type="button"
                    onClick={onShare}
                    className="flex-1 rounded-full border border-emerald-300 bg-white text-emerald-800 text-sm font-semibold hover:bg-emerald-50"
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      <Share2 className="w-4 h-4" />
                      Share now
                    </span>
                  </button>
                </div>

                {/* donors list (read-only here) */}
                <div className="mt-6">
                  <div className="text-xs font-bold text-gray-700 mb-3">
                    {data.supporters ?? 0} total donors
                  </div>

                  <div className="max-h-[520px] overflow-y-auto space-y-3 pr-1">
                    {(data.donors || []).map((d) => (
                      <div key={d.id} className="bg-white rounded-xl border border-emerald-100 p-3">
                        <div className="text-sm font-semibold text-gray-800">{d.donor_display}</div>
                        <div className="text-xs text-gray-500">
                          Donated Rs {formatMoney(d.amount)}
                        </div>
                      </div>
                    ))}

                    {!data.donors?.length ? (
                      <div className="text-sm text-gray-500">No donations yet.</div>
                    ) : null}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
