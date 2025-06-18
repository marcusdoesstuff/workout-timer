import { BlockType } from '../../types/workout';

interface BlockTypeSelectorProps {
  onSelectBlockType: (blockType: BlockType) => void;
  onCancel: () => void;
}

export default function BlockTypeSelector({ onSelectBlockType, onCancel }: BlockTypeSelectorProps) {
  const blockTypes = [
    {
      type: 'tempo' as BlockType,
      title: 'Tempo Block',
      description: 'Traditional 4-phase tempo with down, hold, up, and pause',
      icon: '🏋️',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      type: '2-step' as BlockType,
      title: '2-Step Block', 
      description: 'Simple contract and relax pattern for isometric exercises',
      icon: '💪',
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      type: 'stretch' as BlockType,
      title: 'Stretch Block',
      description: 'Single hold phase for stretching and flexibility work',
      icon: '🧘',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onCancel}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            ← Back
          </button>
          <h2 className="text-xl font-semibold text-center text-gray-800 flex-1">
            Choose Block Type
          </h2>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {blockTypes.map((blockType) => (
            <button
              key={blockType.type}
              onClick={() => onSelectBlockType(blockType.type)}
              className={`p-6 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${blockType.color}`}
            >
              <div className="text-center">
                <div className="text-3xl mb-3">{blockType.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {blockType.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {blockType.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 