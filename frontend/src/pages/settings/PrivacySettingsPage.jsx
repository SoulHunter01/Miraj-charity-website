import { useEffect, useState } from "react";
import SettingsLayout from "./SettingsLayout";
import { apiJson } from "../../services/apiAuth";
import { useAuth } from "../../context/AuthContext";

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "relative h-5 w-10 rounded-full transition",
        checked ? "bg-emerald-600" : "bg-slate-300",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-[2px] h-4 w-4 rounded-full bg-white shadow transition",
          checked ? "left-[22px]" : "left-[2px]",
        ].join(" ")}
      />
    </button>
  );
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

export default function PrivacySettingsPage() {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  // confirm contact number UI state
  const [editingPhone, setEditingPhone] = useState(false);
  const [contactNumber, setContactNumber] = useState("");

  const [toast, setToast] = useState({ type: "error", message: "" });

  useEffect(() => {
    (async () => {
      try {
        const res = await apiJson("/api/auth/settings/account/", { auth: true });
        setData(res);

        // default contact number: saved otp_contact_number OR user.phone
        const initial = res?.otp_contact_number || user?.phone || "";
        setContactNumber(initial);
      } catch (e) {
        setToast({ type: "error", message: e?.message || "Failed to load privacy settings." });
      }
    })();
  }, [user]);

  const save = async () => {
    if (!data) return;

    try {
      setSaving(true);

      const payload = {
        two_step_verification: data.two_step_verification,
        cookies_enabled: data.cookies_enabled,
        otp_contact_number: contactNumber,
      };

      const res = await apiJson("/api/auth/settings/account/", {
        method: "PATCH",
        auth: true,
        body: payload,
      });

      setData(res);
      setToast({ type: "success", message: "Privacy settings saved." });
      setEditingPhone(false);
    } catch (e) {
      setToast({ type: "error", message: e?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <SettingsLayout active="Privacy settings">
        <div className="rounded-2xl bg-white p-8 shadow">Loading…</div>
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ type: "error", message: "" })}
        />
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout active="Privacy settings">
      <div className="rounded-2xl bg-white/70 p-10 shadow-lg">
        <h1 className="text-center text-3xl font-extrabold text-emerald-700">
          Account Settings
        </h1>

        {/* Panel */}
        <div className="mt-6 rounded-2xl bg-emerald-50/60 p-6">
          {/* Two-step verification */}
          <div className="flex items-start justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Two-step verification</p>
              <p className="text-xs text-slate-600">
                You will have to enter the OTP sent on your phone every time you log in.
              </p>
            </div>

            <Switch
              checked={!!data.two_step_verification}
              onChange={(v) => setData((p) => ({ ...p, two_step_verification: v }))}
            />
          </div>

          {/* Cookies */}
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Enable Cookies</p>
              <p className="text-xs text-slate-600">
                Your data will be used to show the most relevant information.
              </p>
            </div>

            <Switch
              checked={!!data.cookies_enabled}
              onChange={(v) => setData((p) => ({ ...p, cookies_enabled: v }))}
            />
          </div>
        </div>

        {/* Confirm contact number (your 2nd screenshot) */}
        <div className="mt-6 rounded-2xl bg-emerald-50/60 p-6">
          <p className="text-sm font-semibold text-slate-800">Confirm contact number</p>
          <p className="text-xs text-slate-600">
            This will be the contact number the OTP will be sent to every time you log in.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              disabled={!editingPhone}
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g. +92xxxxxxxxxx"
              className={[
                "w-full max-w-[320px] rounded-full border px-4 py-2 text-sm outline-none",
                editingPhone
                  ? "border-emerald-300 bg-white"
                  : "border-emerald-100 bg-white/60 text-slate-600",
              ].join(" ")}
            />

            <button
              type="button"
              onClick={() => setEditingPhone((p) => !p)}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              {editingPhone ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full border border-emerald-400 bg-white px-10 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ type: "error", message: "" })}
      />
    </SettingsLayout>
  );
}
