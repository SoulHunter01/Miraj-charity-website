import { X } from "lucide-react";

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed left-1/2 bottom-8 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-orange-500 text-white px-5 py-3 rounded-full shadow-lg">
        <span className="text-sm font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
