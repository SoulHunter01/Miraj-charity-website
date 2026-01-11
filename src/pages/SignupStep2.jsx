import { useState } from "react";
import { Phone, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Toast from "../components/common/Toast";
import Button from "../components/common/Button";
import { apiJson } from "../services/apiAuth";

export default function SignupVerifyPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    phone: "",
    cnic: "",
  });

  const showError = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const onlyDigits = (v) => v.replace(/\D/g, "");

  const handleNext = async (e) => {
    e.preventDefault();

    const phoneDigits = onlyDigits(form.phone);
    const cnicDigits = onlyDigits(form.cnic);

    if (!phoneDigits || phoneDigits.length < 10) {
      showError("Please enter a valid phone number.");
      return;
    }

    if (!cnicDigits || cnicDigits.length !== 13) {
      showError("CNIC must be 13 digits.");
      return;
    }

    try {
      await apiJson("/api/auth/me/", {
        method: "PATCH",
        auth: true,
        body: { phone: phoneDigits, cnic: cnicDigits },
      });

      navigate("/signup/photo");
    } catch (err) {
      if (err.status === 401) showError("Session expired. Please login again.");
      else showError(err.message || "Failed to save details.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Toast message={toast} onClose={() => setToast("")} />

      <main className="bg-emerald-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">Sign up</h1>

            <p className="text-sm text-gray-600 max-w-xl mx-auto mb-8">
              Fill the following details and your account will be set up in minutes.
            </p>

            <div className="flex justify-center gap-2 mb-10">
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-14 rounded-full bg-sky-400/70" />
              <span className="h-1.5 w-14 rounded-full bg-sky-400/70" />
              <span className="h-1.5 w-14 rounded-full bg-sky-400/70" />
            </div>

            <form onSubmit={handleNext} className="space-y-4 max-w-xl mx-auto">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
                <input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="Phone Number"
                  inputMode="tel"
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-emerald-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
                <input
                  value={form.cnic}
                  onChange={(e) => setForm((p) => ({ ...p, cnic: e.target.value }))}
                  placeholder="CNIC"
                  inputMode="numeric"
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
                >
                  Next
                </Button>
              </div>
            </form>

            <div className="mt-10 text-sm text-gray-600">
              Want to go back?{" "}
              <button
                className="text-emerald-700 font-semibold hover:underline"
                onClick={() => navigate("/signup")}
              >
                Back to Sign up
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
