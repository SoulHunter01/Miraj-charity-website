export default function ConfirmModal({ open, title, message, confirmText="OK", cancelText="Cancel", onConfirm, onClose }) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
  
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onClose();
                onConfirm?.();
              }}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  }
  