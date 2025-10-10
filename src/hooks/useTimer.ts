import { useState, useEffect, useCallback, useRef } from "react";

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  totalTime: number;
}

export const useTimer = (initialMinutes: number) => {
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalTime] = useState(initialMinutes * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(totalTime);
  }, [totalTime]);

  const cancel = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(totalTime);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [totalTime]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  // Save state to localStorage
  useEffect(() => {
    if (isRunning || isPaused) {
      localStorage.setItem(
        "timerState",
        JSON.stringify({
          timeRemaining,
          isRunning,
          isPaused,
          totalTime,
          timestamp: Date.now(),
        })
      );
    }
  }, [timeRemaining, isRunning, isPaused, totalTime]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timeRemaining]);

  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  return {
    timeRemaining,
    isRunning,
    isPaused,
    totalTime,
    start,
    pause,
    resume,
    reset,
    cancel,
    formatTime,
    progress,
    isComplete: timeRemaining === 0 && !isRunning,
  };
};
