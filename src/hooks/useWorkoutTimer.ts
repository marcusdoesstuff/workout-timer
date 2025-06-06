import { useState, useEffect, useCallback, useRef } from 'react';
import { WorkoutBlock, TempoPhase } from '../types/workout';

interface WorkoutActivity {
  id: string;
  type: 'prep' | 'exercise' | 'rest';
  name: string;
  setNumber?: number;
}

interface WorkoutSegment {
  activityIndex: number;
  rep: number;
  phase: TempoPhase | 'prep' | 'rest';
  duration: number;
  startTime: number; // When this segment starts (in ms from workout start)
  endTime: number;   // When this segment ends (in ms from workout start)
}

interface WorkoutTimerState {
  currentActivityIndex: number;
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
}

export function useWorkoutTimer(workoutBlock: WorkoutBlock) {
  const [state, setState] = useState<WorkoutTimerState>({
    currentActivityIndex: 0,
    currentRep: 1,
    currentTempoPhase: 'down',
    timeRemaining: 0,
    isRunning: false,
    isPaused: false,
    isLocked: false,
    startTime: 0,
    pausedTime: 0,
    globalElapsed: 0,
    currentSegmentIndex: 0
  });

  const segmentsRef = useRef<WorkoutSegment[]>([]);
  
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

  // Generate all workout segments with precise timing
  const generateWorkoutSegments = useCallback((): WorkoutSegment[] => {
    const activities = generateWorkoutActivities();
    const segments: WorkoutSegment[] = [];
    let currentTime = 0;

    for (let activityIndex = 0; activityIndex < activities.length; activityIndex++) {
      const activity = activities[activityIndex];

      if (activity.type === 'prep') {
        if (workoutBlock.prepSeconds > 0) {
          segments.push({
            activityIndex,
            rep: 1,
            phase: 'prep',
            duration: workoutBlock.prepSeconds * 1000,
            startTime: currentTime,
            endTime: currentTime + (workoutBlock.prepSeconds * 1000)
          });
          currentTime += workoutBlock.prepSeconds * 1000;
        }
      } else if (activity.type === 'rest') {
        if (workoutBlock.restSeconds > 0) {
          segments.push({
            activityIndex,
            rep: 1,
            phase: 'rest',
            duration: workoutBlock.restSeconds * 1000,
            startTime: currentTime,
            endTime: currentTime + (workoutBlock.restSeconds * 1000)
          });
          currentTime += workoutBlock.restSeconds * 1000;
        }
      } else if (activity.type === 'exercise') {
        // Generate segments for each rep
        for (let rep = 1; rep <= workoutBlock.reps; rep++) {
          const phases: TempoPhase[] = ['down', 'hold', 'up', 'pause'];
          
          for (const phase of phases) {
            const duration = workoutBlock.tempo[phase] * 1000;
            // Include all segments, even zero-duration ones for debugging
            segments.push({
              activityIndex,
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
  }, [workoutBlock, generateWorkoutActivities]);

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

  // Global timer - runs at 50ms intervals for smooth updates
  useEffect(() => {
    if (!state.isRunning || state.isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - state.startTime - state.pausedTime;
      
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

      // Calculate remaining time for current segment
      const segmentElapsed = elapsed - currentSegment.startTime;
      const timeRemaining = Math.max(0, Math.ceil((currentSegment.duration - segmentElapsed) / 1000));

      // Check if we need to advance to next segment (including zero-duration segments)
      if (elapsed >= currentSegment.endTime && currentSegmentIndex < segments.length - 1) {
        currentSegmentIndex++;
      }

      const nextSegment = segments[currentSegmentIndex];
      if (!nextSegment) return;

      setState(prev => ({
        ...prev,
        currentActivityIndex: nextSegment.activityIndex,
        currentRep: nextSegment.rep,
        currentTempoPhase: nextSegment.phase === 'prep' || nextSegment.phase === 'rest' ? prev.currentTempoPhase : nextSegment.phase as TempoPhase,
        timeRemaining,
        globalElapsed: elapsed,
        currentSegmentIndex
      }));
    }, 50); // 50ms for smooth updates

    return () => clearInterval(interval);
  }, [state.isRunning, state.isPaused, state.startTime, state.pausedTime]);

  const startWorkout = () => {
    const now = Date.now();
    const segments = segmentsRef.current;
    
    if (segments.length === 0) return;
    
    const firstSegment = segments[0];
    
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startTime: now,
      pausedTime: 0,
      globalElapsed: 0,
      currentActivityIndex: firstSegment.activityIndex,
      currentRep: firstSegment.rep,
      currentTempoPhase: firstSegment.phase === 'prep' || firstSegment.phase === 'rest' ? 'down' : firstSegment.phase as TempoPhase,
      timeRemaining: Math.ceil(firstSegment.duration / 1000),
      currentSegmentIndex: 0
    }));
  };

  const pauseWorkout = () => {
    setState(prev => ({ ...prev, isPaused: true }));
  };

  const resumeWorkout = () => {
    const now = Date.now();
    setState(prev => {
      const pauseDuration = now - (prev.startTime + prev.globalElapsed);
      return {
        ...prev,
        isPaused: false,
        pausedTime: prev.pausedTime + pauseDuration
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
    
    if (targetSegment) {
      const now = Date.now();
      setState(prev => ({
        ...prev,
        startTime: now - targetSegment.startTime,
        pausedTime: 0,
        globalElapsed: targetSegment.startTime,
        currentActivityIndex: targetSegment.activityIndex,
        currentRep: targetSegment.rep,
        currentTempoPhase: targetSegment.phase === 'prep' || targetSegment.phase === 'rest' ? 'down' : targetSegment.phase as TempoPhase,
        timeRemaining: Math.ceil(targetSegment.duration / 1000),
        currentSegmentIndex: segments.indexOf(targetSegment)
      }));
    }
  };

  const getCurrentSet = () => {
    return currentActivity?.setNumber || 1;
  };

  const isCompleted = !state.isRunning && state.globalElapsed > 0;

  return {
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
    getCurrentSet,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    toggleLock,
    jumpToActivity,
    // Debug info
    globalElapsed: state.globalElapsed,
    currentSegmentIndex: state.currentSegmentIndex,
    totalSegments: segmentsRef.current.length,
    totalWorkoutDuration
  };
} 