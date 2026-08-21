import { statusMeta } from "../utils/bunkCalc.js";

const colorMap = {
  present: { bar: "bg-present-500", text: "text-present-400", dot: "bg-present-500" },
  gold: { bar: "bg-gold-500", text: "text-gold-500", dot: "bg-gold-500" },
  absent: { bar: "bg-absent-500", text: "text-absent-400", dot: "bg-absent-500" },
};

/**
 * The Bunk-O-Meter: a horizontal instrument bar rather than a generic
 * progress ring. A tick mark shows the target threshold; the fill shows
 * live percentage; the mono readout on the right is the number that
 * actually matters — safe skips left, or classes owed to recover.
 */
const BunkMeter = ({ stats, size = "md" }) => {
  const { percentage, target, safeBunks, mustAttend, status } = stats;
  const meta = statusMeta[status];
  const colors = colorMap[meta.color];
  const fillWidth = Math.min(100, Math.max(0, percentage));
  const height = size === "lg" ? "h-3" : "h-2";

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-mono font-semibold ${size === "lg" ? "text-2xl" : "text-lg"} ${colors.text}`}>
            {percentage.toFixed(1)}%
          </span>
          <span className="text-xs text-paper-100/40 font-mono">/ {target}%</span>
        </div>
        <span className={`text-xs font-semibold flex items-center gap-1 ${colors.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {meta.label}
        </span>
      </div>

      <div className={`relative w-full ${height} rounded-full bg-meter-track overflow-hidden`}>
        {/* target threshold tick */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-paper-100/50 z-10"
          style={{ left: `${Math.min(98, target)}%` }}
          title={`Target: ${target}%`}
        />
        <div
          className={`h-full rounded-full ${colors.bar} origin-left animate-needle-in transition-all duration-500`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>

      <div className="mt-1.5 text-xs font-mono text-paper-100/55">
        {mustAttend > 0 ? (
          <span>
            Attend next <span className="text-absent-400 font-semibold">{mustAttend}</span> in a row to recover
          </span>
        ) : (
          <span>
            Safe to skip <span className={`font-semibold ${colors.text}`}>{safeBunks === Infinity ? "∞" : safeBunks}</span> more{" "}
            {safeBunks === 1 ? "class" : "classes"}
          </span>
        )}
      </div>
    </div>
  );
};

export default BunkMeter;
