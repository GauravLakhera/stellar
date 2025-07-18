"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { useNavigate } from "../hooks/useNavigate";
export default function NavbarAbout() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const toggleMenu = () => setIsOpen((o) => !o);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isNavigating, setIsNavigating] = useState(false);
  const { navigate } = useNavigate();

  const isTouch = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    );
  }, []);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setScreenSize({ width, height });

    setIsMobile(width < 768);
  }, []);

  // Detect mobile
  useEffect(() => {
    const upd = () => setIsMobile(window.innerWidth < 768);
    if (typeof window !== "undefined") {
      upd();
      window.addEventListener("resize", upd);
      return () => window.removeEventListener("resize", upd);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    if (!isTouch) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (!isTouch) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [, handleMouseMove, isTouch]);

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    if (!isTouch) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (!isTouch) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [handleResize, handleMouseMove, isTouch]);

  // Detect scroll bottom
  useEffect(() => {
    const onScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      setIsAtBottom(bottom);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigation = useCallback(
    (href) => {
      setIsNavigating(true);
      navigate(href);
    },
    [navigate]
  );

  // Variants for all three states
  const rootVariants = {
    navbar: {
      bottom: "10rem", // tailwind bottom-10
      width: isMobile ? "80%" : "41.666667%", // 3/12 or 5/12
      height: "80px",
      left: "50%",
      x: "-50%",
      borderRadius: "0.75rem",
      transition: { type: "spring", stiffness: 200, damping: 25 },
    },
    footer: {
      bottom: "0%",
      width: "100%",
      height: "350px",
      left: "0%",
      x: "0",
      borderRadius: "0",
      transition: { type: "spring", stiffness: 160, damping: 22 },
    },
    open: {
      bottom: "0%",
      width: "100%",
      height: "100%",
      left: "0%",
      x: "0",
      borderRadius: "0",
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
    enter: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  };

  // decide which variant to show
  const current = isOpen ? "open" : isAtBottom ? "footer" : "navbar";

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed z-[9999] ${
          isOpen ? `bg-black/40` : `bg-black/10`
        }   backdrop-blur-xl text-white overflow-hidden`}
        variants={rootVariants}
        initial={false}
        animate={current}
        style={{ position: "fixed" }}
      >
        {/* content */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            // —————— FULL‑SCREEN MENU ——————
            <motion.div
              key="menu"
              className="w-full h-full flex flex-col items-center justify-center p-6"
              variants={contentVariants}
              initial="hidden"
              animate="enter"
              exit="exit"
            >
              {/* Custom Cursor (only visible when menu is open) */}
              <button
                onClick={toggleMenu}
                className="absolute top-6 right-6 text-white text-2xl"
              >
                ✕
              </button>
              {/* Decorative grid lines */}
              <div className="absolute left-1/2 top-0 bottom-0 flex flex-col justify-between h-full -translate-x-1/2 w-1">
                {Array(7)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={`line-center-${idx}`}
                      className={`w-full h-1 ${
                        idx === 0 ? "bg-gray-100/60" : "bg-white/60"
                      }`}
                    ></div>
                  ))}
              </div>
              <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between h-full w-1">
                {Array(7)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={`line-left-${idx}`}
                      className={`w-full h-1 ${
                        idx === 0 ? "bg-gray-100/60" : "bg-white/60"
                      }`}
                    ></div>
                  ))}
              </div>
              <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-between h-full w-1">
                {Array(7)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={`line-right-${idx}`}
                      className={`w-full h-1 ${
                        idx === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    ></div>
                  ))}
              </div>

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

              {/* Footer contact info and social links */}
              <div className="flex px-10 md:flex-row flex-col w-full justify-start md:justify-between items-start space-y-3 md:space-y-0 md:items-center absolute bottom-6 font-quicksand text-xs font-light md:px-3 z-10">
                <p className="flex flex-col">
                  stellar builtech, Kargi chowk
                  <span>Dehradun , 248121</span>
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
          ) : isAtBottom ? (
            // —————— FOOTER MODE ——————
            <motion.div
              key="footer"
              className="w-full h-full bg-[#211d1d] flex flex-col md:flex-row justify-between items-center  text-xs md:text-sm font-quicksand"
              variants={contentVariants}
              initial="hidden"
              animate="enter"
              exit="exit"
            >
              <div className="h-[22rem] w-full  relative bg-[#211d1d]  z-[102]  px-6 text-white/80">
                <div className="absolute inset-0 w-full pointer-events-none">
                  <TextHoverEffect text="SDL" />
                </div>

                <div className="flex flex-col gap-6 lg:flex-row justify-between items-start text-sm pt-3 font-mono font-medium">
                  <div className="md:w-3/12">
                    <div className="text-xs flex justify-center lg:justify-start items-center font-mono gap-4 ">
                      <Link href="/">HOMEPAGE</Link>
                      <Link href="/project">PROJECT</Link>
                      <Link href="/about">ABOUT</Link>
                      <Link href="/contact">CONTACT</Link>
                    </div>
                    <p className="font-mono text-start lg:text-start text-xs mt-4">
                      Rooted in a philosophy of lifestyle architecture, our work
                      fuses intuitive design with refined aesthetics to create
                      environments that nurture, inspire, and transform.
                    </p>
                  </div>

                  <div className=" text-xs">
                    <p> stellar builtech, Kargi chowk</p>
                    <p> Dehradun , 248121</p>
                  </div>
                  <div className="text-xs">
                    <p>+91 7819001855</p>
                    <p>info@stellardesignlab.com</p>
                  </div>
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
                <div>
                  <div className="absolute w-full bg-transparent bottom-2 right-0 z-[100] font-bold text-xs text-white">
                    <div className="text-white/50 flex justify-end gap-4 md:px-4 md:py-1">
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
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-[101] text-center">
                        {Math.floor(screenSize.width / 2)}
                      </div>
                      <div className="absolute px-1 bottom-0 left-0 transform  z-[101] text-center">
                        <p className=" text-xs text-gray-500">
                          &copy; 2025 Stellar.
                        </p>
                        <p className="text-xs text-gray-500">
                          {" "}
                          All rights reserved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div>
          <div className="absolute w-full bg-transparent bottom-2 right-0 z-[100] font-bold text-xs text-white">
            <div className="text-white/50 flex justify-end gap-4 md:px-4 md:py-1">
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
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-[101] text-center">
                {Math.floor(screenSize.width / 2)}
              </div>
              <div className="absolute bottom-0 left-14 transform -translate-x-1/2 z-[101] text-center">
                <button onClick={() => handleNavigation("/privacy-policy")}>Privacy policy</button>
              </div>
            </div>
          </div>
        </div> */}
              </div>
            </motion.div>
          ) : (
            // —————— NAVBAR MODE ——————
            <motion.div
              key="navbar"
              className="w-full text-black h-full px-6 flex justify-between items-center"
              variants={contentVariants}
              initial="hidden"
              animate="enter"
              exit="exit"
            >
              <div>
                <h1 className="text-xs md:text-sm font-quicksand font-semibold tracking-wide">
                  STELLAR
                </h1>
                <h1 className="text-xs md:text-sm font-quicksand font-semibold tracking-wide">
                  DESIGN
                </h1>
                <h1 className="text-xs md:text-sm font-quicksand font-semibold tracking-wide">
                  LAB
                </h1>
              </div>
              <button
                onClick={toggleMenu}
                className="group relative w-16 h-16 flex items-center justify-center rounded-full hover:bg-white/10 transition"
              >
                <div className="absolute w-14 h-px bg-black group-hover:rotate-45 -translate-y-2 transition" />
                <div className="absolute w-14 h-px bg-black group-hover:-rotate-45 translate-y-2 transition" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
