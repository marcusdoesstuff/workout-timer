import { useState, useEffect } from 'react';
import BuildWorkout from './components/BuildWorkout/BuildWorkout';
import BlockLibrary from './components/BlockLibrary/BlockLibrary';
import WorkoutBlockEditor from './components/WorkoutSetup/WorkoutSetup';
import WorkoutTimer from './components/WorkoutTimer/WorkoutTimer';
import { WorkoutBlock, FullWorkout, NavigationContext } from './types/workout';
import { getSavedBlocks, saveWorkoutBlock, deleteWorkoutBlock, scheduleAutoSave } from './utils/storage';

type Screen = 'build-workout' | 'block-library' | 'block-editor' | 'timer';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('build-workout');
  const [currentWorkout, setCurrentWorkout] = useState<FullWorkout | null>(null);
  const [workoutBlocks, setWorkoutBlocks] = useState<WorkoutBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<WorkoutBlock | null>(null);
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null);
  const [navigationContext, setNavigationContext] = useState<NavigationContext>('build-workout');
  const [savedBlocks, setSavedBlocks] = useState<WorkoutBlock[]>([]);

  // Load saved blocks on app start
  useEffect(() => {
    const blocks = getSavedBlocks();
    setSavedBlocks(blocks);
  }, []);

  // Auto-save when blocks change
  useEffect(() => {
    scheduleAutoSave(() => {
      // Auto-save current workout state if needed
      console.log('Auto-save triggered');
    }, 2000);
  }, [workoutBlocks, savedBlocks]);

  const handleStartWorkout = (workout: FullWorkout) => {
    setCurrentWorkout(workout);
    setCurrentScreen('timer');
  };

  const handleBackFromTimer = () => {
    setCurrentScreen('build-workout');
    setCurrentWorkout(null);
  };

  const handleAddBlock = () => {
    setNavigationContext('build-workout');
    setCurrentScreen('block-library');
  };

  const handleEditBlockFromBuildWorkout = (block: WorkoutBlock, index: number) => {
    setEditingBlock(block);
    setEditingBlockIndex(index);
    setNavigationContext('build-workout');
    setCurrentScreen('block-editor');
  };

  const handleBackFromBlockLibrary = () => {
    setCurrentScreen('build-workout');
  };

  const handleSelectBlockFromLibrary = (block: WorkoutBlock) => {
    // Add the selected block to the workout
    setWorkoutBlocks(prev => [...prev, { ...block, id: crypto.randomUUID() }]);
    setCurrentScreen('build-workout');
  };

  const handleEditBlockFromLibrary = (block: WorkoutBlock) => {
    setEditingBlock(block);
    setEditingBlockIndex(null); // Not editing from build workout
    setNavigationContext('block-library');
    setCurrentScreen('block-editor');
  };

  const handleDeleteBlockFromLibrary = (blockId: string) => {
    deleteWorkoutBlock(blockId);
    setSavedBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  const handleCreateNewBlock = () => {
    setEditingBlock(null);
    setEditingBlockIndex(null);
    setNavigationContext('block-library');
    setCurrentScreen('block-editor');
  };

  const handleSaveBlock = (block: WorkoutBlock) => {
    if (navigationContext === 'build-workout' && editingBlockIndex !== null) {
      // Update existing block in workout
      setWorkoutBlocks(prev => 
        prev.map((b, i) => i === editingBlockIndex ? block : b)
      );
    } else if (navigationContext === 'block-library') {
      // Save to library
      const savedBlock = saveWorkoutBlock(block);
      setSavedBlocks(prev => {
        const existingIndex = prev.findIndex(b => b.id === block.id);
        if (existingIndex >= 0) {
          return prev.map((b, i) => i === existingIndex ? savedBlock : b);
        } else {
          return [...prev, savedBlock];
        }
      });
    }

    // Return to the screen that called the editor
    setCurrentScreen(navigationContext === 'build-workout' ? 'build-workout' : 'block-library');
    setEditingBlock(null);
    setEditingBlockIndex(null);
  };

  const handleCancelBlockEdit = () => {
    // Return to the screen that called the editor
    setCurrentScreen(navigationContext === 'build-workout' ? 'build-workout' : 'block-library');
    setEditingBlock(null);
    setEditingBlockIndex(null);
  };

  const handleBlocksChange = (blocks: WorkoutBlock[]) => {
    setWorkoutBlocks(blocks);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {currentScreen === 'build-workout' && (
          <BuildWorkout 
            onStartWorkout={handleStartWorkout}
            onAddBlock={handleAddBlock}
            onEditBlock={handleEditBlockFromBuildWorkout}
            workoutBlocks={workoutBlocks}
            onBlocksChange={handleBlocksChange}
          />
        )}
        
        {currentScreen === 'block-library' && (
          <BlockLibrary
            onBack={handleBackFromBlockLibrary}
            onSelectBlock={handleSelectBlockFromLibrary}
            onEditBlock={handleEditBlockFromLibrary}
            onDeleteBlock={handleDeleteBlockFromLibrary}
            onCreateNew={handleCreateNewBlock}
            savedBlocks={savedBlocks}
          />
        )}

        {currentScreen === 'block-editor' && (
          <WorkoutBlockEditor
            onSave={handleSaveBlock}
            onCancel={handleCancelBlockEdit}
            initialBlock={editingBlock || undefined}
            navigationContext={navigationContext}
          />
        )}
        
        {currentScreen === 'timer' && currentWorkout && (
          <WorkoutTimer 
            fullWorkout={currentWorkout}
            onBack={handleBackFromTimer}
          />
        )}
      </div>
    </div>
  );
}

export default App; 