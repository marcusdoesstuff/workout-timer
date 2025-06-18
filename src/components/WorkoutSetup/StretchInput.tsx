import NumberInput from '../shared/NumberInput';
import { WorkoutBlock } from '../../types/workout';

interface StretchInputProps {
  stretch: NonNullable<WorkoutBlock['stretch']>;
  onChange: (stretch: NonNullable<WorkoutBlock['stretch']>) => void;
}

export default function StretchInput({ stretch, onChange }: StretchInputProps) {
  const handleStretchChange = (value: number) => {
    onChange({
      hold: value
    });
  };

  return (
    <div className="flex items-end gap-1">
      <div className="text-center">
        <NumberInput
          value={stretch.hold}
          onChange={handleStretchChange}
          min={1}
          max={99}
          label="Stretch"
          className="text-xs"
        />
        <div className="text-xs text-gray-600 mt-1">Stretch</div>
      </div>
    </div>
  );
} 