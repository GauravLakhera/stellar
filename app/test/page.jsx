"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function AnimateLetters() {
  const textRef = useRef(null);
  const overlayDiv = useRef(null);
  const exclamRef = useRef(null); // Special ref for '!'

  const text = "Have Fun!";

  useEffect(() => {
    const letters = textRef.current.querySelectorAll("span");
    gsap.set(overlayDiv.current, { x: "-100%" });

    const tl = gsap.timeline();

    tl.fromTo(
      letters,
      {
        x: -100,
        opacity: 0,
        scale: 0.1,
        rotate: 45,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1.5,
      
        fontSize: "18rem",
        ease: "back.inOut",
        stagger: 0.05
      }
    )
      .to(
       ".overlaydivs",
        {
          x: "50%",
          opacity: 1,
          duration: 1.2,
          ease: "power3.inOut",
        },
        "-=0.5"
      )
      .to(
        exclamRef.current,
        {
          "--gradOpacity": 1,
          duration: 1,
          ease: "power2.inOut",
        },
        "+=0.5"
      );
  }, []);

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center">
      <h1
        ref={textRef}
        className="text-6xl z-[10] text-white font-bold w-full text-center flex gap-1 font-gilroy"
      >
        {Array.from(text).map((char, i) => {
          const isExclam = char === "!";
          return (
            <span
              key={i}
              ref={isExclam ? exclamRef : null}
              className={`inline-block opacity-0 relative ${
                isExclam ? "gradient-letter" : ""
              }`}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </h1>

      <div
        ref={overlayDiv}
        className="overlaydivs absolute border inset-0 opacity-0 w-screen  h-screen bg-gradient-to-r from-black to-white/50"
      ></div>

      <style jsx>{`
        .gradient-letter {
          position: relative;
          color: white;
        }

        .gradient-letter::before {
          content: ".";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #ff00cc, #3333ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: var(--gradOpacity, 0);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
