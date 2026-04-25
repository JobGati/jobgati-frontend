import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Feature() {

  const wrapperRef = useRef(null);
  const tagsRef = useRef(null);

  const cards = [
    {
      title: "AI Skill Analysis",
      desc: "Understand exactly what skills you have and what you're missing.",
      points: [
        "Skill gap detection",
        "AI readiness score",
        "Personalized insights"
      ],
      icon: "🤖",
    },
    {
      title: "Hyperlocal Job Matching",
      desc: "Find job opportunities near you, not just in big cities.",
      points: [
        "Nearby jobs",
        "MSME hiring",
        "Location-based results"
      ],
      icon: "🎗️",
    },
    {
      title: "Career Roadmap",
      desc: "Get a clear step-by-step path to become job-ready.",
      points: [
        "Learning roadmap",
        "Course suggestions",
        "Progress tracking"
      ],
      icon: "📈",
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      const totalWidth = wrapperRef.current.scrollWidth;

      //  Horizontal scroll (main content)
      gsap.to(wrapperRef.current, {
        x: () => -(totalWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-section",
          start: "top top",
          end: () => `+=${totalWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
        },
      });

      //  Tags horizontal movement
      gsap.to(tagsRef.current, {
        x: () => -(tagsRef.current.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-section",
          start: "top top",
          end: () => `+=${totalWidth - window.innerWidth}`,
          scrub: 1,
        },
      });

      //  Rotating icon
      gsap.to(".rotating-icon", {
        rotate: 360,
        duration: 2,
        repeat: -1,
        ease: "linear",
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="scroll-section overflow-hidden bg-black text-white py-20 min-h-screen">

      {/* ===== HEADING ===== */}
      <div className="text-center mb-20 px-6">
        <h2 className="text-3xl md:text-5xl font-bold">
          Why JobGati ?
        </h2>
        <p className="text-gray-400 mt-3">
          From skill analysis to job readiness — powered by AI.
        </p>
      </div>

      {/* ===== HORIZONTAL FLOW ===== */}
      <div ref={wrapperRef} className="flex items-center gap-32 px-20">

        {/* ===== CARDS ===== */}
        <div className="flex gap-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="w-[300px] min-h-[360px] rounded-3xl p-6 text-center
              bg-white border border-gray-800 shadow-xl flex flex-col"
            >
              <div className="text-5xl mb-4">{card.icon}</div>

              <h3 className="text-lg font-bold mb-2 text-black">
                {card.title}
              </h3>

              <p className="text-sm text-black mb-4">
                {card.desc}
              </p>

              <ul className="text-xs text-black space-y-1 text-left mx-auto">
                {card.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ===== BIG TEXT FLOW ===== */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-10 text-[50px] font-bold whitespace-nowrap">
            <span className="relative inline-flex flex-col items-center">

                 <img
  src="idea.png"
  alt="analysis sticker"
  className="top-sticker absolute left-1/4 -translate-x-1/2 bottom-full mb-2 w-40 h-40 object-contain"
/>

  {/*  ARROW */}
  <img
    src="https://cdn-icons-png.flaticon.com/128/2268/2268536.png"
    alt="arrow"
    className="top-arrow absolute left-3 -translate-x-1/2 bottom-full mb-2 w-12 h-12 rotate-90 opacity-80"
  />

   {/* TEXT */}
Analyze Skills 🤖

</span>

<span className="relative inline-block">
Match Jobs ⚡️

 {/*  STICKER */}
  <img
    src="meeting.png"
    alt="job match sticker"
    className="jobmatch-sticker absolute left-[-70px] -translate-x-4 top-full mt-0 w-50 h-50 object-contain"
  />



</span>

 {/*  KEEP TEXT INLINE */}
 <span className="relative inline-block">

  Become Job Ready 

  {/*  ARROW */}
  <img
    src="down-arrow.png"
    alt="arrow"
    className="arrow absolute left-[600px] -translate-x-1/2 top-full mt-2 w-40 h-40 opacity-80"
  />

  

</span>
            
           
         
          </div>
        </div>

        {/* ===== ROTATING ICON + TAGS ===== */}
        <div className="flex flex-col items-center ml-20">

          <img
            src="https://cdn-icons-png.flaticon.com/128/1828/1828884.png"
            alt="rotate"
            className="rotating-icon w-16 h-16 mb-6"
          />

          
          <div className="w-full overflow-hidden">
            <div
              ref={tagsRef}
              className="flex gap-4 whitespace-nowrap px-10"
            >
              {/* original */}
              <Tag text="🤖 AI Analysis" />
              <Tag text="🎗️ Local Jobs" />
              <Tag text="📈 Growth Path" />

              {/* duplicate for smooth effect */}
              <Tag text="🤖 AI Analysis" />
              <Tag text="🎗️ Local Jobs" />
              <Tag text="📈 Growth Path" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const Tag = ({ text }) => (
  <div className="bg-[#111] px-5 py-2 rounded-full border border-gray-700 text-sm">
    {text}
  </div>
);

export default Feature;