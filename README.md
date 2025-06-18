# Workout Timer App

A comprehensive workout timer app supporting multiple exercise types with precise timing control.

## Current Status: ✅ Full Featured Application

### What's Implemented:
- ✅ **Project Setup**: React + TypeScript + Vite + Tailwind CSS
- ✅ **Multiple Block Types**: Tempo, 2-Step, and Stretch blocks
- ✅ **Block Library System**: Save, edit, and reuse workout blocks
- ✅ **Advanced Workout Builder**: Drag-and-drop workout sequence creation
- ✅ **Intelligent Timer**: Countdown displays with next section preview
- ✅ **Complete Navigation**: Multi-screen app with proper state management

### Features Working:

#### **🏗️ Workout Building System**:
- **Block Type Selection**: Choose from Tempo, 2-Step, or Stretch blocks
- **Block Library**: Save frequently used blocks for quick reuse
- **Workout Builder**: Drag-and-drop interface to arrange workout sequence
- **Block Management**: Edit, delete, and duplicate saved blocks

#### **🏋️ Block Types**:

**Tempo Blocks** (Traditional 4-phase):
- Down, Hold, Up, Pause timing (1-9 seconds each)
- Flip option: Switch between "down-first" and "up-first" display
- Perfect for controlled strength training

**2-Step Blocks** (Contract/Relax):
- Contract and Relax phases (1-9 seconds each)
- Ideal for isometric exercises like planks
- Simplified timing for focused muscle engagement

**Stretch Blocks** (Single hold):
- Single stretch duration (1-99 seconds)
- No rep counting - designed for flexibility work
- Clean, focused interface for stretching routines

#### **⏱️ Advanced Timer System**:
- **Countdown Circles**: Active timing circles show real-time countdown
- **Next Section Preview**: During prep/rest, see upcoming exercise timing
- **Phase-Aware Display**: Different interfaces for each block type
- **Smart Progression**: Automatic advancement through all workout phases

#### **🎛️ Setup Screens**:
- **Exercise Configuration**: Name, prep time, reps, sets, rest periods
- **Type-Specific Inputs**: Tailored interfaces for each block type
- **Visual Feedback**: Icons and colors distinguish block types
- **Tempo Flip Toggle**: For tempo blocks, choose display order

#### **⏲️ Timer Screen Features**:
- **Current Activity Display**: Shows exercise name, set/rep progress
- **Dynamic Timing Circles**: Countdown for active phase, reference for others
- **Activity Timeline**: Complete workout sequence with current position
- **Lock/Unlock**: Prevents accidental skips during intense workouts
- **Pause/Resume**: Full workout control at any time
- **Jump Navigation**: Tap any activity to skip to that section

#### **💾 Data Management**:
- **LocalStorage Persistence**: All data saved automatically
- **Backward Compatibility**: Automatic migration of existing data
- **Export/Import Ready**: Data structure prepared for future features

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

## How to Use

### 1. **Building Your Workout**
1. Start on the Build Workout screen
2. Click "+" to add blocks from your library
3. If no blocks exist, create new ones by selecting block type
4. Arrange blocks by dragging them in your preferred order
5. Click "START WORKOUT" when ready

### 2. **Creating Workout Blocks**
1. From Block Library, click "Create New Block"
2. Choose your block type:
   - **Tempo**: For controlled movements with 4-phase timing
   - **2-Step**: For isometric exercises with contract/relax
   - **Stretch**: For flexibility work with single hold duration
3. Configure exercise name and timing parameters
4. Save to your library for future use

### 3. **During Your Workout**
- **Active Circles**: Show countdown timers for current phase
- **Reference Circles**: Display timing values for upcoming phases
- **Next Up Preview**: During prep/rest, see what exercise is coming
- **Timeline**: Track progress through your entire workout
- **Controls**: Lock to prevent accidents, pause when needed

## Project Structure

```
src/
├── components/
│   ├── BuildWorkout/
│   │   └── BuildWorkout.tsx          # Workout sequence builder
│   ├── BlockLibrary/
│   │   └── BlockLibrary.tsx          # Saved blocks management
│   ├── WorkoutSetup/
│   │   ├── BlockTypeSelector.tsx     # Block type selection
│   │   ├── WorkoutSetup.tsx          # Block configuration
│   │   ├── TempoInput.tsx            # 4-phase tempo input
│   │   ├── TwoStepInput.tsx          # Contract/relax input
│   │   └── StretchInput.tsx          # Single stretch input
│   ├── WorkoutTimer/
│   │   └── WorkoutTimer.tsx          # Main timer interface
│   └── shared/
│       ├── NumberInput.tsx           # Reusable number inputs
│       ├── ProgressCircle.tsx        # Circular progress indicators
│       └── WorkoutBlockCard.tsx      # Block display component
├── hooks/
│   ├── useWorkoutTimer.ts            # Core timer logic
│   └── useAccurateTimer.ts           # High-precision timing
├── types/
│   └── workout.ts                    # TypeScript interfaces
├── utils/
│   └── storage.ts                    # Data persistence
├── App.tsx                           # Main app navigation
├── main.tsx                          # React entry point
└── index.css                         # Tailwind CSS
```

## Key Features

### **Multi-Type Block System**
- **Flexibility**: Different block types for different exercise styles
- **Consistency**: Unified interface across all block types
- **Extensibility**: Easy to add new block types in the future

### **Intelligent Timer Display**
- **Countdown Feedback**: Real-time countdown in active timing circles
- **Contextual Information**: Next section preview during rest periods
- **Visual Hierarchy**: Clear distinction between active and reference timing

### **Professional Workout Building**
- **Library System**: Save and reuse common exercise blocks
- **Sequence Builder**: Drag-and-drop workout arrangement
- **Block Management**: Full CRUD operations on saved blocks

### **Robust Data Management**
- **Auto-Save**: Changes saved automatically
- **Migration**: Seamless updates as features are added
- **Persistence**: Workouts and blocks survive browser restarts

## Design Principles

- **Exercise-Focused**: Each block type optimized for its use case
- **Touch-Friendly**: Designed for mobile use during workouts
- **Visual Clarity**: Clear indication of current state and progress
- **Flexible Navigation**: Jump to any point in the workout
- **Safety Features**: Lock mechanism prevents accidental changes
- **Progressive Enhancement**: Features build on each other logically

## Technical Highlights

- **TypeScript**: Full type safety throughout the application
- **React Hooks**: Modern state management and effects
- **Accurate Timing**: Worker-based timers for precise countdown
- **Responsive Design**: Works on desktop and mobile devices
- **Component Architecture**: Reusable, maintainable code structure
- **Data Persistence**: Robust localStorage with migration support 