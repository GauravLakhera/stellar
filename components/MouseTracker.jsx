"use client";

import { useEffect, useState } from "react";

export default function MouseTracker() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  // console.log(isHovered)

  useEffect(() => {
    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const updateMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("resize", updateSize);
    window.addEventListener("mousemove", updateMouse);
    updateSize();

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", updateMouse);
    };
  }, []);

  return (
    <div className="pointer-events-none font-bold z-[101] text-[0.25rem] md:text-xs font-quicksand fixed top-0 left-0 w-screen h-screen  text-white">
      <div className="absolute  left-0 top-8 z-20 bg-[#b4aea7] text-xs text-white">
        <div
          className="text-black font-bold flex gap-4 md:px-1 py-1 -rotate-180"
          style={{ writingMode: "vertical-lr" }}
        >
          <p>
            <span className="border text-[8px] py-1 md:py-1 md:px-[0.15rem] rounded-full">
              H
            </span>{" "}
            {screenSize.height}
          </p>
          <p>
            <span className="border text-[8px] py-1 md:py-1 md:px-[0.15rem] rounded-full">
              Y
            </span>{" "}
            {mousePos.y}
          </p>
        </div>
      </div>

      <div className="absolute bg-[#b4aea7] w-full  right-6 font-bold bottom-0 z-20 text-xs text-white">
        <div className="text-black flex justify-end gap-4 md:px-2 md:py-1 ">
          <p>
            <span className="border text-[8px] px-1 md:py-1 md:px-[0.25rem] rounded-full">
              X
            </span>
            {mousePos.x}
          </p>
          <p>
            <span className="border text-[8px] px-1 md:py-1 md:px-[0.25rem] rounded-full">
              W
            </span>
            {screenSize.width}
          </p>
          <div className="absolute bottom-0 left-[48.5%] text-center  text-black ">
            {screenSize.width / 2}{" "}
          </div>
        </div>
      </div>

      {/* left right bottm top dot */}
      <div className="absolute top-6 left-[calc(50%_-_2.35rem)]  w-[0.1rem] h-1 bg-[#000000]" />
      <div className="absolute bottom-6 left-[calc(50%_-_2.35rem)]  w-[0.1rem] h-1 bg-[#000000]" />

      <div className="absolute left-6 top-1/2 h-[0.1rem] w-1 bg-[#000000]" />
      <div
        className="absolute left-0 top-[48%] text-center  text-black -rotate-180"
        style={{ writingMode: "vertical-lr" }}
      >
        {screenSize.height / 2}{" "}
      </div>
      <div className="absolute right-6 top-1/2 h-[0.1rem] w-1 bg-[#000000]" />

      {/* x,y pos at top */}
      <div   className="absolute  w-full h-6 bg-[#b4aea7] top-0  text-black ">

     
      <div
        className="absolute top-0  text-black "
        style={{ left: `${mousePos.x - 12}px` }}
      >
        {mousePos.x - screenSize.height}
      </div>

       </div>

      <div className="md:hidden block text-xs absolute top-0 left-1/2 font-semibold -translate-x-1/2  text-black ">
        [ Feture projects ]
      </div>

      <div
        className="absolute  right-0 text-black "
        style={{ top: `${mousePos.y - 12}px`, writingMode: "vertical-lr" }}
      >
        {screenSize.height - mousePos.y * 2}
      </div>

      {/* Vertical line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[#999692]/50"
        style={{ left: `${mousePos.x}px` }}
      />
      {/* Horizontal line */}
      <div
        className="absolute left-0 right-0 h-px bg-[#999692]/50"
        style={{ top: `${mousePos.y}px` }}
      />
      {/* Coordinate Box */}
      <div
        className="absolute text-xs px-1 py-0.5 rounded "
        style={{ top: `${mousePos.y - 25}px`, left: `${mousePos.x}px` }}
      >
        Open Project
      </div>
      {/* Mouse cross */}
      <div
        className="absolute w-3 h-3"
        style={{ top: mousePos.y - 6, left: mousePos.x - 6 }}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white opacity-70" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-70" />
      </div>
    </div>
  );
}
