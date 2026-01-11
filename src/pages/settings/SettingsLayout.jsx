import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const resolveAvatar = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  if (avatar.startsWith("/media/")) return `${API_BASE}${avatar}`;
  return avatar;
};

export default function SettingsLayout({ active, children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const avatarUrl = resolveAvatar(user?.avatar);

  const items = [
    { label: "Account settings", path: "/settings/account" },
    { label: "Privacy settings", path: "/settings/privacy" },
    { label: "Notification settings", path: "/settings/notifications" },
  ];

  return (
    <div className="min-h-screen bg-[#eaf6ff] flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex gap-6">
            <aside className="w-[260px] min-w-[260px] rounded-xl bg-[#d9ecff] p-5 shadow-lg">
              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-white ring-2 ring-emerald-300">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-emerald-600">
                      <User className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-800">{user?.username || "User"}</p>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="text-left text-sm text-emerald-700 hover:underline"
                >
                  &lt; Settings
                </button>

                {items.map((it) => {
                  const isActive = it.label === active;
                  return (
                    <button
                      key={it.label}
                      onClick={() => navigate(it.path)}
                      className={[
                        "w-full rounded-full px-4 py-2 text-left text-sm transition",
                        isActive
                          ? "bg-emerald-600 text-white shadow"
                          : "bg-white text-slate-700 hover:bg-emerald-50",
                      ].join(" ")}
                    >
                      {it.label}
                    </button>
                  );
                })}
              </div>
            </aside>

            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
