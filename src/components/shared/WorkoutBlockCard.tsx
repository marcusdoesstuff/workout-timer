import { WorkoutBlock } from '../../types/workout';

interface WorkoutBlockCardProps {
  block: WorkoutBlock;
  showEditButton?: boolean;
  onEdit?: () => void;
  onClick?: () => void;
  className?: string;
}

export default function WorkoutBlockCard({ 
  block, 
  showEditButton = true,
  onEdit,
  onClick,
  className = ""
}: WorkoutBlockCardProps) {
  const formatTempo = (tempo: NonNullable<WorkoutBlock['tempo']>) => {
    return `${tempo.down}${tempo.hold}${tempo.up}${tempo.pause}`;
  };

  const formatTwoStep = (twoStep: NonNullable<WorkoutBlock['twoStep']>) => {
    return `${twoStep.contract}${twoStep.relax}`;
  };

  const formatStretch = (stretch: NonNullable<WorkoutBlock['stretch']>) => {
    return `${stretch.hold}s`;
  };

  const getTimingDisplay = () => {
    switch (block.blockType) {
      case 'tempo':
        return block.tempo ? `${formatTempo(block.tempo)} tempo` : 'tempo';
      case '2-step':
        return block.twoStep ? `${formatTwoStep(block.twoStep)} 2-step` : '2-step';
      case 'stretch':
        return block.stretch ? `${formatStretch(block.stretch)} stretch` : 'stretch';
      default:
        return 'timing';
    }
  };

  const getBlockTypeIcon = () => {
    switch (block.blockType) {
      case 'tempo':
        return '🏋️';
      case '2-step':
        return '💪';
      case 'stretch':
        return '🧘';
      default:
        return '';
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking edit button
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${className}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getBlockTypeIcon()}</span>
            <h3 className="font-semibold text-gray-800">{block.exerciseName}</h3>
          </div>
          <div className="text-sm text-gray-600">
            {block.sets} sets{block.blockType !== 'stretch' ? ` • ${block.reps} reps` : ''} • {block.prepSeconds}s prep • {getTimingDisplay()} • {block.restSeconds}s rest
          </div>
        </div>
        
        {showEditButton && onEdit && (
          <button
            onClick={handleEditClick}
            className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
            title="Edit block"
          >
            ⚙️
          </button>
        )}
      </div>
    </div>
  );
} 