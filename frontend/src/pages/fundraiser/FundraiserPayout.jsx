import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiJson } from "../../services/apiAuth";

import FundraiserSuccessModal from "../../components/FundraiserSuccessModal";

const METHODS = [
  { key: "bank", label: "Bank Account" },
  { key: "nayapay", label: "NayaPay" },
  { key: "sadapay", label: "SadaPay" },
  { key: "jazzcash", label: "JazzCash" },
  { key: "easypaisa", label: "EasyPaisa" },
  { key: "raast", label: "Raast" },
];

const PERIODS = [
  { key: "3_days", label: "3 days" },
  { key: "7_days", label: "7 days" },
  { key: "15_days", label: "15 days" },
  { key: "30_days", label: "30 days" },
  { key: "on_deadline", label: "On deadline" },
];

export default function FundraiserPayout() {
  const navigate = useNavigate();
  const { fundraiserId } = useParams();

  const [activeMethod, setActiveMethod] = useState("bank");
  const [enabled, setEnabled] = useState(() => new Set()); // selected methods
  const [period, setPeriod] = useState("7_days");

  const [successOpen, setSuccessOpen] = useState(false);
  const [publishedFundraiser, setPublishedFundraiser] = useState(null);

  // bank fields
  const [accountTitle, setAccountTitle] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [raastId, setRaastId] = useState("");

  // phone (for wallets)
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load previously saved setup (optional)
  useEffect(() => {
    (async () => {
      try {
        const data = await apiJson(`/api/auth/fundraisers/${fundraiserId}/payout-setup/`, {
          method: "GET",
          auth: true,
        });

        if (data.reimbursement_period) setPeriod(data.reimbursement_period);

        const selected = new Set();
        (data.payout_methods || []).forEach((m) => {
          if (m.is_enabled) selected.add(m.method);
        });
        setEnabled(selected);

        // preload fields from bank method if enabled
        const bank = (data.payout_methods || []).find((m) => m.method === "bank");
        if (bank) {
          setAccountTitle(bank.bank_account_title || "");
          setAccountNumber(bank.bank_account_number || "");
          setIban(bank.bank_iban || "");
          setRaastId(bank.bank_raast_id || "");
        }
      } catch {
        // ignore
      }
    })();
  }, [fundraiserId]);

  const toggleMethod = (method) => {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(method)) next.delete(method);
      else next.add(method);
      return next;
    });
    setActiveMethod(method);
  };

  const buildPayload = () => {
    const arr = [];

    METHODS.forEach((m) => {
      const is_enabled = enabled.has(m.key);

      if (m.key === "bank") {
        arr.push({
          method: "bank",
          is_enabled,
          bank_account_title: accountTitle,
          bank_account_number: accountNumber,
          bank_iban: iban,
          bank_raast_id: raastId,
        });
      } else {
        arr.push({
          method: m.key,
          is_enabled,
          phone_number: phoneNumber,
        });
      }
    });

    return {
      reimbursement_period: period,
      payout_methods: arr,
    };
  };

  const saveDraft = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await apiJson(`/api/auth/fundraisers/${fundraiserId}/payout-setup/`, {
        method: "PATCH",
        auth: true,
        body: buildPayload(),
      });
      // stay on page, show success
      alert("Saved as draft");
    } catch (e) {
      setErrorMsg(e.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const publish = async () => {
    setLoading(true);
    setErrorMsg("");
  
    try {
      // save payout setup first (as you already do)
      await apiJson(`/api/auth/fundraisers/${fundraiserId}/payout-setup/`, {
        method: "PATCH",
        auth: true,
        body: buildPayload(),
      });
  
      // publish
      const res = await apiJson(`/api/auth/fundraisers/${fundraiserId}/publish/`, {
        method: "POST",
        auth: true,
      });
  
      setPublishedFundraiser(res);
      setSuccessOpen(true);
    } catch (e) {
      setErrorMsg(e.message || "Failed to publish");
    } finally {
      setLoading(false);
    }
  };

  const showBankForm = useMemo(() => activeMethod === "bank", [activeMethod]);
  const showPhoneForm = useMemo(() => activeMethod !== "bank", [activeMethod]);

  return (
    <div className="min-h-screen bg-[#e9efee]">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-center text-3xl font-bold text-emerald-700">Fundraiser Details</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Choose your donation receiving method and the frequency at which you want to receive the donations
        </p>

        {/* Progress */}
        <div className="mt-8 flex justify-center">
          <div className="h-2 w-72 rounded-full bg-emerald-200 overflow-hidden">
            <div className="h-full w-full bg-emerald-600" />
          </div>
        </div>

        {errorMsg && (
          <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Methods */}
        <div className="mt-10">
          <p className="text-sm text-gray-700 mb-3">How you want to receive your donations</p>

          <div className="flex flex-wrap gap-3 justify-center">
            {METHODS.map((m) => {
              const isOn = enabled.has(m.key);
              const isActive = activeMethod === m.key;

              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => toggleMethod(m.key)}
                  className={`rounded-xl border px-4 py-2 text-xs transition ${
                    isOn
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-700 border-emerald-300"
                  } ${isActive ? "ring-2 ring-emerald-200" : ""}`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* bank form */}
          {showBankForm && enabled.has("bank") && (
            <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
              <div className="space-y-3 max-w-xl mx-auto">
                <input
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder="Account Title"
                  className="w-full rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm outline-none"
                />
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account Number"
                  className="w-full rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="IBAN (Optional)"
                    className="w-full rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm outline-none"
                  />
                  <input
                    value={raastId}
                    onChange={(e) => setRaastId(e.target.value)}
                    placeholder="RAAST ID (Optional)"
                    className="w-full rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* phone form */}
          {showPhoneForm && enabled.has(activeMethod) && (
            <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
              <div className="max-w-xl mx-auto">
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Period */}
        <div className="mt-10">
          <p className="text-sm text-gray-700 mb-3 text-center">Choose Reimbursement Period</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={`rounded-full border px-5 py-2 text-xs ${
                  period === p.key
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-emerald-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex justify-center gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={saveDraft}
            className="rounded-full border border-emerald-600 px-10 py-2 text-emerald-700 text-sm hover:bg-emerald-50 disabled:opacity-60"
          >
            Save as draft
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={publish}
            className="rounded-full bg-emerald-600 px-10 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            Publish
          </button>
        </div>
      </div>

      {/* ✅ Modal MUST be inside the component */}
      <FundraiserSuccessModal
        open={successOpen}
        fundraiser={publishedFundraiser}
        onClose={() => {
          setSuccessOpen(false);
          navigate(`/dashboard/my-fundraisers`);
        }}
        onDonate={() => navigate(`/fundraisers/${fundraiserId}/donate`)}
        onViewSimilar={() => navigate("/discover")}
      />
    </div>
  );
}