import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Plus, Trash2, ArrowLeft } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { apiJson, apiForm } from "../../services/apiAuth";

// payout logos
import bankLogo from "../../assets/payouts/Bank-Logo.png";
import nayapayLogo from "../../assets/payouts/NayaPay-Logo.png";
import sadapayLogo from "../../assets/payouts/SadaPay-Logo.png";
import jazzcashLogo from "../../assets/payouts/jazzcash-Logo.png";
import easypaisaLogo from "../../assets/payouts/Easypaisa-Logo.png";
import raastLogo from "../../assets/payouts/Raast-Logo.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function absUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return `${API_BASE}${pathOrUrl}`;
}

function Toast({ message, type = "error", onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={[
          "rounded-xl px-4 py-3 shadow-lg border text-sm flex items-start gap-3",
          type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-orange-50 border-orange-200 text-orange-800",
        ].join(" ")}
      >
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="font-semibold opacity-70 hover:opacity-100">
          ✕
        </button>
      </div>
    </div>
  );
}

function LabelRow({ label }) {
  return (
    <div className="flex items-center gap-2">
      <Pencil className="h-4 w-4 text-orange-500" />
      <p className="text-sm font-semibold text-slate-700">{label}</p>
    </div>
  );
}

function TextInput({ value, onChange, placeholder = "", type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
    />
  );
}

function TextArea({ value, onChange, placeholder = "", rows = 5 }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
    />
  );
}

const emptyPayout = (method) => ({
  method,
  is_enabled: false,
  bank_account_title: "",
  bank_account_number: "",
  bank_iban: "",
  bank_raast_id: "",
  phone_number: "",
});

