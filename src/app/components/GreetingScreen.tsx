import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface GreetingData {
  day: number;
  emoji: string;
  title: string;
  greeting: string;
  message: string;
  decorativeEmojis: string[];
}

interface GreetingScreenProps {
  day: number;
  onClose: () => void;
  greetings?: GreetingData[];
}

const greetingData: GreetingData[] = [
  {
    day: 1,
    emoji: "💛",
    title: "Day 1",
    greeting: "Good morning, sunshine!",
    message:
      "Today starts with something small but meaningful. I hope this brings a smile to your face and warmth to your day. You deserve all the good things.",
    decorativeEmojis: ["🌸", "✨", "☁️", "🌷", "⭐", "💫", "🌼", "🎀"],
  },
  {
    day: 2,
    emoji: "💗",
    title: "Day 2",
    greeting: "Hello again, friend!",
    message:
      "Another day, another little surprise. This one's to remind you that someone's thinking of you, even in the quiet moments. Keep being wonderful.",
    decorativeEmojis: ["🌈", "🦋", "💐", "🌺", "✨", "🎈", "🌙", "⭐"],
  },
  {
    day: 3,
    emoji: "🌟",
    title: "Day 3",
    greeting: "You're doing great!",
    message:
      "Three days in, and here we are. This little gift is for all the times you've been strong, kind, and yourself. Thank you for simply being you.",
    decorativeEmojis: ["🌻", "☀️", "🍃", "🌿", "✨", "🎀", "💫", "🌸"],
  },
  {
    day: 4,
    emoji: "🎉",
    title: "Day 4",
    greeting: "We made it to the final day!",
    message:
      "This is the last piece of this small journey. Every gift was chosen with care, just for you. I hope these days brought you a bit of joy. You're appreciated more than you know.",
    decorativeEmojis: ["🎊", "✨", "🎁", "💝", "🌟", "🎈", "🫶", "😊", "💛"],
  },
];

export function GreetingScreen({ day, onClose, greetings }: GreetingScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const dataToUse = greetings || greetingData;
  const greeting = dataToUse[day - 1];

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  // Confetti particles
  const ConfettiParticles = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -50,
            opacity: 1,
            scale: 0,
          }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.8],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
          className="absolute text-2xl"
        >
          {greeting.decorativeEmojis[i % greeting.decorativeEmojis.length]}
        </motion.div>
      ))}
    </div>
  );

  // Floating emoji stickers
  const FloatingEmoji = ({
    emoji,
    delay,
    position,
  }: {
    emoji: string;
    delay: number;
    position: { top?: string; bottom?: string; left?: string; right?: string };
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: [
          Math.random() * 20 - 10,
          Math.random() * 20 - 10,
          Math.random() * 20 - 10,
        ],
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute text-4xl md:text-5xl pointer-events-none select-none"
      style={{
        ...position,
        filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))",
      }}
    >
      {emoji}
    </motion.div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(135deg, #fff5f5 0%, #fffbf0 50%, #f0f8ff 100%)",
        }}
        onClick={onClose}
      >
        {/* Confetti on entry */}
        {showConfetti && <ConfettiParticles />}

        {/* Floating emoji decorations */}
        <FloatingEmoji emoji="🌸" delay={0.2} position={{ top: "10%", left: "8%" }} />
        <FloatingEmoji emoji="✨" delay={0.3} position={{ top: "15%", right: "12%" }} />
        <FloatingEmoji emoji="💛" delay={0.4} position={{ top: "25%", left: "5%" }} />
        <FloatingEmoji emoji="🌷" delay={0.5} position={{ top: "60%", left: "10%" }} />
        <FloatingEmoji emoji="⭐" delay={0.6} position={{ top: "70%", right: "8%" }} />
        <FloatingEmoji emoji="☁️" delay={0.7} position={{ bottom: "15%", left: "15%" }} />
        <FloatingEmoji emoji="🎀" delay={0.8} position={{ bottom: "25%", right: "10%" }} />
        <FloatingEmoji emoji="🌼" delay={0.9} position={{ top: "40%", right: "5%" }} />

        {/* Main card */}
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ duration: 0.5, type: "spring", damping: 20 }}
          className="relative max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/60 hover:bg-white/80 transition-colors shadow-md"
          >
            <X className="w-5 h-5 text-gray-600" />
          </motion.button>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center space-y-6"
          >
            {/* Day title with emoji */}
            <div className="space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ delay: 0.2, duration: 0.3, type: "spring", bounce: 0.5 }}
                className="text-6xl mb-2"
              >
                {greeting.emoji}
              </motion.div>
              <h2
                className="text-2xl md:text-3xl text-gray-800"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {greeting.title}
              </h2>
            </div>

            {/* Main greeting */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-3xl md:text-4xl text-gray-900 leading-relaxed px-2"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {greeting.greeting}
            </motion.h1>

            {/* Emotional message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-gray-700 leading-relaxed text-base md:text-lg px-2"
            >
              {greeting.message}
            </motion.p>

            {/* Decorative sparkle effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
              transition={{
                delay: 0.9,
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="text-2xl"
            >
              ✨
            </motion.div>

            {/* Bottom emoji row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex justify-center gap-3 pt-4"
            >
              {greeting.decorativeEmojis.slice(0, 5).map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 1 + i * 0.1,
                    duration: 0.5,
                    type: "spring",
                  }}
                  className="text-2xl opacity-60"
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Subtle glow effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-pink-100/30 via-yellow-100/30 to-blue-100/30 pointer-events-none"
          />
        </motion.div>

        {/* Tap anywhere hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute bottom-8 text-gray-500 text-sm"
        >
          Tap anywhere to close
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}