import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiJson } from "../../services/apiAuth";

const PURPOSES = [
  { value: "child_student", label: "Support a child/student" },
  { value: "institution", label: "Support an institution" },
  { value: "organization", label: "Support an organization" },
];

const GENDERS = ["Male", "Female", "Other"];

const EDUCATION_LEVELS = ["Primary", "Secondary", "Senior", "Undergraduate", "Graduate"];

const INSTITUTION_TYPES = ["School", "College", "Library", "University", "NGO", "Hospital", "Other"];

export default function StartFundraiserDetails() {
  const navigate = useNavigate();
  const { fundraiserId } = useParams();

  const [purpose, setPurpose] = useState("");
  const [doneeName, setDoneeName] = useState("");
  const [gender, setGender] = useState("");
  const [educationLevel, setEducationLevel] = useState("");

  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isChild = useMemo(() => purpose === "child_student", [purpose]);
  const isInstitution = useMemo(
    () => purpose === "institution" || purpose === "organization",
    [purpose]
  );

  const onNext = async () => {
    setErrors({});
    setLoading(true);

    try {
      const payload = {
        fundraiser_purpose: purpose,

        donee_name: doneeName,
        donee_gender: gender,
        donee_education_level: educationLevel,

        institution_name: institutionName,
        institution_type: institutionType,
        institution_registration_number: registrationNumber,
      };

      await apiJson(`/api/auth/fundraisers/${fundraiserId}/start-details/`, {
        method: "PATCH",
        auth: true,
        body: payload,
      });

      // Go to your existing edit fundraiser page
      navigate(`/fundraisers/${fundraiserId}/basic`);
    } catch (e) {
      // DRF usually returns field errors as {field: ["msg"]}
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

        {/* progress bar (simple like screenshot) */}
        <div className="mt-8 flex justify-center">
          <div className="h-2 w-56 rounded-full bg-emerald-200 overflow-hidden">
            <div className="h-full w-1/4 bg-emerald-600" />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-xl space-y-4">
            {errors.general && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            {/* Type of fundraiser */}
            <div>
              <div className="relative">
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Type of fundraiser</option>
                  {PURPOSES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.fundraiser_purpose && (
                <p className="mt-1 text-xs text-red-600">{errors.fundraiser_purpose}</p>
              )}
            </div>

            {/* Child/student fields */}
            {isChild && (
              <>
                <div>
                  <input
                    value={doneeName}
                    onChange={(e) => setDoneeName(e.target.value)}
                    placeholder="Name of donee"
                    className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  {errors.donee_name && <p className="mt-1 text-xs text-red-600">{errors.donee_name}</p>}
                </div>

                <div>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Gender (Optional)</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {errors.donee_gender && <p className="mt-1 text-xs text-red-600">{errors.donee_gender}</p>}
                </div>

                <div>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Education level</option>
                    {EDUCATION_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                  {errors.donee_education_level && (
                    <p className="mt-1 text-xs text-red-600">{errors.donee_education_level}</p>
                  )}
                </div>
              </>
            )}

            {/* Institution/organization fields */}
            {isInstitution && (
              <>
                <div>
                  <input
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="Name of institution"
                    className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  {errors.institution_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.institution_name}</p>
                  )}
                </div>

                <div>
                  <select
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.target.value)}
                    className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Type of institution</option>
                    {INSTITUTION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.institution_type && (
                    <p className="mt-1 text-xs text-red-600">{errors.institution_type}</p>
                  )}
                </div>

                <div>
                  <input
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="Registration Number of institution"
                    className="w-full rounded-full border border-emerald-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  {errors.institution_registration_number && (
                    <p className="mt-1 text-xs text-red-600">{errors.institution_registration_number}</p>
                  )}
                </div>
              </>
            )}

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
