import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiJson } from "../services/apiAuth";

import individualImg from "../assets/individual.jpg";
import orgImg from "../assets/organisational.jpg";

export default function FundraiserCategory() {
  const navigate = useNavigate();
  const { isAuthed } = useAuth();

  const choose = async (type) => {
    try {
      const res = await apiJson("/api/fundraisers/start/", {
        method: "POST",
        auth: true,
        body: { fundraiser_type: type },
      });
  
      navigate(`/dashboard/my-fundraisers/${res.id}/edit`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9efee]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-center text-3xl font-bold text-emerald-700">Sign Up</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Choose the category your fundraiser best fits in
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Individual */}
          <button
            onClick={() => choose("individual")}
            className="group rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm hover:shadow-md transition text-left"
          >
            <div className="h-52 w-full rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50">
              <img
                src={individualImg}
                alt="Individual fundraiser"
                className="h-full w-full object-cover group-hover:scale-[1.02] transition"
              />
            </div>

            <div className="mt-6">
              <div className="w-full rounded-full border border-emerald-400 py-2 text-center text-emerald-700 text-sm group-hover:bg-emerald-50">
                Individual
              </div>
              <p className="mt-3 text-center text-xs text-gray-500">
                Raise funds for a personal cause
              </p>
            </div>
          </button>

          {/* Organization */}
          <button
            onClick={() => choose("organization")}
            className="group rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm hover:shadow-md transition text-left"
          >
            <div className="h-52 w-full rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50">
              <img
                src={orgImg}
                alt="Organization fundraiser"
                className="h-full w-full object-cover group-hover:scale-[1.02] transition"
              />
            </div>

            <div className="mt-6">
              <div className="w-full rounded-full border border-emerald-400 py-2 text-center text-emerald-700 text-sm group-hover:bg-emerald-50">
                Institution/Organization
              </div>
              <p className="mt-3 text-center text-xs text-gray-500">
                Raise funds for an organizational or institutional need
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
