"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function GsapStep3() {
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const transparentCardRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      cardRef.current,
      {
        scale: 0.5,
        opacity: 0,

        transformOrigin: "center center",
      },
      {
        scale: 1.4,
        opacity: 1,

        duration: 1.2,
        ease: "back.out(1.7)",
      }
    )
      .to(cardRef.current, {
        rotate: 360,
        duration: 1.2,
        ease: "power2.inOut",
      })
      .to(
        titleRef.current,
        {
          fontSize: "1.5rem", // ~text-4xl
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5" // Overlap animation by 0.5s
      )
      .fromTo(
        transparentCardRef.current,
        {
          x: 100,
          opacity: 0,
          width: 0,
          height: 0,
        },
        {
          x: 0,
          opacity: 1,
          width: 200,
          height: 100,
          duration: 1.5,
          ease: "power2.out",
        }
      ).to(cardRef.current,{
        
      })
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div
        ref={cardRef}
        className="w-64 h-64 flex justify-center items-center flex-col rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
      >
        <h1
          ref={titleRef}
          className="opacity-0 text-white font-gilroy font-bold text-center"
        >
          Welcome Aboard
        </h1>

        <div
          ref={transparentCardRef}
          className=" opacity-0 text-black rounded-lg shadow-lg flex items-center justify-center font-bold mt-4"
        >
          Transparent Card
        </div>
      </div>
    </div>
  );
}
