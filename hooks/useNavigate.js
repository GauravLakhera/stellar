"use client";
import { useTransition } from '../components/TransitionProvider';

export const useNavigate = () => {
  const { startTransition } = useTransition();

  const navigate = (href) => {
    // Clean up any existing animations before transition
    if (typeof window !== 'undefined') {
      // Kill GSAP animations
      const gsap = window.gsap;
      if (gsap) {
        gsap.killTweensOf("*");
        const ScrollTrigger = gsap.ScrollTrigger;
        if (ScrollTrigger) {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
      }
    }
    
    startTransition(href);
  };

  return { navigate };
};