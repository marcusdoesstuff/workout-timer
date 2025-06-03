# Workout Timer App - Project Rules

## Core Focus
**MVP Goal**: Single workout block timer with reps, tempo, sets, and rest periods.

## Development Rules
1. **No Feature Creep**: Stick to MVP scope until it's fully functional
2. **Mobile-First Mindset**: Even though starting with web, design for touch interfaces
3. **Local Storage Only**: No server-side complexity until much later
4. **Audio + Visual**: Both cues required from the start
5. **Horizontal UI**: Compact, streamlined layout for efficiency

## Deferred Features (Do NOT implement until MVP is complete)
- Multiple workout blocks / chaining
- Exercise categories/grouping
- Progress tracking/history
- Export/import templates
- Advanced rest block types
- Server-side storage

## Technical Stack (Locked)
- React + TypeScript + Vite
- Tailwind CSS
- Web Audio API for sounds
- LocalStorage for persistence
- Capacitor (later for mobile wrapping)

## UI Principles
- Click-to-edit numbers in addition to steppers
- Always show context (current set/rep/phase)
- Skip operations always go to start of rep
- Horizontal, compact layout 

## Github details
repo: https://github.com/marcusdoesstuff/workout-timer