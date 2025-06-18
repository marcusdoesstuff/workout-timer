# Workout Timer App - UI Wireframes (Updated)

## 1. Build Workout Screen (Main Entry Point)

```
┌──────────────────────────────────────────────────────────┐
│ Build Workout                                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Workout Sequence                                         │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ⋮⋮ 🏋️ Squats                    Sets: 3 • Reps: 8  │ │  <-- Draggable blocks
│ │    3131 tempo                              ⚙️  ✕    │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ ⋮⋮ 💪 Planks                     Sets: 3           │ │
│ │    33 2-step                               ⚙️  ✕    │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ ⋮⋮ 🧘 Hamstring Stretch         Sets: 2           │ │
│ │    30s stretch                             ⚙️  ✕    │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                    [+]   │  <-- Add block button
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │                  [START WORKOUT]                     │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## 2. Block Library Screen

```
┌──────────────────────────────────────────────────────────┐
│ ← Back                Block Library                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 🏋️ Squats                        3 sets • 8 reps   │ │  <-- Saved blocks
│ │    10s prep • 3131 tempo • 60s rest        ⚙️  🗑️  │ │      (clickable)
│ ├──────────────────────────────────────────────────────┤ │
│ │ 💪 Planks                         3 sets • 10 reps  │ │
│ │    5s prep • 33 2-step • 45s rest          ⚙️  🗑️  │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ 🧘 Hamstring Stretch              2 sets           │ │
│ │    0s prep • 30s stretch • 10s rest        ⚙️  🗑️  │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┐ │
│ │                  + Create New Block                  │ │
│ └ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┘ │
└──────────────────────────────────────────────────────────┘
```

## 3. Block Type Selection Screen

```
┌──────────────────────────────────────────────────────────┐
│ ← Back              Choose Block Type                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌───────────────┐  ┌───────────────┐  ┌───────────────┐ │
│ │      🏋️       │  │      💪       │  │      🧘       │ │
│ │               │  │               │  │               │ │
│ │ Tempo Block   │  │ 2-Step Block  │  │ Stretch Block │ │
│ │               │  │               │  │               │ │
│ │ Traditional   │  │ Simple        │  │ Single hold   │ │
│ │ 4-phase tempo │  │ contract and  │  │ phase for     │ │
│ │ with down,    │  │ relax pattern │  │ stretching    │ │
│ │ hold, up,     │  │ for isometric │  │ and           │ │
│ │ and pause     │  │ exercises     │  │ flexibility   │ │
│ └───────────────┘  └───────────────┘  └───────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 4A. Tempo Block Editor

```
┌──────────────────────────────────────────────────────────┐
│ ← Back                Tempo Block                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Exercise Name: [Squats_________________________]         │
│                                                          │
│ ┌─────┐ ┌─────┐  ┌───┬───┬───┬───┐  ┌─────┬────────┐    │
│ │  ▲  │ │  ▲  │  │ ▲ │ ▲ │ ▲ │ ▲ │  │  ▲  │    ▲   │    │
│ │ 10  │ │  8  │  │ 3 │ 1 │ 3 │ 1 │  │  3  │   60   │    │
│ │  ▼  │ │  ▼  │  │ ▼ │ ▼ │ ▼ │ ▼ │  │  ▼  │    ▼   │    │
│ └─────┘ └─────┘  └───┴───┴───┴───┘  └─────┴────────┘    │
│  Prep    Reps     Down Hold Up Pause   Sets   Rest(s)   │
│                        Tempo                             │
│                                                          │
│                   ☐ Up first                            │  <-- Flip checkbox
│                                                          │
│ ┌─────────────────────────────────────────────────────┐  │
│ │  [CANCEL]                      [SAVE BLOCK]        │  │
│ └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 4B. 2-Step Block Editor

```
┌──────────────────────────────────────────────────────────┐
│ ← Back               2-Step Block                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Exercise Name: [Planks_________________________]         │
│                                                          │
│ ┌─────┐ ┌─────┐  ┌───┬───┐  ┌─────┬────────┐            │
│ │  ▲  │ │  ▲  │  │ ▲ │ ▲ │  │  ▲  │    ▲   │            │
│ │ 10  │ │ 10  │  │ 3 │ 3 │  │  3  │   45   │            │
│ │  ▼  │ │  ▼  │  │ ▼ │ ▼ │  │  ▼  │    ▼   │            │
│ └─────┘ └─────┘  └───┴───┘  └─────┴────────┘            │
│  Prep    Reps    Contract   Sets   Rest(s)              │
│                   Relax                                  │
│                   2-Step                                 │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐  │
│ │  [CANCEL]                      [SAVE BLOCK]        │  │
│ └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 4C. Stretch Block Editor

