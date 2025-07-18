"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { originalProjects } from "@/public/data/projects";
import { useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";

// Constants
const MOBILE_BREAKPOINT = 768;
const CURSOR_OFFSET_DEFAULT = 6;
const CURSOR_OFFSET_HOVER = 40;

const TYPE_FILTERS = ["Commercial", "Residential", "Social Impact"];
const PROGRESS_FILTERS = ["Completed", "Active Build", "Design/Planning"];

// Animation variants
const containerVariants = {
  closed: (closedMenuWidth) => ({
    width: closedMenuWidth,
    height: "100px",
    bottom: "5rem",
    left: "50%",
    x: "-50%",
    opacity: 1,
    scale: 1,
    borderRadius: "0.75rem",
    pointerEvents: "auto",
  }),
  open: {
    width: "100%",
    height: "100%",
    bottom: "0",
    left: "0",
    x: "0",
    opacity: 1,
    scale: 1,
    borderRadius: "0",
    pointerEvents: "auto",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.7,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.9,
    },
  },
};

// Utility functions
const getClosedMenuWidth = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth < MOBILE_BREAKPOINT ? "90vw" : "40vw";
  }
  return "40vw";
};

const getProgressValue = (filter) => {
  switch (filter) {
    case "Completed":
      return "completed";
    case "Active Build":
    case "Design/Planning":
      return "ongoing";
    default:
      return null;
  }
};

