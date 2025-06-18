import NumberInput from '../shared/NumberInput';
import { WorkoutBlock } from '../../types/workout';

interface TwoStepInputProps {
  twoStep: NonNullable<WorkoutBlock['twoStep']>;
  onChange: (twoStep: NonNullable<WorkoutBlock['twoStep']>) => void;
}

export default function TwoStepInput({ twoStep, onChange }: TwoStepInputProps) {
  const handleTwoStepChange = (phase: keyof NonNullable<WorkoutBlock['twoStep']>, value: number) => {
    onChange({
      ...twoStep,
      [phase]: value
    });
  };

  return (
    <div className="flex items-end gap-1">
      <div className="text-center">
        <div className="flex gap-1">
          <NumberInput
            value={twoStep.contract}
            onChange={(value) => handleTwoStepChange('contract', value)}
            min={1}
            max={9}
            label="Contract"
            className="text-xs"
          />
          <NumberInput
            value={twoStep.relax}
            onChange={(value) => handleTwoStepChange('relax', value)}
            min={1}
            max={9}
            label="Relax"
            className="text-xs"
          />
        </div>
        <div className="text-xs text-gray-600 mt-1">2-Step</div>
      </div>
    </div>
  );
} 