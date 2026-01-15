export default function FundraiserSuccessModal({
    open,
    fundraiser,
    onClose,
    onDonate,
    onViewSimilar,
  }) {
    if (!open) return null;
  
    const shareUrl =
      typeof window !== "undefined" ? `${window.location.origin}/discover` : "";
  
    const copyLink = async () => {
      try {
        const link = `${window.location.origin}/fundraisers/${fundraiser?.id}`;
        await navigator.clipboard.writeText(link);
        alert("Link copied!");
      } catch {
        alert("Could not copy link");
      }
    };
  
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
  
        <div className="relative w-[95%] max-w-3xl rounded-2xl bg-white shadow-xl overflow-hidden">
          {/* close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
  
          <div className="p-8 bg-emerald-50">
            <h2 className="text-center text-2xl font-bold text-emerald-700">
              Good job! You have successfully set <br /> up your fundraiser
            </h2>
  
            <div className="mt-6 flex justify-center">
              <div className="w-72 h-44 rounded-xl overflow-hidden border border-emerald-200 bg-white">
                {fundraiser?.image ? (
                  <img
                    src={fundraiser.image}
                    alt={fundraiser.title || "Fundraiser"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                    No image
                  </div>
                )}
              </div>
            </div>
  
            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-md rounded-xl border border-emerald-200 bg-white p-4 text-center">
                <div className="text-xs text-gray-500">
                  Donating to your own fundraiser encourages others to donate too
                </div>
  
                <button
                  type="button"
                  onClick={onDonate}
                  className="mt-3 rounded-full bg-sky-500 px-6 py-2 text-white text-sm hover:bg-sky-600"
                >
                  Donate to fundraiser
                </button>
              </div>
            </div>
  
            <div className="mt-6 text-center">
              <div className="text-xs font-semibold text-gray-700">Share Fundraiser</div>
  
              <div className="mt-2 flex justify-center gap-3 text-gray-600">
                {/* simple icons as buttons (you can replace with real icons later) */}
                <button type="button" onClick={copyLink} className="text-sm hover:text-emerald-700">
                  Copy Link
                </button>
  
                <a
                  className="text-sm hover:text-emerald-700"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                >
                  Facebook
                </a>
  
                <a
                  className="text-sm hover:text-emerald-700"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                >
                  X
                </a>
  
                <a
                  className="text-sm hover:text-emerald-700"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                >
                  WhatsApp
                </a>
              </div>
            </div>
  
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onViewSimilar}
                className="text-xs text-emerald-700 hover:underline"
              >
                View Similar Fundraisers &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  