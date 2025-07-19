"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";

// Constants
const MOBILE_BREAKPOINT = 768;
const CURSOR_OFFSET_DEFAULT = 6;
const CURSOR_OFFSET_HOVER = 40;

// Utility functions
const getClosedMenuWidth = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth < MOBILE_BREAKPOINT ? "90vw" : "40vw";
  }
  return "40vw";
};

// Main component
export default function contactUs() {
  const router = useRouter();

  // State management - minimized state updates
  const [isLeaving, setIsLeaving] = useState(false);
  const [closedMenuWidth, setClosedMenuWidth] = useState(getClosedMenuWidth());

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    services: [],
    spaceType: "",
    timeline: "",
    budget: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const lastScrollTime = useRef(0);

  // Service options
  const serviceOptions = [
    "Architectural Design",
    "Interior Design",
    "Licensing / Sanctions",
    "Turnkey Execution",
    "Interior + Architecture",
    "Interior + Turnkey",
    "Architecture + Interior + Turnkey",
  ];

  // Space type options
  const spaceTypeOptions = [
    "Studio / 1BHK (400–600 sq.ft.)",
    "2BHK (700–1000 sq.ft.)",
    "3BHK (1000–1500 sq.ft.)",
    "Villa / Duplex (2000+ sq.ft.)",
    "Commercial Space",
    "Other",
  ];

  // Timeline options
  const timelineOptions = [
    "Immediately",
    "Within 1 month",
    "1–3 months",
    "3–6 months",
    "Just exploring for now",
  ];

  // Initialize EmailJS
  useEffect(() => {
    // Replace with your actual EmailJS keys
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
  }, []);

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
    const isInteractiveElement = [
      "a",
      "button",
      "img",
      "input",
      "select",
      "textarea",
    ].includes(tag);
    setIsHoveringNav(isInteractiveElement);
  }, []);

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceToggle = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.phone.trim()) return "Phone number is required";
    if (!formData.email.trim()) return "Email is required";
    if (formData.services.length === 0)
      return "Please select at least one service";
    if (!formData.spaceType) return "Please select a space type";
    if (!formData.timeline) return "Please select a timeline";

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return "Please enter a valid email address";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setSubmitError(error);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Prepare email template parameters
      const templateParams = {
        to_name: "Stellar Design Team",
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        services: formData.services.join(", "),
        space_type: formData.spaceType,
        timeline: formData.timeline,
        budget: formData.budget || "Not specified",
        message: `
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Services: ${formData.services.join(", ")}
Space Type: ${formData.spaceType}
Timeline: ${formData.timeline}
Budget: ${formData.budget || "Not specified"}
        `,
      };

      // Send email using EmailJS
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams
      );

      setIsSubmitted(true);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setSubmitError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        className="pointer-events-none fixed z-[101] top-0 bottom-0 w-px bg-blue-50"
        style={{ left: `${mousePos.x}px` }}
      />
      <div
        className="pointer-events-none fixed z-[101] left-0 right-0 h-px bg-blue-50"
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
                Tell us what you're thinking
              </p>

              <div className="border-t border-black/40 w-full" />

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <label className="block italic text-black/70">
                    What's your name?
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-black/40 focus:outline-none mt-1 placeholder:text-black/40"
                      placeholder=""
                      required
                    />
                  </label>

                  {/* Phone */}
                  <label className="block italic text-black/70">
                    Where can we reach you? (Phone / WhatsApp preferred)
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-black/40 focus:outline-none mt-1 placeholder:text-black/40"
                      placeholder=""
                      required
                    />
                  </label>

                  {/* Email */}
                  <label className="block italic text-black/70">
                    What email address works best for you?
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-black/40 focus:outline-none mt-1 placeholder:text-black/40"
                      placeholder=""
                      required
                    />
                  </label>

                  {/* Services */}
                  <div className="block italic text-black/70">
                    What kind of service are you looking for?
                    <div className="mt-2 space-y-2">
                      {serviceOptions.map((service) => (
                        <label
                          key={service}
                          className="flex items-center space-x-2 text-xs not-italic"
                        >
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="form-checkbox h-3 w-3 text-black/80"
                          />
                          <span>{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Space Type */}
                  <label className="block italic text-black/70">
                    What space are we designing for?
                    <select
                      value={formData.spaceType}
                      onChange={(e) =>
                        handleInputChange("spaceType", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-black/40 focus:outline-none mt-1 text-black/80"
                      required
                    >
                      <option value="">Select space type</option>
                      {spaceTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Other space type input */}
                  {formData.spaceType === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      onChange={(e) =>
                        handleInputChange("spaceType", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-black/40 focus:outline-none mt-1 placeholder:text-black/40"
                    />
                  )}

                  {/* Timeline */}
                  <label className="block italic text-black/70">
                    When do you plan to start?
                    <select
                      value={formData.timeline}
                      onChange={(e) =>
                        handleInputChange("timeline", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-black/40 focus:outline-none mt-1 text-black/80"
                      required
                    >
                      <option value="">Select timeline</option>
                      {timelineOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Budget */}
                  <label className="block italic text-black/70">
                    What's your budget range (optional)?
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) =>
                        handleInputChange("budget", e.target.value)
                      }
                      className="w-full bg-transparent border-b border-black/40 focus:outline-none mt-1 placeholder:text-black/40"
                      placeholder="e.g. ₹10–15 lakhs"
                    />
                  </label>

                  {/* Error message */}
                  {submitError && (
                    <div className="text-red-600 text-xs italic">
                      {submitError}
                    </div>
                  )}

                  {/* Submit button */}
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 text-xs bg-black/10 hover:bg-black/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                    </button>
                  </div>

                  <div className="text-center text-xs italic text-black/60 mt-4">
                    Let's create something timeless together.
                  </div>
                </form>
              ) : (
                /* Success message */
                <div className="text-center py-12">
                  <h4 className="text-lg font-bold text-black/80 mb-4">
                    Message sent successfully!
                  </h4>
                  <p className="text-black/70 italic">
                    Thank you for reaching out. We will get back to you soon.
                  </p>
                  <p className="text-xs text-black/60 mt-4 italic">
                    Let's create something timeless together.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-xs text-black/60">
            {/* Address Block */}
            <div>
              <p>Stellar builtech, Kargi chowk</p>
              <p>Dehradun , 248121</p>
              <br />
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
