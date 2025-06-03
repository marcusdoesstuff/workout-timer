import { useEffect, useState } from 'react';

interface ProgressCircleProps {
  duration: number; // Duration in seconds
  isPaused: boolean;
  isActive: boolean;
  onComplete?: () => void;
}

export default function ProgressCircle({ duration, isPaused, isActive, onComplete }: ProgressCircleProps) {
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when duration changes or becomes active
  useEffect(() => {
    if (isActive && duration > 0) {
      setAnimationKey(prev => prev + 1);
    }
  }, [duration, isActive]);

  // Handle completion - note this is just a backup, the real timer logic handles progression
  useEffect(() => {
    if (isActive && !isPaused && duration > 0) {
      const timeout = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, duration * 1000);
      return () => clearTimeout(timeout);
    }
  }, [animationKey, isPaused, duration, onComplete]);

  if (!isActive || duration === 0) {
    return null;
  }

  const circumference = 2 * Math.PI * 16; // radius = 16 for a 40x40 circle (w-10 h-10)

  return (
    <>
      <style>
        {`
          @keyframes progressRing {
            from {
              stroke-dashoffset: ${circumference};
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          .progress-ring-${animationKey} {
            animation: progressRing ${duration}s linear;
            animation-play-state: ${isPaused ? 'paused' : 'running'};
            animation-fill-mode: forwards;
          }
        `}
      </style>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          width="40" 
          height="40" 
          className="transform -rotate-90"
          style={{ zIndex: 10 }}
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className={`text-blue-600 progress-ring-${animationKey}`}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
      </div>
    </>
  );
} 