
import { useRef } from 'react';

interface AdminCacheEntry {
  userId: string;
  isAdmin: boolean;
  timestamp: number;
}

/**
 * A hook that manages caching of admin status to reduce
 * unnecessary backend calls
 */
export const useAdminStatusCache = () => {
  const lastAdminCheckRef = useRef<AdminCacheEntry | null>(null);
  const ADMIN_CACHE_MAX_AGE = 5 * 60 * 1000; // 5 minutes in ms
  
  const getCachedAdminStatus = (userId: string): boolean | null => {
    const now = Date.now();
    
    if (lastAdminCheckRef.current && 
        lastAdminCheckRef.current.userId === userId && 
        (now - lastAdminCheckRef.current.timestamp) < ADMIN_CACHE_MAX_AGE) {
      return lastAdminCheckRef.current.isAdmin;
    }
    
    return null;
  };
  
  const setCachedAdminStatus = (userId: string, isAdmin: boolean) => {
    lastAdminCheckRef.current = { 
      userId, 
      isAdmin, 
      timestamp: Date.now() 
    };
  };
  
  return {
    getCachedAdminStatus,
    setCachedAdminStatus
  };
};
