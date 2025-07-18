"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { originalProjects } from "@/public/data/projects";
import { useRouter } from "next/navigation";
import CircularText from "@/components/CircularText";
import { useNavigate } from "../../hooks/useNavigate";

// Constants
const MOBILE_BREAKPOINT = 768;
const CURSOR_OFFSET_DEFAULT = 6;
const CURSOR_OFFSET_HOVER = 40;
const SCROLL_THRESHOLD = 100;

const TYPE_FILTERS = ["Commercial", "Hospitality", "Residential"];
const PROGRESS_FILTERS = ["Completed", "Conceptual Designs", "Under Construction"];

// Animation variants
const containerVariants = {
  closed: (data) => ({
    width: data.isScrolled ? "100%" : data.closedMenuWidth,
    height: "80px",
    bottom: data.isScrolled ? "auto" : "8rem",
    top: data.isScrolled ? "0rem" : "auto",
    left: "50%",
    x: "-50%",
    opacity: 1,
    scale: 1,
    borderRadius: data.isScrolled ? "0rem" : "0.75rem",
    pointerEvents: "auto",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.7,
    },
  }),
  open: {
    width: "100%",
    height: "100%",
    bottom: "0",
    top: "0",
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
    return window.innerWidth < MOBILE_BREAKPOINT ? "90vw" : "45vw";
  }
  return "40vw";
};

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

