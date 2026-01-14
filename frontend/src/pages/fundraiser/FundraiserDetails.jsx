import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiJson, apiForm } from "../../services/apiAuth";

export default function FundraiserDetails() {
  const navigate = useNavigate();
  const { fundraiserId } = useParams();

  const [loading, setLoading] = useState(false);
  const [savingDesc, setSavingDesc] = useState(false);

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [documents, setDocuments] = useState([]); // {id, file, uploaded_at} depending on serializer
  const [errorMsg, setErrorMsg] = useState("");

  // OPTIONAL: load existing fundraiser data (so refresh doesn't lose state)
  useEffect(() => {
    (async () => {
      try {
        // Use your existing detail endpoint:
        const data = await apiJson(`/api/auth/fundraisers/${fundraiserId}/`, {
          method: "GET",
          auth: true,
        });

        setDescription(data.description || "");
        setImageUrl(data.image || "");
        setDocuments(data.documents || []);
      } catch (e) {
        // it's okay if your detail serializer doesn't include docs/image yet
      }
    })();
  }, [fundraiserId]);

  const uploadCover = async (file) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);

      const data = await apiForm(`/api/auth/fundraisers/${fundraiserId}/edit/cover/`, {
        method: "POST",
        auth: true,
        formData: fd,
      });

      // your cover upload view returns FundraiserEditSerializer data
      setImageUrl(data.image || "");
    } catch (e) {
      setErrorMsg(e.message || "Cover upload failed");
    } finally {
      setLoading(false);
    }
  };

  const saveDescription = async () => {
    setErrorMsg("");
    setSavingDesc(true);
    try {
      await apiJson(`/api/auth/fundraisers/${fundraiserId}/details/`, {
        method: "PATCH",
        auth: true,
        body: { description },
      });
    } catch (e) {
      setErrorMsg(e.message || "Failed to save description");
    } finally {
      setSavingDesc(false);
    }
  };

  const uploadDoc = async (file) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const doc = await apiForm(`/api/auth/fundraisers/${fundraiserId}/edit/documents/`, {
        method: "POST",
        auth: true,
        formData: fd,
      });

      // your endpoint returns the created doc serializer
      setDocuments((prev) => [doc, ...prev]);
    } catch (e) {
      setErrorMsg(e.message || "Document upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteDoc = async (docId) => {
    setErrorMsg("");
    setLoading(true);
    try {
      await apiJson(`/api/auth/fundraisers/${fundraiserId}/edit/documents/${docId}/`, {
        method: "DELETE",
        auth: true,
      });
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (e) {
      setErrorMsg(e.message || "Failed to delete document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9efee]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-center text-3xl font-bold text-emerald-700">Fundraiser Details</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          In the description, add details you have not mentioned elsewhere
        </p>

        {/* Progress */}
        <div className="mt-8 flex justify-center">
          <div className="h-2 w-72 rounded-full bg-emerald-200 overflow-hidden">
            <div className="h-full w-1/2 bg-emerald-600" />
          </div>
        </div>

        {errorMsg && (
          <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upload image */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Upload Image (Optional)</h3>
            <p className="mt-1 text-xs text-gray-500">
              Upload a representative picture that best describes your fundraiser
            </p>

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 h-64 flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="Fundraiser cover" className="h-full w-full object-cover" />
              ) : (
                <div className="text-emerald-400 text-sm">No image</div>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <label className="cursor-pointer rounded-full bg-emerald-600 px-8 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60">
                {loading ? "Uploading..." : "Upload picture"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadCover(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Add description</h3>
            <p className="mt-1 text-xs text-gray-500">
              Add details you have not mentioned elsewhere. The more they know about your cause the more they can help.
            </p>

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-white p-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description"
                className="h-48 w-full resize-none outline-none text-sm"
              />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={saveDescription}
                  disabled={savingDesc}
                  className="rounded-full bg-emerald-600 px-10 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
                >
                  {savingDesc ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting documents */}
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-700">Add Supporting Documents</h3>
          <p className="mt-1 text-xs text-gray-500">
            Add supporting documents to increase the credibility of your fundraiser.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <label className="cursor-pointer rounded-lg bg-emerald-100 px-4 py-2 text-xs text-emerald-800 hover:bg-emerald-200">
              Add Fee Challan
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadDoc(file);
                  e.target.value = "";
                }}
              />
            </label>

            <label className="cursor-pointer rounded-lg bg-emerald-100 px-4 py-2 text-xs text-emerald-800 hover:bg-emerald-200">
              Add Proof of Payment
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadDoc(file);
                  e.target.value = "";
                }}
              />
            </label>

            <label className="cursor-pointer rounded-lg bg-emerald-100 px-4 py-2 text-xs text-emerald-800 hover:bg-emerald-200">
              Add Registration Certificate
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadDoc(file);
                  e.target.value = "";
                }}
              />
            </label>

            <label className="cursor-pointer rounded-lg bg-emerald-100 px-4 py-2 text-xs text-emerald-800 hover:bg-emerald-200">
              Add Pictures
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadDoc(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {/* Uploaded docs list */}
          <div className="mt-5 space-y-2">
            {documents.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-emerald-200 bg-white px-4 py-2"
              >
                <a
                  href={d.file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-700 hover:underline truncate max-w-[70%]"
                >
                  {d.file}
                </a>

                <button
                  onClick={() => deleteDoc(d.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Next */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => navigate(`/fundraisers/${fundraiserId}/link-previous`)}
            className="rounded-full border border-emerald-500 px-10 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
