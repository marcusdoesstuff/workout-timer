export interface WorkoutBlock {
  id: string;
  exerciseName: string;
  prepSeconds: number;    // 0-99
  reps: number;           // 1-99
  sets: number;           // 1-99
  restSeconds: number;    // 0-999
  tempo: {
    down: number;         // 1-9
    hold: number;         // 0-9
    up: number;           // 1-9
    pause: number;        // 0-9
  };
}

export interface WorkoutState {
  phase: 'prep' | 'exercise' | 'rest' | 'completed';
  currentSet: number;
  currentRep: number;
  currentTempoPhase: 'down' | 'hold' | 'up' | 'pause';
  timeRemaining: number;
  isLocked: boolean;
  isPaused: boolean;
}

export type TempoPhase = 'down' | 'hold' | 'up' | 'pause'; 