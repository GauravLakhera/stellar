'use client';
import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const TransitionContext = createContext();

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [targetPage, setTargetPage] = useState('');
  const router = useRouter();
  const timeoutRef = useRef();

  const startTransition = (href) => {
    if (!href) return;
    setIsTransitioning(true);
    
    // Extract page name from href
    const pageName = href.split('/').pop() || 'page';
    const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    setTargetPage(formattedPageName);
    
    // Loading text progression
    setLoadingText(`Loading ${formattedPageName}...`);
    
    setTimeout(() => {
      setLoadingText('Almost there...');
    }, 150);

    timeoutRef.current = setTimeout(() => {
      router.push(href);
      setTimeout(() => setIsTransitioning(false), 400);
    }, 300);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Minimal modern loader
  const MinimalLoader = () => (
    <motion.div
      className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );

  const transitionVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
      {children}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 bg-black backdrop-blur-sm z-[10001] flex flex-col items-center justify-center"
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <MinimalLoader />
            <motion.p
              className="text-white/80 text-sm mt-4 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
};