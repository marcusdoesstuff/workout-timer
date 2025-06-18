import { useState } from 'react';
import NumberInput from '../shared/NumberInput';
import { WorkoutBlock } from '../../types/workout';

interface TempoInputProps {
  tempo: NonNullable<WorkoutBlock['tempo']>;
  onChange: (tempo: NonNullable<WorkoutBlock['tempo']>) => void;
  isFlipped?: boolean;
  onFlippedChange?: (flipped: boolean) => void;
}

export default function TempoInput({ tempo, onChange, isFlipped = false, onFlippedChange }: TempoInputProps) {
  const handleTempoChange = (phase: keyof NonNullable<WorkoutBlock['tempo']>, value: number) => {
    onChange({
      ...tempo,
      [phase]: value
    });
  };

  const getLabels = () => {
    if (isFlipped) {
      return {
        first: 'Up',
        second: 'Hold',
        third: 'Down', 
        fourth: 'Pause'
      };
    } else {
      return {
        first: 'Down',
        second: 'Hold',
        third: 'Up',
        fourth: 'Pause'
      };
    }
  };

  const getValues = () => {
    if (isFlipped) {
      return {
        first: tempo.up,
        second: tempo.hold,
        third: tempo.down,
        fourth: tempo.pause
      };
    } else {
      return {
        first: tempo.down,
        second: tempo.hold,
        third: tempo.up,
        fourth: tempo.pause
      };
    }
  };

  const handleValueChange = (position: 'first' | 'second' | 'third' | 'fourth', value: number) => {
    if (isFlipped) {
      switch (position) {
        case 'first':
          handleTempoChange('up', value);
          break;
        case 'second':
          handleTempoChange('hold', value);
          break;
        case 'third':
          handleTempoChange('down', value);
          break;
        case 'fourth':
          handleTempoChange('pause', value);
          break;
      }
    } else {
      switch (position) {
        case 'first':
          handleTempoChange('down', value);
          break;
        case 'second':
          handleTempoChange('hold', value);
          break;
        case 'third':
          handleTempoChange('up', value);
          break;
        case 'fourth':
          handleTempoChange('pause', value);
          break;
      }
    }
  };

  const labels = getLabels();
  const values = getValues();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-end gap-1">
        <div className="text-center">
          <div className="flex gap-1">
            <NumberInput
              value={values.first}
              onChange={(value) => handleValueChange('first', value)}
              min={1}
              max={9}
              label={labels.first}
              className="text-xs"
            />
            <NumberInput
              value={values.second}
              onChange={(value) => handleValueChange('second', value)}
              min={0}
              max={9}
              label={labels.second}
              className="text-xs"
            />
            <NumberInput
              value={values.third}
              onChange={(value) => handleValueChange('third', value)}
              min={1}
              max={9}
              label={labels.third}
              className="text-xs"
            />
            <NumberInput
              value={values.fourth}
              onChange={(value) => handleValueChange('fourth', value)}
              min={0}
              max={9}
              label={labels.fourth}
              className="text-xs"
            />
          </div>
          <div className="text-xs text-gray-600 mt-1">Tempo</div>
        </div>
      </div>
      
      {/* Flip checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="tempo-flip"
          checked={isFlipped}
          onChange={(e) => onFlippedChange?.(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="tempo-flip" className="text-xs text-gray-600">
          Up first
        </label>
      </div>
    </div>
  );
} 