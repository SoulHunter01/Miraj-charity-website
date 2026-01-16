import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Facebook,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  X,
} from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { apiJson } from "../../services/apiAuth";

const FALLBACK_IMG = "https://via.placeholder.com/800x500?text=Fundraiser";

const PAYMENT_OPTIONS = [
  { key: "visa", label: "VISA" },
  { key: "mastercard", label: "MasterCard" },
  { key: "sadapay", label: "SadaPay" },
  { key: "easypaisa", label: "EasyPaisa" },
  { key: "nayapay", label: "NayaPay" },
  { key: "raast", label: "Raast" },
];

function formatMoney(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
}

function ShareSuccessModal({ open, fundraiser, onClose }) {
  const shareUrl = useMemo(() => {
    // share the public fundraiser page
    return `${window.location.origin}/donate/${fundraiser?.id}`;
  }, [fundraiser?.id]);

  if (!open) return null;

  const shareText = `Support this fundraiser: ${fundraiser?.title || "Fundraiser"}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const onNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: fundraiser?.title || "Fundraiser", text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied ✅");
      }
    } catch (e) {
      // ignore user cancel
      console.error(e);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied ✅");
    } catch (e) {
      console.error(e);
      alert("Copy failed");
    }
  };

  const openPopup = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl rounded-3xl bg-[#f3fbf7] border border-emerald-100 shadow-xl overflow-hidden">
          {/* close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="p-8">
            <h2 className="text-3xl font-extrabold text-emerald-700 text-center">
              Help spread the word
            </h2>

            <div className="mt-6 flex justify-center">
              <div className="w-[360px] max-w-full rounded-2xl overflow-hidden bg-gray-100 border border-emerald-100">
                <img
                  src={fundraiser?.image_url || FALLBACK_IMG}
                  alt={fundraiser?.title || "Fundraiser"}
                  className="w-full h-52 object-cover"
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="w-[440px] max-w-full rounded-2xl bg-white border border-emerald-100 p-4 text-center">
                <div className="text-xs text-gray-600">
                  Sharing your own donation encourages others to donate too
                </div>

                <button
                  type="button"
                  onClick={onNativeShare}
                  className="mt-2 text-sm font-semibold text-emerald-700 hover:underline"
                >
                  Share Fundraiser
                </button>

                <div className="mt-3 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
                    onClick={() => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
                    onClick={() => openPopup(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`)}
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
                    onClick={() => openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)}
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
                    onClick={onCopy}
                    aria-label="Copy link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-semibold text-emerald-700 hover:underline"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  // optional: go to Discover or similar list
                  window.location.href = "/discover";
                }}
                className="text-sm font-semibold text-emerald-700 hover:underline"
              >
                View Similar Fundraisers &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonatePaymentPage() {
  const { fundraiserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // values from previous screen
  const amount = Number(location.state?.amount || 0);
  const tip = Number(location.state?.tip || 0);
  const frequency = location.state?.frequency || "monthly";

  const [loading, setLoading] = useState(true);
  const [fundraiser, setFundraiser] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("visa");

  // conditional fields
  const [payerPhone, setPayerPhone] = useState("");

  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");

  const [donateMode, setDonateMode] = useState("anonymous"); // "anonymous" | "name"
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const isCardMethod = paymentMethod === "visa" || paymentMethod === "mastercard";
  const totalPay = useMemo(() => amount + tip, [amount, tip]);

  useEffect(() => {
    // if user refreshes, state is lost; send back to checkout
    if (!amount || amount <= 0) {
      navigate(`/donate/${fundraiserId}/checkout`, { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await apiJson(`/api/auth/fundraisers/${fundraiserId}/public/`, {
          method: "GET",
          auth: false,
        });
        setFundraiser(res);
      } catch (e) {
        console.error(e);
        setFundraiser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [fundraiserId, amount, navigate]);

  // clear irrelevant fields when switching payment method
  useEffect(() => {
    const isCard = paymentMethod === "visa" || paymentMethod === "mastercard";
    if (isCard) {
      setPayerPhone("");
    } else {
      setCardHolderName("");
      setCardNumber("");
      setCardCvc("");
      setCardExpiry("");
    }
  }, [paymentMethod]);

  const validateBeforeSubmit = () => {
    if (isCardMethod) {
      if (!cardHolderName.trim()) return "Card holder name is required.";
      if (!cardNumber.trim() || cardNumber.trim().length < 12) return "Enter a valid card number.";
      if (!cardCvc.trim() || cardCvc.trim().length < 3) return "Enter a valid CVC.";
      if (!cardExpiry.trim()) return "Expiry date is required.";
    } else {
      if (!payerPhone.trim()) return "Phone number is required for this payment method.";
    }
    return "";
  };

  const onDonate = async () => {
    const err = validateBeforeSubmit();
    if (err) {
      alert(err);
      return;
    }

    setSubmitting(true);
    try {
      await apiJson(`/api/auth/fundraisers/${fundraiserId}/donate/`, {
        method: "POST",
        auth: true,
        body: {
          amount,
          tip_amount: tip,
          frequency_label: frequency,

          payment_method: paymentMethod,
          is_anonymous: donateMode === "anonymous",
          message,

          payer_phone: isCardMethod ? "" : payerPhone,

          card_holder_name: isCardMethod ? cardHolderName : "",
          card_number: isCardMethod ? cardNumber : "",
          card_cvc: isCardMethod ? cardCvc : "",
          card_expiry: isCardMethod ? cardExpiry : "",
        },
      });

      // ✅ show last screen modal (instead of navigating away)
      setShowSuccess(true);
    } catch (e) {
      console.error(e);
      alert(e?.detail || "Donation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccessAndGoHome = () => {
    setShowSuccess(false);
    navigate("/", { replace: true }); // ✅ go home after closing
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ✅ success modal (last screen) */}
      <ShareSuccessModal
        open={showSuccess}
        fundraiser={fundraiser || { id: fundraiserId }}
        onClose={closeSuccessAndGoHome}
      />

      {loading ? (
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600">Loading...</div>
      ) : !fundraiser ? (
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600">Fundraiser not found.</div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2">
              <Card>
                {/* step bar */}
                <div className="flex gap-2 mb-6">
                  <div className="h-2 w-20 rounded-full bg-emerald-500" />
                  <div className="h-2 w-14 rounded-full bg-emerald-500" />
                  <div className="h-2 flex-1 rounded-full bg-emerald-200" />
                </div>

                <h2 className="text-2xl font-extrabold text-emerald-700 mb-1">
                  Select Payment Method
                </h2>
                <p className="text-sm text-gray-600 mb-6">Choose payment method</p>

                {/* payment buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {PAYMENT_OPTIONS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPaymentMethod(p.key)}
                      className={`h-10 px-5 rounded-lg border text-sm font-semibold transition
                        ${
                          paymentMethod === p.key
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* payment details (dynamic) */}
                <div className="mb-8">
                  {isCardMethod ? (
                    <div className="space-y-3">
                      <input
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
                        placeholder="Card Holder Name"
                        className="w-full h-11 rounded-xl border border-emerald-200 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                      />

                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        inputMode="numeric"
                        className="w-full h-11 rounded-xl border border-emerald-200 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          inputMode="numeric"
                          className="w-full h-11 rounded-xl border border-emerald-200 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                        />
                        <input
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="Expiry Date (MM/YY)"
                          className="w-full h-11 rounded-xl border border-emerald-200 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                        />
                      </div>
                    </div>
                  ) : (
                    <input
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full h-11 rounded-xl border border-emerald-200 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  )}
                </div>

                {/* donate mode */}
                <div className="flex items-center gap-8 mb-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="donateMode"
                      checked={donateMode === "anonymous"}
                      onChange={() => setDonateMode("anonymous")}
                      className="accent-emerald-600"
                    />
                    Donate Anonymously
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="donateMode"
                      checked={donateMode === "name"}
                      onChange={() => setDonateMode("name")}
                      className="accent-emerald-600"
                    />
                    Donate With Your Name
                  </label>
                </div>

                {/* message */}
                <div className="mb-8">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send a message to your donee"
                    className="w-full min-h-[90px] rounded-xl border border-emerald-200 px-4 py-3 text-sm
                               outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    className="rounded-full px-14 bg-emerald-600 hover:bg-emerald-700"
                    onClick={onDonate}
                    disabled={submitting}
                  >
                    {submitting ? "Donating..." : "Donate"}
                  </Button>
                </div>
              </Card>
            </div>

            {/* RIGHT SUMMARY */}
            <div className="lg:col-span-1">
              <Card className="bg-emerald-50/40 border border-emerald-100">
                <div className="rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={fundraiser.image_url || FALLBACK_IMG}
                    alt={fundraiser.title}
                    className="w-full h-44 object-cover"
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
                      Rs {formatMoney(Number(fundraiser.target_amount) - Number(fundraiser.raised))}
                    </strong>
                  </div>

                  <div className="pt-2 border-t border-emerald-100 mt-3 space-y-1">
                    <div>
                      Donation: <strong>Rs {formatMoney(amount)}</strong>
                    </div>
                    <div>
                      Tip: <strong>Rs {formatMoney(tip)}</strong>
                    </div>
                    <div>
                      Total: <strong>Rs {formatMoney(totalPay)}</strong>
                    </div>
                    <div>
                      Frequency: <strong>{frequency}</strong>
                    </div>
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
