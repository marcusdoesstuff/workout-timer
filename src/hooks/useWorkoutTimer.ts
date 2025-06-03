import { useState, useEffect, useCallback } from 'react';
import { WorkoutBlock, TempoPhase } from '../types/workout';

interface WorkoutActivity {
  id: string;
  type: 'prep' | 'exercise' | 'rest';
  name: string;
  setNumber?: number;
}

interface WorkoutTimerState {
  currentActivityIndex: number;
  currentRep: number;
  currentTempoPhase: TempoPhase;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  isLocked: boolean;
}

export function useWorkoutTimer(workoutBlock: WorkoutBlock) {
  const [state, setState] = useState<WorkoutTimerState>({
    currentActivityIndex: 0,
    currentRep: 1,
    currentTempoPhase: 'down',
    timeRemaining: 0,
    isRunning: false,
    isPaused: false,
    isLocked: false
  });

  // Generate the workout activities (set-level only)
  const generateWorkoutActivities = useCallback((): WorkoutActivity[] => {
    const activities: WorkoutActivity[] = [];
    
    // Add prep phase
    if (workoutBlock.prepSeconds > 0) {
      activities.push({
        id: 'prep',
        type: 'prep',
        name: 'Prep'
      });
    }

    // Add sets with rests
    for (let set = 1; set <= workoutBlock.sets; set++) {
      activities.push({
        id: `set-${set}`,
        type: 'exercise',
        name: workoutBlock.exerciseName,
        setNumber: set
      });

      // Add rest between sets (except after the last set)
      if (set < workoutBlock.sets && workoutBlock.restSeconds > 0) {
        activities.push({
          id: `rest-${set}`,
          type: 'rest',
          name: 'Rest',
          setNumber: set
        });
      }
    }

    return activities;
  }, [workoutBlock]);

  const activities = generateWorkoutActivities();
  const currentActivity = activities[state.currentActivityIndex];

  // Helper function to advance to next non-zero tempo phase
  const getNextTempoPhase = useCallback((currentPhase: TempoPhase): { phase: TempoPhase, duration: number } => {
    const phases: TempoPhase[] = ['down', 'hold', 'up', 'pause'];
    let currentIndex = phases.indexOf(currentPhase);
    
    // Keep advancing until we find a non-zero phase or complete the cycle
    for (let i = 0; i < 4; i++) {
      currentIndex = (currentIndex + 1) % 4;
      const nextPhase = phases[currentIndex];
      const duration = workoutBlock.tempo[nextPhase];
      
      if (duration > 0) {
        return { phase: nextPhase, duration };
      }
    }
    
    // If all phases are 0 (shouldn't happen), return down with 0 duration
    return { phase: 'down', duration: 0 };
  }, [workoutBlock.tempo]);

  // Get the duration for the current timer state
  const getCurrentDuration = useCallback(() => {
    if (!currentActivity) return 0;
    
    if (currentActivity.type === 'prep') {
      return workoutBlock.prepSeconds;
    } else if (currentActivity.type === 'rest') {
      return workoutBlock.restSeconds;
    } else if (currentActivity.type === 'exercise') {
      // Return duration for current tempo phase
      switch (state.currentTempoPhase) {
        case 'down': return workoutBlock.tempo.down;
        case 'hold': return workoutBlock.tempo.hold;
        case 'up': return workoutBlock.tempo.up;
        case 'pause': return workoutBlock.tempo.pause;
        default: return 0;
      }
    }
    return 0;
  }, [currentActivity, state.currentTempoPhase, workoutBlock]);

  // Timer effect
  useEffect(() => {
    if (!state.isRunning || state.isPaused || !currentActivity) return;

    const interval = setInterval(() => {
      setState(prevState => {
        if (prevState.timeRemaining <= 1) {
          // Time's up - move to next phase
          if (currentActivity.type === 'prep' || currentActivity.type === 'rest') {
            // Move to next activity
            const nextIndex = prevState.currentActivityIndex + 1;
            if (nextIndex < activities.length) {
              const nextActivity = activities[nextIndex];
              const nextDuration = nextActivity.type === 'prep' ? workoutBlock.prepSeconds :
                                 nextActivity.type === 'rest' ? workoutBlock.restSeconds :
                                 workoutBlock.tempo.down; // Start with down phase for exercise
              
              return {
                ...prevState,
                currentActivityIndex: nextIndex,
                currentRep: nextActivity.type === 'exercise' ? 1 : prevState.currentRep,
                currentTempoPhase: nextActivity.type === 'exercise' ? 'down' : prevState.currentTempoPhase,
                timeRemaining: nextDuration
              };
            } else {
              // Workout complete
              return { ...prevState, isRunning: false, timeRemaining: 0 };
            }
          } else if (currentActivity.type === 'exercise') {
            // Handle tempo phase progression
            const { currentTempoPhase, currentRep } = prevState;
            
            // Move to next tempo phase
            if (currentTempoPhase === 'down') {
              const { phase, duration } = getNextTempoPhase('down');
              return {
                ...prevState,
                currentTempoPhase: phase,
                timeRemaining: duration
              };
            } else if (currentTempoPhase === 'hold') {
              const { phase, duration } = getNextTempoPhase('hold');
              return {
                ...prevState,
                currentTempoPhase: phase,
                timeRemaining: duration
              };
            } else if (currentTempoPhase === 'up') {
              const { phase, duration } = getNextTempoPhase('up');
              return {
                ...prevState,
                currentTempoPhase: phase,
                timeRemaining: duration
              };
            } else if (currentTempoPhase === 'pause') {
              // End of rep - check if set is complete
              if (currentRep >= workoutBlock.reps) {
                // Set complete - move to next activity
                const nextIndex = prevState.currentActivityIndex + 1;
                if (nextIndex < activities.length) {
                  const nextActivity = activities[nextIndex];
                  const nextDuration = nextActivity.type === 'rest' ? workoutBlock.restSeconds :
                                     nextActivity.type === 'exercise' ? workoutBlock.tempo.down :
                                     workoutBlock.prepSeconds;
                  
                  return {
                    ...prevState,
                    currentActivityIndex: nextIndex,
                    currentRep: nextActivity.type === 'exercise' ? 1 : prevState.currentRep,
                    currentTempoPhase: nextActivity.type === 'exercise' ? 'down' : prevState.currentTempoPhase,
                    timeRemaining: nextDuration
                  };
                } else {
                  // Workout complete
                  return { ...prevState, isRunning: false, timeRemaining: 0 };
                }
              } else {
                // Start next rep
                let nextDuration = workoutBlock.tempo.down;
                let nextPhase: TempoPhase = 'down';
                
                // If down phase has 0 duration, skip to next non-zero phase
                if (nextDuration === 0) {
                  const { phase, duration } = getNextTempoPhase('pause'); // Get next after pause (wraps to down)
                  nextPhase = phase;
                  nextDuration = duration;
                }
                
                return {
                  ...prevState,
                  currentRep: currentRep + 1,
                  currentTempoPhase: nextPhase,
                  timeRemaining: nextDuration
                };
              }
            }
          }
        }
        
        return { ...prevState, timeRemaining: prevState.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isRunning, state.isPaused, currentActivity, activities, workoutBlock, getNextTempoPhase]);

  // Initialize timer when activity changes
  useEffect(() => {
    if (currentActivity && state.timeRemaining === 0) {
      let duration = getCurrentDuration();
      let tempoPhase = state.currentTempoPhase;
      
      // If starting an exercise and the current phase has 0 duration, skip to next non-zero phase
      if (currentActivity.type === 'exercise' && duration === 0) {
        const { phase, duration: nextDuration } = getNextTempoPhase(state.currentTempoPhase);
        tempoPhase = phase;
        duration = nextDuration;
      }
      
      setState(prev => ({ 
        ...prev, 
        timeRemaining: duration,
        currentTempoPhase: tempoPhase
      }));
    }
  }, [state.currentActivityIndex, currentActivity, getCurrentDuration, getNextTempoPhase]);

  const startWorkout = () => {
    let duration = getCurrentDuration();
    let tempoPhase = state.currentTempoPhase;
    
    // If starting an exercise and the current phase has 0 duration, skip to next non-zero phase
    if (currentActivity?.type === 'exercise' && duration === 0) {
      const { phase, duration: nextDuration } = getNextTempoPhase(state.currentTempoPhase);
      tempoPhase = phase;
      duration = nextDuration;
    }
    
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      timeRemaining: duration,
      currentTempoPhase: tempoPhase
    }));
  };

  const pauseWorkout = () => {
    setState(prev => ({ ...prev, isPaused: true }));
  };

  const resumeWorkout = () => {
    setState(prev => ({ ...prev, isPaused: false }));
  };

  const toggleLock = () => {
    setState(prev => ({ ...prev, isLocked: !prev.isLocked }));
  };

  const jumpToActivity = (activityIndex: number) => {
    if (state.isLocked) return;
    
    if (activityIndex >= 0 && activityIndex < activities.length) {
      const targetActivity = activities[activityIndex];
      let duration = targetActivity.type === 'prep' ? workoutBlock.prepSeconds :
                    targetActivity.type === 'rest' ? workoutBlock.restSeconds :
                    workoutBlock.tempo.down; // Start with down phase for exercise
      let tempoPhase = targetActivity.type === 'exercise' ? 'down' : state.currentTempoPhase;
      
      // If jumping to an exercise and down phase has 0 duration, skip to next non-zero phase
      if (targetActivity.type === 'exercise' && duration === 0) {
        const { phase, duration: nextDuration } = getNextTempoPhase('down');
        tempoPhase = phase;
        duration = nextDuration;
      }
      
      setState(prev => ({
        ...prev,
        currentActivityIndex: activityIndex,
        currentRep: targetActivity.type === 'exercise' ? 1 : prev.currentRep,
        currentTempoPhase: tempoPhase,
        timeRemaining: duration
      }));
    }
  };

  const getCurrentSet = () => {
    return currentActivity?.setNumber || 1;
  };

  const isCompleted = state.currentActivityIndex >= activities.length - 1 && 
                     state.timeRemaining === 0 && 
                     !state.isRunning;

  return {
    // State
    activities,
    currentActivity,
    currentActivityIndex: state.currentActivityIndex,
    currentRep: state.currentRep,
    currentTempoPhase: state.currentTempoPhase,
    timeRemaining: state.timeRemaining,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    isLocked: state.isLocked,
    isCompleted,
    
    // Computed values
    getCurrentSet,
    
    // Actions
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    toggleLock,
    jumpToActivity
  };
} 