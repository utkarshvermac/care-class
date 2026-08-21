import { Link } from "react-router-dom";
import { ArrowRight, Gauge, CalendarClock, ShieldCheck, Download, Linkedin, Instagram } from "lucide-react";
import Logo from "../components/Logo.jsx";
import BunkMeter from "../components/BunkMeter.jsx";
import { computeSubjectStats } from "../utils/bunkCalc.js";

const demoStats = computeSubjectStats(34, 9, 75);

const FEATURES = [
  {
    Icon: Gauge,
    title: "The Bunk-O-Meter",
    text: "Not just a percentage. A live instrument that tells you exactly how many classes you can still skip — or how many you owe to recover.",
  },
  {
    Icon: CalendarClock,
    title: "Built for real timetables",
    text: "Classes get cancelled, extras get added. Mark a class Cancelled and it's dropped from the math entirely — you're never penalized for a day off you didn't choose.",
  },
  {
    Icon: ShieldCheck,
    title: "Per-subject targets",
    text: "75% is the default, not the law. Set a stricter target for that one professor who actually takes attendance seriously.",
  },
  {
    Icon: Download,
    title: "Your data, exportable",
    text: "Pull your full attendance history as CSV or JSON whenever you want it — for a grievance letter, a spreadsheet, or just peace of mind.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-ink-900 bg-gold-glow">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm hidden sm:inline-flex">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get started <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-gold-500 bg-gold-500/10 px-3 py-1.5 rounded-full mb-6">
            Built for the 75% rule
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold leading-[1.08] text-paper-100 mb-5">
            Know exactly how many classes you can skip —{" "}
            <span className="text-gold-500">before</span> you skip them.
          </h1>
          <p className="text-paper-100/60 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            CARE CLASS turns your attendance register into a real-time instrument. Log Present,
            Absent, or Cancelled for every class, and watch your safe-bunk count update instantly —
            per subject, down to the last class.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/register" className="btn-primary">
              Start tracking free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="card p-6 animate-fade-up [animation-delay:150ms]">
          <p className="label mb-4">Live preview — Data Structures</p>
          <BunkMeter stats={demoStats} size="lg" />
          <div className="mt-6 pt-6 border-t border-ink-700/50 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-mono text-xl font-semibold text-present-400">34</p>
              <p className="text-[11px] text-paper-100/40 mt-0.5">Present</p>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold text-absent-400">9</p>
              <p className="text-[11px] text-paper-100/40 mt-0.5">Absent</p>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold text-cancelled-400">3</p>
              <p className="text-[11px] text-paper-100/40 mt-0.5">Cancelled</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map(({ Icon, title, text }, i) => (
            <div key={title} className="card p-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-500 flex items-center justify-center mb-4">
                <Icon size={18} />
              </div>
              <h3 className="font-display font-semibold text-paper-100 mb-1.5">{title}</h3>
              <p className="text-sm text-paper-100/55 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-700/60">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-paper-100/40">
            CARE CLASS — designed & built by Utkarsh Verma
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/utkarshvermac"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-ink-700/60 flex items-center justify-center text-paper-100/60 hover:text-gold-500 hover:bg-ink-600 transition-colors"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://www.instagram.com/utkarshvermac"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-ink-700/60 flex items-center justify-center text-paper-100/60 hover:text-gold-500 hover:bg-ink-600 transition-colors"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
