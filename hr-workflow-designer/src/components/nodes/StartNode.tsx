
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Play, AlertCircle } from 'lucide-react';

interface StartData {
  title?: string;
  metadata?: Array<{ key: string; value: string }>;
  hasError?: boolean;
  errorMessage?: string;
}

export default function StartNode({ data, selected }: NodeProps) {
  const d = data as StartData;

  return (
    <div className="relative group" style={{ minWidth: 200 }}>
      {d.hasError && (
        <div className="absolute -top-2 -right-2 z-10">
          <AlertCircle size={16} color="#ef4444" />
        </div>
      )}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
        border: `2px solid ${selected ? '#6366f1' : d.hasError ? '#ef4444' : '#10b981'}`,
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: selected
          ? '0 0 0 3px rgba(99,102,241,0.3), 0 4px 20px rgba(16,185,129,0.2)'
          : '0 4px 20px rgba(16,185,129,0.15)',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ background: 'rgba(16,185,129,0.2)', borderRadius: 8, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Play size={14} fill="#10b981" stroke="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: '#6ee7b7', letterSpacing: '0.1em', fontWeight: 600 }}>START</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ecfdf5', lineHeight: 1.2 }}>{d.title || 'Start Node'}</div>
          </div>
        </div>
        {d.metadata && d.metadata.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
            {d.metadata.slice(0, 2).map((kv, i) => (
              <span key={i} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 4, padding: '2px 6px', fontSize: 10, color: '#6ee7b7' }}>
                {kv.key}: {kv.value}
              </span>
            ))}
          </div>
        )}
        {d.hasError && d.errorMessage && (
          <div style={{ fontSize: 10, color: '#f87171', marginTop: 4 }}>⚠ {d.errorMessage}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ bottom: -6, background: '#10b981', borderColor: '#10b981' }} />
    </div>
  );
}
