
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { StopCircle, AlertCircle, FileText } from 'lucide-react';

interface EndData {
  endMessage?: string;
  summaryFlag?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export default function EndNode({ data, selected }: NodeProps) {
  const d = data as EndData;
  return (
    <div className="relative" style={{ minWidth: 200 }}>
      {d.hasError && (
        <div className="absolute -top-2 -right-2 z-10">
          <AlertCircle size={16} color="#fbbf24" />
        </div>
      )}
      <div style={{
        background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
        border: `2px solid ${selected ? '#6366f1' : d.hasError ? '#fbbf24' : '#ef4444'}`,
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.3), 0 4px 20px rgba(239,68,68,0.2)' : '0 4px 20px rgba(239,68,68,0.15)',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ background: 'rgba(239,68,68,0.2)', borderRadius: 8, padding: 6 }}>
            <StopCircle size={14} color="#f87171" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: '#fca5a5', letterSpacing: '0.1em', fontWeight: 600 }}>END</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff1f2', lineHeight: 1.2 }}>Workflow Complete</div>
          </div>
        </div>
        {d.endMessage && (
          <div style={{ fontSize: 11, color: '#fca5a5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 4 }}>
            {d.endMessage}
          </div>
        )}
        {d.summaryFlag && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FileText size={10} color="#f87171" />
            <span style={{ fontSize: 10, color: '#fca5a5' }}>Summary report enabled</span>
          </div>
        )}
        {d.hasError && d.errorMessage && (
          <div style={{ fontSize: 10, color: '#fbbf24', marginTop: 4 }}>⚠ {d.errorMessage}</div>
        )}
      </div>
      <Handle type="target" position={Position.Top} style={{ top: -6, background: '#ef4444', borderColor: '#ef4444' }} />
    </div>
  );
}
