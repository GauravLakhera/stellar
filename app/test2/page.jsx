"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ImprovedGSAPAnimation = () => {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const boxRef = useRef(null);
  const textRef = useRef(null);
  const slideTextRef = useRef(null);
  const timelineRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("move");

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    const box = boxRef.current;
    const text = textRef.current;
    const slideText = slideTextRef.current;

    if (!container || !sticky || !box || !text || !slideText) return;

    // Set initial states
    gsap.set([box, text], {
      force3D: true,
      transformOrigin: "center center",
    });

    gsap.set(slideText, {
      x: "100%",
      opacity: 0,
      force3D: true,
    });

    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const newProgress = Math.round(self.progress * 100);
          setProgress(newProgress);
          
          if (self.progress < 0.33) {
            setCurrentPhase("move");
          } else if (self.progress < 0.66) {
            setCurrentPhase("expand");
          } else {
            setCurrentPhase("slide");
          }
        },
      },
    });

    // Animation sequence
    tl.to(box, {
        x: () => window.innerWidth < 768 ? "-30%" : window.innerWidth < 1024 ? "-50vw" : "-50vw",
        scale: 1.3,
        backgroundColor: "#667eea",
        borderRadius: "30px",
        duration: 1,
        ease: "power2.inOut",
      })
      .to(text, {
        color: "#ffffff",
        fontWeight: "600",
        duration: 1,
        ease: "power2.inOut",
      }, "<")
      
      // Phase 2: Expand more and rotate
      .to(box, {
        scale: () => window.innerWidth < 768 ? 1.8 : window.innerWidth < 1024 ? 2 : 2.2,
        rotation: 45,
        backgroundColor: "#f093fb",
        borderRadius: "50%",
        boxShadow: "0 0 50px rgba(240, 147, 251, 0.6)",
        duration: 1,
        ease: "power2.inOut",
      })
      .to(text, {
        rotation: -45,
        fontWeight: "bold",
        scale: 0.8,
        duration: 1,
     
        y:'-100%',
         x:'100%',
        ease: "power2.inOut",
      }, "<")
      
      // Phase 3: Slide in text from right
      .to(slideText, {
        x: "-20%",
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      })

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold mb-6">
            Enhanced GSAP Animation
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl opacity-80 mb-8">
            Box moves left, expands, rotates • Text slides from right
          </p>
          <div className="text-green-400 font-semibold text-sm sm:text-base">
            ✅ Responsive Design • ✅ Smooth Animations • ✅ Perfect Timing
          </div>
        </div>
      </section>

      {/* Animation Container */}
      <section
        ref={containerRef}
        className="h-[500vh]" // Increased for more animation time
      >
        <div
          ref={stickyRef}
          className="sticky border border-white/50 top-0 h-screen flex items-center justify-center bg-black/20 backdrop-blur-sm overflow-hidden"
        >
          {/* Main animated box */}
          <div
            ref={boxRef}
            className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-white rounded-2xl flex items-center justify-center shadow-2xl relative z-10"
          >
            <p
              ref={textRef}
              className="text-base sm:text-xl lg:text-2xl font-semibold text-gray-800 text-center px-4"
            >
              Watch Me Move!
            </p>
          </div>

          {/* Sliding text content */}
          <div 
            ref={slideTextRef}
            className="absolute right-0 w-full sm:w-8/12 md:w-6/12 lg:w-5/12 text-white p-4 sm:p-6 lg:p-8"
          >
            <h2 className="text-xl sm:text-2xl lg:text-5xl font-bold mb-4">
              Amazing Content Slides In
            </h2>
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed opacity-90">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
              distinctio id, laboriosam, ipsa obcaecati ipsum eius enim adipisci
              voluptatibus itaque commodi laborum maiores aliquid. Ratione
              voluptate enim cum aliquid nihil?
            </p>
            <div className="mt-4 sm:mt-6">
              <div className="inline-block px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-semibold">
                Sliding Animation ✨
              </div>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="flex space-x-2 sm:space-x-4 mb-2 sm:mb-4">
              <div
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                  currentPhase === "move"
                    ? "bg-blue-400 scale-125"
                    : "bg-white/40"
                }`}
              />
              <div
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                  currentPhase === "expand"
                    ? "bg-purple-400 scale-125"
                    : "bg-white/40"
                }`}
              />
              <div
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                  currentPhase === "slide"
                    ? "bg-pink-400 scale-125"
                    : "bg-white/40"
                }`}
              />
            </div>
            <p className="text-white text-xs sm:text-sm font-mono">
              Progress: {progress}% • Phase: {currentPhase}
            </p>
          </div>

          {/* Progress bar */}
          <div className="absolute top-4 sm:top-8 left-1/2 transform -translate-x-1/2 w-48 sm:w-64 lg:w-80">
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Completion Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 py-12 sm:py-20">
        <div className="text-center text-white max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-6xl font-bold mb-6">
            🚀 ENHANCED ANIMATIONS!
          </h2>
          <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-8">
            Responsive box movement, expansion, rotation, and sliding text
          </p>

          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 sm:p-8 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-green-300">
              Animation Features:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left text-sm sm:text-base">
              <div className="space-y-2 sm:space-y-3">
                <div>🎯 <strong>Phase 1:</strong> Box moves left & scales</div>
                <div>🔄 <strong>Phase 2:</strong> Expands & rotates 45°</div>
                <div>📱 <strong>Responsive:</strong> Adapts to screen size</div>
                <div>⚡ <strong>Smooth:</strong> Hardware accelerated</div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div>➡️ <strong>Phase 3:</strong> Text slides from right</div>
                <div>🎨 <strong>Colors:</strong> Dynamic background changes</div>
                <div>📊 <strong>Progress:</strong> Real-time tracking</div>
                <div>✨ <strong>Effects:</strong> Shadows & transforms</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: "🎯",
                title: "Precise Movement",
                desc: "Calculated responsive positioning",
              },
              {
                icon: "🔄",
                title: "Smooth Rotation",
                desc: "Perfect 45° rotation timing",
              },
              {
                icon: "📱",
                title: "Mobile Optimized",
                desc: "Scales perfectly on all devices",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-base sm:text-lg mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImprovedGSAPAnimation;