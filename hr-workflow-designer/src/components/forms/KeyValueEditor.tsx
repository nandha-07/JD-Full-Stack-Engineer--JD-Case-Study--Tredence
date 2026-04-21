import React, { useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { KeyValuePair } from '../../types/workflow';

interface KeyValueEditorProps {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  label?: string;
}

export default function KeyValueEditor({ pairs, onChange, label = 'Custom Fields' }: KeyValueEditorProps) {
  const addPair = useCallback(() => {
    onChange([...pairs, { key: '', value: '' }]);
  }, [pairs, onChange]);

  const updatePair = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const updated = pairs.map((p, i) => (i === index ? { ...p, [field]: value } : p));
      onChange(updated);
    },
    [pairs, onChange]
  );

  const removePair = useCallback(
    (index: number) => {
      onChange(pairs.filter((_, i) => i !== index));
    },
    [pairs, onChange]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label style={{ fontSize: 11, fontWeight: 600, color: '#8b92b3', letterSpacing: '0.05em' }}>
          {label.toUpperCase()}
        </label>
        <button
          onClick={addPair}
          style={{
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 11,
            color: '#818cf8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Plus size={10} /> Add
        </button>
      </div>

      {pairs.length === 0 && (
        <div
          style={{
            borderRadius: 8,
            border: '1px dashed rgba(99,102,241,0.2)',
            padding: '10px',
            textAlign: 'center',
            fontSize: 11,
            color: '#8b92b3',
          }}
        >
          No {label.toLowerCase()} added yet
        </div>
      )}

      <div className="flex flex-col gap-2">
        {pairs.map((pair, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={pair.key}
              onChange={(e) => updatePair(i, 'key', e.target.value)}
              placeholder="Key"
              style={inputStyle}
            />
            <input
              value={pair.value}
              onChange={(e) => updatePair(i, 'value', e.target.value)}
              placeholder="Value"
              style={inputStyle}
            />
            <button
              onClick={() => removePair(i)}
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 6,
                padding: 5,
                cursor: 'pointer',
                color: '#f87171',
                flexShrink: 0,
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '7px 10px',
  fontSize: 13,
  color: '#f0f2ff',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: '#8b92b3',
  letterSpacing: '0.05em',
  marginBottom: 4,
};
