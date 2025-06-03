# Workout Timer App

A tempo-based workout timer app focusing on controlled movement training.

## Current Status: ✅ Core Functionality Complete

### What's Implemented:
- ✅ **Project Setup**: React + TypeScript + Vite + Tailwind CSS
- ✅ **Workout Setup Form**: Complete horizontal layout with all inputs
- ✅ **Workout Timer Screen**: Full timer functionality with activity list
- ✅ **Timer Logic**: Complete workout progression and state management
- ✅ **Navigation**: Screen switching between setup and timer

### Features Working:
- ✅ **Setup Screen**:
  - Exercise name input
  - Prep time setting (0-99 seconds)
  - Reps and sets configuration (1-99)
  - 4-phase tempo input with validation (down/up min 1, hold/pause min 0)
  - Rest period setting (0-999 seconds)
  - Click-to-edit functionality + stepper controls
  - Clean horizontal layout

- ✅ **Timer Screen**:
  - **Current Activity Display**: Shows exercise name, rep count, and large timer
  - **Tempo Phase Highlighting**: Colored circles showing current tempo phase
  - **Activity List**: Complete workout timeline with tap-to-skip functionality
  - **Lock/Unlock**: Prevents accidental skips during workout
  - **Pause/Resume**: Full workout control
  - **Auto-scrolling**: Activity list automatically scrolls to current activity
  - **Automatic Progression**: Through all tempo phases, reps, sets, and rest periods

- ✅ **Timer Logic**:
  - Complete workout timeline generation (prep → sets → rests → completion)
  - Automatic phase progression (down → hold → up → pause)
  - Rep counting after each complete tempo cycle
  - Set transitions with rest periods
  - Jump-to-activity functionality
  - Workout completion detection

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Next Steps (TODO):

1. **Audio System**:
   - Metronome clicks for tempo phases
   - Transition beeps between phases
   - Audio cue configuration

2. **LocalStorage Integration**:
   - Save workout configurations
   - Persist timer state during interruptions

3. **UI Polish**:
   - Better visual feedback for phase transitions
   - Improved mobile responsiveness
   - Loading states and animations

4. **Enhanced Features**:
   - Multiple workout templates
   - Workout history
   - Custom audio settings

## Project Structure

```
src/
├── components/
│   ├── WorkoutSetup/
│   │   ├── WorkoutSetup.tsx     # Main setup form
│   │   └── TempoInput.tsx       # 4-phase tempo input
│   ├── WorkoutTimer/
│   │   └── WorkoutTimer.tsx     # Timer screen with activity list
│   └── shared/
│       └── NumberInput.tsx      # Reusable number input with steppers
├── hooks/
│   └── useWorkoutTimer.ts       # Timer logic and state management
├── types/
│   └── workout.ts               # TypeScript interfaces
├── App.tsx                      # Main app with navigation
├── main.tsx                     # React entry point
└── index.css                    # Tailwind CSS
```

## How It Works

1. **Setup**: Configure exercise name, prep time, reps, tempo (4-phase), sets, and rest periods
2. **Start**: Click "START WORKOUT" to begin the timer
3. **Timer**: 
   - Shows current activity (prep/exercise/rest) with large countdown
   - Displays tempo phases with highlighting for exercises
   - Lists complete workout timeline with current activity highlighted
   - Auto-scrolls to keep next activities visible
4. **Controls**: 
   - Lock/unlock to prevent accidental skips
   - Pause/resume at any time
   - Tap any activity to jump to that point (when unlocked)
5. **Completion**: Shows completion screen with option to return to setup

## Design Principles

- **Horizontal Layout**: Efficient use of space
- **Touch-Friendly**: Designed for mobile use from the start
- **Visual Clarity**: Clear indication of current state and progress
- **Flexible Navigation**: Jump to any point in the workout
- **Safety Features**: Lock mechanism prevents accidental changes during intense workouts 