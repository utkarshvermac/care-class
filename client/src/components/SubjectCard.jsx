import { MoreVertical, Trash2, Settings2 } from "lucide-react";
import { useState } from "react";
import BunkMeter from "./BunkMeter.jsx";
import StatusPill from "./StatusPill.jsx";

const SubjectCard = ({ subject, todayStatus, onMark, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="card p-5 animate-fade-up group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0"
            style={{ backgroundColor: `${subject.color}22`, color: subject.color }}
          >
            {subject.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-paper-100 truncate">{subject.name}</h3>
            {subject.code && <p className="text-xs text-paper-100/40">{subject.code}</p>}
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="btn-ghost p-1.5 rounded-lg opacity-60 group-hover:opacity-100"
            aria-label="Subject options"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 w-40 card p-1.5">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(subject);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-paper-100/80 hover:bg-ink-700/60"
                >
                  <Settings2 size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(subject);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-absent-400 hover:bg-absent-500/10"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <BunkMeter stats={subject.stats} />

      <div className="mt-4 pt-4 border-t border-ink-700/50 flex items-center justify-between">
        <span className="text-xs text-paper-100/45">Mark today</span>
        <StatusPill value={todayStatus} onChange={(status) => onMark(subject._id, status)} />
      </div>
    </div>
  );
};

export default SubjectCard;
