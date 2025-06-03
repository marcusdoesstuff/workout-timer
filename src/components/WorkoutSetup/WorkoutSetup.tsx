import { useState } from 'react';
import NumberInput from '../shared/NumberInput';
import TempoInput from './TempoInput';
import { WorkoutBlock } from '../../types/workout';

interface WorkoutSetupProps {
  onStartWorkout: (workout: WorkoutBlock) => void;
}

export default function WorkoutSetup({ onStartWorkout }: WorkoutSetupProps) {
  const [workout, setWorkout] = useState<WorkoutBlock>({
    id: '1',
    exerciseName: 'Squats',
    prepSeconds: 10,
    reps: 8,
    sets: 3,
    restSeconds: 60,
    tempo: {
      down: 3,
      hold: 1,
      up: 3,
      pause: 1
    }
  });

  const handleWorkoutChange = (field: keyof WorkoutBlock, value: any) => {
    setWorkout(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartWorkout = () => {
    onStartWorkout(workout);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          Workout Block
        </h2>
        
        {/* Exercise Name */}
        <div className="mb-6">
          <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-700 mb-2">
            Exercise Name:
          </label>
          <input
            id="exerciseName"
            type="text"
            value={workout.exerciseName}
            onChange={(e) => handleWorkoutChange('exerciseName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter exercise name"
          />
        </div>

        {/* Horizontal Controls Layout */}
        <div className="flex items-start justify-center gap-6 mb-8">
          {/* Prep */}
          <div className="flex flex-col items-center">
            <NumberInput
              value={workout.prepSeconds}
              onChange={(value) => handleWorkoutChange('prepSeconds', value)}
              min={0}
              max={99}
              label="Prep"
            />
          </div>

          {/* Reps */}
          <div className="flex flex-col items-center">
            <NumberInput
              value={workout.reps}
              onChange={(value) => handleWorkoutChange('reps', value)}
              min={1}
              max={99}
              label="Reps"
            />
          </div>

          {/* Tempo Block */}
          <TempoInput
            tempo={workout.tempo}
            onChange={(tempo) => handleWorkoutChange('tempo', tempo)}
          />

          {/* Sets and Rest grouped together */}
          <div className="flex gap-2">
            <NumberInput
              value={workout.sets}
              onChange={(value) => handleWorkoutChange('sets', value)}
              min={1}
              max={99}
              label="Sets"
            />
            <NumberInput
              value={workout.restSeconds}
              onChange={(value) => handleWorkoutChange('restSeconds', value)}
              min={0}
              max={999}
              label="Rest(s)"
            />
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStartWorkout}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            START WORKOUT
          </button>
        </div>
      </div>
    </div>
  );
} 