import { useState, useEffect } from 'react';
import NumberInput from '../shared/NumberInput';
import TempoInput from './TempoInput';
import TwoStepInput from './TwoStepInput';
import StretchInput from './StretchInput';
import { WorkoutBlock, NavigationContext, BlockType } from '../../types/workout';

interface WorkoutBlockEditorProps {
  onSave: (workout: WorkoutBlock) => void;
  onCancel: () => void;
  initialBlock?: WorkoutBlock;
  navigationContext?: NavigationContext;
  blockType?: BlockType;
}

export default function WorkoutBlockEditor({ 
  onSave, 
  onCancel,
  initialBlock,
  navigationContext = 'build-workout',
  blockType = 'tempo'
}: WorkoutBlockEditorProps) {
  
  const createDefaultBlock = (type: BlockType): WorkoutBlock => {
    const baseBlock = {
      id: crypto.randomUUID(),
      exerciseName: 'Exercise',
      prepSeconds: 10,
      reps: 8,
      sets: 3,
      restSeconds: 60,
      blockType: type
    };

    switch (type) {
      case 'tempo':
        return {
          ...baseBlock,
          exerciseName: 'Squats',
          tempo: { down: 3, hold: 1, up: 3, pause: 1 },
          tempoFlipped: false
        };
      case '2-step':
        return {
          ...baseBlock,
          exerciseName: 'Planks',
          twoStep: { contract: 3, relax: 3 }
        };
      case 'stretch':
        return {
          ...baseBlock,
          exerciseName: 'Hamstring Stretch',
          reps: 1,
          stretch: { hold: 30 }
        };
      default:
        return {
          ...baseBlock,
          tempo: { down: 3, hold: 1, up: 3, pause: 1 }
        };
    }
  };

  const [workout, setWorkout] = useState<WorkoutBlock>(
    initialBlock || createDefaultBlock(blockType)
  );

  // Auto-set reps to 1 for stretch blocks
  useEffect(() => {
    if (workout.blockType === 'stretch' && workout.reps !== 1) {
      setWorkout(prev => ({ ...prev, reps: 1 }));
    }
  }, [workout.blockType]);

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

  const renderTimingInput = () => {
    switch (workout.blockType) {
      case 'tempo':
        return workout.tempo && (
          <TempoInput
            tempo={workout.tempo}
            onChange={(tempo) => handleWorkoutChange('tempo', tempo)}
            isFlipped={workout.tempoFlipped || false}
            onFlippedChange={(flipped) => handleWorkoutChange('tempoFlipped', flipped)}
          />
        );
      case '2-step':
        return workout.twoStep && (
          <TwoStepInput
            twoStep={workout.twoStep}
            onChange={(twoStep) => handleWorkoutChange('twoStep', twoStep)}
          />
        );
      case 'stretch':
        return workout.stretch && (
          <StretchInput
            stretch={workout.stretch}
            onChange={(stretch) => handleWorkoutChange('stretch', stretch)}
          />
        );
      default:
        return null;
    }
  };

  const getBlockTypeDisplay = () => {
    switch (workout.blockType) {
      case 'tempo':
        return 'Tempo Block';
      case '2-step':
        return '2-Step Block';
      case 'stretch':
        return 'Stretch Block';
      default:
        return 'Workout Block';
    }
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
            {getBlockTypeDisplay()}
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

          {/* Reps - only show for tempo and 2-step blocks */}
          {workout.blockType !== 'stretch' && (
            <div className="flex flex-col items-center">
              <NumberInput
                value={workout.reps}
                onChange={(value) => handleWorkoutChange('reps', value)}
                min={1}
                max={99}
                label="Reps"
              />
            </div>
          )}

          {/* Timing Block - varies by block type */}
          {renderTimingInput()}

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