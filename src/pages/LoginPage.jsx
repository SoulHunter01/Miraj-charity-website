import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Toast from "../components/common/Toast";
import Button from "../components/common/Button";
import { apiJson, setTokens } from "../services/apiAuth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginWithTokens } = useAuth();


  // Keeping your UI the same, but this field will act as "username"
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const showError = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.identifier.trim() || !form.password.trim()) {
      showError("Please enter username and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiJson("/api/auth/login/", {
        method: "POST",
        body: {
          username: form.identifier.trim(), // Django SimpleJWT default
          password: form.password,
        },
      });

      setTokens({ access: data.access, refresh: data.refresh });
      await loginWithTokens({ access: data.access, refresh: data.refresh });
      navigate("/");
    } catch (err) {
      if (err.status === 401) showError("Incorrect username or password.");
      else showError(err.message || "Login failed.");
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
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">Login</h1>

            <div className="flex justify-center gap-3 mb-10">
              <span className="h-1.5 w-12 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-16 rounded-full bg-sky-400/70" />
              <span className="h-1.5 w-16 rounded-full bg-sky-400/70" />
              <span className="h-1.5 w-16 rounded-full bg-sky-400/70" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
                <input
                  value={form.identifier}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, identifier: e.target.value }))
                  }
                  placeholder="Username"
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
                <input
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Password"
                  type="password"
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="pt-6 flex flex-col items-center gap-3">
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  className="rounded-full px-10 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <button
                  type="button"
                  className="text-sm text-emerald-700 hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password
                </button>
              </div>
            </form>

            <div className="mt-8 text-sm text-gray-600">
              Don’t have an account?{" "}
              <button
                className="text-emerald-700 font-semibold hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
