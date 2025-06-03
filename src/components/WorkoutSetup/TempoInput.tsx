import NumberInput from '../shared/NumberInput';
import { WorkoutBlock } from '../../types/workout';

interface TempoInputProps {
  tempo: WorkoutBlock['tempo'];
  onChange: (tempo: WorkoutBlock['tempo']) => void;
}

export default function TempoInput({ tempo, onChange }: TempoInputProps) {
  const handleTempoChange = (phase: keyof WorkoutBlock['tempo'], value: number) => {
    onChange({
      ...tempo,
      [phase]: value
    });
  };

  return (
    <div className="flex items-end gap-1">
      <div className="text-center">
        <div className="flex gap-1">
          <NumberInput
            value={tempo.down}
            onChange={(value) => handleTempoChange('down', value)}
            min={1}
            max={9}
            label="Down"
            className="text-xs"
          />
          <NumberInput
            value={tempo.hold}
            onChange={(value) => handleTempoChange('hold', value)}
            min={0}
            max={9}
            label="Hold"
            className="text-xs"
          />
          <NumberInput
            value={tempo.up}
            onChange={(value) => handleTempoChange('up', value)}
            min={1}
            max={9}
            label="Up"
            className="text-xs"
          />
          <NumberInput
            value={tempo.pause}
            onChange={(value) => handleTempoChange('pause', value)}
            min={0}
            max={9}
            label="Pause"
            className="text-xs"
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">Tempo</div>
      </div>
    </div>
  );
} 