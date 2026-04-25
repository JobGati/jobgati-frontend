import React, { useState } from "react";
import { EmployerSidebar } from "../components/HelperComponents";
import { useAuth } from "../context/AuthContext";
import { postJob } from "../services/api";
import {
    Briefcase, MapPin, DollarSign, Clock, Users,
    ChevronRight, CheckCircle2, FileText, Plus, X, Star
} from "lucide-react";
import { motion } from "framer-motion";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const EXPERIENCE_LEVELS = ["Fresher (0-1 yr)", "Junior (1-3 yrs)", "Mid (3-5 yrs)", "Senior (5+ yrs)"];
const SKILLS_SUGGESTIONS = ["React", "Node.js", "Python", "Communication", "Sales", "Accounting", "Customer Service", "Electrical", "Figma"];

const PostJobPage = () => {
    const { token } = useAuth();
    const [form, setForm] = useState({
        title: "", company: "", location: "", salary: "",
        type: "Full-time", experience: "Fresher (0-1 yr)",
        description: "", requirements: "", openings: "1",
        skills: []
    });
    const [skillInput, setSkillInput] = useState("");
    const [posting, setPosting] = useState(false);
    const [posted, setPosted] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const addSkill = (skill) => {
        const s = skill.trim();
        if (s && !form.skills.includes(s) && form.skills.length < 15) {
            setForm((f) => ({ ...f, skills: [...f.skills, s] }));
        }
        setSkillInput("");
    };

    const removeSkill = (skill) =>
        setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPosting(true);
        setError("");
        try {
            await postJob(token, form);
            setPosted(true);
        } catch (err) {
            setError(err.message || "Failed to post job");
        } finally {
            setPosting(false);
        }
    };

    if (posted) {
        return (
            <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
                <EmployerSidebar />
                <main className="ml-64 flex-1 flex items-center justify-center p-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center max-w-xl p-16 bg-white rounded-[3rem] border border-gray-100 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="text-green-600" size={48} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-black mb-4">Job Posted Successfully!</h1>
                        <p className="text-gray-500 text-base mb-10 font-medium">Your job listing is now live. AI will begin matching qualified candidates instantly.</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => { setPosted(false); setForm({ ...form, title: "", description: "", requirements: "", skills: [] }); }}
                                className="px-6 py-4 bg-gray-100 text-black border border-gray-200 rounded-2xl font-bold text-sm hover:bg-gray-200 transition"
                            >
                                Post Another Job
                            </button>
                            <a href="/employer/jobs" className="px-6 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition shadow-lg">
                                View Dashboard
                            </a>
                        </div>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
            <EmployerSidebar />
            <main className="ml-64 flex-1 p-8">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">Post a Job</h1>
                    <p className="text-gray-500 text-base font-medium">Define your requirements to attract the right candidates.</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm space-y-6">
                        <h2 className="text-black font-bold flex items-center gap-3 mb-6 text-xl">
                            <div className="p-2 bg-gray-100 rounded-lg text-black"><Briefcase size={20} /></div> Basic Info
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <Field label="Job Title *" name="title" value={form.title} onChange={handleChange} placeholder="e.g., Store Associate" required />
                            <Field label="Company Name *" name="company" value={form.company} onChange={handleChange} placeholder="e.g., Reliance Retail" required />
                            <Field label="Location *" name="location" value={form.location} onChange={handleChange} placeholder="e.g., Sector 18, Noida" required />
                            <Field label="Salary Range" name="salary" value={form.salary} onChange={handleChange} placeholder="e.g., ₹15k - ₹25k / month" />
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <SelectField label="Job Type" name="type" value={form.type} onChange={handleChange} options={JOB_TYPES} />
                            <SelectField label="Experience" name="experience" value={form.experience} onChange={handleChange} options={EXPERIENCE_LEVELS} />
                            <Field label="Openings" name="openings" type="number" value={form.openings} onChange={handleChange} placeholder="1" />
                        </div>
                    </div>

                    {/* Required Skills */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm space-y-6">
                        <h2 className="text-black font-bold flex items-center gap-3 mb-2 text-xl">
                            <div className="p-2 bg-gray-100 rounded-lg text-black"><Star size={20} /></div> Required Skills
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mb-6">AI will match candidates based on these skills.</p>

                        <div>
                            <div className="flex gap-3 mb-4">
                                <input
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }}
                                    placeholder="Type a skill and press Enter..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => addSkill(skillInput)}
                                    className="px-6 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition flex items-center gap-2 text-sm"
                                >
                                    <Plus size={16} /> Add Skill
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {form.skills.map((skill) => (
                                    <span key={skill} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black border border-gray-200 rounded-xl text-sm font-bold">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition"><X size={13} /></button>
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider py-1.5 mr-2">Suggestions:</span>
                                {SKILLS_SUGGESTIONS.filter(s => !form.skills.includes(s)).map((s) => (
                                    <button
                                        key={s} type="button" onClick={() => addSkill(s)}
                                        className="px-3 py-1 bg-white text-gray-500 rounded-lg text-xs font-bold border border-gray-200 hover:border-black hover:text-black transition"
                                    >
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm space-y-6">
                        <h2 className="text-black font-bold flex items-center gap-3 mb-6 text-xl">
                            <div className="p-2 bg-gray-100 rounded-lg text-black"><FileText size={20} /></div> Description
                        </h2>
                        <TextAreaField
                            label="Job Description *"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                            rows={4}
                            required
                        />
                        <TextAreaField
                            label="Other Requirements"
                            name="requirements"
                            value={form.requirements}
                            onChange={handleChange}
                            placeholder="Additional qualifications or perks. E.g., Basic English, 10th Pass required, free meals."
                            rows={3}
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm font-bold bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={posting}
                        className="w-full flex justify-center items-center gap-3 px-8 py-5 bg-black text-white font-black rounded-[2rem] hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-60 text-lg shadow-xl shadow-black/10"
                    >
                        <CheckCircle2 size={24} />
                        {posting ? "Publishing Job..." : "Publish Job Post"}
                    </button>
                </form>
            </main>
        </div>
    );
};

const Field = ({ label, name, type = "text", value, onChange, placeholder, required }) => (
    <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
        <input
            type={type} name={name} value={value} onChange={onChange}
            placeholder={placeholder} required={required}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium"
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
    <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
        <div className="relative">
            <select
                name={name} value={value} onChange={onChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm appearance-none font-medium"
            >
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" size={16} />
        </div>
    </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows, required }) => (
    <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
        <textarea
            name={name} value={value} onChange={onChange}
            placeholder={placeholder} rows={rows} required={required}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none text-sm font-medium"
        />
    </div>
);

export default PostJobPage;
