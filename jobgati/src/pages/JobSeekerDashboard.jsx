import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { getJobs } from '../services/api';
import {
  Home, UserCircle, Target, LogOut, Mail, Eye, Zap,
  Target as MatchIcon, MapPin, CheckCircle2, Flame,
  User, LayoutGrid, Award, BookOpen, Clock, Building2, ChevronRight,
  ShoppingBag, Truck, Smartphone, Briefcase, Lock
} from 'lucide-react';

import { Sidebar, Tag, MetricCard, ProgressBar } from '../components/HelperComponents';

// --- REFINED LOCAL JOB CARD ---
const LocalJobCard = ({ id, title, company, location, type, time, salary, match, icon: Icon }) => (
  <Link to={`/jobs/${id}`} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-black transition-all flex items-center justify-between">
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
        {Icon ? <Icon size={24} /> : <Building2 size={24} />}
      </div>
      <div>
        <h4 className="font-bold text-black text-lg">{title}</h4>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{company}</span>
          <span className="flex items-center gap-1"><MapPin size={14} /> {location}</span>
          <span className="flex items-center gap-1 font-bold text-black">{salary}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{time}</span>
        {match && <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold">{match} match</span>}
      </div>
      <div className="p-3 bg-black text-white rounded-xl group-hover:scale-105 transition-transform">
        <ChevronRight size={20} />
      </div>
    </div>
  </Link>
);

// --- MAIN DASHBOARD SECTIONS ---

const WelcomeHeader = ({ user, profileCompletion }) => (
  <header className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tighter text-black mb-2 leading-tight">
          Hello, <span className="font-extrabold text-blue-600">{user?.name || "there"}!</span>
        </h1>
        <p className="text-gray-500 text-base max-w-xl leading-relaxed">Connecting you with local opportunities{user?.location ? ` in ${user.location}` : ""} & beyond.</p>
      </div>
    </div>
    <div className="flex items-center gap-3 mt-10 flex-wrap">
      {user?.location && (
        <Tag icon={<MapPin size={14} />} label={user.location} color="bg-gray-100 text-gray-700 border-gray-200" />
      )}
      <Tag
        icon={<CheckCircle2 size={14} />}
        label={`Profile ${profileCompletion}% complete`}
        color={profileCompletion >= 80 ? "bg-green-50 text-green-700 border-green-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"}
      />
      <Tag icon={<Flame size={14} />} label="5 jobs today" color="bg-orange-50 text-orange-700 border-orange-100" />
    </div>
  </header>
);

const ProfileCompletionSection = ({ user, profileCompletion, isProfileUnlocked }) => (
  <section className="mt-12 p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
    {!isProfileUnlocked && (
      <div className="absolute top-0 left-0 w-full p-3 bg-blue-50 border-b border-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-2">
        <Lock size={14} /> You need {80 - profileCompletion}% more completion to unlock the Learning Path
      </div>
    )}
    <div className={`flex items-center justify-between mb-12 ${!isProfileUnlocked ? "mt-4" : ""}`}>
      <h2 className="text-2xl font-bold text-black">Profile Completion</h2>
      <Link to="/profile" className="text-sm font-bold text-blue-600 hover:text-blue-700">Edit Profile &rarr;</Link>
    </div>
    <div className="space-y-8">
      <ProgressBar label="Basic Info" icon={<User />} progress={user?.name && user?.email ? 100 : 0} color="bg-green-600" />
      <ProgressBar label="Skills Added" icon={<Award />} progress={Math.min((user?.skills?.length || 0) * 20, 100)} color="bg-blue-500" />
      <ProgressBar label="Education" icon={<BookOpen />} progress={user?.education ? 100 : 0} color="bg-green-600" />
      <ProgressBar label="Work Experience" icon={<LayoutGrid />} progress={user?.experience ? 100 : 0} color="bg-yellow-600" />
      <ProgressBar label="Resume Upload" icon={<CheckCircle2 />} progress={user?.resumeUrl ? 100 : 0} color="bg-gray-200" />
    </div>
  </section>
);

// --- APPLY OPTIONS SECTION ---
const ApplyOptionsSection = () => {
  const navigate = useNavigate();
  return (
    <section className="mt-8 grid grid-cols-2 gap-6">
      {/* Smart Apply Card */}
      <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-black transition-all flex flex-col gap-4">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 text-2xl group-hover:bg-black transition-colors">
          🎯
        </div>
        <div>
          <h3 className="text-xl font-bold text-black tracking-tight">Smart Apply</h3>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">Take an AI Interview, get course recommendations and stronger job matches</p>
        </div>
        <button
          onClick={() => navigate('/learning-path')}
          className="mt-auto w-full py-3 bg-black text-white font-bold rounded-2xl hover:bg-gray-900 transition-all active:scale-95 text-sm"
        >
          Start Interview
        </button>
      </div>

      {/* Direct Apply Card */}
      <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-black transition-all flex flex-col gap-4">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 text-2xl group-hover:bg-black transition-colors">
          ⚡
        </div>
        <div>
          <h3 className="text-xl font-bold text-black tracking-tight">Direct Apply</h3>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">Skip the interview and apply directly with your current skills</p>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('jobs-near-you');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-auto w-full py-3 bg-white text-black font-bold rounded-2xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all active:scale-95 text-sm"
        >
          Browse Jobs
        </button>
      </div>
    </section>
  );
};

const LocalJobsGrid = ({ jobs, loading }) => (
  <section id="jobs-near-you" className="mt-12 mb-12">
    <div className="flex items-center justify-between mb-8 px-2">
      <div>
        <h2 className="text-2xl font-bold text-black tracking-tight">Jobs Near You</h2>
        <p className="text-gray-500 text-sm mt-1 font-medium">Verified local listings.</p>
      </div>
    </div>

    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-10 text-gray-500 font-semibold">Finding local jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No jobs available in your location right now.</div>
      ) : jobs.map((job) => (
        <LocalJobCard
          key={job._id}
          id={job._id}
          title={job.title}
          company={job.company}
          location={job.location}
          salary={job.salary || "Not Specified"}
          time={new Date(job.createdAt).toLocaleDateString()}
          icon={Briefcase}
        />
      ))}
    </div>
  </section>
);

