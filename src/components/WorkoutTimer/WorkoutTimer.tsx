import { useEffect, useRef, useState } from 'react';
import { WorkoutBlock } from '../../types/workout';
import { useWorkoutTimer } from '../../hooks/useWorkoutTimer';
import ProgressCircle from '../shared/ProgressCircle';

interface WorkoutTimerProps {
  workoutBlock: WorkoutBlock;
  onBack: () => void;
}

export default function WorkoutTimer({ workoutBlock, onBack }: WorkoutTimerProps) {
  const {
    activities,
    currentActivity,
    currentActivityIndex,
    currentRep,
    currentTempoPhase,
    timeRemaining,
    isRunning,
    isPaused,
    isLocked,
    isCompleted,
    getCurrentSet,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    toggleLock,
    jumpToActivity,
    globalElapsed,
    currentSegmentIndex,
    totalSegments,
    totalWorkoutDuration
  } = useWorkoutTimer(workoutBlock);

  const activityListRef = useRef<HTMLDivElement>(null);
  
  // State for tracking when phases have recently completed (for transition timing)
  const [fadingPhases, setFadingPhases] = useState<Set<string>>(new Set());
  const fadeTimeoutsRef = useRef<Map<string, number>>(new Map());
  const [showDebug, setShowDebug] = useState<boolean>(true);

  const formatTime = (seconds: number) => {
    return seconds.toString();
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getWorkoutTimeRemaining = () => {
    return Math.max(0, totalWorkoutDuration - globalElapsed);
  };

  const getTempoDisplay = () => {
    if (currentActivity?.type === 'exercise') {
      return [
        workoutBlock.tempo.down,
        workoutBlock.tempo.hold,
        workoutBlock.tempo.up,
        workoutBlock.tempo.pause
      ];
    }
    return null;
  };

  const getCurrentPhaseIndex = () => {
    if (currentActivity?.type === 'exercise') {
      const phases = ['down', 'hold', 'up', 'pause'];
      return phases.indexOf(currentTempoPhase);
    }
    return -1;
  };

  // Auto-scroll to current activity
  useEffect(() => {
    if (activityListRef.current) {
      const currentElement = activityListRef.current.children[currentActivityIndex] as HTMLElement;
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentActivityIndex]);

  // Auto-start workout when component mounts
  useEffect(() => {
    if (!isRunning && !isCompleted) {
      startWorkout();
    }
  }, []);

  // Simplified fade logic - track when segments change
  useEffect(() => {
    if (currentActivity?.type === 'exercise') {
      const currentPhaseIndex = getCurrentPhaseIndex();
      const currentKey = `${currentActivityIndex}-${currentRep}-${currentPhaseIndex}`;
      
      // When segment changes, add previous phases to fading set
      // This is much simpler and relies on the global timer for timing
      return () => {
        // Add current phase to fading when this effect cleans up (segment changes)
        if (currentPhaseIndex >= 0) {
          const fadeKey = `${currentActivityIndex}-${currentRep}-${currentPhaseIndex}`;
          setFadingPhases(prev => new Set([...prev, fadeKey]));
          
          // Remove from fading after 500ms
          setTimeout(() => {
            setFadingPhases(prev => {
              const newSet = new Set(prev);
              newSet.delete(fadeKey);
              return newSet;
            });
          }, 500);
        }
      };
    }
  }, [currentActivityIndex, currentRep, currentTempoPhase]);

  // Clear fading phases when activity changes
  useEffect(() => {
    setFadingPhases(new Set());
  }, [currentActivityIndex]);

  const renderActivitySummary = (activity: any, index: number) => {
    const isActive = index === currentActivityIndex;
    
    if (activity.type === 'prep') {
      return (
        <div
          key={activity.id}
          onClick={() => jumpToActivity(index)}
          className={`p-3 border-b border-gray-200 cursor-pointer transition-colors ${
            isActive ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'
          } ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">Prep</span>
            <span className="text-gray-600">{workoutBlock.prepSeconds} sec</span>
          </div>
        </div>
      );
    }

    if (activity.type === 'rest') {
      return (
        <div
          key={activity.id}
          onClick={() => jumpToActivity(index)}
          className={`p-3 border-b border-gray-200 cursor-pointer transition-colors ${
            isActive ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'
          } ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">Rest</span>
            <span className="text-gray-600">{workoutBlock.restSeconds} sec</span>
          </div>
        </div>
      );
    }

    if (activity.type === 'exercise') {
      return (
        <div
          key={activity.id}
          onClick={() => jumpToActivity(index)}
          className={`p-3 border-b border-gray-200 cursor-pointer transition-colors ${
            isActive ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'
          } ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">{workoutBlock.exerciseName}</span>
              <span className="text-sm text-gray-600 ml-2">
                set {activity.setNumber} of {workoutBlock.sets} • {workoutBlock.reps} reps
              </span>
            </div>
            <div className="flex gap-1 text-sm">
              <span>{workoutBlock.tempo.down}</span>
              <span>{workoutBlock.tempo.hold}</span>
              <span>{workoutBlock.tempo.up}</span>
              <span>{workoutBlock.tempo.pause}</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Workout Complete!</h2>
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
        >
          Back to Setup
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Lock and Pause */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Workout</h1>
          <div className="text-sm text-gray-600 mt-1">
            Time Remaining: <span className="font-mono font-semibold">{formatDuration(getWorkoutTimeRemaining())}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-medium transition-colors text-sm"
          >
            🐛 Debug
          </button>
          <button
            onClick={toggleLock}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLocked 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            {isLocked ? 'LOCKED' : 'LOCK'}
          </button>
          <button
            onClick={isPaused ? resumeWorkout : pauseWorkout}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
        </div>
      </div>

      {/* Global Timer Debug Display */}
      {showDebug && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">🐛 Global Timer Debug</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-yellow-700 font-medium">Global Elapsed:</span>
              <div className="text-yellow-900 font-mono">
                {formatDuration(globalElapsed)}
              </div>
            </div>
            <div>
              <span className="text-yellow-700 font-medium">Current Segment:</span>
              <div className="text-yellow-900 font-mono">
                {currentSegmentIndex + 1} / {totalSegments}
              </div>
            </div>
            <div>
              <span className="text-yellow-700 font-medium">Segment Time Left:</span>
              <div className="text-yellow-900 font-mono">
                {timeRemaining}s
              </div>
            </div>
            <div>
              <span className="text-yellow-700 font-medium">Total Duration:</span>
              <div className="text-yellow-900 font-mono">
                {formatDuration(totalWorkoutDuration)}
              </div>
            </div>
            <div>
              <span className="text-yellow-700 font-medium">Status:</span>
              <div className="text-yellow-900 font-mono">
                {isRunning ? (isPaused ? 'PAUSED' : 'RUNNING') : 'STOPPED'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Activity Display */}
      <div className="bg-blue rounded-lg shadow-md p-6 mb-4">
        {/* Activity Name at top */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{currentActivity?.name}</h2>
          {currentActivity?.type === 'rest' && (
            <p className="text-lg text-gray-600">
              Set {getCurrentSet()} → Set {getCurrentSet() + 1}
            </p>
          )}
        </div>
        
        {currentActivity?.type === 'exercise' ? (
          <div className="max-w-2xl mx-auto">
            {/* Reps and Tempo sections */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12">
              {/* Rep Counter - Large rounded block */}
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                      {currentRep}
                    </span>
                    <span className="text-sm sm:text-base md:text-lg text-gray-600 ml-1">
                      / {workoutBlock.reps}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Reps</div>
              </div>

              {/* Tempo Display - Larger circles */}
              <div className="text-center">
                <div className="relative mb-2">
                  <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center">
                    {getTempoDisplay()!.map((tempo, index) => {
                      const isCurrentPhase = index === getCurrentPhaseIndex();
                      const completedKey = `${currentActivityIndex}-${currentRep}-${index}`;
                      const isRecentlyCompleted = fadingPhases.has(completedKey);
                      
                      // Show blue for current phase OR recently completed (fading) phase
                      const shouldShowBlue = isCurrentPhase || isRecentlyCompleted;
                      
                      return (
                        <div key={index} className="relative">
                          {/* Tempo circle - responsive size with conditional fade transition */}
                          <div
                            className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-semibold relative ${
                              isCurrentPhase
                                ? 'bg-blue-200 text-blue-600' // Active: immediate blue, no transition
                                : isRecentlyCompleted
                                ? 'bg-gray-200 text-gray-600 transition-all duration-500' // Fading: transition to gray
                                : 'bg-gray-200 text-gray-600' // Inactive: gray, no transition
                            }`}
                            style={{ zIndex: 1 }}
                          >
                            {tempo}
                          </div>
                          
                          {/* Progress Circle Overlay - purely visual, no completion callbacks */}
                          {isCurrentPhase && (
                            <ProgressCircle
                              key={`${currentActivityIndex}-${currentTempoPhase}-${currentRep}`}
                              duration={tempo}
                              isPaused={isPaused}
                              isActive={isCurrentPhase}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Phase labels */}
                <div className="flex gap-2 sm:gap-3 md:gap-4 text-xs text-gray-500 justify-center">
                  <span className="w-16 sm:w-20 md:w-24 text-center">Down</span>
                  <span className="w-16 sm:w-20 md:w-24 text-center">Hold</span>
                  <span className="w-16 sm:w-20 md:w-24 text-center">Up</span>
                  <span className="w-16 sm:w-20 md:w-24 text-center">Pause</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Non-exercise activities - show timer normally */
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {formatTime(timeRemaining)}
            </div>
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-lg shadow-md max-h-96 overflow-y-auto" ref={activityListRef}>
        {activities.map((activity, index) => renderActivitySummary(activity, index))}
      </div>

      {/* Back Button */}
      <div className="text-center mt-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 underline"
        >
          Back to Setup
        </button>
      </div>
    </div>
  );
} 