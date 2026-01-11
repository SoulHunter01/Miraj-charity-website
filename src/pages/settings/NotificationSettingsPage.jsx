
import { useEffect, useState } from "react";
import SettingsLayout from "./SettingsLayout";
import { apiJson } from "../../services/apiAuth";

function CheckRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-emerald-600"
      />
      <span>{label}</span>
    </label>
  );
}

export default function NotificationSettingsPage() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await apiJson("/api/auth/settings/notifications/", { auth: true });
      setData(res);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await apiJson("/api/auth/settings/notifications/", {
        method: "PATCH",
        auth: true,
        body: data,
      });
      setData(res);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <SettingsLayout active="Notification settings"><div className="bg-white p-8 rounded-2xl shadow">Loading...</div></SettingsLayout>;

  return (
    <SettingsLayout active="Notification settings">
      <div className="rounded-2xl bg-white/70 p-10 shadow-lg">
        <h1 className="text-center text-3xl font-extrabold text-emerald-700">Notification Settings</h1>

        <div className="mt-6 rounded-2xl bg-emerald-50/60 p-6">
          <p className="text-sm font-semibold text-slate-800">Select the emails you wish to receive</p>
          <div className="mt-3 space-y-2">
            <CheckRow label="Fundraiser related emails (created, published, closed)"
              checked={data.email_fundraiser_updates}
              onChange={(v) => setData((p) => ({ ...p, email_fundraiser_updates: v }))}
            />
            <CheckRow label="Donation Received"
              checked={data.email_donation_received}
              onChange={(v) => setData((p) => ({ ...p, email_donation_received: v }))}
            />
            <CheckRow label="Messages from Donor"
              checked={data.email_messages_from_donor}
              onChange={(v) => setData((p) => ({ ...p, email_messages_from_donor: v }))}
            />
            <CheckRow label="Connected fundraisers created"
              checked={data.email_connected_fundraisers}
              onChange={(v) => setData((p) => ({ ...p, email_connected_fundraisers: v }))}
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-800">Select the messages you wish to receive</p>
            <div className="mt-3 space-y-2">
              <CheckRow label="Fundraiser related messages (created, published, closed)"
                checked={data.msg_fundraiser_updates}
                onChange={(v) => setData((p) => ({ ...p, msg_fundraiser_updates: v }))}
              />
              <CheckRow label="Donation Received"
                checked={data.msg_donation_received}
                onChange={(v) => setData((p) => ({ ...p, msg_donation_received: v }))}
              />
              <CheckRow label="Donation confirmation"
                checked={data.msg_donation_confirmation}
                onChange={(v) => setData((p) => ({ ...p, msg_donation_confirmation: v }))}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-full border border-emerald-400 bg-white px-10 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
