import { useState } from "react";
import SettingsLayout from "./SettingsLayout";
import { apiJson } from "../../services/apiAuth";
import { useAuth } from "../../context/AuthContext";

function Toast({ message, type="error", onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`rounded-xl px-4 py-3 shadow-lg border text-sm flex items-start gap-3 ${
        type==="success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-orange-50 border-orange-200 text-orange-800"
      }`}>
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="font-semibold opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}

export default function AccountSettingsPage() {
  const { logout } = useAuth();

  const [toast, setToast] = useState({ type: "error", message: "" });

  // reset password
  const [pw, setPw] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [savingPw, setSavingPw] = useState(false);

  // deactivate/close
  const [mode, setMode] = useState("deactivate"); // "deactivate" | "close"
  const [confirmPassword, setConfirmPassword] = useState("");
  const [allocation, setAllocation] = useState("return_bank");
  const [working, setWorking] = useState(false);

  const allocationOptions = [
    { key: "return_bank", label: "Return to my bank account" },
    { key: "donate_connected", label: "Donate to connected fundraiser" },
    { key: "keep", label: "Keep it as it is" },
    { key: "donate_expenses", label: "Donate to website expenses" },
  ];

  const submitPassword = async () => {
    try {
      setSavingPw(true);
      await apiJson("/api/auth/change-password/", { method: "POST", auth: true, body: pw });
      setToast({ type: "success", message: "Password updated. Please login again." });
      // after password change, JWT is usually invalid -> logout
      setTimeout(() => logout(), 800);
    } catch (e) {
      setToast({ type: "error", message: e?.message || "Failed to update password." });
    } finally {
      setSavingPw(false);
    }
  };

  const submitDeactivateOrClose = async () => {
    try {
      setWorking(true);
      const endpoint = mode === "deactivate" ? "/api/auth/deactivate/" : "/api/auth/close/";
      await apiJson(endpoint, {
        method: "POST",
        auth: true,
        body: { password: confirmPassword, funds_allocation_choice: allocation },
      });
      setToast({ type: "success", message: mode === "deactivate" ? "Account deactivated." : "Account closed." });
      setTimeout(() => logout(), 800);
    } catch (e) {
      setToast({ type: "error", message: e?.message || "Request failed." });
    } finally {
      setWorking(false);
    }
  };

  return (
    <SettingsLayout active="Account settings">
      <div className="rounded-2xl bg-white/70 p-10 shadow-lg">
        <h1 className="text-center text-3xl font-extrabold text-emerald-700">Account Settings</h1>

        {/* Reset password */}
        <div className="mt-6 rounded-2xl bg-emerald-50/60 p-6">
          <p className="mb-3 font-semibold text-slate-800">Reset Password</p>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={pw.current_password}
              onChange={(e) => setPw((p) => ({ ...p, current_password: e.target.value }))}
              className="w-full rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm outline-none"
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={pw.new_password}
              onChange={(e) => setPw((p) => ({ ...p, new_password: e.target.value }))}
              className="w-full rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm outline-none"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={pw.confirm_password}
              onChange={(e) => setPw((p) => ({ ...p, confirm_password: e.target.value }))}
              className="w-full rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={submitPassword}
              disabled={savingPw}
              className="rounded-full border border-emerald-400 bg-white px-10 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
            >
              {savingPw ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Deactivate vs Close */}
        <div className="mt-6 rounded-2xl bg-emerald-50/60 p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-slate-800">
                {mode === "deactivate" ? "Deactivate Account" : "Close Account"}
              </p>
              <p className="text-xs text-slate-600">
                {mode === "deactivate"
                  ? "You will no longer have access to your account."
                  : "You will lose permanent access to your account if you choose this option."}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMode("deactivate")}
                className={`rounded-full px-4 py-2 text-xs font-semibold border ${
                  mode === "deactivate" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-emerald-200"
                }`}
              >
                Deactivate
              </button>
              <button
                onClick={() => setMode("close")}
                className={`rounded-full px-4 py-2 text-xs font-semibold border ${
                  mode === "close" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-emerald-200"
                }`}
              >
                Close
              </button>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="password"
              placeholder="Enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-800">Your account has some funds left.</p>
            <p className="text-xs text-slate-600">How would you like to allocate the remaining amount?</p>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {allocationOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setAllocation(opt.key)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold border ${
                    allocation === opt.key
                      ? "bg-[#bfe3ff] border-[#bfe3ff] text-slate-800"
                      : "bg-white border-emerald-200 text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={submitDeactivateOrClose}
              disabled={working}
              className="rounded-full border border-emerald-400 bg-white px-12 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
            >
              {working
                ? "Working..."
                : mode === "deactivate"
                ? "Confirm deactivation"
                : "Confirm closing account"}
            </button>
          </div>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ type:"error", message:"" })} />
    </SettingsLayout>
  );
}
