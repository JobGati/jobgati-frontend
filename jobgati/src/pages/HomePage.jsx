import React, { useState } from "react";
import { Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Feature from '../components/Feature';
import AuthModal from "../components/AuthModal";
import JobSeekerDashboard from "./JobSeekerDashboard";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    

const navigate = useNavigate();





const [view, setView] = useState('home'); 
  const [authModal, setAuthModal] = useState({ isOpen: false, type: null });

  const openModal = (type) => setAuthModal({ isOpen: true, type });
  const closeModal = () => setAuthModal({ isOpen: false, type: null });

  // 2. Simple conditional rendering
  if (view === 'dashboard') {
    return <JobSeekerDashboard />;
  }




  return (

   
    
    <div className="min-h-screen bg-white font-sans text-[#0F172A] selection:bg-blue-100 ">

        <AuthModal 
        isOpen={authModal.isOpen} 
        type={authModal.type} 
        onClose={closeModal} 
        toggleType={() => openModal(authModal.type === 'login' ? 'register' : 'login')}
      />

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-black text-white p-1 rounded-lg">
             <div className="w-5 h-5 flex items-center justify-center text-xs">JG</div>
          </div>
        JobGati
        </div>


        <div className="flex items-center gap-4">
            <button
              onClick={() => openModal('login')} // Open Login
              className="text-sm font-semibold px-4 py-2 hover:bg-slate-300 rounded-full transition"
            >
              Login
            </button>
            <button
              onClick={() => openModal('register')} // Open Register
              className="text-sm font-semibold bg-[#1E293B] text-white px-6 py-2 rounded-full hover:bg-black transition"
            >
              Register
            </button>
</div>
      </nav>

      {/* Hero Content */}
      <header className="relative z-10 pt-20 pb-32 text-center max-w-4xl mx-auto px-6 ">
       
         <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
       Close Your Skill Gap. <br />
          <span className="text-slate-800">Unlock Local Opportunities.</span>
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover local job opportunities, analyze your skill gaps, and get a personalized roadmap to become job-ready.
        
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
       <button onClick={() => navigate("/dashboard")} className="w-full sm:w-auto bg-[#3B82F6] text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95">
  Get Started Free
</button>


          <button className="w-full sm:w-auto bg-white border border-slate-200 px-8 py-4 rounded-full font-semibold hover:bg-slate-200 transition-all">
           I'm an Employer
          </button>
        </div>
      </header>

      <Feature />

      {/* Visual Showcase */}
      <section className="relative bg-black z-10 max-w-full mx-auto px-6 h-[500px]">
        {/* Mockup Container */}
        <div className="relative flex justify-center">
          
          {/* Main Phone Mockup */}
          <div className="relative z-30 w-[340px] bg-white rounded-[3rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-slate-900">
             {/* Profile Card Overlay */}
             <div className="bg-white rounded-2xl shadow-xl p-5 border border-slate-100 -mt-16 mx-[-1rem]">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-[60px] h-[50px] bg-slate-200 rounded-full overflow-hidden">
                      <img src="me.jpeg" alt="avatar" />
                   </div>
                   <div>
                      <h3 className="font-bold text-sm">Abhishek Jaiswal</h3>
                      <p className="text-[10px] text-blue-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 fill-blue-500 text-white" /> Verified Profile
                      </p>
                   </div>
                </div>
                
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">95% <span className="font-normal text-slate-400">Your profile matches jobs</span></span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`h-full flex-1 rounded-full ${i < 5 ? 'bg-green-400' : 'bg-slate-200'}`} />
                      ))}
                   </div>

                   <div className="space-y-4 mt-6">
                      <JobListItem icon="P" title="Software Engineer" company="Pinterest" />
                      <JobListItem icon="S" title="Senior Product Designer" company="Spotify" />
                      <JobListItem icon="G" title="UI Designer" company="Github" />
                   </div>
                   
                   <button className="w-full py-2 mt-2 border border-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 text-slate-600">
                      View more jobs <ChevronDown className="w-3 h-3" />
                   </button>
                </div>
             </div>
          </div>

          {/* Floating Cards (Tilted) */}
          <div className="absolute top-[50px] left-[250px] hidden xl:block">
            <TiltedCard 
              company="Databricks" 
              role="Content Writer" 
              logoColor="bg-orange-500" 
              rotation="-rotate-12" 
            />
          </div>
           <div className="absolute top-[20px] right-[270px] hidden xl:block">
            <TiltedCard 
              company="Netflix" 
              role="UI/UX Designer" 
              logoColor="bg-red-500" 
              rotation="rotate-6" 
            />
            
          </div>
 <div className="absolute top-[-150px] left-[1115px] hidden xl:block">
            <TiltedCard 
              company="MailChimp" 
              role="Full Stack Developer" 
              logoColor="bg-blue-400" 
              rotation="-rotate-12" 
            />
          </div>

          <div className="absolute top-[-100px] left-[-100px] hidden xl:block">
          <TiltedCard 
              company="Dropbox" 
              role="Customer Support" 
              logoColor="bg-yellow-400" 
              rotation="rotate-6" 
            />
          </div>

        </div>
      </section>








    </div>

    
  );

};




const JobListItem = ({ icon, title, company }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-800">{title}</p>
        <p className="text-[10px] text-slate-400">{company}</p>
      </div>
    </div>
    <div className="text-slate-300 text-lg">...</div>
  </div>
);

const TiltedCard = ({ company, role, logoColor, rotation }) => (
  <div className={`w-72 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 ${rotation} transition-transform hover:scale-105 duration-300`}>
    <div className={`w-10 h-10 ${logoColor} rounded-lg mb-4 flex items-center justify-center text-white font-bold`}>
      {company[0]}
    </div>
    <h4 className="font-bold text-lg mb-1">{role}</h4>
    <p className="text-blue-500 text-xs font-medium mb-3 flex items-center gap-1">
      {company} <CheckCircle2 className="w-3 h-3" />
    </p>
    <p className="text-slate-400 text-[11px] leading-relaxed mb-6">
      Help users get the most out of {company}. As a {role}, you’ll solve problems, guide users, and ensure a smooth, frustration-free experience across our platform.
    </p>
    <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold">Apply now</button>
  </div>
);



export default HomePage;