export default function EditFundraiserPage() {
  const { fundraiserId } = useParams();
  const navigate = useNavigate();

  const coverInputRef = useRef(null);
  const docInputRef = useRef(null);

  const payoutOptions = useMemo(
    () => [
      { key: "bank", label: "Bank Account", logo: bankLogo },
      { key: "nayapay", label: "NayaPay", logo: nayapayLogo },
      { key: "sadapay", label: "SadaPay", logo: sadapayLogo },
      { key: "jazzcash", label: "JazzCash", logo: jazzcashLogo },
      { key: "easypaisa", label: "EasyPaisa", logo: easypaisaLogo },
      { key: "raast", label: "Raast", logo: raastLogo },
    ],
    []
  );

  const initialPayouts = useMemo(() => {
    return Object.fromEntries(payoutOptions.map((o) => [o.key, emptyPayout(o.key)]));
  }, [payoutOptions]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({ type: "error", message: "" });

  // inline title edit
  const [editingTitle, setEditingTitle] = useState(false);

  // basic fields
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    deadline: "",
    target_amount: "",
  });

  // cover + docs
  const [coverUrl, setCoverUrl] = useState("");
  const [docs, setDocs] = useState([]); // [{id, file, uploaded_at}]

  // multi payout
  const [activeMethod, setActiveMethod] = useState("bank");
  const [payouts, setPayouts] = useState(initialPayouts);

  const showBackendError = (e, fallback = "Request failed.") => {
    const msg =
      e?.data?.detail ||
      (e?.data && typeof e.data === "object"
        ? Object.values(e.data).flat().join(" ")
        : null) ||
      e?.message ||
      fallback;
    setToast({ type: "error", message: msg });
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiJson(`/api/auth/fundraisers/${fundraiserId}/edit/`, { auth: true });

      setForm({
        title: res.title || "",
        description: res.description || "",
        location: res.location || "",
        deadline: res.deadline || "",
        target_amount: res.target_amount ?? "",
      });

      setCoverUrl(res.image ? absUrl(res.image) : "");
      setDocs(Array.isArray(res.documents) ? res.documents : []);

      // payouts from backend -> map
      const base = { ...initialPayouts };
      if (Array.isArray(res.payouts)) {
        for (const p of res.payouts) {
          if (p?.method && base[p.method]) {
            base[p.method] = { ...base[p.method], ...p };
          }
        }
      }
      setPayouts(base);

      // choose first enabled method as active, else bank
      const enabled = Object.values(base).find((x) => x.is_enabled);
      setActiveMethod(enabled?.method || "bank");
    } catch (e) {
      showBackendError(e, "Failed to load fundraiser.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundraiserId]);

  const uploadCover = async (file) => {
    const local = URL.createObjectURL(file);
    setCoverUrl(local);

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await apiForm(`/api/auth/fundraisers/${fundraiserId}/edit/cover/`, {
        method: "POST",
        auth: true,
        formData: fd,
      });

      setCoverUrl(res.image ? absUrl(res.image) : local);
      setToast({ type: "success", message: "Cover image updated." });
    } catch (e) {
      showBackendError(e, "Cover upload failed.");
      load();
    }
  };

  const uploadDoc = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    try {
      const doc = await apiForm(`/api/auth/fundraisers/${fundraiserId}/edit/documents/`, {
        method: "POST",
        auth: true,
        formData: fd,
      });

      setDocs((p) => [doc, ...p]);
      setToast({ type: "success", message: "Document uploaded." });
    } catch (e) {
      showBackendError(e, "Document upload failed.");
    }
  };

  const deleteDoc = async (docId) => {
    try {
      await apiJson(`/api/auth/fundraisers/${fundraiserId}/edit/documents/${docId}/`, {
        method: "DELETE",
        auth: true,
      });
      setDocs((p) => p.filter((d) => d.id !== docId));
      setToast({ type: "success", message: "Document removed." });
    } catch (e) {
      showBackendError(e, "Delete failed.");
    }
  };

  const validateBeforeSave = () => {
    if (!form.title.trim()) return "Title cannot be empty.";

    // validate enabled payout methods
    for (const p of Object.values(payouts)) {
      if (!p.is_enabled) continue;

      if (p.method === "bank") {
        if (!p.bank_account_title.trim()) return "Bank Account Title is required (Bank enabled).";
        if (!p.bank_account_number.trim()) return "Bank Account Number is required (Bank enabled).";
      } else {
        if (!p.phone_number.trim()) return `Phone Number is required (${p.method} enabled).`;
      }
    }

    return null;
  };

  const save = async () => {
    const err = validateBeforeSave();
    if (err) {
      setToast({ type: "error", message: err });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        deadline: form.deadline || null,
        target_amount: Number(form.target_amount || 0),

        payouts: Object.values(payouts), // ✅ multi methods saved
      };

      await apiJson(`/api/auth/fundraisers/${fundraiserId}/edit/`, {
        method: "PATCH",
        auth: true,
        body: payload,
      });

      setToast({ type: "success", message: "Changes saved." });
      setEditingTitle(false);
      await load();
    } catch (e) {
      showBackendError(e, "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const discard = async () => {
    await load();
    setEditingTitle(false);
    setToast({ type: "success", message: "Changes discarded." });
  };

  const active = payouts[activeMethod] || emptyPayout(activeMethod);

  return (
    <div className="min-h-screen bg-[#eaf6ff] flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="rounded-2xl bg-white/70 p-8 shadow-lg">
            {/* Back */}
            <button
              onClick={() => navigate(`/dashboard/my-fundraisers/${fundraiserId}`)}
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {loading ? (
              <div className="rounded-xl bg-white px-6 py-4 shadow">Loading…</div>
            ) : (
              <>
                {/* Title with pencil toggle */}
                <div className="flex items-center gap-3">
                  {!editingTitle ? (
                    <>
                      <h1 className="text-2xl font-extrabold text-emerald-700">
                        {form.title || "Untitled Fundraiser"}
                      </h1>
                      <button
                        type="button"
                        onClick={() => setEditingTitle(true)}
                        className="rounded-full bg-white/90 p-2 text-orange-500 shadow hover:bg-white"
                        title="Edit title"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex w-full max-w-[540px] items-center gap-2">
                      <TextInput
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Enter fundraiser title"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingTitle(false)}
                        className="rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>

                {/* Top: cover + side info */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Cover + description */}
                  <div className="lg:col-span-2">
                    <div className="relative overflow-hidden rounded-2xl bg-slate-200">
                      {coverUrl ? (
                        <img src={coverUrl} alt="cover" className="h-[260px] w-full object-cover" />
                      ) : (
                        <div className="h-[260px]" />
                      )}

                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute left-4 top-4 rounded-full bg-white/90 p-2 text-orange-500 shadow"
                        title="Change cover"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          uploadCover(file);
                          e.target.value = "";
                        }}
                      />
                    </div>

                    <div className="mt-5 space-y-2">
                      <LabelRow label="Description" />
                      <TextArea
                        rows={5}
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Write fundraiser description..."
                      />
                    </div>
                  </div>

                  {/* Side fields */}
                  <div className="space-y-4 rounded-2xl bg-emerald-50/60 p-5">
                    <LabelRow label="Target Amount" />
                    <TextInput
                      type="number"
                      value={form.target_amount}
                      onChange={(e) => setForm((p) => ({ ...p, target_amount: e.target.value }))}
                      placeholder="e.g. 18000"
                    />

                    <LabelRow label="Location" />
                    <TextInput
                      value={form.location}
                      onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                      placeholder="e.g. Lahore"
                    />

                    <LabelRow label="End Date" />
                    <TextInput
                      type="date"
                      value={form.deadline || ""}
                      onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Supporting documents */}
                <div className="mt-8">
                  <LabelRow label="Supporting Documents" />

                  <div className="mt-3 flex flex-wrap gap-4">
                    {/* Add */}
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      className="flex h-24 w-28 items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                      title="Upload document"
                    >
                      <Plus className="h-6 w-6" />
                    </button>

                    <input
                      ref={docInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        uploadDoc(file);
                        e.target.value = "";
                      }}
                    />

                    {/* Existing docs */}
                    {docs.map((d) => {
                      const fileUrl = absUrl(d.file);

                      return (
                        <div
                          key={d.id}
                          className="relative h-24 w-28 overflow-hidden rounded-xl border border-emerald-200 bg-white"
                        >
                          {/(\.png|\.jpg|\.jpeg|\.webp)$/i.test(fileUrl) ? (
                            <img src={fileUrl} alt="doc" className="h-full w-full object-cover" />
                          ) : (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-emerald-700 underline"
                            >
                              Open file
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => deleteDoc(d.id)}
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-red-600 shadow"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ✅ Multi payout methods */}
                <div className="mt-10">
                  <LabelRow label="How you want to receive your donations" />

                  {/* Tabs */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {payoutOptions.map((opt) => {
                      const isActive = activeMethod === opt.key;
                      const enabled = !!payouts[opt.key]?.is_enabled;

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setActiveMethod(opt.key)}
                          className={[
                            "flex items-center gap-2 rounded-xl border px-4 py-3 transition",
                            isActive
                              ? "border-emerald-600 bg-emerald-600 text-white shadow"
                              : "border-emerald-300 bg-white text-slate-700 hover:bg-emerald-50",
                          ].join(" ")}
                        >
                          <img src={opt.logo} alt={opt.label} className="h-5 w-auto object-contain" />
                          <span className="text-xs font-semibold">{opt.label}</span>

                          <span
                            className={[
                              "ml-2 rounded-full px-2 py-[2px] text-[10px] font-semibold",
                              enabled ? "bg-white/90 text-emerald-700" : "bg-slate-100 text-slate-600",
                            ].join(" ")}
                          >
                            {enabled ? "Enabled" : "Off"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active method fields */}
                  <div className="mt-4 rounded-2xl bg-emerald-50/60 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">
                        {payoutOptions.find((o) => o.key === activeMethod)?.label}
                      </p>

                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={!!active.is_enabled}
                          onChange={(e) =>
                            setPayouts((prev) => ({
                              ...prev,
                              [activeMethod]: { ...prev[activeMethod], is_enabled: e.target.checked },
                            }))
                          }
                          className="h-4 w-4 accent-emerald-600"
                        />
                        Enable
                      </label>
                    </div>

                    {activeMethod === "bank" ? (
                      <div className="space-y-3">
                        <TextInput
                          value={active.bank_account_title}
                          onChange={(e) =>
                            setPayouts((prev) => ({
                              ...prev,
                              bank: { ...prev.bank, bank_account_title: e.target.value },
                            }))
                          }
                          placeholder="Account Title"
                        />
                        <TextInput
                          value={active.bank_account_number}
                          onChange={(e) =>
                            setPayouts((prev) => ({
                              ...prev,
                              bank: { ...prev.bank, bank_account_number: e.target.value },
                            }))
                          }
                          placeholder="Account Number"
                        />
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <TextInput
                            value={active.bank_iban}
                            onChange={(e) =>
                              setPayouts((prev) => ({
                                ...prev,
                                bank: { ...prev.bank, bank_iban: e.target.value },
                              }))
                            }
                            placeholder="IBAN (Optional)"
                          />
                          <TextInput
                            value={active.bank_raast_id}
                            onChange={(e) =>
                              setPayouts((prev) => ({
                                ...prev,
                                bank: { ...prev.bank, bank_raast_id: e.target.value },
                              }))
                            }
                            placeholder="RAAST ID (Optional)"
                          />
                        </div>
                      </div>
                    ) : (
                      <TextInput
                        value={active.phone_number}
                        onChange={(e) =>
                          setPayouts((prev) => ({
                            ...prev,
                            [activeMethod]: { ...prev[activeMethod], phone_number: e.target.value },
                          }))
                        }
                        placeholder="Phone Number"
                      />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="rounded-full bg-emerald-600 px-12 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={discard}
                    className="rounded-full border border-emerald-400 bg-white px-10 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    Discard changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "error", message: "" })}
      />
    </div>
  );
}
