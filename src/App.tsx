import { useState } from 'react';
import WorkoutSetup from './components/WorkoutSetup/WorkoutSetup';
import WorkoutTimer from './components/WorkoutTimer/WorkoutTimer';
import { WorkoutBlock } from './types/workout';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'setup' | 'timer'>('setup');
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutBlock | null>(null);

  const handleStartWorkout = (workout: WorkoutBlock) => {
    setCurrentWorkout(workout);
    setCurrentScreen('timer');
  };

  const handleBackToSetup = () => {
    setCurrentScreen('setup');
    setCurrentWorkout(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Workout Timer
        </h1>
        
        {currentScreen === 'setup' && (
          <WorkoutSetup onStartWorkout={handleStartWorkout} />
        )}
        
        {currentScreen === 'timer' && currentWorkout && (
          <WorkoutTimer 
            workoutBlock={currentWorkout} 
            onBack={handleBackToSetup}
          />
        )}
      </div>
    </div>
  );
}

export default App; 