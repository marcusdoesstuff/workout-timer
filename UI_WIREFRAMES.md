# Workout Timer App - UI Wireframes

## Workout Setup Screen

```
┌──────────────────────────────────────────────────────────┐
│ Workout Timer                                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │               Workout Block                          │ │
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
│  ┌─────────────────────────────────────────────────────┐ │
│  │                [START WORKOUT]                      │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Input Specifications:**
- **Prep**: 1-2 digits, click-to-edit + steppers
- **Reps**: 1-2 digits, click-to-edit + steppers
- **Tempo**: 4 separate 1-digit inputs, up/down minimum 1, hold/pause minimum 0
- **Sets**: 1-2 digits, click-to-edit + steppers  
- **Rest**: 1-3 digits (0-999 seconds), click-to-edit + steppers

## Workout Timer Screen (During Exercise)

```
┌──────────────────────────────────────────────────────────┐
│ Workout                                  [LOCK]  [PAUSE] │  <-- Lock button to stop accidental skips
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Squats           rep 1 of 8            3  1  3  1       │  <-- Current activity section (larger/bolder fonts)
│                                                          │      Rep count will count up after each tempo cycle
├──────────────────────────────────────────────────────────┤      Tempo numbers highlighted with coloured circle behind them
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Prep           10 sec                               │ │  --- Workout activity list section
│ ├──────────────────────────────────────────────────────┤ │   │ 
│ │  Squats         set 1 of 3    8 reps    3  1  3  1   │ │   │  - Current activity section highlighted with colour background
│ ├──────────────────────────────────────────────────────┤ │   │  - Summary of each SET (not individual reps)
│ │  Rest           60 sec                               │ │   │  - User can tap on activities to skip to those sections (forward or back)
│ ├──────────────────────────────────────────────────────┤ │   │  - Automatic scrolling
│ │  Squats         set 2 of 3    8 reps    3  1  3  1   │ │   │
│ ├──────────────────────────────────────────────────────┤ │   │
│ │  Rest           60 sec                               │ │   │
│ ├──────────────────────────────────────────────────────┤ │  --
                         ...                                  <-- scrollable to see the rest
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Timer Progression Logic

### **Prep/Rest Phases:**
- Simple countdown timer
- When timer reaches zero, move to next section

### **Exercise Set Phases:**
- **Rep Cycle**: Each rep = one complete tempo cycle (Down → Hold → Up → Pause)
- **Tempo Progression**: Count down each tempo phase individually
  1. Down phase: Count down from tempo.down to 0
  2. Hold phase: Count down from tempo.hold to 0 (if > 0)
  3. Up phase: Count down from tempo.up to 0
  4. Pause phase: Count down from tempo.pause to 0 (if > 0)
- **Rep Completion**: After pause phase ends, increment rep count and start next rep
- **Set Completion**: After all reps completed, move to next section (rest or next set)

### **Activity List Display:**
- **Prep**: Single row showing prep duration
- **Exercise Sets**: One row per set (not per rep) showing "set X of Y • Z reps • tempo"
- **Rest**: Single row showing rest duration between sets
- **Current Activity**: Highlighted with colored background
- **Navigation**: Tap any row to jump to that section

## Key UI Elements:

### Workout Setup Controls
- **Prep Time**: 1-2 digits, preparation time before exercise starts
- **Exercise Navigation**: All inputs support click-to-edit + steppers
- **Input Validation**: Tempo constraints (up/down min 1, hold/pause min 0)

### Workout Timer Interface
- **Lock Button**: Prevents accidental taps/skips during workout
- **Current Activity Display**: Large, prominent section showing:
  - Exercise name
  - Current rep count (counts up after each tempo cycle)
  - Tempo numbers with colored highlighting for current phase
  - Also to show prep and rest time remaining
- **Activity List**: Scrollable list showing entire workout sequence:
  - Prep phase
  - Each SET of the exercise with tempo display (not individual reps)
  - Rest periods between sets
  - Current activity highlighted with colored background
  - Automatic scrolling so that next activity is at top of visible area
- **Activity Skipping**: Tap any activity in the list to jump to it (forward or back)

### Tempo Display & Progression
- **Phase Highlighting**: Colored circle behind current tempo number
- **Automatic Progression**: 
  - Through tempo phases: Down → Hold → Up → Pause
  - Rep counting after each complete tempo cycle
  - Set transitions after all reps completed

### Control Features
- **Pause/Resume**: Available throughout entire workout
- **Lock Toggle**: Disable/enable skipping to prevent accidents
- **Visual Feedback**: Clear highlighting of current activity and phase