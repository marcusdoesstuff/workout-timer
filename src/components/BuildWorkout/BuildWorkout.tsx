import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { WorkoutBlock, FullWorkout } from '../../types/workout';
import WorkoutBlockCard from '../shared/WorkoutBlockCard';

interface BuildWorkoutProps {
  onStartWorkout: (workout: FullWorkout) => void;
  onAddBlock: () => void;
  onEditBlock: (block: WorkoutBlock, index: number) => void;
  workoutBlocks?: WorkoutBlock[];
  onBlocksChange?: (blocks: WorkoutBlock[]) => void;
}

export default function BuildWorkout({ 
  onStartWorkout, 
  onAddBlock, 
  onEditBlock,
  workoutBlocks: externalBlocks,
  onBlocksChange
}: BuildWorkoutProps) {
  const [internalBlocks, setInternalBlocks] = useState<WorkoutBlock[]>([
    // Sample data for development
    {
      id: '1',
      exerciseName: 'Squats',
      prepSeconds: 10,
      reps: 8,
      sets: 3,
      restSeconds: 60,
      blockType: 'tempo',
      tempo: { down: 3, hold: 1, up: 3, pause: 1 },
      tempoFlipped: false
    },
    {
      id: '2',
      exerciseName: 'Push-ups',
      prepSeconds: 5,
      reps: 12,
      sets: 4,
      restSeconds: 45,
      blockType: 'tempo',
      tempo: { down: 2, hold: 0, up: 2, pause: 0 },
      tempoFlipped: false
    }
  ]);

  // Use external blocks if provided, otherwise use internal state
  const workoutBlocks = externalBlocks || internalBlocks;

  const updateBlocks = (newBlocks: WorkoutBlock[]) => {
    if (onBlocksChange) {
      onBlocksChange(newBlocks);
    } else {
      setInternalBlocks(newBlocks);
    }
  };

  const handleStartWorkout = () => {
    if (workoutBlocks.length === 0) {
      alert('Please add at least one workout block before starting.');
      return;
    }

    const fullWorkout: FullWorkout = {
      id: crypto.randomUUID(),
      name: 'Workout',
      workoutBlocks,
      createdAt: new Date(),
      lastModified: new Date()
    };

    onStartWorkout(fullWorkout);
  };

  const handleEditBlock = (block: WorkoutBlock, index: number) => {
    onEditBlock(block, index);
  };

  const handleRemoveBlock = (index: number) => {
    const newBlocks = workoutBlocks.filter((_, i) => i !== index);
    updateBlocks(newBlocks);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(workoutBlocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateBlocks(items);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          Build Workout
        </h2>
        
        {/* Workout Sequence */}
        <h3 className="text-lg font-medium text-gray-700 mb-4">Workout Sequence</h3>
        <div className="border border-gray-200 rounded-lg p-4 min-h-[200px]">
          {workoutBlocks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No workout blocks added yet.</p>
              <p className="text-sm mt-2">Click the + button below to add your first block.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="workout-blocks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {workoutBlocks.map((block, index) => (
                      <Draggable key={block.id} draggableId={block.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`relative ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <WorkoutBlockCard
                              block={block}
                              onEdit={() => handleEditBlock(block, index)}
                              showEditButton={false}
                              className="mb-0 pl-12 pr-16"
                            />
                            <div
                              {...provided.dragHandleProps}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-move hover:text-gray-600"
                              title="Drag to reorder"
                            >
                              ⋮⋮
                            </div>
                            <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                onClick={() => handleEditBlock(block, index)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                title="Edit block"
                              >
                                ⚙️
                              </button>
                              <button
                                onClick={() => handleRemoveBlock(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                                title="Remove block"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          
          {/* Add Block Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={onAddBlock}
              className="flex items-center justify-center w-12 h-12 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="Add workout block"
            >
              <span className="text-3xl pb-1">+</span>
            </button>
          </div>
        </div>

        {/* Start Workout Button */}
        <div className="text-center mt-6">
          <button
            onClick={handleStartWorkout}
            disabled={workoutBlocks.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            START WORKOUT
          </button>
        </div>
      </div>
    </div>
  );
} 