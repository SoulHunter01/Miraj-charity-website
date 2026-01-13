import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Toast from "../components/common/Toast";
import Button from "../components/common/Button";
import { apiJson } from "../services/apiAuth";

const OTP_LEN = 6;

export default function ForgotPasswordOtpPage() {
  const navigate = useNavigate();

  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const [digits, setDigits] = useState(Array(OTP_LEN).fill(""));
  const inputsRef = useRef([]);

  const method = sessionStorage.getItem("fp_method") || "email"; // "phone" | "email"
  const destination = sessionStorage.getItem("fp_destination") || "";
  const resetId = sessionStorage.getItem("fp_reset_id") || "";

  // countdown seconds
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const stored = sessionStorage.getItem("fp_expires_in");
    return stored ? Number(stored) : 300;
  });

  const otp = useMemo(() => digits.join(""), [digits]);

  const showError = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  useEffect(() => {
    // if user opened this page directly without starting reset
    if (!resetId || !destination) {
      showError("Please start password reset first.");
      navigate("/forgot-password");
      return;
    }
    // focus first box
    inputsRef.current?.[0]?.focus();
  }, []);

  useEffect(() => {
    if (!resetId) return;

    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        const next = s - 1;
        sessionStorage.setItem("fp_expires_in", String(next));
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, resetId]);

  const setDigit = (index, value) => {
    const v = value.replace(/\D/g, "").slice(-1); // keep 1 digit
    setDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
    if (v && index < OTP_LEN - 1) inputsRef.current?.[index + 1]?.focus();
  };

  const onKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        inputsRef.current?.[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current?.[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LEN - 1) inputsRef.current?.[index + 1]?.focus();
  };

  const onPaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    if (!text) return;
    e.preventDefault();
    const next = text.split("");
    while (next.length < OTP_LEN) next.push("");
    setDigits(next);
    const lastIndex = Math.min(text.length, OTP_LEN) - 1;
    inputsRef.current?.[lastIndex]?.focus();
  };

  const handleResend = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await apiJson("/api/auth/password-reset/resend/", {
        method: "POST",
        body: { reset_id: resetId },
      });

      const expiresIn = data.expires_in ?? 300;
      setSecondsLeft(expiresIn);
      sessionStorage.setItem("fp_expires_in", String(expiresIn));

      showError("Code resent.");
    } catch (err) {
      showError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (otp.length !== OTP_LEN) {
      showError("Please enter the 6-digit code.");
      return;
    }
    if (secondsLeft <= 0) {
      showError("Code expired. Please resend code.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiJson("/api/auth/password-reset/verify/", {
        method: "POST",
        body: { reset_id: resetId, code: otp },
      });

      // backend returns a short-lived reset_token
      sessionStorage.setItem("fp_reset_token", data.reset_token);
      navigate("/forgot-password/new-password");
    } catch (err) {
      showError(err.message || "Invalid code. Please try again.");
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
              <span className="h-1.5 w-14 rounded-full bg-sky-400/70" />
            </div>

            <p className="text-sm text-gray-600 mb-2">
              Please enter the 6-digit security code sent to your{" "}
              {method === "phone" ? "phone number" : "email address"}.
            </p>

            <p className="text-xs text-orange-500 mb-6">
              Expires in {Math.max(secondsLeft, 0)} seconds
            </p>

            <div className="flex justify-center gap-3 mb-8" onPaste={onPaste}>
              {digits.map((d, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  value={d}
                  onChange={(e) => setDigit(idx, e.target.value)}
                  onKeyDown={(e) => onKeyDown(idx, e)}
                  className="w-12 h-12 text-center text-lg font-semibold rounded-lg border border-emerald-300 bg-white
                             focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  inputMode="numeric"
                  maxLength={1}
                />
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50 px-8"
                onClick={handleResend}
                type="button"
                disabled={loading}
              >
                Resend Code
              </Button>

              <Button
                variant="primary"
                size="sm"
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 px-10"
                onClick={handleContinue}
                type="button"
                disabled={loading}
              >
                Continue
              </Button>
            </div>

            <div className="mt-10 text-sm text-gray-600">
              Wrong destination?{" "}
              <button
                className="text-emerald-700 font-semibold hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Start again
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
