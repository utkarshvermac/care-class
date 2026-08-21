const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="card flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-up">
    {Icon && (
      <div className="w-14 h-14 rounded-2xl bg-ink-700/70 flex items-center justify-center text-gold-500 mb-4">
        <Icon size={24} />
      </div>
    )}
    <h3 className="font-display font-semibold text-lg text-paper-100 mb-1.5">{title}</h3>
    <p className="text-sm text-paper-100/50 max-w-sm mb-5">{message}</p>
    {action}
  </div>
);

export default EmptyState;
