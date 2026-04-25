import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/HelperComponents";
import { useAuth } from "../context/AuthContext";
import { startInterview, sendInterviewMessage, finishInterview, getJobs } from "../services/api";
import {
  Lock, Zap, Send, Bot, User, Star, TrendingUp,
  ChevronRight, ExternalLink, CheckCircle2, AlertCircle,
  BookOpen, Target, Award, Briefcase, Building2, MapPin, ArrowRight,
  Video, MessageSquare, Mic, Camera, X, MicOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_FIRST_MESSAGE =
  "Hello! I'm your AI career consultant. I'll ask you a few questions to understand your skills and background, then give you a personalized learning path. Ready to begin?";

const MOCK_COURSES = [
  { title: "Excel & Data Entry Mastery", provider: "Coursera", level: "Beginner", duration: "4 weeks", link: "#", skill: "Excel" },
  { title: "Professional Communication in Hindi & English", provider: "NPTEL", level: "Beginner", duration: "6 weeks", link: "#", skill: "Communication" },
  { title: "JavaScript Fundamentals", provider: "freeCodeCamp", level: "Intermediate", duration: "8 weeks", link: "#", skill: "JavaScript" },
  { title: "Customer Service Excellence", provider: "LinkedIn Learning", level: "Beginner", duration: "2 weeks", link: "#", skill: "Customer Service" },
];

const LearningPathPage = () => {
  const navigate = useNavigate();
  const { isProfileUnlocked, token, user, profileCompletion } = useAuth();

  const [phase, setPhase] = useState("start"); // start | selection | interview | video-interview | results
  const [interviewType, setInterviewType] = useState(null); // chat | video
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const sessionIdRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [courses, setCourses] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [fetchingJobs, setFetchingJobs] = useState(false);
  const chatEndRef = useRef(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFindJobs = async () => {
    setFetchingJobs(true);
    try {
      const data = await getJobs(token); 
      setMatchedJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch matched jobs");
    } finally {
      setFetchingJobs(false);
    }
  };

  const handleStartInterview = async (type) => {
    setInterviewType(type);
    if (type === "chat") {
      setLoading(true);
      try {
        const data = await startInterview(token);
        setSessionId(data.sessionId);
        setMessages([{ role: "ai", text: data.message || MOCK_FIRST_MESSAGE }]);
        setPhase("interview");
      } catch (err) {
        console.error("Failed to start interview:", err);
        setMessages([{ role: "ai", text: `[System Error]: ${err.message || "Could not connect to AI server. Please try again later."}` }]);
        setPhase("interview");
      } finally {
        setLoading(false);
      }
    } else {
      setPhase("video-interview");
      startVideoInterview();
    }
  };

  const utteranceRef = useRef(null);

  const speak = (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onend = () => {
      if (!isMuted) startListening();
    };
    utteranceRef.current = utterance; // Prevent garbage collection
    window.speechSynthesis.speak(utterance);
  };

  const startVideoInterview = async () => {
    setLoading(true);
    try {
      // Start Camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;

      // Start Interview API
      const data = await startInterview(token);
      setSessionId(data.sessionId);
      sessionIdRef.current = data.sessionId;
      const firstMsg = data.message || "Hello! What is your target role today?";
      setCurrentQuestion(firstMsg);
      speak(firstMsg);
    } catch (err) {
      console.error("Video Interview setup failed:", err);
      setCurrentQuestion("Please enable camera/microphone access to proceed.");
    } finally {
      setLoading(false);
    }
  };

  const handleStopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    handleFinish();
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript);
      
      setLoading(true);
      try {
        const data = await sendInterviewMessage(token, sessionIdRef.current, transcript);
        setCurrentQuestion(data.message);
        speak(data.message);
        if (data.done) {
          setTimeout(() => {
            handleStopVideo();
          }, 3000);
        }
      } catch (err) {
        console.error("Video message send failed:", err);
      } finally {
        setLoading(false);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      // Restart listening if it was a timeout or silent error
      if (event.error === 'no-speech') {
        setTimeout(startListening, 1000);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const data = await sendInterviewMessage(token, sessionId, text);
      setMessages((prev) => [...prev, { role: "ai", text: data.message }]);
      if (data.done) {
        await handleFinish();
      }
    } catch (err) {
      console.error("Interview API error:", err);
      const errMsg = err.message || "Error connecting to AI. Please ensure your backend is running.";
      setMessages((prev) => [...prev, { role: "ai", text: `[System Error]: ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const data = await finishInterview(token, sessionId);
      setScore(data.score ?? 72);
      setAnalysis(data.analysis ?? {
        strengths: ["Good communication", "Basic computer skills", "Willingness to learn"],
        gaps: ["Technical skills need improvement", "No formal certifications", "Limited experience in target role"],
        level: "Intermediate Beginner",
      });
      setCourses(data.courses ?? MOCK_COURSES);
    } catch {
      setScore(72);
      setAnalysis({
        strengths: ["Good communication", "Basic computer skills", "Willingness to learn"],
        gaps: ["Technical skills need improvement", "No formal certifications", "Limited experience in target role"],
        level: "Intermediate Beginner",
      });
      setCourses(MOCK_COURSES);
    } finally {
      setLoading(false);
      setPhase("results");
    }
  };

  // Locked state
  if (!isProfileUnlocked) {
    return (
      <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
        <Sidebar />
        <main className="ml-64 flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="text-gray-400" size={40} />
            </div>
            <h1 className="text-2xl font-bold text-black mb-3">Learning Path Locked</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Complete at least <span className="text-black font-bold">80%</span> of your profile to unlock your personalized AI Learning Path. You're at <span className="text-blue-600 font-bold">{profileCompletion}%</span> right now.
            </p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200 mb-6">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${profileCompletion}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <a
              href="/profile"
              className="inline-flex items-center gap-2 px-6 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition shadow-md"
            >
              Complete Profile <ChevronRight size={16} />
            </a>
          </div>
        </main>
      </div>
    );
  }

  // ── PHASE: Start — Choice Cards ────────────────────────
  if (phase === "start") {
    return (
      <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <div className="p-12 rounded-[3.5rem] bg-white border border-gray-100 shadow-sm mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -z-0 opacity-50" />
            <div className="relative z-10">
              <h1 className="text-5xl font-black text-black tracking-tighter mb-4 leading-none">Learning Path</h1>
              <p className="text-gray-500 text-lg font-medium max-w-2xl">You've completed your profile. Choose how you'd like to proceed.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="group bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm hover:border-black hover:shadow-lg transition-all flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 group-hover:bg-black group-hover:text-white transition-colors">
                <Bot size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-black tracking-tight mb-4">Start AI Interview</h2>
                <p className="text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">Answer a few smart questions. Get a skill score, course recommendations, and stronger job matches.</p>
              </div>
              <button
                onClick={() => setPhase("selection")}
                disabled={loading}
                className="mt-auto w-full py-6 bg-black text-white font-black rounded-3xl hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-60 text-sm flex items-center justify-center gap-3 shadow-2xl shadow-black/10"
              >
                {loading ? "Initializing..." : "Start Interview"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>

            <div className="group bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm hover:border-black hover:shadow-lg transition-all flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-700 group-hover:bg-black group-hover:text-white transition-colors border border-gray-100">
                <Briefcase size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-black tracking-tight mb-4">Apply for Jobs</h2>
                <p className="text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">Browse all available job listings and apply directly with your current profile and skills.</p>
              </div>
              <button
                onClick={() => {
                  setPhase("jobs");
                  handleFindJobs();
                }}
                className="mt-auto w-full py-6 bg-white text-black font-black rounded-3xl border border-gray-200 hover:border-black hover:bg-gray-50 transition-all active:scale-95 text-sm"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── PHASE: Selection ────────────────────────────────────
  if (phase === "selection") {
    return (
      <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 flex items-center justify-center">
          <div className="max-w-4xl w-full">
            <button onClick={() => setPhase("start")} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-black font-bold transition group">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-black transition-all">
                <ChevronRight className="rotate-180" size={16} />
              </div>
              Back
            </button>
            
            <div className="text-center mb-16">
              <h1 className="text-5xl font-black text-black mb-6 tracking-tighter">Choose Interview Type</h1>
              <p className="text-gray-500 font-medium text-xl">Select the format you're most comfortable with.</p>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <motion.div 
                whileHover={{ y: -10 }}
                onClick={() => handleStartInterview("chat")}
                className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm hover:border-black cursor-pointer group transition-all"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white transition-all mb-10">
                  <MessageSquare size={40} />
                </div>
                <h3 className="text-3xl font-black text-black mb-4 tracking-tight">Chat Interview</h3>
                <p className="text-gray-500 font-medium mb-10 text-lg leading-relaxed">Text-based AI interview. Perfect for quiet environments or if you prefer typing.</p>
                <div className="flex items-center gap-2 text-black font-black text-sm">
                  Start Chatting <ArrowRight size={20} />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                onClick={() => handleStartInterview("video")}
                className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm hover:border-blue-600 cursor-pointer group transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                  Recommended
                </div>
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all mb-10">
                  <Video size={40} />
                </div>
                <h3 className="text-3xl font-black text-black mb-4 tracking-tight">AI Video Interview</h3>
                <p className="text-gray-500 font-medium mb-10 text-lg leading-relaxed">Face-to-face AI simulation. Best for practicing real-world communication skills.</p>
                <div className="flex items-center gap-2 text-blue-600 font-black text-sm">
                  Start Video Call <ArrowRight size={20} />
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── PHASE: Video Interview ──────────────────────────────
  if (phase === "video-interview") {
    return (
      <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
        <div className="flex-1 relative flex flex-col items-center justify-center p-8">
          
          {/* Main User Feed (Swapped to Big) */}
          <div className="w-full max-w-5xl aspect-video bg-gray-900 rounded-[4rem] overflow-hidden relative border border-gray-800 shadow-2xl">
            <video 
                ref={videoRef}
                autoPlay 
                muted={true} 
                playsInline 
                className="w-full h-full object-cover grayscale-[20%] contrast-110"
            />
            
            {/* Overlay indicators */}
            <div className="absolute top-10 left-10 flex flex-col gap-4">
                <div className="flex items-center gap-3 bg-red-600/20 backdrop-blur-xl px-5 py-2.5 rounded-full border border-red-500/30">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Live Assessment</span>
                </div>
                {isMuted && (
                   <div className="flex items-center gap-3 bg-gray-900/40 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                      <MicOff size={16} className="text-white" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Mic Muted</span>
                   </div>
                )}
            </div>

            {/* AI Small Feed (Corner) */}
            <div className="absolute bottom-10 right-10 w-80 aspect-video bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-6">
                <div className="mb-4">
                    <Bot size={48} className={`${isListening ? "text-blue-500 animate-pulse" : "text-gray-600"} transition-colors`} />
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">AI Recruiter</p>
                    <div className="flex gap-1.5 justify-center">
                        <span className={`w-1.5 h-1.5 rounded-full ${isListening ? "bg-blue-500 animate-bounce" : "bg-gray-700"}`} style={{ animationDelay: "0ms" }} />
                        <span className={`w-1.5 h-1.5 rounded-full ${isListening ? "bg-blue-500 animate-bounce" : "bg-gray-700"}`} style={{ animationDelay: "150ms" }} />
                        <span className={`w-1.5 h-1.5 rounded-full ${isListening ? "bg-blue-500 animate-bounce" : "bg-gray-700"}`} style={{ animationDelay: "300ms" }} />
                    </div>
                </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                    isMuted ? "bg-red-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
                }`}
            >
              {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            <button 
                onClick={handleStopVideo}
                className="px-12 h-20 rounded-full bg-white text-black flex items-center justify-center gap-4 font-black uppercase tracking-widest text-sm hover:bg-gray-100 transition shadow-2xl active:scale-95"
            >
              <X size={24} /> End Interview
            </button>
          </div>

          <div className="mt-12 text-center max-w-3xl">
             <div className="inline-block px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full mb-4">
                <p className="text-blue-500 font-black uppercase tracking-widest text-[10px]">AI Question</p>
             </div>
             <p className="text-white/90 font-bold text-2xl leading-relaxed italic max-w-2xl mx-auto">
                "{currentQuestion || "Initializing AI Recruiter..."}"
             </p>
          </div>
        </div>
      </div>
    );
  }

  // ── PHASE: Interview (Chat) ────────────────────────────
  if (phase === "interview") {
    return (
      <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 flex flex-col" style={{ height: "100vh" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight">Skill Gap Analyzer</h1>
              <p className="text-gray-500 text-sm font-medium mt-1">Answer naturally — your profile is being analyzed</p>
            </div>
            <button
              onClick={handleFinish}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition disabled:opacity-60 shadow-lg"
            >
              <CheckCircle2 size={16} />
              {loading ? "Analyzing..." : "Finish Interview"}
            </button>
          </div>

          {/* Chat Window */}
          <div className="flex-1 bg-white border border-gray-100 shadow-sm rounded-[2.5rem] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Bot size={20} />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-6 py-4 rounded-[2rem] text-[15px] leading-relaxed font-medium ${msg.role === "user"
                        ? "bg-black text-white rounded-tr-lg"
                        : "bg-gray-50 text-black border border-gray-100 rounded-tl-lg"
                        }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                        <User size={20} />
                      </div>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Bot size={20} />
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-[2rem] rounded-tl-lg px-6 py-4 flex gap-1.5 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type your answer..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-[15px]"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition disabled:opacity-40 flex items-center gap-2 font-bold text-[15px] shadow-sm active:scale-95"
              >
                <Send size={18} /> Send
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── PHASE: Jobs Browse ───────────────────────────────────
  if (phase === "jobs") {
    return (
      <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setPhase("start")}
              className="text-sm font-bold text-gray-500 hover:text-black transition flex items-center gap-1"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-4xl font-extrabold text-black tracking-tight">All Job Listings</h1>
              <p className="text-gray-500 text-sm font-medium mt-1">Sorted by match score based on your skills</p>
            </div>
          </div>

          {fetchingJobs ? (
            <div className="text-center py-20 text-gray-500 font-semibold">Finding matching jobs...</div>
          ) : matchedJobs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No jobs available right now. Check back soon!</div>
          ) : (
            <div className="space-y-4">
              {matchedJobs.map((job) => (
                <div key={job._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-black transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-black text-lg">{job.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 font-medium">
                        <span className="text-gray-900 font-bold">{job.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                        {job.salary && <span className="font-bold text-black">{job.salary}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {job.matchScore != null && (
                      <div className="text-right">
                        <p className="text-2xl font-black text-blue-600 leading-none">{job.matchScore}%</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Match</p>
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="px-6 py-3 bg-black text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ── PHASE: Results ──────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">Your Analysis</h1>
        <p className="text-gray-500 text-base font-medium mb-10">Here's your personalized career roadmap based on the interview.</p>

        {/* Score Card */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
            <div className="relative w-36 h-36 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                <circle
                  cx="50" cy="50" r="42"
                  stroke={score >= 70 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444"}
                  strokeWidth="8" fill="none"
                  strokeDasharray={`${(score / 100) * 264} 264`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-black">{score}</span>
                <span className="text-gray-400 text-xs font-bold">/ 100</span>
              </div>
            </div>
            <h3 className="text-black font-bold text-lg mb-1">Overall Assessment</h3>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs px-3 py-1 bg-blue-50 rounded-lg">{analysis?.level}</p>
          </div>

          <div className="col-span-2 grid grid-rows-2 gap-6">
            <div className="bg-white border border-green-100 shadow-sm rounded-[2rem] p-8">
              <h3 className="text-green-700 font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-widest">
                <CheckCircle2 size={18} /> Your Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis?.strengths?.map((s, i) => (
                  <span key={i} className="px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-xl text-sm font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white border border-red-100 shadow-sm rounded-[2rem] p-8">
              <h3 className="text-red-600 font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-widest">
                <AlertCircle size={18} /> Areas to Improve
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis?.gaps?.map((g, i) => (
                  <span key={i} className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] p-10 mt-10">
          <h2 className="text-2xl font-bold text-black mb-8 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-blue-50 rounded-xl"><BookOpen className="text-blue-600" size={24} /></div>
            Recommended Courses
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {courses.map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 hover:border-black hover:bg-white hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-white border border-gray-200 text-black rounded-lg text-xs font-extrabold uppercase tracking-widest shadow-sm">
                      {course.skill}
                    </span>
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-black transition"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                  <h4 className="font-extrabold text-black text-lg mb-2 leading-tight">
                    {course.title}
                  </h4>
                  <p className="text-gray-500 font-medium text-sm">{course.provider}</p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <span className="text-black font-bold text-xs uppercase tracking-wider">{course.level}</span>
                  <span className="text-gray-300 font-bold">•</span>
                  <span className="text-gray-500 font-bold text-xs">{course.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Find Jobs Button */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <button
            onClick={handleFindJobs}
            disabled={fetchingJobs}
            className="flex items-center gap-3 px-12 py-6 bg-blue-600 text-white font-black rounded-[2.5rem] hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-60 text-xl shadow-2xl shadow-blue-200"
          >
            <Briefcase size={24} />
            {fetchingJobs ? "Scoping matches..." : "Find My Matched Jobs"}
          </button>

          <AnimatePresence>
            {matchedJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="w-full mt-10 space-y-4"
              >
                <div className="flex items-center justify-between px-4 mb-4">
                  <h3 className="text-xl font-bold text-black flex items-center gap-2">
                    <Star size={20} className="text-yellow-500 fill-yellow-500" /> Top AI-Matched Opportunities
                  </h3>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sorted by skill match</span>
                </div>
                {matchedJobs.map((job) => (
                  <div key={job._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-black transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-black text-lg">{job.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 font-medium">
                          <span className="text-gray-900 font-bold">{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-2xl font-black text-blue-600 leading-none">{job.matchScore}%</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Match</p>
                      </div>
                      <button
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="px-6 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Redo */}
        <div className="flex items-center justify-center mt-12 pb-12">
          <button
            onClick={() => { setPhase("start"); setMessages([]); setScore(null); setMatchedJobs([]); }}
            className="px-8 py-4 bg-transparent text-gray-500 border-2 border-gray-200 rounded-2xl text-sm font-bold hover:border-black hover:text-black hover:bg-white transition-all active:scale-95"
          >
            Retake AI Interview
          </button>
        </div>
      </main>
    </div>
  );
};

export default LearningPathPage;