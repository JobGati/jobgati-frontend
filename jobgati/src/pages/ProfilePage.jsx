import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/HelperComponents";
import { useAuth } from "../context/AuthContext";
import { saveProfile, getProfile } from "../services/api";
import {
  User, BookOpen, Award, Briefcase, FileText,
  CheckCircle2, Plus, X, Save, Upload
} from "lucide-react";
import { motion } from "framer-motion";

const SKILLS_SUGGESTIONS = [
  "JavaScript", "React", "Python", "Node.js", "SQL", "Excel",
  "Communication", "MS Office", "Figma", "Customer Service",
  "Data Entry", "Marketing", "Sales", "Accounting", "Hindi", "English"
];

const calcCompletion = (form) => {
  const checks = [
    !!(form.name && form.email && form.phone && form.location),
    form.skills.length >= 2,
    !!(form.education && form.degree),
    !!(form.experience),
    !!(form.resumeUrl),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

const ProfilePage = () => {
  const { user, token, setProfileCompletion } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    skills: [],
    education: "",
    degree: "",
    experience: "",
    about: "",
    resumeUrl: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState(0);

  const completion = calcCompletion(form);

  useEffect(() => {
    setProfileCompletion(completion);
  }, [completion]);

  useEffect(() => {
    if (!token) return;
    getProfile(token)
      .then((data) => {
        if (data?.profile) setForm((f) => ({ ...f, ...data.profile }));
      })
      .catch(() => { });
  }, [token]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !form.skills.includes(s) && form.skills.length < 12) {
      setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveProfile(token, form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { label: "Personal", icon: <User size={16} /> },
    { label: "Skills", icon: <Award size={16} /> },
    { label: "Education", icon: <BookOpen size={16} /> },
    { label: "Experience", icon: <Briefcase size={16} /> },
    { label: "Resume", icon: <FileText size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">My Profile</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">
            Complete your profile to unlock the Learning Path
          </p>
        </div>

        {/* Completion Banner */}
        <div className={`mb-8 p-6 rounded-3xl border ${completion >= 80
          ? "bg-green-50 border-green-100"
          : "bg-blue-50 border-blue-100"
          } relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`font-bold text-lg ${completion >= 80 ? "text-green-800" : "text-blue-800"}`}>{completion}% Complete</p>
              <p className={`${completion >= 80 ? "text-green-600" : "text-blue-600"} text-sm font-medium`}>
                {completion >= 80
                  ? "🎉 Profile complete — Learning Path unlocked!"
                  : `${80 - completion}% more to unlock your Learning Path`}
              </p>
            </div>
            {completion >= 80 && (
              <CheckCircle2 className="text-green-600" size={36} />
            )}
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden border border-black/5">
            <motion.div
              className={`h-full rounded-full ${completion >= 80 ? "bg-green-500" : "bg-blue-500"}`}
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeSection === i
                ? "bg-black text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:border-black hover:text-black"
                }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 min-h-[400px] shadow-sm">

          {/* Personal Info */}
          {activeSection === 0 && (
            <div className="grid grid-cols-2 gap-6">
              <FormField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g., Abhishek Jaiswal" />
              <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@example.com" />
              <FormField label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              <FormField label="Location / District" name="location" value={form.location} onChange={handleChange} placeholder="e.g., Noida, UP" />
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">About You</label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  placeholder="Brief intro about yourself..."
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* Skills */}
          {activeSection === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Add Skills</label>
                <div className="flex gap-3">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }}
                    placeholder="Type a skill and press Enter..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium"
                  />
                  <button
                    onClick={() => addSkill(skillInput)}
                    className="px-5 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>

              {/* Quick add suggestions */}
              <div>
                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">Quick Add</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_SUGGESTIONS.filter(s => !form.skills.includes(s)).map((s) => (
                    <button
                      key={s}
                      onClick={() => addSkill(s)}
                      className="px-3 py-1.5 bg-white text-gray-500 rounded-xl text-xs font-bold border border-gray-200 hover:border-black hover:text-black transition"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Skills */}
              {form.skills.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">Your Skills ({form.skills.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black border border-gray-200 rounded-xl text-sm font-bold"
                      >
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition">
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Education */}
          {activeSection === 2 && (
            <div className="grid grid-cols-2 gap-6">
              <FormField label="Institution Name" name="education" value={form.education} onChange={handleChange} placeholder="e.g., Delhi University" />
              <FormField label="Degree / Course" name="degree" value={form.degree} onChange={handleChange} placeholder="e.g., B.Com, 12th Pass, Diploma" />
            </div>
          )}

          {/* Experience */}
          {activeSection === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Work Experience</label>
                <textarea
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Describe your work experience. E.g., '2 years as Store Associate at Reliance Retail, handled billing, customer service, and inventory.'"
                  rows={7}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none text-sm font-medium"
                />
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  Include job titles, company names, and durations. Write "Fresher" if no experience.
                </p>
              </div>
            </div>
          )}

          {/* Resume */}
          {activeSection === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Upload Resume</label>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-black transition-all bg-gray-50 group">
                  <Upload className="text-gray-400 group-hover:text-black transition mb-3" size={32} />
                  <p className="text-gray-500 text-sm font-bold group-hover:text-black transition">
                    Click to upload PDF or DOCX
                  </p>
                  <p className="text-gray-400 text-xs mt-1 font-medium">Max 5MB</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setForm((f) => ({ ...f, resumeUrl: file.name }));
                    }}
                  />
                </label>
                {form.resumeUrl && (
                  <div className="flex items-center gap-3 mt-4 p-4 bg-green-50 border border-green-100 rounded-2xl">
                    <CheckCircle2 className="text-green-600" size={20} />
                    <p className="text-green-700 text-sm font-bold">{form.resumeUrl}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Or paste resume link</label>
                <FormField
                  label=""
                  name="resumeUrl"
                  value={form.resumeUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-60 text-sm"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {success && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-green-600 text-sm font-bold"
            >
              <CheckCircle2 size={18} />
              Saved successfully!
            </motion.div>
          )}

          {error && (
            <p className="text-red-500 text-sm font-bold">{error}</p>
          )}
        </div>
      </main>
    </div>
  );
};

const FormField = ({ label, name, type = "text", value, onChange, placeholder }) => (
  <div>
    {label && (
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </label>
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium"
    />
  </div>
);

export default ProfilePage;