import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { getJobs, applyPartTime } from '../services/api';
import {
  Home, UserCircle, Target, LogOut, Mail, Eye, Zap,
  Target as MatchIcon, MapPin, CheckCircle2, Flame,
  User, LayoutGrid, Award, BookOpen, Clock, Building2, ChevronRight,
  ShoppingBag, Truck, Smartphone, Briefcase, Lock, Phone, X, Send
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

// --- PART-TIME JOB CARD ---
const PART_TIME_JOBS = [
  {
    id: 1,
    title: "Evening Store Assistant",
    company: "Reliance Retail",
    location: "Sector 18, Noida",
    hours: "5 PM – 9 PM",
    pay: "₹8k – ₹12k/month",
    match: 88,
    icon: ShoppingBag,
  },
  {
    id: 2,
    title: "Weekend Delivery Partner",
    company: "Swiggy",
    location: "Noida Sector 62",
    hours: "Sat – Sun",
    pay: "₹600/day",
    match: 92,
    icon: Truck,
  },
  {
    id: 3,
    title: "Part-Time Data Entry Operator",
    company: "Local Service Hub",
    location: "Noida Extension",
    hours: "4 hrs/day",
    pay: "₹10k/month",
    match: 76,
    icon: Smartphone,
  },
];

// --- APPLY MODAL ---
const PartTimeApplyModal = ({ job, user, token, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await applyPartTime(token, {
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        hours: job.hours,
        pay: job.pay,
        phone: form.phone.trim(),
        note: form.note.trim(),
        matchScore: job.match,
      });
      setSubmitted(true);
      setTimeout(() => {
        onSuccess(job.id);
        onClose();
      }, 2200);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {!submitted ? (
            <>
              {/* Modal Header */}
              <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      Part-Time
                    </span>
                    <h2 className="text-2xl font-black text-black mt-3 leading-tight">{job.title}</h2>
                    <p className="text-sm font-semibold text-gray-500 mt-1">{job.company} &nbsp;·&nbsp; {job.location}</p>
                  </div>
                  <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-black transition-colors mt-1">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex gap-4 mt-4 text-xs text-gray-500 font-semibold">
                  <span className="flex items-center gap-1"><Clock size={12} />{job.hours}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                  <span className="font-extrabold text-black">{job.pay}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:border-black transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Phone Number <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                      className="w-full pl-10 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:border-black transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Why are you a good fit? <span className="text-gray-300">(optional)</span></label>
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder="Briefly describe your availability or experience..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3.5 text-sm font-bold text-gray-500 hover:text-black rounded-2xl border border-gray-100 hover:border-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-black text-white text-sm font-black rounded-2xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <><Send size={15} /> Submit Application</>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-8 py-14 flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-20 h-20 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 size={40} className="text-green-500" />
              </motion.div>
              <h3 className="text-2xl font-black text-black mb-2">Application Sent!</h3>
              <p className="text-gray-500 text-sm font-medium max-w-xs">
                You've applied for <span className="font-bold text-black">{job.title}</span> at {job.company}. We'll notify you when they respond.
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- PART-TIME JOB CARD ---
const PartTimeJobCard = ({ title, company, location, hours, pay, match, icon: Icon, applied, onApply }) => (
  <div className={`group bg-white p-6 rounded-3xl border shadow-sm transition-all duration-200 flex flex-col gap-4 ${
    applied ? 'border-green-200 bg-green-50/30' : 'border-gray-100 hover:border-black hover:shadow-md'
  }`}>
    {/* Top row: icon + badge */}
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors duration-200 ${
        applied ? 'bg-green-50 border-green-100 text-green-600' : 'bg-gray-50 border-gray-100 group-hover:bg-black group-hover:text-white'
      }`}>
        {Icon ? <Icon size={22} /> : <Briefcase size={22} />}
      </div>
      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-wider">
        Part-Time
      </span>
    </div>

    {/* Job title & company */}
    <div>
      <h4 className="font-bold text-black text-base leading-snug">{title}</h4>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{company}</p>
    </div>

    {/* Details */}
    <div className="flex flex-col gap-1.5 text-sm text-gray-500">
      <span className="flex items-center gap-1.5">
        <MapPin size={13} className="shrink-0" />
        {location}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock size={13} className="shrink-0" />
        {hours}
      </span>
    </div>

    {/* Bottom row: pay + match + apply */}
    <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
      <div>
        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Expected Pay</p>
        <p className="text-sm font-extrabold text-black mt-0.5">{pay}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 font-bold">Match</span>
          <span className="text-blue-600 font-extrabold text-sm">{match}%</span>
        </div>
        {applied ? (
          <span className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 text-xs font-bold rounded-xl flex items-center gap-1">
            <CheckCircle2 size={13} /> Applied
          </span>
        ) : (
          <button
            onClick={onApply}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 active:scale-95 transition-all duration-150"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  </div>
);

const PartTimeJobsSection = ({ user, token }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);

  const handleSuccess = (jobId) => {
    setAppliedIds((prev) => [...prev, jobId]);
  };

  return (
    <section id="part-time-jobs" className="mt-10">
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h2 className="text-2xl font-bold text-black tracking-tight">Part-Time Jobs Near You</h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Flexible local work — on your schedule.</p>
        </div>
        <span className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">View All →</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PART_TIME_JOBS.map((job) => (
          <PartTimeJobCard
            key={job.id}
            {...job}
            applied={appliedIds.includes(job.id)}
            onApply={() => setSelectedJob(job)}
          />
        ))}
      </div>

      {selectedJob && (
        <PartTimeApplyModal
          job={selectedJob}
          user={user}
          token={token}
          onClose={() => setSelectedJob(null)}
          onSuccess={handleSuccess}
        />
      )}
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
        <PartTimeJobsSection user={user} token={token} />
        <LocalJobsGrid jobs={jobs} loading={loading} />

      </main>
    </div>
  );
};

export default JobSeekerDashboard;