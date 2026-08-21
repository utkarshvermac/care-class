import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, School, ArrowRight } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", collegeName: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 bg-gold-glow flex flex-col items-center justify-center px-6 py-12">
      <Link to="/"><Logo className="mb-8" /></Link>
      <div className="card w-full max-w-sm p-7 animate-fade-up">
        <h1 className="font-display text-xl font-semibold text-paper-100 mb-1">Create your account</h1>
        <p className="text-sm text-paper-100/50 mb-6">Takes under a minute. No college email required.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label block mb-1.5">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-100/35" />
              <input
                required
                className="input pl-10"
                placeholder="Utkarsh Verma"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
          </div>
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
            <label className="label block mb-1.5">College (optional)</label>
            <div className="relative">
              <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-100/35" />
              <input
                className="input pl-10"
                placeholder="C.S.J.M. University"
                value={form.collegeName}
                onChange={(e) => setForm((f) => ({ ...f, collegeName: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="label block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-100/35" />
              <input
                type="password"
                required
                minLength={6}
                className="input pl-10"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Creating account…" : "Create account"} <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-sm text-paper-100/50 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gold-500 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
