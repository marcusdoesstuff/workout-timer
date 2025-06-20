import { useEffect, useRef, useState } from 'react';
import { FullWorkout, WorkoutBlock } from '../../types/workout';
import { useWorkoutTimer } from '../../hooks/useWorkoutTimer';
import ProgressCircle from '../shared/ProgressCircle';
import { useCapacitor } from '../../hooks/useCapacitor';

interface WorkoutTimerProps {
  fullWorkout: FullWorkout;
  onBack: () => void;
}

export default function WorkoutTimer({ fullWorkout, onBack }: WorkoutTimerProps) {
  const {
    activities,
    currentActivity,
    currentActivityIndex,
    currentBlockIndex,
    currentRep,
    currentTempoPhase,
    timeRemaining,
    isRunning,
    isPaused,
    isLocked,
    isCompleted,
    getCurrentSet,
    getCurrentBlock,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    toggleLock,
    jumpToActivity,
    globalElapsed,
    currentSegmentIndex,
    totalSegments,
    totalWorkoutDuration
  } = useWorkoutTimer(fullWorkout);

  const {
    isNative,
    triggerHapticFeedback,
    keepScreenAwake,
    allowScreenSleep,
    ImpactStyle
  } = useCapacitor();

  const timelineRef = useRef<HTMLDivElement>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set([0])); // Start with first block expanded

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

  const getTimingDisplay = () => {
    if (currentActivity?.type === 'exercise') {
      const currentBlock = getCurrentBlock();
      switch (currentBlock.blockType) {
        case 'tempo':
          return currentBlock.tempo ? (
            currentBlock.tempoFlipped ? [
              currentBlock.tempo.up,
              currentBlock.tempo.hold,
              currentBlock.tempo.down,
              currentBlock.tempo.pause
            ] : [
              currentBlock.tempo.down,
              currentBlock.tempo.hold,
              currentBlock.tempo.up,
              currentBlock.tempo.pause
            ]
          ) : null;
        case '2-step':
          return currentBlock.twoStep ? [
            currentBlock.twoStep.contract,
            currentBlock.twoStep.relax
          ] : null;
        case 'stretch':
          return currentBlock.stretch ? [currentBlock.stretch.hold] : null;
        default:
          return null;
      }
    }
    return null;
  };

  const getCurrentPhaseIndex = () => {
    if (currentActivity?.type === 'exercise') {
      const currentBlock = getCurrentBlock();
      switch (currentBlock.blockType) {
        case 'tempo':
          if (currentBlock.tempoFlipped) {
            const flippedPhases = ['up', 'hold', 'down', 'pause'];
            return flippedPhases.indexOf(currentTempoPhase);
          } else {
            const tempoPhases = ['down', 'hold', 'up', 'pause'];
            return tempoPhases.indexOf(currentTempoPhase);
          }
        case '2-step':
          const twoStepPhases = ['contract', 'relax'];
          return twoStepPhases.indexOf(currentTempoPhase);
        case 'stretch':
          return currentTempoPhase === 'stretch' ? 0 : -1;
        default:
          return -1;
      }
    }
    return -1;
  };

  const getBlockTimingSummary = (block: WorkoutBlock) => {
    switch (block.blockType) {
      case 'tempo':
        return block.tempo ? `${block.tempo.down}${block.tempo.hold}${block.tempo.up}${block.tempo.pause} tempo` : 'tempo';
      case '2-step':
        return block.twoStep ? `${block.twoStep.contract}${block.twoStep.relax} 2-step` : '2-step';
      case 'stretch':
        return block.stretch ? `${block.stretch.hold}s stretch` : 'stretch';
      default:
        return 'timing';
    }
  };

  const getNextSectionPreview = (): number[] | null => {
    // Find the next exercise activity
    const nextExerciseIndex = activities.findIndex((activity, index) => 
      index > currentActivityIndex && activity.type === 'exercise'
    );
    
    if (nextExerciseIndex === -1) return null;
    
    const nextExercise = activities[nextExerciseIndex];
    const nextBlock = fullWorkout.workoutBlocks[nextExercise.blockIndex];
    
    switch (nextBlock.blockType) {
      case 'tempo':
        return nextBlock.tempo ? (
          nextBlock.tempoFlipped ? [
            nextBlock.tempo.up,
            nextBlock.tempo.hold,
            nextBlock.tempo.down,
            nextBlock.tempo.pause
          ] : [
            nextBlock.tempo.down,
            nextBlock.tempo.hold,
            nextBlock.tempo.up,
            nextBlock.tempo.pause
          ]
        ) : null;
      case '2-step':
        return nextBlock.twoStep ? [
          nextBlock.twoStep.contract,
          nextBlock.twoStep.relax
        ] : null;
      case 'stretch':
        return nextBlock.stretch ? [nextBlock.stretch.hold] : null;
      default:
        return null;
    }
  };

  const getNextSectionLabels = (): string[] | null => {
    // Find the next exercise activity
    const nextExerciseIndex = activities.findIndex((activity, index) => 
      index > currentActivityIndex && activity.type === 'exercise'
    );
    
    if (nextExerciseIndex === -1) return null;
    
    const nextExercise = activities[nextExerciseIndex];
    const nextBlock = fullWorkout.workoutBlocks[nextExercise.blockIndex];
    
    switch (nextBlock.blockType) {
      case 'tempo':
        return nextBlock.tempoFlipped ? ['Up', 'Hold', 'Down', 'Pause'] : ['Down', 'Hold', 'Up', 'Pause'];
      case '2-step':
        return ['Contract', 'Relax'];
      case 'stretch':
        return ['Stretch'];
      default:
        return null;
    }
  };

  // Auto-start workout when component mounts
  useEffect(() => {
    if (!isRunning && !isCompleted) {
      startWorkout();
    }
  }, []);

  // Keep screen awake during workout
  useEffect(() => {
    if (isRunning && !isPaused) {
      keepScreenAwake();
    } else {
      allowScreenSleep();
    }
    
    // Cleanup on unmount
    return () => {
      allowScreenSleep();
    };
  }, [isRunning, isPaused, keepScreenAwake, allowScreenSleep]);

  // Trigger haptic feedback on activity changes only
  const prevActivityIndexRef = useRef<number>(-1);
  useEffect(() => {
    if (isNative && isRunning && currentActivityIndex !== prevActivityIndexRef.current && currentActivityIndex >= 0) {
      // Only trigger haptic feedback when actually switching to a new activity
      triggerHapticFeedback(ImpactStyle.Medium);
      prevActivityIndexRef.current = currentActivityIndex;
    }
  }, [currentActivityIndex, isNative, isRunning, triggerHapticFeedback, ImpactStyle]);

  // Haptic feedback for timer controls
  const handlePauseResume = () => {
    if (isNative) {
      triggerHapticFeedback(ImpactStyle.Light);
    }
    if (isPaused) {
      resumeWorkout();
    } else {
      pauseWorkout();
    }
  };

  const handleToggleLock = () => {
    if (isNative) {
      triggerHapticFeedback(ImpactStyle.Heavy);
    }
    toggleLock();
  };

  // Auto-scroll to current activity when it changes
  useEffect(() => {
    if (timelineRef.current && currentActivityIndex >= 0) {
      const currentActivityElement = timelineRef.current.querySelector(`[data-activity-index="${currentActivityIndex}"]`);
      if (currentActivityElement) {
        currentActivityElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [currentActivityIndex]);

  const toggleBlockExpansion = (blockIndex: number) => {
    setExpandedBlocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blockIndex)) {
        newSet.delete(blockIndex);
      } else {
        newSet.add(blockIndex);
      }
      return newSet;
    });
  };

  const renderBlockSummary = (blockIndex: number) => {
    const block = fullWorkout.workoutBlocks[blockIndex];
    const isExpanded = expandedBlocks.has(blockIndex);
    const isCurrentBlock = blockIndex === currentBlockIndex;

    return (
      <div key={blockIndex} className="border-b border-gray-200" data-block-index={blockIndex}>
        {/* Block Header */}
        <div
          onClick={() => toggleBlockExpansion(blockIndex)}
          className={`p-4 cursor-pointer transition-colors ${
            isCurrentBlock 
              ? 'bg-blue-50 border-l-4 border-l-blue-500' 
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <span className="font-semibold">
                  Block {blockIndex + 1}: {block.exerciseName}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  ({block.sets} sets{block.blockType !== 'stretch' ? `, ${block.reps} reps` : ''})
                </span>
              </div>
            </div>
            
            {/* Block summary when collapsed */}
            {!isExpanded && (
              <div className="text-sm text-gray-500">
                {block.sets} sets • {block.reps} reps • {getBlockTimingSummary(block)}
              </div>
            )}
          </div>
        </div>

        {/* Expanded Block Details */}
        {isExpanded && (
          <div className="bg-gray-50">
            <div className="pl-8 pr-4 py-2">
              {activities
                .filter(activity => activity.blockIndex === blockIndex)
                .map((activity) => {
                  const globalIndex = activities.findIndex(a => a.id === activity.id);
                  return renderActivitySummary(activity, globalIndex, blockIndex);
                })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderActivitySummary = (activity: { id: string; type: 'prep' | 'exercise' | 'rest'; name: string; setNumber?: number; blockIndex: number }, globalActivityIndex: number, blockIndex: number) => {
    const isActive = globalActivityIndex === currentActivityIndex;
    const block = fullWorkout.workoutBlocks[blockIndex];
    
    if (activity.type === 'prep') {
      return (
        <div
          key={activity.id}
          data-activity-index={globalActivityIndex}
          onClick={() => !isLocked && jumpToActivity(globalActivityIndex)}
          className={`p-3 border-b border-gray-200 cursor-pointer transition-colors ${
            isActive ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-100'
          } ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">Prep</span>
            <span className="text-gray-600 text-sm">{block.prepSeconds}s</span>
          </div>
        </div>
      );
    }

    if (activity.type === 'rest') {
      return (
        <div
          key={activity.id}
          data-activity-index={globalActivityIndex}
          onClick={() => !isLocked && jumpToActivity(globalActivityIndex)}
          className={`p-3 border-b border-gray-200 cursor-pointer transition-colors ${
            isActive ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-100'
          } ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Rest</span>
              <span className="text-sm text-gray-600 ml-2">
                (after set {activity.setNumber})
              </span>
            </div>
            <span className="text-gray-600 text-sm">{block.restSeconds}s</span>
          </div>
        </div>
      );
    }

    if (activity.type === 'exercise') {
      const getActivityTimingDisplay = (block: WorkoutBlock) => {
        switch (block.blockType) {
          case 'tempo':
            return block.tempo ? (
              <div className="flex gap-1 text-sm text-gray-600">
                <span>{block.tempo.down}</span>
                <span>{block.tempo.hold}</span>
                <span>{block.tempo.up}</span>
                <span>{block.tempo.pause}</span>
              </div>
            ) : null;
          case '2-step':
            return block.twoStep ? (
              <div className="flex gap-1 text-sm text-gray-600">
                <span>{block.twoStep.contract}</span>
                <span>{block.twoStep.relax}</span>
              </div>
            ) : null;
          case 'stretch':
            return block.stretch ? (
              <div className="flex gap-1 text-sm text-gray-600">
                <span>{block.stretch.hold}s</span>
              </div>
            ) : null;
          default:
            return null;
        }
      };

      return (
        <div
          key={activity.id}
          data-activity-index={globalActivityIndex}
          onClick={() => !isLocked && jumpToActivity(globalActivityIndex)}
          className={`p-3 border-b border-gray-200 cursor-pointer transition-colors ${
            isActive ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-100'
          } ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Set {activity.setNumber} of {block.sets}</span>
              {block.blockType !== 'stretch' && (
                <span className="text-sm text-gray-600 ml-2">{block.reps} reps</span>
              )}
            </div>
            {getActivityTimingDisplay(block)}
          </div>
        </div>
      );
    }

    return null;
  };

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Workout Complete!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Finished in {formatDuration(globalElapsed)}
        </p>
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
        >
          Back to Build Workout
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Lock and Pause */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Workout Timer</h1>
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
            onClick={handleToggleLock}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLocked 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            {isLocked ? 'LOCKED' : 'LOCK'}
          </button>
          <button
            onClick={handlePauseResume}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
        </div>
      </div>

      {/* Global Timer Debug Display */}
      {showDebug && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">🐛 Workout Timer Debug</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-yellow-700 font-medium">Global Elapsed:</span>
              <div className="text-yellow-900 font-mono">
                {formatDuration(globalElapsed)} ({globalElapsed}ms)
              </div>
            </div>
            <div>
              <span className="text-yellow-700 font-medium">Current Segment:</span>
              <div className="text-yellow-900 font-mono">
                {currentSegmentIndex + 1} / {totalSegments}
              </div>
            </div>
            <div>
              <span className="text-yellow-700 font-medium">Current Block:</span>
              <div className="text-yellow-900 font-mono">
                {currentBlockIndex + 1} / {fullWorkout.workoutBlocks.length}
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        {/* Activity Name at top */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{currentActivity?.name}</h2>
          {currentActivity?.type === 'rest' && (
            <p className="text-lg text-gray-600">
              Set {getCurrentSet()} → Set {getCurrentSet() + 1}
            </p>
          )}
          {currentActivity?.type === 'exercise' && (
            <p className="text-lg text-gray-600">
              Set {getCurrentSet()} of {getCurrentBlock().sets}
            </p>
          )}
        </div>
        
        {currentActivity?.type === 'exercise' ? (
          <div className="max-w-2xl mx-auto">
            {/* Mobile Layout (small screens) - Stack vertically */}
            <div className="sm:hidden">
              {/* Rep Counter - Only show for non-stretch blocks */}
              {getCurrentBlock().blockType !== 'stretch' && (
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto">
                    <div className="text-center">
                      <span className="text-xl font-bold text-blue-600">
                        {currentRep}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">
                        / {getCurrentBlock().reps}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Reps</div>
                </div>
              )}

              {/* Timing Display - Full width on mobile */}
              <div className="text-center">
                <div className="relative mb-2">
                  <div className="flex gap-3 justify-center">
                    {getTimingDisplay()!.map((tempo, index) => {
                      const isCurrentPhase = index === getCurrentPhaseIndex();
                      
                      return (
                        <div key={index} className="relative">
                          {/* Tempo circle - larger on mobile for better touch */}
                          <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-semibold relative ${
                              isCurrentPhase
                                ? 'bg-blue-200 text-blue-600'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                            style={{ zIndex: 1 }}
                          >
                            {isCurrentPhase ? timeRemaining : tempo}
                          </div>
                          
                          {/* Progress Circle Overlay - only for current phase */}
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
                <div className="flex gap-3 text-xs text-gray-500 justify-center">
                  {getCurrentBlock().blockType === 'tempo' && (
                    <>
                      {getCurrentBlock().tempoFlipped ? (
                        <>
                          <span className="w-20 text-center">Up</span>
                          <span className="w-20 text-center">Hold</span>
                          <span className="w-20 text-center">Down</span>
                          <span className="w-20 text-center">Pause</span>
                        </>
                      ) : (
                        <>
                          <span className="w-20 text-center">Down</span>
                          <span className="w-20 text-center">Hold</span>
                          <span className="w-20 text-center">Up</span>
                          <span className="w-20 text-center">Pause</span>
                        </>
                      )}
                    </>
                  )}
                  {getCurrentBlock().blockType === '2-step' && (
                    <>
                      <span className="w-20 text-center">Contract</span>
                      <span className="w-20 text-center">Relax</span>
                    </>
                  )}
                  {getCurrentBlock().blockType === 'stretch' && (
                    <span className="w-20 text-center">Stretch</span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop/Tablet Layout (sm and up) - Side by side */}
            <div className="hidden sm:flex items-center justify-center gap-6 md:gap-8 lg:gap-12">
              {/* Rep Counter - Large rounded block (only show for non-stretch blocks) */}
              {getCurrentBlock().blockType !== 'stretch' && (
                <div className="text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-2xl md:text-3xl font-bold text-blue-600">
                        {currentRep}
                      </span>
                      <span className="text-base md:text-lg text-gray-600 ml-1">
                        / {getCurrentBlock().reps}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Reps</div>
                </div>
              )}

              {/* Timing Display - Larger circles */}
              <div className="text-center">
                <div className="relative mb-2">
                  <div className="flex gap-3 md:gap-4 justify-center">
                    {getTimingDisplay()!.map((tempo, index) => {
                      const isCurrentPhase = index === getCurrentPhaseIndex();
                      
                      return (
                        <div key={index} className="relative">
                          {/* Tempo circle - shows countdown when active */}
                          <div
                            className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-xl md:text-2xl font-semibold relative ${
                              isCurrentPhase
                                ? 'bg-blue-200 text-blue-600'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                            style={{ zIndex: 1 }}
                          >
                            {isCurrentPhase ? timeRemaining : tempo}
                          </div>
                          
                          {/* Progress Circle Overlay - only for current phase */}
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
                <div className="flex gap-3 md:gap-4 text-xs text-gray-500 justify-center">
                  {getCurrentBlock().blockType === 'tempo' && (
                    <>
                      {getCurrentBlock().tempoFlipped ? (
                        <>
                          <span className="w-20 md:w-24 text-center">Up</span>
                          <span className="w-20 md:w-24 text-center">Hold</span>
                          <span className="w-20 md:w-24 text-center">Down</span>
                          <span className="w-20 md:w-24 text-center">Pause</span>
                        </>
                      ) : (
                        <>
                          <span className="w-20 md:w-24 text-center">Down</span>
                          <span className="w-20 md:w-24 text-center">Hold</span>
                          <span className="w-20 md:w-24 text-center">Up</span>
                          <span className="w-20 md:w-24 text-center">Pause</span>
                        </>
                      )}
                    </>
                  )}
                  {getCurrentBlock().blockType === '2-step' && (
                    <>
                      <span className="w-20 md:w-24 text-center">Contract</span>
                      <span className="w-20 md:w-24 text-center">Relax</span>
                    </>
                  )}
                  {getCurrentBlock().blockType === 'stretch' && (
                    <span className="w-20 md:w-24 text-center">Stretch</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Non-exercise activities - show timer with next section preview */
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">
              {formatTime(timeRemaining)}
            </div>
            {/* Preview of next section */}
            {getNextSectionPreview() && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Next up:</div>
                <div className="flex gap-2 justify-center">
                  {getNextSectionPreview()!.map((value, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600"
                    >
                      {value}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 justify-center mt-1">
                  {getNextSectionLabels()!.map((label, index) => (
                    <span key={index} className="w-8 text-xs text-gray-500 text-center">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Block Timeline */}
      <div className="bg-white rounded-lg shadow-md max-h-96 overflow-y-auto" ref={timelineRef}>
        {fullWorkout.workoutBlocks.map((_, blockIndex) => renderBlockSummary(blockIndex))}
      </div>

      {/* Back Button */}
      <div className="text-center mt-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 underline"
        >
          Back to Build Workout
        </button>
      </div>
    </div>
  );
} 