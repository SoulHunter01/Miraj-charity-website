import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, UserCircle } from "lucide-react";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import { apiForm } from "../services/apiAuth";

export default function SignupPhotoPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const showError = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      showError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showError("Image size must be less than 3MB.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSkip = async () => {
    navigate("/");
  };

  const handleContinue = async () => {
    if (!selectedFile) {
      showError("Please select an image first or press Skip.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", selectedFile); // must match Django view (request.FILES.get("avatar"))

      await apiForm("/api/auth/me/avatar/", { formData: fd, auth: true });
      navigate("/");
    } catch (err) {
      if (err.status === 401) showError("Session expired. Please login again.");
      else showError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Toast message={toast} onClose={() => setToast("")} />

      <main className="bg-emerald-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">Sign up</h1>

            <p className="text-sm text-gray-600 max-w-xl mx-auto mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id proin a purus odio, vitae sit.
              Hendrerit vel dolor et scelerisque at turpis.
            </p>

            <div className="flex justify-center gap-2 mb-10">
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-14 rounded-full bg-emerald-500" />
              <span className="h-1.5 w-14 rounded-full bg-sky-400/70" />
              <span className="h-1.5 w-14 rounded-full bg-sky-400/70" />
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-28 h-28 rounded-full border-2 border-emerald-300 bg-white flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-16 h-16 text-emerald-400" />
                )}
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={onFileChange}
            />

            <div className="flex justify-center gap-4 mt-6">
              {!preview ? (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 px-6"
                    onClick={onPickFile}
                    type="button"
                  >
                    Upload Picture
                    <Upload className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50 px-10"
                    onClick={handleSkip}
                    type="button"
                  >
                    Skip
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 px-8"
                    onClick={handleContinue}
                    type="button"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Continue"}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50 px-8"
                    onClick={onPickFile}
                    type="button"
                    disabled={uploading}
                  >
                    Change
                  </Button>
                </>
              )}
            </div>

            <div className="mt-10 text-sm text-gray-600">
              Want to go back?{" "}
              <button
                className="text-emerald-700 font-semibold hover:underline"
                onClick={() => navigate("/signup2")}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
