import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

export function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ["var(--journey-gold)", "var(--journey-rose)", "var(--journey-beige)"];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.5,
      });
    }

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ x: `${particle.x}vw`, y: "-10vh", opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            x: `${particle.x + (Math.random() - 0.5) * 30}vw`,
            opacity: [1, 1, 0],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: particle.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
          }}
        />
      ))}
    </div>
  );
}
