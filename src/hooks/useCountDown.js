import { useEffect, useRef, useState } from "react";

export default function useCountdown(initialSeconds = 60) {
  const [countdown, setCountdown] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const start = (seconds = initialSeconds) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(seconds);
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setCountdown(0);
    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current); // cleanup on unmount
    };
  }, []);

  return { countdown, isActive, start, reset };
}
