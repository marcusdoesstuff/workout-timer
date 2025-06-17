# Enhanced Workout Timer App - UI Wireframes

## App Navigation Flow

```
     [Workout Block Editor]
          ↑↓           ↑↓
[Build Workout] ←→ [Block Library]
       ↑↓                                      
[Workout Timer]
```

**Navigation Context:**
- **Build Workout (Home)**: Central hub for all navigation
  - **→ Block Library**: Via (+) button to add blocks
  - **→ Workout Block Editor**: Via [⚙️] button to edit existing blocks
  - **→ Workout Timer**: Via [START WORKOUT] button
- **Block Library**: 
  - **→ Build Workout**: Via ← Back or by selecting a block card
  - **→ Workout Block Editor**: Via [⚙️] button to edit or create new blocks
- **Workout Block Editor**: 
  - **Returns to calling screen**: Build Workout or Block Library (context-aware)

## 1. Build Workout Screen (App Entry Point)

```
┌───────────────────────────────────────────────────────────────┐
│                       Build Workout                           │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌─ Workout Sequence ────────────────────────────────────────┐ │
│ │                                                           │ │
│ │  ⋮⋮ 💪 Squats                                        [⚙️] │ │
│ │     3 sets • 8 reps • 10s prep • 3131 tempo • 60s rest    │ │
│ │                                                           │ │
│ │  ⋮⋮ 🏃 Push-ups                                      [⚙️] │ │
│ │     4 sets • 12 reps • 5s prep • 2020 tempo • 45s rest    │ │
│ │                                                           │ │
│ │  ⋮⋮ 🎯 Deadlifts                                     [⚙️] │ │
│ │     5 sets • 5 reps • 15s prep • 3110 tempo • 90s rest    │ │
│ │                                                           │ │
│ │                                                       (+) │ │
│ └───────────────────────────────────────────────────────────┘ │
│                                                               │
│                 ┌─────────────────────────────┐               │
│                 │       [START WORKOUT]       │               │
│                 └─────────────────────────────┘               │
└───────────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Block Summary**: Shows complete block details in consistent format
- **Edit Button [⚙️]**: Quick access to edit any block in the sequence
- **Drag Handles (⋮⋮)**: Reorder blocks by dragging
- **Add Button (+)**: Opens Block Library for adding new blocks
- **Remove**: Swipe or long-press to delete blocks from workout

## 2. Workout Block Library (Accessed via + button)

```
┌──────────────────────────────────────────────────────────┐
│ ← Back                Workout Block Library              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 💪 Squats                                      [⚙️] │ │
│ │ 3 sets • 8 reps • 10s prep • 3131 tempo • 60s rest   │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 🏃 Push-ups                                    [⚙️] │ │
│ │ 4 sets • 12 reps • 5s prep • 2020 tempo • 45s rest   │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 🎯 Deadlifts                                   [⚙️] │ │
│ │ 5 sets • 5 reps • 15s prep • 3110 tempo • 90s rest   │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ + Create New Block                                   │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Block Selection Flow:**
- **Click card**: Add block to workout and return to Build Workout screen
- **[⚙️]**: Edit existing block (goes to Workout Block Editor)
- **+ Create New Block**: Create new block (goes to Workout Block Editor)

## 3. Workout Block Editor (Complete Block Definition)

