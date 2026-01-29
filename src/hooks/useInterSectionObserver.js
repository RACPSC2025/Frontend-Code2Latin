import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsIntersecting(entry.isIntersecting);
      },
      {
        // Options (Optional)
        root: null, // null means it observes the viewport
        rootMargin: '0px',
        threshold: 0.5 // The observer will trigger when at least 50% of the target is visible
      }
    );
    observer.observe(div);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}
