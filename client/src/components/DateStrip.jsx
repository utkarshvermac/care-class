import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { todayISO } from "../utils/bunkCalc.js";

const toISO = (d) => {
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d - tzOffset).toISOString().slice(0, 10);
};

const DateStrip = ({ selectedDate, onSelect }) => {
  const today = new Date(todayISO() + "T00:00:00");
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  const shiftDate = (delta) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + delta);
    onSelect(toISO(d));
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => shiftDate(-1)} className="btn-ghost p-2 rounded-lg shrink-0" aria-label="Previous day">
        <ChevronLeft size={16} />
      </button>

      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {days.map((d) => {
          const iso = toISO(d);
          const isSelected = iso === selectedDate;
          const isToday = iso === todayISO();
          return (
            <button
              key={iso}
              onClick={() => onSelect(iso)}
              className={`flex flex-col items-center justify-center min-w-[52px] py-2 rounded-xl transition-colors shrink-0 ${
                isSelected
                  ? "bg-gold-500 text-ink-950"
                  : "bg-ink-700/50 text-paper-100/70 hover:bg-ink-700"
              }`}
            >
              <span className="text-[10px] font-medium uppercase opacity-80">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="text-sm font-mono font-semibold">{d.getDate()}</span>
              {isToday && !isSelected && <span className="w-1 h-1 rounded-full bg-gold-500 mt-0.5" />}
            </button>
          );
        })}
      </div>

      <input
        type="date"
        value={selectedDate}
        max={todayISO()}
        onChange={(e) => onSelect(e.target.value)}
        className="hidden sm:block bg-transparent text-paper-100/50 text-xs w-0 opacity-0 absolute"
        id="date-jump"
      />
      <label
        htmlFor="date-jump"
        className="btn-ghost p-2 rounded-lg shrink-0 cursor-pointer"
        title="Jump to date"
      >
        <Calendar size={16} />
      </label>

      <button onClick={() => shiftDate(1)} className="btn-ghost p-2 rounded-lg shrink-0" aria-label="Next day">
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default DateStrip;
