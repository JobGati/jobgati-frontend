import React, { useState, useEffect } from "react";
import { EmployerSidebar, MetricCard, Tag } from "../components/HelperComponents";
import { useAuth } from "../context/AuthContext";
import {
    Briefcase, Users, Eye, TrendingUp, MapPin, Clock,
    ChevronRight, PlusSquare, CheckCircle2, Building2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getPostedJobs, getApplicants } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_JOBS = [
    { title: "Store Associate", location: "Sector 18, Noida", applicants: 12, type: "Full-time", status: "active", posted: "2d ago" },
    { title: "Delivery Partner", location: "Sector 62, Noida", applicants: 8, type: "Contract", status: "active", posted: "5d ago" },
    { title: "Data Entry Operator", location: "Logix Mall, Noida", applicants: 3, type: "Part-time", status: "closed", posted: "12d ago" },
];

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getPostedJobs(token);
                setJobs(data.jobs || []);
            } catch (err) {
                console.error("Failed to fetch jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [token]);

    const handleJobClick = async (job) => {
        if (selectedJob?._id === job._id) {
            setSelectedJob(null);
            setApplicants([]);
            return;
        }
        setSelectedJob(job);
        setLoadingApplicants(true);
        try {
            const data = await getApplicants(token, job._id);
            setApplicants(data.applicants || []);
        } catch (err) {
            console.error("Failed to fetch applicants");
        } finally {
            setLoadingApplicants(false);
        }
    };

    const activeJobsCount = jobs.filter(j => j.status === "active").length;
    const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicants?.length || 0), 0);
    const totalViews = jobs.length * 12; // Mock views for now
    const totalHires = 0; // Mock hires for now

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
            <EmployerSidebar />
            <main className="ml-64 flex-1 p-8">

                {/* Header */}
                <header className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2 leading-tight">
                                Welcome, <span className="text-blue-600">{user?.name || "Employer"}!</span>
                            </h1>
                            <p className="text-gray-500 text-base max-w-xl leading-relaxed">Manage your job postings and track applicants.</p>
                        </div>
                        <Link
                            to="/employer/post-job"
                            className="flex items-center gap-2 px-6 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-95 text-sm"
                        >
                            <PlusSquare size={16} /> Post a Job
                        </Link>
                    </div>
                    <div className="flex items-center gap-3 mt-10">
                        {user?.location && (
                            <Tag icon={<MapPin size={14} />} label={user.location} color="bg-gray-100 border border-gray-200 text-gray-700" />
                        )}
                        <Tag icon={<CheckCircle2 size={14} />} label="Verified Employer" color="bg-green-50 border border-green-100 text-green-700" />
                    </div>
                </header>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-6 mb-8 mt-8">
                    <MetricCard title="Active Jobs" value={activeJobsCount.toString()} icon={<Briefcase />} color="text-black" />
                    <MetricCard title="Total Applicants" value={totalApplicants.toString()} icon={<Users />} color="text-black" />
                    <MetricCard title="Job Views" value={totalViews.toString()} icon={<Eye />} color="text-black" />
                    <MetricCard title="Hired" value={totalHires.toString()} icon={<TrendingUp />} color="text-black" />
                </div>

                {/* Posted Jobs */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-10 mt-12 mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-black tracking-tight">Your Job Postings</h2>
                        <Link
                            to="/employer/post-job"
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
                        >
                            + New Job <ChevronRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-16 text-gray-500 font-semibold">Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-16">
                            <Building2 className="text-gray-400 mx-auto mb-4" size={48} />
                            <p className="text-gray-500 font-semibold">No jobs posted yet</p>
                            <Link to="/employer/post-job" className="mt-4 inline-block px-5 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition">
                                Post Your First Job
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {jobs.map((job) => (
                                <div key={job._id} className="space-y-4">
                                    <div
                                        onClick={() => handleJobClick(job)}
                                        className={`group p-6 rounded-3xl border transition-all flex items-center justify-between cursor-pointer ${selectedJob?._id === job._id ? "border-black bg-gray-50" : "bg-white border-gray-100 hover:border-black"}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${selectedJob?._id === job._id ? "bg-black text-white" : "bg-gray-50 text-gray-500 group-hover:bg-black group-hover:text-white"}`}>
                                                <Briefcase size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-black text-lg">{job.title}</h4>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1 font-semibold text-gray-900"><MapPin size={14} /> {job.location}</span>
                                                    <span className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase border ${job.status === "active" ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                                                        {job.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-black font-black text-lg">{job.applicants?.length || 0}</p>
                                                <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">applicants</p>
                                            </div>
                                            <div className={`p-3 rounded-xl transition-all ${selectedJob?._id === job._id ? "bg-black text-white rotate-90" : "bg-gray-50 text-black"}`}>
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Applicants List */}
                                    <AnimatePresence>
                                        {selectedJob?._id === job._id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-12 space-y-3 pb-4">
                                                    {loadingApplicants ? (
                                                        <div className="text-sm font-bold text-gray-400 py-4">Fetching candidates...</div>
                                                    ) : applicants.length === 0 ? (
                                                        <div className="text-sm font-bold text-gray-400 py-4">No candidates have applied yet.</div>
                                                    ) : (
                                                        applicants.map((app) => (
                                                            <div key={app._id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                                                                        {app.user?.name?.charAt(0) || "C"}
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="font-bold text-black">{app.user?.name}</h5>
                                                                        <p className="text-xs text-gray-500 font-medium">{app.user?.email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-8">
                                                                    <div className="text-right">
                                                                        <p className="text-sm font-black text-black">{app.user?.interviewScore ? `${app.user.interviewScore}%` : "N/A"}</p>
                                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Score</p>
                                                                    </div>
                                                                    <div className="text-right pr-4">
                                                                        <p className="text-sm font-black text-blue-600">{app.user?.role === 'jobseeker' ? "Candidate" : "N/A"}</p>
                                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => navigate(`/employer/candidates/${app.user._id}`)}
                                                                        className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:scale-105 active:scale-95 transition"
                                                                    >
                                                                        View Profile
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EmployerDashboard;
