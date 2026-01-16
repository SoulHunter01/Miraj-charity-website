import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { apiJson } from "../../services/apiAuth";

const PRESET_AMOUNTS = [500, 1000, 5000, 15000];
const FALLBACK_IMG = "https://via.placeholder.com/800x500?text=Fundraiser";

function formatMoney(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
}

export default function DonateCheckoutPage() {
  const { fundraiserId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [fundraiser, setFundraiser] = useState(null);

  // form state
  const [frequency, setFrequency] = useState("monthly");
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [tipAmount, setTipAmount] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiJson(
          `/api/auth/fundraisers/${fundraiserId}/public/`,
          { method: "GET", auth: false }
        );
        setFundraiser(res);
      } catch (e) {
        console.error(e);
        setFundraiser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [fundraiserId]);

  const finalAmount = useMemo(() => {
    return Number(customAmount || amount || 0);
  }, [amount, customAmount]);

  const onNext = () => {
    if (!finalAmount || finalAmount <= 0) {
      alert("Please select or enter a valid amount.");
      return;
    }
  
    navigate(`/donate/${fundraiserId}/confirm`, {
      state: { amount: finalAmount, frequency, tip: Number(tipAmount || 0) },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {loading ? (
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600">
          Loading...
        </div>
      ) : !fundraiser ? (
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600">
          Fundraiser not found.
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Select an amount
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2">
              <Card>
                {/* Frequency */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How Often Would You Like To Donate?
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full h-11 rounded-xl border border-emerald-200 px-4 text-sm
                               outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="one_time">One Time</option>
                  </select>
                </div>

                {/* Preset amounts */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Choose How Much?
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESET_AMOUNTS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => {
                          setAmount(a);
                          setCustomAmount("");
                        }}
                        className={`h-11 rounded-xl border text-sm font-semibold transition
                          ${
                            Number(amount) === a
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {a} PKR
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    placeholder="Or enter amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount("");
                    }}
                    className="mt-4 w-full h-11 rounded-xl border border-emerald-200 px-4 text-sm
                               outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                {/* Website tip */}
                <div className="mb-6 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Your Generosity Helps Us
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                        All the tips are spent on the maintenance and advancements of our website.
                    </p>

                    <input
                        type="number"
                        min="0"
                        placeholder="Add a tip"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(e.target.value)}
                        className="w-full h-11 rounded-xl border border-emerald-200 px-4 text-sm
                                outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                    />
                </div>

                <Button
                  className="w-full rounded-full"
                  onClick={onNext}
                >
                  Next
                </Button>
              </Card>
            </div>

            {/* RIGHT SUMMARY */}
            <div className="lg:col-span-1">
              <Card className="bg-emerald-50/40 border border-emerald-100">
                <div className="rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={fundraiser.image_url || FALLBACK_IMG}
                    alt={fundraiser.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  />
                </div>

                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Your thoughtful donation will go a long way in helping this donee
                </h3>

                <p className="text-xs text-gray-600 mb-4 line-clamp-4">
                  {fundraiser.description}
                </p>

                <div className="text-xs text-gray-700 space-y-1">
                  <div>
                    Raised: <strong>Rs {formatMoney(fundraiser.raised)}</strong>
                  </div>
                  <div>
                    Goal: <strong>Rs {formatMoney(fundraiser.target_amount)}</strong>
                  </div>
                  <div>
                    Amount Left:{" "}
                    <strong>
                      Rs{" "}
                      {formatMoney(
                        fundraiser.target_amount - fundraiser.raised
                      )}
                    </strong>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
