// src/pages/ProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import { User, Mail, Phone, CreditCard } from "lucide-react";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import { useAuth } from "../context/AuthContext";
import { apiJson } from "../services/apiAuth";
import { useNavigate } from "react-router-dom";

// ✅ payout logos (put these images in src/assets/payout/)
import bankLogo from "../assets/payouts/Bank-Logo.png";
import nayapayLogo from "../assets/payouts/NayaPay-Logo.png";
import sadapayLogo from "../assets/payouts/SadaPay-Logo.png";
import jazzcashLogo from "../assets/payouts/jazzcash-Logo.png";
import easypaisaLogo from "../assets/payouts/Easypaisa-Logo.png";
import raastLogo from "../assets/payouts/Raast-Logo.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function resolveAvatar(avatar) {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  if (avatar.startsWith("/media/")) return `${API_BASE}${avatar}`;
  return avatar;
}

function Toast({ message, type = "error", onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={[
          "rounded-xl px-4 py-3 shadow-lg border text-sm flex items-start gap-3",
          type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-orange-50 border-orange-200 text-orange-800",
        ].join(" ")}
      >
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="font-semibold opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function Field({ icon: Icon, placeholder, value, onChange, disabled = false }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-emerald-300 bg-white px-4 py-3 shadow-sm">
      <Icon className="h-5 w-5 text-emerald-600" />
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400"
      />
    </div>
  );
}

function MiniField({ placeholder, value, onChange }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
    />
  );
}