```
┌──────────────────────────────────────────────────────────┐
│ ← Back                    Workout Block                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │               Workout Block Details                  │ │
│ │                                                      │ │
│ │  Exercise Name: [_________________________________]  │ │
│ │                                                      │ │
│ │ ┌─────┐ ┌─────┐  ┌───┬───┬───┬───┐  ┌─────┬────────┐ │ │
│ │ │  ▲  │ │  ▲  │  │ ▲ │ ▲ │ ▲ │ ▲ │  │  ▲  │    ▲   │ │ │
│ │ │ 10  │ │  8  │  │ 3 │ 1 │ 3 │ 1 │  │  3  │   60   │ │ │
│ │ │  ▼  │ │  ▼  │  │ ▼ │ ▼ │ ▼ │ ▼ │  │  ▼  │    ▼   │ │ │
│ │ └─────┘ └─────┘  └───┴───┴───┴───┘  └─────┴────────┘ │ │
│ │  Prep    Reps     ───  Tempo  ───    Sets   Rest(s)  │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌────────────────┐         ┌───────────────────────────┐ │
│ │    [CANCEL]    │         │       [SAVE BLOCK]        │ │
│ └────────────────┘         └───────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Complete Block Definition:**
- **Exercise Name**: Text label for the exercise
- **Prep Time**: Setup time before exercise starts
- **Reps**: Number of repetitions per set
- **Tempo**: 4-phase timing (Down-Hold-Up-Pause)
- **Sets**: Number of sets to perform
- **Rest**: Rest time between sets

## 4. Enhanced Workout Timer (Collapsible Blocks)

```
┌──────────────────────────────────────────────────────────┐
│ Workout                                  [LOCK]  [PAUSE] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Squats           rep 1 of 8            3  1  3  1       │  <-- Current activity section
│                                                          │
├──────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐ │ --- Expandable block timeline
│ │ ◎ Block 1: Squats (3 sets, 8 reps)                  │ │  │
│ │   ├─ Prep         10 sec                             │ │  │
│ │   ├─ Set 1 of 3   8 reps    3  1  3  1               │ │  │ Current block expanded
│ │   ├─ Rest         60 sec                             │ │  │ (click sections to skip)
│ │   ├─ Set 2 of 3   8 reps    3  1  3  1               │ │  │
│ │   ├─ Rest         60 sec                             │ │  │
│ │   └─ Set 3 of 3   8 reps    3  1  3  1               │ │  │
│ ├──────────────────────────────────────────────────────┤ │  │
│ │ ○ Block 2: Push-ups (4 sets, 12 reps)               │ │  │ Collapsed (click to expand)
│ ├──────────────────────────────────────────────────────┤ │  │
│ │ ○ Block 3: Deadlifts (5 sets, 5 reps)               │ │  │ Collapsed (click to expand)
│ └──────────────────────────────────────────────────────┘ │ ---
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Block Navigation:**
- **Click collapsed block (○)**: Jump to start of that block and expand it
- **Current block (◎)**: Shows full timeline with clickable sections
- **Section clicking**: Within expanded blocks, click sections to skip
- **Auto-collapse**: Previous block collapses when switching to new block

## Updated Data Structure

```typescript
// Back to original WorkoutBlock with all parameters
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

interface FullWorkout {
  id: string;
  name: string;
  workoutBlocks: WorkoutBlock[];  // Ordered sequence
  createdAt: Date;
  lastModified: Date;
}

interface FullWorkoutState {
  currentBlockIndex: number;
  blockState: WorkoutState;
  totalBlocks: number;
  expandedBlockIndex: number;  // Which block is expanded in timeline
  isCompleted: boolean;
}
```

## Key Improvements

### Simplified Data Model
- **Back to original**: WorkoutBlock contains all parameters including sets/reps
- **No complex instances**: Eliminates WorkoutBlockInstance complexity
- **Easy editing**: Each block is a complete, self-contained exercise definition

### Enhanced Editing Access
- **Edit button [⚙️]** on each block in Build Workout screen
- **Direct editing**: Quick access to modify any block in your sequence
- **Consistent naming**: "Workout Block" screen works for both create and edit

### Streamlined User Flow
1. **Build Workout**: Add blocks, see complete summaries, quick edit access
2. **Block Library**: Select existing or create new blocks
3. **Workout Block Editor**: Complete exercise definition in one place
4. **Timer**: Execute with collapsible block navigation

This approach keeps the data model simple while providing easy access to editing functionality!

### Reusable Block Component
- **Consistent display**: Same block layout used in Build Workout and Block Library screens
- **Unified styling**: Exercise name, sets, reps, prep, tempo, rest format
- **Context-aware buttons**: [⚙️] edit button always present, [Select] only in Block Library
- **Smart navigation**: Editor returns to the screen that launched it

### Enhanced Navigation Context
- **Context-aware returns**: Workout Block Editor remembers which screen called it
- **Bidirectional flow**: Build Workout ←→ Block Library for adding/selecting blocks
- **Direct editing**: [⚙️] buttons provide quick access from any screen 