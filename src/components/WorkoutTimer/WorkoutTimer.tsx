import { useEffect, useRef } from 'react';
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
    jumpToActivity
  } = useWorkoutTimer(workoutBlock);

  const activityListRef = useRef<HTMLDivElement>(null);

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

  const formatTime = (seconds: number) => {
    return seconds.toString();
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
        <h1 className="text-2xl font-bold">Workout</h1>
        <div className="flex gap-3">
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

      {/* Current Activity Display */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{currentActivity?.name}</h2>
            {currentActivity?.type === 'rest' && (
              <p className="text-lg text-gray-600">
                Set {getCurrentSet()} → Set {getCurrentSet() + 1}
              </p>
            )}
          </div>
          
          <div className="text-right">
            {currentActivity?.type === 'exercise' ? (
              <div className="flex items-center gap-6">
                {/* Rep Counter - Clean X/X format */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {currentRep}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">
                    / {workoutBlock.reps}
                  </span>
                </div>

                {/* Tempo Display */}
                <div className="text-center">
                  <div className="relative mb-2">
                    <div className="flex gap-2 justify-center">
                      {getTempoDisplay()!.map((tempo, index) => {
                        const isCurrentPhase = index === getCurrentPhaseIndex();
                        return (
                          <div key={index} className="relative">
                            {/* Tempo circle */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-semibold relative ${
                                isCurrentPhase
                                  ? 'bg-blue-600 text-white opacity-60'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                              style={{ zIndex: 1 }}
                            >
                              {tempo}
                            </div>
                            
                            {/* Progress Circle Overlay */}
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
                  <div className="flex gap-2 text-xs text-gray-500 justify-center">
                    <span className="w-10 text-center">Down</span>
                    <span className="w-10 text-center">Hold</span>
                    <span className="w-10 text-center">Up</span>
                    <span className="w-10 text-center">Pause</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Non-exercise activities - show timer normally */
              <div className="text-4xl font-bold text-blue-600">
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>
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