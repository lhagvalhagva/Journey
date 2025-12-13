import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  nextUnlockTime: Date;
}

export function CountdownTimer({ nextUnlockTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = nextUnlockTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Unlocking...");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextUnlockTime]);

  return (
    <div className="flex items-center justify-center gap-2 text-[var(--journey-beige)] opacity-60">
      <Clock className="w-4 h-4" />
      <span className="font-mono text-sm">{timeLeft}</span>
    </div>
  );
}
