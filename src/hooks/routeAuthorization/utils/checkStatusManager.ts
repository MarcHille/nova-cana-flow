
import { useState, useCallback } from 'react';
import { CheckStatus } from '../types/roleCheckTypes';

/**
 * A hook that manages the status of role checking operations
 */
export const useCheckStatusManager = () => {
  const [checkedStatus, setCheckedStatus] = useState<CheckStatus>('loading');
  
  const startChecking = useCallback(() => {
    setCheckedStatus('loading');
  }, []);
  
  const completeChecking = useCallback(() => {
    setCheckedStatus('complete');
  }, []);
  
  return {
    checkedStatus,
    startChecking,
    completeChecking
  };
};
