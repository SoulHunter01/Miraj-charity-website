import { useState } from "react";
import { User, Mail, Lock, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Toast from "../components/common/Toast";
import Button from "../components/common/Button";
import { apiJson, setTokens } from "../services/apiAuth";

function SocialButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-11 rounded-full border border-emerald-200 bg-white
                 text-gray-800 text-sm font-semibold
                 hover:bg-emerald-50 transition-colors
                 inline-flex items-center justify-center gap-2"
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();

  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const showError = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.email.trim() || !form.password || !form.confirm) {
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
      // 1) Create user in Django/Postgres
      await apiJson("/api/auth/signup/", {
        method: "POST",
        body: {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        },
      });

      // 2) Auto-login to get JWT tokens
      const tokens = await apiJson("/api/auth/login/", {
        method: "POST",
        body: { username: form.username.trim(), password: form.password },
      });

      setTokens({ access: tokens.access, refresh: tokens.refresh });

      // 3) Go to step 2 (phone/cnic)
      navigate("/signup2");
    } catch (err) {
      // Common: username/email already exists, validation error
      showError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Toast message={toast} onClose={() => setToast("")} />

      <main className="bg-emerald-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-emerald-800 mb-3">Sign up</h1>

            <p className="text-sm text-gray-600 max-w-xl mx-auto mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id proin a purus
              odio, vitae sit. Hendrerit vel dolor et scelerisque at turpis.
            </p>

            <div className="flex justify-center gap-2 mb-10">
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-14 rounded-full bg-sky-400/70" />
              <span className="h-1.5 w-14 rounded-full bg-sky-400/70" />
              <span className="h-1.5 w-14 rounded-full bg-sky-400/70" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
                <input
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  placeholder="Username"
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
                <input
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Email"
                  type="email"
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
                <input
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Password"
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
                  placeholder="Confirm Password"
                  type="password"
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  className="rounded-full px-12 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Sign up"}
                </Button>
              </div>
            </form>

            <div className="flex items-center gap-4 my-10 max-w-xl mx-auto">
              <div className="h-px flex-1 bg-emerald-200" />
              <span className="text-sm text-gray-500 font-semibold">OR</span>
              <div className="h-px flex-1 bg-emerald-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <SocialButton icon="G" label="Continue with Google" onClick={() => showError("Not implemented yet.")} />
              <SocialButton icon="𝕏" label="Continue with Twitter" onClick={() => showError("Not implemented yet.")} />
              <SocialButton icon="f" label="Continue with Facebook" onClick={() => showError("Not implemented yet.")} />
              <SocialButton icon="⧉" label="Continue with Outlook" onClick={() => showError("Not implemented yet.")} />
            </div>

            <div className="mt-10 text-sm text-gray-600">
              Already have an account?{" "}
              <button
                className="text-emerald-700 font-semibold hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
