const Logo = ({ size = 34, showWordmark = true, className = "" }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="shrink-0">
      <rect width="64" height="64" rx="16" className="fill-ink-800" />
      <path d="M14 40a18 18 0 0 1 36 0" stroke="#232B45" strokeWidth="6" strokeLinecap="round" />
      <path
        d="M14 40a18 18 0 0 1 27-15.6"
        stroke="#E8B84B"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="32" cy="40" r="3.5" fill="#F5F3ED" />
      <path d="M32 40 L42 27" stroke="#F5F3ED" strokeWidth="3" strokeLinecap="round" />
    </svg>
    {showWordmark && (
      <span className="font-display font-bold text-lg tracking-tight text-paper-100">
        CARE<span className="text-gold-500">CLASS</span>
      </span>
    )}
  </div>
);

export default Logo;