function ProfileSidebar({ user, active, onNavigate, onLogout }) {
  const avatarUrl = resolveAvatar(user?.avatar);

  const items = useMemo(
    () => ["Account Details", "Dashboard", "Balance", "Settings"],
    []
  );

  return (
    <aside className="w-[260px] min-w-[260px] rounded-xl bg-emerald-600 p-5 text-white shadow-lg">
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="h-20 w-20 overflow-hidden rounded-full bg-white/20 ring-2 ring-white/70">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/80">
              <User className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold">{user?.username || "Name"}</p>
          <p className="text-xs text-white/80">{user?.email || ""}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {items.map((label) => {
          const isActive = label === active;
          return (
            <button
              key={label}
              onClick={() => onNavigate?.(label)}
              className={[
                "w-full rounded-full px-4 py-2 text-left text-sm transition",
                isActive
                  ? "bg-white text-emerald-700 shadow"
                  : "bg-white/10 text-white hover:bg-white/15",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}

        <button
          onClick={onLogout}
          className="mt-2 w-full rounded-full bg-white/10 px-4 py-2 text-left text-sm text-white hover:bg-white/15"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading, refreshUser, logout } = useAuth();

  const [activeMenu, setActiveMenu] = useState("Account Details");

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    cnic: "",
  });

  const payoutOptions = useMemo(
    () => [
      { key: "bank", label: "Bank Account", logo: bankLogo },
      { key: "nayapay", label: "NayaPay", logo: nayapayLogo },
      { key: "sadapay", label: "SadaPay", logo: sadapayLogo },
      { key: "jazzcash", label: "JazzCash", logo: jazzcashLogo },
      { key: "easypaisa", label: "EasyPaisa", logo: easypaisaLogo },
      { key: "raast", label: "Raast", logo: raastLogo },
    ],
    []
  );

  const [payoutMethod, setPayoutMethod] = useState("bank");

  const [payout, setPayout] = useState({
    // bank fields
    account_title: "",
    account_number: "",
    iban: "",
    raast_id: "",
    // all other methods
    phone_number: "",
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "error", message: "" });

  useEffect(() => {
    setForm({
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      cnic: user?.cnic || "",
    });

    // ✅ load payout preference from backend (nested in /api/auth/me/)
    const pref = user?.payout_preference;
    if (pref) {
      setPayoutMethod(pref.method || "bank");
      setPayout({
        account_title: pref.account_title || "",
        account_number: pref.account_number || "",
        iban: pref.iban || "",
        raast_id: pref.raast_id || "",
        phone_number: pref.phone_number || "",
      });
    }
  }, [user]);

  const avatarUrl = resolveAvatar(user?.avatar);

  const onSave = async () => {
    try {
      setSaving(true);

      const payload = {
        phone: form.phone,
        cnic: form.cnic,
        payout_preference: {
          method: payoutMethod,
          account_title: payout.account_title,
          account_number: payout.account_number,
          iban: payout.iban,
          raast_id: payout.raast_id,
          phone_number: payout.phone_number,
        },
      };

      await apiJson("/api/auth/me/", {
        method: "PATCH",
        auth: true,
        body: payload,
      });

      await refreshUser?.();
      setToast({ type: "success", message: "Profile saved successfully." });
    } catch (e) {
      setToast({ type: "error", message: e?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaf6ff] flex items-center justify-center">
        <div className="rounded-xl bg-white px-6 py-4 shadow">
          Loading profile…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaf6ff] flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex gap-6">
            <ProfileSidebar
              user={user}
              active={activeMenu}
              onNavigate={(label) => {
                // ✅ Settings must open Settings pages
                if (label === "Settings") {
                  navigate("/settings/account");
                  return;
                }
                if (label === "Balance") {
                  navigate("/balance");
                  return;
                }
                if (label === "Dashboard") {
                  navigate("/dashboard");
                  return;
                }
                setActiveMenu(label);
              }}
              onLogout={logout}
            />

            <main className="flex-1">
              {activeMenu === "Account Details" ? (
                <div className="relative overflow-hidden rounded-2xl bg-[#dff1ff] p-8 shadow-lg">
                  {/* soft cloud blobs */}
                  <div className="pointer-events-none absolute inset-0 opacity-30">
                    <div className="absolute -left-10 top-24 h-40 w-64 rounded-full bg-white" />
                    <div className="absolute left-40 top-16 h-32 w-52 rounded-full bg-white" />
                    <div className="absolute right-12 bottom-20 h-40 w-64 rounded-full bg-white" />
                  </div>

                  <div className="relative mx-auto max-w-[760px] rounded-2xl bg-[#dff1ff]/60 p-8">
                    {/* Avatar */}
                    <div className="mx-auto mb-6 flex justify-center">
                      <div className="h-28 w-28 overflow-hidden rounded-full bg-white ring-4 ring-emerald-400/60">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="avatar"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-emerald-600">
                            <User className="h-10 w-10" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile fields */}
                    <div className="space-y-3">
                      {/* username/email are read-only on backend */}
                      <Field
                        icon={User}
                        placeholder="Username"
                        value={form.username}
                        disabled
                        onChange={() => {}}
                      />
                      <Field
                        icon={Mail}
                        placeholder="Email"
                        value={form.email}
                        disabled
                        onChange={() => {}}
                      />
                      <Field
                        icon={Phone}
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                      />
                      <Field
                        icon={CreditCard}
                        placeholder="CNIC"
                        value={form.cnic}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, cnic: e.target.value }))
                        }
                      />
                    </div>

                    {/* Donation receiving section */}
                    <div className="mt-10">
                      <p className="mb-4 text-center text-sm font-semibold text-slate-700">
                        How you want to receive your donations
                      </p>

                      <div className="flex flex-wrap justify-center gap-3">
                        {payoutOptions.map((opt) => {
                          const active = payoutMethod === opt.key;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => setPayoutMethod(opt.key)}
                              className={[
                                "flex items-center gap-2 rounded-xl border px-4 py-3 transition",
                                active
                                  ? "border-emerald-600 bg-emerald-600 text-white shadow"
                                  : "border-emerald-300 bg-white text-slate-700 hover:bg-emerald-50",
                              ].join(" ")}
                            >
                              <img
                                src={opt.logo}
                                alt={opt.label}
                                className="h-5 w-auto object-contain"
                              />
                              <span className="text-xs font-semibold">
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 rounded-2xl bg-[#dff1ff]/40 p-5">
                        {payoutMethod === "bank" ? (
                          <div className="space-y-3">
                            <MiniField
                              placeholder="Account Title"
                              value={payout.account_title}
                              onChange={(e) =>
                                setPayout((p) => ({
                                  ...p,
                                  account_title: e.target.value,
                                }))
                              }
                            />
                            <MiniField
                              placeholder="Account Number"
                              value={payout.account_number}
                              onChange={(e) =>
                                setPayout((p) => ({
                                  ...p,
                                  account_number: e.target.value,
                                }))
                              }
                            />
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              <MiniField
                                placeholder="IBAN (Optional)"
                                value={payout.iban}
                                onChange={(e) =>
                                  setPayout((p) => ({
                                    ...p,
                                    iban: e.target.value,
                                  }))
                                }
                              />
                              <MiniField
                                placeholder="RAAST ID (Optional)"
                                value={payout.raast_id}
                                onChange={(e) =>
                                  setPayout((p) => ({
                                    ...p,
                                    raast_id: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <MiniField
                            placeholder="Phone Number"
                            value={payout.phone_number}
                            onChange={(e) =>
                              setPayout((p) => ({
                                ...p,
                                phone_number: e.target.value,
                              }))
                            }
                          />
                        )}
                      </div>
                    </div>

                    {/* Save */}
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={onSave}
                        disabled={saving}
                        className="rounded-full border border-emerald-400 bg-white px-10 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-8 shadow">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">{activeMenu}</span> screen
                    not wired yet.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "error", message: "" })}
      />
    </div>
  );
}