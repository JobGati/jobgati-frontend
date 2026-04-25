import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJobById, applyToJob } from "../services/api";
import { Sidebar } from "../components/HelperComponents";
import {
    MapPin, Building2, Briefcase, Clock, IndianRupee,
    ChevronLeft, Send, Phone, Mail, CheckCircle2,
    ShieldCheck, Zap, AlertCircle, FileText, ArrowRight,
    Loader2, UserCheck, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JobDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [step, setStep] = useState("details"); // details | applying | success
    const [contactVisible, setContactVisible] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return; // Wait for token to be available

        const fetchJob = async () => {
            try {
                const data = await getJobById(token, id);
                setJob(data.job);
            } catch (err) {
                console.error("Fetch job error:", err);
                setError(err.message || "Failed to load job details.");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, token]);

    const handleApply = async () => {
        setApplying(true);
        try {
            const data = await applyToJob(token, id);
            if (job.jobCategory === "LOCAL") {
                setContactVisible(true);
            }
            setStep("success");
        } catch (err) {
            setError(err.message || "Failed to apply.");
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#F8F9FA] items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (error && step === "details") {
        return (
            <div className="flex min-h-screen bg-[#F8F9FA] items-center justify-center">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 text-center max-w-md">
                    <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-black mb-2">Error</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button onClick={() => navigate(-1)} className="px-6 py-3 bg-black text-white rounded-2xl font-bold">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Nav */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm mb-8 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-black transition-all">
                            <ChevronLeft size={16} />
                        </div>
                        Back to Search
                    </button>

                    <AnimatePresence mode="wait">
                        {step === "details" && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative">
                                    {/* Category Badge */}
                                    <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest ${job.jobCategory === 'LOCAL' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {job.jobCategory} JOB
                                    </div>

                                    <div className="flex items-start gap-8 mb-10">
                                        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center border border-gray-100 text-black shadow-inner">
                                            <Building2 size={40} />
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <h1 className="text-4xl font-black text-black tracking-tight mb-2 leading-none">{job.title}</h1>
                                            <div className="flex items-center gap-6 text-gray-500 font-bold text-sm">
                                                <span className="text-blue-600">{job.company}</span>
                                                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {job.location}</span>
                                                <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-gray-400" /> {job.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-3 gap-6 mb-12">
                                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Salary Range</p>
                                            <p className="text-lg font-black text-black flex items-center gap-1"><IndianRupee size={18} /> {job.salary}</p>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                                            <p className="text-lg font-black text-black">{job.experience}</p>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Post Date</p>
                                            <p className="text-lg font-black text-black">{new Date(job.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="space-y-10">
                                        <div>
                                            <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
                                                <div className="w-2 h-6 bg-black rounded-full" />
                                                Job Description
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed text-base font-medium whitespace-pre-line">{job.description}</p>
                                        </div>

                                        {job.skills && job.skills.length > 0 && (
                                            <div>
                                                <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
                                                    <div className="w-2 h-6 bg-blue-600 rounded-full" />
                                                    Required Skills
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.skills.map((skill, i) => (
                                                        <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-sm font-bold">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-16 p-8 bg-black rounded-[2.5rem] flex items-center justify-between text-white shadow-2xl shadow-gray-200">
                                        <div>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Interested in this role?</p>
                                            <h4 className="text-xl font-bold">Quick Apply with JobGati</h4>
                                        </div>
                                        <button
                                            onClick={handleApply}
                                            disabled={applying}
                                            className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                                        >
                                            {applying ? (
                                                <><Loader2 className="animate-spin" size={20} /> Processing...</>
                                            ) : (
                                                <>Apply Now <ArrowRight size={20} /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-xl text-center"
                            >
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h2 className="text-4xl font-black text-black mb-4 tracking-tight">Application Sent!</h2>
                                <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                                    {job.jobCategory === 'LOCAL'
                                        ? "Your application is logged. You can now contact the recruiter directly to discuss the role."
                                        : "Great choice! The employer has been notified. We'll let you know once they review your resume."}
                                </p>

                                {job.jobCategory === 'LOCAL' && contactVisible && (
                                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-10 max-w-sm mx-auto space-y-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recruiter Contact Info</p>
                                        <div className="space-y-3">
                                            {job.contactInfo?.phone && (
                                                <a href={`tel:${job.contactInfo.phone}`} className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 transition shadow-lg">
                                                    <Phone size={18} /> {job.contactInfo.phone}
                                                </a>
                                            )}
                                            {job.contactInfo?.email && (
                                                <a href={`mailto:${job.contactInfo.email}`} className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition">
                                                    <Mail size={18} /> {job.contactInfo.email}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="px-8 py-4 bg-gray-100 text-black font-bold rounded-2xl hover:bg-gray-200 transition"
                                    >
                                        Back to Dashboard
                                    </button>
                                    {job.jobCategory === 'TECH' && job.interviewType === 'AI' && (
                                        <button
                                            onClick={() => navigate('/learning-path')}
                                            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2"
                                        >
                                            <Zap size={18} /> Take AI Interview
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default JobDetailsPage;
