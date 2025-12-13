import { motion } from "motion/react";

interface ProgressIndicatorProps {
  currentDay: number;
  totalDays: number;
}

export function ProgressIndicator({ currentDay, totalDays }: ProgressIndicatorProps) {
  const progress = (currentDay / totalDays) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-12">
      <div className="flex justify-between mb-3">
        {Array.from({ length: totalDays }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{
                scale: i < currentDay ? 1 : 0.8,
                opacity: i < currentDay ? 1 : 0.3,
              }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`w-3 h-3 rounded-full ${
                i < currentDay
                  ? "bg-[var(--journey-gold)] shadow-[0_0_12px_rgba(201,169,97,0.6)]"
                  : "bg-[var(--journey-beige)] opacity-20"
              }`}
            />
            <span
              className={`text-xs ${
                i < currentDay ? "text-[var(--journey-gold)]" : "text-[var(--journey-beige)] opacity-30"
              }`}
            >
              {i + 1}
            </span>
          </div>
        ))}
      </div>
      
      <div className="relative w-full h-1 bg-[var(--journey-charcoal)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute h-full bg-gradient-to-r from-[var(--journey-rose)] to-[var(--journey-gold)] shadow-[0_0_8px_rgba(201,169,97,0.5)]"
        />
      </div>
    </div>
  );
}
