import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, UserCircle, Target, LogOut, MapPin, CheckCircle2,
  Flame, User, Award, BookOpen, LayoutGrid, Briefcase,
  Users, PlusSquare, Building2, Clock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ── Shared NavLink ───────────────────────────────────────
const NavLink = ({ icon, label, to, locked }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={locked ? "#" : to}
      onClick={(e) => locked && e.preventDefault()}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-colors relative
        ${active ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-gray-100"}
        ${locked ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {React.cloneElement(icon, { size: 20 })}
      {label}
      {locked && (
        <span className="ml-auto text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
          🔒
        </span>
      )}
    </Link>
  );
};

// ── Job Seeker Sidebar ────────────────────────────────────
export const Sidebar = () => {
  const { user, logout, isProfileUnlocked } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 p-6 flex flex-col z-50">
      <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-black mb-10">
        <div className="bg-black text-white p-1 rounded-lg text-xs">
          <div className="w-5 h-5 flex items-center justify-center font-black">JG</div>
        </div>
        JobGati
      </div>

      {/* User chip */}
      <div className="flex items-center gap-3 mb-10 p-3 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0 border-2 border-gray-200">
          <User size={24} />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-black mb-0.5 truncate">{user?.name || "Job Seeker"}</p>
          <span className="text-[10px] bg-black text-white font-semibold px-2.5 py-1 rounded-full">
            Job Seeker
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink icon={<Home />} label="Dashboard" to="/dashboard" />
        <NavLink icon={<UserCircle />} label="My Profile" to="/profile" />
        <NavLink
          icon={<Target />}
          label="Learning Path"
          to="/learning"
          locked={!isProfileUnlocked}
        />
        <NavLink
          icon={<Briefcase />}
          label="Jobs"
          to="/insights"
        />

        {/* Part-Time Jobs shortcut */}
        <button
          onClick={() => {
            if (window.location.pathname !== '/dashboard') {
              navigate('/dashboard');
              setTimeout(() => {
                document.getElementById('part-time-jobs')?.scrollIntoView({ behavior: 'smooth' });
              }, 400);
            } else {
              document.getElementById('part-time-jobs')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-colors text-gray-400 hover:text-black hover:bg-gray-100 group"
        >
          <Clock size={20} />
          <span>Get Part-Time Job</span>
          <span className="ml-auto text-[9px] bg-blue-50 text-blue-600 border border-blue-100 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            NEW
          </span>
        </button>
      </nav>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 py-4 mt-auto bg-transparent border border-gray-300 text-black rounded-2xl text-sm font-bold hover:bg-gray-100 transition active:scale-95"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </aside>
  );
};

// ── Employer Sidebar ──────────────────────────────────────
export const EmployerSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 p-6 flex flex-col z-50">
      <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-black mb-10">
        <div className="bg-black text-white p-1 rounded-lg text-xs">
          <div className="w-5 h-5 flex items-center justify-center font-black">JG</div>
        </div>
        JobGati
      </div>

      {/* Employer chip */}
      <div className="flex items-center gap-3 mb-10 p-3 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0 border-2 border-gray-200">
          <Building2 size={24} />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-black mb-0.5 truncate">{user?.name || "Employer"}</p>
          <span className="text-[10px] bg-black text-white font-semibold px-2.5 py-1 rounded-full">
            Employer
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink icon={<Building2 />} label="Dashboard" to="/employer/dashboard" />
        <NavLink icon={<PlusSquare />} label="Post a Job" to="/employer/post-job" />
        <NavLink icon={<Briefcase />} label="My Jobs" to="/employer/jobs" />
        <NavLink icon={<UserCircle />} label="Company Profile" to="/employer/profile" />
      </nav>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 py-4 mt-auto bg-transparent border border-gray-300 text-black rounded-2xl text-sm font-bold hover:bg-gray-100 transition active:scale-95"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </aside>
  );
};

// ── Shared UI helpers ─────────────────────────────────────
export const Tag = ({ icon, label, color }) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold ${color}`}>
    {icon}
    {label}
  </div>
);

export const MetricCard = ({ title, value, icon, color, subText }) => (
  <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden transition-all hover:border-gray-200">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">{title}</h3>
      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-black transition-colors">
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
    <p className={`text-5xl font-black tracking-tighter ${color}`}>{value}</p>
    {subText && <p className="text-xs mt-4 font-medium">{subText}</p>}
  </div>
);

export const ProgressBar = ({ label, icon, progress, color }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3 text-black font-semibold">
        {React.cloneElement(icon, { size: 16, className: "text-gray-400" })}
        {label}
      </div>
      <span className={`${progress > 0 ? color.replace("bg-", "text-") : "text-gray-400"} font-bold`}>
        {progress}%
      </span>
    </div>
    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100">
      <div
        className={`h-full ${color} rounded-full transition-all duration-1000`}
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);