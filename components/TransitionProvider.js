"use client";
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const TransitionContext = createContext();

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [transitionType, setTransitionType] = useState('circle');
  const router = useRouter();
  const animationRef = useRef(null);

  const transitionTypes = ['circle', 'slide', 'morphing'];
  
  const startTransition = (href, type = 'circle') => {
    setIsTransitioning(true);
    setTransitionProgress(0);
    setTransitionType(type || transitionTypes[Math.floor(Math.random() * transitionTypes.length)]);
    
    // Smooth progress animation using RAF for better performance
    const startTime = Date.now();
    const duration = 1000; // 500ms to reach 85%
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 85, 85);
      
      setTransitionProgress(progress);
      
      if (progress < 85) {
        animationRef.current = requestAnimationFrame(animateProgress);
      }
    };
    
    animationRef.current = requestAnimationFrame(animateProgress);

    // Navigate after overlay covers screen
    setTimeout(() => {
      router.push(href);
    }, 400);
  };

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle navigation completion
  useEffect(() => {
    const handleComplete = () => {
      setTransitionProgress(100);
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionProgress(0);
      }, 300);
    };

    if (typeof window !== 'undefined') {
      const originalPush = router.push;
      router.push = (...args) => {
        const result = originalPush.apply(router, args);
        setTimeout(handleComplete, 100);
        return result;
      };
    }
  }, [router]);

  // Optimized transition variants
  const transitionVariants = {
    circle: {
      initial: { clipPath: "circle(0% at 50% 50%)" },
      animate: { clipPath: "circle(150% at 50% 50%)" },
      exit: { clipPath: "circle(0% at 50% 50%)" }
    },
    slide: {
      initial: { x: "100%" },
      animate: { x: "0%" },
      exit: { x: "-100%" }
    },
    morphing: {
      initial: { 
        clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)"
      },
      animate: { 
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
      },
      exit: { 
        clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
      }
    }
  };

  const LoadingSpinner = () => (
    <div className="relative w-12 h-12">
      <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      <motion.div
        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );

  const ProgressBar = () => (
    <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-white/90 to-white/60 rounded-full"
        style={{ width: `${transitionProgress}%` }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />
    </div>
  );

  return (
    <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
      {children}
      
      {/* Global Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 bg-gray-800 z-[10001] flex items-center justify-center"
            initial={transitionVariants[transitionType].initial}
            animate={transitionVariants[transitionType].animate}
            exit={transitionVariants[transitionType].exit}
            transition={{ 
              duration: 0.6, 
              ease: [0.76, 0, 0.24, 1]
            }}
          >
            {/* Main content */}
            <motion.div
              className="text-white text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                delay: 0.1,
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <LoadingSpinner />
              
              <motion.div
                className="mt-6 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-light text-sm tracking-wide">
                  {transitionProgress < 30 ? 'Loading...' : 
                   transitionProgress < 70 ? 'Almost there...' : 'Ready!'}
                </p>
                
                <ProgressBar />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
};