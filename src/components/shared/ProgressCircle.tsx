import { useEffect, useState } from 'react';

interface ProgressCircleProps {
  duration: number; // Duration in seconds
  isPaused: boolean;
  isActive: boolean;
  onComplete?: () => void; // Keeping interface but not using it
}

export default function ProgressCircle({ duration, isPaused, isActive }: ProgressCircleProps) {
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when duration changes or becomes active
  useEffect(() => {
    if (isActive && duration > 0) {
      setAnimationKey(prev => prev + 1);
    }
  }, [duration, isActive]);

  // Removed completion timeout - this component is purely visual
  // The main timer logic in useWorkoutTimer handles all timing

  if (!isActive || duration === 0) {
    return null;
  }

  // Use CSS custom properties for responsive sizing
  return (
    <>
      <style>
        {`
          @keyframes progressRing {
            from {
              stroke-dashoffset: var(--circumference);
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
          className="w-full h-full transform -rotate-90"
          style={{ zIndex: 10 }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className={`text-blue-600 progress-ring-${animationKey}`}
            strokeDasharray="282.74"
            strokeDashoffset="282.74"
            style={{ '--circumference': '282.74' } as React.CSSProperties}
          />
        </svg>
      </div>
    </>
  );
} 