```
┌──────────────────────────────────────────────────────────┐
│ ← Back              Stretch Block                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Exercise Name: [Hamstring Stretch_____________]          │
│                                                          │
│ ┌─────┐  ┌────┐  ┌─────┬────────┐                       │
│ │  ▲  │  │ ▲  │  │  ▲  │    ▲   │                       │
│ │ 10  │  │30  │  │  2  │   10   │                       │
│ │  ▼  │  │ ▼  │  │  ▼  │    ▼   │                       │
│ └─────┘  └────┘  └─────┴────────┘                       │
│  Prep   Stretch   Sets  Rest(s)                         │
│                                                          │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐  │
│ │  [CANCEL]                      [SAVE BLOCK]        │  │
│ └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 5A. Workout Timer - Exercise Phase (Tempo Block)

```
┌──────────────────────────────────────────────────────────┐
│ Workout Timer                        [LOCK]  [PAUSE]    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                    Squats                                │  <-- Current exercise
│                Set 1 of 3                                │
│                                                          │
│    ┌─────┐                  ┌───┬───┬───┬───┐           │
│    │ ▲   │                  │ 2 │ 1 │ 3 │ 1 │           │  <-- Rep counter + Timing circles
│    │ 3   │                  │   │   │   │   │           │      Active circle shows countdown
│    │ ▼   │                  │   │   │   │   │           │      Others show reference values
│    └─────┘                  └───┴───┴───┴───┘           │
│     Reps                   Down Hold Up Pause           │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐ │  <-- Activity timeline
│ │ ✓ Prep           10 sec                              │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ ► Squats         set 1 of 3    8 reps    3131       │ │  <-- Current activity
│ ├──────────────────────────────────────────────────────┤ │
│ │   Rest           60 sec                              │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │   Squats         set 2 of 3    8 reps    3131       │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## 5B. Workout Timer - Rest Phase with Next Preview

```
┌──────────────────────────────────────────────────────────┐
│ Workout Timer                        [LOCK]  [PAUSE]    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                     Rest                                 │
│                Set 1 → Set 2                             │
│                                                          │
│                      45                                  │  <-- Main countdown
│                                                          │
│                   Next up:                               │  <-- Next section preview
│                  ┌─┬─┬─┬─┐                              │
│                  │3│1│3│1│                              │
│                  └─┴─┴─┴─┘                              │
│               Down Hold Up Pause                        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ✓ Squats         set 1 of 3    8 reps    3131       │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ ► Rest           60 sec                              │ │  <-- Current activity
│ ├──────────────────────────────────────────────────────┤ │
│ │   Squats         set 2 of 3    8 reps    3131       │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## 5C. Workout Timer - 2-Step Block

```
┌──────────────────────────────────────────────────────────┐
│ Workout Timer                        [LOCK]  [PAUSE]    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                    Planks                                │
│                Set 1 of 3                                │
│                                                          │
│    ┌─────┐                    ┌───┬───┐                 │
│    │ ▲   │                    │ 2 │ 3 │                 │  <-- 2-step timing
│    │ 5   │                    │   │   │                 │
│    │ ▼   │                    │   │   │                 │
│    └─────┘                    └───┴───┘                 │
│     Reps                   Contract Relax               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 5D. Workout Timer - Stretch Block

```
┌──────────────────────────────────────────────────────────┐
│ Workout Timer                        [LOCK]  [PAUSE]    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│               Hamstring Stretch                          │
│                Set 1 of 2                                │
│                                                          │
│                    ┌────┐                               │
│                    │ 25 │                               │  <-- Single stretch timer
│                    │    │                               │      (no rep counter)
│                    │    │                               │
│                    └────┘                               │
│                   Stretch                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Key UI Improvements

### **Multi-Screen Navigation**
- **Build Workout**: Main entry point with drag-and-drop
- **Block Library**: Saved blocks management
- **Block Type Selection**: Visual type picker
- **Block Editors**: Type-specific configuration
- **Timer**: Advanced countdown with preview

### **Block Type Differentiation**
- **Icons**: 🏋️ (Tempo), 💪 (2-Step), 🧘 (Stretch)
- **Timing Display**: Adapted to each block type
- **Interface Optimization**: Relevant controls only

### **Timer Intelligence**
- **Countdown Circles**: Active phase shows remaining time
- **Next Preview**: Upcoming exercise timing during rest
- **Type-Aware Display**: Different layouts for different blocks

### **User Experience Flow**
1. **Build**: Compose workout from library blocks
2. **Library**: Manage reusable exercise blocks
3. **Create**: Choose type → Configure → Save
4. **Execute**: Timer with intelligent feedback

### **Progressive Disclosure**
- **Simple Start**: Build workout from existing blocks
- **Advanced Options**: Create custom blocks when needed
- **Expert Features**: Flip toggle, drag reordering
- **Context-Aware**: Show relevant information at right time