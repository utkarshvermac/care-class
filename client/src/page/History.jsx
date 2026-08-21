import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Download, FileJson, FileSpreadsheet } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";
import { todayISO } from "../utils/bunkCalc.js";

const pad = (n) => String(n).padStart(2, "0");
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

const HistoryPage = () => {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [logsByDate, setLogsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [exporting, setExporting] = useState(false);

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const start = toISO(cursor.year, cursor.month, 1);
        const end = toISO(cursor.year, cursor.month, daysInMonth);
        const { data } = await api.get("/attendance/range", { params: { start, end } });
        const grouped = {};
        data.logs.forEach((l) => {
          if (!grouped[l.date]) grouped[l.date] = [];
          grouped[l.date].push(l);
        });
        setLogsByDate(grouped);
      } catch {
        toast.error("Couldn't load attendance history");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  const cells = useMemo(() => {
    const arr = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstWeekday, daysInMonth]);

  const dayDots = (iso) => {
    const logs = logsByDate[iso] || [];
    const counts = { present: 0, absent: 0, cancelled: 0 };
    logs.forEach((l) => counts[l.status]++);
    return counts;
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const { data } = await api.get("/attendance/export", {
        params: { format },
        responseType: format === "csv" ? "blob" : "json",
      });
      const blob =
        format === "csv"
          ? data
          : new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `careclass-attendance.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const selectedLogs = selectedDay ? logsByDate[selectedDay] || [] : [];

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-display font-bold text-paper-100">History</h1>
          <p className="text-sm text-paper-100/50 mt-0.5">Browse past logs, month by month.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport("csv")} disabled={exporting} className="btn-secondary text-sm">
            <FileSpreadsheet size={15} /> CSV
          </button>
          <button onClick={() => handleExport("json")} disabled={exporting} className="btn-secondary text-sm">
            <FileJson size={15} /> JSON
          </button>
        </div>
      </div>

      <div className="card p-5 mb-6 animate-fade-up">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))}
            className="btn-ghost p-2 rounded-lg"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="font-display font-semibold text-paper-100">{monthLabel}</h2>
          <button
            onClick={() => setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))}
            className="btn-ghost p-2 rounded-lg"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-[11px] font-semibold text-paper-100/35 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className={`grid grid-cols-7 gap-1.5 ${loading ? "opacity-40" : ""}`}>
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const iso = toISO(cursor.year, cursor.month, day);
            const counts = dayDots(iso);
            const hasLogs = counts.present + counts.absent + counts.cancelled > 0;
            const isToday = iso === todayISO();
            const isFuture = iso > todayISO();

            return (
              <button
                key={i}
                disabled={isFuture}
                onClick={() => setSelectedDay(iso)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-sm transition-colors disabled:opacity-25 disabled:cursor-not-allowed ${
                  selectedDay === iso
                    ? "bg-gold-500 text-ink-950 font-semibold"
                    : isToday
                    ? "bg-ink-700 text-gold-500 font-semibold ring-1 ring-gold-500/40"
                    : hasLogs
                    ? "bg-ink-700/50 text-paper-100 hover:bg-ink-700"
                    : "text-paper-100/40 hover:bg-ink-700/40"
                }`}
              >
                <span className="font-mono">{day}</span>
                {hasLogs && (
                  <span className="flex gap-0.5">
                    {counts.present > 0 && <span className="w-1 h-1 rounded-full bg-present-500" />}
                    {counts.absent > 0 && <span className="w-1 h-1 rounded-full bg-absent-500" />}
                    {counts.cancelled > 0 && <span className="w-1 h-1 rounded-full bg-cancelled-500" />}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="card p-5 animate-fade-up">
          <h3 className="font-display font-semibold text-paper-100 mb-4">
            {new Date(selectedDay + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          {selectedLogs.length === 0 ? (
            <p className="text-sm text-paper-100/45">No attendance logged for this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedLogs.map((l) => (
                <div key={l._id} className="flex items-center justify-between py-2 border-b border-ink-700/40 last:border-0">
                  <span className="text-sm text-paper-100/80">{l.subject?.name || "Deleted subject"}</span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      l.status === "present"
                        ? "bg-present-500/15 text-present-400"
                        : l.status === "absent"
                        ? "bg-absent-500/15 text-absent-400"
                        : "bg-cancelled-500/15 text-cancelled-400"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default HistoryPage;
