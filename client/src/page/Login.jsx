import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't sign you in. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 bg-gold-glow flex flex-col items-center justify-center px-6 py-12">
      <Link to="/"><Logo className="mb-8" /></Link>
      <div className="card w-full max-w-sm p-7 animate-fade-up">
        <h1 className="font-display text-xl font-semibold text-paper-100 mb-1">Welcome back</h1>
        <p className="text-sm text-paper-100/50 mb-6">Sign in to check today's numbers.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label block mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-100/35" />
              <input
                type="email"
                required
                className="input pl-10"
                placeholder="you@college.edu"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="label block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-100/35" />
              <input
                type={showPw ? "text" : "password"}
                required
                className="input pl-10 pr-10"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-paper-100/35 hover:text-paper-100/70"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Signing in…" : "Sign in"} <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-sm text-paper-100/50 text-center mt-6">
          New to CARE CLASS?{" "}
          <Link to="/register" className="text-gold-500 font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
