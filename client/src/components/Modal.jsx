import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ open, onClose, title, children, footer }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm animate-fade-up"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md card rounded-b-none sm:rounded-2xl p-6 animate-fade-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-lg text-paper-100">{title}</h3>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
