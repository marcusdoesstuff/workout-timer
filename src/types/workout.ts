export type BlockType = 'tempo' | '2-step' | 'stretch';

export interface WorkoutBlock {
  id: string;
  exerciseName: string;
  prepSeconds: number;    // 0-99
  reps: number;           // 1-99
  sets: number;           // 1-99
  restSeconds: number;    // 0-999
  blockType: BlockType;
  tempo?: {
    down: number;         // 1-9
    hold: number;         // 0-9
    up: number;           // 1-9
    pause: number;        // 0-9
  };
  tempoFlipped?: boolean; // For tempo blocks: whether to display up-first
  twoStep?: {
    contract: number;     // 1-9
    relax: number;        // 1-9
  };
  stretch?: {
    hold: number;         // 1-99 (can be longer for stretches)
  };
}

export interface WorkoutState {
  phase: 'prep' | 'exercise' | 'rest' | 'completed';
  currentSet: number;
  currentRep: number;
  currentTempoPhase: 'down' | 'hold' | 'up' | 'pause' | 'contract' | 'relax' | 'stretch';
  timeRemaining: number;
  isLocked: boolean;
  isPaused: boolean;
}

export type TempoPhase = 'down' | 'hold' | 'up' | 'pause' | 'contract' | 'relax' | 'stretch';

// New types for enhanced functionality
export interface SavedWorkoutBlock extends WorkoutBlock {
  createdAt: Date;
  lastModified: Date;
}

export interface FullWorkout {
  id: string;
  name: string;
  workoutBlocks: WorkoutBlock[];  // Ordered sequence
  createdAt: Date;
  lastModified: Date;
}

export interface FullWorkoutState {
  currentBlockIndex: number;
  blockState: WorkoutState;
  totalBlocks: number;
  expandedBlockIndex: number;  // Which block is expanded in timeline
  isCompleted: boolean;
}

// Navigation context for returning to correct screen
export type NavigationContext = 'build-workout' | 'block-library';

// Local storage structure
export interface AppStorage {
  savedBlocks: SavedWorkoutBlock[];
  savedWorkouts: FullWorkout[];
  version: string;
} 