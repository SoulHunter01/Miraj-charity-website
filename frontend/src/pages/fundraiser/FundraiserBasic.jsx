import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiJson } from "../../services/apiAuth";

const LOCATIONS = ["Lahore", "Islamabad", "Karachi", "Multan"];
const CATEGORIES = [
  "Medical",
  "Education",
  "Emergency",
  "Animals",
  "Business",
  "Other",
];

export default function FundraiserBasic() {
  const navigate = useNavigate();
  const { fundraiserId } = useParams();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const targetNumber = useMemo(() => {
    const n = Number(targetAmount);
    return Number.isFinite(n) ? n : null;
  }, [targetAmount]);

  const onNext = async () => {
    setErrors({});
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        location,
        category,
        target_amount: targetNumber,
        deadline, // "YYYY-MM-DD"
      };

      await apiJson(`/api/auth/fundraisers/${fundraiserId}/basic/`, {
        method: "PATCH",
        auth: true,
        body: payload,
      });

      // Next step route (you can change later)
      // For now, go to edit fundraiser page:
      navigate(`/fundraisers/${fundraiserId}/details`);
    } catch (e) {
      if (e?.data && typeof e.data === "object") {
        const flat = {};
        for (const k of Object.keys(e.data)) {
          flat[k] = Array.isArray(e.data[k]) ? e.data[k][0] : String(e.data[k]);
        }
        setErrors(flat);
      } else {
        setErrors({ general: e.message || "Something went wrong" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9efee]">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-center text-3xl font-bold text-emerald-700">Start fundraiser</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Fill in the following details to start your own fundraiser
        </p>

        {/* Progress bar */}
        <div className="mt-8 flex justify-center">
          <div className="h-2 w-56 rounded-full bg-emerald-200 overflow-hidden">
            <div className="h-full w-1/3 bg-emerald-600" />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-xl space-y-4">
            {errors.general && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            {/* Title */}
            <div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            {/* Location */}
            <div>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Location</option>
                {LOCATIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
            </div>

            {/* Category */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Category</option>
                {CATEGORIES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>

            {/* Target Amount */}
            <div>
              <input
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="Target Amount"
                inputMode="numeric"
                className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
              {errors.target_amount && (
                <p className="mt-1 text-xs text-red-600">{errors.target_amount}</p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
              {errors.deadline && <p className="mt-1 text-xs text-red-600">{errors.deadline}</p>}
            </div>

            <div className="pt-6 flex justify-center">
              <button
                onClick={onNext}
                disabled={loading}
                className="rounded-full border border-emerald-500 px-10 py-2 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
