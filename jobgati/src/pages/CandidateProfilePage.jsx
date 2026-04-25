import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCandidateProfile, sendNotification } from "../services/api";
import { EmployerSidebar } from "../components/HelperComponents";
import {
    User, Mail, MapPin, Award, BookOpen, Clock,
    ChevronLeft, Briefcase, FileText, Zap, Star,
    CheckCircle2, Download, ExternalLink, ShieldCheck
} from "lucide-react";

const CandidateProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showCompose, setShowCompose] = useState(null); // 'email' | 'message' | null
    const [composeData, setComposeData] = useState({ subject: "", body: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getCandidateProfile(token, id);
                setProfile(data.profile);
            } catch (err) {
                console.error("Failed to fetch candidate profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, token]);

    const handleSend = async () => {
        setSending(true);
        try {
            if (showCompose === "email") {
                const subject = encodeURIComponent(composeData.subject || "Job Inquiry from JobGati");
                const body = encodeURIComponent(composeData.body);
                window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
            } else {
                await sendNotification(
                    token,
                    profile._id,
                    composeData.subject || "New Message from Employer",
                    composeData.body
                );
                alert("Message sent successfully!");
            }
            setShowCompose(null);
            setComposeData({ subject: "", body: "" });
        } catch (err) {
            console.error("Failed to send");
            alert("Failed to send. Please try again.");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#F8F9FA] items-center justify-center">
                <div className="text-xl font-bold text-gray-500 animate-pulse">Loading Profile...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex min-h-screen bg-[#F8F9FA] items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-500">Candidate not found</p>
                    <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-black text-white rounded-xl">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
            <EmployerSidebar />
            <main className="ml-64 flex-1 p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm mb-8 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-black transition-all">
                        <ChevronLeft size={16} />
                    </div>
                    Back to Dashboard
                </button>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Hero Profile Card */}
                    <header className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50" />
                        
                        <div className="flex items-start gap-10 relative z-10">
                            <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center border border-gray-100 text-black shadow-inner">
                                <User size={56} />
                            </div>
                            <div className="flex-1 pt-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-black text-black tracking-tight leading-none">{profile.name}</h1>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Verified
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 text-gray-500 font-bold text-sm">
                                    <span className="flex items-center gap-1.5"><Mail size={16} className="text-gray-400" /> {profile.email}</span>
                                    {profile.location && (
                                        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {profile.location}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mt-12">
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">AI Interview Score</p>
                                <p className="text-2xl font-black text-blue-600">{profile.interviewScore ? `${profile.interviewScore}%` : "N/A"}</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                                <p className="text-lg font-black text-black">{profile.experience || "Not listed"}</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Education</p>
                                <p className="text-lg font-black text-black">{profile.degree || "Not listed"}</p>
                            </div>
                        </div>
                    </header>

                    {/* Content Grid */}
                    <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-2 space-y-8">
                            {/* Skills Section */}
                            <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-black text-black mb-6 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-blue-600 rounded-full" />
                                    Technical Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills && profile.skills.length > 0 ? (
                                        profile.skills.map((skill, i) => (
                                            <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-sm font-bold">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 font-medium">No skills listed</p>
                                    )}
                                </div>
                            </section>

                            {/* Analysis Section */}
                            {profile.interviewAnalysis && (
                                <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-black text-black mb-6 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-black rounded-full" />
                                        AI Performance Analysis
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Key Strengths</p>
                                            <div className="space-y-2">
                                                {profile.interviewAnalysis.strengths?.map((s, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                                        <CheckCircle2 size={16} className="text-green-500" /> {s}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Identified Gaps</p>
                                            <div className="space-y-2">
                                                {profile.interviewAnalysis.gaps?.map((g, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                                        <Zap size={16} className="text-orange-500" /> {g}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="space-y-8">
                            {/* Resume Card */}
                            <section className="bg-black p-8 rounded-[2.5rem] text-white shadow-2xl">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <FileText size={20} /> Resume
                                </h3>
                                <p className="text-gray-400 text-xs mb-6 font-medium leading-relaxed">
                                    The candidate has provided a professional resume for your review.
                                </p>
                                {profile.resumeUrl ? (
                                    <a 
                                        href={profile.resumeUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-2xl font-black text-sm hover:scale-105 transition"
                                    >
                                        <Download size={18} /> Download CV
                                    </a>
                                ) : (
                                    <button disabled className="w-full py-4 bg-gray-800 text-gray-500 rounded-2xl font-black text-sm cursor-not-allowed">
                                        No Resume Uploaded
                                    </button>
                                )}
                            </section>

                            <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-black mb-6">Contact Candidate</h3>
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => {
                                            setShowCompose("email");
                                            setComposeData({ 
                                                subject: "Job Opportunity at JobGati", 
                                                body: `Hello ${profile.name},\n\nWe were impressed by your profile and would like to discuss a potential role with our team...` 
                                            });
                                        }}
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                                    >
                                        <Mail size={18} /> Send Email
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setShowCompose("message");
                                            setComposeData({ 
                                                subject: "Quick Interview Request", 
                                                body: "Hi! I saw your profile and would love to chat. Are you available for a brief call tomorrow?" 
                                            });
                                        }}
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 text-black border border-gray-100 rounded-2xl font-bold text-sm hover:bg-gray-100 transition"
                                    >
                                        Message
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            {/* Compose Modal */}
            <AnimatePresence>
                {showCompose && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCompose(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-black">
                                        Compose {showCompose === 'email' ? 'Email' : 'Message'}
                                    </h2>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${showCompose === 'email' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        To: {profile.name}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Subject</label>
                                        <input 
                                            type="text"
                                            value={composeData.subject}
                                            onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:border-black transition-colors"
                                            placeholder="Enter subject..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Content</label>
                                        <textarea 
                                            rows={6}
                                            value={composeData.body}
                                            onChange={(e) => setComposeData({...composeData, body: e.target.value})}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:border-black transition-colors resize-none"
                                            placeholder="Write your message here..."
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-10">
                                    <button 
                                        onClick={() => setShowCompose(null)}
                                        className="flex-1 py-4 bg-transparent text-gray-500 font-bold text-sm hover:text-black transition"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSend}
                                        disabled={sending}
                                        className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                                    >
                                        {sending ? "Sending..." : (
                                            <>
                                                {showCompose === 'email' ? <Mail size={18} /> : <Zap size={18} />}
                                                Send {showCompose === 'email' ? 'Email' : 'Now'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CandidateProfilePage;
