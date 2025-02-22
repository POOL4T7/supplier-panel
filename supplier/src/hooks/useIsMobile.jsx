import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the screen width is at or below a specified breakpoint.
 * @param {number} breakpoint - The pixel width to determine mobile view. Default is 768px.
 * @returns {boolean} - Returns true if the screen width is at or below the breakpoint.
 */
export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= breakpoint
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}
