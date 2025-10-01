import { useState, useEffect, useCallback } from "react";

// Fixed spin times in 24-hour format
const SPIN_TIMES = [10, 12, 14, 16, 18, 20, 22];

export const useLotteryTimer = (onSpin: () => void) => {
  const [timeUntilSpin, setTimeUntilSpin] = useState<number>(0);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);

  const getNextSpinTime = useCallback(() => {
    const now = new Date();
    const today = new Date(now);

    // Find the next slot today
    for (const hour of SPIN_TIMES) {
      const candidate = new Date(today);
      candidate.setHours(hour, 0, 0, 0);
      if (candidate > now) {
        return candidate;
      }
    }

    // If no slot today, go to tomorrow's first slot
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(SPIN_TIMES[0], 0, 0, 0);
    return tomorrow;
  }, []);

  const resetTimer = useCallback(() => {
    const next = getNextSpinTime();
    setNextSpinTime(next);
    localStorage.setItem("nextSpinTime", next.toISOString());
  }, [getNextSpinTime]);

  const formatTime = useCallback((ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const savedTime = localStorage.getItem("nextSpinTime");
    if (savedTime) {
      const saved = new Date(savedTime);
      const now = new Date();

      if (saved > now) {
        setNextSpinTime(saved);
      } else {
        // Expired, reset to next slot
        resetTimer();
        setTimeout(onSpin, 1000);
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
