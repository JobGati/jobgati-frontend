import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, Briefcase, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const ROLES = [
  {
    id: "jobseeker",
    label: "Job Seeker",
    desc: "Find jobs & build your career",
    icon: <Search size={22} />,
  },
  {
    id: "employer",
    label: "Employer",
    desc: "Post jobs & hire talent",
    icon: <Briefcase size={22} />,
  },
];

const AuthModal = ({ isOpen, type, onClose, toggleType }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("jobseeker");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let data;
      if (type === "register") {
        data = await registerUser({ ...form, role });
      } else {
        data = await loginUser({ email: form.email, password: form.password });
      }
      // data should have { user, token, completion }
      login(data.user, data.token, data.completion);
      onClose();
      if (data.user.role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-[#0A0A0A] border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden"
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-8 text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-900 rounded-full"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex bg-white text-black px-3 py-1 rounded-lg mb-4 font-black text-sm tracking-tighter">
                JG
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {type === "login" ? "Welcome Back" : "Join JobGati"}
              </h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                {type === "login"
                  ? "Access your personalized roadmap and local job matches."
                  : "Bridge your skill gaps and unlock local opportunities."}
              </p>
            </div>

            {/* Role Selector (Register only) */}
            {type === "register" && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-sm font-semibold transition-all ${role === r.id
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-slate-800 text-slate-400 hover:border-slate-600"
                      }`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                    <span className="text-[10px] font-normal text-slate-500 text-center leading-tight">
                      {r.desc}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {type === "register" && (
                <Field
                  icon={<User className="w-4 h-4" />}
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              )}
              <Field
                icon={<Mail className="w-4 h-4" />}
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Field
                icon={<Lock className="w-4 h-4" />}
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />

              {error && (
                <p className="text-red-400 text-xs font-medium text-center py-2 bg-red-500/10 rounded-xl border border-red-500/20">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-bold py-4 rounded-2xl mt-2 hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : type === "login"
                    ? "Sign In"
                    : "Create Account"}
                {!loading && (
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-8 pt-6 border-t border-slate-900 text-center text-sm">
              <span className="text-slate-500">
                {type === "login" ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button
                onClick={toggleType}
                className="ml-2 text-white font-bold hover:text-blue-400 transition-colors underline underline-offset-4 decoration-slate-700"
              >
                {type === "login" ? "Register Now" : "Login Here"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Field = ({ icon, label, name, type, placeholder, value, onChange, required }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-[#111] border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
      />
    </div>
  </div>
);

export default AuthModal;