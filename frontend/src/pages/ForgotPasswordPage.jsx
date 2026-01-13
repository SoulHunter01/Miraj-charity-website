import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="bg-emerald-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">
              Forgot Password
            </h1>

            <p className="text-gray-600 mb-10">
              Do you want the security code to be sent on your <br />
              phone or email address?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="md"
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 px-10"
                onClick={() => navigate("/forgot-password/phone")}
                type="button"
              >
                Phone Number
              </Button>

              <Button
                variant="secondary"
                size="md"
                className="rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50 px-10"
                onClick={() => navigate("/forgot-password/email")}
                type="button"
              >
                Email Address
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
