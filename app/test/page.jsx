"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function AnimateLetters() {
  const textRef = useRef(null);
  const overlayDiv = useRef(null);

  const text = "Have Fun!";

  useEffect(() => {
    const letters = textRef.current.querySelectorAll("span");

    const t1 = gsap.timeline();

    t1.fromTo(
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
        stagger: 0.05,
      }
    ).to(
      overlayDiv.current,
      {
        opacity: 1,
      },
      "-=0.5"
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center">
      <h1
        ref={textRef}
        className="text-6xl z-[10] text-white font-bold w-full text-center flex gap-1 font-gilroy"
      >
        {Array.from(text).map((char, i) => (
          <span
            key={i}
            className="inline-block opacity-0"
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <div
        ref={overlayDiv}
        className="absolute border inset-0 opacity-0 w-screen z-[50] h-screen bg-gradient-to-r from-black to-white/50"
      ></div>
    </div>
  );
}
