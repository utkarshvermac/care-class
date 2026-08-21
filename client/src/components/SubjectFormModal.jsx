import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";

const SWATCHES = ["#E8B84B", "#3DD68C", "#5AA9F0", "#F1637A", "#B48CF2", "#F2946D", "#6C7A99"];

const emptyForm = { name: "", code: "", targetPercentage: 75, color: SWATCHES[0] };

const SubjectFormModal = ({ open, onClose, onSubmit, initialData, defaultTarget = 75 }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              name: initialData.name,
              code: initialData.code || "",
              targetPercentage: initialData.targetPercentage,
              color: initialData.color,
            }
          : { ...emptyForm, targetPercentage: defaultTarget }
      );
    }
  }, [open, initialData, defaultTarget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Edit subject" : "Add a subject"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label block mb-1.5">Subject name</label>
          <input
            className="input"
            placeholder="e.g. Data Structures"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            autoFocus
            required
          />
        </div>
        <div>
          <label className="label block mb-1.5">Course code (optional)</label>
          <input
            className="input"
            placeholder="e.g. CS204"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
          />
        </div>
        <div>
          <label className="label block mb-1.5">
            Target attendance — <span className="text-gold-500">{form.targetPercentage}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={form.targetPercentage}
            onChange={(e) => setForm((f) => ({ ...f, targetPercentage: Number(e.target.value) }))}
            className="w-full accent-gold-500"
          />
        </div>
        <div>
          <label className="label block mb-2">Color tag</label>
          <div className="flex items-center gap-2">
            {SWATCHES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                className={`w-7 h-7 rounded-full transition-transform ${
                  form.color === c ? "ring-2 ring-offset-2 ring-offset-ink-800 ring-paper-100 scale-110" : ""
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Choose color ${c}`}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? "Saving…" : initialData ? "Save changes" : "Add subject"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubjectFormModal;
