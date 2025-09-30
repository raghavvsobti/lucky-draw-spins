import { useState, useEffect, useCallback } from 'react';

export const useLotteryTimer = (onSpin: () => void) => {
  const [timeUntilSpin, setTimeUntilSpin] = useState<number>(0);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);

  const getNextSpinTime = useCallback(() => {
    const now = new Date();
    const next = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    return next;
  }, []);

  const resetTimer = useCallback(() => {
    const next = getNextSpinTime();
    setNextSpinTime(next);
    localStorage.setItem('nextSpinTime', next.toISOString());
  }, [getNextSpinTime]);

  const formatTime = useCallback((ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    // Check if there's a saved next spin time
    const savedTime = localStorage.getItem('nextSpinTime');
    if (savedTime) {
      const saved = new Date(savedTime);
      const now = new Date();
      
      if (saved > now) {
        setNextSpinTime(saved);
      } else {
        // Time has passed, trigger spin and reset
        resetTimer();
        setTimeout(onSpin, 1000); // Small delay to allow UI to load
      }
    } else {
      resetTimer();
    }
  }, [onSpin, resetTimer]);

  useEffect(() => {
    if (!nextSpinTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextSpinTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeUntilSpin(0);
        onSpin();
        resetTimer();
      } else {
        setTimeUntilSpin(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextSpinTime, onSpin, resetTimer]);

  return {
    timeUntilSpin,
    formattedTime: formatTime(timeUntilSpin),
    resetTimer,
  };
};