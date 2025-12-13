import { motion } from "motion/react";
import { Lock, Unlock, Heart, Sparkles, Gift, Star } from "lucide-react";

interface LevelCardProps {
  day: number;
  isUnlocked: boolean;
  isCurrent: boolean;
  title: string;
  message: string;
  description: string;
  onClick?: () => void;
}

const icons = [Heart, Sparkles, Gift, Star];

export function LevelCard({
  day,
  isUnlocked,
  isCurrent,
  title,
  message,
  description,
  onClick,
}: LevelCardProps) {
  const Icon = icons[day - 1] || Heart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: day * 0.1 }}
      onClick={isUnlocked ? onClick : undefined}
      className={`
        relative overflow-hidden rounded-3xl p-6 backdrop-blur-sm
        transition-all duration-300
        ${
          isUnlocked
            ? "bg-[var(--journey-card-bg)] border border-[var(--journey-beige)]/20 cursor-pointer hover:border-[var(--journey-gold)]/40 hover:shadow-[0_8px_30px_rgba(201,169,97,0.2)]"
            : "bg-[var(--journey-charcoal)]/40 border border-[var(--journey-beige)]/10"
        }
        ${isCurrent && isUnlocked ? "shadow-[0_0_40px_rgba(201,169,97,0.3)]" : ""}
      `}
    >
      {/* Glow effect for unlocked current card */}
      {isCurrent && isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-[var(--journey-gold)]/10 to-[var(--journey-rose)]/10 rounded-3xl"
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: 0 }}
              animate={isUnlocked ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={`p-2.5 rounded-2xl ${
                isUnlocked
                  ? "bg-gradient-to-br from-[var(--journey-rose)]/20 to-[var(--journey-gold)]/20"
                  : "bg-[var(--journey-charcoal)]/60"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  isUnlocked ? "text-[var(--journey-gold)]" : "text-[var(--journey-beige)]/20"
                }`}
              />
            </motion.div>
            <div>
              <h3
                className={`${
                  isUnlocked ? "text-[var(--journey-beige)]" : "text-[var(--journey-beige)]/30"
                }`}
              >
                {title}
              </h3>
            </div>
          </div>

          {/* Lock/Unlock Icon */}
          <motion.div
            initial={{ scale: 1 }}
            animate={
              isUnlocked
                ? { scale: [1, 1.2], rotate: [0, 15] }
                : {}
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {isUnlocked ? (
              <Unlock className="w-5 h-5 text-[var(--journey-gold)]" />
            ) : (
              <Lock className="w-5 h-5 text-[var(--journey-beige)]/20" />
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div
          className={`space-y-3 ${
            isUnlocked ? "opacity-100" : "opacity-30 blur-sm pointer-events-none"
          }`}
        >
          <p
            className="text-[var(--journey-rose)] italic"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            {message}
          </p>
          <p className="text-[var(--journey-beige)]/80 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Particle effect for unlocked cards */}
        {isUnlocked && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5] }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--journey-gold)]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5] }}
              transition={{ duration: 1.5, delay: 0.4 }}
              className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full bg-[var(--journey-rose)]"
            />
          </>
        )}
      </div>
    </motion.div>
  );
}