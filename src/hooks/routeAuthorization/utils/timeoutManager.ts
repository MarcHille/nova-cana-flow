
import { useRef, useEffect } from 'react';

/**
 * A hook that manages timeouts for asynchronous operations
 * with proper cleanup
 */
export const useTimeoutManager = () => {
  const timeoutIdRef = useRef<number | undefined>(undefined);
  
  const clearSafetyTimeout = () => {
    if (timeoutIdRef.current) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = undefined;
    }
  };
  
  const setSafetyTimeout = (callback: () => void, delay: number) => {
    clearSafetyTimeout();
    timeoutIdRef.current = window.setTimeout(callback, delay);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearSafetyTimeout();
    };
  }, []);
  
  return {
    setSafetyTimeout,
    clearSafetyTimeout
  };
};
