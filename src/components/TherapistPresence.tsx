'use client';

import { useEffect, useState } from 'react';

export default function TherapistPresence() {
  const [orbitAngle, setOrbitAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getOrbitPosition = (angle: number, offset: number) => {
    const radius = 60;
    const adjustedAngle = (angle + offset) * (Math.PI / 180);
    return {
      x: Math.cos(adjustedAngle) * radius,
      y: Math.sin(adjustedAngle) * radius,
    };
  };

  return (
    <div data-testid="therapist-presence" role="status" aria-label="Therapist presence indicator" className="relative">
      <div data-testid="therapist-avatar" className="glass flex h-32 w-32 animate-breathe items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
        <div data-testid="pulse-indicator" className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary opacity-80" />
      </div>

      {[0, 120, 240].map((offset, i) => {
        const pos = getOrbitPosition(orbitAngle, offset);
        return (
          <div
            key={i}
            className="absolute h-3 w-3 rounded-full bg-primary/40"
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px)`,
              left: '50%',
              top: '50%',
              marginLeft: '-6px',
              marginTop: '-6px',
            }}
          />
        );
      })}

      <div className="absolute -inset-10 flex items-center justify-center">
        <p data-testid="therapist-text" className="mt-40 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Hi, I&apos;m here to listen and support you
        </p>
      </div>
    </div>
  );
}
