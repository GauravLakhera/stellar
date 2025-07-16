"use client";
import React, { useEffect, useState,useRef } from "react";
import Lenis from '@studio-freight/lenis';

import { TextAnimate } from "@/components/magicui/text-animate";
import CircularText from "../../components/CircularText";
import Navbar from "@/components/NavBar";
import NavbarAbout from "@/components/NavbarAbout";
import { cn } from "@/lib/utils";
import TeamSection from "../../components/TeamSection";
import Gallery from "../../components/Gallery";

const page = () => {
    const lenisRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const cursorOffset = isHoveringNav ? 40 : 6;

  const teamData = [
    {
      name: "Aditi Rao",
      position: "Principal Architect",
      description:
        "Aditi Rao leads Stellar Design Lab with a passion for socially engaged architecture. She brings over fifteen years of experience in sustainable design, working on community-driven schools, low-income housing, and urban infill projects that strengthen neighborhoods without displacing residents. Aditi believes that well-crafted space should be a tool for social equity. Her work has been recognized by local preservation societies and international sustainability awards. At SDL she oversees all major projects, mentors junior designers, and directs in-house research on new bio-based building materials. She sits on the board of the National Trust for Historic Preservation and regularly lectures on the role of architecture in community resilience. Beyond the studio, Aditi volunteers with Habitat for Humanity and enjoys teaching free weekend drawing classes to underserved youth. In her free time you’ll find her exploring vernacular architecture across the American South or curled up with a good book on phenomenology of space.",
      image: "/images/team2.jpg",
    },
    {
      name: "Karan Singh",
      position: "Design Lead",
      description:
        "As SDL’s Design Lead, Karan Singh merges rigorous conceptual thinking with playful material experiments. With a background in parametric design and digital fabrication, he has spearheaded award-winning installations, pop-ups, and corporate interiors that blend craft and computation. Karan is especially known for his inventive use of cross-laminated timber and recycled metal components to create warm, tactile environments. He leads SDL’s in-house “lab days,” where the team tests novel assemblies in 1:1 mockups. His projects have appeared in Architect Magazine’s “Top 50 Designs” and have been exhibited at the Cooper Hewitt Smithsonian Design Museum. Outside work, Karan pursues landscape painting and mentors emerging architects through AIA’s mentorship program. He’s a voracious reader of design theory and moonlights as a DJ under the moniker DJ Parametric.",
      image: "/images/team1.jpg",
    },
  ];
  const awardsData = [
    {
      year: "2024",
      title: "Excellence in Rehabilitation Award",
      description:
        "The Georgia Trust for Historic Preservation Wheat Street Christian Education Building",
    },
    {
      year: "2023",
      title: "AIA Design Award",
      description: "Sustainable Urban Housing Project - Phase II",
    },
    {
      year: "2022",
      title: "Green Building Leadership Award",
      description: "Community Eco-Hub Initiative - National Recognition",
    },
    {
      year: "2021",
      title: "Historic Preservation Award",
      description: "Adaptive Reuse of Old Mill District",
    },
  ];
useEffect(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  lenisRef.current = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return () => {
    lenis.destroy();
  };
}, []);
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
  return (
    <>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:30px_30px]",
          "[background-image:linear-gradient(to_right,#c7c2bb_0px,transparent_0.5px),linear-gradient(to_bottom,#c7c2bb_0px,transparent_0px)]",
          "z-0"
        )}
      />
      <div className="fixed h-full left-0 top-0 z-[100]  text-xs text-white">
        <div
          className="mt-8 text-black  font-bold flex gap-4 md:px-1 py-1 -rotate-180"
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
        className="fixed left-0 top-1/2 z-[100] -translate-y-1/2 text-center font-bold text-xs text-black -rotate-180"
        style={{ writingMode: "vertical-lr" }}
      >
        {Math.floor(screenSize.height / 2)}
      </div>

      <div className="fixed w-full h-4 md:h-6  top-0 z-[100] text-black">
        <div
          className="fixed top-0 z-[101] font-bold text-xs text-black"
          style={{ left: `${mousePos.x - 12}px` }}
        >
          {mousePos.x - screenSize.height}
        </div>

        <div className="fixed lg:hidden top-0 -translate-x-1/2 left-1/2 z-[101] font-bold text-xs text-black">
          [Feture Projects]
        </div>
      </div>

      <div className="fixed h-full w-4 lg:w-6  top-0 right-0 z-[100] text-black">
        <div
          className="fixed font-bold text-xs right-0 text-black"
          style={{ top: `${mousePos.y - 12}px`, writingMode: "vertical-lr" }}
        >
          {screenSize.height - mousePos.y * 2}
        </div>
      </div>

      <div className="fixed  w-full bottom-0 right-0 z-[100] font-bold text-xs text-white">
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
      <NavbarAbout />
      {/* main content  */}
      <div className="bg-blue-100/70">
        {/* top section */}
        <div className="p-6 h-screen relative ">
          <div className=" text-3xl lg:text-5xl font-gilroy font-bold tracking-[-2px] uppercase">
            <TextAnimate animation="fadeIn" by="line" as="p">
              {`Stellar Design Lab is a research-based \n\ndesign studio headquartered in India, \n\ndriven by the conviction that well-crafted space can \n\ncatalyze positive social and ecological change.`}
            </TextAnimate>
          </div>

          <div className="absolute text-xs flex w-full justify-between left-0 p-6 -translate-y-1/2 top-1/2 ">
            <p>[ About</p>
            <p> Steller ]</p>
          </div>

          <div className="absolute bottom-6 text-xs left-6">
            <ul className=" flex gap-6 list-disc">
              <li>TEAM</li>
              <li>APPROACH</li>
              <li>CAREERS</li>
              <li>AWARDS</li>
            </ul>
          </div>
          <div className="absolute top-1/2 left-6 -translate-x-1/2 -translate-y-1/2 text-xs ">
            <CircularText
              text="SCROLL*DOWN*SCROLL*DOWN*"
              onHover="speedUp"
              spinDuration={20}
              className="custom-class"
            />
          </div>
        </div>
        {/* team section */}
        <div className=" p-6 z-[9999]">
          <TeamSection team={teamData} />
        </div>
        {/* Our Culture */}
        <div className="relative px-6 py-10  h-screen ">
          <div className="grid lg:grid-cols-4 grid-cols-1 gap-3 text-xs h-screen font-mono">
            <div className="lg:sticky lg:top-[calc(80vh-5rem)] self-start">
              {/* <button
                onClick={() => setShowGallery(true)}
                className="flex  w-[20rem] font-bold py-1 justify-between"
              >
                <span>SEE US</span>
                <span>IN ACTION </span>
              </button> */}
              {showGallery && <Gallery onClose={() => setShowGallery(false)} />}
              <img
                src="/images/bg2.jpg"
                className="w-[20rem] h-[15rem] object-cover grayscale"
              ></img>
            </div>
            <div>
              <h1>Our Culture</h1>
              <h1>[00-4]</h1>
            </div>
            <div>
              <h1>1.0</h1>
              <p>
                As architects, our ultimate goal is to examine the needs of our
                users and provide a creative design solution that serves as a
                catalyst for positive living. Architects have the ability to
                influence social environments through sculpting space, and by
                examining those user needs and desires early on we are able to
                cycle through many design opportunities that ultimately yields a
                solution uniquely catered to each and every client.
              </p>
            </div>
            <div className="space-y-5">
              <h1>2.0</h1>
              <p>
                There are many phases to the architectural design process
                (Programming, Schematic Design, Design Development, Construction
                Documents, Construction Administration, just to name a few!)
                that are used to integrate variables such as urban context,
                accessibility, social impact, health & safety, performance, and
                artistry. All of which we examine to determine design drivers
                for each project.
              </p>
              <h1>3.0</h1>
              <p>
                A prime component to our process is through collaboration. This
                is key to the best design solutions, and that collaboration
                comes from our own internal team but also engagement of the
                community and users. Each project presents a new collaborative
                opportunity that requires research, exploration, and discovery.
                It is this process that inevitably provides a refined design
                solution that would not have been achievable if not for the team
                involved. Constraints and problems are viewed as opportunities
                for creative problem solving and can give life to new ideas.
              </p>
              <p className="uppercase">
                We strive to deliver creative solutions for clients that give
                them a space to thrive.
              </p>
            </div>
          </div>
        </div>
        {/* Our Culture */}
        <div className=" py-20 mt-10 md:t-5">
          <h1 className="text-start lg:text-center text-3xl lg:text-5xl w-8/12 lg:mx-auto px-6 -tracking-wider font-gilroy uppercase">
            We constantly search for innovative, strategic, and imaginative
            individuals to enhance our team
          </h1>
          <div className="flex flex-col lg:flex-row justify-between text-xs p-6 font-mono font-light">
            <p className="font-semibold hidden lg:block">[ work with us ]</p>
            <div className="w-6/12 lg:w-2/12">
              <p>view positions</p>
              <div className="border flex justify-end border-black">
                <svg
                  className="w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-external-link-icon lucide-external-link"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </div>
            </div>
            <p className="font-gilroy mt-5 lg:mt-0 text-lg lg:w-4/12 -tracking-widest leading-tight uppercase font-bold">
              If you would like to work with us, but can’t find a suitable role,
              please send your application to hello@radga.com
            </p>
          </div>
        </div>

        {/* Awards */}
        {/* Awards Section */}
        <div className="w-full lg:w-8/12 flex flex-col lg:flex-row lg:justify-between py-10 pb-96 mb-10 px-4 md:px-6 mx-auto">
          <div className="mb-8 lg:mb-0">
            <h1 className="text-xl md:text-2xl font-bold">Awards</h1>
          </div>
          
          <div className="flex-1 lg:ml-12">
            {awardsData.map((award, index) => (
              <div
                key={index}
                className="flex gap-4 md:gap-10 text-xs md:text-sm font-mono uppercase mb-6"
              >
                <h1 className="text-xl">•</h1>
                <h1 className="min-w-[3rem]">{award.year}</h1>
                <div className="flex-1">
                  <p className="font-semibold mb-1">{award.title}</p>
                  <p className="text-gray-600 leading-relaxed">{award.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
