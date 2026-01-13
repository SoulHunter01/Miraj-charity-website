import { useState } from "react";
import { Lock, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Toast from "../components/common/Toast";
import Button from "../components/common/Button";
import { apiJson } from "../services/apiAuth";

export default function ForgotPasswordNewPasswordPage() {
  const navigate = useNavigate();

  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ password: "", confirm: "" });

  const resetId = sessionStorage.getItem("fp_reset_id") || "";
  const resetToken = sessionStorage.getItem("fp_reset_token") || "";

  const showError = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!resetId || !resetToken) {
      showError("Reset session missing. Start again.");
      navigate("/forgot-password");
      return;
    }

    if (!form.password || !form.confirm) {
      showError("Please fill all fields.");
      return;
    }
    if (form.password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      showError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await apiJson("/api/auth/password-reset/complete/", {
        method: "POST",
        body: {
          reset_id: resetId,
          reset_token: resetToken,
          new_password: form.password,
        },
      });

      // cleanup
      ["fp_reset_id", "fp_reset_token", "fp_expires_in", "fp_method", "fp_destination"].forEach((k) =>
        sessionStorage.removeItem(k)
      );

      navigate("/login");
    } catch (err) {
      showError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Toast message={toast} onClose={() => setToast("")} />

      <main className="bg-emerald-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">
              Forgot Password
            </h1>

            <div className="flex justify-center gap-2 mb-8 mt-4">
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
            </div>

            <p className="text-sm text-gray-600 mb-8">
              Please enter your new password
            </p>

            <form onSubmit={handleConfirm} className="space-y-4 max-w-xl mx-auto">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
                <input
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="New password"
                  type="password"
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
                <input
                  value={form.confirm}
                  onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                  placeholder="Confirm new password"
                  type="password"
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="pt-6 flex justify-center">
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  className="rounded-full px-12 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Confirm"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
