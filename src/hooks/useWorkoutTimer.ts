import { useState, useEffect, useCallback, useRef } from 'react';
import { setInterval, clearInterval } from 'worker-timers';
import { FullWorkout, WorkoutBlock, TempoPhase } from '../types/workout';

// Using worker-timers for more accurate timing that isn't affected by:
// - Browser throttling in background tabs
// - Main thread blocking from heavy operations
// - Inconsistent timing due to CPU load

interface WorkoutActivity {
  id: string;
  type: 'prep' | 'exercise' | 'rest';
  name: string;
  setNumber?: number;
  blockIndex: number;
}

interface WorkoutSegment {
  activityIndex: number;
  blockIndex: number;
  rep: number;
  phase: TempoPhase | 'prep' | 'rest';
  duration: number;
  startTime: number; // When this segment starts (in ms from workout start)
  endTime: number;   // When this segment ends (in ms from workout start)
}

interface WorkoutTimerState {
  currentActivityIndex: number;
  currentBlockIndex: number;
  currentRep: number;
  currentTempoPhase: TempoPhase;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  isLocked: boolean;
  // Global timer state
  startTime: number;
  pausedTime: number;
  globalElapsed: number;
  currentSegmentIndex: number;
  pauseStartTime: number;
}

export function useWorkoutTimer(fullWorkout: FullWorkout) {
  const [state, setState] = useState<WorkoutTimerState>({
    currentActivityIndex: 0,
    currentBlockIndex: 0,
    currentRep: 1,
    currentTempoPhase: 'down',
    timeRemaining: 0,
    isRunning: false,
    isPaused: false,
    isLocked: false,
    startTime: 0,
    pausedTime: 0,
    globalElapsed: 0,
    currentSegmentIndex: 0,
    pauseStartTime: 0
  });

  const segmentsRef = useRef<WorkoutSegment[]>([]);
  
  // Generate the workout activities for all blocks
  const generateWorkoutActivities = useCallback((): WorkoutActivity[] => {
    const activities: WorkoutActivity[] = [];
    
    fullWorkout.workoutBlocks.forEach((block, blockIndex) => {
      // Add prep phase for each block
      if (block.prepSeconds > 0) {
        activities.push({
          id: `block-${blockIndex}-prep`,
          type: 'prep',
          name: 'Prep',
          blockIndex
        });
      }

      // Add sets with rests for each block
      for (let set = 1; set <= block.sets; set++) {
        activities.push({
          id: `block-${blockIndex}-set-${set}`,
          type: 'exercise',
          name: block.exerciseName,
          setNumber: set,
          blockIndex
        });

        // Add rest between sets (except after the last set of each block)
        if (set < block.sets && block.restSeconds > 0) {
          activities.push({
            id: `block-${blockIndex}-rest-${set}`,
            type: 'rest',
            name: 'Rest',
            setNumber: set,
            blockIndex
          });
        }
      }
    });

    return activities;
  }, [fullWorkout]);

  // Generate all workout segments with precise timing
  const generateWorkoutSegments = useCallback((): WorkoutSegment[] => {
    const activities = generateWorkoutActivities();
    const segments: WorkoutSegment[] = [];
    let currentTime = 0;

    for (let activityIndex = 0; activityIndex < activities.length; activityIndex++) {
      const activity = activities[activityIndex];
      const block = fullWorkout.workoutBlocks[activity.blockIndex];

      if (activity.type === 'prep') {
        if (block.prepSeconds > 0) {
          segments.push({
            activityIndex,
            blockIndex: activity.blockIndex,
            rep: 1,
            phase: 'prep',
            duration: block.prepSeconds * 1000,
            startTime: currentTime,
            endTime: currentTime + (block.prepSeconds * 1000)
          });
          currentTime += block.prepSeconds * 1000;
        }
      } else if (activity.type === 'rest') {
        if (block.restSeconds > 0) {
          segments.push({
            activityIndex,
            blockIndex: activity.blockIndex,
            rep: 1,
            phase: 'rest',
            duration: block.restSeconds * 1000,
            startTime: currentTime,
            endTime: currentTime + (block.restSeconds * 1000)
          });
          currentTime += block.restSeconds * 1000;
        }
      } else if (activity.type === 'exercise') {
        // Generate segments for each rep
        for (let rep = 1; rep <= block.reps; rep++) {
          const phases: TempoPhase[] = ['down', 'hold', 'up', 'pause'];
          
          for (const phase of phases) {
            const duration = block.tempo[phase] * 1000;
            segments.push({
              activityIndex,
              blockIndex: activity.blockIndex,
              rep,
              phase,
              duration,
              startTime: currentTime,
              endTime: currentTime + duration
            });
            currentTime += duration;
          }
        }
      }
    }

    return segments;
  }, [fullWorkout, generateWorkoutActivities]);

  // Calculate total workout duration
  const getTotalWorkoutDuration = useCallback((): number => {
    const segments = generateWorkoutSegments();
    return segments.length > 0 ? segments[segments.length - 1].endTime : 0;
  }, [generateWorkoutSegments]);

  // Initialize segments
  useEffect(() => {
    segmentsRef.current = generateWorkoutSegments();
  }, [generateWorkoutSegments]);

  const activities = generateWorkoutActivities();
  const currentActivity = activities[state.currentActivityIndex];
  const totalWorkoutDuration = getTotalWorkoutDuration();
  const getCurrentBlock = () => fullWorkout.workoutBlocks[state.currentBlockIndex];

  // Global timer - runs at 20ms intervals using worker-timers for accurate, drift-free timing
  useEffect(() => {
    if (!state.isRunning || state.isPaused) return;

    const timerInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.max(0, now - state.startTime - state.pausedTime); // Prevent negative elapsed
      
      // Find current segment based on elapsed time
      const segments = segmentsRef.current;
      let currentSegmentIndex = state.currentSegmentIndex;
      
      // Handle potential timing skips by checking all segments
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        if (elapsed >= segment.startTime && elapsed < segment.endTime) {
          currentSegmentIndex = i;
          break;
        }
        if (elapsed >= segment.endTime && i === segments.length - 1) {
          // Workout complete
          setState(prev => ({ 
            ...prev, 
            isRunning: false, 
            globalElapsed: elapsed,
            timeRemaining: 0 
          }));
          return;
        }
      }

      const currentSegment = segments[currentSegmentIndex];
      if (!currentSegment) return;

      // Calculate time remaining in current segment
      const timeRemaining = Math.max(0, Math.ceil((currentSegment.endTime - elapsed) / 1000));
      
      // Update state
      setState(prev => ({
        ...prev,
        globalElapsed: elapsed,
        currentSegmentIndex,
        currentActivityIndex: currentSegment.activityIndex,
        currentBlockIndex: currentSegment.blockIndex,
        currentRep: currentSegment.rep,
        currentTempoPhase: currentSegment.phase as TempoPhase,
        timeRemaining
      }));
    }, 20);

    return () => clearInterval(timerInterval);
  }, [state.isRunning, state.isPaused, state.startTime, state.pausedTime, state.currentSegmentIndex]);

  const startWorkout = () => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startTime: now,
      pausedTime: 0,
      globalElapsed: 0,
      currentSegmentIndex: 0,
      currentActivityIndex: 0,
      currentBlockIndex: 0,
      currentRep: 1,
      currentTempoPhase: 'down'
    }));
  };

  const pauseWorkout = () => {
    setState(prev => ({
      ...prev,
      isPaused: true,
      pauseStartTime: Date.now()
    }));
  };

  const resumeWorkout = () => {
    setState(prev => {
      const pauseDuration = Date.now() - prev.pauseStartTime;
      return {
        ...prev,
        isPaused: false,
        pausedTime: prev.pausedTime + pauseDuration,
        pauseStartTime: 0
      };
    });
  };

  const toggleLock = () => {
    setState(prev => ({ ...prev, isLocked: !prev.isLocked }));
  };

  const jumpToActivity = (activityIndex: number) => {
    if (state.isLocked) return;
    
    const segments = segmentsRef.current;
    const targetSegment = segments.find(s => s.activityIndex === activityIndex);
    if (!targetSegment) return;

    const pauseDuration = state.isPaused ? Date.now() - state.pauseStartTime : 0;
    const newPausedTime = state.pausedTime + pauseDuration;
    const newStartTime = Date.now() - targetSegment.startTime - newPausedTime;

    setState(prev => ({
      ...prev,
      startTime: newStartTime,
      pausedTime: newPausedTime,
      pauseStartTime: state.isPaused ? Date.now() : 0,
      currentActivityIndex: activityIndex,
      currentBlockIndex: targetSegment.blockIndex
    }));
  };

  const getCurrentSet = () => {
    if (currentActivity?.type === 'exercise') {
      return currentActivity.setNumber || 1;
    }
    if (currentActivity?.type === 'rest') {
      return currentActivity.setNumber || 1;
    }
    return 1;
  };

  const isCompleted = !state.isRunning && state.globalElapsed > 0 && state.currentSegmentIndex >= segmentsRef.current.length - 1;

  return {
    activities,
    currentActivity,
    currentActivityIndex: state.currentActivityIndex,
    currentBlockIndex: state.currentBlockIndex,
    currentRep: state.currentRep,
    currentTempoPhase: state.currentTempoPhase,
    timeRemaining: state.timeRemaining,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    isLocked: state.isLocked,
    isCompleted,
    getCurrentSet,
    getCurrentBlock,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    toggleLock,
    jumpToActivity,
    globalElapsed: state.globalElapsed,
    currentSegmentIndex: state.currentSegmentIndex,
    totalSegments: segmentsRef.current.length,
    totalWorkoutDuration
  };
} 