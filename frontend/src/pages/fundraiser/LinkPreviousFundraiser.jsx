import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiJson } from "../../services/apiAuth";

export default function LinkPreviousFundraiser() {
  const navigate = useNavigate();
  const { fundraiserId } = useParams();

  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiJson("/api/auth/fundraisers/active/", {
          method: "GET",
          auth: true,
        });
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErrorMsg(e.message || "Failed to load fundraisers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatMoney = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v ?? "");
    return n.toLocaleString();
  };

  const onSkip = async () => {
    // unlink and go next
    setSaving(true);
    setErrorMsg("");
    try {
      await apiJson(`/api/auth/fundraisers/${fundraiserId}/link-previous/`, {
        method: "PATCH",
        auth: true,
        body: { linked_fundraiser_id: null },
      });
      navigate(`/fundraisers/${fundraiserId}/publish`); // next step placeholder
    } catch (e) {
      setErrorMsg(e.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const onNext = async () => {
    setSaving(true);
    setErrorMsg("");
    try {
      await apiJson(`/api/auth/fundraisers/${fundraiserId}/link-previous/`, {
        method: "PATCH",
        auth: true,
        body: { linked_fundraiser_id: selectedId },
      });
      navigate(`/fundraisers/${fundraiserId}/publish`); // next step placeholder
    } catch (e) {
      setErrorMsg(e.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9efee]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-center text-3xl font-bold text-emerald-700">
          Link to a Previous Fundraiser
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Choose whether you want to connect your fundraiser to a previous fundraiser or not
        </p>

        {/* Progress */}
        <div className="mt-8 flex justify-center">
          <div className="h-2 w-72 rounded-full bg-emerald-200 overflow-hidden">
            <div className="h-full w-3/4 bg-emerald-600" />
          </div>
        </div>

        {errorMsg && (
          <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="mt-10">
          {loading ? (
            <div className="text-center text-sm text-gray-600">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-sm text-gray-600">
              You don’t have any active fundraisers yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((fr) => {
                const isSelected = selectedId === fr.id;
                return (
                  <button
                    key={fr.id}
                    onClick={() => setSelectedId(fr.id)}
                    className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
                      isSelected
                        ? "border-emerald-600 ring-2 ring-emerald-200"
                        : "border-emerald-200 hover:shadow-md"
                    }`}
                  >
                    <div className="h-28 rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50">
                      {fr.image ? (
                        <img src={fr.image} alt={fr.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-emerald-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="mt-3 font-semibold text-gray-900">{fr.title}</div>

                    <div className="mt-1 text-xs text-gray-500">
                      Rs {formatMoney(fr.collected_amount_real)} of Rs {formatMoney(fr.target_amount)} collected
                    </div>

                    <div className="mt-1 text-xs text-gray-400">
                      {fr.donations_count} donations
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={onSkip}
            disabled={saving}
            className="rounded-full bg-emerald-600 px-10 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Skip"}
          </button>

          <button
            onClick={onNext}
            disabled={saving || !selectedId}
            className="rounded-full border border-emerald-600 px-10 py-2 text-emerald-700 text-sm hover:bg-emerald-50 disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
