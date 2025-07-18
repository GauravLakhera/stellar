"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function MarqueeText({ text, speed = 100 }) {
  const containerRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setTextWidth(containerRef.current.scrollWidth);
    }
  }, [text]);

  return (
    <div className="overflow-hidden text-[9rem]  leading-[6rem] font-gilroy font-bold text-white whitespace-nowrap w-full bg-transparent">
<motion.div
  className="flex"
  animate={{
    x: [-textWidth, 0],
  }}
  transition={{
    repeat: Infinity,
    repeatType: "loop",
    duration: textWidth / speed,
    ease: "linear",
  }}
>
        <div ref={containerRef} className="mr-8">
          {text}
        </div>
        <div className="mr-8">{text}</div>
      </motion.div>
    </div>
  );
}