// Main component
export default function contactUs() {
  const router = useRouter();

  // State management - minimized state updates
  const [isLeaving, setIsLeaving] = useState(false);
  const [closedMenuWidth, setClosedMenuWidth] = useState(getClosedMenuWidth());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedProgressFilters, setSelectedProgressFilters] = useState([]);

  // Refs
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const rafRef = useRef(null);
  const scrollAnimationRef = useRef(null);
  const lastScrollTime = useRef(0);
  const currentScrollTop = useRef(0);

  // Memoized values - optimized filtering
  const originalProjectsCount = useMemo(() => originalProjects.length, []);

  const selectedProgressValues = useMemo(() => {
    return [
      ...new Set(selectedProgressFilters.map(getProgressValue).filter(Boolean)),
    ];
  }, [selectedProgressFilters]);

  const filteredProjects = useMemo(() => {
    return originalProjects.filter((project) => {
      const typeMatch =
        selectedTypes.length === 0 ||
        selectedTypes.some((type) =>
          project.type.toLowerCase().includes(type.toLowerCase())
        );
      const progressMatch =
        selectedProgressValues.length === 0 ||
        selectedProgressValues.includes(project.progress);
      return typeMatch && progressMatch;
    });
  }, [selectedTypes, selectedProgressValues]);

  // Create triple array for infinite scroll
  const infiniteProjects = useMemo(() => {
    const projects = [
      ...filteredProjects,
      ...filteredProjects,
      ...filteredProjects,
    ];
    return projects;
  }, [filteredProjects]);

  // Event handlers - optimized with throttling
  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 16) return; // 60fps throttle
    lastScrollTime.current = now;
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleResize = useCallback(() => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setClosedMenuWidth(getClosedMenuWidth());
  }, []);

  const handleMouseOver = useCallback((e) => {
    const tag = e.target.tagName.toLowerCase();
    const isInteractiveElement = ["a", "button", "img"].includes(tag);
    setIsHoveringNav(isInteractiveElement);
  }, []);

  const handleProjectClick = useCallback(
    (slug) => {
      setIsLeaving(true);
      setTimeout(() => {
        router.push(`/projects/${slug}`);
      }, 500);
    },
    [router]
  );

  const handleTypeFilterToggle = useCallback((filter) => {
    setSelectedTypes((prev) =>
      prev.includes(filter)
        ? prev.filter((t) => t !== filter)
        : [...prev, filter]
    );
  }, []);

  const handleProgressFilterToggle = useCallback((filter) => {
    setSelectedProgressFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // Effects
  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOver);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOver);
    };
  }, [handleResize, handleMouseMove, handleMouseOver]);

  // Optimized scroll effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !infiniteProjects.length) return;

    const singleSetHeight = container.scrollHeight / 3; // Height of one set of projects

    // Initialize Lenis
    const lenis = new Lenis({
      wrapper: container,
      content: contentRef.current,
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      wheelMultiplier: 1,
      touchMultiplier: 1,
      smoothTouch: false,
      normalizeWheel: true,
    });

    lenisRef.current = lenis;

    // Set initial scroll position to middle set

    // Optimized scroll handler
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      currentScrollTop.current = scrollTop;

      // Calculate and update progress bar immediately (not throttled)
      const singleSetHeight = container.scrollHeight / 3;
      const middleSetScrollTop = scrollTop - singleSetHeight;
      const progress = Math.max(
        0,
        Math.min(100, (middleSetScrollTop / singleSetHeight) * 100)
      );

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleY(${progress / 100})`;
      }
      const now = performance.now();
      if (now - lastScrollTime.current < 16) return; // 60fps throttle
      lastScrollTime.current = now;

      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }

      scrollAnimationRef.current = requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;
        currentScrollTop.current = scrollTop;

        // Infinite scroll logic - seamless looping
        if (scrollTop <= singleSetHeight * 0.1) {
          // Near top, jump to bottom of middle set
          container.scrollTop =
            singleSetHeight * 2 - (singleSetHeight * 0.1 - scrollTop);
        } else if (scrollTop >= singleSetHeight * 2.9) {
          // Near bottom, jump to top of middle set
          container.scrollTop =
            singleSetHeight + (scrollTop - singleSetHeight * 2.9);
        }

        // Calculate current slide (only from middle set)
        const middleSetScrollTop = scrollTop - singleSetHeight;
        const itemHeight = singleSetHeight / filteredProjects.length;
        const slideIndex = Math.max(
          0,
          Math.floor(middleSetScrollTop / itemHeight)
        );
        const currentSlideIndex = slideIndex % filteredProjects.length;

        setCurrentSlide(currentSlideIndex);

        // Update progress bar
        const progress = Math.max(
          0,
          Math.min(100, (Math.abs(middleSetScrollTop) / singleSetHeight) * 100)
        );
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleY(${progress / 100})`;
        }
      });
    };

    // RAF loop for Lenis
    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [infiniteProjects.length, filteredProjects.length]);

  // Render methods
  const renderCoordinateDisplay = () => (
    <>
      <div className="fixed h-full left-0 top-0 z-[100] bg-blue-100/70 text-xs text-black">
        <div
          className="mt-8 text-black/50  font-bold flex gap-4 md:px-1 py-1 -rotate-180"
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
        className="fixed left-0 top-1/2 z-[102] -translate-y-1/2 text-center font-bold text-xs text-black/50 -rotate-180"
        style={{ writingMode: "vertical-lr" }}
      >
        {Math.floor(screenSize.height / 2)}
      </div>

      <div className="fixed w-full h-4 md:h-6 bg-blue-100/70 top-0 z-[100] text-black/50">
        <div
          className="fixed top-0 z-[101] font-bold text-xs text-black/50"
          style={{ left: `${mousePos.x - 12}px` }}
        >
          {mousePos.x - screenSize.height}
        </div>

        <div className="fixed lg:hidden top-0 -translate-x-1/2 left-1/2 z-[101] font-bold text-xs text-black/50">
          [Feture Projects]
        </div>
      </div>

      <div className="fixed h-full w-4 lg:w-6 bg-blue-100/70 top-0 right-0 z-[100] text-black/50">
        <div
          className="fixed font-bold text-xs right-0 text-black/50"
          style={{ top: `${mousePos.y - 12}px`, writingMode: "vertical-lr" }}
        >
          {screenSize.height - mousePos.y * 2}
        </div>
      </div>

      <div className="fixed bg-blue-100/70 w-full bottom-0 right-0 z-[100] font-bold text-xs text-black">
        <div className="text-black/50 flex justify-end gap-4 px-6 py-0 md:py-1">
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

      <div
        className="pointer-events-none fixed z-[101] top-0 bottom-0 w-px bg-[#999692]/50"
        style={{ left: `${mousePos.x}px` }}
      />
      <div
        className="pointer-events-none fixed z-[101] left-0 right-0 h-px bg-[#999692]/50"
        style={{ top: `${mousePos.y}px` }}
      />
    </>
  );

  const renderCursor = () => {
    const cursorSize = isHoveringNav ? 20 : 3;
    const cursorOffset = isHoveringNav
      ? CURSOR_OFFSET_HOVER
      : CURSOR_OFFSET_DEFAULT;

    return (
      <div
        id="custom-cursor"
        className="pointer-events-none fixed z-[105] transition-transform duration-75 ease-out"
        style={{
          width: `${cursorSize * 4}px`,
          height: `${cursorSize * 4}px`,
          transform: `translate(${mousePos.x - cursorOffset}px, ${
            mousePos.y - cursorOffset
          }px) rotate(${isHoveringNav ? 45 : 0}deg)`,
        }}
      >
        <div className="absolute top-0 left-1/2 w-px h-1/2 bg-gray-100 opacity-70" />
        <div className="absolute bottom-0 left-1/2 w-px h-1/2 bg-gray-100 opacity-70" />
        <div className="absolute left-0 top-1/2 h-px w-1/2 bg-gray-100 opacity-70" />
        <div className="absolute right-0 top-1/2 h-px w-1/2 bg-gray-100 opacity-70" />
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen bg-white">
      {renderCoordinateDisplay()}

      {/* Crosshair lines */}
      <div
        className="pointer-events-none absolute z-[101] top-0 bottom-0 w-px bg-[#26282a]/50"
        style={{ left: `${mousePos.x}px` }}
      />
      <div
        className="pointer-events-none absolute z-[101] left-0 right-0 h-px bg-[#26282a]/50"
        style={{ top: `${mousePos.y}px` }}
      />

      {renderCursor()}

      <div className=" text-center  md:p-6 ">
        <div className="min-h-screen bg-blue-100/70 text-black px-6 md:px-16 py-20 font-mono tracking-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-b border-white/10 pb-20">
            {/* LEFT - INTRO TEXT */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
              <h3 className="text-xs text-center uppercase tracking-widest text-black/80">
                [Partner With Us]
              </h3>
              <p className="text-xs text-black/90 leading-tight max-w-lg">
                A NETWORK IS ONLY AS STRONG AS THOSE WILLING TO PARTICIPATE.
                LET'S CONNECT, GET TO KNOW EACH OTHER AND SEE HOW RAD CAN BE OF
                SERVICE.
              </p>
            </div>

            {/* RIGHT - CONTACT FORM */}
            <div className="space-y-6 text-sm text-start">
              <h4 className="uppercase text-black/80 text-xs">
                ■ Contact Form
              </h4>
              <p className="italic text-black/70">
                Tell us what you’re thinking
              </p>

              <div className="border-t border-black/40 w-full" />

              <label className="block italic text-black/70 mt-4">
                What email address can we reach you at?
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-black/40 focus:outline-none mt-1 placeholder:text-black/40"
                  placeholder=""
                />
              </label>

              <div className="flex justify-between items-end mt-4">
                <label className="block italic text-black/70 w-full">
                  What name do you go by?
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-black/40 focus:outline-none mt-1 placeholder:text-black/40"
                    placeholder=""
                  />
                </label>
                <button className="ml-4 px-4 py-2 text-xs bg-black/10 hover:bg-black/20 transition-all">
                  SEND MESSAGE
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-xs text-black/60">
            {/* Address Block */}
            <div>
              <p>Stellar builtech, Kargi chowk</p>
              <p>Dehradun , 248121</p>
              <br />
              {/* <p>933 LEE STREET</p>
              <p>ATLANTA, GEORGIA 30310</p> */}
              {/* <p className="italic text-black/50">Co-Working @ Plywood</p> */}
            </div>

            {/* Contact Info */}
            <div>
              <p>+91 7819001855</p>
              <p>info@stellardesignlab.com</p>
            </div>

            {/* Footer Branding */}
            <div className="flex justify-between items-start">
              <p>©2025 Stellar</p>
              <div className="flex space-x-4 text-xs">
                <a href="#" className="hover:text-black">
                  IG
                </a>
                <a href="#" className="hover:text-black">
                  FB
                </a>
                <a href="#" className="hover:text-black">
                  X
                </a>
                <a href="#" className="hover:text-black">
                  IN
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navbar />

      {/* Loading overlay */}
      {isLeaving && (
        <motion.div
          className="fixed inset-0 z-[999] bg-[#211d1d]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
