import { useEffect, useRef, useState, type PropsWithChildren } from "react";

interface RevealProps {
  delay?: number;
  className?: string;
}

/**
 * Subtle fade-up on scroll. SSR-safe: content is always visible on first render
 * (no opacity:0 flash). After hydration, in-viewport elements fade in with their
 * delay; below-fold elements use IntersectionObserver.
 */
export function Reveal({ children, delay = 0, className = "" }: PropsWithChildren<RevealProps>) {
  const ref = useRef<HTMLDivElement | null>(null);
  // `shown` starts true so SSR HTML is never invisible
  const [shown, setShown] = useState(true);
  // `mounted` gates the transition styles so they only apply after JS boots
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (inViewport) {
      // Already visible: apply fade-in from translateY with the given delay
      setShown(false);
      setMounted(true);
      const timer = setTimeout(() => setShown(true), delay + 50);
      return () => clearTimeout(timer);
    }

    // Below fold: use IntersectionObserver
    setShown(false);
    setMounted(true);

    const safetyTimeout = setTimeout(() => setShown(true), 800 + delay);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          clearTimeout(safetyTimeout);
          obs.disconnect();
        }
      },
      { threshold: 0.01 }
    );
    obs.observe(el);

    return () => {
      clearTimeout(safetyTimeout);
      obs.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      style={
        mounted
          ? {
              opacity: shown ? 1 : 0,
              transform: shown ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.9s ease, transform 0.9s ease",
            }
          : undefined
      }
      className={className}
    >
      {children}
    </div>
  );
}
