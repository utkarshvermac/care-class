import { useState } from "react";
import toast from "react-hot-toast";
import { Save, Sun, Moon, Linkedin, Instagram, Github } from "lucide-react";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const AVATAR_COLORS = ["#E8B84B", "#3DD68C", "#5AA9F0", "#F1637A", "#B48CF2", "#F2946D"];

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    name: user?.name || "",
    collegeName: user?.collegeName || "",
    defaultTarget: user?.defaultTarget || 75,
    avatarColor: user?.avatarColor || "#E8B84B",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6 animate-fade-up">
        <h1 className="text-2xl font-display font-bold text-paper-100">Settings</h1>
        <p className="text-sm text-paper-100/50 mt-0.5">Your profile, defaults, and appearance.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <form onSubmit={handleSave} className="lg:col-span-2 card p-6 space-y-5 animate-fade-up">
          <h2 className="font-display font-semibold text-paper-100">Profile</h2>

          <div>
            <label className="label block mb-1.5">Full name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="label block mb-1.5">College</label>
            <input
              className="input"
              placeholder="C.S.J.M. University"
              value={form.collegeName}
              onChange={(e) => setForm((f) => ({ ...f, collegeName: e.target.value }))}
            />
          </div>
          <div>
            <label className="label block mb-1.5">
              Default target for new subjects — <span className="text-gold-500">{form.defaultTarget}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={form.defaultTarget}
              onChange={(e) => setForm((f) => ({ ...f, defaultTarget: Number(e.target.value) }))}
              className="w-full accent-gold-500"
            />
          </div>
          <div>
            <label className="label block mb-2">Avatar color</label>
            <div className="flex items-center gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm((f) => ({ ...f, avatarColor: c }))}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    form.avatarColor === c ? "ring-2 ring-offset-2 ring-offset-ink-800 ring-paper-100 scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={16} /> {saving ? "Saving…" : "Save changes"}
          </button>
        </form>

        <div className="space-y-4">
          <div className="card p-6 animate-fade-up">
            <h2 className="font-display font-semibold text-paper-100 mb-4">Appearance</h2>
            <button onClick={toggleTheme} className="btn-secondary w-full !justify-start">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </button>
          </div>

          <div className="card p-6 animate-fade-up">
            <h2 className="font-display font-semibold text-paper-100 mb-3">About</h2>
            <p className="text-sm text-paper-100/55 leading-relaxed mb-4">
              CARE CLASS was designed and built by Utkarsh Verma — BCA student, C.S.J.M. University,
              Kanpur.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com/in/utkarshvermac"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-3 !py-2 text-xs"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
              <a
                href="https://www.instagram.com/utkarshvermac"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-3 !py-2 text-xs"
              >
                <Instagram size={14} /> Instagram
              </a>
              <a
                href="https://github.com/utkarshvermac"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-3 !py-2 text-xs"
              >
                <Github size={14} /> GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
