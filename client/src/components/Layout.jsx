import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  History,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Linkedin,
  Instagram,
} from "lucide-react";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/subjects", label: "Subjects", Icon: BookOpen },
  { to: "/history", label: "History", Icon: History },
  { to: "/analytics", label: "Analytics", Icon: BarChart3 },
  { to: "/settings", label: "Settings", Icon: Settings },
];

const SocialLinks = ({ className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <a
      href="https://www.linkedin.com/in/utkarshvermac"
      target="_blank"
      rel="noopener noreferrer"
      title="Utkarsh Verma on LinkedIn"
      className="w-8 h-8 rounded-lg bg-ink-700/70 flex items-center justify-center text-paper-100/60 hover:text-gold-500 hover:bg-ink-600 transition-colors"
    >
      <Linkedin size={15} />
    </a>
    <a
      href="https://www.instagram.com/utkarshvermac"
      target="_blank"
      rel="noopener noreferrer"
      title="Utkarsh Verma on Instagram"
      className="w-8 h-8 rounded-lg bg-ink-700/70 flex items-center justify-center text-paper-100/60 hover:text-gold-500 hover:bg-ink-600 transition-colors"
    >
      <Instagram size={15} />
    </a>
  </div>
);

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-ink-900 light:bg-paper-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-ink-700/60 p-5 sticky top-0 h-screen">
        <Logo />
        <nav className="mt-8 flex-1 space-y-1">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gold-500/12 text-gold-500"
                    : "text-paper-100/60 hover:text-paper-100 hover:bg-ink-700/50"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-700/60 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-display font-semibold text-sm text-ink-950 shrink-0"
              style={{ backgroundColor: user?.avatarColor || "#E8B84B" }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-paper-100 truncate">{user?.name}</p>
              <p className="text-xs text-paper-100/45 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost flex-1 !justify-start px-3 py-2 text-xs">
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
          <button onClick={handleLogout} className="btn-ghost w-full !justify-start px-3 py-2 text-xs text-absent-400 hover:bg-absent-500/10">
            <LogOut size={15} />
            Sign out
          </button>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-paper-100/35">Built by Utkarsh Verma</span>
            <SocialLinks />
          </div>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 bg-ink-900/90 backdrop-blur border-b border-ink-700/60">
        <Logo size={28} />
        <button onClick={() => setMobileOpen(true)} className="btn-ghost p-2" aria-label="Open menu">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-ink-800 border-l border-ink-700/60 p-5 flex flex-col animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <Logo size={28} />
              <button onClick={() => setMobileOpen(false)} className="btn-ghost p-2" aria-label="Close menu">
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-1 flex-1">
              {NAV_ITEMS.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium ${
                      isActive ? "bg-gold-500/12 text-gold-500" : "text-paper-100/70"
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
            <button onClick={toggleTheme} className="btn-secondary w-full mb-2 !justify-start">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <button onClick={handleLogout} className="btn-danger w-full !justify-start mb-4">
              <LogOut size={16} />
              Sign out
            </button>
            <div className="flex items-center justify-between border-t border-ink-700/60 pt-4">
              <span className="text-[11px] text-paper-100/35">Utkarsh Verma</span>
              <SocialLinks />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-ink-900/95 backdrop-blur border-t border-ink-700/60 flex items-center justify-around py-2">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-medium ${
                isActive ? "text-gold-500" : "text-paper-100/45"
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
