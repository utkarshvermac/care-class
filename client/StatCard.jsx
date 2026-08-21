const StatCard = ({ icon: Icon, label, value, sub, accent = "gold" }) => {
  const accentText = {
    gold: "text-gold-500",
    present: "text-present-400",
    absent: "text-absent-400",
    cancelled: "text-cancelled-400",
  }[accent];

  return (
    <div className="card p-5 flex items-start justify-between animate-fade-up">
      <div>
        <p className="label mb-2">{label}</p>
        <p className="font-mono text-3xl font-semibold text-paper-100">{value}</p>
        {sub && <p className="text-xs text-paper-100/45 mt-1">{sub}</p>}
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-xl bg-ink-700/70 flex items-center justify-center ${accentText}`}>
          <Icon size={18} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
