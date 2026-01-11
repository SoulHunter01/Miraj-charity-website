import { useEffect, useMemo, useState } from "react";
import { User, Mail, Phone, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiJson } from "../services/apiAuth";

import Footer from "../components/common/Footer";

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
        <button onClick={onClose} className="font-semibold opacity-70 hover:opacity-100">
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

function ProfileSidebar({ user, active = "Account Details", onNavigate, onLogout }) {
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
            <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/80">
              <User className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold">{user?.username || "Name"}</p>
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
  const { user, loading, refreshUser, logout } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    cnic: "",
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
  }, [user]);

  const avatarUrl = resolveAvatar(user?.avatar);

  const onSave = async () => {
    try {
      setSaving(true);

      // Only fields allowed by your ProfileSerializer:
      // fields = ["username","email","phone","cnic","avatar"]
      // but username/email are read-only. :contentReference[oaicite:4]{index=4}
      const payload = {
        phone: form.phone,
        cnic: form.cnic,
      };

      await apiJson("/api/auth/me/", { method: "PATCH", auth: true, body: payload });
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
        <div className="rounded-xl bg-white px-6 py-4 shadow">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaf6ff]">
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="flex gap-6">
          <ProfileSidebar
            user={user}
            active="Account Details"
            onNavigate={(label) =>
              setToast({ type: "error", message: `${label} is not wired yet.` })
            }
            onLogout={logout}
          />

          <main className="flex-1">
            <div className="relative overflow-hidden rounded-2xl bg-[#dff1ff] p-8 shadow-lg">
              {/* soft cloud blobs */}
              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -left-10 top-24 h-40 w-64 rounded-full bg-white" />
                <div className="absolute left-40 top-16 h-32 w-52 rounded-full bg-white" />
                <div className="absolute right-12 bottom-20 h-40 w-64 rounded-full bg-white" />
              </div>

              <div className="relative mx-auto max-w-[720px] rounded-2xl bg-[#dff1ff]/60 p-8">
                <div className="mx-auto mb-6 flex justify-center">
                  <div className="h-28 w-28 overflow-hidden rounded-full bg-white ring-4 ring-emerald-400/60">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-emerald-600">
                        <User className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* username/email are read-only in serializer */}
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
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  />

                  <Field
                    icon={CreditCard}
                    placeholder="CNIC"
                    value={form.cnic}
                    onChange={(e) => setForm((p) => ({ ...p, cnic: e.target.value }))}
                  />
                </div>

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
          </main>
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