// --- MAIN DASHBOARD COMPONENT ---
const JobSeekerDashboard = () => {
  const { user, token, logout, profileCompletion, isProfileUnlocked } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs(token, user?.location ? { location: user.location } : {});
        setJobs(data.jobs?.slice(0, 5) || []);
      } catch {
        console.error("Failed to fetch local jobs");
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchJobs();
  }, [token, user?.location]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
      <Sidebar user={user} logout={logout} isProfileUnlocked={isProfileUnlocked} />
      <main className="flex-1 p-8 ml-64">
        <WelcomeHeader user={user} profileCompletion={profileCompletion} />

        {/* Metrics Grid */}
        <section className="grid grid-cols-4 gap-6 mt-8">
          <MetricCard title="JOBS APPLIED" value="3" icon={<Mail />} color="text-black" />
          <MetricCard title="PROFILE VIEWS" value="24" icon={<Eye />} color="text-black" subText={<span className="text-green-600 font-bold">↑ 5 this week</span>} />
          <MetricCard title="SKILLS LISTED" value={String(user?.skills?.length || 0)} icon={<Zap />} color="text-black" />
          <MetricCard title="MATCH SCORE AVG" value="72%" icon={<MatchIcon />} color="text-black" />
        </section>

        <ProfileCompletionSection user={user} profileCompletion={profileCompletion} isProfileUnlocked={isProfileUnlocked} />
        <ApplyOptionsSection />
        <LocalJobsGrid jobs={jobs} loading={loading} />

      </main>
    </div>
  );
};

export default JobSeekerDashboard;