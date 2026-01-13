import { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Toast from "../components/common/Toast";
import Button from "../components/common/Button";
import { apiJson } from "../services/apiAuth";

export default function ForgotPasswordEmailPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const showError = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      showError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiJson("/api/auth/password-reset/start/", {
        method: "POST",
        body: { method: "email", destination: email.trim() },
      });

      sessionStorage.setItem("fp_method", "email");
      sessionStorage.setItem("fp_destination", email.trim());
      sessionStorage.setItem("fp_reset_id", data.reset_id);
      sessionStorage.setItem("fp_expires_in", String(data.expires_in ?? 300));

      navigate("/forgot-password/otp");
    } catch (err) {
      showError(err.message || "Failed to send code.");
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
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">
              Forgot Password
            </h1>
            <p className="text-gray-600 mb-10">
              Enter your email address to receive the security code.
            </p>

            <form onSubmit={handleSend} className="max-w-xl mx-auto space-y-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  type="email"
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-12"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Code"}
                </Button>
              </div>
            </form>

            <div className="mt-10 text-sm text-gray-600">
              <button
                className="text-emerald-700 font-semibold hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
