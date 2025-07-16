"use client";

import { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import MarqueeText from "./MarqueeText";
import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
} from "framer-motion";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Lenis from "@studio-freight/lenis";

const ProjectDetailClient = ({ project, nextProject }) => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const lenisRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const cursorOffset = isHoveringNav ? 40 : 6;

  const [imageSizes, setImageSizes] = useState([]);
  const [isEntering, setIsEntering] = useState(true);
  const [scrollX, setScrollX] = useState(0);
  
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 600);
    return () => clearTimeout(timeout);
  }, []);

  const handleNavigate = (path) => {
    router.push(path);
    setTimeout(() => {
      if (scrollContainerRef.current && lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }, 200);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const maxHeight = window.innerHeight - 50;
    const sizes = project.gallery.map(() => {
      const width = Math.floor(Math.random() * (1000 - 600 + 1)) + 600;
      const minHeight = 500;
      const height =
        Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

      return { width, height };
    });

    setImageSizes(sizes);
  }, [project.gallery]);

  const metaVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.4,
        duration: 0.6,
        ease: "backOut",
      },
    }),
  };

  useEffect(() => {
    const handleHover = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "a" || tag === "button" || tag === "span") {
        setIsHoveringNav(true);
      } else {
        setIsHoveringNav(false);
      }
    };

    window.addEventListener("mouseover", handleHover);
    window.addEventListener("mouseout", handleHover);

    return () => {
      window.removeEventListener("mouseover", handleHover);
      window.removeEventListener("mouseout", handleHover);
    };
  }, []);

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

  // Lenis smooth scrolling initialization
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Initialize Lenis for horizontal scrolling
    const lenis = new Lenis({
      wrapper: scrollContainer,
      content: scrollContainer.firstElementChild,
      orientation: 'horizontal',
      gestureOrientation: 'both',
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
      normalizeWheel: true,
      wheelMultiplier: 1,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    // Listen to scroll events
    lenis.on('scroll', (e) => {
      setScrollX(e.scroll);
    });

    // Animation frame for smooth scrolling
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Keyboard navigation with Lenis
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lenisRef.current) return;
      
      const scrollAmount = window.innerWidth * 0.8;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          lenisRef.current.scrollTo(lenisRef.current.scroll - scrollAmount);
          break;
        case 'ArrowRight':
          e.preventDefault();
          lenisRef.current.scrollTo(lenisRef.current.scroll + scrollAmount);
          break;
        case 'Home':
          e.preventDefault();
          lenisRef.current.scrollTo(0);
          break;
        case 'End':
          e.preventDefault();
          lenisRef.current.scrollTo(lenisRef.current.limit);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {isEntering && (
        <motion.div
          className="fixed inset-0 z-[999] bg-[#211d1d]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      <div 
        ref={scrollContainerRef}
        className="horizontal-scroll-container w-full h-full overflow-x-auto overflow-y-hidden"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Hide scrollbar */}
        <style jsx>{`
          .horizontal-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="flex flex-row flex-nowrap">
          {/* Intro full-screen section */}
          <section
            className="w-screen h-screen bg-cover bg-center flex items-center justify-center text-white text-5xl font-bold shrink-0"
            style={{
              backgroundImage: `url(${project.image})`,
              backgroundAttachment: 'fixed',
            }}
          >
            <motion.div
              className="font-bold text-white flex justify-center items-center gap-2 flex-wrap will-change-transform"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {[project.title, project.type, project.progress, project.location].map(
                (item, i) => (
                  <motion.span
                    key={i}
                    className="px-3 py-1 text-center rounded-full bg-white/10 backdrop-blur-sm text-sm"
                    variants={metaVariants}
                    custom={i}
                  >
                    {item}
                  </motion.span>
                )
              )}
            </motion.div>
          </section>

          {/* Details section */}
          <section
            className="w-max h-screen text-black flex-shrink-0 z-[50] flex text-4xl font-bold"
            style={{ backgroundColor: 'white' }}
          >
            <div className="flex w-full">
              {/* Project details */}
              <div className="text-xs font-mono font-medium p-6 flex-shrink-0">
                <div className="grid grid-cols-2 mb-4">
                  <div className="uppercase">
                    <p>Location</p>
                    <p>Status</p>
                    <p>Cost</p>
                    <p>Year</p>
                    <p>Partners</p>
                  </div>
                  <div>
                    <p>{project.location}</p>
                    <p>{project.progress}</p>
                    <p>{project.cost}</p>
                    <p>{project.year}</p>
                    <p>{project.partners}</p>
                  </div>
                </div>
                {project.description?.map((descText, index) => (
                  <div className="w-[30rem] p-2" key={index}>
                    {descText}
                  </div>
                ))}
              </div>

              {/* Gallery */}
              {imageSizes.length === project.gallery?.length && (
                <div className="flex items-center gap-10 px-6">
                  {project.gallery.map((image, index) => {
                    const { width, height } = imageSizes[index];
                    return (
                      <img
                        key={index}
                        className="object-cover flex-shrink-0"
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        style={{ width: `${width}px`, height: `${height}px` }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Next project */}
              <div className="ml-6 relative flex-shrink-0">
                <img
                  src={nextProject.image}
                  className="w-[20rem] h-full object-cover"
                  alt="Project Image"
                />
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute top-1/2 text-gray-300 font-mono text-sm">
                  <div
                    className="flex p-2 flex-col cursor-pointer"
                    onClick={() => handleNavigate(`/projects/${nextProject.slug}`)}
                  >
                    Next project:
                    <span className="text-white">{nextProject.title}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Fixed UI elements */}
      <div className="fixed h-full left-0 top-0 z-[100] bg-transparent text-xs text-white pointer-events-none">
        <div
          className="mt-8 text-black font-bold flex gap-4 md:px-1 py-1 -rotate-180"
          style={{ writingMode: "vertical-lr" }}
        >
          <p>
            <span className="border text-[8px] py-1 md:px-[0.15rem] rounded-full">
              Y
            </span>{" "}
            {mousePos.y}
          </p>
          <p>
            <span className="border text-[8px] py-1 md:px-[0.15rem] rounded-full">
              H
            </span>{" "}
            {screenSize.height}
          </p>
        </div>
      </div>

      <div
        className="fixed left-0 top-1/2 z-[100] -translate-y-1/2 text-center font-bold text-xs text-black -rotate-180 pointer-events-none"
        style={{ writingMode: "vertical-lr" }}
      >
        {Math.floor(screenSize.height / 2)}
      </div>

      <div className="fixed w-full h-6 bg-transparent top-0 z-[100] text-black pointer-events-none">
        <div
          className="fixed top-0 z-[101] font-bold text-xs text-black"
          style={{ left: `${mousePos.x - 12}px` }}
        >
          {mousePos.x - screenSize.height}
        </div>
      </div>

      <div className="fixed h-full w-6 bg-transparent top-0 right-0 z-[100] text-black pointer-events-none">
        <div
          className="fixed font-bold text-xs right-0 text-black"
          style={{ top: `${mousePos.y - 12}px`, writingMode: "vertical-lr" }}
        >
          {screenSize.height - mousePos.y * 2}
        </div>
      </div>

      <div className="fixed bg-transparent w-full bottom-0 right-6 z-[100] font-bold text-xs text-white pointer-events-none">
        <div className="text-black flex justify-end gap-4 md:px-2 md:py-1">
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
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-[101] text-center text-black">
            {Math.floor(screenSize.width / 2)}
          </div>
        </div>
      </div>

      {/* Crosshair cursor */}
      <div
        className="pointer-events-none fixed z-[101] top-0 bottom-0 w-px bg-[#999692]/50"
        style={{ left: `${mousePos.x}px` }}
      />
      <div
        className="pointer-events-none fixed z-[101] left-0 right-0 h-px bg-[#999692]/50"
        style={{ top: `${mousePos.y}px` }}
      />
      <div
        className={`pointer-events-none fixed z-[105] ${
          isHoveringNav ? `w-20 h-20` : `w-3 h-3`
        } transition-transform duration-75 ease-out`}
        style={{
          transform: `translate(${mousePos.x - cursorOffset}px, ${
            mousePos.y - cursorOffset
          }px) rotate(${isHoveringNav ? 45 : 0}deg)`,
        }}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white opacity-70" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-70" />
      </div>

      <NavBar />

      <div className="absolute bottom-0 pointer-events-none">
        <MarqueeText text={project.slug} speed={100} />
      </div>

      {/* Scroll indicator */}
      {/* <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] text-black text-xs font-mono">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
          <span>Scroll: {Math.round(scrollX)}px</span>
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
        </div>
      </div> */}
    </div>
  );
};

export default ProjectDetailClient;