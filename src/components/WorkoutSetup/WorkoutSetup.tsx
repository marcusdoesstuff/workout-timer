import { useState } from 'react';
import NumberInput from '../shared/NumberInput';
import TempoInput from './TempoInput';
import { WorkoutBlock, NavigationContext } from '../../types/workout';

interface WorkoutBlockEditorProps {
  onSave: (workout: WorkoutBlock) => void;
  onCancel: () => void;
  initialBlock?: WorkoutBlock;
  navigationContext?: NavigationContext;
}

export default function WorkoutBlockEditor({ 
  onSave, 
  onCancel,
  initialBlock,
  navigationContext = 'build-workout'
}: WorkoutBlockEditorProps) {
  const [workout, setWorkout] = useState<WorkoutBlock>(initialBlock || {
    id: crypto.randomUUID(),
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

  const handleSave = () => {
    onSave(workout);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            ← Back
          </button>
          <h2 className="text-xl font-semibold text-center text-gray-800 flex-1">
            Workout Block
          </h2>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
        
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

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            SAVE BLOCK
          </button>
        </div>
      </div>
    </div>
  );
} 