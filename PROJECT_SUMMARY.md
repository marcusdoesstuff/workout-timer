# Workout Timer App - Project Summary

## Project Overview
A tempo-based workout timer app focusing on controlled movement training (like the 4010 tempo format shown in the reference image).

## MVP Scope
Single workout block with:
- **Prep Time**: Preparation period before exercise starts (0-99 seconds)
- **Reps**: Number of repetitions (1-99)
- **Tempo**: 4-phase timing (Down-Hold-Up-Pause) 
- **Sets**: Number of sets (1-99)
- **Rest**: Rest period between sets (0-999 seconds)
- **Exercise Name**: Text label for the workout

## Technical Requirements

### Platform & Framework
- **Primary**: Web app (desktop)
- **Future**: Android mobile app (wrapped with Capacitor)
- **Stack**: React + TypeScript + Vite + Tailwind CSS
- **Audio**: Web Audio API for clicks/beeps
- **Storage**: LocalStorage only (no server)

### Tempo System
- **Format**: 4-digit tempo (e.g., 3131)
- **Phases**: Down → Hold → Up → Pause
- **Constraints**: 
  - Down/Up: minimum 1 second
  - Hold/Pause: minimum 0 seconds
- **Input**: 4 separate number inputs with steppers

### Audio & Visual Cues
- **Audio**: Simple clicks and beeps (gym environment friendly)
- **Visual**: 
  - Progress bars for current phase
  - Phase indicators (●○○○)
  - Large countdown timer
  - All 4 tempo numbers always visible

## UI Design Principles

### Layout
- **Horizontal**: Compact, efficient layout
- **Touch-Friendly**: Designed for mobile from start
- **Click-to-Edit**: All numbers can be clicked to type manually
- **Steppers**: Up/down arrows for all numeric inputs

### Workout Setup Layout
```
[Exercise Name Field]
[Prep] [Reps] [Tempo Block: Down-Hold-Up-Pause] [Sets][Rest]
```

### Workout Timer Interface
- **Unified Activity View**: Single screen showing all workout phases
- **Current Activity Highlight**: Top section with current exercise/phase details
- **Activity List**: Scrollable timeline of entire workout sequence
- **Tap-to-Skip**: Users can tap any activity to jump to that point
- **Lock Mechanism**: Toggle to prevent accidental skips during workout
- **Automatic Scrolling**: So the next workout activities are easily visible

### Timer Controls
- **Lock/Unlock**: Toggle to disable activity skipping
- **Pause/Resume**: Available during any phase (exercise or rest)
- **Activity Navigation**: Tap any item in activity list to jump to it

## Data Structure (Planned)

```typescript
interface WorkoutBlock {
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

interface WorkoutState {
  phase: 'prep' | 'exercise' | 'rest' | 'completed';
  currentSet: number;
  currentRep: number;
  currentTempoPhase: 'down' | 'hold' | 'up' | 'pause';
  timeRemaining: number;
  isLocked: boolean;
  isPaused: boolean;
}
```

## Timer States

### Preparation Phase
- Prep countdown timer
- "Get ready" messaging
- Smooth transition to first exercise set

### Exercise Phase
- **Set-based progression**: Each set contains multiple reps
- **Rep cycle**: Each rep = complete tempo sequence (Down → Hold → Up → Pause)
- **Tempo progression**: Count down each phase individually:
  1. Down phase: Count down from tempo.down to 0
  2. Hold phase: Count down from tempo.hold to 0 (if > 0)
  3. Up phase: Count down from tempo.up to 0
  4. Pause phase: Count down from tempo.pause to 0 (if > 0)
- **Rep completion**: After pause phase, increment rep count and start next rep
- **Set completion**: After all reps finished, move to rest or next set
- Current tempo phase highlighted with visual indicators

### Rest Phase
- Rest countdown timer integrated into activity list
- Visual indication of current rest period
- Set transition context (Set X → Set X+1)

### Activity List Management
- **Set-level display**: Shows sets, not individual reps
- **Activity structure**: Prep → Set 1 → Rest → Set 2 → Rest → Set 3 → Complete
- Real-time highlighting of current activity (prep/set/rest)
- Complete workout timeline visible
- Skip-ahead and skip-back functionality
- Lock state prevents accidental navigation

## Deferred Features
- Multiple workout blocks
- Workout chains/sequences
- Progress tracking/history
- Exercise categories
- Export/import
- Server-side storage
- Advanced rest block types

## Development Priority
1. ✅ Project setup (React/Vite/Tailwind)
2. 🔄 Workout setup form with horizontal layout
3. 🔄 Tempo input component with steppers
4. 🔄 Core timer logic and state management
5. 🔄 Timer display with phase indicators
6. 🔄 Audio cue system
7. 🔄 Navigation controls (set/rep skipping)
8. 🔄 Rest timer functionality
9. 🔄 LocalStorage persistence
10. 🔄 Mobile optimization and testing 