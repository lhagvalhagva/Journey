import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LevelCard } from "./components/LevelCard";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { CountdownTimer } from "./components/CountdownTimer";
import { Confetti } from "./components/Confetti";
import { GreetingScreen } from "./components/GreetingScreen";
import { AdminPanel } from "./components/AdminPanel";
import { Login } from "./components/Login";
import { useAuth } from "./contexts/AuthContext";
import { getJourneyData, saveJourneyData } from "../lib/firestore";
import { LogOut } from "lucide-react";

interface Level {
  day: number;
  title: string;
  message: string;
  description: string;
}

interface GreetingData {
  day: number;
  emoji: string;
  title: string;
  greeting: string;
  message: string;
  decorativeEmojis: string[];
}

const defaultLevels: Level[] = [
  {
    day: 1,
    title: "Day 1",
    message: "Something small, something warm.",
    description:
      "A quiet gesture to brighten your morning. It's not grand, but it's made with care. Let today feel a little lighter.",
  },
  {
    day: 2,
    title: "Day 2",
    message: "For moments that need softness.",
    description:
      "Sometimes we all need something gentle to hold onto. This is meant to bring comfort in the ordinary hours.",
  },
  {
    day: 3,
    title: "Day 3",
    message: "A reminder that you're thought of.",
    description:
      "Even in the rush of everything, there's a space for stillness. This is for those in-between moments when you pause.",
  },
  {
    day: 4,
    title: "Day 4",
    message: "The last piece, given freely.",
    description:
      "Every small thing was chosen for you. Not because of what you do, but simply because you are. Thank you for being exactly who you are.",
  },
];

const defaultGreetings: GreetingData[] = [
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

export default function App() {
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [nextUnlockTime, setNextUnlockTime] = useState(new Date());
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingDay, setGreetingDay] = useState<number>(1);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [greetings, setGreetings] = useState<GreetingData[]>(defaultGreetings);
  const [levels, setLevels] = useState<Level[]>(defaultLevels);
  const [dataLoading, setDataLoading] = useState(true);

  // Load data from Firestore on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const firestoreData = await getJourneyData();
        
        if (firestoreData) {
          setGreetings(firestoreData.greetings);
          setCurrentDay(firestoreData.unlockedDays);
        } else {
          // If Firestore is empty, use default values
          // Admin can set values via Admin Panel
          console.log("No data in Firestore, using defaults");
        }
      } catch (error) {
        console.error("Error loading data from Firestore:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Calculate next unlock time (midnight of next day)
    if (currentDay < 4) {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      setNextUnlockTime(tomorrow);
    }

    // Show confetti when all levels are unlocked
    if (currentDay === 4) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [currentDay]);

  // Keyboard shortcut to open admin panel (Ctrl+Shift+A or Cmd+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "A") {
        e.preventDefault();
        setShowAdminPanel(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAdminSave = async (newGreetings: GreetingData[], unlockedDays: number) => {
    try {
      // Save to Firestore only
      await saveJourneyData(newGreetings, unlockedDays);
      // Update local state after successful save
      setGreetings(newGreetings);
      setCurrentDay(unlockedDays);
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      throw error; 
    }
  };

  // Background floating particles
  const FloatingParticles = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute w-1 h-1 rounded-full bg-[var(--journey-gold)] opacity-20"
          style={{
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );

  // Show loading while checking auth
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: "linear-gradient(135deg, var(--journey-dark-bg) 0%, var(--journey-charcoal) 100%)",
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[var(--journey-gold)]/30 border-t-[var(--journey-gold)] rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--journey-dark-bg) 0%, var(--journey-charcoal) 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Admin Panel - only show if admin is logged in */}
      {showAdminPanel && isAdmin && user && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          onSave={handleAdminSave}
          initialGreetings={greetings}
          initialUnlockedDays={currentDay}
        />
      )}

      {/* Login Modal - show when trying to access admin panel but not logged in */}
      {showAdminPanel && (!user || !isAdmin) && (
        <Login onClose={() => setShowAdminPanel(false)} />
      )}

      {/* Greeting Screen Modal */}
      {showGreeting && (
        <GreetingScreen
          day={greetingDay}
          onClose={() => setShowGreeting(false)}
          greetings={greetings}
        />
      )}

      {/* Floating background particles */}
      <FloatingParticles />

      {/* Confetti for final day */}
      {showConfetti && <Confetti />}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-6 py-12 md:px-8 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="text-[var(--journey-beige)] mb-3 text-3xl md:text-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              A Small Journey, Just for You
            </motion.h1>
            <motion.p
              className="text-[var(--journey-rose)] text-sm md:text-base opacity-80"
              style={{ fontFamily: "'Caveat', cursive" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              One day. One feeling. One small surprise.
            </motion.p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <ProgressIndicator currentDay={currentDay} totalDays={4} />
          </motion.div>

          {/* Level Cards */}
          <div className="space-y-6 mb-8">
            {levels.map((level) => (
              <LevelCard
                key={level.day}
                day={level.day}
                isUnlocked={level.day <= currentDay}
                isCurrent={level.day === currentDay}
                title={level.title}
                message={level.message}
                description={level.description}
                onClick={() => {
                  setSelectedDay(level.day);
                  setGreetingDay(level.day);
                  setShowGreeting(true);
                }}
              />
            ))}
          </div>

          {/* Countdown Timer */}
          {currentDay < 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center"
            >
              <p className="text-[var(--journey-beige)] text-sm mb-2 opacity-50">
                Next unlock in:
              </p>
              <CountdownTimer nextUnlockTime={nextUnlockTime} />
            </motion.div>
          )}

          {/* Final Message */}
          {currentDay === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-center mt-12 p-8 rounded-3xl bg-[var(--journey-card-bg)] backdrop-blur-sm border border-[var(--journey-gold)]/30"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-4xl mb-4"
              >
                ✨
              </motion.div>
              <h2 className="text-[var(--journey-gold)] mb-3">All levels unlocked</h2>
              <p
                className="text-[var(--journey-beige)] text-sm leading-relaxed"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                This was made with care. Thank you for being you.
              </p>
            </motion.div>
          )}

          {/* Admin Access Button - only show if admin is logged in */}
          {isAdmin && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
              className="mt-6 text-center space-y-3"
            >
              <button
                onClick={() => setShowAdminPanel(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg backdrop-blur-sm border border-white/10 flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Open Admin Panel
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-[var(--journey-card-bg)] text-[var(--journey-beige)] hover:bg-[var(--journey-charcoal)]/60 transition-all border border-[var(--journey-beige)]/20 flex items-center gap-2 mx-auto text-sm"
              >
                <LogOut className="w-4 h-4" />
                Гарах
              </button>
              <p className="text-[var(--journey-beige)] text-xs mt-2 opacity-40">
                Or press Ctrl+Shift+A (Cmd+Shift+A on Mac)
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}