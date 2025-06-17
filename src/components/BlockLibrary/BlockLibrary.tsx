import { useState } from 'react';
import { WorkoutBlock } from '../../types/workout';
import WorkoutBlockCard from '../shared/WorkoutBlockCard';

interface BlockLibraryProps {
  onBack: () => void;
  onSelectBlock: (block: WorkoutBlock) => void;
  onEditBlock: (block: WorkoutBlock) => void;
  onCreateNew: () => void;
  onDeleteBlock: (blockId: string) => void;
  savedBlocks: WorkoutBlock[];
}

export default function BlockLibrary({ 
  onBack, 
  onSelectBlock, 
  onEditBlock, 
  onCreateNew,
  onDeleteBlock,
  savedBlocks
}: BlockLibraryProps) {
  const [blockToDelete, setBlockToDelete] = useState<WorkoutBlock | null>(null);

  const handleSelectBlock = (block: WorkoutBlock) => {
    onSelectBlock(block);
  };

  const handleEditBlock = (block: WorkoutBlock) => {
    onEditBlock(block);
  };

  const handleDeleteClick = (block: WorkoutBlock, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setBlockToDelete(block);
  };

  const handleConfirmDelete = () => {
    if (blockToDelete) {
      onDeleteBlock(blockToDelete.id);
      setBlockToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setBlockToDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            ← Back
          </button>
          <h2 className="text-xl font-semibold text-center text-gray-800 flex-1">
            Workout Block Library
          </h2>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Saved Blocks */}
        <div className="space-y-4 mb-6">
          {savedBlocks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No saved workout blocks yet.</p>
              <p className="text-sm mt-2">Create your first block below.</p>
            </div>
          ) : (
            savedBlocks.map((block) => (
              <div key={block.id} className="relative">
                <WorkoutBlockCard
                  block={block}
                  onClick={() => handleSelectBlock(block)}
                  onEdit={() => handleEditBlock(block)}
                  showEditButton={false}
                  className="cursor-pointer hover:shadow-md pr-20"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEditBlock(block)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    title="Edit block"
                  >
                    ⚙️
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(block, e)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                    title="Delete block"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create New Block Button */}
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={onCreateNew}
            className="w-full bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">+</span>
              <span className="font-medium">Create New Block</span>
            </div>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {blockToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Block
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{blockToDelete.exerciseName}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 