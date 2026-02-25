// src/components/AnimatedCounter.jsx
import React, { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

const AnimatedCounter = ({ value, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px 0px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, value, {
        duration: 1.2, // Smooth 1.2 second spin-up
        ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
        onUpdate(currentValue) {
          if (ref.current) {
            // Format dynamically as it counts up
            ref.current.textContent = new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: 'USD',
              maximumFractionDigits: 0 // Keep it clean without cents during animation
            }).format(currentValue);
          }
        },
      });
      return () => controls.stop();
    }
  }, [value, isInView]);

  return <span ref={ref} className={className}>{/* Empty to start, Framer fills it */}</span>;
};

export default AnimatedCounter;