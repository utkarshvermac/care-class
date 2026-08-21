import { Check, X, Ban } from "lucide-react";

const OPTIONS = [
  { value: "present", label: "Present", Icon: Check, active: "bg-present-500 text-ink-950 border-present-500", idle: "border-ink-600 text-paper-100/60 hover:border-present-500/50 hover:text-present-400" },
  { value: "absent", label: "Absent", Icon: X, active: "bg-absent-500 text-ink-950 border-absent-500", idle: "border-ink-600 text-paper-100/60 hover:border-absent-500/50 hover:text-absent-400" },
  { value: "cancelled", label: "Cancelled", Icon: Ban, active: "bg-cancelled-500 text-ink-950 border-cancelled-500", idle: "border-ink-600 text-paper-100/60 hover:border-cancelled-500/50 hover:text-cancelled-400" },
];

const StatusPill = ({ value, onChange, disabled }) => (
  <div className="flex items-center gap-1.5">
    {OPTIONS.map(({ value: v, label, Icon, active, idle }) => (
      <button
        key={v}
        type="button"
        disabled={disabled}
        onClick={() => onChange(value === v ? null : v)}
        title={label}
        className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-150 active:scale-90 disabled:opacity-40 ${
          value === v ? active : idle
        }`}
      >
        <Icon size={16} strokeWidth={2.5} />
      </button>
    ))}
  </div>
);

export default StatusPill;
