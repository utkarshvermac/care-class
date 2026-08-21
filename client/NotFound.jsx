import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";

const NotFound = () => (
  <div className="min-h-screen bg-ink-900 bg-gold-glow flex flex-col items-center justify-center px-6 text-center">
    <Logo className="mb-8" />
    <p className="font-mono text-6xl font-bold text-gold-500 mb-3">404</p>
    <h1 className="font-display text-xl font-semibold text-paper-100 mb-2">Page not found</h1>
    <p className="text-sm text-paper-100/50 mb-6 max-w-xs">
      This one wasn't on the timetable. Let's get you back.
    </p>
    <Link to="/" className="btn-primary">
      Back to home
    </Link>
  </div>
);

export default NotFound;