export default function VerticalProjectScroll() {
  const router = useRouter();

  // State management
  const [isLeaving, setIsLeaving] = useState(false);
  const [closedMenuWidth, setClosedMenuWidth] = useState(getClosedMenuWidth());
  const [viewMode, setViewMode] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedProgressFilters, setSelectedProgressFilters] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
    const { navigate } = useNavigate();
        const [isNavigating, setIsNavigating] = useState(false);
  // Refs
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const rafRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Memoized filtered projects
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

  // Create double array for display (2 times only)
  const displayProjects = useMemo(() => {
    return [...filteredProjects, ...filteredProjects];
  }, [filteredProjects]);

  // Event handlers
  const handleMouseMove = useCallback((e) => {
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

  // Initialize event listeners
  useEffect(() => {
    handleResize();

    const handleMouseMoveThrottled = (e) => {
      requestAnimationFrame(() => handleMouseMove(e));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMoveThrottled);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOver);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMoveThrottled);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOver);
    };
  }, [handleResize, handleMouseMove, handleMouseOver]);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

    // Scroll handler for menu position
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Update scroll state
      setIsScrolled(scrollTop > SCROLL_THRESHOLD);

      // Reset scroll state after inactivity (optional)
      scrollTimeoutRef.current = setTimeout(() => {
        // setIsScrolled(false);
      }, 2000);
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
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [displayProjects.length]);


    const handleNavigation = useCallback(
    (href) => {
      setIsNavigating(true);
      navigate(href);
    },
    [navigate]
  );

  // Render methods
  const renderCoordinateDisplay = () => (
    <>
      <div className="fixed h-full left-0 top-0 z-[102] bg-[#b4aea7] text-xs text-white">
        <div
          className="mt-8 text-black font-bold flex gap-4 px-1 py-1 -rotate-180"
          style={{ writingMode: "vertical-lr" }}
        >
          <p>
            <span className="border text-[8px] py-1 px-[0.15rem] rounded-full">
              Y
            </span>{" "}
            {mousePos.y}
          </p>
          <p>
            <span className="border text-[8px] py-1 px-[0.15rem] rounded-full">
              H
            </span>{" "}
            {screenSize.height}
          </p>
        </div>
      </div>

      <div
        className="fixed left-0 top-1/2 z-[102] -translate-y-1/2 text-center font-bold text-xs text-black -rotate-180"
        style={{ writingMode: "vertical-lr" }}
      >
        {Math.floor(screenSize.height / 2)}
      </div>

      <div className="fixed w-full h-4 md:h-6 bg-[#b4aea7] top-0 z-[100] text-black">
        <div
          className="fixed top-0 z-[101] font-bold text-xs text-black"
          style={{ left: `${mousePos.x - 12}px` }}
        >
          {mousePos.x - screenSize.height}
        </div>

        <div className="fixed lg:hidden top-0 -translate-x-1/2 left-1/2 z-[101] font-bold text-xs text-black">
          [Feature Projects]
        </div>
      </div>

      <div className="fixed h-full w-4 lg:w-6 bg-[#b4aea7] top-0 right-0 z-[100] text-black">
        <div
          className="fixed font-bold text-xs right-0 text-black"
          style={{ top: `${mousePos.y - 12}px`, writingMode: "vertical-lr" }}
        >
          {screenSize.height - mousePos.y * 2}
        </div>
      </div>

      <div className="fixed bg-[#b4aea7] w-full bottom-0 right-0 z-[100] font-bold text-xs text-white">
        <div className="text-black flex justify-end gap-4 px-6 py-0 md:py-1">
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
    const cursorOffset = isHoveringNav ? CURSOR_OFFSET_HOVER : CURSOR_OFFSET_DEFAULT;

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

  const renderProjectGrid = () => (
    <div
      ref={containerRef}
      className="relative mx-auto z-[90] w-[98%] p-4 md:p-6 h-full overflow-y-scroll transition-all duration-700 ease-out space-y-4 pb-10 scrollbar-hide"
    >
      <div ref={contentRef} className="flex flex-col gap-4 md:gap-6">
        {displayProjects.map((proj, i) => {
          const isPriority = i < 6; // First 6 images for priority loading

          return (
            <motion.div
              key={`${proj.slug}-${i}`}
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => handleProjectClick(proj.slug)}
              className="relative w-full overflow-hidden rounded-lg shadow-lg cursor-pointer will-change-transform hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={proj.image}
                alt={proj.title}
                width={viewMode === 2 ? 300 : 800}
                height={viewMode === 2 ? 200 : 600}
                className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
                  viewMode === 2 ? "h-[150px] md:h-[200px]" : "h-[300px] md:h-[500px]"
                }`}
                priority={isPriority}
                quality={viewMode === 2 ? 70 : 85}
                loading={isPriority ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7/2Q=="
                sizes={viewMode === 2 ? "(max-width: 768px) 100vw, 300px" : "(max-width: 768px) 100vw, 800px"}
              />
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

              <div className="font-quicksand absolute top-2 left-2 text-white text-lg md:text-3xl p-2 rounded-lg">
                <h1 className="font-bold drop-shadow-lg">{proj.title}</h1>
              </div>

              <div className="font-quicksand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-center flex-col md:flex-row text-white text-xs space-x-0 md:space-x-2 space-y-2 md:space-y-0 p-2 rounded-lg">
              {[proj.title, proj.type, proj.progress, proj.location].map(
                (item, i) => (
                  <motion.span
                    key={i}
                    className="px-3 py-1 text-center font-medium font-mono rounded-full bg-black/30 backdrop-blur-sm text-[0.80rem]"
                    variants={metaVariants}
                    custom={i}
                  >
                    {item}
                  </motion.span>
                )
              )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderMenu = () => (
    <AnimatePresence>
      <motion.div
        className={`fixed z-[9999] ${
          isOpen ? "bg-black/40" : "bg-black/20"
        } backdrop-blur-xl text-white flex flex-col`}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={containerVariants}
        custom={{ closedMenuWidth, isScrolled }}
        exit={{
          opacity: 0,
          y: 50,
          transition: { duration: 0.5 },
        }}
      >
        <div className="flex justify-between items-center px-4 py-1">
          <div>
            <h1 className="text-xs md:text-sm font-quicksand font-semibold tracking-wide">
              STELLER
            </h1>
            <h1 className="text-xs md:text-sm font-quicksand font-semibold tracking-wide">
              DESIGN
            </h1>
            <h1 className="text-xs md:text-sm font-quicksand font-semibold tracking-wide">
              LAB
            </h1>
          </div>

          <div className={`hidden ${
            isOpen ? "lg:hidden" : "lg:grid"
          } grid-cols-2 md:grid-cols-3 gap-2 p-2 text-xs font-mono items-start font-semibold`}>
            {[...TYPE_FILTERS, ...PROGRESS_FILTERS].map((filter) => (
              <button
                key={filter}
                onClick={() =>
                  TYPE_FILTERS.includes(filter)
                    ? handleTypeFilterToggle(filter)
                    : handleProgressFilterToggle(filter)
                }
                className={`px-2 py-1 rounded transition-colors duration-200 ${
                  (TYPE_FILTERS.includes(filter) && selectedTypes.includes(filter)) ||
                  (PROGRESS_FILTERS.includes(filter) && selectedProgressFilters.includes(filter))
                    ? "bg-white/20 text-white"
                    : "bg-transparent text-gray-100 hover:text-white hover:bg-white/10"
                }`}
                aria-pressed={
                  TYPE_FILTERS.includes(filter)
                    ? selectedTypes.includes(filter)
                    : selectedProgressFilters.includes(filter)
                }
                aria-label={`Toggle ${filter} filter`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={toggleMenu}
            className="group relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 ease-in-out rounded-full hover:bg-white/10"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <div className={`absolute w-8 md:w-12 h-px bg-white transition-all duration-300 ease-in-out ${
              isOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
            }`} />
            <div className={`absolute w-8 md:w-12 h-px bg-white transition-all duration-300 ease-in-out ${
              isOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
            }`} />
          </button>
        </div>

        {isOpen && (
          <AnimatePresence>
            <motion.div
              className="flex relative flex-col items-center justify-center h-[calc(100%-80px)] p-4"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Decorative grid lines */}
              {[
                { position: "left-1/2 -translate-x-1/2", key: "center" },
                { position: "left-1", key: "left" },
                { position: "right-1", key: "right" },
              ].map(({ position, key }) => (
                <div
                  key={key}
                  className={`absolute ${position} top-0 bottom-0 flex flex-col justify-between h-full w-1`}
                >
                  {Array(7)
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={`line-${key}-${idx}`}
                        className={`w-full h-1 ${
                          idx === 0 ? "bg-gray-100/60" : "bg-white/60"
                        }`}
                      />
                    ))}
                </div>
              ))}

              {/* Navigation Links */}
                  <nav className="text-xl md:text-5xl gap-[5rem] font-montserrat grid grid-cols-2 items-center md:gap-[15rem] font-bold z-10">
                    <button
                      onClick={() => handleNavigation("/")}
                      className="block text-white hover:text-gray-100 transition-colors duration-200"
                      // onMouseEnter={() => setIsHoveringNav(true)}
                      // onMouseLeave={() => setIsHoveringNav(false)}
                    >
                      HOMEPAGE
                    </button>
                    <button
                      onClick={() => handleNavigation("/projects")}
                      className="block text-white hover:text-gray-100 transition-colors duration-200"
                      // onMouseEnter={() => setIsHoveringNav(true)}
                      // onMouseLeave={() => setIsHoveringNav(false)}
                    >
                      PROJECTS
                    </button>
                    <button
                      onClick={() => handleNavigation("/about")}
                      // className="block text-white hover:text-gray-100 transition-colors duration-200"
                      // onMouseEnter={() => setIsHoveringNav(true)}
                      // onMouseLeave={() => setIsHoveringNav(false)}
                    >
                      ABOUT US
                    </button>
                    <button
                      onClick={() => handleNavigation("/contact")}
                      className="block text-white hover:text-gray-100 transition-colors duration-200"
                      // onMouseEnter={() => setIsHoveringNav(true)}
                      // onMouseLeave={() => setIsHoveringNav(false)}
                    >
                      CONTACT
                    </button>
                  </nav>

              {/* Footer */}
              <div className="flex flex-col md:flex-row w-full justify-start md:justify-between items-start md:items-center absolute bottom-6 font-quicksand text-xs font-light px-4 md:px-6 z-10 space-y-3 md:space-y-0">
                <p className="flex flex-col">
                  stellar builtech, Kargi chowk
                  <span>Dehradun, 248121</span>
                </p>
                <p className="flex flex-col">
                  info@stellardesignlab.com
                  <span>+91 7819001855</span>
                </p>
                <div className="flex justify-center items-center space-x-3 text-lg">
                  <a
                    href="https://www.facebook.com/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors duration-200"
                    aria-label="Facebook"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://www.instagram.com/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 transition-colors duration-200"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-500 transition-colors duration-200"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      <div className="absolute top-1/2 left-6 -translate-x-1/2 -translate-y-1/2 text-xs z-[999]">
        <CircularText
          text="SCROLL*DOWN*SCROLL*DOWN*"
          onHover="speedUp"
          spinDuration={20}
          className="custom-class"
        />
      </div>

      {renderCoordinateDisplay()}
      {renderCursor()}

      {/* Loading overlay */}
      {isLeaving && (
        <motion.div
          className="fixed inset-0 z-[999] bg-[#211d1d]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}

      {renderProjectGrid()}
      {renderMenu()}
    </div>
  );
}